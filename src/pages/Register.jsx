import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ nome: '', email: '', senha: '' });
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    setLoading(true);
    try {
      await register(form.nome, form.email, form.senha);
      navigate('/login');
    } catch (err) {
      setErro(err.response?.data?.mensagem ?? 'Erro ao cadastrar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">S</div>
        <h2>Crie sua conta</h2>
        <p className="auth-subtitle">Rápido, gratuito e sem complicações</p>

        {erro && <p className="erro">{erro}</p>}

        <form onSubmit={handleSubmit}>
          <label>Nome completo</label>
          <input
            type="text"
            name="nome"
            value={form.nome}
            onChange={handleChange}
            placeholder="Seu nome completo"
            required
            autoFocus
            autoComplete="name"
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="seu@email.com"
            required
            autoComplete="email"
          />

          <label>Senha</label>
          <input
            type="password"
            name="senha"
            value={form.senha}
            onChange={handleChange}
            placeholder="Mínimo 6 caracteres"
            required
            autoComplete="new-password"
          />

          <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
            {loading ? 'Criando conta...' : 'Criar conta'}
          </button>
        </form>

        <p>Já tem conta? <Link to="/login">Entrar</Link></p>
      </div>
    </div>
  );
}
