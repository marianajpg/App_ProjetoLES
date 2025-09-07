import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthLogin';
import '../styles/Login.css';
import Header from '../components/Header';
import InfoSection from '../components/InfoSection.jsx';

function Login() {
  const [userType, setUserType] = useState('cliente');
  const [email, setEmail] = useState(''); // Novo estado para o e-mail
  const { login, identifyUserByEmail } = useAuth(); // Adicionado identifyUserByEmail
  const navigate = useNavigate();

  const handleSimpleLogin = () => {
    const userData = {
      tipoUsuario: userType,
      token: 'mock-token', // Token simulado para que isAuthenticated seja verdadeiro
      nome: userType === 'colaborador' ? 'Colaborador' : 'Cliente',
      id: 'mock-id'
    };

    login(userData);
    navigate(userType === 'colaborador' ? '/consultar-cliente' : '/');
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
      // ou você pode adicionar uma lógica aqui se preferir redirecionar de forma diferente
      // Por exemplo: navigate('/');
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
            <button onClick={handleSimpleLogin}>
              ENTRAR
            </button>
          </div>
		  <p>Ainda não possui uma conta? <Link to="/cadastro-cliente">Cadastre-se</Link></p>
        </section>
      </div>
      <InfoSection />
    </div>
  );
}

export default Login;
