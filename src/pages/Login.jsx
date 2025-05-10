import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthLogin';
import axios from 'axios'; // Adicionei o axios
import '../styles/Login.css';
import Header from '../components/Header';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('cliente');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    if (!email || !password) {
      setError('Email e senha são obrigatórios');
      setLoading(false);
      return;
    }

    try {
      let endpoint;
      let body;

      if (userType === 'cliente') {
        endpoint = 'http://localhost:3001/auth/cliente';
        body = { email, senha: password }; // Mudança: enviar 'senha' ao invés de 'password'
      } else if (userType === 'colaborador') {
        endpoint = 'http://localhost:3001/auth/colaborador'; // Usando a rota para autenticar como colaborador
        body = { email, senha: password }; // Mudança: enviar 'senha' ao invés de 'password'
      }

      const response = await axios.post(endpoint, body, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200 && response.data.token) {
        console.log('Dados recebidos do login:', response.data);

        // Realiza o login com os dados recebidos
       // Realiza o login com os dados recebidos
        let id;

        if (userType === 'colaborador') {
          id = response.data.colaborador.id;
        } else {
          id = response.data.cliente.id;
        }

        login({
          tipoUsuario: userType,
          email: response.data.email,
          token: response.data.token,
          nome: response.data.nome,
          id: id, // usa o valor definido com base no tipo de usuário
        });

        

        // Redireciona para a tela correta
        if (userType === 'colaborador') {
          navigate('/consultar-cliente'); // Para o colaborador
        } else {
          navigate('/'); // Para o cliente
        }
      } else {
        setError('Login falhou');
      }

    } catch (err) {
      setError(err.message || 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <div className='container'>
        <section className="login-section">
          <h2>Entre em sua conta!</h2>
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

          <form className="login-form" onSubmit={handleLogin}>
            {error && <div className="error-message">{error}</div>}
            
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            
            <input 
              type="password" 
              placeholder="Senha" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
            
            <button 
              type="submit" 
              disabled={loading || !email || !password}
            >
              {loading ? 'Carregando...' : 'ENTRAR'}
            </button>
          </form>
          <p>Ainda não possui uma conta? <Link to="/cadastro-cliente">Cadastre-se</Link></p>
        </section>
      </div>
    </div>
  );
}

export default Login;
