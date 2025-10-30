import React, { useState, useEffect } from "react";
import "../styles/Perfil.css";
import Header from "../components/Header.jsx";
import { useAuth } from "../context/AuthLogin.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import MeusProdutos from "../components/MeusProdutos.jsx";
import AbasFiltro from "../components/AbasFiltro.jsx";
import InfoSection from "../components/InfoSection.jsx";

function Perfil() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [abaAtiva, setAbaAtiva] = useState("MeusProdutos");

  useEffect(() => {
    if (location.state && location.state.aba) {
        setAbaAtiva(location.state.aba);
    }
  }, [location.state]);
  
  // Estado para gerenciar todos os campos do formulário de perfil.
  const [formData, setFormData] = useState({
    nomeCompleto: "",
    nomeSocial: "",
    dataNascimento: "",
    cpf: "",
    telefone: "",
    email: "", 
    genero: "MASCULINO",
    tipoResidencia: "RESIDENCIAL",
    tipoLogradouro: "Avenida",
    logradouro: "",
    numero: "",
    cep: "",
    cidade: "",
    uf: "",
    bairro: "",
    complemento: "",
    cobranca_logradouro: "",
    cobranca_numero: "",
    cobranca_cep: "",
    cobranca_cidade: "",
    cobranca_uf: "",
    cobranca_bairro: "",
    cobranca_complemento: "",
  });

  // Efeito para popular o formulário quando o objeto `user` do contexto de autenticação é carregado.
  useEffect(() => {
    if (!user) return;

    // Normaliza a estrutura de endereços, que pode vir em diferentes formatos da API.
    const addressesRaw = user.addresses || user.address || user.addressList || [];
    const addresses = Array.isArray(addressesRaw) ? addressesRaw : (addressesRaw ? [addressesRaw] : []);

    // Encontra o endereço de cobrança prioritário, procurando por flags comuns no objeto.
    // Se nenhum for encontrado, assume o primeiro endereço da lista como padrão.
    const billingAddress = addresses.find(addr => {
      if (!addr) return false;
      if (addr.isBilling === true || addr.is_billing === true) return true;
      const type = String(addr.type || addr.addressType || addr.label || '').toLowerCase();
      return /cobr|billing/.test(type);
    }) || (addresses.length ? addresses[0] : null);

    // Popula o estado do formulário com os dados do usuário.
    setFormData(prev => ({
      ...prev,
      nomeCompleto: user.name || user.nome || prev.nomeCompleto || '',
      nomeSocial: user.nomeSocial || prev.nomeSocial || '',
      dataNascimento: user.birthdaydate ? String(user.birthdaydate).split('T')[0] : (user.birthdaydate || prev.dataNascimento || ''),
      cpf: user.cpf || prev.cpf || '',
      telefone: user.phone || user.telefone || prev.telefone || '',
      email: user.email || prev.email || '',

      // Endereço principal (pode ser diferente do de cobrança)
      logradouro: user.logradouro || (addresses[0] && (addresses[0].logradouro || addresses[0].street)) || prev.logradouro,
      numero: user.numero || (addresses[0] && (addresses[0].numero || addresses[0].number)) || prev.numero,
      cep: user.cep || (addresses[0] && (addresses[0].cep || addresses[0].zip || addresses[0].zipCode)) || prev.cep,
      cidade: user.cidade || (addresses[0] && (addresses[0].cidade || addresses[0].city)) || prev.cidade,
      uf: user.uf || (addresses[0] && (addresses[0].uf || addresses[0].state)) || prev.uf,
      bairro: user.bairro || (addresses[0] && (addresses[0].bairro || addresses[0].neighborhood)) || prev.bairro,
      complemento: user.complemento || (addresses[0] && (addresses[0].complemento || addresses[0].complement)) || prev.complemento,

      // Endereço de cobrança, preenchido apenas se `billingAddress` foi encontrado.
      cobranca_logradouro: billingAddress ? (billingAddress.logradouro || billingAddress.street || '') : prev.cobranca_logradouro,
      cobranca_numero: billingAddress ? (billingAddress.numero || billingAddress.number || '') : prev.cobranca_numero,
      cobranca_cep: billingAddress ? (billingAddress.cep || billingAddress.zip || billingAddress.zipCode || '') : prev.cobranca_cep,
      cobranca_cidade: billingAddress ? (billingAddress.cidade || billingAddress.city || '') : prev.cobranca_cidade,
      cobranca_uf: billingAddress ? (billingAddress.uf || billingAddress.state || '') : prev.cobranca_uf,
      cobranca_bairro: billingAddress ? (billingAddress.bairro || billingAddress.neighborhood || '') : prev.cobranca_bairro,
      cobranca_complemento: billingAddress ? (billingAddress.complemento || billingAddress.complement || '') : prev.cobranca_complemento,
    }));

  }, [user]);

  const abas = [
    { id: "Perfil", label: "Perfil" },
    { id: "MeusProdutos", label: "Meus Produtos" },
    { id: "Comunidade", label: "Comunidade" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Função de edição não implementada neste modo de demonstração.");
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
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

        {abaAtiva === "Perfil" && (
          <form onSubmit={handleSubmit} className="perfil-form">
            {/* Seção de Dados Pessoais */}
            <div className="perfil-dados">
              <div className="perfil-input-group">
                <label>Nome Completo</label>
                <input type="text" name="nomeCompleto" value={formData.nomeCompleto} onChange={handleChange} />
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

            {/* Seção de Endereço de Cobrança */}
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
                <input type="text" name="cobranca_logradouro" value={formData.cobranca_logradouro} onChange={handleChange} />
              </div>
              <div className="perfil-input-row">
                <div className="perfil-input-group">
                  <label>Número</label>
                  <input type="text" name="cobranca_numero" value={formData.cobranca_numero} onChange={handleChange} />
                </div>
                <div className="perfil-input-group">
                  <label>CEP</label>
                  <input type="text" name="cobranca_cep" value={formData.cobranca_cep} onChange={handleChange} />
                </div>
              </div>
              <div className="perfil-input-row">
                <div className="perfil-input-group">
                  <label>Cidade</label>
                  <input type="text" name="cobranca_cidade" value={formData.cobranca_cidade} onChange={handleChange} />
                </div>
                <div className="perfil-input-group">
                  <label>UF</label>
                  <input type="text" name="cobranca_uf" value={formData.cobranca_uf} onChange={handleChange} />
                </div>
              </div>
              <div className="perfil-input-group">
                <label>Bairro</label>
                <input type="text" name="cobranca_bairro" value={formData.cobranca_bairro} onChange={handleChange} />
              </div>
              <div className="perfil-input-group">
                <label>Complemento</label>
                <input type="text" name="cobranca_complemento" value={formData.cobranca_complemento} onChange={handleChange} />
              </div>
            </div>

            {/* Seção de Dados de Login */}
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
              <button onClick={handleLogout}>Sair da Conta</button>
            </div>
          </form>
        )}

        {abaAtiva === "MeusProdutos" && <MeusProdutos user={user} />}

        {abaAtiva === "Comunidade" && (
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