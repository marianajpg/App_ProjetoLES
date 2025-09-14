
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header.jsx';
import InfoSection from '../components/InfoSection.jsx';
import '../styles/IARecomenda.css';
import iconIA from '../images/img_icon_ia.png';
import iconUser from '../images/img_icon_user.png';
import bannerFundoIA from '../images/img-bannerfundoIA.png';

// Importando nossos dados mockados
import { mockBooks, mockUser, mockPurchaseHistory } from '../services/mockData.js';

// A função da API Gemini permanece a mesma
async function callGeminiAPI(promptText, apiKey) {
  const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";
  const requestBody = { contents: [{ parts: [{ text: promptText }] }] };
  try {
    const response = await fetch(`${API_URL}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-goog-api-key': apiKey },
      body: JSON.stringify(requestBody)
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Erro da API: ${response.status} - ${errorData.error.message || 'Erro desconhecido'}`);
    }
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "Não foi possível gerar uma resposta.";
  } catch (error) {
    console.error("Erro ao chamar a API Gemini:", error);
    return `Desculpe, houve um erro ao processar sua solicitação: ${error.message}`;
  }
}

const IARecomenda = () => {
  const [messages, setMessages] = useState(() => {
    try {
      const savedMessages = sessionStorage.getItem('chatHistory');
      return savedMessages ? JSON.parse(savedMessages) : [];
    } catch (error) {
      console.error("Failed to parse chat history:", error);
      return [];
    }
  });
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  // Simula o carregamento dos dados do usuário e do catálogo
  const [currentUser, setCurrentUser] = useState(null);
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [allBooks, setAllBooks] = useState([]);

  // Salva o histórico do chat no sessionStorage sempre que ele muda
  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem('chatHistory', JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    // Em um app real, isso seria uma chamada de API
    setCurrentUser(mockUser);
    setPurchaseHistory(mockPurchaseHistory);
    setAllBooks(mockBooks);

    // Se não houver mensagens carregadas, envia a mensagem inicial da IA
    if (messages.length === 0) {
      setMessages([
        {
          text: `Olá, ${mockUser.nome}! Sou sua assistente pessoal de livros. Notei que você gosta de ${mockUser.preferencias.join(' e ')}. Como posso ajudar você a encontrar sua próxima leitura hoje?`,
          sender: 'ia',
          produtos: []
        }
      ]);
    }
  }, []);

  const handleSendMessage = async () => {
    if (inputValue.trim() === '' || isLoading) return;

    const userMessage = { text: inputValue, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // --- A MÁGICA ACONTECE AQUI: CONSTRUÇÃO DO PROMPT INTELIGENTE ---
    const historyText = purchaseHistory.map(p => `- ${p.titulo}`).join('\n');
    const catalogText = allBooks.map(b => `- Título: ${b.titulo}, Autor: ${b.autor}, Categoria: ${b.categoria}`).join('\n');

    const promptParaIA = `
      Você é a MIART, uma IA especialista em recomendação de livros para a nossa livraria. Sua tarefa é agir como uma vendedora pessoal e amigável.

      **Contexto do Cliente:**
      - Nome: ${currentUser.nome}
      - Gêneros Favoritos: ${currentUser.preferencias.join(', ')}
      - Histórico de Compras:
      ${historyText}

      **Catálogo Completo de Livros Disponíveis:**
      ${catalogText}

      **Instruções IMPORTANTES:**
      1. Use o histórico e as preferências do cliente para fazer recomendações ALTAMENTE PERSONALIZADAS.
      2. Responda de forma calorosa e pessoal, chamando o cliente pelo nome (${currentUser.nome}).
      3. Se o cliente pedir algo vago como "um livro bom", sugira algo baseado nas compras passadas dele. Por exemplo, se ele comprou "Duna", sugira "Fundação".
      4. Se o cliente perguntar sobre um livro que não está no catálogo, informe educadamente que não o temos e sugira uma alternativa SIMILAR do catálogo.
      5. Ao recomendar um livro do catálogo, coloque o título EXATO em negrito, usando asteriscos duplos. Exemplo: **O Nome do Vento**. Isso é crucial.
      6. **REGRA DE OURO: Se a pergunta do usuário for claramente fora do tópico de livros, sua ÚNICA ação deve ser dar uma resposta genérica e educada. NÃO FAÇA uma recomendação de livro nesta mesma resposta. Apenas se recuse a comentar o assunto e convide o usuário a voltar a falar sobre livros. Exemplo de resposta (e nada mais): 'Como uma especialista em livros, não tenho conhecimento sobre isso. Que tal voltarmos a falar sobre leituras? Posso te ajudar a encontrar um novo livro.'**

      **Pergunta do Cliente:**
      "${userMessage.text}"

      Sua resposta:
    `;

    const API_KEY = "AIzaSyA-pW_YMrTkuWkKKf_7-YBBQqIQDKDM2x4"; 
    try {
      const respostaIA = await callGeminiAPI(promptParaIA, API_KEY);

      // Processar a resposta para encontrar livros recomendados
      const recommendedBooks = [];
      const regex = /\*\*(.*?)\*\*/g; // Alterado para encontrar texto em negrito (Markdown)
      let match;
      while ((match = regex.exec(respostaIA)) !== null) {
        const bookTitle = match[1];
        const foundBook = allBooks.find(b => b.titulo.toLowerCase() === bookTitle.toLowerCase());
        if (foundBook) {
          recommendedBooks.push(foundBook);
        }
      }

      setMessages((prev) => [...prev, { text: respostaIA.replace(regex, "$1"), sender: 'ia', produtos: recommendedBooks }]);
    } catch (error) {
      setMessages((prev) => [...prev, { text: "Desculpe, não consegui processar sua solicitação no momento.", sender: 'ia', produtos: [] }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductClick = (livro) => {
    navigate(`/tela-produto/${livro.id}`);
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
                          <img src={livro.capaUrl} alt={livro.titulo} />
                          <p>{livro.titulo}</p>
                          <span>R${livro.preco.toFixed(2)}</span>
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
