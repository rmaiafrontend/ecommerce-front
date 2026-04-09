import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuAberto, setMenuAberto] = useState(false);

  function handleLogout() {
    logout();
    navigate('/login');
    setMenuAberto(false);
  }

  function handleNavClick() {
    setMenuAberto(false);
  }

  function isActive(path) {
    if (path === '/') {
      return location.pathname === '/' ||
        (location.pathname.startsWith('/produtos') && !location.pathname.startsWith('/pedidos'));
    }
    return location.pathname.startsWith(path);
  }

  const initials = user?.nome
    ? user.nome.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  return (
    <nav className="navbar">
      {/* Brand — sempre visível */}
      <div className="navbar-brand">
        <Link to="/" onClick={handleNavClick}>
          <span className="navbar-logo-icon">S</span>
          Store
        </Link>
      </div>

      {/* Links — desktop: inline | mobile: dropdown */}
      <div className={`navbar-links${menuAberto ? ' open' : ''}`}>
        {user ? (
          <>
            <Link to="/" className={isActive('/') ? 'active' : ''} onClick={handleNavClick}>Produtos</Link>
            <Link to="/pedidos" className={isActive('/pedidos') ? 'active' : ''} onClick={handleNavClick}>Pedidos</Link>
            <Link to="/perfil" className={isActive('/perfil') ? 'active' : ''} onClick={handleNavClick}>Perfil</Link>
            <Link to="/admin/categorias" className={isActive('/admin') ? 'active' : ''} onClick={handleNavClick}>Admin</Link>
          </>
        ) : (
          <>
            <Link to="/login" className={isActive('/login') ? 'active' : ''} onClick={handleNavClick}>Entrar</Link>
          </>
        )}
      </div>

      {/* Right side — desktop */}
      <div className="navbar-actions">
        {user ? (
          <>
            <div className="navbar-user-pill">
              <div className="navbar-avatar">{initials}</div>
              <span className="navbar-user-name">{user.nome?.split(' ')[0]}</span>
            </div>
            <button onClick={handleLogout} className="btn-logout">Sair</button>
          </>
        ) : (
          <Link to="/register" className="btn btn-primary btn-sm" onClick={handleNavClick}>
            Cadastrar
          </Link>
        )}
      </div>

      {/* Hamburger — mobile only */}
      <button
        className="navbar-toggle"
        onClick={() => setMenuAberto(!menuAberto)}
        aria-label="Menu"
        aria-expanded={menuAberto}
      >
        {menuAberto ? '✕' : '☰'}
      </button>

      {/* Mobile dropdown */}
      {menuAberto && (
        <div className="navbar-mobile-menu">
          {user ? (
            <>
              <Link to="/" className={isActive('/') ? 'active' : ''} onClick={handleNavClick}>Produtos</Link>
              <Link to="/pedidos" className={isActive('/pedidos') ? 'active' : ''} onClick={handleNavClick}>Pedidos</Link>
              <Link to="/perfil" className={isActive('/perfil') ? 'active' : ''} onClick={handleNavClick}>Perfil</Link>
              <Link to="/admin/categorias" className={isActive('/admin') ? 'active' : ''} onClick={handleNavClick}>Admin</Link>
              <div className="navbar-mobile-divider" />
              <button onClick={handleLogout} className="btn-logout" style={{ textAlign: 'left' }}>Sair</button>
            </>
          ) : (
            <>
              <Link to="/login" className={isActive('/login') ? 'active' : ''} onClick={handleNavClick}>Entrar</Link>
              <Link to="/register" className="btn btn-primary" onClick={handleNavClick}>Cadastrar</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
