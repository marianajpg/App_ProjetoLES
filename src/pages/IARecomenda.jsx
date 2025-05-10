import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header.jsx';
import '../styles/IARecomenda.css';
import iconIA from '../images/img_icon_ia.png';
import iconUser from '../images/img_icon_user.png';

const IARecomenda = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  const livros = [
    {
      imageUrl: 'https://images-na.ssl-images-amazon.com/images/I/81eB+7+CkUL.jpg',
      nome: '1984',
      preco: 42.90,
      estoque: 12,
      autor: 'George Orwell',
      categorias: ['Ficção', 'Distopia'],
    },
    {
      imageUrl: 'https://m.media-amazon.com/images/I/81Y5WuARqpL._AC_UF1000,1000_QL80_.jpg',
      nome: 'Dom Casmurro',
      preco: 25.50,
      estoque: 10,
      autor: 'Machado de Assis',
      categorias: ['Romance', 'Clássico'],
    },
    {
      imageUrl: 'https://m.media-amazon.com/images/I/71xBLRBYOiL.jpg',
      nome: 'O Pequeno Príncipe',
      preco: 29.99,
      estoque: 15,
      autor: 'Antoine de Saint-Exupéry',
      categorias: ['Infantil', 'Fábula'],
    },
    {
      imageUrl: 'https://m.media-amazon.com/images/I/61KEFzn3REL._AC_UF894,1000_QL80_.jpg',
      nome: 'Harry Potter e a Pedra Filosofal',
      preco: 59.90,
      estoque: 20,
      autor: 'J. K. Rowling',
      categorias: ['Fantasia'],
    },
    {
      imageUrl: 'https://m.media-amazon.com/images/I/51DNaiWfllL.jpg',
      nome: 'A Arte da Guerra',
      preco: 19.90,
      estoque: 8,
      autor: 'Sun Tzu',
      categorias: ['Estratégia', 'Clássico'],
    },
  ];

  const processarMensagem = (mensagem) => {
    const texto = mensagem.toLowerCase();

    if (texto.includes('fantasia')) {
      return livros.filter((livro) => livro.categorias.includes('Fantasia'));
    } else if (texto.includes('romance')) {
      return livros.filter((livro) => livro.categorias.includes('Romance'));
    } else if (texto.includes('clássico')) {
      return livros.filter((livro) => livro.categorias.includes('Clássico'));
    } else if (texto.includes('infantil')) {
      return livros.filter((livro) => livro.categorias.includes('Infantil'));
    } else if (texto.includes('orwell')) {
      return livros.filter((livro) => livro.autor.toLowerCase().includes('orwell'));
    } else {
      return livros; // Retorna todos os livros se a mensagem for genérica
    }
  };

  const gerarMensagemIA = (mensagem) => {
    const texto = mensagem.toLowerCase();
    if (texto.includes('fantasia')) {
      return 'Adoro fantasia! Aqui estão alguns títulos mágicos pra você:';
    } else if (texto.includes('romance')) {
      return 'Romances que vão mexer com seu coração:';
    } else if (texto.includes('clássico')) {
      return 'Clássicos nunca saem de moda. Veja essas sugestões:';
    } else if (texto.includes('infantil')) {
      return 'Leitura leve e divertida! Aqui vão alguns livros infantis:';
    } else if (texto.includes('orwell')) {
      return 'Procurando algo do George Orwell? Aqui está:';
    } else {
      return 'Aqui estão alguns livros que podem te interessar:';
    }
  };

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;

    const userMessage = { text: inputValue, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);

    setTimeout(() => {
      const livrosFiltrados = processarMensagem(inputValue);
      const respostaIA = gerarMensagemIA(inputValue);

      const iaMessage = {
        text: respostaIA,
        sender: 'ia',
        produtos: livrosFiltrados,
      };

      setMessages((prev) => [...prev, iaMessage]);
    }, 800);

    setInputValue('');
  };

  const handleProductClick = (livro) => {
    navigate('/tela-produto', { state: { produto: livro } });
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div>
      <Header tipoUsuario="cliente" tipoBotao="BotaoLogin" />
      <div className="chat-container">
        <div className="chat-messages">
          {messages.map((message, index) => (
            <div key={index} className={`message-container ${message.sender}`}>
              {message.sender === 'ia' && <img src={iconIA} alt="Ícone IA" className="message-icon" />}
              <div className={`message ${message.sender}`}>
                <p>{message.text}</p>
                {message.sender === 'ia' && message.produtos && (
                  <div className="produtos-sugeridos">
                    <div className="imagens-produtos-sugeridos">
                      {message.produtos.map((livro, idx) => (
                        <div
                          key={idx}
                          className="produto-card"
                          onClick={() => handleProductClick(livro)}
                        >
                          <img src={livro.imageUrl} alt={livro.nome} />
                          <p>{livro.nome}</p>
                          <span>R${livro.preco.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    <a href="/livros" className="veja-mais">VER TODOS OS LIVROS</a>
                  </div>
                )}
              </div>
              {message.sender === 'user' && <img src={iconUser} alt="Ícone Usuário" className="message-icon" />}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ex: Me mostra livros de fantasia"
          />
          <button onClick={handleSendMessage}>Enviar</button>
        </div>
      </div>
    </div>
  );
};

export default IARecomenda;
