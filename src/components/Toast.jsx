import { useEffect } from 'react';

export default function Toast({ mensagem, tipo = 'sucesso', onFechar, duracao = 3500 }) {
  useEffect(() => {
    if (!mensagem) return;
    const timer = setTimeout(onFechar, duracao);
    return () => clearTimeout(timer);
  }, [mensagem, onFechar, duracao]);

  if (!mensagem) return null;

  return (
    <div className={`toast toast-${tipo}`}>
      <span>{mensagem}</span>
      <button className="toast-close" onClick={onFechar}>&times;</button>
    </div>
  );
}
