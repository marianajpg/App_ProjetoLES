import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProdutoCard = ({
  id, // O ID já está sendo recebido como prop
  capaUrl,
  titulo,
  autor,
  preco,
  estoque,
  imagens,
  editora,
  extra,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/tela-produto/${id}`);
  };

  const precoNumerico = Number(preco);

  return (
    <div className="card" onClick={handleClick}>
      <img src={capaUrl} alt={titulo} className="card-image" />
      <h3 className="card-nome">{titulo}</h3>
      <p className="card-preco">
        {isNaN(precoNumerico) ? 'Preço indisponível' : `R$${precoNumerico.toFixed(2)}`}
      </p>
      <p className="card-autor">{autor}</p>
      {extra && <div className="card-extra">{extra}</div>}
    </div>
  );
};

export default ProdutoCard;