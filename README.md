# 📚 Livraria Online — Frontend (React + Vite)

![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=20232A)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=fff)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=000)
![Cypress](https://img.shields.io/badge/Cypress-17202C?style=for-the-badge&logo=cypress&logoColor=fff)
![Chart.js](https://img.shields.io/badge/Chart.js-F5788D?style=for-the-badge&logo=chartdotjs&logoColor=fff)

**Disciplina:** Engenharia de Software 🧑‍🏫  
**Faculdade:** FATEC Mogi das Cruzes 🏫  
**Autores:** Cláudio Oliveira & Mariana Teixeira 👥

---

## 🔍 Visão Geral
Este repositório contém o **frontend** da plataforma de e-commerce de livros desenvolvida para a disciplina de Engenharia de Software. A aplicação foi construída em React + Vite e consome a API do projeto (`App_ProjetoLES` – backend) para disponibilizar funcionalidades de catálogo, carrinho, checkout, pós-venda e área administrativa.

### Principais recursos do frontend
- ✅ **Landing page** com vitrine de destaque, banner personalizável e acesso rápido às categorias.
- ✅ **Catálogo completo** com busca, filtros (autor, editora, ano, faixa de preço, categoria) e paginação.
- ✅ **Página de produto** com galeria, estoque, preço e CTA para o carrinho.
- ✅ **Fluxo de cliente**: cadastro completo (dados pessoais, endereço, cartão), login por e-mail, perfil com abas, histórico de pedidos, acompanhamento de trocas, visualização de cupons e checkout.
- ✅ **Carrinho integrado ao backend** com reserva de estoque, ajuste de quantidades e subtotal em tempo real.
- ✅ **Checkout avançado**: seleção/edição de endereços, cálculo de frete (Melhor Envio), cupons cumulativos com geração de crédito, múltiplos cartões e resumo da compra.
- ✅ **Assistente MIART** (Groq LLM) que recomenda livros com base no histórico do usuário, catálogo e regras de negócio.
- ✅ **Área do colaborador** com login próprio, consultas a clientes/livros/pedidos, edição de cadastro, fluxo de trocas e **dashboard interativo** (DuckDB-Wasm + Chart.js) para análises por categoria.
- ✅ **Proteção de rotas** por tipo de usuário (`cliente` x `colaborador`) e persistência de sessão (localStorage + context APIs).
- ✅ **Testes end-to-end** com Cypress cobrindo jornada de compra, cadastros e fluxos de troca.

> O backend oficial com todas as regras de negócio está descrito no repositório [App_ProjetoLES (API)](https://github.com/marianajpg/App_ProjetoLES). Este frontend assume a API em execução em `http://localhost:3000`.

---

## 🧰 Tecnologias
- **React 18** + **Vite 5**
- **React Router DOM 7** (SPA com rotas protegidas)
- **Context API** (auth, carrinho)
- **Axios** (camada de serviços REST)
- **Chart.js + react-chartjs-2** (dashboards colaborador)
- **DuckDB-Wasm** (consultas analíticas no browser)
- **React Datepicker / React Select** (formulários ricos)
- **Cypress 15** & **MSW** (testes end-to-end / mocks)
- **Mocha + Selenium WebDriver** (testes adicionais legados)
- **Groq API** (assistente MIART)

---

## 🗂️ Estrutura de Pastas (frontend)
```
src/
├─ App.jsx              # Definição das rotas principais
├─ index.jsx            # Bootstrap React + Providers
├─ components/          # Componentes reutilizáveis (UI, modais, tabelas, cards)
├─ context/             # Providers (AuthLogin, CarrinhoContext)
├─ pages/               # Páginas públicas, de cliente e colaborador
│  └─ colaborador/      # Telas administrativas (clientes, pedidos, dashboard)
├─ services/            # Camada de acesso à API REST (axios)
├─ styles/              # CSS modular por página/componente
├─ images/              # Assets usados no front
└─ vite.config.js       # Configuração Vite

cypress/
├─ e2e/                 # Testes end-to-end (checkout, cadastros, trocas, etc.)
├─ fixtures/            # Dados mockados usados nos testes
└─ support/             # Comandos customizados e setup Cypress
```

---

## 🌐 Páginas e Fluxos

**Público geral**
- `Home`: banner temático, livros em destaque, categorias dinâmicas.
- `ShopLivros`: catálogo com busca, filtros avançados, paginação e card de produto.
- `TelaProduto`: detalhes do livro, estoque consolidado, botão adicionar ao carrinho.
- `IARecomenda`: chat com a MIART (Groq) que personaliza recomendações usando histórico e catálogo.
- `Login` / `CadastroCliente`: autenticação (cliente via e-mail; colaborador mock) e formulário completo com busca de CEP (ViaCEP), endereço de entrega/cobrança e cartão preferencial.

**Cliente autenticado**
- `Carrinho`: itens sincronizados com o backend (`/cart`), atualização de quantidades, subtotal e ações.
- `Pagamento`: resumo do carrinho, seleção/edição de endereços (`/address`), cálculo de frete (`/shipping/calculate`), aplicação de cupons (`/coupons`), múltiplos cartões (`/creditcards`) e confirmação de compra (`/checkout`).
- `Perfil`: dados pessoais (modo demonstração), abas para **Meus Produtos** (pedidos, trocas, visualização agrupada e por item, com integrações em `/exchanges`), e **Cupons** (filtra códigos do tipo `TROCA-*`).

**Colaborador autenticado**
- `ConsultaClientes`: filtro, busca full-text, abas status e ação de edição.
- `ConsultaLivros`: gestão de catálogo com filtros, estoque e suporte a trocas.
- `ConsultaPedidos` & `TransacoesCliente`: visão operacional de pedidos/trocas.
- `Dashboard`: análises de vendas por categoria com DuckDB-Wasm e Chart.js.

---

## 🔐 Autenticação & Estado
- `AuthLogin` provider persiste `user` e `token` no `localStorage`, oferece login por e-mail (consulta `/customers/email/:email`) e modo colaborador com token mock.
- `CarrinhoContext` cria ou recupera o carrinho ativo (`/cart`), sincroniza itens, atualiza quantidades e trata erros globais do carrinho.
- `RotaProtegida` bloqueia rotas conforme `requiredUserType`, redirecionando para `/unauthorized` quando necessário.

---

## 🔌 Integração com o Backend
- Todas as chamadas passam por `src/services/api.jsx` (axios com base `http://localhost:3000` e header `Authorization` opcional).
- Cada domínio possui um serviço dedicado (`books.jsx`, `cart.jsx`, `checkout.jsx`, `shipping.jsx`, etc.), mantendo o front desacoplado das rotas individuais.
- A MIART consome `POST /groq` via backend, que por sua vez integra com a Groq API.

> Ajuste a constante `baseURL` em `src/services/api.jsx` caso a API esteja escutando em outro host/porta. Futuramente é possível extrair para `VITE_API_BASE_URL` via variáveis de ambiente do Vite.

---

## ⚙️ Configuração e Execução

### Pré-requisitos
- Node.js 18+
- npm 9+ (ou pnpm/yarn)
- Backend rodando localmente (padrão `http://localhost:3000`)

### Passo a passo
1. Clone este repositório e instale as dependências:
   ```bash
   npm install
   ```
2. Garanta que o backend esteja ativo (consulte o README do projeto API).
3. Inicie o frontend em modo desenvolvimento:
   ```bash
   npm run dev
   ```
   O Vite abrirá em `http://localhost:5173` por padrão.
4. Para gerar build de produção:
   ```bash
   npm run build
   npm run preview
   ```

### Scripts npm
| Script | Descrição |
| --- | --- |
| `npm run dev` | Vite em modo desenvolvimento (HMR). |
| `npm run build` | Build otimizado para produção. |
| `npm run preview` | Servidor de pré-visualização do build. |
| `npm run start` | Executa `server.js` (legacy / mock). |
| `npm run test:selenium` | Executa testes Mocha + Selenium (legado). |

---

## 🧪 Testes
- **Cypress** (`cypress/e2e`): cobre cenários felizes e infelizes de cadastro, checkout, troca, navegação e busca.
  - Rode em modo interativo: `npx cypress open`
  - Rode em modo headless: `npx cypress run`
- **MSW** é utilizado para mocks em testes quando necessário.
- Há suporte legado a **Mocha + Selenium WebDriver** (`npm run test:selenium`).

---

## 🤖 Assistente MIART (Groq)
- Página `IARecomenda` persiste histórico no `sessionStorage`, personaliza recomendações usando o histórico do cliente (`/checkout`), catálogo (`/book`) e segue regras de segurança (não recomendar em contextos inadequados).
- O nome do usuário autenticado é usado no cumprimento inicial e em todas as respostas.
- Requer o endpoint backend `/groq` configurado com a chave da Groq API.

---

## 🔄 Correlação com o Backend
- A API oficial centraliza regras de preço, estoque, checkout, trocas e integração Melhor Envio.
- Este frontend consome diretamente esses serviços, mantendo validações adicionais no cliente (ex.: verificação de cupons, distribuição de pagamento em múltiplos cartões, prevenção de carrinho vazio).
- Para dados de demonstração, o backend expõe usuários/cadastros que podem ser importados via seed ou `json-server`.

---

## 📬 Contato
- Cláudio Henrique Pinheiro de Oliveira  
- Mariana Gomes Teixeira

---

## 📝 Licença
Uso acadêmico.

