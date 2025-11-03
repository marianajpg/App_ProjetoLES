
class ExchangePage {
  // LOGIN 
  loginAsCustomer(email: string): void {
    cy.visit('/login');
    cy.get('input[name="user-type"][value="cliente"]').check({ force: true });
    cy.get('.email-input').type(email);
    cy.get('button[type="button"]').contains('ENTRAR').click();
    cy.url().should('not.include', '/login');
  }

  loginAsCollaborator(): void {
    cy.visit('/login');
    cy.get('input[name="user-type"][value="colaborador"]').check({ force: true });
    cy.get('button[type="button"]').contains('ENTRAR').click();
    // Navegação direta para a página de pedidos
    cy.visit('/consultar-pedidos');
  }

  // ADMIN (COLABORADOR) 
  admin = {
    navigateToOrders: (): void => {
      cy.visit('/consultar-pedidos');
      cy.contains('h1', 'Consulta de Pedidos').should('be.visible');
    },

    filterOrdersBy: (statusText: string): void => {
      // Usa o seletor mais robusto que encontramos
      cy.get('.abas-filtro').contains(statusText).click();
      cy.wait(1000); // Aguarda a filtragem
    },

    findAndGetFirstOrderId: (): Cypress.Chainable<string> => {
      return cy.get('.tabela-pedidos tbody tr')
        .first()
        .find('td:nth-child(1)') // Coluna "ID DO PEDIDO"
        .invoke('text');
    },

    clickOrderAction: (orderId: string, buttonText: string): void => {
      cy.get('.tabela-pedidos tbody tr')
        .contains('td', orderId)
        .parent('tr')
        .find('.status-button')
        .contains(buttonText)
        .click();
    },

    prepareOrderForExchange: (orderId: string): void => {
      cy.log(`Preparando Pedido ${orderId} para troca...`);
      // De 'Aprovada' para 'Em Trânsito'
      cy.log('Movendo para EM TRÂNSITO');
      cy.get('.tabela-pedidos tbody tr')
        .contains('td', orderId)
        .parent('tr')
        .find('.status-button')
        .contains('Em Trânsito')
        .click();
      cy.on('window:confirm', () => true);
      cy.wait(1000);

      // De 'Em Trânsito' para 'Entregue'
      cy.log('Movendo para ENTREGUE');
      cy.get('.abas-filtro').contains('Em Trânsito').click();
      cy.wait(1000);
      cy.get('.tabela-pedidos tbody tr')
        .contains('td', orderId)
        .parent('tr')
        .find('.status-button')
        .contains('Confirmar Entrega')
        .click();
      cy.on('window:confirm', () => true);
      cy.wait(1000);
      cy.get('.abas-filtro').contains('Entregue').click();
      cy.get('.tabela-pedidos tbody tr')
        .contains('td', orderId)
        .parent('tr')
        .should('be.visible');
      cy.log(`Pedido ${orderId} está ENTREGUE e pronto para troca.`);
    },

    openAuthorizeModalForFirstOrder: (): void => {
      cy.log(`Abrindo modal de autorização para o primeiro pedido.`);
      cy.get('.tabela-pedidos tbody tr') 
        .first()
        .find('.status-button')
        .contains('Autorizar Troca')
        .click();
      cy.get('.modal__title').contains('Autorizar Troca').should('be.visible');
    },

    confirmAuthorization: (): void => {
      cy.get('.modal__actions').contains('button','Autorizar').click();
      cy.wait(1000);
    },

    rejectAuthorization: (): void => {
      cy.get('.modal__actions').contains('button', 'Rejeitar').click();
      cy.wait(1000);
    },

    openReceiveModalForFirstOrder: (): void => {
      cy.log(`Abrindo modal de recebimento para o primeiro pedido.`);
      cy.get('.tabela-pedidos tbody tr')
        .first() 
        .find('.status-button')
        .contains('Confirmar Recebimento')
        .click();
      cy.get('.modal__title').contains('Confirmar Recebimento').should('be.visible');
    },

    confirmReceiptAndGetCoupon: (): Cypress.Chainable<string> => {
      cy.get('.modal__confirm-btn').contains('Confirmar Recebimento').click();
      return cy.get('.coupon-display strong', { timeout: 10000 })
        .should('be.visible')
        .invoke('text');
    }
  };

  // CUSTOMER (CLIENTE) 
  customer = {
    navigateToMyProducts: (): void => {
      cy.visit('/perfil');
      cy.get('button').contains('Meus Produtos').click();
      // Garante que os cards carregaram
      cy.get('.produto-card-meus-produtos').should('be.visible');
    },

    filterProductsBy: (statusText: string): void => {
      cy.get('.status-filtros button').contains(statusText).click();
      cy.wait(1000);
    },

    openOrderDetailsOfFirstProductCard: (): void => {
      cy.log(`Abrindo detalhes do primeiro ProdutoCard`);
      cy.get('.produto-card-meus-produtos .card') 
        .first() 
        .should('be.visible')
        .contains('button', 'Ver detalhes') 
        .click(); 
    
    },

    openOrderDetailsWithExchangeableItem: (): void => {
      cy.get('.produto-card-meus-produtos .card').each(($card, index, $list) => {
        cy.wrap($card).contains('button', 'Ver detalhes')
          .scrollIntoView() 
          .click({ force: true });
        cy.get('.modal__title').should('be.visible');

        cy.get('.modal').then(($modal) => {
          if ($modal.find('button.modal__secondary-action:contains("Trocar")').length > 0) {
            cy.log(`Exchangeable item found in modal for card at index ${index}.`);
            return false; 
          } else {
            cy.log(`No exchangeable item found in modal for card at index ${index}, closing modal.`);
            cy.get('.modal__close-btn').click();
           
            if (index === $list.length - 1) {
              throw new Error('No exchangeable item found in any product card.');
            }
          }
        });
      });
    },


            requestFullOrderExchangeOnFirstCard: (reason: string, cardIndex = 0): void => {
              cy.log(`Solicitando troca completa do pedido com loop. Tentativa no card ${cardIndex + 1}`);
        
              cy.get('.produto-card-meus-produtos .card').eq(cardIndex).then(($card) => {
                if (!$card.length) {
                  throw new Error('No "Trocar todos os itens" button found in any product card.');
                }
        
                cy.wrap($card).find('button').then(($buttons) => {
                  const trocarTodosButton = $buttons.filter(':contains("Trocar todos os itens")');
        
                  if (trocarTodosButton.length > 0) {
                    cy.wrap(trocarTodosButton)
                      .should('be.visible')
                      .click()
                      .then(() => {
                        cy.get('.reason-textarea').type(reason);
                        cy.get('.modal__confirm-btn').click();
                      });
                  } else {
                    cy.log(`No 'Trocar todos os itens' button found in card at index ${cardIndex}. Trying next card.`);
                   
                                this.customer.requestFullOrderExchangeOnFirstCard(reason, cardIndex + 1);
                              }                });
              });
            },    requestExchangeOfFirstItemWithExchangeButton: (quantity: number, reason: string): void => {
      cy.log(`Solicitando troca do primeiro item com botão 'Trocar'`);
      
      cy.get('.modal') 
        .find('.pedido-info__book-details') 
        .find('button.modal__secondary-action') 
        .contains('Trocar') 
        .first() 
        .should('be.visible')
        .wait(500) 
        .click({ force: true }); 
      
      cy.get('.modal-troca').should('be.visible');
      cy.get('textarea#reason').type(reason);
      cy.get('.modal-troca .modal__main-action').contains('Confirmar').click();
    },

    requestExchangeForFirstAvailableItem: (quantity: number, reason: string): void => {
      cy.log('Buscando primeiro item disponível para troca...');
      
      cy.get('.produto-card-meus-produtos .card').then($cards => {
        if ($cards.length === 0) {
          throw new Error('Nenhum card de produto encontrado na aba "Entregue".');
        }

        // Define uma função recursiva para iterar
        function findAndClick(cardIndex: number) {
          if (cardIndex >= $cards.length) {
            throw new Error('Nenhum item com botão "Trocar" foi encontrado em nenhum pedido.');
          }

          cy.log(`Verificando Card ${cardIndex + 1}/${$cards.length}`);
          const $card = $cards[cardIndex];

          // Abre o modal
          cy.wrap($card).contains('button', 'Ver detalhes').click();
          cy.get('.modal').should('be.visible');

          // Verifica o conteúdo do modal
          cy.get('body').then($body => {
            if ($body.find('.modal button.modal__secondary-action:contains("Trocar")').length > 0) {
              
              cy.log(`Encontrado item para troca no card ${cardIndex}.`);
              
              cy.get('.modal button.modal__secondary-action:contains("Trocar")')
                .first()
                .click();

              // Preenche o modal de troca
              cy.get('.modal-troca').should('be.visible');
              cy.get('textarea#reason').type(reason);
              // cy.get('input#quantity').clear().type(quantity.toString());
              cy.get('.modal-troca .modal__main-action').contains('Confirmar').click();

            } else {
              cy.log(`Nenhum item para troca no card ${cardIndex}. Fechando modal.`);
              cy.get('.modal__close-btn').click();
              cy.get('.modal').should('not.exist'); 
              
              // Tenta o próximo card (recursão)
              findAndClick(cardIndex + 1);
            }
          });
        }
        
        // Inicia a busca a partir do index 0
        findAndClick(0);
      });
    },
    verifyExchangeStatusInModal: (expectedStatus: string, cardIndex = 0): void => {
      cy.log(`Verificando status de troca no modal. Tentativa no card ${cardIndex + 1}`);

      cy.get('.produto-card-meus-produtos .card').eq(cardIndex).then(($card) => {
        if (!$card.length) {
          throw new Error(`Exchange status "${expectedStatus}" not found in any product card.`);
        }

        cy.wrap($card).contains('button', 'Ver detalhes')
          .scrollIntoView()
          .click({ force: true });

        cy.get('.modal__title').should('be.visible');

        cy.get('.pedido-info__book-details').then(($bookDetails) => {
          const statusElement = $bookDetails.find('div[class*="exchange-"]:contains("' + expectedStatus + '")');

          if (statusElement.length > 0) {
            cy.log(`Found expected exchange status "${expectedStatus}" in modal for card at index ${cardIndex}.`);
          } else {
            cy.log(`Exchange status "${expectedStatus}" not found in modal for card at index ${cardIndex}. Closing modal and trying next card.`);
            cy.get('.modal__close-btn').click();
            this.customer.verifyExchangeStatusInModal(expectedStatus, cardIndex + 1);
          }
        });
      });
    },
    verifyCouponInModal: (couponCode: string): void => {
      cy.get('.coupons-section');
    }
  };
}

export default new ExchangePage();