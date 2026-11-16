/**
 * DRIP081 - Catálogo de Produtos
 * Estilo Palace Skateboards: Cru, minimalista, streetwear autêntico.
 * 
 * Este arquivo foi estruturado separando a fonte de dados (PRODUCTS_DATA / fetchProducts)
 * da camada de renderização, permitindo que no futuro os dados sejam facilmente
 * substituídos por uma requisição a uma API ou banco de dados (ex: fetch('/api/produtos')).
 */

const PRODUCTS_DATA = [
  // --- SAPATOS ---
  {
    id: 1,
    nome: "TÊNIS CHUNK 081 V1",
    categoria: "sapatos",
    preco: 589.00,
    imagem: "assets/isotipo-black.png",
    imagem2: "assets/logotipo-black.png",
    tamanhos: ["38", "39", "40", "41", "42", "43"],
    descricao: "Solado robusto vulcanizado, cabedal em lona pesada e camurça sintética. Desenvolvido para a lixa e para a rua."
  },
  {
    id: 2,
    nome: "LOAFER STREET DRIP",
    categoria: "sapatos",
    preco: 649.00,
    imagem: "assets/imagotipo-black.png",
    imagem2: "assets/isotipo-black.png",
    tamanhos: ["39", "40", "41", "42", "43"],
    descricao: "Fusão de alfaiataria subversiva com sola tratorada antiderrapante. Detalhe gravado com a assinatura 081."
  },
  {
    id: 3,
    nome: "SKATE SLIP-ON MONO",
    categoria: "sapatos",
    preco: 429.00,
    imagem: "assets/logotipo-black.png",
    imagem2: "assets/imagotipo-black.png",
    tamanhos: ["38", "39", "40", "41", "42"],
    descricao: "Slip-on sem amarração com elásticos laterais reforçados e palmilha anti-impacto. Estética limpa e monolítica."
  },

  // --- CALÇAS ---
  {
    id: 4,
    nome: "CALÇA CARGO RIPSTOP 081",
    categoria: "calcas",
    preco: 379.00,
    imagem: "assets/isotipo-black.png",
    imagem2: "assets/imagotipo-black.png",
    tamanhos: ["38", "40", "42", "44", "46"],
    descricao: "Tecido ripstop militar ultra resistente. Seis bolsos funcionais e ajuste por cordão elástico na barra."
  },
  {
    id: 5,
    nome: "BAGGY SKATE RAW JEANS",
    categoria: "calcas",
    preco: 399.00,
    imagem: "assets/logotipo-black.png",
    imagem2: "assets/isotipo-black.png",
    tamanhos: ["38", "40", "42", "44"],
    descricao: "Denim cru 14oz 100% algodão sem lavagem química. Modelagem super ampla anos 90 com caimento solto sobre o tênis."
  },
  {
    id: 6,
    nome: "CALÇA CHINO TÁTICA BLACK",
    categoria: "calcas",
    preco: 349.00,
    imagem: "assets/imagotipo-black.png",
    imagem2: "assets/logotipo-black.png",
    tamanhos: ["38", "40", "42", "44", "46"],
    descricao: "Sarja peletizada pesada, corte reto clássico com passadores reforçados para cinto e chaveiros."
  },

  // --- BERMUDAS ---
  {
    id: 7,
    nome: "BERMUDA NYLON CARGO RECIFE",
    categoria: "bermudas",
    preco: 259.00,
    imagem: "assets/imagotipo-black.png",
    imagem2: "assets/isotipo-black.png",
    tamanhos: ["P", "M", "G", "GG"],
    descricao: "Nylon hidrorrepelente de secagem rápida com forro respirável. Ideal para o calor litorâneo e sessões urbanas."
  },
  {
    id: 8,
    nome: "SHORTS SARJA HEAVYWEIGHT",
    categoria: "bermudas",
    preco: 279.00,
    imagem: "assets/isotipo-black.png",
    imagem2: "assets/logotipo-black.png",
    tamanhos: ["P", "M", "G", "GG"],
    descricao: "Comprimento no joelho, corte reto brutalista e cós com elástico interno e cordão plano em algodão."
  },
  {
    id: 9,
    nome: "SWEATSHORTS BOX CUT",
    categoria: "bermudas",
    preco: 249.00,
    imagem: "assets/logotipo-black.png",
    imagem2: "assets/imagotipo-black.png",
    tamanhos: ["P", "M", "G", "GG"],
    descricao: "Moletom felpado 3 cabos com barra a fio cru. Máximo conforto e silhueta desestruturada."
  },

  // --- CAMISAS ---
  {
    id: 10,
    nome: "CAMISA OVERSIZED GRAFFITI",
    categoria: "camisas",
    preco: 199.00,
    imagem: "assets/logotipo-black.png",
    imagem2: "assets/isotipo-black.png",
    tamanhos: ["P", "M", "G", "GG", "XGG"],
    descricao: "Malha pesada fio 20.1 penteado (240g/m²). Lettering exclusivo DRIP081 em silk screen de alta densidade no peito."
  },
  {
    id: 11,
    nome: "BOX TEE MONOCHROME D",
    categoria: "camisas",
    preco: 189.00,
    imagem: "assets/isotipo-black.png",
    imagem2: "assets/imagotipo-black.png",
    tamanhos: ["P", "M", "G", "GG"],
    descricao: "Modelagem quadrada, gola canelada grossa de 3cm e ombros caídos. Isotipo 'D' posicionado discretamente."
  },
  {
    id: 12,
    nome: "CAMISA POLO STREET MINIMAL",
    categoria: "camisas",
    preco: 239.00,
    imagem: "assets/imagotipo-black.png",
    imagem2: "assets/logotipo-black.png",
    tamanhos: ["P", "M", "G", "GG"],
    descricao: "Piquet encorpado em algodão egípcio com vista oculta de botões. Caimento relaxed contemporâneo."
  },

  // --- MOLETONS ---
  {
    id: 13,
    nome: "HOODIE HEAVYWEIGHT 450G",
    categoria: "moletons",
    preco: 449.00,
    imagem: "assets/imagotipo-black.png",
    imagem2: "assets/isotipo-black.png",
    tamanhos: ["P", "M", "G", "GG", "XGG"],
    descricao: "Moletom peluciado de altíssima gramatura (450g). Capuz duplo sem cordões no autêntico estilo Palace Skateboards."
  },
  {
    id: 14,
    nome: "CREWNECK ARCHIVE 081",
    categoria: "moletons",
    preco: 389.00,
    imagem: "assets/logotipo-black.png",
    imagem2: "assets/imagotipo-black.png",
    tamanhos: ["P", "M", "G", "GG"],
    descricao: "Gola careca reforçada, costuras trançadas industriais e modelagem boxy com punhos largos e firmes."
  },
  {
    id: 15,
    nome: "ZIP HOODIE OVERSIZED",
    categoria: "moletons",
    preco: 479.00,
    imagem: "assets/isotipo-black.png",
    imagem2: "assets/logotipo-black.png",
    tamanhos: ["P", "M", "G", "GG"],
    descricao: "Zíper metálico tratorado YKK bidirecional. Bolsos frontais embutidos e acabamento premium monocromático."
  },

  // --- BONÉS ---
  {
    id: 16,
    nome: "BONÉ 5-PANEL TECH NYLON",
    categoria: "bones",
    preco: 179.00,
    imagem: "assets/isotipo-black.png",
    imagem2: "assets/logotipo-black.png",
    tamanhos: ["ÚNICO"],
    descricao: "Construção de 5 painéis em nylon fosco com ilhoses de ventilação cortados a laser e fivela de nylon regulável."
  },
  {
    id: 17,
    nome: "DAD HAT DRIP081 WASHED",
    categoria: "bones",
    preco: 169.00,
    imagem: "assets/imagotipo-black.png",
    imagem2: "assets/isotipo-black.png",
    tamanhos: ["ÚNICO"],
    descricao: "Sarja lavada desestruturada com aba curvada e bordado tonal. Fecho traseiro em fita de tecido com fivela metálica."
  },
  {
    id: 18,
    nome: "CAMP CAP STREET GRAFFITI",
    categoria: "bones",
    preco: 179.00,
    imagem: "assets/logotipo-black.png",
    imagem2: "assets/imagotipo-black.png",
    tamanhos: ["ÚNICO"],
    descricao: "Aba reta reforçada em sarja rígida. Etiqueta frontal emborrachada de alta precisão com o lettering da marca."
  }
];

/**
 * Função assíncrona desacoplada para obter os produtos.
 * Consulta prioritariamente o Supabase; se o banco estiver indisponível
 * ou a tabela ainda não tiver sido criada, recorre ao catálogo local como fallback.
 */
async function getProducts() {
  if (window.DRIP081_DB && typeof window.DRIP081_DB.fetchProducts === 'function') {
    try {
      const dbProducts = await window.DRIP081_DB.fetchProducts();
      if (Array.isArray(dbProducts) && dbProducts.length > 0) {
        console.log(`[DRIP081] Carregados ${dbProducts.length} produtos do Supabase.`);
        return dbProducts;
      }
    } catch (e) {
      console.warn("[DRIP081] Erro ao carregar do Supabase, usando catálogo local:", e);
    }
  }

  // Fallback padrão com dados locais
  return Promise.resolve([...PRODUCTS_DATA]);
}

const DEFAULT_CATEGORIES = [
  { id: 1, slug: "sapatos", nome: "SAPATOS" },
  { id: 2, slug: "calcas", nome: "CALÇAS" },
  { id: 3, slug: "bermudas", nome: "BERMUDAS" },
  { id: 4, slug: "camisas", nome: "CAMISAS" },
  { id: 5, slug: "moletons", nome: "MOLETONS" },
  { id: 6, slug: "bones", nome: "BONÉS" }
];

/**
 * Função assíncrona desacoplada para obter as categorias.
 * Consulta prioritariamente o Supabase; se não houver dados,
 * consulta o cache local ou as categorias padrão.
 */
async function getCategories() {
  if (window.DRIP081_DB && typeof window.DRIP081_DB.fetchCategories === 'function') {
    try {
      const dbCategories = await window.DRIP081_DB.fetchCategories();
      if (Array.isArray(dbCategories) && dbCategories.length > 0) {
        localStorage.setItem('drip081_cached_categories', JSON.stringify(dbCategories));
        return dbCategories;
      }
    } catch (e) {
      console.warn("[DRIP081] Erro ao carregar categorias do Supabase:", e);
    }
  }

  // Tenta ler do cache do navegador
  try {
    const cached = localStorage.getItem('drip081_cached_categories');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {}

  return Promise.resolve([...DEFAULT_CATEGORIES]);
}

// Expõe globalmente no navegador
window.DRIP081_PRODUCTS = {
  data: PRODUCTS_DATA,
  categories: DEFAULT_CATEGORIES,
  getProducts: getProducts,
  getCategories: getCategories
};
