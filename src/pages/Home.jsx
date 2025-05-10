import React from 'react';
import Banner from '../components/Banner.jsx';
import Header from '../components/Header.jsx';
import InfoSection from '../components/InfoSection.jsx';

const Home = () => (
  <main className="main-content">
  <Header tipoUsuario="cliente" tipoBotao="BotaoLogin" />
  <Banner/>
    
  <InfoSection/>
  </main>
);

export default Home;

