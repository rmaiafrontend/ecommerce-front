import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', senha: '' });
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
      await login(form.email, form.senha);
      navigate('/');
    } catch {
      setErro('Email ou senha inválidos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">S</div>
        <h2>Bem-vindo de volta</h2>
        <p className="auth-subtitle">Entre com sua conta para continuar</p>

        {erro && <p className="erro">{erro}</p>}

        <form onSubmit={handleSubmit}>
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
            placeholder="••••••••"
            required
            autoComplete="current-password"
          />

          <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p>Não tem conta? <Link to="/register">Cadastre-se grátis</Link></p>
      </div>
    </div>
  );
}
