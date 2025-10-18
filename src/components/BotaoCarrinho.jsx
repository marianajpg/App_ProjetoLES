import React from 'react';
import { useNavigate } from 'react-router-dom';


const BotaoCarrinho = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/carrinho');
    window.location.reload();
  };

  return (
    <button onClick={handleClick} className="nav-button">
      <img src="/src/images/img-sacola.png" alt="Carrinho" className="nav-icon" />
    </button>
  );
};

export default BotaoCarrinho;
