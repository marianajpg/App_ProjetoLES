export const PersonalData = {
  nomeCompleto: 'input[name="nomeCompleto"]',
  dataNascimento: 'input[placeholder="Data de nascimento"]',
  cpf: 'input[name="cpf"]',
  telefone: 'input[name="telefone"]',
  genero: 'select[name="genero"]',
  email: 'input[name="email"]',
  senha: 'input[name="senha"]',
  confirmacaoSenha: 'input[name="confirmacaoSenha"]',
  enderecoCobrancaIgualEntrega: 'input[name="enderecoCobrancaIgualEntrega"]',
};

export const EnderecoEntrega = {
  cep: 'input[name="cepEntrega"]',
  numero: 'input[name="numeroEntrega"]',
  tipoEndereco: 'select[name="tipoEnderecoEntrega"]',
  tipoLogradouro: 'select[name="streetTypeEntrega"]',
  logradouro: 'input[name="enderecoEntrega"]',
  complemento: 'input[name="complementoEntrega"]',
  apelido: 'input[name="observacoesEntrega"]',
  bairro: 'input[name="bairroEntrega"]',
  cidade: 'input[name="cidadeEntrega"]',
  uf: 'input[name="ufEntrega"]',
};

export const EnderecoCobranca = {
    cep: 'input[name="cepCobranca"]',
    numero: 'input[name="numeroCobranca"]',
    tipoEndereco: 'select[name="tipoEnderecoCobranca"]',
    tipoLogradouro: 'select[name="streetTypeCobranca"]',
    logradouro: 'input[name="enderecoCobranca"]',
    complemento: 'input[name="complementoCobranca"]',
    apelido: 'input[name="observacoesCobranca"]',
    bairro: 'input[name="bairroCobranca"]',
    cidade: 'input[name="cidadeCobranca"]',
    uf: 'input[name="ufCobranca"]',
};

export const Cartao = {
  numeroCartao: 'input[name="numeroCartao"]',
  nomeImpresso: 'input[name="nomeImpresso"]',
  validade: 'input[name="validadeCartao"]',
  cvv: 'input[name="cvv"]',
  bandeira: 'select[name="bandeiraCartao"]',
};

export const Botoes = {
  proximo: 'button.buttom-form[type="button"]',
  cadastrar: 'button.buttom-form[type="submit"]',
  adicionarCliente: '.index-styles__StyledAddButton-sc-2bd0f11a-0', // Este seletor pode precisar de ajuste
};