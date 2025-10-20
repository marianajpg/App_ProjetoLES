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
  const GROQ_API_KEY = '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';
  const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
  try {
    const response = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },

      body: JSON.stringify({
        model: 'llama-3.1-8b-instant', // Modelo recomendado atualmente pelo Groq
        messages: [{ role: 'user', content: promptText }],
        temperature: 0.7,
      })

    });

    if (!response.ok) {
      const errorBody = await response.json();
      throw new Error(`Erro na resposta da API Groq: ${response.status} - ${errorBody.error.message}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "Não foi possível obter uma resposta do modelo.";

  } catch (error) {
    console.error("Erro ao chamar a API Groq:", error);
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
  const messagesEndRef = useRef(null);

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
                console.log("user",user)
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
          text: `Olá! Sou sua assistente pessoal de livros. Como posso ajudar você a encontrar sua próxima leitura hoje?`,
          sender: 'ia',
          produtos: []
        }
      ]);

    }
  }, [user]);

  const handleSendMessage = async () => {
    if (inputValue.trim() === '' || isLoading) return;

    const userMessage = { text: inputValue, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Constrói um prompt detalhado para a IA, fornecendo contexto sobre o usuário e o catálogo.
    // Esta é a parte principal que permite a personalização da resposta.
    const historyText = purchaseHistory.map(p => `- ${p.title}`).join('\n');
    const catalogText = allBooks.map(b => `- Título: ${b.title}, Autor: ${b.author}, Editora: ${b.publisher}`).join('\n');

    const promptParaIA = `
      Você é a MIART, uma IA especialista em recomendação de livros para a nossa livraria. Sua tarefa é agir como uma vendedora pessoal e amigável.

      **Contexto do Cliente:**
      - Histórico de Compras:
      ${historyText}

      **Catálogo Completo de Livros Disponíveis:**
      ${catalogText}

      **Instruções IMPORTANTES:**
      1. Use o histórico e as preferências do cliente para fazer recomendações ALTAMENTE PERSONALIZADAS (não cite o nome do cliente de forma alguma).
      2. Responda de forma calorosa e pessoal, seja breve.
      3. Se o cliente pedir algo vago como "um livro bom", sugira algo baseado nas compras passadas dele. Por exemplo, se ele comprou "Duna", sugira "Fundação".
      4. Se o cliente perguntar sobre um livro que não está no catálogo, informe educadamente que não o temos e sugira uma alternativa SIMILAR do catálogo.
      5. Ao recomendar um livro do catálogo, coloque o título EXATO em negrito, usando asteriscos duplos. Exemplo: **O Nome do Vento**. Isso é crucial.
      6. **REGRA DE OURO: Se a pergunta do usuário for claramente fora do tópico de livros, sua ÚNICA ação deve ser dar uma resposta genérica e educada. NÃO FAÇA uma recomendação de livro nesta mesma resposta. Apenas se recuse a comentar o assunto e convide o usuário a voltar a falar sobre livros. Exemplo de resposta (e nada mais): 'Como uma especialista em livros, não tenho conhecimento sobre isso. Que tal voltarmos a falar sobre leituras? Posso te ajudar a encontrar um novo livro.'**

      **Pergunta do Cliente:**
      "${userMessage.text}"

      Sua resposta:
    `;

    try {
      const respostaIA = await callGroqAPI(promptParaIA);

      // Processa a resposta da IA para extrair títulos de livros (marcados com **).
      // Isso transforma o texto da IA em componentes de UI interativos (cards de produto).
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


  // useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  return (
    <div className="ia-recomenda-page">
      <Header />
      <main className="chat-main-content">
        <div className="chat-container">
          <div className="chat-messages">
            {messages.map((message, index) => (
              <div key={index} className={`message-container ${message.sender}`}>
                <img src={message.sender === 'ia' ? iconIA : iconUser} alt="Ícone" className="message-icon" />
                <div className={`message ${message.sender}`}>
                  <p dangerouslySetInnerHTML={{ __html: message.text.replace(/\n/g, '<br />') }} />
                  {message.produtos && message.produtos.length > 0 && (
                    <div className="produtos-sugeridos">
                      {message.produtos.map((livro, idx) => (
                        <div key={idx} className="produto-card" onClick={() => handleProductClick(livro)}>
                          <img   src={
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
            <div ref={messagesEndRef} />
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
