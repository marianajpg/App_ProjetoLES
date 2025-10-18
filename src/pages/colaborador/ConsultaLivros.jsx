import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LivroModal from '../../components/LivroModal';
import AbasFiltro from '../../components/AbasFiltro';
import CampoPesquisa from '../../components/CampoPesquisa';
import ProdutoCard from '../../components/ProdutoCard';
import '../../styles/colaborador/ConsultaLivros.css';
import Header from '../../components/Header.jsx';
import { getBooks, createBook, putBook } from '../../services/books';
import { postImageBook, deleteImageBook, putImageBook } from '../../services/bookImages';
import { getInventory } from '../../services/inventory';

const ConsultaLivros = () => {
  const navigate = useNavigate();
  const [livros, setLivros] = useState([]);
  const [abaAtiva, setAbaAtiva] = useState('todos');
  const [termoPesquisa, setTermoPesquisa] = useState('');
  
  const [modalAberto, setModalAberto] = useState(false);
  const [livroSelecionado, setLivroSelecionado] = useState(null);

  const fetchLivros = async () => {
    try {
      const [livrosData, inventoryData] = await Promise.all([
        getBooks(),
        getInventory()
      ]);

      const livrosComEstoque = livrosData.map(livro => {
        const totalQuantity = inventoryData
          .filter(item => item.bookId === livro.id)
          .reduce((sum, item) => sum + item.quantity, 0);
        return {
          ...livro,
          inventory: totalQuantity
        };
      });
      setLivros(livrosComEstoque);
    } catch (error) {
      console.error("Falha ao buscar livros:", error);
      // Opcional: mostrar uma mensagem de erro para o usuário
    }
  };

  useEffect(() => {
    fetchLivros();
  }, []);

  const handleAbrirModal = (livro = null) => {
    setLivroSelecionado(livro);
    setModalAberto(true);
  };

  const handleFecharModal = () => {
    setModalAberto(false);
    setLivroSelecionado(null);
  };

  const handleSalvar = async (dadosDoLivro) => {
    try {
      if (livroSelecionado) { // Edit Mode
        const { images: newImages, ...bookData } = dadosDoLivro;
        const originalImages = livroSelecionado.images || [];

        await putBook(livroSelecionado.id, bookData);

        const imagesToAdd = newImages.filter(img => !img.id);
        const imagesToDelete = originalImages.filter(origImg => !newImages.some(newImg => newImg.id === origImg.id));
        const imagesToUpdate = newImages.filter(newImg => {
          if (!newImg.id) return false;
          const originalImage = originalImages.find(origImg => origImg.id === newImg.id);
          console.log('Comparing:', originalImage, newImg);
          return originalImage && newImg;
        });

        // --- Processar adições ---
        for (const imageData of imagesToAdd) {
          await postImageBook(livroSelecionado.id, imageData);
        }

        // --- Processar exclusões ---
        for (const image of imagesToDelete) {
          await deleteImageBook(image.id);
        }

        // --- Processar atualizações ---
        for (const image of imagesToUpdate) {
          console.log(imagesToUpdate)
          await putImageBook(image.id, { url: image.url, caption: image.caption });
        }

        alert('Livro e imagens atualizados com sucesso!');
        await fetchLivros();

      } else { // Create Mode
        const { images, ...bookData } = dadosDoLivro;
        console.log('Book data sent to createBook:', bookData);
        await createBook(bookData);
        
        alert('Livro cadastrado com sucesso!');
        await fetchLivros(); // Re-fetch para mostrar o novo livro
      }
    } catch (error) {
      console.error("Erro ao salvar o livro:", error);
      alert('Ocorreu um erro ao salvar o livro. Verifique o console para mais detalhes.');
    } finally {
      handleFecharModal();
    }
  };

  const livrosFiltrados = livros.filter(livro => {
    const termo = termoPesquisa.toLowerCase();
    const correspondePesquisa = (livro.title || '').toLowerCase().includes(termo) || 
                              (livro.author || '').toLowerCase().includes(termo) || 
                              (livro.publisher || '').toLowerCase().includes(termo);

    if (abaAtiva === 'todos') return correspondePesquisa;
    if (abaAtiva === 'ativos') return correspondePesquisa && livro.active;
    if (abaAtiva === 'inativos') return correspondePesquisa && !livro.active;
    return true;
  });

  return (
    <div>
      <Header tipoUsuario="colaborador" />
      <div className="consulta-livros">
        <h1>Consulta de Livros</h1>
        <div className="abas-e-botao-container">
          <AbasFiltro 
            abaAtiva={abaAtiva} 
            setAbaAtiva={setAbaAtiva} 
            abas={[{ id: 'todos', label: 'Todos' }, { id: 'ativos', label: 'Ativos' }, { id: 'inativos', label: 'Inativos' }]} 
          />
          <button 
            className="botao-criar" 
            onClick={() => handleAbrirModal()}
            title="Criar Novo Livro"
          >
            +
          </button>
        </div>
        <CampoPesquisa termoPesquisa={termoPesquisa} setTermoPesquisa={setTermoPesquisa} />
        <div className="livros-container">
          {livrosFiltrados.map((livro) => (
            <ProdutoCard
              key={livro.id}
              id={livro.id}
              capaUrl={(
                livro.images && livro.images.length > 0 
                ? (livro.images.find(img => img.caption === 'Principal') || {}).url 
                : ""
              ) ?? 'https://via.placeholder.com/150'}
                
              titulo={livro.title}
              autor={livro.author}
              editora={livro.publisher}
              preco={livro.price}
              estoque={livro.inventory}
              onClick={() => handleAbrirModal(livro)}
            />
          ))}
        </div>
      </div>
      {modalAberto && <LivroModal onClose={handleFecharModal} onSave={handleSalvar} livro={livroSelecionado} />}
    </div>
  );
};

export default ConsultaLivros;