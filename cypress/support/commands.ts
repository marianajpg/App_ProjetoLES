/// <reference types="cypress" />

Cypress.Commands.add('loginAsColaborador', () => {
  const userData = {
    tipoUsuario: 'colaborador',
    token: 'mock-token-colaborador',
    nome: 'Colaborador',
    id: 'colaborador-mock-id'
  };
  window.localStorage.setItem('user', JSON.stringify(userData));
  window.localStorage.setItem('token', userData.token);
});

export {};
