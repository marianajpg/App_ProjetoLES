import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthLogin';
import '../styles/Login.css';
import Header from '../components/Header';
import InfoSection from '../components/InfoSection.jsx';

function Login() {
  const [userType, setUserType] = useState('cliente');
  const [email, setEmail] = useState(''); 
  const { login, identifyUserByEmail } = useAuth(); //
  const navigate = useNavigate();

  const handleSimpleLogin = async (e) => {
  if (e && e.preventDefault) e.preventDefault();

  // garante que tipoUsuario esteja em 'cliente' (conforme seu requisito)
  if (userType !== 'cliente') {
    alert('Selecione "cliente" para realizar login por e-mail.');
    return;
  }

  const trimmed = (email || '').trim();
  if (!trimmed) {
    alert('Por favor, insira um e-mail.');
    return;
  }

  try {
    await identifyUserByEmail(trimmed, 'cliente'); // faz a requisição ao backend e seta o usuário
    // após setar o usuário no contexto, redireciona para perfil
    navigate('/perfil');
  } catch (err) {
    // err pode ser Error ou resposta do axios
    const msg = err?.message || (err?.response && err.response.data && err.response.data.message) || 'Erro ao efetuar login';
    alert(msg);
  }
};

  // Nova função para identificar por e-mail
  const handleIdentifyByEmail = async () => {
    if (!email) {
      alert('Por favor, insira um e-mail.');
      return;
    }
    try {
      // identifyUserByEmail vai lidar com o login e redirecionamento
      await identifyUserByEmail(email); 
      // O redirecionamento será feito dentro de identifyUserByEmail no AuthLogin.jsx
    } catch (error) {
      alert(error.message); // Exibe a mensagem de erro do AuthLogin
    }
  };

  return (
    <div>
      <Header tipoUsuario="cliente" tipoBotao="BotaoLogin" />
      <div className='container'>
        <section className="login-section">
          <h2>Selecione o tipo de acesso!</h2>
          <div className="user-type">
            <label className='radio-label'>
              <input 
                type='radio' 
                name="user-type" 
                value="cliente"
                checked={userType === 'cliente'} 
                onChange={() => setUserType('cliente')} 
              />
              <span className="radio-custom"></span> Cliente
            </label>

            <label className='radio-label'>
              <input 
                type='radio' 
                name="user-type" 
                value="colaborador"
                checked={userType === 'colaborador'} 
                onChange={() => setUserType('colaborador')} 
              />
              <span className="radio-custom"></span> Colaborador
            </label>
          </div>

          <div className="login-form">
            {/* Campo de e-mail */}
            <input
              type="email"
              placeholder="E-mail para identificação"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="email-input" // Adicionar uma classe para estilização se necessário
            />
            <button type="button" onClick={handleSimpleLogin}>ENTRAR</button>

          </div>
		  <p>Ainda não possui uma conta? <Link to="/cadastro-cliente">Cadastre-se</Link></p>
        </section>
      </div>
      <InfoSection />
    </div>
  );
}

export default Login;
