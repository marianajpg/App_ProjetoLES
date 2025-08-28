import React from 'react';
import Nav from './Nav';
import { Link } from 'react-router-dom';
import BotaoLogin from '../components/BotaoLogin.jsx';
import BotaoOpcoes from '../components/BotaoOpcoes.jsx';
import BotaoProfile from '../components/BotaoProfile.jsx';
import { useAuth } from '../context/AuthLogin.jsx';

const Header = () => {
  const { user, logout } = useAuth();

  // Define o botão com base no estado de autenticação e no tipo de usuário
  const BotaoComponent = user
    ? user.tipoUsuario === 'colaborador'
      ? BotaoProfile
      : BotaoOpcoes
    : BotaoLogin;

  return (
    <header className="header">
      <h1><Link to="/">MARTHE</Link></h1>
      <Nav BotaoComponent={BotaoComponent} user={user} logout={logout} />
    </header>
  );
};

export default Header;