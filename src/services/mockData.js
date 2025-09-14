
// --- CATÁLOGO DE LIVROS DA LOJA ---
export const mockBooks = [
  { id: 1, titulo: "Duna", autor: "Frank Herbert", categoria: "Ficção Científica", preco: 59.90, capaUrl: "https://m.media-amazon.com/images/I/81zN7udGRUL._SY425_.jpg", sinopse: "Uma jornada épica em um planeta desértico perigoso." },
  { id: 2, titulo: "O Senhor dos Anéis: A Sociedade do Anel", autor: "J.R.R. Tolkien", categoria: "Fantasia", preco: 69.90, capaUrl: "https://m.media-amazon.com/images/I/41RBd2DvmgL._SY445_SX342_.jpg", sinopse: "Um hobbit herda um anel poderoso e precisa destruí-lo." },
  { id: 3, titulo: "Fundação", autor: "Isaac Asimov", categoria: "Ficção Científica", preco: 49.90, capaUrl: "https://m.media-amazon.com/images/I/51Qexbduu5L._SY445_SX342_.jpg", sinopse: "Um império galáctico em declínio e um plano para salvar o conhecimento." },
  { id: 4, titulo: "O Nome do Vento", autor: "Patrick Rothfuss", categoria: "Fantasia", preco: 54.90, capaUrl: "https://m.media-amazon.com/images/I/81CGmkRG9GL._SY425_.jpg", sinopse: "A história de um herói e músico lendário, contada por ele mesmo." },
  { id: 5, titulo: "1984", autor: "George Orwell", categoria: "Distopia", preco: 39.90, capaUrl: "https://m.media-amazon.com/images/I/51VXYaKO-sL._SY445_SX342_.jpg", sinopse: "Uma sociedade totalitária onde o Grande Irmão está sempre vigiando." },
  { id: 6, titulo: "O Guia do Mochileiro das Galáxias", autor: "Douglas Adams", categoria: "Ficção Científica", preco: 34.90, capaUrl: "https://m.media-amazon.com/images/I/51B7vacPfEL._SY445_SX342_.jpg", sinopse: "As aventuras de um humano azarado após a destruição da Terra." },
];

// --- USUÁRIO LOGADO E SUAS PREFERÊNCIAS ---
export const mockUser = {
  id: 101,
  nome: "Ana",
  preferencias: ["Ficção Científica", "Distopia"],
};

// --- HISTÓRICO DE COMPRAS DO USUÁRIO ---
export const mockPurchaseHistory = [
  { userId: 101, bookId: 5, titulo: "1984", dataCompra: "2024-06-15" },
  { userId: 101, bookId: 1, titulo: "Duna", dataCompra: "2024-07-22" },
];
