import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthLogin.jsx";
import { useNavigate } from "react-router-dom";
import "../styles/CadastroCliente.css";
import Header from "../components/Header.jsx";
import InfoSection from "../components/InfoSection.jsx";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/CadastroCliente.css";
import { postCustomer } from "../services/customers.jsx";

function CadastroCliente() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("dadosPessoais");
  const [loadingCEP, setLoadingCEP] = useState(false);
  const [cepError, setCepError] = useState(null);
 
  const [formData, setFormData] = useState({
    nomeCompleto: "",
    // dataNascimento: null,
    dataNascimento: "",
    cpf: "",
    telefone: "",
    genero: "F",
    streetTypeEntrega: "RUA",
    enderecoEntrega: "",
    numeroEntrega: "",
    complementoEntrega: "",
    bairroEntrega: "",
    cepEntrega: "",
    cidadeEntrega: "",
    ufEntrega: "",
    observacoesEntrega: "",
    tipoEnderecoEntrega: "RESIDENCIAL",
    enderecoCobrancaIgualEntrega: true,
    streetTypeCobranca: "RUA",
    enderecoCobranca: "",
    numeroCobranca: "",
    complementoCobranca: "",
    bairroCobranca: "",
    cepCobranca: "",
    cidadeCobranca: "",
    ufCobranca: "",
    observacoesCobranca: "",
    tipoEnderecoCobranca: "RESIDENCIAL",
    email: "",
    senha: "",
    confirmacaoSenha: "",
    numeroCartao: "",
    nomeImpresso: "",
    validadeCartao: null,  
    cvv: "",
    bandeiraCartao: "",
    preferencialCartao: false,
  });

  // Arrays de opções para os campos <select> do formulário.
  const generos = [
    { value: "F", label: "Feminino" },
    { value: "M", label: "Masculino" },
  ];
  const streetTypes = [
    { value: "RUA", label: "Rua" },
    { value: "AVENIDA", label: "Avenida" },
    { value: "ALAMEDA", label: "Alameda" },
    { value: "PRAÇA", label: "Praça" },
    { value: "VIELA", label: "Viela" },
    { value: "TRAVESSA", label: "Travessa" },
    { value: "RODOVIA", label: "Rodovia" },
  ];
  const tiposEndereco = [
    { value: "RESIDENCIAL", label: "Residencial" },
    { value: "COMERCIAL", label: "Comercial" },
  ];

  // Busca dados de endereço a partir de um CEP usando a API ViaCEP.
  const buscarCEP = async (cep, tipoEndereco) => {
    const cepNumerico = cep.replace(/\D/g, "");
    if (cepNumerico.length !== 8) return;

    setLoadingCEP(true);
    setCepError(null);

    try {
      const response = await axios.get(
        `https://viacep.com.br/ws/${cepNumerico}/json/`
      );
      if (response.data.erro) throw new Error("CEP não encontrado");

      const { logradouro, complemento, bairro, localidade, uf } = response.data;

      // Atualiza o estado do formulário com os dados de endereço retornados pela API.
      setFormData((prev) => ({
        ...prev,
        [`cep${tipoEndereco}`]: cep,
        [`endereco${tipoEndereco}`]: logradouro || "",
        [`complemento${tipoEndereco}`]:
          complemento || prev[`complemento${tipoEndereco}`],
        [`bairro${tipoEndereco}`]: bairro || "",
        [`cidade${tipoEndereco}`]: localidade || "",
        [`uf${tipoEndereco}`]: uf || "",
      }));
    } catch (error) {
      setCepError("CEP não encontrado ou erro na consulta");
    } finally {
      setLoadingCEP(false);
    }
  };

  // Formata e atualiza o campo de CEP, disparando a busca automática quando completo.
  const handleCEPChange = (e, tipoEndereco) => {
    const { value } = e.target;
    const cepFormatado = value
      .replace(/\D/g, "")
      .replace(/^(\d{5})(\d)/, "$1-$2");

    setFormData((prev) => ({ ...prev, [`cep${tipoEndereco}`]: cepFormatado }));

    if (value.replace(/\D/g, "").length === 8) {
      buscarCEP(value, tipoEndereco);
    }
  };
 
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Valida campos obrigatórios da primeira aba antes de permitir avançar.
  const validatePersonalData = () => {
    const {
      nomeCompleto,
      cpf,
      telefone,
      cepEntrega,
      numeroEntrega,
      enderecoEntrega,
      bairroEntrega,
      cidadeEntrega,
      ufEntrega,
      observacoesEntrega,
    } = formData;
    const missingFields = [];

    if (!nomeCompleto) missingFields.push("Nome Completo");
    if (!observacoesEntrega) missingFields.push("Apelido de Entrega");
    if (!cpf) missingFields.push("CPF");
    if (!telefone) missingFields.push("Telefone");
    if (!cepEntrega) missingFields.push("CEP de Entrega");
    if (!numeroEntrega) missingFields.push("Número de Entrega");
    if (!enderecoEntrega) missingFields.push("Endereço de Entrega");
    if (!bairroEntrega) missingFields.push("Bairro de Entrega");
    if (!cidadeEntrega) missingFields.push("Cidade de Entrega");
    if (!ufEntrega) missingFields.push("UF de Entrega");

    if (missingFields.length > 0) {
      alert(
        `Por favor, preencha os seguintes campos obrigatórios:\n\n- ${missingFields.join(
          "\n- "
        )}`
      );
      return false;
    }
    return true;
  };

  // Submete o formulário completo após montar o objeto de dados para a API.
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.senha !== formData.confirmacaoSenha) {
      alert("As senhas não coincidem. Por favor, verifique.");
      return;
    }

    // Monta o objeto `dadosParaEnvio` no formato esperado pela API `postCustomer`.
    const dadosParaEnvio = {
      name: formData.nomeCompleto,
      email: formData.email,
      password: formData.senha,
      passwordConfirmation: formData.confirmacaoSenha,
      cpf: formData.cpf,
      phone: formData.telefone,
      // birthdaydate: formData.dataNascimento ? formData.dataNascimento.toISOString().split('T')[0] : null,
      birthdaydate: formData.dataNascimento || null,
      gender: formData.genero,
      deliveryAddress: [
        {
          residenceType: formData.tipoEnderecoEntrega,
          streetType: formData.streetTypeEntrega,
          street: formData.enderecoEntrega,
          number: formData.numeroEntrega,
          complement: formData.complementoEntrega,
          neighborhood: formData.bairroEntrega,
          city: formData.cidadeEntrega,
          state: formData.ufEntrega,
          zipCode: formData.cepEntrega,
          observations: formData.observacoesEntrega,
        },
      ],
      card: [
        {
          cardNumber: formData.numeroCartao,
          cardHolderName: formData.nomeImpresso,
          cardExpirationDate: formData.validadeCartao
            ? new Date(
                formData.validadeCartao.getFullYear(),
                formData.validadeCartao.getMonth() + 1,
                0
              )
                .toISOString()
                .split("T")[0]
            : null,
          cardCVV: formData.cvv,
          cardBrand: formData.bandeiraCartao,
          preferredCard: formData.preferencialCartao,
        },
      ],
    };

    if (formData.enderecoCobrancaIgualEntrega) {
      dadosParaEnvio.billingAddress = dadosParaEnvio.deliveryAddress;
    } else {
      dadosParaEnvio.billingAddress = [
        {
          residenceType: formData.tipoEnderecoCobranca,
          streetType: formData.streetTypeCobranca,
          street: formData.enderecoCobranca,
          number: formData.numeroCobranca,
          complement: formData.complementoCobranca,
          neighborhood: formData.bairroCobranca,
          city: formData.cidadeCobranca,
          state: formData.ufCobranca,
          zipCode: formData.cepCobranca,
          observations: formData.observacoesCobranca,
        },
      ];
    }

    try {
      const response = await postCustomer(dadosParaEnvio);
      if (response.status === 201 || response.status === 200) {
        alert("Usuário e cartão cadastrados com sucesso!");
        login({ tipoUsuario: "cliente", email: formData.email });
        navigate("/shop-livros");
      } else {
        alert("Cadastro realizado com sucesso!");
        navigate("/shop-livros");
      }
    } catch (error) {
      console.error("Erro no cadastro:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        alert(error.response.data.message);
      } else {
        alert(
          "Ocorreu um erro durante o cadastro. Verifique os dados e tente novamente."
        );
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
            className={activeTab === "dadosPessoais" ? "active" : ""}
            onClick={() => setActiveTab("dadosPessoais")}
          >
            Dados Pessoais
          </button>
          <button
            className={activeTab === "dadosCartao" ? "active" : ""}
            onClick={() =>
              validatePersonalData() && setActiveTab("dadosCartao")
            }
          >
            Cartão Preferencial
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {activeTab === "dadosPessoais" && (
            <>
              <fieldset>
                <legend>Informações Pessoais</legend>
                <div className="form-group">
                  <div className="form-row">
                    <input
                      type="text"
                      name="nomeCompleto"
                      placeholder="Nome Completo"
                      value={formData.nomeCompleto}
                      onChange={handleChange}
                      required
                    />
                    {/* <DatePicker selected={formData.dataNascimento} onChange={(date) => setFormData({...formData, dataNascimento: date})} placeholderText="Data de nascimento" dateFormat="dd/MM/yyyy" /> */}
                    <DatePicker
                      selected={
                        formData.dataNascimento
                          ? new Date(formData.dataNascimento + "T00:00:00")
                          : null
                      }
                      onChange={(date) => {
                        if (date) {
                          const year = date.getFullYear();
                          const month = String(date.getMonth() + 1).padStart(
                            2,
                            "0"
                          );
                          const day = String(date.getDate()).padStart(2, "0");
                          setFormData({
                            ...formData,
                            dataNascimento: `${year}-${month}-${day}`,
                          }); // ✅ string
                        } else {
                          setFormData({ ...formData, dataNascimento: "" });
                        }
                      }}
                      placeholderText="Data de nascimento"
                      dateFormat="dd/MM/yyyy"
                    />
                  </div>
                  <div className="form-row">
                    <input
                      type="text"
                      name="cpf"
                      placeholder="CPF"
                      value={formData.cpf}
                      onChange={handleChange}
                      required
                    />
                    <input
                      type="tel"
                      name="telefone"
                      placeholder="Telefone"
                      value={formData.telefone}
                      onChange={handleChange}
                      required
                    />
                    <select
                      className="cadastro-select"
                      name="genero"
                      value={formData.genero}
                      onChange={handleChange}
                      required
                    >
                      {generos.map((g) => (
                        <option key={g.value} value={g.value}>
                          {g.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </fieldset>

              <fieldset>
                <legend>Endereço de Entrega</legend>
                <div className="form-group">
                  <div className="form-row">
                    <input
                      type="text"
                      name="cepEntrega"
                      placeholder="CEP"
                      value={formData.cepEntrega}
                      onChange={(e) => handleCEPChange(e, "Entrega")}
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
                  </div>
                  {loadingCEP && <span>Buscando CEP...</span>}
                  {cepError && <span className="error">{cepError}</span>}
                  <div className="form-row">
                    <select
                      className="cadastro-select"
                      name="tipoEnderecoEntrega"
                      value={formData.tipoEnderecoEntrega}
                      onChange={handleChange}
                      required
                    >
                      {tiposEndereco.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                    <select
                      className="cadastro-select"
                      name="streetTypeEntrega"
                      value={formData.streetTypeEntrega}
                      onChange={handleChange}
                      required
                    >
                      {streetTypes.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-row">
                    <input
                      type="text"
                      name="enderecoEntrega"
                      placeholder="Endereço"
                      value={formData.enderecoEntrega}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-row">
                    <input
                      type="text"
                      name="complementoEntrega"
                      placeholder="Complemento"
                      value={formData.complementoEntrega}
                      onChange={handleChange}
                    />
                    <input
                      type="text"
                      name="observacoesEntrega"
                      placeholder="Apelido"
                      value={formData.observacoesEntrega}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-row">
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
                    <span className="checkbox-custom"></span>Mesmo endereço de
                    entrega
                  </label>
                  {!formData.enderecoCobrancaIgualEntrega && (
                    <>
                      <div className="form-group">
                        <div className="form-row">
                          <input
                            type="text"
                            name="cepCobranca"
                            placeholder="CEP"
                            value={formData.cepCobranca}
                            onChange={(e) => handleCEPChange(e, "Cobranca")}
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
                        {loadingCEP && <span>Buscando CEP...</span>}
                        {cepError && <span className="error">{cepError}</span>}
                        <div className="form-row">
                          <select
                            className="cadastro-select"
                            name="tipoEnderecoCobranca"
                            value={formData.tipoEnderecoCobranca}
                            onChange={handleChange}
                            required
                          >
                            {tiposEndereco.map((t) => (
                              <option key={t.value} value={t.value}>
                                {t.label}
                              </option>
                            ))}
                          </select>
                          <select
                            className="cadastro-select"
                            name="streetTypeCobranca"
                            value={formData.streetTypeCobranca}
                            onChange={handleChange}
                            required
                          >
                            {streetTypes.map((t) => (
                              <option key={t.value} value={t.value}>
                                {t.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="form-row">
                          <input
                            type="text"
                            name="enderecoCobranca"
                            placeholder="Endereço"
                            value={formData.enderecoCobranca}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="form-row">
                          <input
                            type="text"
                            name="complementoCobranca"
                            placeholder="Complemento"
                            value={formData.complementoCobranca}
                            onChange={handleChange}
                          />
                          <input
                            type="text"
                            name="observacoesCobranca"
                            placeholder="Apelido"
                            value={formData.observacoesCobranca}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="form-row">
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
                      </div>
                    </>
                  )}
                </div>
              </fieldset>

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

              <button
                className="buttom-form"
                type="button"
                onClick={() =>
                  validatePersonalData() && setActiveTab("dadosCartao")
                }
              >
                Próximo
              </button>
            </>
          )}

          {activeTab === "dadosCartao" && (
            <>
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
                  <DatePicker
                    selected={formData.validadeCartao}
                    onChange={(date) =>
                      setFormData({ ...formData, validadeCartao: date })
                    }
                    placeholderText="Validade (MM/AAAA)"
                    dateFormat="MM/yyyy"
                    showMonthYearPicker
                    className="date-picker-full-width"
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
                    className="cadastro-select"
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
              <button className="buttom-form" type="submit">
                CADASTRAR
              </button>
            </>
          )}
        </form>
      </div>
      <InfoSection />
    </div>
  );
}

export default CadastroCliente;
