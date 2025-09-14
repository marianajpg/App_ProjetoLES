import React, { useState, useEffect } from "react";
import "../styles/Perfil.css";
import Header from "../components/Header.jsx";
import { useAuth } from "../context/AuthLogin.jsx";
import { useNavigate } from "react-router-dom";
import MeusProdutos from "../components/MeusProdutos.jsx";
import AbasFiltro from "../components/AbasFiltro.jsx";
import InfoSection from "../components/InfoSection.jsx";

function Perfil() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [abaAtiva, setAbaAtiva] = useState("Perfil");
  
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
    // campos para endereço de cobrança (poderão ser preenchidos a partir do addresses)
    cobranca_logradouro: "",
    cobranca_numero: "",
    cobranca_cep: "",
    cobranca_cidade: "",
    cobranca_uf: "",
    cobranca_bairro: "",
    cobranca_complemento: "",
  });

  useEffect(() => {
  if (!user) return;

  // pega possíveis coleções/formatos de endereço
  const addressesRaw = user.addresses || user.address || user.addressList || [];
  const addresses = Array.isArray(addressesRaw) ? addressesRaw : (addressesRaw ? [addressesRaw] : []);

  // encontra o endereço de cobrança por flags/nomes comuns, ou pega o primeiro
  const billing = addresses.find(addr => {
    if (!addr) return false;
    if (addr.isBilling === true || addr.is_billing === true) return true;
    const type = String(addr.type || addr.addressType || addr.label || '').toLowerCase();
    if (/cobr|billing|billingaddress|billing_address/.test(type)) return true;
    return false;
  }) || (addresses.length ? addresses[0] : null);


  // helper para extrair uma string de um valor bruto
  const normalizeObservation = (raw) => {
    if (raw === null || raw === undefined) return '';

    // se for string e não for apenas dígitos -> usamos direto
    if (typeof raw === 'string') {
      if (/^\d+$/.test(raw.trim())) return ''; // string numérica = provável id -> não usar
      return raw.trim();
    }

    // se for number -> ID, não vamos usar (precisa backend)
    if (typeof raw === 'number') return '';

    // se for objeto -> tenta propriedades comuns
    if (typeof raw === 'object') {
      const candidates = ['text','description','value','note','notes','name','label','descricao','observacao','observacoes','observation'];
      for (const k of candidates) {
        if (Object.prototype.hasOwnProperty.call(raw, k) && raw[k] !== null && raw[k] !== undefined) {
          const s = String(raw[k]).trim();
          if (s && !/^\d+$/.test(s)) return s;
        }
      }
      // se o objeto tem apenas 1 propriedade textual, use-a
      const stringProp = Object.keys(raw).find(k => typeof raw[k] === 'string' && raw[k].trim() !== '' && !/^\d+$/.test(raw[k].trim()));
      if (stringProp) return String(raw[stringProp]).trim();
      return '';
    }

    // fallback
    return String(raw);
  };

  // tenta extrair de billing.observations e depois do user.observations
  const rawFromBilling = billing ? billing.observations ?? billing.observation ?? billing.notes ?? billing.note : undefined;
  const rawFromUser = user.observations ?? user.observation ?? user.notes ?? user.note;

  let apelido = normalizeObservation(rawFromBilling);
  if (!apelido) apelido = normalizeObservation(rawFromUser);

  // Se ainda vazio, mas rawFromBilling é um número/id ou string numérica, logue instrução
  if (!apelido && rawFromBilling && (/^\d+$/.test(String(rawFromBilling)))) {
    console.warn("DEBUG: billing.observations parece ser um ID numérico:", rawFromBilling,
      " -> se for id, o backend precisa retornar o texto ou expandir essa relação.");
  }

  // Seta os campos do form 
  setFormData(prev => ({
    ...prev,
    nomeCompleto: user.name || user.nome || prev.nomeCompleto || '',
    nomeSocial: user.nomeSocial || prev.nomeSocial || '',
    dataNascimento: user.birthdaydate ? String(user.birthdaydate).split('T')[0] : (user.birthdaydate || prev.dataNascimento || ''),
    cpf: user.cpf || prev.cpf || '',
    telefone: user.phone || user.telefone || prev.telefone || '',
    email: user.email || prev.email || '',

    logradouro: user.logradouro || (addresses[0] && (addresses[0].logradouro || addresses[0].street)) || prev.logradouro,
    numero: user.numero || (addresses[0] && (addresses[0].numero || addresses[0].number)) || prev.numero,
    cep: user.cep || (addresses[0] && (addresses[0].cep || addresses[0].zip || addresses[0].zipCode)) || prev.cep,
    cidade: user.cidade || (addresses[0] && (addresses[0].cidade || addresses[0].city)) || prev.cidade,
    uf: user.uf || (addresses[0] && (addresses[0].uf || addresses[0].state)) || prev.uf,
    bairro: user.bairro || (addresses[0] && (addresses[0].bairro || addresses[0].neighborhood)) || prev.bairro,
    complemento: user.complemento || (addresses[0] && (addresses[0].complemento || addresses[0].complement)) || prev.complemento,

    cobranca_logradouro: billing ? (billing.logradouro || billing.street || '') : prev.cobranca_logradouro,
    cobranca_numero: billing ? (billing.numero || billing.number || '') : prev.cobranca_numero,
    cobranca_cep: billing ? (billing.cep || billing.zip || billing.zipCode || '') : prev.cobranca_cep,
    cobranca_cidade: billing ? (billing.cidade || billing.city || '') : prev.cobranca_cidade,
    cobranca_uf: billing ? (billing.uf || billing.state || '') : prev.cobranca_uf,
    cobranca_bairro: billing ? (billing.bairro || billing.neighborhood || '') : prev.cobranca_bairro,
    cobranca_complemento: billing ? (billing.complemento || billing.complement || '') : prev.cobranca_complemento,

    observacoes: apelido || prev.observacoes || '',
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
            <div className="perfil-dados">
              <div className="perfil-input-group">
                <label>Nome Completo</label>
                <input
                  type="text"
                  name="nomeCompleto"
                  value={formData.nomeCompleto}
                  onChange={handleChange}
                />
              </div>
              <div className="perfil-input-group">
                <label>Nome Social</label>
                <input
                  type="text"
                  name="nomeSocial"
                  value={formData.nomeSocial}
                  onChange={handleChange}
                />
              </div>
              <div className="perfil-input-row">
                <div className="perfil-input-group">
                  <label>Data Nascimento</label>
                  <input
                    type="date"
                    name="dataNascimento"
                    value={formData.dataNascimento}
                    onChange={handleChange}
                  />
                </div>
                <div className="perfil-input-group">
                  <label>CPF</label>
                  <input
                    type="text"
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleChange}
                    disabled
                  />
                </div>
              </div>
              <div className="perfil-input-row">
                <div className="perfil-input-group">
                  <label>Telefone</label>
                  <input
                    type="text"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                  />
                </div>
                <div className="perfil-input-group">
                  <label>Gênero</label>
                  <select
                    name="genero"
                    value={formData.genero}
                    onChange={handleChange}
                  >
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
                  <select
                    name="tipoResidencia"
                    value={formData.tipoResidencia}
                    onChange={handleChange}
                  >
                    <option value="RESIDENCIAL">Residencial</option>
                    <option value="COMERCIAL">Comercial</option>
                  </select>
                </div>
                <div className="perfil-input-group">
                  <label>Tipo de Logradouro</label>
                  <select
                    name="tipoLogradouro"
                    value={formData.tipoLogradouro}
                    onChange={handleChange}
                  >
                    <option value="Avenida">Avenida</option>
                    <option value="Rua">Rua</option>
                    <option value="Travessa">Travessa</option>
                    <option value="Alameda">Alameda</option>
                  </select>
                </div>
              </div>

              {/* Campos de cobrança — usam os campos cobranca_* do formData */}
              <div className="perfil-input-group">
                <label>Logradouro </label>
                <input
                  type="text"
                  name="cobranca_logradouro"
                  value={formData.cobranca_logradouro}
                  onChange={handleChange}
                />
              </div>

              <div className="perfil-input-row">
                <div className="perfil-input-group">
                  <label>Número </label>
                  <input
                    type="text"
                    name="cobranca_numero"
                    value={formData.cobranca_numero}
                    onChange={handleChange}
                  />
                </div>
                <div className="perfil-input-group">
                  <label>CEP </label>
                  <input
                    type="text"
                    name="cobranca_cep"
                    value={formData.cobranca_cep}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="perfil-input-row">
                <div className="perfil-input-group">
                  <label>Cidade </label>
                  <input
                    type="text"
                    name="cobranca_cidade"
                    value={formData.cobranca_cidade}
                    onChange={handleChange}
                  />
                </div>
                <div className="perfil-input-group">
                  <label>UF </label>
                  <input
                    type="text"
                    name="cobranca_uf"
                    value={formData.cobranca_uf}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="perfil-input-group">
                <label>Bairro </label>
                <input
                  type="text"
                  name="cobranca_bairro"
                  value={formData.cobranca_bairro}
                  onChange={handleChange}
                />
              </div>

              <div className="perfil-input-group">
                <label>Complemento </label>
                <input
                  type="text"
                  name="cobranca_complemento"
                  value={formData.cobranca_complemento}
                  onChange={handleChange}
                />
              </div>

              <div className="perfil-input-group">
                <label>Apelido</label>
                <input
                  type="text"
                  name="observacoes"
                  value={formData.observacoes}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="perfil-login">
              <h2>Dados de Login</h2>
              <div className="perfil-input-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="perfil-input-row">
                <div className="perfil-input-group">
                  <label>Senha</label>
                  <input
                    type="password"
                    name="senha"
                    value={formData.senha}
                    onChange={handleChange}
                    placeholder="********"
                  />
                </div>
                <div className="perfil-input-group">
                  <label>Confirmar Senha</label>
                  <input
                    type="password"
                    name="confirmacaoSenha"
                    value={formData.confirmacaoSenha}
                    onChange={handleChange}
                    placeholder="********"
                  />
                </div>
              </div>
            </div>

            <div className="perfil-botoes">
              <button type="submit" className="perfil-botao-editar">
                EDITAR
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="perfil-botao-cancelar"
              >
                CANCELAR
              </button>
            </div>

            <div className="perfil-conta-acoes">
              <button onClick={handleLogout}>Sair da Conta</button>
            </div>
          </form>
        )}

        {abaAtiva === "MeusProdutos" && <MeusProdutos />}

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
