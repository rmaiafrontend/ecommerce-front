import { Link } from 'react-router-dom';

const STATUS_LABELS = {
  pendente: 'Pendente',
  enviado: 'Enviado',
  entregue: 'Entregue',
  cancelado: 'Cancelado',
};

const STATUS_ICONS = {
  pendente: '⏳',
  enviado: '🚚',
  entregue: '✅',
  cancelado: '✕',
};

export default function PedidoCard({ pedido }) {
  const total = pedido.itens?.reduce(
    (acc, item) => acc + item.preco * item.quantidade,
    0
  ) ?? 0;

  const itemCount = pedido.itens?.length ?? 0;

  return (
    <Link to={`/pedidos/${pedido._id}`} className="pedido-card" style={{ textDecoration: 'none' }}>
      <div className="pedido-card-left">
        <div className="pedido-card-icon">
          {STATUS_ICONS[pedido.status] ?? '📦'}
        </div>
        <div className="pedido-card-info">
          <span className="pedido-card-id">
            #{pedido._id.slice(-8).toUpperCase()}
          </span>
          <span className="pedido-card-meta">
            {itemCount} {itemCount === 1 ? 'item' : 'itens'}
          </span>
        </div>
      </div>

      <div className="pedido-card-right">
        <span className={`status status-${pedido.status}`}>
          {STATUS_LABELS[pedido.status] ?? pedido.status}
        </span>
        <span className="pedido-total-value">
          R$ {total.toFixed(2)}
        </span>
        <span className="pedido-arrow">→</span>
      </div>
    </Link>
  );
}
