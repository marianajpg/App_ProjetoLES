import React from 'react';
import '../styles/LivroModal.css';

const GenericModal = ({ title, children, onClose, onSave }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{title}</h2>
        {children}
        <div className="modal-actions">
          <button onClick={onClose}>Cancelar</button>
          <button onClick={onSave}>Salvar</button>
        </div>
      </div>
    </div>
  );
};

export default GenericModal;
