import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import '../styles/FiltrosLivro.css';
import { getCategory } from '../services/category';

const FiltrosLivro = ({ 
  onFiltroChange,
  autorOptions = [],
  editoraOptions = [],
  anoOptions = [],
  categoriasSelecionadas: initialCategoriasSelecionadas = []
}) => {
  const [autoresSelecionados, setAutoresSelecionados] = useState([]);
  const [editorasSelecionadas, setEditorasSelecionadas] = useState([]);
  const [anosSelecionados, setAnosSelecionados] = useState([]);
  const [faixasDePrecoSelecionadas, setFaixasDePrecoSelecionadas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriasSelecionadas, setCategoriasSelecionadas] = useState(initialCategoriasSelecionadas);
  const [ordenacao, setOrdenacao] = useState('');

  useEffect(() => {
    setCategoriasSelecionadas(initialCategoriasSelecionadas);
  }, [initialCategoriasSelecionadas]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getCategory();
        setCategorias(categoriesData);
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
      }
    };
    fetchCategories();
  }, []);

  // Opções estáticas que não vêm das props
  const faixasDePreco = [
    { label: 'R$10–R$30', min: 10, max: 30 },
    { label: 'R$30–R$50', min: 30, max: 50 },
    { label: 'R$50–R$100', min: 50, max: 100 },
    { label: 'R$100–R$150', min: 100, max: 150 },
  ];

  // Handler genérico para os componentes react-select
  const handleSelectChange = (selectedOptions, name) => {
    const values = selectedOptions ? selectedOptions.map(option => option.value) : [];
    let newAutores = autoresSelecionados, newEditoras = editorasSelecionadas, newAnos = anosSelecionados;

    if (name === 'autores') {
      setAutoresSelecionados(values);
      newAutores = values;
    } else if (name === 'editoras') {
      setEditorasSelecionadas(values);
      newEditoras = values;
    } else if (name === 'anos') {
      setAnosSelecionados(values);
      newAnos = values;
    }

    onFiltroChange({
      autores: newAutores,
      editoras: newEditoras,
      anos: newAnos,
      faixasDePreco: faixasDePrecoSelecionadas,
      categorias: categoriasSelecionadas,
      ordenacao,
    });
  };

  const tratarCheckbox = (valor, selecionados, setSelecionados, nomeFiltro) => {
    const atualizados = selecionados.includes(valor)
      ? selecionados.filter((v) => v !== valor)
      : [...selecionados, valor];

    setSelecionados(atualizados);
    onFiltroChange({
      autores: autoresSelecionados,
      editoras: editorasSelecionadas,
      anos: anosSelecionados,
      faixasDePreco: nomeFiltro === 'faixasDePreco' ? atualizados : faixasDePrecoSelecionadas,
      categorias: nomeFiltro === 'categorias' ? atualizados : categoriasSelecionadas,
      ordenacao,
    });
  };

  const tratarOrdenacao = (event) => {
    const novaOrdenacao = event.target.value;
    setOrdenacao(novaOrdenacao);
    onFiltroChange({
      autores: autoresSelecionados,
      editoras: editorasSelecionadas,
      anos: anosSelecionados,
      faixasDePreco: faixasDePrecoSelecionadas,
      categorias: categoriasSelecionadas,
      ordenacao: novaOrdenacao,
    });
  };
  
  const customStyles = {
    control: (provided) => ({
      ...provided,
      borderColor: '#ddd',
      boxShadow: 'none',
      '&:hover': {
        borderColor: '#b3b3b3'
      }
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: '#e0e0e0'
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: '#333'
    }),
  };

  return (
    <div className="filtros-container">
      <fieldset className="filtro-fieldset">
        <legend className="filtro-legend">Autor</legend>
        <Select
          isMulti
          name="autores"
          options={autorOptions}
          className="basic-multi-select"
          classNamePrefix="select"
          placeholder="Selecione autores..."
          onChange={(options) => handleSelectChange(options, 'autores')}
          styles={customStyles}
        />
      </fieldset>

      <fieldset className="filtro-fieldset">
        <legend className="filtro-legend">Editora</legend>
        <Select
          isMulti
          name="editoras"
          options={editoraOptions}
          className="basic-multi-select"
          classNamePrefix="select"
          placeholder="Selecione editoras..."
          onChange={(options) => handleSelectChange(options, 'editoras')}
          styles={customStyles}
        />
      </fieldset>

      <fieldset className="filtro-fieldset">
        <legend className="filtro-legend">Ano de publicação</legend>
        <Select
          isMulti
          name="anos"
          options={anoOptions}
          className="basic-multi-select"
          classNamePrefix="select"
          placeholder="Selecione anos..."
          onChange={(options) => handleSelectChange(options, 'anos')}
          styles={customStyles}
        />
      </fieldset>

      <fieldset className="filtro-fieldset">
        <legend className="filtro-legend">Faixa de Preço</legend>
        <div className="filtro-group">
          {faixasDePreco.map((faixa) => (
            <label key={faixa.label} className="filtro-label">
              <input
                type="checkbox"
                checked={faixasDePrecoSelecionadas.includes(faixa.label)}
                onChange={() => tratarCheckbox(faixa.label, faixasDePrecoSelecionadas, setFaixasDePrecoSelecionadas, 'faixasDePreco')}
              />
              <span className="filtro-checkbox"></span>
              {faixa.label}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="filtro-fieldset">
        <legend className="filtro-legend">Categoria</legend>
        <div className="filtro-group">
          {categorias.map((categoria) => (
            <label key={categoria.id} className="filtro-label">
              <input
                type="checkbox"
                checked={categoriasSelecionadas.includes(categoria.name)}
                onChange={() => tratarCheckbox(categoria.name, categoriasSelecionadas, setCategoriasSelecionadas, 'categorias')}
              />
              <span className="filtro-checkbox"></span>
              {categoria.name}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="filtro-fieldset">
        <legend className="filtro-legend">Ordenar por</legend>
        <div className="filtro-group">
          <select
            value={ordenacao}
            onChange={tratarOrdenacao}
            className="filtro-select"
          >
            <option value="">Selecione</option>
            <option value="Menor preço">Menor preço</option>
            <option value="Maior preço">Maior preço</option>
            <option value="Mais recentes">Mais recentes</option>
          </select>
        </div>
      </fieldset>
    </div>
  );
};

export default FiltrosLivro;