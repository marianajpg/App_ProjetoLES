import { PersonalDataEdit, BotoesGerais } from './elements';

class EditCustomer {
  fillPersonalData(customerPersonalData: any) {
    cy.get(PersonalDataEdit.nomeCompleto).clear().type(customerPersonalData.name);
    // Para DatePicker, pode ser necessário um tratamento específico se o .type() não funcionar
    // Por enquanto, assumimos que o .type() funciona para o input subjacente
    cy.get(PersonalDataEdit.dataNascimento).clear().type(customerPersonalData.birthDate.slice(0, 10));
    cy.get(PersonalDataEdit.cpf).clear().type(customerPersonalData.cpf);
    cy.get(PersonalDataEdit.telefone).clear().type(customerPersonalData.phone.number); // Assumindo que phone.number é o telefone completo
    cy.get(PersonalDataEdit.genero).select(customerPersonalData.gender);
    cy.get(PersonalDataEdit.email).clear().type(customerPersonalData.email);
    cy.get(PersonalDataEdit.senha).clear().type(customerPersonalData.password);
    cy.get(PersonalDataEdit.confirmacaoSenha).clear().type(customerPersonalData.confPassword);
  }

  submitPersonalData() {
    cy.get(PersonalDataEdit.salvarButton).click();
  }

  // Se houver um botão para abrir o formulário de edição, ele pode ser adicionado aqui
  clickEditButton() {
    cy.get(BotoesGerais.editButton).click();
  }

  // Funções de verificação podem ser adaptadas para verificar os valores atuais dos campos
  verifyPersonalData(customer: any) {
    cy.get(PersonalDataEdit.nomeCompleto).should('have.value', customer.name);
    // Para data, pode ser necessário formatar o valor para corresponder ao que o input exibe
    cy.get(PersonalDataEdit.dataNascimento).should('have.value', customer.birthDate.slice(0, 10));
    cy.get(PersonalDataEdit.cpf).should('have.value', customer.cpf);
    cy.get(PersonalDataEdit.telefone).should('have.value', customer.phone.number);
    cy.get(PersonalDataEdit.genero).should('have.value', customer.gender);
    cy.get(PersonalDataEdit.email).should('have.value', customer.email);
  }
}

export default new EditCustomer();