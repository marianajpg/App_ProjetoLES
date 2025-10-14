import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header.jsx';
import Breadcrumb from '../components/Breadcrumb.jsx';
import InfoSection from '../components/InfoSection.jsx';
import { postCreditcards, deleteCreditcards, getCreditcardsByEmail } from '../services/creditcards.jsx';
import { postCheckout } from '../services/checkout.jsx';
import { getCupom } from '../services/cupons.jsx';
import { postCalculateShipping, postShipping } from '../services/shipping.jsx';
import CartaoCard from '../components/CartaoCard.jsx';
import { getAddressById, deleteAddress, putAddress, postAddress } from '../services/addresses.jsx';
import EnderecoCard from '../components/EnderecoCard.jsx';
import GenericModal from '../components/GenericModal.jsx';
import EditAddressForm from '../components/EditAddressForm.jsx';
import { useAuth } from '../context/AuthLogin.jsx';
import { useCarrinho } from '../context/CarrinhoContext.jsx';
import DatePicker from "react-datepicker";
import Select from 'react-select';
import "react-datepicker/dist/react-datepicker.css";
import '../styles/Pagamento.css';

const Pagamento = () => {
  const location = useLocation();
  const { itens, subtotal } = location.state || { itens: [], subtotal: 0 };
  const { user } = useAuth();
  const { cartId } = useCarrinho();
  const navigate = useNavigate();
  const [cupom, setCupom] = useState('');
  const [cuponsAplicados, setCuponsAplicados] = useState([]);
  const [availableCupons, setAvailableCupons] = useState({});
  const [formaPagamento, setFormaPagamento] = useState('cartao');
  const [frete, setFrete] = useState('padrao');
  const [shippingOptions, setShippingOptions] = useState([]); // New state variable
  const [checkoutResponse, setCheckoutResponse] = useState(null); // New state variable
  const [contato, setContato] = useState({
    nome: '',
    email: '',
    telefone: '',
  });
  const [cartao, setCartao] = useState({
    numero: '',
    validade: null,
    nome: '',
    bandeira: 'visa',
    cvv: ''
  });
  const [cartoesSalvos, setCartoesSalvos] = useState([]);
  const [cartoesSelecionados, setCartoesSelecionados] = useState([]);
  const [valorPagar, setValorPagar] = useState({});
  const [enderecos, setEnderecos] = useState([]);
  const [enderecoSelecionado, setEnderecoSelecionado] = useState('');
  const [selectedAddressDetails, setSelectedAddressDetails] = useState(null);
  const [novoEndereco, setNovoEndereco] = useState({
    residenceType: 'RESIDENCIAL',
    streetType: 'RUA',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',
    observations: ''
  });

  const tiposEndereco = [
    { value: 'RESIDENCIAL', label: 'Residencial' },
    { value: 'COMERCIAL', label: 'Comercial' },
    { value: 'OUTRO', label: 'Outro' }
  ];

  const tiposLogradouro = [
    { value: 'RUA', label: 'Rua' },
    { value: 'AVENIDA', label: 'Avenida' },
    { value: 'ALAMEDA', label: 'Alameda' },
    { value: 'PRACA', label: 'Praça' },
    { value: 'TRAVESSA', label: 'Travessa' },
    { value: 'RODOVIA', label: 'Rodovia' },
    { value: 'ESTRADA', label: 'Estrada' },
    { value: 'OUTRO', label: 'Outro' },
  ];
  const [mostrarNovoEndereco, setMostrarNovoEndereco] = useState(false);

  const [salvarCartao, setSalvarCartao] = useState(false);
  const [mostrarNovoCartao, setMostrarNovoCartao] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [editedFormData, setEditedFormData] = useState(null);

  useEffect(() => {
  if (user) {
    setContato({
      nome: user.name || '',
      email: user.email || '',
      telefone: user.phone || '',
    });

    if (user && user.id) {
      getAddressById(user.id)
        .then(allAddresses => {
          setEnderecos(allAddresses);
          const deliveryAddresses = allAddresses.filter(addr => addr.type === 'DELIVERY');
          if (deliveryAddresses.length > 0) {
            setEnderecoSelecionado(deliveryAddresses[0].id);
          } else {
            setEnderecoSelecionado('');
          }
        })
        .catch(error => {
          console.error("Erro ao buscar endereços:", error);
          setEnderecos([]);
        });

      getCreditcardsByEmail(user.email)
        .then(cards => {
          if (cards && cards.length > 0) {
            const formattedCards = cards.map(card => ({
              id: card.id,
              numero: card.cardNumber,
              nome: card.cardHolderName,
              bandeira: card.cardBrand,
              validade: card.cardExpirationDate,
              preferredCard: card.preferredCard
            }));
            setCartoesSalvos(formattedCards);
            setCartoesSelecionados([]);
          }
        })
        .catch(error => {
          console.error("Erro ao buscar cartões:", error);
          setCartoesSalvos([]);
        });
    }
  }
}, [user]);


  useEffect(() => {
    if (enderecoSelecionado) {
      const details = enderecos.find(e => e.id === enderecoSelecionado);
      setSelectedAddressDetails(details);
    } else {
      setSelectedAddressDetails(null);
    }
  }, [enderecoSelecionado, enderecos]);

  useEffect(() => {
    const fetchCupons = async () => {
      try {
        const cupons = await getCupom();
        const formattedCupons = {};
        cupons.forEach(cupom => {
          formattedCupons[cupom.code] = parseFloat(cupom.value);
        });
        setAvailableCupons(formattedCupons);
      } catch (error) {
        console.error("Erro ao buscar cupons:", error);
      }
    };
    fetchCupons();
  }, []);

  const handleEditAddress = (id) => {
    const addressToEdit = enderecos.find(e => e.id === id);
    setEditingAddress(addressToEdit);
    setIsEditModalOpen(true);
  };

  const handleUpdateAddress = async () => {
    if (!editedFormData) return;

    try {
      const updatedAddress = await putAddress(editingAddress.id, editedFormData);
      // Atualiza a lista de endereços local
      const updatedEnderecos = enderecos.map(e => 
        e.id === editingAddress.id ? updatedAddress : e
      );
      setEnderecos(updatedEnderecos);
      alert('Endereço atualizado com sucesso!');
      setIsEditModalOpen(false);
      setEditingAddress(null);
    } catch (error) {
      console.error("Erro ao atualizar endereço:", error);
      alert('Falha ao atualizar o endereço.');
    }
  };

  const handleDeleteCard = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este cartão?')) {
      try {
        await deleteCreditcards(id);
        alert('Cartão excluído com sucesso!');
        const updatedCartoes = cartoesSalvos.filter(c => c.id !== id);
        setCartoesSalvos(updatedCartoes);
        if (cartaoSelecionado === id) {
          setCartaoSelecionado('');
        }
      } catch (error) {
        console.error("Erro ao excluir cartão:", error);
        alert('Falha ao excluir o cartão.');
      }
    }
  };

  const handleDeleteAddress = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este endereço?')) {
      try {
        await deleteAddress(id);
        alert('Endereço excluído com sucesso!');
        // Atualizar a lista de endereços
        const updatedEnderecos = enderecos.filter(e => e.id !== id);
        setEnderecos(updatedEnderecos);
        if (enderecoSelecionado === id) {
          setEnderecoSelecionado('');
        }
      } catch (error) {
        console.error("Erro ao excluir endereço:", error);
        alert('Falha ao excluir o endereço.');
      }
    }
  };

  const handleAdicionarEndereco = async () => {
    if (!user || !user.id) {
      alert('Você precisa estar logado para adicionar um endereço.');
      return;
    }

    const addressData = {
      ...novoEndereco,
      costumerId: user.id,
      type: 'DELIVERY' // Todos os endereços cadastrados aqui são de entrega
    };

    try {
      const newAddress = await postAddress(addressData);
      alert('Endereço adicionado com sucesso!');
      
      // Atualiza a lista de endereços e seleciona o novo
      const updatedEnderecos = [...enderecos, newAddress];
      setEnderecos(updatedEnderecos);
      setEnderecoSelecionado(newAddress.id);

      // Limpa o formulário e o fecha
      setNovoEndereco({
        residenceType: 'RESIDENCIAL', streetType: 'RUA', street: '', number: '', complement: '',
        neighborhood: '', city: '', state: '', zipCode: '', observations: ''
      });
      setMostrarNovoEndereco(false);

    } catch (error) {
      console.error("Erro ao adicionar endereço:", error);
      alert('Falha ao adicionar o endereço. Verifique os campos.');
    }
  };

  useEffect(() => {
    const fetchShippingOptions = async () => {
      if (!enderecoSelecionado || itens.length === 0 || !selectedAddressDetails) {
        setShippingOptions([]);
        setFrete('padrao'); // Reset frete selection
        return;
      }

      const toPostalCode = selectedAddressDetails.zipCode.replace(/\D/g, ''); // Clean zip code

      const totalQuantity = itens.reduce((sum, item) => sum + item.quantity, 0);
      const totalGrossPrice = itens.reduce((sum, item) => sum + (item.valorVenda * item.quantity), 0);

      const maxDimensions = itens.reduce((max, item) => 
        ({
        height: Math.max(max.height, item.dimensions?.height || 0),
        width: Math.max(max.width, item.dimensions?.width || 0),
        depth: max.depth + (item.dimensions?.depth || 0),
        weight: (max.weight + (item.dimensions?.weight || 0))/100}), 
        { height: 0, width: 0, depth: 0, weight: 0 })
      console.log("Pagamento: Itens no carrinho:", itens);
      console.log("Pagamento: Dimensões máximas calculadas:", maxDimensions);

      const shippingData = {
        toPostalCode,
        cartItems: [
          {
            quantity: totalQuantity,
            dimensions: maxDimensions,
            price: totalGrossPrice
          }
        ]
      };
      console.log("Pagamento: Payload para cálculo de frete:", shippingData);

      try {
        const response = await postCalculateShipping(shippingData);
        console.log("Pagamento: Resposta do cálculo de frete:", response);
        const validShippingOptions = response.services.filter(service => !service.error);
        console.log("Pagamento: Opções de frete válidas:", validShippingOptions);
        setShippingOptions(validShippingOptions);
        
        if (validShippingOptions.length > 0) {
          setFrete(validShippingOptions[0].name); // Select the first valid option by default
        } else {
          setFrete('padrao');
        }
      } catch (error) {
        console.error("Erro ao calcular frete:", error);
        setShippingOptions([]);
        setFrete('padrao');
      }
    };

    fetchShippingOptions();
  }, [enderecoSelecionado, itens, selectedAddressDetails]);

  const valorFrete = parseFloat(shippingOptions.find(option => option.name === frete)?.price || 0);
  const total = subtotal + valorFrete;

  const handleAdicionarCartao = async () => {
    if (!user || !user.id) {
      alert('Você precisa estar logado para adicionar um cartão.');
      return;
    }

    if (!cartao.validade) {
      alert('Por favor, selecione a data de validade.');
      return;
    }
    // Pega o último dia do mês selecionado
    const data = new Date(cartao.validade);
    const ultimoDia = new Date(data.getFullYear(), data.getMonth() + 1, 0);
    const cardExpirationDate = ultimoDia.toISOString().split('T')[0]; // Formato YYYY-MM-DD

    const cardData = {
      costumerId: user.id,
      cardNumber: cartao.numero,
      cardHolderName: cartao.nome,
      cardExpirationDate: cardExpirationDate,
      cardCVV: cartao.cvv,
      cardBrand: cartao.bandeira.toUpperCase(),
      preferredCard: salvarCartao
    };

    try {
      const newCard = await postCreditcards(cardData);
      alert('Cartão adicionado com sucesso!');
      
      // Adiciona o novo cartão à lista localmente
      const updatedCartoes = [...cartoesSalvos, {
        id: newCard.id,
        numero: newCard.cardNumber,
        nome: newCard.cardHolderName,
        bandeira: newCard.cardBrand,
        validade: newCard.cardExpirationDate,
        preferredCard: newCard.preferredCard
      }];
      setCartoesSalvos(updatedCartoes);
      setCartoesSelecionados(prev => [...prev, newCard.id]); // Seleciona o novo cartão
      setValorPagar(prev => ({ ...prev, [newCard.id]: 0 })); // Inicializa o valor

      // Limpa o formulário
      setCartao({ numero: '', validade: null, nome: '', bandeira: 'visa', cvv: '' });
      setSalvarCartao(false);
      setMostrarNovoCartao(false); // Esconde o formulário após adicionar

    } catch (error) {
      console.error("Erro ao adicionar cartão:", error);
      alert('Falha ao adicionar o cartão. Verifique os dados.');
    }
  };

  const handleSelecaoCartao = (selectedOptions) => {
    const selectedIds = selectedOptions ? selectedOptions.map(option => option.value) : [];
    setCartoesSelecionados(selectedIds);

    // Inicializa valorPagar para novos cartões selecionados
    const newValorPagar = { ...valorPagar };
    selectedIds.forEach(id => {
      if (!newValorPagar[id]) {
        newValorPagar[id] = 0;
      }
    });
    // Remove valores de cartões deselecionados
    Object.keys(newValorPagar).forEach(id => {
      if (!selectedIds.includes(Number(id))) {
        delete newValorPagar[id];
      }
    });
    setValorPagar(newValorPagar);
  };

  const handleAmountChange = (cardId, amount) => {
    setValorPagar(prev => ({ ...prev, [cardId]: amount }));
  };

  const handleFinalizarCompra = async () => {
    if (!user || !user.id) {
      alert('Você precisa estar logado para finalizar a compra.');
      return;
    }
    if (!cartId) {
      alert('Carrinho não encontrado. Por favor, adicione itens ao carrinho.');
      return;
    }
    if (!enderecoSelecionado) {
      alert('Selecione um endereço de entrega.');
      return;
    }

    if (cartoesSelecionados.length === 0) {
      alert('Selecione ao menos um cartão para finalizar a compra.');
      return;
    }

    let totalPago = 0;
    const payments = [];

    // Card payments
    for (const cardId of cartoesSelecionados) {
      const valor = valorPagar[cardId] || 0;
      if (valor < 10) {
        alert(`O valor mínimo por cartão é R$10,00. Verifique o cartão ID ${cardId}.`);
        return;
      }
      totalPago += valor;

      const cardDetails = cartoesSalvos.find(c => c.id === cardId);
      if (cardDetails) {
        payments.push({
          type: "CARD",
          cardId: cardDetails.id,
          amount: valor,
          saveCard: cardDetails.preferredCard // Assuming preferredCard indicates saving
        });
      }
    }

    // Coupon payments
    const descontoTotalCupons = calcularDesconto();
    if (descontoTotalCupons > 0) {
      cuponsAplicados.forEach(couponCode => {
        payments.push({
          type: "COUPON",
          couponCode: couponCode,
          amount: availableCupons[couponCode] // Assuming cuponsDisponiveis stores the amount
        });
      });
    }

    if (totalPago.toFixed(2) !== totalComDesconto.toFixed(2)) {
      const diferenca = totalComDesconto- totalPago
      alert(`O valor total dos pagamentos (R$${totalPago.toFixed(2)}) não corresponde ao valor da compra (R$${totalComDesconto.toFixed(2)}). DIferença de ${diferenca.toFixed(2)}`);
      return;
    }

    const checkoutData = {
      cartId: cartId,
      addressId: enderecoSelecionado,
      clientId: user.id,
      payments: payments
    };
    const selectedShippingOption = shippingOptions.find(option => option.name === frete);
      
    try {
      if ( selectedShippingOption) {

        checkoutData.selectedShipping = {
          serviceId: selectedShippingOption.id || "melhor_envio_123",
          freightValue: parseFloat(selectedShippingOption.price),
          carrier: selectedShippingOption.company?.name || "Transportadora X",
          serviceName: selectedShippingOption.name
        };
        
          const response = await postCheckout(checkoutData);
          setCheckoutResponse(response); // Store the response
          console.log("Checkout Response:", response); // Log the response
          alert('Compra finalizada com sucesso!');
      navigate('/perfil');      
        if (response.id || response.saleId ){
          const shippingPayload = {
            saleId: response.id || response.saleId, 
            freightValue: parseFloat(selectedShippingOption.price),
            carrier: selectedShippingOption.company.name,
            serviceName: selectedShippingOption.name,
            trackingCode: "null" // `TRK-${Math.random().toString(36).substring(2, 10).toUpperCase()}`
          };
          await postShipping(shippingPayload);
          console.log("Shipping registered successfully:", shippingPayload);
        } else{
          console.log("Shipping not registered:", shippingPayload);
        }
      }

      // navigate('/confirmacao-pedido/' + response.id);
    } catch (error) {
      console.error("Erro ao finalizar compra:", error);
      const errorMessage = error.response?.data?.message || error.message || 'Falha ao finalizar a compra. Verifique os dados e tente novamente.';
      alert(errorMessage);
    }
  };

  const handleAplicarCupom = () => {
    if (cuponsAplicados.includes(cupom)) {
      alert('Este cupom já foi aplicado.');
      return;
    }

    if (availableCupons[cupom]) {
      setCuponsAplicados([...cuponsAplicados, cupom]);
      setCupom('');
    } else {
      alert('Cupom inválido.');
    }
  };

  const calcularDesconto = () => {
    return cuponsAplicados.reduce((acc, cupom) => acc + availableCupons[cupom], 0);
  };

  const totalComDesconto = total - calcularDesconto();

  const customSelectStyles = {
    control: (provided) => ({
      ...provided,
      borderColor: '#ddd',
      boxShadow: 'none',
      '&:hover': {
        borderColor: '#b3b3b3'
      }
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: '#e0e0e0'
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: '#333'
    }),
  };

  return (
    <div>
      <Header />
      <Breadcrumb items={[{ label: 'Home', link: '/' }, { label: 'Carrinho', link: '/carrinho' }, { label: 'Pagamento', link: '' }]} />
      <div className="pagamento-container">
        <h1>PAGAMENTO</h1>

        <div className="pagamento-layout">
          {/* Coluna da Esquerda: Formulário de Contato e Pagamento */}
          <div className="coluna-esquerda">
            {/* Formulário de Contato */}
            <div className="formulario-contato">
              <h2>Contato</h2>
              <input
                type="text"
                placeholder="Nome"
                value={contato.nome}
                onChange={(e) => setContato({ ...contato, nome: e.target.value })}
                data-cy="contact-name-input"
              />
              <input
                type="email"
                placeholder="E-mail"
                value={contato.email}
                onChange={(e) => setContato({ ...contato, email: e.target.value })}
                data-cy="contact-email-input"
              />
              <input
                type="tel"
                placeholder="Telefone"
                value={contato.telefone}
                onChange={(e) => setContato({ ...contato, telefone: e.target.value })}
                data-cy="contact-phone-input"
              />
            </div>

            {/* Endereço de Entrega */}
            <div className="endereco-entrega">
              <h2>Endereço de Entrega</h2>
              <select
                value={enderecoSelecionado}
                onChange={(e) => setEnderecoSelecionado(Number(e.target.value))}
                data-cy="address-select"
              >
                {enderecos.filter(e => e.type === 'DELIVERY').map((endereco) => (
                  <option key={endereco.id} value={endereco.id}>
                    {endereco.observations || `${endereco.street}, ${endereco.number}`}
                  </option>
                ))}
              </select>

              {selectedAddressDetails && (
                <EnderecoCard 
                  endereco={selectedAddressDetails}
                  onEdit={handleEditAddress}
                  onDelete={handleDeleteAddress}
                />
              )}

              {!mostrarNovoEndereco && (
                <button className="botao-novo-endereco"
                  onClick={() => setMostrarNovoEndereco(true)}
                  data-cy="add-new-address-button">
                  Cadastrar Novo Endereço
                </button>
              )}

              {mostrarNovoEndereco && (
                <div className="novo-endereco-formulario">
                  <h3>Cadastrar Novo Endereço</h3>
                  <div className="novo-endereco-grid">
                    
                    <div className="form-group full-width">

                        <input type="text" placeholder="Apelido do Endereço" name="observations" value={novoEndereco.observations} onChange={(e) => setNovoEndereco({ ...novoEndereco, observations: e.target.value })} required data-cy="new-address-observations-input" />
                    </div>

                    <div className="form-group">

                        <input type="text" placeholder="CEP" name="zipCode" value={novoEndereco.zipCode} onChange={(e) => setNovoEndereco({ ...novoEndereco, zipCode: e.target.value })} required data-cy="new-address-zipcode-input" />
                    </div>

                    <div className="form-group">
                        <input type="text" placeholder="Logradouro" name="street" value={novoEndereco.street} onChange={(e) => setNovoEndereco({ ...novoEndereco, street: e.target.value })} required data-cy="new-address-street-input" />
                    </div>

                    <div className="form-group">
                        <input type="text" placeholder="Número" name="number" value={novoEndereco.number} onChange={(e) => setNovoEndereco({ ...novoEndereco, number: e.target.value })} required data-cy="new-address-number-input" />
                    </div>

                    <div className="form-group">
                        <input type="text" placeholder="Bairro" name="neighborhood" value={novoEndereco.neighborhood} onChange={(e) => setNovoEndereco({ ...novoEndereco, neighborhood: e.target.value })} required data-cy="new-address-neighborhood-input" />
                    </div>

                    <div className="form-group">
                        <input type="text" placeholder="Cidade" name="city" value={novoEndereco.city} onChange={(e) => setNovoEndereco({ ...novoEndereco, city: e.target.value })} required data-cy="new-address-city-input" />
                    </div>

                    <div className="form-group">
                        <input type="text" placeholder="Estado (UF)" name="state" value={novoEndereco.state} onChange={(e) => setNovoEndereco({ ...novoEndereco, state: e.target.value })} required maxLength="2" data-cy="new-address-state-input" />
                    </div>

                    <div className="form-group full-width">
                        <input type="text" placeholder="Complemento" name="complement" value={novoEndereco.complement} onChange={(e) => setNovoEndereco({ ...novoEndereco, complement: e.target.value })} data-cy="new-address-complement-input" />
                    </div>

                    <div className="form-group">
                        <select name="residenceType" value={novoEndereco.residenceType} onChange={(e) => setNovoEndereco({ ...novoEndereco, residenceType: e.target.value })} data-cy="new-address-residence-type-select">
                            {tiposEndereco.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                        </select>
                    </div>

                    <div className="form-group">
                        <select name="streetType" value={novoEndereco.streetType} onChange={(e) => setNovoEndereco({ ...novoEndereco, streetType: e.target.value })} data-cy="new-address-street-type-select">
                            {tiposLogradouro.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                        </select>
                    </div>
                    <div className="form-buttons-container full-width">
                      <button type="button" onClick={() => setMostrarNovoEndereco(false)} className="cancel-button">Cancelar</button>
                      <button type="button" onClick={handleAdicionarEndereco} data-cy="add-address-button">Adicionar Endereço</button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Forma de Pagamento */}
            <div className="forma-pagamento">
              <h2>Forma de Pagamento</h2>

              {/* Select de Cartões Existentes */}
              {cartoesSalvos.length > 0 ? (
                <div className="cartoes-existentes">
                  <h3>Cartões Salvos</h3>
                  <Select
                    isMulti
                    name="cartoes"
                    options={cartoesSalvos.map(card => ({
                      value: card.id,
                      label: `•••• ${card.numero.slice(-4)} (${card.bandeira}) ${card.preferredCard ? '(Preferencial)' : ''}`
                    }))}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    placeholder="Selecione cartões..."
                    onChange={handleSelecaoCartao}
                    value={cartoesSalvos.filter(card => cartoesSelecionados.includes(card.id)).map(card => ({
                      value: card.id,
                      label: `•••• ${card.numero.slice(-4)} (${card.bandeira}) ${card.preferredCard ? '(Preferencial)' : ''}`
                    }))}
                    styles={customSelectStyles}
                    data-cy="saved-cards-select"
                  />

                  {cartoesSelecionados.map(cardId => {
                    const cartaoDetalhes = cartoesSalvos.find(c => c.id === cardId);
                    return cartaoDetalhes ? (
                      <CartaoCard 
                        key={cardId}
                        cartao={cartaoDetalhes}
                        onDelete={handleDeleteCard}
                        onAmountChange={handleAmountChange}
                        amount={valorPagar[cardId]}
                      />
                    ) : null;
                  })}
                </div>
              ) : (
                <p>Nenhum cartão salvo.</p>
              )}

              {/* Botão para Cadastrar Novo Cartão */}
              {!mostrarNovoCartao && (
                <button
                  className="botao-novo-cartao"
                  onClick={() => setMostrarNovoCartao(true)}
                  data-cy="add-new-card-button"
                >
                  Cadastrar Novo Cartão
                </button>
              )}

              {/* Formulário de Cadastro de Novo Cartão */}
              {mostrarNovoCartao && (
                <div className="cartao-formulario">
                  <h3>Adicionar Cartão</h3>
                  <div className="novo-cartao-grid">
                    <div className="form-group full-width">
                      <input
                        type="text"
                        placeholder="Número do Cartão"
                        value={cartao.numero}
                        onChange={(e) => setCartao({ ...cartao, numero: e.target.value })}
                        data-cy="new-card-number-input"
                      />
                    </div>
                    <div className="form-group">
                      <DatePicker
                        selected={cartao.validade}
                        onChange={(date) => setCartao({ ...cartao, validade: date })}
                        placeholderText="Validade (MM/AAAA)"
                        dateFormat="MM/yyyy"
                        showMonthYearPicker
                        className="date-picker-full-width" // Adicionando uma classe para estilização
                        data-cy="new-card-validade-datepicker"
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="text"
                        placeholder="CVV"
                        value={cartao.cvv}
                        onChange={(e) => setCartao({ ...cartao, cvv: e.target.value })}
                        maxLength="4"
                        data-cy="new-card-cvv-input"
                      />
                    </div>
                    <div className="form-group full-width">
                      <input
                        type="text"
                        placeholder="Nome no Cartão"
                        value={cartao.nome}
                        onChange={(e) => setCartao({ ...cartao, nome: e.target.value })}
                        data-cy="new-card-name-input"
                      />
                    </div>
                    <div className="form-group full-width">
                      <select
                        value={cartao.bandeira}
                        onChange={(e) => setCartao({ ...cartao, bandeira: e.target.value })}
                        data-cy="new-card-brand-select"
                      >
                        <option value="visa">Visa</option>
                        <option value="mastercard">Mastercard</option>
                        <option value="elo">Elo</option>
                        <option value="amex">American Express</option>
                      </select>
                    </div>
                    <div className="checkbox-salvar-cartao full-width">
                      <input
                        type="checkbox"
                        id="salvar-cartao"
                        checked={salvarCartao}
                        onChange={(e) => setSalvarCartao(e.target.checked)}
                      />
                    </div>
                    <div className="form-buttons-container full-width">
                      <button type="button" onClick={() => { setMostrarNovoCartao(false); setCartao({ numero: '', validade: null, nome: '', bandeira: 'visa', cvv: '' }); }} className="cancel-button">Cancelar</button>
                      <button type="button" onClick={handleAdicionarCartao} data-cy="add-card-button">Adicionar Cartão</button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Frete */}
            <div className="frete">
              <h2>Frete</h2>
              <select
                value={frete}
                onChange={(e) => setFrete(e.target.value)}
                data-cy="shipping-select"
              >
                {shippingOptions.map(option => (
                  <option key={option.name} value={option.name}>
                    {`${option.name} (R$${parseFloat(option.price).toFixed(2)}) - ${option.company.name}`}
                  </option>
                ))}
                {shippingOptions.length === 0 && (
                  <option value="padrao">Nenhuma opção de frete disponível</option>
                )}
              </select>
            </div>
          </div>

          {/* Coluna da Direita: Resumo do Carrinho e Cupom */}
          <div className="coluna-direita">
            {/* Resumo do Carrinho */}
            <div className="resumo-carrinho">
              <h2>Resumo do Carrinho</h2>
              {itens.map((item, index) => (
                <div key={index} className="resumo-item">
                  <img src={item.url || item[0].url}  alt={item.title} className="resumo-imagem" />
                  <div className="resumo-detalhes">
                    <p>{item.title} (x{item.quantity})</p>
                    <p>R${(item.valorVenda * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
              <div className="resumo-total">
                <p>Subtotal: R${subtotal.toFixed(2)}</p>
                <p>Frete: R${parseFloat(valorFrete).toFixed(2)}</p>

                {cuponsAplicados.length > 0 && (
                  <p>Desconto: R${calcularDesconto().toFixed(2)}</p>
                )}
                <p><strong>Total: R${totalComDesconto.toFixed(2)}</strong></p>
              </div>
            </div>

            {/* Cupom de Desconto */}
            <div className="cupom">
              <input
                type="text"
                placeholder="Insira o cupom"
                value={cupom}
                onChange={(e) => setCupom(e.target.value)}
                data-cy="coupon-input"
              />
              <button onClick={handleAplicarCupom} data-cy="apply-coupon-button">Aplicar</button>
            </div>

            {/* Botão de Finalizar Compra */}
            <button className="finalizar-compra" onClick={handleFinalizarCompra} data-cy="finalize-checkout-button">
              Finalizar Compra
            </button>
          </div>
        </div>
      </div>
    <InfoSection />

    {isEditModalOpen && editingAddress && (
      <GenericModal
        title="Editar Endereço"
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleUpdateAddress}
      >
        <EditAddressForm 
          address={editingAddress}
          onFormChange={setEditedFormData}
        />
      </GenericModal>
    )}
    </div>
  );
};

export default Pagamento;