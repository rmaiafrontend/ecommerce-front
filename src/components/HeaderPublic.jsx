import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function HeaderPublic() {
  const location = useLocation();
  const [menuAberto, setMenuAberto] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 12);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Fecha menu ao navegar
  useEffect(() => {
    setMenuAberto(false);
  }, [location.pathname]);

  function isActive(path) {
    return location.pathname === path;
  }

  return (
    <header className={`pub-header${scrolled ? ' pub-header--scrolled' : ''}`}>
      <div className="pub-header__inner">

        {/* Logo */}
        <Link to="/" className="pub-header__logo">
          <span className="pub-header__logo-mark">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M9 1L16.5 5.25V12.75L9 17L1.5 12.75V5.25L9 1Z" fill="currentColor" opacity="0.15"/>
              <path d="M9 1L16.5 5.25V12.75L9 17L1.5 12.75V5.25L9 1Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
              <path d="M9 6L11.5 7.5V10.5L9 12L6.5 10.5V7.5L9 6Z" fill="currentColor"/>
            </svg>
          </span>
          <span className="pub-header__logo-name">Store</span>
        </Link>

        {/* Nav central — desktop */}
        <nav className="pub-header__nav" aria-label="Navegação principal">
          <Link to="/" className={`pub-header__nav-link${isActive('/') ? ' pub-header__nav-link--active' : ''}`}>
            Produtos
          </Link>
          <a href="#sobre" className="pub-header__nav-link">Sobre</a>
          <a href="#contato" className="pub-header__nav-link">Contato</a>
        </nav>

        {/* Ações — desktop */}
        <div className="pub-header__actions">
          <Link to="/login" className="pub-header__btn-ghost">
            Entrar
          </Link>
          <Link to="/register" className="pub-header__btn-cta">
            Criar conta
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M2.5 7H11.5M7.5 3L11.5 7L7.5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>

        {/* Hamburguer — mobile */}
        <button
          className={`pub-header__burger${menuAberto ? ' pub-header__burger--open' : ''}`}
          onClick={() => setMenuAberto(!menuAberto)}
          aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={menuAberto}
          aria-controls="pub-mobile-menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile menu */}
      {menuAberto && (
        <div className="pub-header__mobile" id="pub-mobile-menu" role="dialog" aria-label="Menu mobile">
          <nav className="pub-header__mobile-nav">
            <Link to="/" className={`pub-header__mobile-link${isActive('/') ? ' pub-header__mobile-link--active' : ''}`}>
              Produtos
            </Link>
            <a href="#sobre" className="pub-header__mobile-link">Sobre</a>
            <a href="#contato" className="pub-header__mobile-link">Contato</a>
          </nav>
          <div className="pub-header__mobile-footer">
            <Link to="/login" className="pub-header__mobile-ghost">Entrar</Link>
            <Link to="/register" className="pub-header__mobile-cta">Criar conta</Link>
          </div>
        </div>
      )}
    </header>
  );
}
