import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthLogin';
import '../styles/Login.css';
import Header from '../components/Header';
import InfoSection from '../components/InfoSection.jsx';

// Página de login que gerencia a autenticação para clientes e colaboradores.
function Login() {
  const [userType, setUserType] = useState('cliente');
  const [email, setEmail] = useState(''); 
  const { login, identifyUserByEmail } = useAuth();
  const navigate = useNavigate();

  // Função unificada para lidar com o login de ambos os tipos de usuário.
  const handleSimpleLogin = async (e) => {
    e.preventDefault();

    if (userType === 'cliente') {
      const trimmedEmail = (email || '').trim();
      if (!trimmedEmail) {
        alert('Por favor, insira um e-mail.');
        return;
      }
      try {
        // Armazena o e-mail para que a página de perfil possa recuperá-lo,
        // mesmo que o contexto do usuário ainda não esteja totalmente populado.
        localStorage.setItem('lastLoginEmail', trimmedEmail);
        await identifyUserByEmail(trimmedEmail, 'cliente');
        navigate('/shoplivros');
      } catch (err) {
        const msg = err?.message || err?.response?.data?.message || 'Erro ao efetuar login';
        alert(msg);
      }
      return;
    }

    if (userType === 'colaborador') {
      // Para colaboradores, o login é direto, sem necessidade de e-mail/senha (modo demonstração).
      try {
        const userData = {
          tipoUsuario: 'colaborador',
          token: 'mock-token-colaborador',
          nome: 'Colaborador',
          id: 'colaborador-mock-id'
        };
        await login(userData);
        navigate('/consultar-cliente'); 
      } catch (err) {
        alert(err?.message || 'Erro ao efetuar login como colaborador');
      }
      return;
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
              <input type='radio' name="user-type" value="cliente" checked={userType === 'cliente'} onChange={() => setUserType('cliente')} />
              <span className="radio-custom"></span> Cliente
            </label>
            <label className='radio-label'>
              <input type='radio' name="user-type" value="colaborador" checked={userType === 'colaborador'} onChange={() => setUserType('colaborador')} />
              <span className="radio-custom"></span> Colaborador
            </label>
          </div>

          <div className="login-form">
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