import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Header from '../../components/Header.jsx';
import AbasFiltro from '../../components/AbasFiltro.jsx';
import Breadcrumb from '../../components/Breadcrumb.jsx';
import { putCustomer } from '../../services/customers .jsx';
import TransacoesCliente from './TransacoesCliente';
import '../../styles/colaborador/EditarCliente.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const EditarCliente = () => {
  const location = useLocation();
  const { cliente } = location.state || {};
  const [abaAtiva, setAbaAtiva] = useState('editar');
  const [status, setStatus] = useState(cliente?.status || 'ativo');
  const [loadingCEPEntrega, setLoadingCEPEntrega] = useState(false);
  const [loadingCEPCobranca, setLoadingCEPCobranca] = useState(false);
  const [cepErrorEntrega, setCepErrorEntrega] = useState(null);
  const [cepErrorCobranca, setCepErrorCobranca] = useState(null);

  // Lista de abas
  const abas = [
    { id: 'editar', label: 'Editar' },
    { id: 'transacoes', label: 'Transações' },
  ];

  // Opções para gênero e tipo de endereço
  const generos = [
    { value: 'FEMININO', label: 'Feminino' },
    { value: 'MASCULINO', label: 'Masculino' },
    { value: 'OUTRO', label: 'Outro' },
    { value: 'PREFIRO_NAO_DIZER', label: 'Prefiro não dizer' }
  ];

  const tiposEndereco = [
    { value: 'RESIDENCIAL', label: 'Residencial' },
    { value: 'COMERCIAL', label: 'Comercial' },
    { value: 'OUTRO', label: 'Outro' }
  ];

  const breadcrumbItems = [
    { label: 'Clientes', link: '/consultar-cliente' },
    { label: 'Editar', link: '' },
  ];

  const billingAddress = cliente?.addresses.find(address => address.type === 'BILLING');

  // Estados para os campos editáveis
  const [formData, setFormData] = useState({
    nomeCompleto: cliente?.name || '',
    cpf: cliente?.cpf || '',
    dataNascimento: cliente?.birthdaydate ? new Date(cliente.birthdaydate) : null,
    telefone: cliente?.phone || '',
    genero: cliente?.gender || 'FEMININO',
    email: cliente?.email || '',
    enderecoCobranca: {
      tipo: billingAddress?.residenceType || 'RESIDENCIAL',
      logradouro: billingAddress?.street || '',
      numero: billingAddress?.number || '',
      complemento: billingAddress?.complement || '',
      bairro: billingAddress?.neighborhood || '',
      cep: billingAddress?.zipCode || '',
      cidade: billingAddress?.city || '',
      uf: billingAddress?.state || '',
      observacoes: billingAddress?.observations || '',
    }
  });

  // Função para buscar dados do CEP
  const buscarCEP = async (cep, tipoEndereco) => {
    const cepNumerico = cep.replace(/\D/g, '');
    
    if (cepNumerico.length !== 8) return;
    
    if (tipoEndereco === 'Entrega') {
      setLoadingCEPEntrega(true);
      setCepErrorEntrega(null);
    } else {
      setLoadingCEPCobranca(true);
      setCepErrorCobranca(null);
    }
    
    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cepNumerico}/json/`);
      
      if (response.data.erro) {
        throw new Error('CEP não encontrado');
      }
      
      const { logradouro, complemento, bairro, localidade, uf } = response.data;
      
      setFormData(prev => ({
        ...prev,
        [`endereco${tipoEndereco}`]: {
          ...prev[`endereco${tipoEndereco}`],
          cep: cep,
          logradouro: logradouro || '',
          complemento: complemento || prev[`endereco${tipoEndereco}`].complemento,
          bairro: bairro || '',
          cidade: localidade || '',
          uf: uf || ''
        }
      }));
      
    } catch (error) {
      const errorMsg = 'CEP não encontrado ou erro na consulta';
      if (tipoEndereco === 'Entrega') {
        setCepErrorEntrega(errorMsg);
      } else {
        setCepErrorCobranca(errorMsg);
      }
      console.error('Erro ao buscar CEP:', error);
    } finally {
      if (tipoEndereco === 'Entrega') {
        setLoadingCEPEntrega(false);
      } else {
        setLoadingCEPCobranca(false);
      }
    }
  };

  // Função para lidar com mudanças no CEP
  const handleCEPChange = (e, tipoEndereco) => {
    const { value } = e.target;
    const cepFormatado = value.replace(/\D/g, '').replace(/^(\d{5})(\d)/, '$1-$2');
    
    setFormData(prev => ({
      ...prev,
      [`endereco${tipoEndereco}`]: {
        ...prev[`endereco${tipoEndereco}`],
        cep: cepFormatado
      }
    }));
    
    // Busca automática quando o CEP está completo
    if (value.replace(/\D/g, '').length === 8) {
      buscarCEP(value, tipoEndereco);
    }
  };

  // Função para lidar com mudanças nos inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Função para lidar com mudanças no endereço de entrega
  const handleEnderecoEntregaChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      enderecoEntrega: {
        ...prevState.enderecoEntrega,
        [name]: value,
      },
    }));
  };

  // Função para lidar com mudanças no endereço de cobrança
  const handleEnderecoCobrancaChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      enderecoCobranca: {
        ...prevState.enderecoCobranca,
        [name]: value,
      },
    }));
  };

  // Função para lidar com o checkbox "Mesmo Endereço de Entrega"
  const handleMesmoEnderecoChange = () => {
    const novoValor = !formData.enderecoCobranca.mesmoEndereco;
    
    setFormData(prev => ({
      ...prev,
      enderecoCobranca: {
        ...prev.enderecoCobranca,
        mesmoEndereco: novoValor,
        ...(novoValor ? {
          logradouro: prev.enderecoEntrega.logradouro,
          numero: prev.enderecoEntrega.numero,
          complemento: prev.enderecoEntrega.complemento,
          bairro: prev.enderecoEntrega.bairro,
          cep: prev.enderecoEntrega.cep,
          cidade: prev.enderecoEntrega.cidade,
          uf: prev.enderecoEntrega.uf,
          observacoes: prev.enderecoEntrega.observacoes,
          tipo: prev.enderecoEntrega.tipo
        } : {
          logradouro: '',
          numero: '',
          complemento: '',
          bairro: '',
          cep: '',
          cidade: '',
          uf: '',
          observacoes: '',
          tipo: 'RESIDENCIAL'
        })
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const dadosParaEnvio = {
      name: formData.nomeCompleto,
      email: formData.email,
      cpf: formData.cpf,
      phone: formData.telefone,
      birthdaydate: formData.dataNascimento,
      gender: formData.genero,
      status: status,
      addresses: [
        {
          type: "BILLING",
          residenceType: formData.enderecoCobranca.tipo,
          street: formData.enderecoCobranca.logradouro,
          number: formData.enderecoCobranca.numero,
          neighborhood: formData.enderecoCobranca.bairro,
          zipCode: formData.enderecoCobranca.cep,
          city: formData.enderecoCobranca.cidade,
          state: formData.enderecoCobranca.uf,
          complement: formData.enderecoCobranca.complemento || null,
          observations: formData.enderecoCobranca.observacoes || null,
          country: "Brasil"
        }
      ]
    };

    try {
      const response = await putCustomer(cliente.id, dadosParaEnvio);
      console.log('Cliente atualizado:', response.data);
      alert('Cliente atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      alert('Erro ao atualizar cliente. Verifique os dados e tente novamente.');
    }
  };

  if (!cliente) {
    return <div>Cliente não encontrado.</div>;
  }

  return (
    <div>
      <Header tipoUsuario="colaborador" tipoBotao="BotaoProfile" />
      <Breadcrumb items={breadcrumbItems} />
      <div className="editar-cliente-container">
        <h1>Cliente: {formData.nomeCompleto}</h1>
        <AbasFiltro abaAtiva={abaAtiva} setAbaAtiva={setAbaAtiva} abas={abas} />

        {abaAtiva === 'editar' ? (
          <form onSubmit={handleSubmit}>
            {/* Grupo: Informações Pessoais */}
            <fieldset className="editar-cliente-fieldset">
              <legend className="editar-cliente-legend">Informações Pessoais</legend>
              <div className="editar-cliente-form-group">
                <div className="form-group-with-label">
                  <label>Nome Completo</label>
                  <input
                    type="text"
                    name="nomeCompleto"
                    value={formData.nomeCompleto}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group-with-label">
                  <label>Data de Nascimento</label>
                  <DatePicker
                    selected={formData.dataNascimento}
                    onChange={(date) => setFormData({...formData, dataNascimento: date})}
                    dateFormat="dd/MM/yyyy"
                    showYearDropdown
                    dropdownMode="select"
                    required
                  />
                </div>

                <div className="form-group-with-label">
                  <label>CPF</label>
                  <input
                    type="text"
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group-with-label">
                  <label>Telefone</label>
                  <input
                    type="text"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group-with-label">
                  <label>Gênero</label>
                  <select
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

                <div className="form-group-with-label">
                  <label>E-mail</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </fieldset>

            {/* Grupo: Endereço de Cobrança */}
            <fieldset className="editar-cliente-fieldset">
              <legend className="editar-cliente-legend">Endereço de Cobrança</legend>
              <div className="editar-cliente-form-group">
                <div className="form-group-with-label">
                  <label>Tipo de Endereço</label>
                  <select
                    name="tipo"
                    value={formData.enderecoCobranca.tipo}
                    onChange={handleEnderecoCobrancaChange}
                    required
                  >
                    {tiposEndereco.map((tipo) => (
                      <option key={tipo.value} value={tipo.value}>
                        {tipo.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group-with-label">
                  <label>CEP</label>
                  <input
                    type="text"
                    name="cep"
                    value={formData.enderecoCobranca.cep}
                    onChange={(e) => handleCEPChange(e, 'Cobranca')}
                    required
                  />
                  {loadingCEPCobranca && <span>Buscando CEP...</span>}
                  {cepErrorCobranca && <span className="error">{cepErrorCobranca}</span>}
                </div>

                <div className="form-group-with-label">
                  <label>Logradouro</label>
                  <input
                    type="text"
                    name="logradouro"
                    value={formData.enderecoCobranca.logradouro}
                    onChange={handleEnderecoCobrancaChange}
                    required
                  />
                </div>

                <div className="form-group-with-label">
                  <label>Número</label>
                  <input
                    type="text"
                    name="numero"
                    value={formData.enderecoCobranca.numero}
                    onChange={handleEnderecoCobrancaChange}
                    required
                  />
                </div>

                <div className="form-group-with-label">
                  <label>Complemento</label>
                  <input
                    type="text"
                    name="complemento"
                    value={formData.enderecoCobranca.complemento}
                    onChange={handleEnderecoCobrancaChange}
                  />
                </div>

                <div className="form-group-with-label">
                  <label>Bairro</label>
                  <input
                    type="text"
                    name="bairro"
                    value={formData.enderecoCobranca.bairro}
                    onChange={handleEnderecoCobrancaChange}
                    required
                  />
                </div>

                <div className="form-group-with-label">
                  <label>Cidade</label>
                  <input
                    type="text"
                    name="cidade"
                    value={formData.enderecoCobranca.cidade}
                    onChange={handleEnderecoCobrancaChange}
                    required
                  />
                </div>

                <div className="form-group-with-label">
                  <label>Estado (UF)</label>
                  <input
                    type="text"
                    name="uf"
                    value={formData.enderecoCobranca.uf}
                    onChange={handleEnderecoCobrancaChange}
                    maxLength="2"
                    required
                  />
                </div>

                <div className="form-group-with-label">
                  <label>Observações</label>
                  <input
                    type="text"
                    name="observacoes"
                    value={formData.enderecoCobranca.observacoes}
                    onChange={handleEnderecoCobrancaChange}
                  />
                </div>
              </div>
            </fieldset>

            {/* Botões de Status */}
            <div className="status-botoes">
              <button
                type="button"
                className={`status-botao ${status === 'ativo' ? 'ativo' : ''}`}
                onClick={() => setStatus('ativo')}
              >
                Ativado
              </button>
              <button
                type="button"
                className={`status-botao ${status === 'desativado' ? 'desativado' : ''}`}
                onClick={() => setStatus('desativado')}
              >
                Desativado
              </button>
            </div>

            {/* Botões de Ação */}
            <div className="editar-cliente-botoes-acoes">
              <button type="submit">SALVAR ALTERAÇÕES</button>
              <Link to="/consultar-cliente">
                <button type="button">CANCELAR</button>
              </Link>
              <button type="button" onClick={() => {
                if (window.confirm('Deseja realmente limpar todos os campos?')) {
                  setFormData({
                    nomeCompleto: '',
                    cpf: '',
                    dataNascimento: null,
                    telefone: '',
                    genero: 'FEMININO',
                    email: '',
                    enderecoEntrega: {
                      tipo: 'RESIDENCIAL',
                      logradouro: '',
                      numero: '',
                      complemento: '',
                      bairro: '',
                      cep: '',
                      cidade: '',
                      uf: '',
                      observacoes: ''
                    },
                    enderecoCobranca: {
                      mesmoEndereco: true,
                      tipo: 'RESIDENCIAL',
                      logradouro: '',
                      numero: '',
                      complemento: '',
                      bairro: '',
                      cep: '',
                      cidade: '',
                      uf: '',
                      observacoes: ''
                    }
                  });
                }
              }}>
                LIMPAR CAMPOS
              </button>
            </div>
          </form>
        ) : (
          <TransacoesCliente clienteId={cliente.id} />
        )}
      </div>
    </div>
  );
};

export default EditarCliente;