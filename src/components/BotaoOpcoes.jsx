import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const BotaoOpcoes = ({ logout }) => {
  const navigate = useNavigate();

  const handleCartClick = () => {
    navigate('/carrinho');
    window.location.reload();
  };

  return (
    <div className="botao-opcoes">
      {/* Link para a tela de Perfil */}
      <Link to="/perfil">
        <img src="/src/images/img-perfil.png" alt="Perfil" className="icone-perfil" />
      </Link>

      {/* Botão para a tela do Carrinho */}
      <button onClick={handleCartClick} className="nav-button">
        <img src="/src/images/img-sacola.png" alt="Carrinho" className="icone-sacola" />
      </button>
    </div>
  );
};

export default BotaoOpcoes;
