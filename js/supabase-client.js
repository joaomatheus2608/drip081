/**
 * DRIP081 - Cliente de Integração com o Supabase
 * As credenciais são carregadas dinamicamente via /api/config a partir das
 * Environment Variables seguras da Vercel (SUPABASE_URL e SUPABASE_KEY).
 */

let SUPABASE_URL = "";
let SUPABASE_KEY = "";

let supabaseClient = null;
let initPromise = null;

async function ensureSupabaseClient() {
  if (supabaseClient) return supabaseClient;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    // 1. Tenta buscar das variáveis de ambiente da Vercel (se estiver hospedado lá)
    try {
      const res = await fetch('/api/config');
      if (res.ok) {
        const config = await res.json();
        if (config.supabaseUrl && config.supabaseKey) {
          SUPABASE_URL = config.supabaseUrl;
          SUPABASE_KEY = config.supabaseKey;
        }
      }
    } catch (e) {
      // Ambiente local ou offline, utiliza as credenciais padrão
    }

    // 2. Inicializa o cliente do Supabase
    if (typeof window.supabase !== 'undefined' && typeof window.supabase.createClient === 'function') {
      try {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        console.log("[DRIP081] Supabase conectado com sucesso.");
      } catch (err) {
        console.error("[DRIP081] Falha ao inicializar o cliente Supabase:", err);
      }
    } else {
      console.warn("[DRIP081] Biblioteca @supabase/supabase-js não encontrada.");
    }

    return supabaseClient;
  })();

  return initPromise;
}

// Inicialização imediata em segundo plano
ensureSupabaseClient();

/* ==========================================================================
   CRUD: PRODUTOS
   ========================================================================== */

/**
 * Busca todos os produtos cadastrados no Supabase
 */
async function fetchSupabaseProducts() {
  const client = await ensureSupabaseClient();
  if (!client) {
    console.warn("[DRIP081] Supabase não conectado. Usando dados locais como fallback.");
    return null;
  }

  try {
    const { data, error } = await client
      .from('produtos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn("[DRIP081] Aviso ao consultar Supabase (produtos):", error.message);
      return null;
    }

    return data;
  } catch (err) {
    console.error("[DRIP081] Erro na requisição ao Supabase (produtos):", err);
    return null;
  }
}

/**
 * Cria um novo produto
 */
async function insertSupabaseProduct(productData) {
  const client = await ensureSupabaseClient();
  if (!client) {
    throw new Error("Cliente Supabase não está conectado.");
  }

  const { data, error } = await client
    .from('produtos')
    .insert([productData])
    .select();

  if (error) throw error;
  return data;
}

/**
 * Atualiza um produto existente
 */
async function updateSupabaseProduct(productId, productData) {
  const client = await ensureSupabaseClient();
  if (!client) {
    throw new Error("Cliente Supabase não está conectado.");
  }

  const { data, error } = await client
    .from('produtos')
    .update(productData)
    .eq('id', productId)
    .select();

  if (error) throw error;
  return data;
}

/**
 * Exclui um produto
 */
async function deleteSupabaseProduct(productId) {
  const client = await ensureSupabaseClient();
  if (!client) {
    throw new Error("Cliente Supabase não está conectado.");
  }

  const { data, error } = await client
    .from('produtos')
    .delete()
    .eq('id', productId);

  if (error) throw error;
  return data;
}

/* ==========================================================================
   CRUD: CATEGORIAS
   ========================================================================== */

/**
 * Busca todas as categorias cadastradas no Supabase
 */
async function fetchSupabaseCategories() {
  const client = await ensureSupabaseClient();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from('categorias')
      .select('*')
      .order('nome', { ascending: true });

    if (error) {
      console.warn("[DRIP081] Aviso ao consultar Supabase (categorias):", error.message);
      return null;
    }

    return data;
  } catch (err) {
    console.error("[DRIP081] Erro ao buscar categorias do Supabase:", err);
    return null;
  }
}

/**
 * Cria uma nova categoria
 */
async function insertSupabaseCategory(categoryData) {
  const client = await ensureSupabaseClient();
  if (!client) {
    throw new Error("Cliente Supabase não está conectado.");
  }

  const { data, error } = await client
    .from('categorias')
    .insert([categoryData])
    .select();

  if (error) throw error;
  return data;
}

/**
 * Atualiza uma categoria existente
 */
async function updateSupabaseCategory(categoryId, categoryData) {
  const client = await ensureSupabaseClient();
  if (!client) {
    throw new Error("Cliente Supabase não está conectado.");
  }

  const { data, error } = await client
    .from('categorias')
    .update(categoryData)
    .eq('id', categoryId)
    .select();

  if (error) throw error;
  return data;
}

/**
 * Exclui uma categoria
 */
async function deleteSupabaseCategory(categoryId) {
  const client = await ensureSupabaseClient();
  if (!client) {
    throw new Error("Cliente Supabase não está conectado.");
  }

  const { data, error } = await client
    .from('categorias')
    .delete()
    .eq('id', categoryId);

  if (error) throw error;
  return data;
}

// Expõe helpers no objeto global da aplicação
window.DRIP081_DB = {
  client: supabaseClient,
  ensureClient: ensureSupabaseClient,
  // Produtos
  fetchProducts: fetchSupabaseProducts,
  insertProduct: insertSupabaseProduct,
  updateProduct: updateSupabaseProduct,
  deleteProduct: deleteSupabaseProduct,
  // Categorias
  fetchCategories: fetchSupabaseCategories,
  insertCategory: insertSupabaseCategory,
  updateCategory: updateSupabaseCategory,
  deleteCategory: deleteSupabaseCategory
};
