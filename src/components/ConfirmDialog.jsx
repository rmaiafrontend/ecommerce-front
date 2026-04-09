import Modal from './Modal';

export default function ConfirmDialog({ aberto, onFechar, onConfirmar, titulo, mensagem, labelConfirmar = 'Confirmar', variante = 'danger' }) {
  return (
    <Modal aberto={aberto} onFechar={onFechar} titulo={titulo}>
      <div className="confirm-dialog-icon">🗑</div>
      <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: '0 0 24px', lineHeight: 1.6 }}>
        {mensagem}
      </p>
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
        <button className="btn btn-ghost" onClick={onFechar}>Cancelar</button>
        <button className={`btn btn-${variante}`} onClick={onConfirmar}>{labelConfirmar}</button>
      </div>
    </Modal>
  );
}
