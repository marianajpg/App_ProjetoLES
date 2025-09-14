export const PersonalDataEdit = {
  nomeCompleto: 'input[name="nomeCompleto"]',
  dataNascimento: 'input[name="dataNascimento"]',
  cpf: 'input[name="cpf"]',
  telefone: 'input[name="telefone"]',
  genero: 'select[name="genero"]',
  email: 'input[name="email"]',
  senha: 'input[name="senha"]',
  confirmacaoSenha: 'input[name="confirmacaoSenha"]',
  // Botão de salvar dentro do formulário de edição
  salvarButton: 'button[type="submit"]',
};

export const EnderecoEdit = {
  // Seletores para campos de endereço na edição, se houver um formulário separado
  // Por enquanto, vamos focar nos dados pessoais, mas você pode adicionar aqui
  // cep: 'input[name="cepEntrega"]',
  // ...
};

export const BotoesGerais = {
  // Botão para abrir o modal de edição (se houver um)
  editButton: '.index-styles__StyledActionButton-sc-38363f88-0', // Manter este seletor se ele abre o modal de edição
  // Botão de fechar modal, se aplicável
  // closeButton: '.modal-styles__StyledModalFooterButton-sc-30a424b-1',
};