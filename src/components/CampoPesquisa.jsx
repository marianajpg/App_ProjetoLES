import React, { useState } from 'react';
import Draggable from 'react-draggable';
import lupa from '../images/image10.png';
import filtroIcone from '../images/filtro.png'; // ícone para o botão de filtros
import '../styles/CampoPesquisa.css'; 

const CampoPesquisa = ({
  termoPesquisa,
  setTermoPesquisa,
  filtros = [], // Array de filtros: { id, titulo, tipo, opcoes }
  valoresFiltro = {},
  setValoresFiltro = () => {},
}) => {
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const toggleFiltros = () => setMostrarFiltros((prev) => !prev);

  const handleFiltroChange = (filtroId, valor) => {
    setValoresFiltro((prev) => ({
      ...prev,
      [filtroId]: valor,
    }));
  };

  const handleCheckboxChange = (filtroId, valor) => {
    const atual = new Set(valoresFiltro[filtroId] || []);
    if (atual.has(valor)) {
      atual.delete(valor);
    } else {
      atual.add(valor);
    }
    handleFiltroChange(filtroId, Array.from(atual));
  };

  return (
    <div className="campo-pesquisa">
      <input
        type="text"
        placeholder="Pesquisar..."
        value={termoPesquisa}
        onChange={(e) => setTermoPesquisa(e.target.value)}
      />
      {filtros.length > 0 && (
      <button className="botao-filtro" onClick={toggleFiltros}>
        <img src={filtroIcone} alt="Filtros" className="icone-filtro" />
      </button>
)}

      <button className="botao-lupa">
        <img src={lupa} alt="Pesquisar" className="lupa" />
      </button>

      {mostrarFiltros && filtros.length > 0 && (
        <Draggable>
        <div className="painel-filtros-popup draggable-box">
          {filtros.map((filtro) => (
            <div key={filtro.id} className="filtro-grupo">
              <strong>{filtro.titulo}</strong>
              {filtro.tipo === 'radio' &&
                filtro.opcoes.map((op) => (
                  <label key={op.id}>
                    <input
                      type="radio"
                      name={filtro.id}
                      value={op.id}
                      checked={valoresFiltro[filtro.id] === op.id}
                      onChange={() => handleFiltroChange(filtro.id, op.id)}
                    />
                    {op.label}
                  </label>
                ))}

              {filtro.tipo === 'checkbox' &&
                filtro.opcoes.map((op) => (
                  <label key={op.id}>
                    <input
                      type="checkbox"
                      value={op.id}
                      checked={(valoresFiltro[filtro.id] || []).includes(op.id)}
                      onChange={() => handleCheckboxChange(filtro.id, op.id)}
                    />
                    {op.label}
                  </label>
                ))}
            </div>
          ))}
        </div></Draggable>
      )}
    </div>
  );
};

export default CampoPesquisa;
