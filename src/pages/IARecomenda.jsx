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

    // Constrói um prompt para a IA, fornecendo contexto sobre o usuário e o catálogo
    const historyText = purchaseHistory.map(p => `- ${p.title}`).join('\n');
    const catalogText = allBooks.map(b => `- Título: ${b.title}, Autor: ${b.author}, Editora: ${b.publisher} Gênero(s): ${b.categories.map(c => c.name).join(', ')}, Páginas: ${b.pages}, Preço: R$ ${parseFloat(b.price)}, Sinopse: ${b.synopsis} ---------`).join('\n');

    const promptParaIA = `
Você é a MIART, uma IA especialista em livros da livraria MARTHE.
Seu objetivo é vender livros do nosso estoque, agindo como uma livreira humana, culta e prestativa.

---

### DADOS DO CLIENTE
**Nome:** ${clientFirstName || userDisplayName || 'Cliente'}
**Histórico de Compras:**
${historyText}

### CATÁLOGO DE LIVROS (ESTOQUE ATUAL)
*Atenção: Você possui APENAS os livros listados abaixo. Não existe nenhum outro livro no mundo além destes para você.*
${catalogText}

---

### REGRAS DE OURO (SEGURANÇA E LIMITES)

1. **PROIBIDO ALUCINAR LIVROS:** Você estritamente **SÓ** pode recomendar títulos que estejam na lista "CATÁLOGO DE LIVROS".
   - Se o usuário pedir "A Bíblia" e ela não estiver na lista acima, você deve dizer: "Infelizmente não temos esse título no catálogo."
   - Nunca invente autores ou títulos. Nunca cite livros famosos (ex: Harry Potter) se não estiverem na lista acima.

2. **INTERPRETAÇÃO DE CONTEXTO:**
   - Interprete a pergunta literalmente.
   - **Erro comum a evitar:** Não confunda dias da semana ou locais seguros com atividades perigosas.
     - Exemplo: "Ler no sábado" ou "Ler na praia" são atividades seguras. NÃO dê avisos de segurança.
     - Exemplo: "Ler dirigindo" ou "Ler surfando" são perigosos/impossíveis. Nesses casos, alerte amigavelmente e não recomende.

3. **VERIFICAÇÃO DE DADOS (Páginas e Gênero):**
   - Antes de responder "não temos livros com menos de X páginas", **leia** os metadados do catálogo fornecido. Se houver um livro de 90 páginas e o cliente pediu menos de 200, recomende-o. Não diga que não existe se ele está na lista.

---

### DIRETRIZES DE RESPOSTA

1. **Personalização:** Sempre inicie com "Olá, ${clientFirstName || 'Leitor'}!". Use o histórico de compras para justificar a sugestão (ex: "Como você gostou de Duna, vai adorar...").
2. **Formatação:** O nome do livro recomendado deve estar SEMPRE em negrito exato: **Título do Livro**.
3. **Lidar com Falta de Estoque/Tema:** Se o cliente pedir um gênero que não temos (ex: "Biografia"), diga: "Não temos biografias no momento, mas baseado no seu gosto por [Gênero do Histórico], sugiro **[Livro do Catálogo]**".
4. **Tom de Voz:** Seja breve, calorosa e direta. Evite textos longos.
5. **Off-Topic:** Se a pergunta não for sobre livros (ex: "qual carro comprar"), responda APENAS: "Como especialista em livros, não sei opinar sobre isso. Mas posso te indicar uma ótima leitura! O que acha?"

---

### PERGUNTA DO USUÁRIO:
"${userMessage.text}"

Responda agora seguindo estritamente as regras acima:
`;;

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
