import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header.jsx';
import InfoSection from '../components/InfoSection.jsx';
import '../styles/IARecomenda.css';
import iconIA from '../images/img_icon_ia.png';
import iconUser from '../images/img_icon_user.png';
import { getBooks } from '../services/books';
import { useAuth } from '../context/AuthLogin.jsx';
import { getCheckout } from '../services/checkout.jsx';


async function callGroqAPI(promptText) {
  try {
    const response = await fetch('http://localhost:3000/groq', { // URL do backend 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: promptText }) // Envia o prompt no body
    });

    if (!response.ok) {
      const errorBody = await response.json();
      throw new Error(`Erro na resposta do backend: ${response.status} - ${errorBody.error}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "Não foi possível obter uma resposta do modelo.";
  } catch (error) {
    console.error("Erro ao chamar a rota Groq:", error);
    return `Desculpe, houve um erro ao conectar com o serviço de IA: ${error.message}`;
  }
}

const IARecomenda = () => {
  const { user } = useAuth();
  // Tenta carregar o histórico do chat do sessionStorage ao iniciar.
  // Isso permite que a conversa persista ao navegar entre páginas.
  const [messages, setMessages] = useState(() => {
    try {
      const savedMessages = sessionStorage.getItem('chatHistory');
      return savedMessages ? JSON.parse(savedMessages) : [];
    } catch (error) {
      console.error("Falha ao carregar o histórico do chat:", error);
      return [];
    }
  });

  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allProdutos, setAllProdutos] = useState([]);
  const navigate = useNavigate();
  const chatMessagesRef = useRef(null);
  const userDisplayName = (user?.name || user?.nome || user?.fullName || '').trim();
  const clientFirstName = userDisplayName ? userDisplayName.split(' ')[0] : '';

  // Simula o carregamento de dados do usuário e do catálogo de livros.
  // Em uma aplicação real, estes dados viriam de uma API autenticada.
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [allBooks, setAllBooks] = useState([]);

  // Salva o histórico do chat no sessionStorage sempre que a lista de mensagens é atualizada.
  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem('chatHistory', JSON.stringify(messages));
    }
  }, [messages]);


  useEffect(() => {
    const fetchAllBooks = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getBooks({});
        const booksArray = Array.isArray(response) ? response : response.books || [];
        setAllBooks(booksArray);
      } catch (err) {
        setError('Não foi possível carregar os livros. Tente novamente mais tarde.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllBooks();
  }, []);




  useEffect(() => {
    const fetchPurchaseHistory = async () => {
      if (user && user.id) {
        try {
          console.log("user", user)
          const sales = await getCheckout();
          const userSales = sales.filter(sale => sale.clientId === user.id);
          const history = userSales.flatMap(sale => sale.items.map(item => item.book));
          setPurchaseHistory(history);
        } catch (error) {
          console.error("Erro ao buscar histórico de compras:", error);
        }
      }
    };

    fetchPurchaseHistory();

    // Se não houver mensagens no histórico, envia a mensagem inicial da IA.
    if (messages.length === 0 && user) {
      setMessages([
        {
          text: clientFirstName
            ? `Olá, ${clientFirstName}! Sou sua assistente pessoal de livros. Como posso ajudar você a encontrar sua próxima leitura hoje?`
            : `Olá! Sou sua assistente pessoal de livros. Como posso ajudar você a encontrar sua próxima leitura hoje?`,
          sender: 'ia',
          produtos: []
        }
      ]);

    }
  }, [user, clientFirstName]);

  const handleSendMessage = async () => {
    if (inputValue.trim() === '' || isLoading) return;

    const userMessage = { text: inputValue, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Constrói um prompt detalhado para a IA, fornecendo contexto sobre o usuário e o catálogo.
    const historyText = purchaseHistory.map(p => `- ${p.title}`).join('\n');
    const catalogText = allBooks.map(b => `- Título: ${b.title}, Autor: ${b.author}, Editora: ${b.publisher}`).join('\n');

    const promptParaIA = `
      Você é a MIART, uma IA especialista em recomendação de livros para a nossa livraria. 

      O cliente se chama ${clientFirstName || userDisplayName || 'cliente'}.

      **Contexto do Cliente:**
      - Histórico de Compras:
      ${historyText}

      **Catálogo Completo de Livros Disponíveis:**
      ${catalogText}

      **Instruções IMPORTANTES:**
      1. Use o histórico e as preferências do cliente para fazer recomendações ALTAMENTE PERSONALIZADAS.
      2. Responda de forma calorosa e pessoal, seja breve.
      3. Se o cliente pedir algo vago como "um livro bom", sugira algo baseado nas compras passadas dele. Por exemplo, se ele comprou "Duna", sugira "Fundação".
      4. Se o cliente perguntar sobre um livro ou um TEMA (ex: "livro sobre rock") que não está no catálogo, informe educadamente que não temos essa especialidade ou título, e ENTÃO sugira uma alternativa do catálogo baseada no histórico do cliente.
      5. Ao recomendar um livro do catálogo, coloque o título EXATO em negrito, usando asteriscos duplos. Exemplo: **O Nome do Vento**. Isso é crucial.
  6. Sempre inicie a resposta cumprimentando o cliente pelo nome ${clientFirstName ? `"${clientFirstName}"` : 'disponível'}, para reforçar o atendimento personalizado. Exemplo: "Olá, ${clientFirstName || 'cliente'}!"
  7. **REGRA DE OURO (FORA DO TÓPICO): Se a pergunta do usuário for claramente fora do tópico de livros (ex: "qual carro comprar?", "como construir uma casa?"), sua ÚNICA ação deve ser dar uma resposta genérica e educada. NÃO FAÇA uma recomendação de livro nesta mesma resposta. Apenas se recuse a comentar o assunto e convide o usuário a voltar a falar sobre livros. Exemplo de resposta (e nada mais): 'Como uma especialista em livros, não tenho conhecimento sobre isso. Que tal voltarmos a falar sobre leituras? Posso te ajudar a encontrar um novo livro.'**
  8. **REGRA DE CONTEXTO ABSURDO/INSEGURO:** Se a pergunta do usuário mencionar livros, mas em um contexto que seja impossível, perigoso ou claramente sem sentido (ex: "ler no chuveiro", "ler enquanto dirijo"), NÃO recomende um livro. Aponte a impossibilidade ou o perigo de forma amigável e convide-o a falar sobre leituras em um contexto normal. **NÃO FAÇA uma recomendação de livro nesta mesma resposta.**
        - *Exemplo para "ler no chuveiro":* 'Opa! Admiro a vontade de ler em todo lugar, mas ler no chuveiro vai estraga o livro! Que tal uma sugestão para ler quando estiver seco e confortável?'
        - *Exemplo para "ler dirigindo":* 'Por favor, não faça isso! Ler dirigindo é muito perigoso. Que tal conversarmos sobre um audiolivro ou um livro para você ler quando chegar ao seu destino?'

      **Pergunta do Cliente:**
      "${userMessage.text}"
      `;

    try {
      const respostaIA = await callGroqAPI(promptParaIA);

      // Processa a resposta da IA para extrair títulos de livros (marcados com **).
      const recommendedBooks = [];
      const regex = /\*\*(.*?)\*\*/g;
      let match;
      while ((match = regex.exec(respostaIA)) !== null) {
        const bookTitle = match[1];
        const foundBook = allBooks.find(b => b.title.toLowerCase() === bookTitle.toLowerCase());
        if (foundBook) {
          recommendedBooks.push(foundBook);
        }
      }

      setMessages((prev) => [...prev, { text: respostaIA.replace(regex, "$1"), sender: 'ia', produtos: recommendedBooks }]);
    } catch (error) {
      setMessages((prev) => [...prev, { text: `Desculpe, ocorreu um erro: ${error.message}`, sender: 'ia', produtos: [] }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductClick = (livro) => {
    navigate(`/tela-produto/${livro.id}`, { state: { livro: livro } });
  };

  const handleKeyPress = (e) => { if (e.key === 'Enter') handleSendMessage(); };


  useEffect(() => {
    const container = chatMessagesRef.current;
    if (!container) return;
    // Garante que apenas a área de mensagens role até o final.
    container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="ia-recomenda-page">
      <Header />
      <main className="chat-main-content">
        <div className="chat-container">
          <div className="chat-messages" ref={chatMessagesRef}>
            {messages.map((message, index) => (
              <div key={index} className={`message-container ${message.sender}`}>
                <img src={message.sender === 'ia' ? iconIA : iconUser} alt="Ícone" className="message-icon" />
                <div className={`message ${message.sender}`}>
                  <p dangerouslySetInnerHTML={{ __html: message.text.replace(/\n/g, '<br />') }} />
                  {message.produtos && message.produtos.length > 0 && (
                    <div className="produtos-sugeridos">
                      {message.produtos.map((livro, idx) => (
                        <div key={idx} className="produto-card" onClick={() => handleProductClick(livro)}>
                          <img src={
                            livro.images?.find(img => img.caption === 'Principal')?.url ||
                            'https://m.media-amazon.com/images/I/81doL+ml7uL._SY466_.jpg'
                          }
                            alt={livro.title} />
                          <p>{livro.title}</p>
                          <span>R${parseFloat(livro.price).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="message-container ia">
                <img src={iconIA} alt="Ícone IA" className="message-icon" />
                <div className="message ia typing-indicator"><span></span><span></span><span></span></div>
              </div>
            )}
          </div>
          <div className="chat-input-container">
            <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyPress={handleKeyPress} placeholder="Me recomende um livro..." disabled={isLoading} />
            <button onClick={handleSendMessage} disabled={isLoading}>Enviar</button>
          </div>
        </div>
      </main>
      <InfoSection />
    </div>
  );
};

export default IARecomenda;
