import { PersonalDataEdit, EnderecoEntregaEdit, EnderecoCobrancaEdit, BotoesEdit } from './elements';

class EditCustomer {
  fillPersonalData(customerData: any) {
    if (customerData.name) cy.get(PersonalDataEdit.nomeCompleto).clear().type(customerData.name);
    if (customerData.birthdaydate) cy.get(PersonalDataEdit.dataNascimento).clear().type(customerData.birthdaydate);
    if (customerData.cpf) cy.get(PersonalDataEdit.cpf).clear().type(customerData.cpf);
    if (customerData.phone) cy.get(PersonalDataEdit.telefone).clear().type(customerData.phone);
    if (customerData.gender) cy.get(PersonalDataEdit.genero).select(customerData.gender);
    if (customerData.email) cy.get(PersonalDataEdit.email).clear().type(customerData.email);
  }

fillDeliveryAddress(deliveryAddress: any) {
  if (!deliveryAddress || !deliveryAddress.id) {
    throw new Error('deliveryAddress with id must be provided');
  }

  // Click the accordion header to expand it
  const accordionHeader = cy.get(`[data-cy=delivery-address-accordion-${deliveryAddress.id}] .accordion-header`);
  accordionHeader.click();
  
  // Wait for the accordion content to be visible
  cy.get(`[data-cy=delivery-address-accordion-${deliveryAddress.id}] .accordion-content`, { timeout: 5000 })
    .should('be.visible');
  
  // Use within to scope all subsequent commands to the accordion
  cy.get(`[data-cy=delivery-address-accordion-${deliveryAddress.id}]`).within(() => {
    if (deliveryAddress.observations) {
      cy.get('input[name="observacoes"]', { timeout: 5000 })
        .should('be.visible')
        .clear()
        .type(deliveryAddress.observations);
    }

    if (deliveryAddress.residenceType) cy.get(EnderecoEntregaEdit.tipo).select(deliveryAddress.residenceType);
    if (deliveryAddress.streetType) cy.get(EnderecoEntregaEdit.streetType).select(deliveryAddress.streetType);
    if (deliveryAddress.zipCode) cy.get(EnderecoEntregaEdit.cep).clear().type(deliveryAddress.zipCode);
    if (deliveryAddress.street) cy.get(EnderecoEntregaEdit.logradouro).clear().type(deliveryAddress.street);
    if (deliveryAddress.number) cy.get(EnderecoEntregaEdit.numero).clear().type(deliveryAddress.number);
    if (deliveryAddress.complement) cy.get(EnderecoEntregaEdit.complemento).clear().type(deliveryAddress.complement);
    if (deliveryAddress.neighborhood) cy.get(EnderecoEntregaEdit.bairro).clear().type(deliveryAddress.neighborhood);
    if (deliveryAddress.city) cy.get(EnderecoEntregaEdit.cidade).clear().type(deliveryAddress.city);
    if (deliveryAddress.state) cy.get(EnderecoEntregaEdit.uf).clear().type(deliveryAddress.state);
  });
}

  fillBillingAddress(billingAddress: any) {
    if (billingAddress.residenceType) cy.get(EnderecoCobrancaEdit.tipo).select(billingAddress.residenceType);
    if (billingAddress.streetType) cy.get(EnderecoCobrancaEdit.streetType).select(billingAddress.streetType);
    if (billingAddress.zipCode) cy.get(EnderecoCobrancaEdit.cep).clear().type(billingAddress.zipCode);
    if (billingAddress.street) cy.get(EnderecoCobrancaEdit.logradouro).clear().type(billingAddress.street);
    if (billingAddress.number) cy.get(EnderecoCobrancaEdit.numero).clear().type(billingAddress.number);
    if (billingAddress.complement) cy.get(EnderecoCobrancaEdit.complemento).clear().type(billingAddress.complement);
    if (billingAddress.neighborhood) cy.get(EnderecoCobrancaEdit.bairro).clear().type(billingAddress.neighborhood);
    if (billingAddress.city) cy.get(EnderecoCobrancaEdit.cidade).clear().type(billingAddress.city);
    if (billingAddress.state) cy.get(EnderecoCobrancaEdit.uf).clear().type(billingAddress.state);
  }

  submitForm() {
    cy.get(BotoesEdit.salvar).click();
  }
}

export default new EditCustomer();