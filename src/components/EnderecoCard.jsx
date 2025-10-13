
import React from 'react';
import '../styles/EnderecoCard.css';
import lapis from  '../images/image8.png';
import lixeira from  '../images/image9.png';

const EnderecoCard = ({ endereco, onEdit, onDelete }) => {
  if (!endereco) {
    return null;
  }

  const { street, number, neighborhood, city, state, zipCode, type } = endereco;

  return (
    <div className="endereco-card">
      <div className="endereco-card-body">
        <p><strong>{street}, {number}</strong></p>
        <p>{neighborhood}, {city} - {state}</p>
        <p>CEP: {zipCode}</p>
      </div>
      <div className="endereco-card-actions">
        <button onClick={() => onEdit(endereco.id)} className="card-button edit-button">
          <img src= {lapis}/>
        </button>
        {type !== 'BILLING' && (
          <button onClick={() => onDelete(endereco.id)} className="card-button delete-button">
            <img src= {lixeira}/>
          </button>
        )}
      </div>
    </div>
  );
};

export default EnderecoCard;
