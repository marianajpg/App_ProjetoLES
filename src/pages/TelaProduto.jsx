import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCarrinho } from '../context/CarrinhoContext';
import Header from '../components/Header.jsx';
import Breadcrumb from '../components/Breadcrumb.jsx';
import { useAuth } from '../context/AuthLogin.jsx';
import '../styles/TelaProduto.css';
import InfoSection from '../components/InfoSection.jsx';

// --- DADOS MOCKADOS ---
const mockLivros = [
  {
    id: '1',
    titulo: 'A Vida Secreta das Árvores',
    autor: { nome: 'Peter Wohlleben' },
    editora: { nome: 'Sextante' },
    ano: 2016,
    valorVenda: 48.99,
    categorias: [{ nome: 'Não-ficção' }, { nome: 'Ciência' }],
    imagens: [{ url: 'https://m.media-amazon.com/images/I/414U616yzqL._SY445_SX342_.jpg' }],
    estoque: 15,
    isbn: '978-85-431-0456-7',
    edicao: '1ª',
    paginas: 208,
    sinopse: 'Uma fascinante jornada pelo mundo secreto das árvores.',
    altura: 21.0,
    largura: 14.0,
    profundidade: 1.5,
    codigoBarras: '9788543104567',
    descricao: 'Este livro revela a surpreendente vida social das árvores.'
  },
  {
    id: '2',
    titulo: 'O Homem Mais Rico da Babilônia',
    autor: { nome: 'George S. Clason' },
    editora: { nome: 'HarperCollins' },
    ano: 2017,
    valorVenda: 25.99,
    categorias: [{ nome: 'Finanças' }, { nome: 'Desenvolvimento Pessoal' }],
    imagens: [{ url: 'https://m.media-amazon.com/images/I/515b-3o-Z-L._SY445_SX342_.jpg' }],
    estoque: 30,
    isbn: '978-85-9508-100-0',
    edicao: '1ª',
    paginas: 160,
    sinopse: 'Clássico sobre os segredos da riqueza.',
    altura: 20.0,
    largura: 13.0,
    profundidade: 1.0,
    codigoBarras: '9788595081000',
    descricao: 'Aprenda os princípios atemporais da prosperidade.'
  },
  {
    id: '3',
    titulo: 'Pai Rico, Pai Pobre',
    autor: { nome: 'Robert T. Kiyosaki' },
    editora: { nome: 'Alta Books' },
    ano: 2018,
    valorVenda: 35.50,
    categorias: [{ nome: 'Finanças' }, { nome: 'Desenvolvimento Pessoal' }],
    imagens: [{ url: 'https://m.media-amazon.com/images/I/41897yAI4LL._SY445_SX342_.jpg' }],
    estoque: 25,
    isbn: '978-85-508-0148-0',
    edicao: '2ª',
    paginas: 336,
    sinopse: 'O que os ricos ensinam a seus filhos sobre dinheiro.',
    altura: 23.0,
    largura: 16.0,
    profundidade: 2.0,
    codigoBarras: '9788550801480',
    descricao: 'Desmistifica a ideia de que você precisa de um alto salário para ser rico.'
  },
  {
    id: '4',
    titulo: 'Sapiens: Uma Breve História da Humanidade',
    autor: { nome: 'Yuval Noah Harari' },
    editora: { nome: 'L&PM' },
    ano: 2015,
    valorVenda: 69.90,
    categorias: [{ nome: 'História' }, { nome: 'Antropologia' }],
    imagens: [{ url: 'https://m.media-amazon.com/images/I/41+iV0-D35L._SY445_SX342_.jpg' }],
    estoque: 10,
    isbn: '978-85-254-3218-6',
    edicao: '1ª',
    paginas: 464,
    sinopse: 'A história da humanidade, desde o surgimento do Homo sapiens até os dias atuais.',
    altura: 23.0,
    largura: 16.0,
    profundidade: 2.5,
    codigoBarras: '9788525432186',
    descricao: 'Um best-seller internacional que explora a história da nossa espécie.'
  },
  {
    id: '5',
    titulo: '1984',
    autor: { nome: 'George Orwell' },
    editora: { nome: 'Companhia das Letras' },
    ano: 2009,
    valorVenda: 22.80,
    categorias: [{ nome: 'Ficção' }, { nome: 'Distopia' }],
    imagens: [{ url: 'https://m.media-amazon.com/images/I/513423GiloL._SY445_SX342_.jpg' }],
    estoque: 50,
    isbn: '978-85-359-0148-0',
    edicao: '1ª',
    paginas: 336,
    sinopse: 'Um clássico da distopia que explora os perigos do totalitarismo.',
    altura: 20.0,
    largura: 13.0,
    profundidade: 1.5,
    codigoBarras: '9788535901480',
    descricao: 'A obra-prima de George Orwell sobre um futuro sombrio.'
  }
];

const TelaProduto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const { adicionarAoCarrinho } = useCarrinho();

  const [livro, setLivro] = useState(null);
  const [descricaoExpandida, setDescricaoExpandida] = useState(true);
  const [quantidade, setQuantidade] = useState(1);
  const [imagemPrincipal, setImagemPrincipal] = useState('');

  useEffect(() => {
    const foundLivro = mockLivros.find(b => b.id === id);
    if (foundLivro) {
      setLivro(foundLivro);
      if (foundLivro.imagens && foundLivro.imagens.length > 0) {
        setImagemPrincipal(foundLivro.imagens[0].url);
      }
    } else {
      // Livro não encontrado, pode redirecionar ou mostrar mensagem de erro
      navigate('/livros'); // Redireciona para a página de livros
    }
  }, [id, navigate]);

  if (!livro) {
    return <div>Carregando livro...</div>;
  }

  const breadcrumbItems = [
    { label: 'Home', link: '/' },
    { label: 'Livros', link: '/livros' },
    { label: livro.titulo, link: '' },
  ];

  const toggleDescricao = () => {
    setDescricaoExpandida(!descricaoExpandida);
  };

  const handleMudarImagemPrincipal = (img) => {
    setImagemPrincipal(img);
  };

  const handleAdicionarAoCarrinho = () => {
    if (quantidade > livro.estoque) {
      alert(`Quantidade solicitada excede o estoque disponível (${livro.estoque})`);
      return;
    }

    const itemCarrinho = {
      id: livro.id,
      titulo: livro.titulo,
      autor: livro.autor?.nome || 'Autor desconhecido',
      editora: livro.editora?.nome || 'Editora desconhecida',
      capaUrl: livro.imagens?.[0]?.url || '',
      valorVenda: livro.valorVenda,
      isbn: livro.isbn || '',
      quantidade: quantidade
    };

    adicionarAoCarrinho(itemCarrinho);
    navigate('/carrinho');
  };

  return (
    <div>
      <Header />
      <Breadcrumb items={breadcrumbItems} />
      <div className="produto-container">
        <div className="produto-imagens">
          <div className="produto-miniaturas">
            {livro.imagens?.map((img, index) => (
              <img
                key={index}
                src={img.url}
                alt={`Miniatura ${index}`}
                className="miniatura"
                onClick={() => handleMudarImagemPrincipal(img.url)}
              />
            ))}
          </div>
          <div className="produto-imagem-principal">
            <img src={imagemPrincipal} alt={livro.titulo} />
          </div>
        </div>

        <div className="produto-detalhes">
          <h1>{livro.titulo}</h1>
          <p className="produto-preco">
            R$ {typeof parseFloat(livro?.valorVenda) === 'number' ? parseFloat(livro.valorVenda).toFixed(2) : '0,00'}
          </p>
          <p className="produto-estoque">Apenas {parseFloat(livro?.estoque)} item(s) restantes no estoque!</p>
          <p><strong>Autor:</strong> {livro.autor?.nome}</p>
          <p><strong>Editora:</strong> {livro.editora?.nome}</p>

          <div className="produto-quantidade">
            <label>Quantidade:</label>
            <div className="quantidade-controle">
              <input
                type="number"
                min="1"
                max={livro?.estoque ?? 1}
                value={quantidade}
                onChange={(e) => {
                  const value = parseInt(e.target.value, 10) || 1;
                  const maxQuantity = livro?.estoque ?? 1;
                  setQuantidade(Math.max(1, Math.min(value, maxQuantity)));
                }}
              />
            </div>
          </div>

          <button
            className="produto-botao"
            onClick={handleAdicionarAoCarrinho}
            disabled={usuario?.tipoUsuario === 'colaborador'}
          >
            Adicionar ao carrinho
          </button>

          <div className="produto-info">
            <p><strong>Estimativa de entrega:</strong> Jul 30 - Ago 03</p>
            <p><strong>Entregas e devoluções grátis:</strong> Compras acima de R$75,00</p>
          </div>

          <div className="produto-seguranca">
            <img src="/src/images/Payment Options.png" alt="Formas de pagamento" />
          </div>
        </div>
      </div>

      <div className="produto-descricao">
        <div className="produto-descricao-header" onClick={toggleDescricao}>
          <h2>Descrição do Produto</h2>
          <span className={`seta-descricao ${descricaoExpandida ? 'virada' : ''}`}>▼</span>
        </div>

        <div
          className="produto-descricao-conteudo"
          style={{
            maxHeight: descricaoExpandida ? '500px' : '0',
            opacity: descricaoExpandida ? 1 : 0
          }}
        >
          <p><strong>Categoria(s):</strong> {livro.categorias?.map(cat => cat.nome).join(', ') || 'Não especificada'}</p>
          <p><strong>ISBN:</strong> {livro.isbn || 'Não especificado'}</p>
          <p><strong>Edição:</strong> {livro.edicao || 'Não especificada'}</p>
          <p><strong>Páginas:</strong> {livro.paginas || 'Não especificado'}</p>
          <p><strong>Ano de publicação:</strong> {livro.ano || 'Não especificado'}</p>
          <p><strong>Sinopse:</strong> {livro.sinopse || 'Não especificada'}</p>
          <p>
            <strong>Dimensões (AxLxP):</strong>
            {typeof parseFloat(livro?.altura) === 'number' ? `${parseFloat(livro.altura).toFixed(2)}cm` : 'Não especificada'} x
            {typeof parseFloat(livro?.largura) === 'number' ? `${parseFloat(livro.largura).toFixed(2)}cm` : 'Não especificada'} x
            {typeof parseFloat(livro?.profundidade) === 'number' ? `${parseFloat(livro.profundidade).toFixed(2)}cm` : 'Não especificada'}
          </p>
          <p><strong>Código de Barras:</strong> {livro.codigoBarras || 'Não especificado'}</p>
          {livro.descricao && <p>{livro.descricao}</p>}
        </div>
      </div>

      <div className="produto-beneficios">
        <div>
          <img src="/src/images/img-qualidade.png" alt="Alta Qualidade" />
          <p>Alta Qualidade<br /><span>Impressão premium e encadernação durável</span></p>
        </div>
        <div>
          <img src="/src/images/img-prot-garantida.png" alt="Proteção de garantia" />
          <p>Proteção de garantia<br /><span>Até 2 anos</span></p>
        </div>
        <div>
          <img src="/src/images/img-frete-gratis.png" alt="Frete grátis" />
          <p>Frete grátis<br /><span>Compras superiores a R$150</span></p>
        </div>
        <div>
          <img src="/src/images/img-24-7.png" alt="24/7 Suporte" />
          <p>24/7 Suporte<br /><span>Suporte dedicado</span></p>
        </div>
      </div>
      <InfoSection />
    </div>
  );
};

export default TelaProduto;