import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import Toast from '../components/Toast';

const STATUS_OPTIONS = ['pendente', 'enviado', 'entregue', 'cancelado'];

const STATUS_LABELS = {
  pendente: 'Pendente',
  enviado: 'Enviado',
  entregue: 'Entregue',
  cancelado: 'Cancelado',
};

export default function PedidoDetalhe() {
  const { id } = useParams();
  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(true);
  const [novoStatus, setNovoStatus] = useState('');
  const [toast, setToast] = useState({ mensagem: '', tipo: 'sucesso' });

  useEffect(() => {
    api.get(`/pedidos/${id}`)
      .then((res) => {
        setPedido(res.data);
        setNovoStatus(res.data.status);
      })
      .finally(() => setLoading(false));
  }, [id]);

  async function handleAtualizarStatus(e) {
    e.preventDefault();
    try {
      const res = await api.put(`/pedidos/${id}`, { status: novoStatus });
      setPedido(res.data);
      setToast({ mensagem: 'Status atualizado com sucesso!', tipo: 'sucesso' });
    } catch {
      setToast({ mensagem: 'Erro ao atualizar status.', tipo: 'erro' });
    }
  }

  if (loading) return (
    <div className="loading">
      <div className="spinner" />
      <span>Carregando pedido...</span>
    </div>
  );

  if (!pedido) return (
    <div className="empty-state">
      <div className="empty-state-icon">🔍</div>
      <h3>Pedido não encontrado</h3>
      <p>O pedido que você procura não existe ou foi removido.</p>
      <Link to="/pedidos" className="btn btn-primary">← Voltar para pedidos</Link>
    </div>
  );

  const total = pedido.itens?.reduce((acc, item) => acc + item.preco * item.quantidade, 0) ?? 0;

  return (
    <div className="pedido-detalhe">
      <Link to="/pedidos" className="back-link">← Pedidos</Link>

      <h1>Pedido #{pedido._id.slice(-8).toUpperCase()}</h1>

      <div className="pedido-detalhe-meta">
        <span className={`status status-${pedido.status}`}>
          {STATUS_LABELS[pedido.status] ?? pedido.status}
        </span>
        <span style={{ color: 'var(--text-muted)', fontSize: '13.5px' }}>
          {pedido.itens?.length ?? 0} {pedido.itens?.length === 1 ? 'item' : 'itens'}
        </span>
      </div>

      <div className="tabela-wrapper">
        <table className="tabela">
          <thead>
            <tr>
              <th>Produto</th>
              <th>Qtd</th>
              <th>Preço unit.</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {pedido.itens?.map((item) => (
              <tr key={item._id}>
                <td style={{ fontWeight: 500 }}>{item.produto?.nome ?? 'Produto'}</td>
                <td style={{ color: 'var(--text-secondary)' }}>{item.quantidade}</td>
                <td style={{ color: 'var(--text-secondary)' }}>R$ {Number(item.preco).toFixed(2)}</td>
                <td style={{ fontWeight: 700 }}>R$ {(item.preco * item.quantidade).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3} style={{ fontWeight: 600, color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Total do pedido
              </td>
              <td style={{ fontWeight: 800, fontSize: '18px', color: 'var(--brand)' }}>
                R$ {total.toFixed(2)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <form onSubmit={handleAtualizarStatus} className="status-form">
        <label>Atualizar status</label>
        <select value={novoStatus} onChange={(e) => setNovoStatus(e.target.value)}>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{STATUS_LABELS[s]}</option>
          ))}
        </select>
        <button type="submit" className="btn btn-primary btn-sm">
          Salvar
        </button>
      </form>

      <Toast
        mensagem={toast.mensagem}
        tipo={toast.tipo}
        onFechar={() => setToast({ mensagem: '', tipo: 'sucesso' })}
      />
    </div>
  );
}
