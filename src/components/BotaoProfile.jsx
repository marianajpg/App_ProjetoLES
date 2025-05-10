import React from 'react';
import { Link } from 'react-router-dom';

const BotaoProfile = ({ logout }) => (
  <li>
    <button id="buttom-login" onClick={logout}>SAIR</button>
  </li>
);

export default BotaoProfile;