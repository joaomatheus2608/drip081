/**
 * DRIP081 - Cliente de Integração com o Supabase
 * Gerencia a comunicação em tempo real com o banco de dados PostgreSQL do Supabase.
 */

const SUPABASE_URL = "https://fysmydnbpmtxheyvpkmi.supabase.co";
const SUPABASE_KEY = "sb_publishable_r5BEVBjWaCi7z68plQn2HQ_scSiAEoc";

let supabaseClient = null;

if (typeof window.supabase !== 'undefined' && typeof window.supabase.createClient === 'function') {
  try {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log("[DRIP081] Supabase inicializado com sucesso.");
  } catch (err) {
    console.error("[DRIP081] Falha ao inicializar o cliente Supabase:", err);
  }
} else {
  console.warn("[DRIP081] Biblioteca @supabase/supabase-js não encontrada.");
}

/* ==========================================================================
   CRUD: PRODUTOS
   ========================================================================== */

/**
 * Busca todos os produtos cadastrados no Supabase
 */
async function fetchSupabaseProducts() {
  if (!supabaseClient) {
    console.warn("[DRIP081] Supabase não conectado. Usando dados locais como fallback.");
    return null;
  }

  try {
    const { data, error } = await supabaseClient
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
  if (!supabaseClient) {
    throw new Error("Cliente Supabase não está conectado.");
  }

  const { data, error } = await supabaseClient
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
  if (!supabaseClient) {
    throw new Error("Cliente Supabase não está conectado.");
  }

  const { data, error } = await supabaseClient
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
  if (!supabaseClient) {
    throw new Error("Cliente Supabase não está conectado.");
  }

  const { data, error } = await supabaseClient
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
  if (!supabaseClient) return null;

  try {
    const { data, error } = await supabaseClient
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
  if (!supabaseClient) {
    throw new Error("Cliente Supabase não está conectado.");
  }

  const { data, error } = await supabaseClient
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
  if (!supabaseClient) {
    throw new Error("Cliente Supabase não está conectado.");
  }

  const { data, error } = await supabaseClient
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
  if (!supabaseClient) {
    throw new Error("Cliente Supabase não está conectado.");
  }

  const { data, error } = await supabaseClient
    .from('categorias')
    .delete()
    .eq('id', categoryId);

  if (error) throw error;
  return data;
}

// Expõe helpers no objeto global da aplicação
window.DRIP081_DB = {
  client: supabaseClient,
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
