import React, { useState, useEffect } from 'react';
import './../styles/LivroModal.css'; // Updated import path

// Default state for a new book
const defaultLivroState = {
  title: '',
  author: '',
  publisher: '',
  year: '',
  edition: '',
  ISBN: '',
  pages: '',
  synopsis: '',
  barcode: '',
  price: '',
  status: 'ACTIVE',
  pricegroupId: '',
  dimensions: {
    height: '',
    width: '',
    depth: '',
    weight: '',
  },
};

// Mock data for price groups - in a real app, this would be fetched
const mockPriceGroups = [
  { id: 1, name: 'Teste' },
  { id: 2, name: 'Padrão' },
  { id: 3, name: 'Promoção' },
];

const LivroModal = ({ livro, onClose, onSave }) => {
  const isEditMode = Boolean(livro);
  const [dadosLivro, setDadosLivro] = useState(
    isEditMode ? { ...livro, pricegroupId: livro.pricegroup?.id } : defaultLivroState
  );
  const [priceGroups, setPriceGroups] = useState([]);

  useEffect(() => {
    // In a real app, you would fetch price groups here
    setPriceGroups(mockPriceGroups);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (['height', 'width', 'depth', 'weight'].includes(name)) {
      setDadosLivro(prev => ({
        ...prev,
        dimensions: { ...prev.dimensions, [name]: value }
      }));
    } else {
      setDadosLivro(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSalvar = (e) => {
    e.preventDefault();
    
    // Prepare data for saving, ensuring correct types
    const dadosParaSalvar = {
      ...dadosLivro,
      price: parseFloat(dadosLivro.price) || 0,
      pages: parseInt(dadosLivro.pages, 10) || 0,
      year: parseInt(dadosLivro.year, 10) || 0,
      pricegroupId: parseInt(dadosLivro.pricegroupId, 10) || null,
      dimensions: {
        height: parseFloat(dadosLivro.dimensions.height) || 0,
        width: parseFloat(dadosLivro.dimensions.width) || 0,
        depth: parseFloat(dadosLivro.dimensions.depth) || 0,
        weight: parseFloat(dadosLivro.dimensions.weight) || 0,
      }
    };
    
    onSave(dadosParaSalvar);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3>{isEditMode ? 'Editar Livro' : 'Cadastrar Novo Livro'}</h3>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSalvar} className="form-grid">
          {/* Using grid for layout */}
          <div className="form-group">
            <label>Título:</label>
            <input required type="text" name="title" value={dadosLivro.title} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Autor:</label>
            <input required type="text" name="author" value={dadosLivro.author} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Editora:</label>
            <input type="text" name="publisher" value={dadosLivro.publisher} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Ano:</label>
            <input type="number" name="year" value={dadosLivro.year} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Edição:</label>
            <input type="text" name="edition" value={dadosLivro.edition} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>ISBN:</label>
            <input type="text" name="ISBN" value={dadosLivro.ISBN} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Nº de Páginas:</label>
            <input type="number" name="pages" value={dadosLivro.pages} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Código de Barras:</label>
            <input type="text" name="barcode" value={dadosLivro.barcode} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Preço:</label>
            <input required type="number" step="0.01" name="price" value={dadosLivro.price} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Status:</label>
            <select name="status" value={dadosLivro.status} onChange={handleChange}>
              <option value="ACTIVE">Ativo</option>
              <option value="INACTIVE">Inativo</option>
            </select>
          </div>
          <div className="form-group">
            <label>Grupo de Precificação:</label>
            <select required name="pricegroupId" value={dadosLivro.pricegroupId} onChange={handleChange}>
              <option value="">Selecione...</option>
              {priceGroups.map(pg => <option key={pg.id} value={pg.id}>{pg.name}</option>)}            </select>
          </div>
          <div className="form-group">
            <label>Altura (cm):</label>
            <input type="number" step="0.1" name="height" value={dadosLivro.dimensions.height} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Largura (cm):</label>
            <input type="number" step="0.1" name="width" value={dadosLivro.dimensions.width} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Profundidade (cm):</label>
            <input type="number" step="0.1" name="depth" value={dadosLivro.dimensions.depth} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Peso (g):</label>
            <input type="number" step="0.1" name="weight" value={dadosLivro.dimensions.weight} onChange={handleChange} />
          </div>
          <div className="form-group full-width">
            <label>Sinopse:</label>
            <textarea name="synopsis" value={dadosLivro.synopsis} onChange={handleChange} />
          </div>
          <div className="modal-actions full-width">
            <button type="button" onClick={onClose}>Cancelar</button>
            <button type="submit">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LivroModal;