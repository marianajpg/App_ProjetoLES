import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/InfoSection.css';

const InfoSection = () => (
  <footer className="footer-container">
    <div className="footer-content">
      <div className="footer-section">
        <h2 className="footer-title">MARTHE</h2>
        <p>Sua loja de livros online.</p>
      </div>
      <div className="footer-section">
        <h3 className="footer-title">Navegação</h3>
        <ul className="footer-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/livros">Livros</Link></li>
          <li><Link to="/ia-recomenda">IA Recomenda</Link></li>
        </ul>
      </div>
      <div className="footer-section">
        <h3 className="footer-title">Contato</h3>
        <ul className="footer-links">
          <li><a href="#">Email: contato@marthe.com</a></li>
          <li><a href="#">Telefone: (11) 99999-9999</a></li>
        </ul>
      </div>
      <div className="footer-section">
        <h3 className="footer-title">Redes Sociais</h3>
        <div className="social-icons">
          <a href="#">FB</a>
          <a href="#">IG</a>
          <a href="#">TW</a>
        </div>
      </div>
    </div>
    <div className="footer-bottom">
      <p>&copy; 2024 MARTHE. Todos os direitos reservados.</p>
    </div>
  </footer>
);

export default InfoSection;
