import { useEffect, useState } from 'react';
import api from '../api/axios';
import Toast from '../components/Toast';

export default function Perfil() {
  const [perfil, setPerfil] = useState(null);
  const [form, setForm] = useState({ cpf: '', telefone: '', fotoUrl: '' });
  const [existe, setExiste] = useState(false);
  const [toast, setToast] = useState({ mensagem: '', tipo: 'sucesso' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/perfis/me')
      .then((res) => {
        setPerfil(res.data);
        setForm({ cpf: res.data.cpf ?? '', telefone: res.data.telefone ?? '', fotoUrl: res.data.fotoUrl ?? '' });
        setExiste(true);
      })
      .catch((err) => {
        if (err.response?.status !== 404) console.error(err);
      })
      .finally(() => setLoading(false));
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (existe) {
        const res = await api.put('/perfis/me', form);
        setPerfil(res.data);
        setToast({ mensagem: 'Perfil atualizado!', tipo: 'sucesso' });
      } else {
        const res = await api.post('/perfis', form);
        setPerfil(res.data);
        setExiste(true);
        setToast({ mensagem: 'Perfil criado!', tipo: 'sucesso' });
      }
    } catch {
      setToast({ mensagem: 'Erro ao salvar perfil.', tipo: 'erro' });
    }
  }

  if (loading) return (
    <div className="loading">
      <div className="spinner" />
      <span>Carregando perfil...</span>
    </div>
  );

  return (
    <div className="form-page">
      <h1>Meu Perfil</h1>
      <p className="subtitle">Gerencie suas informações pessoais</p>

      {perfil?.fotoUrl && (
        <div className="perfil-header">
          <img src={perfil.fotoUrl} alt="Foto de perfil" className="foto-perfil" />
          <div className="perfil-header-info">
            <p>Foto de perfil</p>
            <p>Atualizada a partir da URL abaixo</p>
          </div>
        </div>
      )}

      <div className="section-card">
        <h2>Informações pessoais</h2>
        <form onSubmit={handleSubmit}>
          <label>CPF</label>
          <input
            type="text"
            name="cpf"
            value={form.cpf}
            onChange={handleChange}
            placeholder="000.000.000-00"
          />

          <label>Telefone</label>
          <input
            type="text"
            name="telefone"
            value={form.telefone}
            onChange={handleChange}
            placeholder="(00) 00000-0000"
          />

          <label>URL da foto de perfil</label>
          <input
            type="text"
            name="fotoUrl"
            value={form.fotoUrl}
            onChange={handleChange}
            placeholder="https://exemplo.com/foto.jpg"
          />

          <button type="submit" className="btn btn-primary">
            {existe ? 'Salvar alterações' : 'Criar perfil'}
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
