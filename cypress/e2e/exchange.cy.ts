import ExchangePage from '../support/exchange/elements';
import exchangeData from '../fixtures/exchange.json';

interface SaleItem {
  id: number;
  items: Array<{
    book: {
      id: number;
    };
  }>;
}


describe('Fluxo Completo de Troca de Produtos', () => {
  let orderIdToTest: string; // Variável para armazenar o ID do pedido

  beforeEach(() => {
    // Login como Admin
    ExchangePage.loginAsCollaborator();
    ExchangePage.admin.filterOrdersBy('Aprovada');
    
    // Pega o ID do primeiro pedido da lista
    ExchangePage.admin.findAndGetFirstOrderId().then((orderId: string) => {
      orderIdToTest = orderId; 
      ExchangePage.admin.prepareOrderForExchange(orderIdToTest);
      // Guarda o ID para ser usado na *parte de admin* do teste
      cy.wrap(orderIdToTest).as('orderId');
    });
  });

it('1. Deve solicitar, autorizar e completar a troca de UM item', () => {
    const item = exchangeData.item1;

    cy.get<string>('@orderId').then((orderId: string) => {
    
      ExchangePage.loginAsCustomer(exchangeData.customer.email);
      ExchangePage.customer.navigateToMyProducts();
      ExchangePage.customer.filterProductsBy('Entregue');

      cy.on('window:alert', (text) => {
        expect(text).to.include('Solicitação de troca enviada com sucesso');
      });

      // Chama a nova função única. Ela faz tudo:
      // encontra o card, abre o modal, acha o item e solicita a troca.
      ExchangePage.customer.requestExchangeForFirstAvailableItem(Number(item.quantity), item.reason);
      
      // Verifica se o modal de troca fechou
      cy.get('.modal-troca').should('not.exist');
      cy.log('Cliente: Solicitação de troca enviada.');

      ExchangePage.loginAsCollaborator();
      ExchangePage.admin.navigateToOrders();
      ExchangePage.admin.filterOrdersBy('Troca');
      
      ExchangePage.admin.openAuthorizeModalForFirstOrder(); 
      ExchangePage.admin.confirmAuthorization();
      cy.log('Admin: Troca autorizada.');

      ExchangePage.admin.filterOrdersBy('Troca Autorizada');
      ExchangePage.admin.openReceiveModalForFirstOrder();
      
      ExchangePage.admin.confirmReceiptAndGetCoupon().then((couponCode: string) => {
        cy.log(`Admin: Recebimento confirmado. Cupom gerado: ${couponCode}`);
        cy.wrap(couponCode).as('couponCode');
      });
      cy.get('.modal__close-btn').click();

      ExchangePage.loginAsCustomer(exchangeData.customer.email);
      ExchangePage.customer.navigateToMyProducts();
      ExchangePage.customer.filterProductsBy('Devoluções/Trocas');
      
      // Abre o primeiro card que encontrar na aba "Devoluções/Trocas"
      ExchangePage.customer.openOrderDetailsOfFirstProductCard();
      
      ExchangePage.customer.verifyExchangeStatusInModal('Troca Concluída');
      
      cy.get<string>('@couponCode').then(couponCode => {
        ExchangePage.customer.verifyCouponInModal(couponCode);
      });
      cy.get('.modal__close-btn').click();
    });
  });

  it('2. Deve solicitar, autorizar e completar a troca do PEDIDO INTEIRO', () => {
    const reason = exchangeData.fullOrder.reason;
    
    cy.get<string>('@orderId').then((orderId: string) => {
      
      ExchangePage.loginAsCustomer(exchangeData.customer.email);
      ExchangePage.customer.navigateToMyProducts();
      ExchangePage.customer.filterProductsBy('Entregue');
      
      cy.on('window:alert', (text) => {
        expect(text).to.include('Solicitação de troca enviada com sucesso');
      });

      // Clica em "Trocar todos" no primeiro card da lista
      ExchangePage.customer.requestFullOrderExchangeOnFirstCard(reason); 
      
      cy.get('.modal-troca').should('not.exist');
      cy.log('Cliente: Solicitação de troca completa enviada.');

      ExchangePage.loginAsCollaborator();
      ExchangePage.admin.navigateToOrders();
      ExchangePage.admin.filterOrdersBy('Troca');
      ExchangePage.admin.openAuthorizeModalForFirstOrder();
      ExchangePage.admin.confirmAuthorization();
      cy.log('Admin: Troca autorizada.');

      ExchangePage.admin.filterOrdersBy('Troca Autorizada');
      ExchangePage.admin.openReceiveModalForFirstOrder();
      ExchangePage.admin.confirmReceiptAndGetCoupon().then((couponCode: string) => {
        cy.log(`Admin: Recebimento confirmado. Cupom gerado: ${couponCode}`);
        cy.wrap(couponCode).as('couponCode');
      });
      cy.get('.modal__close-btn').click();

      ExchangePage.loginAsCustomer(exchangeData.customer.email);
      ExchangePage.customer.navigateToMyProducts();
      ExchangePage.customer.filterProductsBy('Devoluções/Trocas');

      // Abre o primeiro card da lista para verificar o cupom
      ExchangePage.customer.openOrderDetailsOfFirstProductCard();
      
    });
  });

it('3. Deve solicitar e REJEITAR uma troca', () => {
    const item = exchangeData.item1;
    const reason = "Produto com defeito"; 

    cy.get<string>('@orderId').then((orderId: string) => {

      ExchangePage.loginAsCustomer(exchangeData.customer.email);
      ExchangePage.customer.navigateToMyProducts();
      ExchangePage.customer.filterProductsBy('Entregue');

      cy.on('window:alert', (text) => {
        expect(text).to.include('Solicitação de troca enviada com sucesso');
      });

      // Chama a função recursiva estável
      ExchangePage.customer.requestExchangeForFirstAvailableItem(Number(item.quantity), reason);
      cy.get('.modal-troca').should('not.exist');
      cy.log('Cliente: Solicitação de troca enviada.');

      ExchangePage.loginAsCollaborator();
      ExchangePage.admin.navigateToOrders();
      ExchangePage.admin.filterOrdersBy('Troca');
      ExchangePage.admin.openAuthorizeModalForFirstOrder();
      ExchangePage.admin.rejectAuthorization(); // Clica em 'Rejeitar' 
      cy.log('Admin: Troca rejeitada.');

      ExchangePage.loginAsCustomer(exchangeData.customer.email);
      ExchangePage.customer.navigateToMyProducts();
      ExchangePage.customer.filterProductsBy('Devoluções/Trocas');
      
      ExchangePage.customer.openOrderDetailsOfFirstProductCard();
      
      ExchangePage.customer.verifyExchangeStatusInModal('Troca não autorizada');
      cy.get('.modal__close-btn').click();
    });
  });
   })