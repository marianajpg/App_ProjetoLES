import React from 'react';
import { Link } from 'react-router-dom';

const Nav = ({ user, BotaoComponent, logout }) => (
  <nav className="nav">
    <ul>
      {/* Links comuns para todos os usuários */}
      <li><Link to="/ia-recomenda">IA RECOMENDA</Link></li>

      {/* Links para clientes ou usuários não logados */}
      {user?.tipoUsuario !== 'colaborador' && (
        <li><Link to="/livros">LIVROS</Link></li>
      )}

      {/* Links específicos para colaboradores */}
      {user?.tipoUsuario === 'colaborador' && (
        <>
          <li><Link to="/consultar-cliente">CLIENTES</Link></li>
          <li><Link to="/colaborador/dashboard">RELATÓRIOS</Link></li>
          <li><Link to="/consultar-pedidos">PEDIDOS</Link></li>
          {/* O link de Livros para colaborador pode ser diferente */}
          <li><Link to="/consultar-livros">LIVROS</Link></li>
        </>
      )}

      {/* Botão dinâmico (BotaoLogin, BotaoOpcoes ou BotaoProfile) */}
      {BotaoComponent && <BotaoComponent logout={logout} />}
    </ul>
  </nav>
);

export default Nav;
