import React from 'react';
import { Link } from 'react-router-dom';

const InfoSection = () => (
  <footer className="info-section">
    <h2>MARTHE</h2>
    <ul>
      <li><Link to="/">Home</Link></li>
      <li><Link to="/novidades">Camisetas</Link></li>
      <li><Link to="/novidades">Novidade</Link></li>
      <li><Link to="/ia-recomenda">IA Recomenda</Link></li>
    </ul>
  </footer>
);

export default InfoSection;