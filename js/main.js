/**
 * DRIP081 - Lógica Principal (Vanilla JS)
 * Estilo Palace Skateboards: Cru, minimalista e de alta performance.
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeroPage();
  initWebshopPage();
});

/* ==========================================================================
   MÓDULO: HERO (index.html)
   ========================================================================== */
function initHeroPage() {
  const tickerTrack = document.getElementById('hero-ticker-track');
  if (!tickerTrack) return;

  // Apenas nomes dos produtos e categorias streetwear
  const HERO_PRODUCTS_LIST = [
    "SAPATOS",
    "CALÇAS",
    "BERMUDAS",
    "CAMISAS",
    "MOLETONS",
    "BONÉS",
    "TÊNIS CHUNK 081",
    "BAGGY SKATE RAW",
    "CARGO RIPSTOP",
    "OVERSIZED BOX TEE",
    "HEAVYWEIGHT HOODIE",
    "5-PANEL TECH CAP",
    "DRIP081"
  ];

  // Duplicamos a lista para criar rolagem contínua infinita ultra suave e lenta
  const duplicatedItems = [...HERO_PRODUCTS_LIST, ...HERO_PRODUCTS_LIST];
  tickerTrack.innerHTML = '';

  duplicatedItems.forEach((text) => {
    const itemEl = document.createElement('div');
    itemEl.className = 'hero-ticker-item';
    itemEl.textContent = text;
    tickerTrack.appendChild(itemEl);
  });
}

/* ==========================================================================
   MÓDULO: WEBSHOP (webshop.html)
   ========================================================================== */
function initWebshopPage() {
  const productsGrid = document.getElementById('products-grid');
  if (!productsGrid) return; // Não estamos na página Webshop

  const categoryNav = document.getElementById('category-nav');
  const shopStatusCount = document.getElementById('shop-status-count');
  const floatingFilterBtn = document.getElementById('btn-floating-filter');
  const filterDrawerOverlay = document.getElementById('filter-drawer-overlay');
  const drawerCloseBtn = document.getElementById('drawer-close-btn');
  const btnApplyFilters = document.getElementById('btn-apply-filters');
  const btnResetFilters = document.getElementById('btn-reset-filters');
  const drawerCategoryOptions = document.getElementById('drawer-category-options');
  const drawerSortOptions = document.getElementById('drawer-sort-options');

  // Modal de produto
  const modalOverlay = document.getElementById('product-modal-overlay');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalImg = document.getElementById('modal-main-img');
  const modalGalleryThumbs = document.getElementById('modal-gallery-thumbs');
  const modalCategoryTag = document.getElementById('modal-category-tag');
  const modalTitle = document.getElementById('modal-title');
  const modalPrice = document.getElementById('modal-price');
  const modalDesc = document.getElementById('modal-desc');
  const modalSizeOptions = document.getElementById('modal-size-options');
  const btnModalBuy = document.getElementById('btn-modal-buy');

  // Estado da loja
  let allProducts = [];
  let allCategories = [];
  let currentCategory = 'todos';
  let currentSort = 'default';
  let selectedProduct = null;
  let selectedSize = null;

  // Formatador de Moeda BRL
  const currencyFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2
  });

  /**
   * Carrega categorias dinâmicas (Supabase / local)
   */
  async function loadCategories() {
    try {
      if (window.DRIP081_PRODUCTS && typeof window.DRIP081_PRODUCTS.getCategories === 'function') {
        allCategories = await window.DRIP081_PRODUCTS.getCategories();
      } else {
        allCategories = window.DRIP081_PRODUCTS?.categories || [];
      }
      renderCategoryNav();
    } catch (e) {
      console.warn("Erro ao carregar categorias dinâmicas:", e);
    }
  }

  function renderCategoryNav() {
    if (!categoryNav) return;

    // Renderiza a barra horizontal superior
    let topHtml = `<button type="button" class="category-btn ${currentCategory === 'todos' ? 'active' : ''}" data-category="todos">TODOS</button>`;
    allCategories.forEach(cat => {
      const slug = (cat.slug || cat.nome).toLowerCase();
      const nome = cat.nome.toUpperCase();
      const isActive = currentCategory === slug ? 'active' : '';
      topHtml += `<button type="button" class="category-btn ${isActive}" data-category="${escapeHTML(slug)}">${escapeHTML(nome)}</button>`;
    });
    categoryNav.innerHTML = topHtml;

    // Renderiza as opções do drawer de filtros
    if (drawerCategoryOptions) {
      let drawerHtml = `<button type="button" class="filter-pill-opt ${currentCategory === 'todos' ? 'active' : ''}" data-value="todos">TODOS</button>`;
      allCategories.forEach(cat => {
        const slug = (cat.slug || cat.nome).toLowerCase();
        const nome = cat.nome.toUpperCase();
        const isActive = currentCategory === slug ? 'active' : '';
        drawerHtml += `<button type="button" class="filter-pill-opt ${isActive}" data-value="${escapeHTML(slug)}">${escapeHTML(nome)}</button>`;
      });
      drawerCategoryOptions.innerHTML = drawerHtml;
    }
  }

  /**
   * Inicialização assíncrona do catálogo desacoplada da fonte de dados.
   */
  async function loadCatalog() {
    await loadCategories();

    try {
      if (window.DRIP081_PRODUCTS && typeof window.DRIP081_PRODUCTS.getProducts === 'function') {
        allProducts = await window.DRIP081_PRODUCTS.getProducts();
      } else {
        allProducts = window.PRODUCTS_DATA || [];
      }
      applyFiltersAndRender();
    } catch (err) {
      console.error('Erro ao carregar catálogo de produtos:', err);
      productsGrid.innerHTML = `
        <div class="empty-state">
          <p class="empty-state-title">ERRO AO CARREGAR</p>
          <p class="empty-state-text">Não foi possível carregar os produtos. Tente recarregar a página.</p>
        </div>
      `;
    }
  }

  /**
   * Filtra e ordena os produtos conforme o estado atual.
   */
  function applyFiltersAndRender() {
    let filtered = [...allProducts];

    // 1. Filtro de Categoria
    if (currentCategory !== 'todos') {
      filtered = filtered.filter(item => item.categoria.toLowerCase() === currentCategory.toLowerCase());
    }

    // 2. Ordenação
    if (currentSort === 'price-asc') {
      filtered.sort((a, b) => a.preco - b.preco);
    } else if (currentSort === 'price-desc') {
      filtered.sort((a, b) => b.preco - a.preco);
    } else if (currentSort === 'name-asc') {
      filtered.sort((a, b) => a.nome.localeCompare(b.nome));
    } else if (currentSort === 'name-desc') {
      filtered.sort((a, b) => b.nome.localeCompare(a.nome));
    }

    if (shopStatusCount) {
      shopStatusCount.textContent = `${filtered.length} PRODUTOS`;
    }

    renderProducts(filtered);
  }

  /**
   * RENDERIZAÇÃO PURA DOS PRODUTOS
   */
  function renderProducts(productList) {
    productsGrid.classList.add('is-filtering');

    setTimeout(() => {
      productsGrid.innerHTML = '';

      if (!productList || productList.length === 0) {
        productsGrid.innerHTML = `
          <div class="empty-state">
            <p class="empty-state-title">NENHUM PRODUTO ENCONTRADO</p>
            <p class="empty-state-text">Tente selecionar outra categoria ou redefinir os filtros.</p>
          </div>
        `;
        productsGrid.classList.remove('is-filtering');
        return;
      }

      const fragment = document.createDocumentFragment();

      productList.forEach((product, index) => {
        const card = document.createElement('article');
        card.className = 'product-card';
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `${product.nome} por ${currencyFormatter.format(product.preco)}`);
        card.style.setProperty('--stagger-index', index);

        const hasSecondImg = Boolean(product.imagem2);

        card.innerHTML = `
          <div class="card-media">
            <img 
              src="${product.imagem}" 
              alt="${product.nome}" 
              class="card-img card-img-primary ${hasSecondImg ? 'has-second' : ''}" 
              loading="lazy"
            />
            ${
              hasSecondImg
                ? `<img 
                    src="${product.imagem2}" 
                    alt="${product.nome} detalhe" 
                    class="card-img card-img-secondary" 
                    loading="lazy"
                  />`
                : ''
            }
          </div>
          <div class="card-peek-info">
            <span class="card-peek-title">${escapeHTML(product.nome)}</span>
            <span class="card-peek-price">${currencyFormatter.format(product.preco)}</span>
          </div>
        `;

        card.addEventListener('click', () => openProductModal(product));
        card.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openProductModal(product);
          }
        });

        fragment.appendChild(card);
      });

      productsGrid.appendChild(fragment);
      productsGrid.classList.remove('is-filtering');
    }, 120);
  }

  /* --- NAVEGAÇÃO DE CATEGORIAS --- */
  if (categoryNav) {
    categoryNav.addEventListener('click', (e) => {
      const btn = e.target.closest('.category-btn');
      if (!btn) return;

      const cat = btn.getAttribute('data-category');
      if (!cat) return;

      categoryNav.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      syncDrawerCategory(cat);
      currentCategory = cat;
      applyFiltersAndRender();
    });
  }

  /* --- DRAWER DE FILTROS --- */
  function openFilterDrawer() {
    if (!filterDrawerOverlay) return;
    filterDrawerOverlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeFilterDrawer() {
    if (!filterDrawerOverlay) return;
    filterDrawerOverlay.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  if (floatingFilterBtn) {
    floatingFilterBtn.addEventListener('click', openFilterDrawer);
  }

  if (drawerCloseBtn) {
    drawerCloseBtn.addEventListener('click', closeFilterDrawer);
  }

  if (filterDrawerOverlay) {
    filterDrawerOverlay.addEventListener('click', (e) => {
      if (e.target === filterDrawerOverlay) {
        closeFilterDrawer();
      }
    });
  }

  if (drawerCategoryOptions) {
    drawerCategoryOptions.addEventListener('click', (e) => {
      const opt = e.target.closest('.filter-pill-opt');
      if (!opt) return;

      drawerCategoryOptions.querySelectorAll('.filter-pill-opt').forEach(b => b.classList.remove('active'));
      opt.classList.add('active');
    });
  }

  if (drawerSortOptions) {
    drawerSortOptions.addEventListener('click', (e) => {
      const opt = e.target.closest('.filter-pill-opt');
      if (!opt) return;

      drawerSortOptions.querySelectorAll('.filter-pill-opt').forEach(b => b.classList.remove('active'));
      opt.classList.add('active');
    });
  }

  function syncDrawerCategory(cat) {
    if (!drawerCategoryOptions) return;
    drawerCategoryOptions.querySelectorAll('.filter-pill-opt').forEach(btn => {
      if (btn.getAttribute('data-value') === cat) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  if (btnApplyFilters) {
    btnApplyFilters.addEventListener('click', () => {
      const activeCatBtn = drawerCategoryOptions?.querySelector('.filter-pill-opt.active');
      const activeSortBtn = drawerSortOptions?.querySelector('.filter-pill-opt.active');

      if (activeCatBtn) {
        currentCategory = activeCatBtn.getAttribute('data-value') || 'todos';
        categoryNav?.querySelectorAll('.category-btn').forEach(btn => {
          if (btn.getAttribute('data-category') === currentCategory) {
            btn.classList.add('active');
          } else {
            btn.classList.remove('active');
          }
        });
      }

      if (activeSortBtn) {
        currentSort = activeSortBtn.getAttribute('data-value') || 'default';
      }

      applyFiltersAndRender();
      closeFilterDrawer();
    });
  }

  if (btnResetFilters) {
    btnResetFilters.addEventListener('click', () => {
      currentCategory = 'todos';
      currentSort = 'default';

      syncDrawerCategory('todos');
      drawerSortOptions?.querySelectorAll('.filter-pill-opt').forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-value') === 'default');
      });
      categoryNav?.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-category') === 'todos');
      });

      applyFiltersAndRender();
      closeFilterDrawer();
    });
  }

  /* --- MODAL DE PRODUTO --- */
  function openProductModal(product) {
    if (!modalOverlay || !product) return;
    selectedProduct = product;
    selectedSize = product.tamanhos && product.tamanhos.length > 0 ? product.tamanhos[0] : null;

    if (modalCategoryTag) modalCategoryTag.textContent = product.categoria;
    if (modalTitle) modalTitle.textContent = product.nome;
    if (modalPrice) modalPrice.textContent = currencyFormatter.format(product.preco);
    if (modalDesc) modalDesc.textContent = product.descricao || '';
    if (modalImg) {
      modalImg.src = product.imagem;
      modalImg.alt = product.nome;
    }

    if (modalGalleryThumbs) {
      modalGalleryThumbs.innerHTML = '';
      if (product.imagem2) {
        const thumb1 = createThumbBtn(product.imagem, product.nome, true);
        const thumb2 = createThumbBtn(product.imagem2, `${product.nome} detalhe`, false);
        modalGalleryThumbs.appendChild(thumb1);
        modalGalleryThumbs.appendChild(thumb2);
      }
    }

    if (modalSizeOptions) {
      modalSizeOptions.innerHTML = '';
      if (product.tamanhos && product.tamanhos.length > 0) {
        product.tamanhos.forEach((size, idx) => {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = `size-btn ${idx === 0 ? 'active' : ''}`;
          btn.textContent = size;
          btn.addEventListener('click', () => {
            modalSizeOptions.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedSize = size;
          });
          modalSizeOptions.appendChild(btn);
        });
      }
    }

    if (btnModalBuy) {
      btnModalBuy.textContent = 'COMPRAR';
      btnModalBuy.classList.remove('btn-added');
      btnModalBuy.disabled = false;
    }

    modalOverlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function createThumbBtn(imgSrc, altText, isActive) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `modal-thumb-btn ${isActive ? 'active' : ''}`;
    btn.setAttribute('aria-label', altText);
    btn.innerHTML = `<img src="${imgSrc}" alt="${altText}">`;
    btn.addEventListener('click', () => {
      modalGalleryThumbs.querySelectorAll('.modal-thumb-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (modalImg) modalImg.src = imgSrc;
    });
    return btn;
  }

  function closeProductModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('is-open');
    document.body.style.overflow = '';
    selectedProduct = null;
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeProductModal);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeProductModal();
      }
    });
  }

  if (btnModalBuy) {
    btnModalBuy.addEventListener('click', () => {
      const originalText = 'COMPRAR';
      btnModalBuy.textContent = `ADICIONADO (${selectedSize || 'ÚNICO'}) ✓`;
      btnModalBuy.classList.add('btn-added');

      setTimeout(() => {
        btnModalBuy.textContent = originalText;
        btnModalBuy.classList.remove('btn-added');
      }, 2000);
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (modalOverlay && modalOverlay.classList.contains('is-open')) {
        closeProductModal();
      }
      if (filterDrawerOverlay && filterDrawerOverlay.classList.contains('is-open')) {
        closeFilterDrawer();
      }
    }
  });

  loadCatalog();
}

function escapeHTML(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
