import { Link } from 'react-router-dom';

const CATEGORY_ICONS = {
  default: '📦',
  roupas: '👕',
  calcados: '👟',
  eletronicos: '💻',
  acessorios: '⌚',
  esportes: '⚽',
  casa: '🏠',
  beleza: '✨',
  livros: '📚',
  alimentos: '🍎',
};

function getCategoryIcon(categoryName) {
  if (!categoryName) return CATEGORY_ICONS.default;
  const lower = categoryName.toLowerCase();
  for (const [key, icon] of Object.entries(CATEGORY_ICONS)) {
    if (lower.includes(key)) return icon;
  }
  return CATEGORY_ICONS.default;
}

export default function ProdutoCard({ produto }) {
  const icon = getCategoryIcon(produto.categoria_id?.nome);

  return (
    <div className="produto-card">
      <div className="produto-card-image">
        <span className="produto-card-image-placeholder">{icon}</span>
      </div>

      <div className="produto-card-body">
        <div className="produto-card-header">
          <h3>{produto.nome}</h3>
          <p className="preco">R$ {Number(produto.preco).toFixed(2)}</p>
        </div>

        <div className="produto-card-meta">
          {produto.categoria_id && (
            <span className="categoria">{produto.categoria_id.nome}</span>
          )}
          {produto.tags?.map((tag) => (
            <span key={tag._id} className="tag">{tag.nome}</span>
          ))}
        </div>
      </div>

      <div className="card-actions">
        <Link to={`/produtos/${produto._id}`} className="btn btn-primary">
          Ver detalhes →
        </Link>
      </div>
    </div>
  );
}
