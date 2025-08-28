import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthLogin';
import '../styles/Login.css';
import Header from '../components/Header';
import InfoSection from '../components/InfoSection.jsx';

function Login() {
  const [userType, setUserType] = useState('cliente');
  const { login } = useAuth();
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
