import React, { useState, useEffect } from 'react';
import '../styles/Perfil.css';
import Header from '../components/Header.jsx';
import { useAuth } from '../context/AuthLogin.jsx';
import { useNavigate } from 'react-router-dom';
import MeusProdutos from '../components/MeusProdutos.jsx';
import AbasFiltro from '../components/AbasFiltro.jsx';
import InfoSection from '../components/InfoSection.jsx';

function Perfil() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [abaAtiva, setAbaAtiva] = useState('Perfil');
  const [formData, setFormData] = useState({
    nomeCompleto: '',
    nomeSocial: '',
    dataNascimento: '',
    cpf: '',
    telefone: '',
    genero: 'MASCULINO',
    tipoResidencia: 'RESIDENCIAL',
    tipoLogradouro: 'Avenida',
    logradouro: '',
    numero: '',
    cep: '',
    cidade: '',
    uf: '',
    bairro: '',
    complemento: '',
    observacoes: '',
    email: '',
    senha: '',
    confirmacaoSenha: ''
  });

  useEffect(() => {
    if (user) {
      const billingAddress = user.addresses?.find(address => address.type === 'BILLING');

      setFormData({
        nomeCompleto: user.nome || '',
        nomeSocial: '', // Não temos nome social no cliente, manter vazio
        dataNascimento: user.birthdaydate ? new Date(user.birthdaydate).toISOString().split('T')[0] : '', // Formato YYYY-MM-DD
        cpf: user.cpf || '',
        telefone: user.phone || '',
        genero: user.gender || '',
        
        // Dados do endereço de cobrança
        tipoResidencia: billingAddress?.residenceType || '',
        tipoLogradouro: billingAddress?.streetType || '',
        logradouro: billingAddress?.street || '',
        numero: billingAddress?.number || '',
        cep: billingAddress?.zipCode || '',
        cidade: billingAddress?.city || '',
        uf: billingAddress?.state || '',
        bairro: billingAddress?.neighborhood || '',
        complemento: billingAddress?.complement || '',
        observacoes: billingAddress?.observations || '',
        
        email: user.email || '',
        senha: '', // Senha não deve ser preenchida
        confirmacaoSenha: '' // Senha não deve ser preenchida
      });
    }
  }, [user]);

  const abas = [
    { id: 'Perfil', label: 'Perfil' },
    { id: 'MeusProdutos', label: 'Meus Produtos' },
    { id: 'Comunidade', label: 'Comunidade' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Função de edição não implementada neste modo de demonstração.');
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return <div className="perfil-container">Usuário não autenticado</div>;
  }

  return (
    <div className="perfil-container">
      <Header tipoUsuario={user?.tipoUsuario} />

      <div className="perfil-content">
        <h1>Meu Perfil</h1>

        <AbasFiltro abaAtiva={abaAtiva} setAbaAtiva={setAbaAtiva} abas={abas} />
      
        {abaAtiva === 'Perfil' && (
          <form onSubmit={handleSubmit} className="perfil-form">
            <div className="perfil-dados">
              <div className="perfil-input-group">
                <label>Nome Completo</label>
                <input type="text" name="nomeCompleto" value={formData.nomeCompleto} onChange={handleChange} />
              </div>
              <div className="perfil-input-group">
                <label>Nome Social</label>
                <input type="text" name="nomeSocial" value={formData.nomeSocial} onChange={handleChange} />
              </div>
              <div className="perfil-input-row">
                <div className="perfil-input-group">
                  <label>Data Nascimento</label>
                  <input type="date" name="dataNascimento" value={formData.dataNascimento} onChange={handleChange} />
                </div>
                <div className="perfil-input-group">
                  <label>CPF</label>
                  <input type="text" name="cpf" value={formData.cpf} onChange={handleChange} disabled />
                </div>
              </div>
              <div className="perfil-input-row">
                <div className="perfil-input-group">
                  <label>Telefone</label>
                  <input type="text" name="telefone" value={formData.telefone} onChange={handleChange} />
                </div>
                <div className="perfil-input-group">
                  <label>Gênero</label>
                  <select name="genero" value={formData.genero} onChange={handleChange}>
                    <option value="FEMININO">Feminino</option>
                    <option value="MASCULINO">Masculino</option>
                    <option value="OUTRO">Outro</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="perfil-endereco">
              <h2>Endereço de Cobrança</h2>
              <div className="perfil-input-row">
                <div className="perfil-input-group">
                  <label>Tipo de Residência</label>
                  <select name="tipoResidencia" value={formData.tipoResidencia} onChange={handleChange}>
                    <option value="RESIDENCIAL">Residencial</option>
                    <option value="COMERCIAL">Comercial</option>
                  </select>
                </div>
                <div className="perfil-input-group">
                  <label>Tipo de Logradouro</label>
                  <select name="tipoLogradouro" value={formData.tipoLogradouro} onChange={handleChange}>
                    <option value="Avenida">Avenida</option>
                    <option value="Rua">Rua</option>
                    <option value="Travessa">Travessa</option>
                    <option value="Alameda">Alameda</option>
                  </select>
                </div>
              </div>
              <div className="perfil-input-group">
                <label>Logradouro</label>
                <input type="text" name="logradouro" value={formData.logradouro} onChange={handleChange} />
              </div>
              <div className="perfil-input-row">
                <div className="perfil-input-group">
                  <label>Número</label>
                  <input type="text" name="numero" value={formData.numero} onChange={handleChange} />
                </div>
                <div className="perfil-input-group">
                  <label>CEP</label>
                  <input type="text" name="cep" value={formData.cep} onChange={handleChange} />
                </div>
              </div>
              <div className="perfil-input-row">
                <div className="perfil-input-group">
                  <label>Cidade</label>
                  <input type="text" name="cidade" value={formData.cidade} onChange={handleChange} />
                </div>
                <div className="perfil-input-group">
                  <label>UF</label>
                  <input type="text" name="uf" value={formData.uf} onChange={handleChange} />
                </div>
              </div>
              <div className="perfil-input-group">
                <label>Bairro</label>
                <input type="text" name="bairro" value={formData.bairro} onChange={handleChange} />
              </div>
              <div className="perfil-input-group">
                <label>Complemento</label>
                <input type="text" name="complemento" value={formData.complemento} onChange={handleChange} />
              </div>
            </div>

            <div className="perfil-login">
              <h2>Dados de Login</h2>
              <div className="perfil-input-group">
                <label>Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} />
              </div>
              <div className="perfil-input-row">
                <div className="perfil-input-group">
                  <label>Senha</label>
                  <input type="password" name="senha" value={formData.senha} onChange={handleChange} placeholder="********" />
                </div>
                <div className="perfil-input-group">
                  <label>Confirmar Senha</label>
                  <input type="password" name="confirmacaoSenha" value={formData.confirmacaoSenha} onChange={handleChange} placeholder="********" />
                </div>
              </div>
            </div>

            <div className="perfil-botoes">
              <button type="submit" className="perfil-botao-editar">EDITAR</button>
              <button type="button" onClick={handleCancel} className="perfil-botao-cancelar">CANCELAR</button>
            </div>

            <div className="perfil-conta-acoes">
              <button onClick={handleLogout} >Sair da Conta</button>
            </div>
          </form>
        )}

        {abaAtiva === 'MeusProdutos' && (
          <MeusProdutos />
        )}

        {abaAtiva === 'Comunidade' && (
          <div className="perfil-comunidade">
            <h2>Comunidade</h2>
            <p>Em breve você poderá interagir com a comunidade.</p>
          </div>
        )}
      </div>
      <InfoSection />
    </div>
  );
}

export default Perfil;
