import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { getCategory } from '../services/category';
import { getPriceGroups } from '../services/pricegroup'; 
import './../styles/LivroModal.css';

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
  dimensions: { height: '', width: '', depth: '', weight: '' },
  category: [],
  images: [{ url: '', caption: '' }],
};

const LivroModal = ({ livro, onClose, onSave }) => {
  const isEditMode = Boolean(livro);
  const [dadosLivro, setDadosLivro] = useState(
    isEditMode
      ? {
          ...livro,
          pricegroupId: livro.pricegroup?.id,
          category: livro.category?.map(c => c.id) || [],
          images: livro.images?.length > 0 ? livro.images : [{ url: '', caption: '' }],
        }
      : defaultLivroState
  );
  const [priceGroups, setPriceGroups] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [categoriesData, priceGroupsData] = await Promise.all([
          getCategory(),
          getPriceGroups(),
        ]);

        const formattedCategories = categoriesData.map(cat => ({ value: cat.id, label: cat.name }));
        setAvailableCategories(formattedCategories);
        setPriceGroups(priceGroupsData);

      } catch (error) {
        console.error("Failed to fetch initial data:", error);
      }
    };

    fetchInitialData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (['height', 'width', 'depth', 'weight'].includes(name)) {
      setDadosLivro(prev => ({ ...prev, dimensions: { ...prev.dimensions, [name]: value } }));
    } else {
      setDadosLivro(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCategoryChange = (selectedOptions) => {
    const categoryIds = selectedOptions ? selectedOptions.map(option => option.value) : [];
    setDadosLivro(prev => ({ ...prev, category: categoryIds }));
  };

  const handleImageChange = (index, e) => {
    const { name, value } = e.target;
    const newImages = [...dadosLivro.images];
    newImages[index][name] = value;
    setDadosLivro(prev => ({ ...prev, images: newImages }));
  };

  const addImageInput = () => {
    setDadosLivro(prev => ({ ...prev, images: [...prev.images, { url: '', caption: '' }] }));
  };

  const removeImageInput = (index) => {
    const newImages = dadosLivro.images.filter((_, i) => i !== index);
    setDadosLivro(prev => ({ ...prev, images: newImages }));
  };

  const handleSalvar = (e) => {
    e.preventDefault();
    const dadosParaSalvar = {
      ...dadosLivro,
      cost: parseFloat(dadosLivro.price) || 0,
      pages: parseInt(dadosLivro.pages, 10) || 0,
      year: parseInt(dadosLivro.year, 10) || 0,
      pricegroup: parseInt(dadosLivro.pricegroupId, 10) || null,
      dimensions: {
        height: parseFloat(dadosLivro.dimensions.height) || 0,
        width: parseFloat(dadosLivro.dimensions.width) || 0,
        depth: parseFloat(dadosLivro.dimensions.depth) || 0,
        weight: parseFloat(dadosLivro.dimensions.weight) || 0,
      },
      images: dadosLivro.images.filter(img => img.url.trim() !== ''),
    };
    delete dadosParaSalvar.price;
    delete dadosParaSalvar.pricegroupId;
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
          {/* Other form fields */}
          <div className="form-group"><label>Título:</label><input required type="text" name="title" value={dadosLivro.title} onChange={handleChange} /></div>
          <div className="form-group"><label>Autor:</label><input required type="text" name="author" value={dadosLivro.author} onChange={handleChange} /></div>
          <div className="form-group"><label>Editora:</label><input type="text" name="publisher" value={dadosLivro.publisher} onChange={handleChange} /></div>
          <div className="form-group"><label>Ano:</label><input type="number" name="year" value={dadosLivro.year} onChange={handleChange} /></div>
          <div className="form-group"><label>Edição:</label><input type="text" name="edition" value={dadosLivro.edition} onChange={handleChange} /></div>
          <div className="form-group"><label>ISBN:</label><input type="text" name="ISBN" value={dadosLivro.ISBN} onChange={handleChange} /></div>
          <div className="form-group"><label>Nº de Páginas:</label><input type="number" name="pages" value={dadosLivro.pages} onChange={handleChange} /></div>
          <div className="form-group"><label>Código de Barras:</label><input type="text" name="barcode" value={dadosLivro.barcode} onChange={handleChange} /></div>
          <div className="form-group"><label>Preço:</label><input required type="number" step="0.01" name="price" value={dadosLivro.price} onChange={handleChange} /></div>
          <div className="form-group"><label>Status:</label><select name="status" value={dadosLivro.status} onChange={handleChange}><option value="ACTIVE">Ativo</option><option value="INACTIVE">Inativo</option></select></div>
          <div className="form-group"><label>Grupo de Precificação:</label><select required name="pricegroupId" value={dadosLivro.pricegroupId} onChange={handleChange}><option value="">Selecione...</option>{priceGroups.map(pg => <option key={pg.id} value={pg.id}>{pg.name}</option>)}</select></div>
          <div className="form-group"><label>Altura (cm):</label><input type="number" step="0.1" name="height" value={dadosLivro.dimensions.height} onChange={handleChange} /></div>
          <div className="form-group"><label>Largura (cm):</label><input type="number" step="0.1" name="width" value={dadosLivro.dimensions.width} onChange={handleChange} /></div>
          <div className="form-group"><label>Profundidade (cm):</label><input type="number" step="0.1" name="depth" value={dadosLivro.dimensions.depth} onChange={handleChange} /></div>
          <div className="form-group"><label>Peso (g):</label><input type="number" step="0.1" name="weight" value={dadosLivro.dimensions.weight} onChange={handleChange} /></div>
          
          <div className="form-group full-width"><label>Categorias:</label><Select isMulti name="category" options={availableCategories} className="basic-multi-select" classNamePrefix="select" placeholder="Selecione categorias..." value={availableCategories.filter(option => dadosLivro.category.includes(option.value))} onChange={handleCategoryChange} /></div>

          {isEditMode && (
            <div className="form-group full-width">
              <label>Imagens:</label>
              {dadosLivro.images.map((image, index) => (
                <div key={index} className="image-input-group">
                  <input type="text" name="url" placeholder="URL da Imagem" value={image.url} onChange={(e) => handleImageChange(index, e)} />
                  <input type="text" name="caption" placeholder="Legenda (Ex: Principal, Aberto)" value={image.caption} onChange={(e) => handleImageChange(index, e)} />
                  <button type="button" className="remove-image-btn" onClick={() => removeImageInput(index)}>&times;</button>
                </div>
              ))}
              <button type="button" className="add-image-btn" onClick={addImageInput}>Adicionar Imagem</button>
            </div>
          )}

          <div className="form-group full-width"><label>Sinopse:</label><textarea name="synopsis" value={dadosLivro.synopsis} onChange={handleChange} /></div>
          
          <div className="modal-actions full-width"><button type="button" onClick={onClose}>Cancelar</button><button type="submit">Salvar</button></div>
        </form>
      </div>
    </div>
  );
};

export default LivroModal;