import { useEffect, useRef } from 'react';

export default function Modal({ aberto, onFechar, titulo, children }) {
  const overlayRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    if (aberto) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [aberto]);

  useEffect(() => {
    function handleEsc(e) {
      if (e.key === 'Escape') onFechar();
    }
    if (aberto) {
      document.addEventListener('keydown', handleEsc);
      return () => document.removeEventListener('keydown', handleEsc);
    }
  }, [aberto, onFechar]);

  if (!aberto) return null;

  function handleOverlayClick(e) {
    if (e.target === overlayRef.current) onFechar();
  }

  return (
    <div className="modal-overlay" ref={overlayRef} onClick={handleOverlayClick}>
      <div className="modal-content" ref={contentRef}>
        <div className="modal-header">
          <h2>{titulo}</h2>
          <button className="modal-close" onClick={onFechar} aria-label="Fechar">
            &times;
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
}
