import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import ConfirmDialog from '../components/ConfirmDialog';
import Modal from '../components/Modal';
import Toast from '../components/Toast';

export default function Produto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [produto, setProduto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkout, setCheckout] = useState(false);
  const [quantidade, setQuantidade] = useState(1);
  const [confirmExcluir, setConfirmExcluir] = useState(false);
  const [toast, setToast] = useState({ mensagem: '', tipo: 'sucesso' });

  // Edição
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({ nome: '', preco: '', categoria_id: '', tagIds: [] });
  const [categorias, setCategorias] = useState([]);
  const [tags, setTags] = useState([]);
  const [salvando, setSalvando] = useState(false);
  const [erroEdit, setErroEdit] = useState('');

  function carregarProduto() {
    setLoading(true);
    api.get(`/produtos/${id}`)
      .then((res) => setProduto(res.data))
      .finally(() => setLoading(false));
  }

  useEffect(() => { carregarProduto(); }, [id]);

  async function abrirEdicao() {
    const [resCat, resTags] = await Promise.all([
      api.get('/categorias'),
      api.get('/tags'),
    ]);
    setCategorias(resCat.data);
    setTags(resTags.data);
    setForm({
      nome: produto.nome,
      preco: produto.preco,
      categoria_id: produto.categoria_id?._id ?? '',
      tagIds: produto.tags?.map((t) => t._id) ?? [],
    });
    setErroEdit('');
    setEditando(true);
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleTagToggle(tagId) {
    setForm((prev) => ({
      ...prev,
      tagIds: prev.tagIds.includes(tagId)
        ? prev.tagIds.filter((t) => t !== tagId)
        : [...prev.tagIds, tagId],
    }));
  }

  async function handleSalvar(e) {
    e.preventDefault();
    setErroEdit('');
    setSalvando(true);
    try {
      const payload = { ...form, preco: Number(form.preco) };
      await api.put(`/produtos/${id}`, payload);
      setEditando(false);
      setToast({ mensagem: 'Produto atualizado!', tipo: 'sucesso' });
      carregarProduto();
    } catch (err) {
      setErroEdit(err.response?.data?.mensagem ?? 'Erro ao salvar produto.');
    } finally {
      setSalvando(false);
    }
  }

  async function handleExcluir() {
    setConfirmExcluir(false);
    await api.delete(`/produtos/${id}`);
    navigate('/');
  }

  async function handleComprar(e) {
    e.preventDefault();
    try {
      await api.post('/pedidos', {
        itens: [{ produtoId: produto._id, quantidade, preco: produto.preco }],
        status: 'pendente',
      });
      setToast({ mensagem: 'Pedido criado com sucesso!', tipo: 'sucesso' });
      setCheckout(false);
      setQuantidade(1);
    } catch {
      setToast({ mensagem: 'Erro ao criar pedido.', tipo: 'erro' });
    }
  }

  if (loading) return (
    <div className="loading">
      <div className="spinner" />
      <span>Carregando produto...</span>
    </div>
  );

  if (!produto) return (
    <div className="empty-state">
      <div className="empty-state-icon">🔍</div>
      <h3>Produto não encontrado</h3>
      <p>O produto que você procura não existe ou foi removido.</p>
      <Link to="/" className="btn btn-primary">← Voltar para produtos</Link>
    </div>
  );

  return (
    <div className="produto-detalhe">
      <Link to="/" className="back-link">← Produtos</Link>

      <div className="produto-detalhe-header">
        <h1>{produto.nome}</h1>
        <span className="preco">R$ {Number(produto.preco).toFixed(2)}</span>
      </div>

      <div className="produto-meta">
        {produto.categoria_id && (
          <span className="categoria">{produto.categoria_id.nome}</span>
        )}
        {produto.tags?.map((tag) => (
          <span key={tag._id} className="tag">{tag.nome}</span>
        ))}
      </div>

      <div className="produto-actions">
        <button
          className={`btn ${checkout ? 'btn-secondary' : 'btn-primary'}`}
          onClick={() => { setCheckout(!checkout); }}
        >
          {checkout ? '✕ Cancelar' : '🛒 Comprar agora'}
        </button>
        <button className="btn btn-secondary" onClick={abrirEdicao}>
          ✏️ Editar
        </button>
        <button className="btn btn-danger" onClick={() => setConfirmExcluir(true)}>
          🗑 Excluir
        </button>
      </div>

      {checkout && (
        <form className="checkout-card" onSubmit={handleComprar}>
          <h3>Finalizar compra</h3>

          <label>Quantidade</label>
          <input
            type="number"
            min="1"
            value={quantidade}
            onChange={(e) => setQuantidade(Number(e.target.value))}
            autoFocus
          />

          <div className="checkout-total" style={{ marginTop: '16px' }}>
            <span className="checkout-total-label">Total</span>
            <span className="checkout-total-value">
              R$ {(Number(produto.preco) * quantidade).toFixed(2)}
            </span>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            Confirmar pedido
          </button>
        </form>
      )}

      {/* Modal de edição */}
      <Modal aberto={editando} onFechar={() => setEditando(false)} titulo="Editar produto">
        {erroEdit && <p className="erro">{erroEdit}</p>}

        <form onSubmit={handleSalvar}>
          <label>Nome do produto</label>
          <input
            type="text"
            name="nome"
            value={form.nome}
            onChange={handleChange}
            placeholder="Ex: Tênis Nike Air Max"
            required
            autoFocus
          />

          <label>Preço (R$)</label>
          <input
            type="number"
            name="preco"
            value={form.preco}
            onChange={handleChange}
            min="0"
            step="0.01"
            placeholder="0,00"
            required
          />

          <label>Categoria</label>
          <select name="categoria_id" value={form.categoria_id} onChange={handleChange}>
            <option value="">Selecione uma categoria</option>
            {categorias.map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.nome}</option>
            ))}
          </select>

          {tags.length > 0 && (
            <>
              <label>Tags</label>
              <div className="tags-checkboxes">
                {tags.map((tag) => (
                  <label key={tag._id} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={form.tagIds.includes(tag._id)}
                      onChange={() => handleTagToggle(tag._id)}
                    />
                    {tag.nome}
                  </label>
                ))}
              </div>
            </>
          )}

          <div className="modal-form-actions">
            <button type="button" className="btn btn-ghost" onClick={() => setEditando(false)}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={salvando}>
              {salvando ? 'Salvando...' : 'Salvar alterações'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        aberto={confirmExcluir}
        onFechar={() => setConfirmExcluir(false)}
        onConfirmar={handleExcluir}
        titulo="Excluir produto"
        mensagem={`Tem certeza que deseja excluir "${produto.nome}"? Esta ação não pode ser desfeita.`}
        labelConfirmar="Excluir"
      />

      <Toast
        mensagem={toast.mensagem}
        tipo={toast.tipo}
        onFechar={() => setToast({ mensagem: '', tipo: 'sucesso' })}
      />
    </div>
  );
}
