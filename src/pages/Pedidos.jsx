import { useEffect, useState } from 'react';
import api from '../api/axios';
import PedidoCard from '../components/PedidoCard';

export default function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/pedidos')
      .then((res) => setPedidos(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1>Meus Pedidos</h1>
          {!loading && pedidos.length > 0 && (
            <p>{pedidos.length} {pedidos.length === 1 ? 'pedido' : 'pedidos'} no total</p>
          )}
        </div>
      </div>

      {loading ? (
        <div className="loading">
          <div className="spinner" />
          <span>Carregando pedidos...</span>
        </div>
      ) : pedidos.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🛒</div>
          <h3>Nenhum pedido ainda</h3>
          <p>Seus pedidos aparecerão aqui após a primeira compra.</p>
        </div>
      ) : (
        <div className="pedidos-lista">
          {pedidos.map((p) => (
            <PedidoCard key={p._id} pedido={p} />
          ))}
        </div>
      )}
    </div>
  );
}
