import { useEffect, useState, useCallback } from 'react';
import api from '../api/axios';
import ProdutoCard from '../components/ProdutoCard';
import Modal from '../components/Modal';
import Toast from '../components/Toast';

export default function Home() {
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [tags, setTags] = useState([]);
  const [categoriaFiltro, setCategoriaFiltro] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [form, setForm] = useState({ nome: '', preco: '', categoria_id: '', tagIds: [] });
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');
  const [toast, setToast] = useState({ mensagem: '', tipo: 'sucesso' });

  const carregar = useCallback(async () => {
    try {
      const [resProdutos, resCategorias, resTags] = await Promise.all([
        api.get('/produtos'),
        api.get('/categorias'),
        api.get('/tags'),
      ]);
      setProdutos(resProdutos.data);
      setCategorias(resCategorias.data);
      setTags(resTags.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  const produtosFiltrados = categoriaFiltro
    ? produtos.filter((p) => p.categoria_id?._id === categoriaFiltro)
    : produtos;

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

  function abrirModal() {
    setForm({ nome: '', preco: '', categoria_id: '', tagIds: [] });
    setErro('');
    setModalAberto(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    setSalvando(true);
    try {
      const payload = { ...form, preco: Number(form.preco) };
      await api.post('/produtos', payload);
      setModalAberto(false);
      setToast({ mensagem: 'Produto criado com sucesso!', tipo: 'sucesso' });
      carregar();
    } catch (err) {
      setErro(err.response?.data?.mensagem ?? 'Erro ao criar produto.');
    } finally {
      setSalvando(false);
    }
  }

  const categoriaSelecionada = categorias.find((c) => c._id === categoriaFiltro);

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1>Produtos</h1>
          {!loading && (
            <p>
              {produtosFiltrados.length}{' '}
              {produtosFiltrados.length === 1 ? 'produto' : 'produtos'}
              {categoriaSelecionada ? ` em "${categoriaSelecionada.nome}"` : ''}
            </p>
          )}
        </div>
        <button className="btn btn-primary" onClick={abrirModal}>
          + Novo produto
        </button>
      </div>

      <div className="filtros">
        <select
          value={categoriaFiltro}
          onChange={(e) => setCategoriaFiltro(e.target.value)}
        >
          <option value="">Todas as categorias</option>
          {categorias.map((cat) => (
            <option key={cat._id} value={cat._id}>{cat.nome}</option>
          ))}
        </select>
        {categoriaFiltro && (
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setCategoriaFiltro('')}
          >
            ✕ Limpar
          </button>
        )}
      </div>

      {loading ? (
        <div className="loading">
          <div className="spinner" />
          <span>Carregando produtos...</span>
        </div>
      ) : produtosFiltrados.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📦</div>
          <h3>Nenhum produto encontrado</h3>
          <p>
            {categoriaFiltro
              ? 'Tente remover o filtro ou adicionar produtos nesta categoria.'
              : 'Comece adicionando o primeiro produto à sua loja.'}
          </p>
          {!categoriaFiltro && (
            <button className="btn btn-primary" onClick={abrirModal}>
              + Adicionar produto
            </button>
          )}
        </div>
      ) : (
        <div className="produtos-grid">
          {produtosFiltrados.map((p) => (
            <ProdutoCard key={p._id} produto={p} />
          ))}
        </div>
      )}

      <Modal aberto={modalAberto} onFechar={() => setModalAberto(false)} titulo="Novo produto">
        {erro && <p className="erro">{erro}</p>}
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

          <button type="submit" className="btn btn-primary" disabled={salvando}>
            {salvando ? 'Criando...' : 'Criar produto'}
          </button>
        </form>
      </Modal>

      <Toast
        mensagem={toast.mensagem}
        tipo={toast.tipo}
        onFechar={() => setToast({ mensagem: '', tipo: 'sucesso' })}
      />
    </div>
  );
}
