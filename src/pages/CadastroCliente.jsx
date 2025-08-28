import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthLogin.jsx';
import { useNavigate } from 'react-router-dom';
import '../styles/CadastroCliente.css';
import Header from '../components/Header.jsx';
import InfoSection from '../components/InfoSection.jsx';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function CadastroCliente() {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('dadosPessoais');

  // Estados para controle do CEP
  const [loadingCEP, setLoadingCEP] = useState(false);
  const [cepError, setCepError] = useState(null);

  // Estado inicial do formulário
  const [formData, setFormData] = useState({
    nomeCompleto: '',
    dataNascimento: null,
    cpf: '',
    telefone: '',
    genero: 'FEMININO',
    enderecoEntrega: '',
    numeroEntrega: '',
    complementoEntrega: '',
    bairroEntrega: '',
    cepEntrega: '',
    cidadeEntrega: '',
    ufEntrega: '',
    observacoesEntrega: '',
    tipoEnderecoEntrega: 'RESIDENCIAL',
    enderecoCobrancaIgualEntrega: true,
    enderecoCobranca: '',
    numeroCobranca: '',
    complementoCobranca: '',
    bairroCobranca: '',
    cepCobranca: '',
    cidadeCobranca: '',
    ufCobranca: '',
    observacoesCobranca: '',
    tipoEnderecoCobranca: 'RESIDENCIAL',
    email: '',
    senha: '',
    confirmacaoSenha: '',
    numeroCartao: '',
    nomeImpresso: '',
    validadeCartao: '',
    cvv: '',
    bandeiraCartao: '',
    preferencialCartao: false
  });

  // Opções para gênero
  const generos = [
    { value: 'FEMININO', label: 'Feminino' },
    { value: 'MASCULINO', label: 'Masculino' },
    { value: 'OUTRO', label: 'Outro' }
  ];

  // Função para buscar dados do CEP
  const buscarCEP = async (cep, tipoEndereco) => {
    const cepNumerico = cep.replace(/\D/g, '');
    
    if (cepNumerico.length !== 8) return;
    
    setLoadingCEP(true);
    setCepError(null);
    
    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cepNumerico}/json/`);
      
      if (response.data.erro) {
        throw new Error('CEP não encontrado');
      }
      
      const { logradouro, complemento, bairro, localidade, uf } = response.data;
      
      setFormData(prev => ({
        ...prev,
        [`cep${tipoEndereco}`]: cep,
        [`endereco${tipoEndereco}`]: logradouro || '',
        [`complemento${tipoEndereco}`]: complemento || prev[`complemento${tipoEndereco}`],
        [`bairro${tipoEndereco}`]: bairro || '',
        [`cidade${tipoEndereco}`]: localidade || '',
        [`uf${tipoEndereco}`]: uf || ''
      }));
      
    } catch (error) {
      setCepError('CEP não encontrado ou erro na consulta');
      console.error('Erro ao buscar CEP:', error);
    } finally {
      setLoadingCEP(false);
    }
  };

  // Função para lidar com mudanças no CEP
  const handleCEPChange = (e, tipoEndereco) => {
    const { value } = e.target;
    const cepFormatado = value.replace(/\D/g, '').replace(/^(\d{5})(\d)/, '$1-$2');
    
    setFormData(prev => ({
      ...prev,
      [`cep${tipoEndereco}`]: cepFormatado
    }));
    
    // Busca automática quando o CEP está completo
    if (value.replace(/\D/g, '').length === 8) {
      buscarCEP(value, tipoEndereco);
    }
  };

  // Função genérica para lidar com mudanças nos inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.senha !== formData.confirmacaoSenha) {
      alert("As senhas não coincidem. Por favor, verifique.");
      return;
    }

    const dadosParaEnvio = {
      cliente: {
        nome: formData.nomeCompleto,
        email: formData.email,
        senha: formData.senha,
        cpf: formData.cpf,
        telefone: formData.telefone,
        dataNascimento: formData.dataNascimento ? formData.dataNascimento.toISOString() : null,
        genero: formData.genero,
      },
      enderecoEntrega: {
        tipo: formData.tipoEnderecoEntrega,
        logradouro: formData.enderecoEntrega,
        numero: formData.numeroEntrega,
        bairro: formData.bairroEntrega,
        cep: formData.cepEntrega,
        cidade: formData.cidadeEntrega,
        estado: formData.ufEntrega,
        complemento: formData.complementoEntrega || null,
        observacao: formData.observacoesEntrega || null,
        pais: "Brasil"
      },
      enderecoCobranca: {}, // Inicializa como objeto vazio
      cartaoCredito: {
        numero: formData.numeroCartao,
        nomeTitular: formData.nomeImpresso,
        validade: formData.validadeCartao,
        codigoSeguranca: formData.cvv,
        bandeira: formData.bandeiraCartao,
        preferencial: formData.preferencialCartao
      }
    };

    console.log('Dados enviados:', JSON.stringify(dadosParaEnvio, null, 2));

    if (formData.enderecoCobrancaIgualEntrega) {
      // Se o endereço de cobrança for igual ao de entrega, copia os dados do endereço de entrega
      dadosParaEnvio.enderecoCobranca = { ...dadosParaEnvio.enderecoEntrega };
    } else {
      // Caso contrário, usa os dados do formulário para o endereço de cobrança
      dadosParaEnvio.enderecoCobranca = {
        tipo: formData.tipoEnderecoCobranca,
        logradouro: formData.enderecoCobranca,
        numero: formData.numeroCobranca,
        bairro: formData.bairroCobranca,
        cep: formData.cepCobranca,
        cidade: formData.cidadeCobranca,
        estado: formData.ufCobranca,
        complemento: formData.complementoCobranca || null,
        observacao: formData.observacoesCobranca || null,
        pais: "Brasil"
      };
    }

    try {
      const response = await axios.post('http://localhost:3001/clientes', dadosParaEnvio);
      
      console.log('Resposta do servidor:', response.data);
      
      if (response.status === 201) {
        alert('Usuário e cartão cadastrados com sucesso!');
        
        // Autentica o usuário após o cadastro
        login({ tipoUsuario: 'cliente', email: formData.email });
        
        // Redireciona o usuário para a página inicial
        navigate('/');
        
        // Limpa o formulário
        setFormData({
          nomeCompleto: '',
          dataNascimento: null,
          cpf: '',
          telefone: '',
          genero: 'FEMININO',
          enderecoEntrega: '',
          numeroEntrega: '',
          complementoEntrega: '',
          bairroEntrega: '',
          cepEntrega: '',
          cidadeEntrega: '',
          ufEntrega: '',
          observacoesEntrega: '',
          tipoEnderecoEntrega: 'RESIDENCIAL',
          enderecoCobrancaIgualEntrega: true,
          enderecoCobranca: '',
          numeroCobranca: '',
          complementoCobranca: '',
          bairroCobranca: '',
          cepCobranca: '',
          cidadeCobranca: '',
          ufCobranca: '',
          observacoesCobranca: '',
          tipoEnderecoCobranca: 'RESIDENCIAL',
          email: '',
          senha: '',
          confirmacaoSenha: '',
          numeroCartao: '',
          nomeImpresso: '',
          validadeCartao: '',
          cvv: ''
        });
      } else {
        alert('Cadastro realizado, mas a resposta do servidor foi inesperada.');
      }
    } catch (error) {
      console.error('Erro completo:', error);
      
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error('Detalhes do erro:', error.response.data);
          alert(`Erro ao cadastrar usuário: ${error.response.status} - ${error.response.data.message || 'Ocorreu um erro inesperado.'}`);
        } else if (error.request) {
          console.error('Sem resposta do servidor:', error.request);
          alert('Não foi possível conectar ao servidor');
        } else {
          console.error('Erro na requisição:', error.message);
          alert('Erro ao configurar a requisição');
        }
      } 
    }
  };

  return (
    <div>
      <Header tipoUsuario="cliente" tipoBotao="BotaoLogin" />
      <div className="cadastro_cliente">
        <h2>Cadastro de Cliente</h2>

        <div className="tabs">
          <button 
            className={activeTab === 'dadosPessoais' ? 'active' : ''}
            onClick={() => setActiveTab('dadosPessoais')}
          >
            Dados Pessoais
          </button>
          <button 
            className={activeTab === 'dadosCartao' ? 'active' : ''}
            onClick={() => setActiveTab('dadosCartao')}
          >
            Cartão Preferencial
          </button>
        </div>

        {activeTab === 'dadosPessoais' && (
          <form onSubmit={handleSubmit}>
            {/* Grupo: Informações Pessoais */}
            <fieldset>
              <legend>Informações Pessoais</legend>
              <div className="form-group">
                <input
                  type="text"
                  name="nomeCompleto"
                  placeholder="Nome Completo"
                  value={formData.nomeCompleto}
                  onChange={handleChange}
                  required
                />
                <DatePicker
                  selected={formData.dataNascimento}
                  onChange={(date) => setFormData({...formData, dataNascimento: date})}
                  placeholderText="Data de nascimento"
                  dateFormat="dd/MM/yyyy"
                />
                <input
                  type="text"
                  name="cpf"
                  placeholder="CPF"
                  value={formData.cpf}
                  onChange={handleChange}
                  required
                />
                <div className='form-row'>
                <input
                  type="tel"
                  name="telefone"
                  placeholder="Telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                  required
                />
                <select
                  className='cadastro-select'
                  name="genero"
                  value={formData.genero}
                  onChange={handleChange}
                  required
                >
                  {generos.map((genero) => (
                    <option key={genero.value} value={genero.value}>
                      {genero.label}
                    </option>
                  ))}
                </select>
                </div>
              </div>
            </fieldset>

            {/* Grupo: Endereço de Entrega */}
            <fieldset>
              <legend>Endereço de Entrega</legend>
              <div className="form-group">
              <div className='form-row'>
                <input
                  type="text"
                  name="cepEntrega"
                  placeholder="CEP"
                  value={formData.cepEntrega}
                  onChange={(e) => handleCEPChange(e, 'Entrega')}
                  required
                />
                <input
                  type="text"
                  name="numeroEntrega"
                  placeholder="Número"
                  value={formData.numeroEntrega}
                  onChange={handleChange}
                  required
                />
                {loadingCEP && <span>Buscando CEP...</span>}
                {cepError && <span className="error">{cepError}</span>}
                
                  </div>
                <input
                  type="text"
                  name="enderecoEntrega"
                  placeholder="Endereço"
                  value={formData.enderecoEntrega}
                  onChange={handleChange}
                  required
                />
              
                <input
                  type="text"
                  name="complementoEntrega"
                  placeholder="Complemento"
                  value={formData.complementoEntrega}
                  onChange={handleChange}
                />
                <div className='form-row'>
                
                <input
                  type="text"
                  name="bairroEntrega"
                  placeholder="Bairro"
                  value={formData.bairroEntrega}
                  onChange={handleChange}
                  required
                />
                
                <input
                  type="text"
                  name="cidadeEntrega"
                  placeholder="Cidade"
                  value={formData.cidadeEntrega}
                  onChange={handleChange}
                  required
                />
                
                <input
                  type="text"
                  name="ufEntrega"
                  placeholder="UF"
                  value={formData.ufEntrega}
                  onChange={handleChange}
                  required
                  maxLength="2"
                />
              </div>
              </div>
            </fieldset>

            {/* Grupo: Endereço de Cobrança */}
            <fieldset>
              <legend>Endereço de Cobrança</legend>
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    name="enderecoCobrancaIgualEntrega"
                    checked={formData.enderecoCobrancaIgualEntrega}
                    onChange={handleChange}
                  />
                  <span className="checkbox-custom"></span>Mesmo endereço de entrega
                </label>
                {!formData.enderecoCobrancaIgualEntrega && (
                  <>
                  <div className='form-row'>
                    <input
                      type="text"
                      name="cepCobranca"
                      placeholder="CEP"
                      value={formData.cepCobranca}
                      onChange={(e) => handleCEPChange(e, 'Cobranca')}
                      required
                    />
                      <input
                      type="text"
                      name="numeroCobranca"
                      placeholder="Número"
                      value={formData.numeroCobranca}
                      onChange={handleChange}
                      required
                    />
                    </div>
                    <input
                      type="text"
                      name="enderecoCobranca"
                      placeholder="Endereço"
                      value={formData.enderecoCobranca}
                      onChange={handleChange}
                      required
                    />
                    
                    <input
                      type="text"
                      name="complementoCobranca"
                      placeholder="Complemento"
                      value={formData.complementoCobranca}
                      onChange={handleChange}
                    />

                    <div className='form-row'>
                    
                    <input
                      type="text"
                      name="bairroCobranca"
                      placeholder="Bairro"
                      value={formData.bairroCobranca}
                      onChange={handleChange}
                      required
                    />
                    
                    <input
                      type="text"
                      name="cidadeCobranca"
                      placeholder="Cidade"
                      value={formData.cidadeCobranca}
                      onChange={handleChange}
                      required
                    />
                    
                    <input
                      type="text"
                      name="ufCobranca"
                      placeholder="UF"
                      value={formData.ufCobranca}
                      onChange={handleChange}
                      required
                      maxLength="2"
                    />
                    </div>
                  </>
                )}
              </div>
            </fieldset>

            {/* Grupo: Login */}
            <fieldset>
              <legend>Login</legend>
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  placeholder="E-mail"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <input
                  type="password"
                  name="senha"
                  placeholder="Senha"
                  value={formData.senha}
                  onChange={handleChange}
                  required
                />
                <input
                  type="password"
                  name="confirmacaoSenha"
                  placeholder="Confirmação da Senha"
                  value={formData.confirmacaoSenha}
                  onChange={handleChange}
                  required
                />
              </div>
            </fieldset>

            <button className="buttom-form" type="submit">
              CADASTRAR
            </button>
          </form>
        )}

        {activeTab === 'dadosCartao' && (
          <fieldset>
            <legend>Cartão Preferencial</legend>
            <div className="form-group">
              <input
                type="text"
                name="numeroCartao"
                placeholder="Número do Cartão"
                value={formData.numeroCartao}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="nomeImpresso"
                placeholder="Nome no Cartão"
                value={formData.nomeImpresso}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="validadeCartao"
                placeholder="Validade (MM/AA)"
                value={formData.validadeCartao}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="cvv"
                placeholder="CVV"
                value={formData.cvv}
                onChange={handleChange}
                required
              />
              <select
                className='cadastro-select'
                name="bandeiraCartao"
                value={formData.bandeiraCartao}
                onChange={handleChange}
                required
              >
                <option value="">Selecione a Bandeira</option>
                <option value="VISA">VISA</option>
                <option value="MASTERCARD">MASTERCARD</option>
                <option value="ELO">ELO</option>
                <option value="AMEX">AMEX</option>
              </select>
              <label>
                <input
                  type="checkbox"
                  name="preferencialCartao"
                  checked={formData.preferencialCartao}
                  onChange={handleChange}
                />
                <span className="checkbox-custom"></span>Cartão Preferencial
              </label>
            </div>
          </fieldset>
        )}
      </div>
      <InfoSection />
    </div>
  );
}

export default CadastroCliente;