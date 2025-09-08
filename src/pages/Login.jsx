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

  if (userType === 'cliente') {
    // CLIENTE -> login por e-mail
    const trimmed = (email || '').trim();
    if (!trimmed) {
      alert('Por favor, insira um e-mail.');
      return;
    }

    try {
      // salva para que o perfil consiga recuperar mesmo sem user no contexto
      localStorage.setItem('lastLoginEmail', trimmed);

      // identifyUserByEmail deve buscar o cliente, setar user no contexto e possibilitar o redirect
      await identifyUserByEmail(trimmed, 'cliente');
      // redireciona para perfil
      navigate('/perfil');
    } catch (err) {
      const msg = err?.message || err?.response?.data?.message || 'Erro ao efetuar login';
      alert(msg);
    }
    return;
  }

  if (userType === 'colaborador') {
    // COLABORADOR -> login direto (sem e-mail) e redireciona para a tela de consulta de clientes
    try {
      // Cria userData conforme o que seu AuthLogin espera (token e campos básicos)
      const userData = {
        tipoUsuario: 'colaborador',
        token: 'mock-token-colaborador',
        nome: 'Colaborador',
        id: 'colaborador-mock-id'
      };

      // seta o user no contexto
      await login(userData);

      // redireciona para a tela de consulta de clientes — substitua a rota se necessário
      navigate('/consultar-cliente'); 
    } catch (err) {
      alert(err?.message || 'Erro ao efetuar login como colaborador');
    }
    return;
  }

  // fallback (não deveria chegar aqui)
  alert('Selecione um tipo de usuário.');
};


  // função para identificar por e-mail
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
              className="email-input" 
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
