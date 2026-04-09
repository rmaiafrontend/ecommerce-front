import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../../api/axios';
import ConfirmDialog from '../../components/ConfirmDialog';
import Toast from '../../components/Toast';

export default function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [nome, setNome] = useState('');
  const [busca, setBusca] = useState('');
  const [editando, setEditando] = useState(null);
  const [nomeEdicao, setNomeEdicao] = useState('');
  const [toast, setToast] = useState({ mensagem: '', tipo: 'sucesso' });
  const [confirmExcluir, setConfirmExcluir] = useState(null);
  const [criando, setCriando] = useState(false);
  const location = useLocation();

  async function carregar() {
    const res = await api.get('/categorias');
    setCategorias(res.data);
  }

  useEffect(() => { carregar(); }, []);

  async function handleCriar(e) {
    e.preventDefault();
    await api.post('/categorias', { nome });
    setNome('');
    setCriando(false);
    setToast({ mensagem: 'Categoria criada!', tipo: 'sucesso' });
    carregar();
  }

  async function handleEditar(e) {
    e.preventDefault();
    await api.put(`/categorias/${editando}`, { nome: nomeEdicao });
    setEditando(null);
    setToast({ mensagem: 'Categoria atualizada!', tipo: 'sucesso' });
    carregar();
  }

  async function handleExcluir() {
    await api.delete(`/categorias/${confirmExcluir}`);
    setConfirmExcluir(null);
    setToast({ mensagem: 'Categoria removida!', tipo: 'sucesso' });
    carregar();
  }

  const filtradas = categorias.filter(cat =>
    cat.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="adm">
      {/* Tabs */}
      <div className="adm-tabs">
        <Link
          to="/admin/categorias"
          className={`adm-tab${location.pathname === '/admin/categorias' ? ' adm-tab--active' : ''}`}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><rect x="9" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><rect x="1" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><rect x="9" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/></svg>
          Categorias
        </Link>
        <Link
          to="/admin/tags"
          className={`adm-tab${location.pathname === '/admin/tags' ? ' adm-tab--active' : ''}`}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1.5 8.5V2.5C1.5 1.95 1.95 1.5 2.5 1.5H8.5L14.5 7.5L8.5 13.5L1.5 8.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/><circle cx="5" cy="5" r="1" fill="currentColor"/></svg>
          Tags
        </Link>
      </div>

      {/* Header */}
      <div className="adm-header">
        <div className="adm-header__left">
          <div className="adm-header__icon">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <rect x="2" y="2" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.6"/>
              <rect x="12" y="2" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.6"/>
              <rect x="2" y="12" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.6"/>
              <rect x="12" y="12" width="8" height="8" rx="2" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1.6" rx="2"/>
            </svg>
          </div>
          <div>
            <h1 className="adm-header__title">Categorias</h1>
            <p className="adm-header__count">
              {categorias.length} {categorias.length === 1 ? 'categoria' : 'categorias'}
            </p>
          </div>
        </div>

        <button
          className="adm-header__add"
          onClick={() => { setCriando(!criando); setNome(''); }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
          </svg>
          Nova categoria
        </button>
      </div>

      {/* Criar */}
      {criando && (
        <form onSubmit={handleCriar} className="adm-create">
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Nome da categoria"
            required
            autoFocus
          />
          <div className="adm-create__actions">
            <button type="submit" className="btn btn-primary btn-sm">Criar</button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setCriando(false)}>Cancelar</button>
          </div>
        </form>
      )}

      {/* Busca */}
      {categorias.length > 0 && (
        <div className="adm-search">
          <svg className="adm-search__icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.4"/>
            <path d="M11 11L14 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar categorias..."
          />
        </div>
      )}

      {/* Lista */}
      {filtradas.length === 0 && categorias.length === 0 ? (
        <div className="adm-empty">
          <div className="adm-empty__icon">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <rect x="4" y="4" width="14" height="14" rx="3" stroke="currentColor" strokeWidth="1.6" opacity="0.3"/>
              <rect x="22" y="4" width="14" height="14" rx="3" stroke="currentColor" strokeWidth="1.6" opacity="0.3"/>
              <rect x="4" y="22" width="14" height="14" rx="3" stroke="currentColor" strokeWidth="1.6" opacity="0.3"/>
              <rect x="22" y="22" width="14" height="14" rx="3" stroke="currentColor" strokeWidth="1.6"/>
              <path d="M29 26V32M26 29H32" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
          </div>
          <h3>Nenhuma categoria</h3>
          <p>Crie categorias para organizar seus produtos.</p>
          <button className="btn btn-primary btn-sm" onClick={() => setCriando(true)}>
            Criar primeira categoria
          </button>
        </div>
      ) : filtradas.length === 0 ? (
        <div className="adm-empty">
          <p>Nenhuma categoria encontrada para "{busca}"</p>
        </div>
      ) : (
        <ul className="adm-list">
          {filtradas.map((cat, i) => (
            <li key={cat._id} className="adm-item">
              {editando === cat._id ? (
                <form onSubmit={handleEditar} className="adm-item__edit">
                  <input
                    type="text"
                    value={nomeEdicao}
                    onChange={(e) => setNomeEdicao(e.target.value)}
                    required
                    autoFocus
                  />
                  <button type="submit" className="btn btn-primary btn-sm">Salvar</button>
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => setEditando(null)}>
                    Cancelar
                  </button>
                </form>
              ) : (
                <>
                  <div className="adm-item__left">
                    <span className="adm-item__index">{String(i + 1).padStart(2, '0')}</span>
                    <span className="adm-item__name">{cat.nome}</span>
                  </div>
                  <div className="adm-item__actions">
                    <button
                      className="adm-item__btn"
                      onClick={() => { setEditando(cat._id); setNomeEdicao(cat.nome); }}
                      aria-label="Editar"
                    >
                      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                        <path d="M10.5 2.5L12.5 4.5M2 13L2.5 10.5L11 2L13 4L4.5 12.5L2 13Z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <button
                      className="adm-item__btn adm-item__btn--danger"
                      onClick={() => setConfirmExcluir(cat._id)}
                      aria-label="Excluir"
                    >
                      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                        <path d="M3 4H12L11.2 13H3.8L3 4Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
                        <path d="M5.5 6.5V10.5M9.5 6.5V10.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                        <path d="M2 4H13M6 4V2.5H9V4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        aberto={confirmExcluir !== null}
        onFechar={() => setConfirmExcluir(null)}
        onConfirmar={handleExcluir}
        titulo="Excluir categoria"
        mensagem="Tem certeza que deseja excluir esta categoria? Produtos associados podem ser afetados."
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
