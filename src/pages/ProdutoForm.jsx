import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import Toast from '../components/Toast';

export default function ProdutoForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdicao = Boolean(id);

  const [form, setForm] = useState({ nome: '', preco: '', categoria_id: '', tagIds: [] });
  const [categorias, setCategorias] = useState([]);
  const [tags, setTags] = useState([]);
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const [carregando, setCarregando] = useState(isEdicao);
  const [toast, setToast] = useState({ mensagem: '', tipo: 'sucesso' });

  useEffect(() => {
    async function carregar() {
      const [resCat, resTags] = await Promise.all([
        api.get('/categorias'),
        api.get('/tags'),
      ]);
      setCategorias(resCat.data);
      setTags(resTags.data);

      if (isEdicao) {
        const res = await api.get(`/produtos/${id}`);
        const p = res.data;
        setForm({
          nome: p.nome,
          preco: p.preco,
          categoria_id: p.categoria_id?._id ?? '',
          tagIds: p.tags?.map((t) => t._id) ?? [],
        });
        setCarregando(false);
      }
    }
    carregar();
  }, [id, isEdicao]);

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

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    setLoading(true);
    try {
      const payload = { ...form, preco: Number(form.preco) };
      if (isEdicao) {
        await api.put(`/produtos/${id}`, payload);
        setToast({ mensagem: 'Produto atualizado!', tipo: 'sucesso' });
        setTimeout(() => navigate(`/produtos/${id}`), 1000);
      } else {
        await api.post('/produtos', payload);
        navigate('/');
      }
    } catch (err) {
      setErro(err.response?.data?.mensagem ?? 'Erro ao salvar produto.');
    } finally {
      setLoading(false);
    }
  }

  if (carregando) return (
    <div className="loading">
      <div className="spinner" />
      <span>Carregando produto...</span>
    </div>
  );

  return (
    <div className="form-page">
      <Link to={isEdicao ? `/produtos/${id}` : '/'} className="back-link">
        ← {isEdicao ? 'Voltar ao produto' : 'Produtos'}
      </Link>

      <h1 style={{ marginTop: '20px' }}>
        {isEdicao ? 'Editar produto' : 'Novo produto'}
      </h1>
      <p className="subtitle">
        {isEdicao ? 'Atualize as informações do produto' : 'Preencha os dados do novo produto'}
      </p>

      {erro && <p className="erro">{erro}</p>}

      <div className="section-card">
        <form onSubmit={handleSubmit}>
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

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Salvando...' : isEdicao ? 'Salvar alterações' : 'Criar produto'}
          </button>
        </form>
      </div>

      <Toast
        mensagem={toast.mensagem}
        tipo={toast.tipo}
        onFechar={() => setToast({ mensagem: '', tipo: 'sucesso' })}
      />
    </div>
  );
}
