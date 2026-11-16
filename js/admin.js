/**
 * DRIP081 - Lógica do Painel Administrativo
 * Gerenciamento completo (CRUD) de Produtos e Categorias conectado ao Supabase.
 */

document.addEventListener('DOMContentLoaded', () => {
  initAdmin();
});

function initAdmin() {
  // --- ELEMENTOS GERAIS ---
  const dbStatusBadge = document.getElementById('db-status-badge');
  const dbStatusText = document.getElementById('db-status-text');
  const adminNotice = document.getElementById('admin-notice');
  const tabBtnProducts = document.getElementById('tab-btn-products');
  const tabBtnCategories = document.getElementById('tab-btn-categories');
  const tabContentProducts = document.getElementById('tab-products');
  const tabContentCategories = document.getElementById('tab-categories');
  const tabProdCount = document.getElementById('tab-prod-count');
  const tabCatCount = document.getElementById('tab-cat-count');

  // --- ELEMENTOS DO FORMULÁRIO DE PRODUTO ---
  const productForm = document.getElementById('product-form');
  const editProdIdInput = document.getElementById('edit-prod-id');
  const prodFormHeading = document.getElementById('form-heading');
  const btnCancelProdEdit = document.getElementById('btn-cancel-edit');
  const btnSaveProduct = document.getElementById('btn-save-product');
  const prodFeedback = document.getElementById('form-feedback');
  const prodCategorySelect = document.getElementById('prod-category');
  const linkGotoCats = document.getElementById('link-goto-cats');
  const sizesPicker = document.getElementById('admin-sizes-picker');
  const hiddenSizesInput = document.getElementById('prod-sizes');
  const productsList = document.getElementById('admin-products-list');
  const prodCounter = document.getElementById('admin-counter');
  const btnSeed = document.getElementById('btn-seed-db');

  // --- ELEMENTOS DO FORMULÁRIO DE CATEGORIA ---
  const categoryForm = document.getElementById('category-form');
  const editCatIdInput = document.getElementById('edit-cat-id');
  const catFormHeading = document.getElementById('cat-form-heading');
  const btnCancelCatEdit = document.getElementById('btn-cancel-cat-edit');
  const btnSaveCategory = document.getElementById('btn-save-category');
  const catFeedback = document.getElementById('cat-form-feedback');
  const catNameInput = document.getElementById('cat-name');
  const categoriesList = document.getElementById('admin-categories-list');
  const catCounter = document.getElementById('cat-counter');

  // Estado em memória
  let loadedProducts = [];
  let loadedCategories = [];

  const currencyFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });

  // ==========================================================================
  // NAVEGAÇÃO POR ABAS (PRODUTOS vs CATEGORIAS)
  // ==========================================================================
  function switchTab(tabId) {
    if (tabId === 'tab-products') {
      tabBtnProducts.classList.add('active');
      tabBtnCategories.classList.remove('active');
      tabContentProducts.classList.add('active');
      tabContentCategories.classList.remove('active');
    } else {
      tabBtnProducts.classList.remove('active');
      tabBtnCategories.classList.add('active');
      tabContentProducts.classList.remove('active');
      tabContentCategories.classList.add('active');
    }
  }

  tabBtnProducts.addEventListener('click', () => switchTab('tab-products'));
  tabBtnCategories.addEventListener('click', () => switchTab('tab-categories'));

  if (linkGotoCats) {
    linkGotoCats.addEventListener('click', () => switchTab('tab-categories'));
  }

  // ==========================================================================
  // CONFIGURAÇÃO DOS 2 MODOS DE IMAGEM: 1º URL | 2º UPLOADER
  // ==========================================================================
  setupImageWidget(1);
  setupImageWidget(2);

  function setupImageWidget(targetIndex) {
    const widget = document.querySelector(`.image-upload-widget[data-target="${targetIndex}"]`);
    if (!widget) return;

    const tabs = widget.querySelectorAll('.upload-tab-btn');
    const panelUrl = widget.querySelector(`#panel-url-${targetIndex}`);
    const panelFile = widget.querySelector(`#panel-file-${targetIndex}`);
    const inputUrl = widget.querySelector(`#prod-image-url-${targetIndex}`);
    const inputFile = widget.querySelector(`#prod-image-file-${targetIndex}`);
    const dropZone = widget.querySelector(`#drop-zone-${targetIndex}`);
    const previewBox = widget.querySelector(`#preview-box-${targetIndex}`);
    const previewImg = widget.querySelector(`#preview-img-${targetIndex}`);
    const btnRemove = widget.querySelector(`.btn-remove-preview[data-target="${targetIndex}"]`);
    const hiddenInput = document.getElementById(targetIndex === 1 ? 'prod-image' : 'prod-image2');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const mode = tab.getAttribute('data-mode');
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        if (mode === 'url') {
          panelUrl.classList.add('active');
          panelFile.classList.remove('active');
          inputUrl.focus();
        } else {
          panelUrl.classList.remove('active');
          panelFile.classList.add('active');
        }
      });
    });

    inputUrl.addEventListener('input', () => {
      const url = inputUrl.value.trim();
      if (url) {
        hiddenInput.value = url;
        showPreview(url);
      } else {
        hiddenInput.value = '';
        hidePreview();
      }
    });

    inputFile.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) handleFileUpload(file);
    });

    if (dropZone) {
      ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
          e.preventDefault();
          e.stopPropagation();
          dropZone.classList.add('dragover');
        });
      });

      ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
          e.preventDefault();
          e.stopPropagation();
          dropZone.classList.remove('dragover');
        });
      });

      dropZone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const file = dt.files[0];
        if (file && file.type.startsWith('image/')) {
          handleFileUpload(file);
        }
      });
    }

    function handleFileUpload(file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const rawDataUrl = event.target.result;
        optimizeImage(rawDataUrl, 1200, 0.88, (optimizedUrl) => {
          hiddenInput.value = optimizedUrl;
          showPreview(optimizedUrl);
          inputUrl.value = '';
        });
      };
      reader.readAsDataURL(file);
    }

    function showPreview(src) {
      previewImg.src = src;
      previewBox.style.display = 'flex';
      previewImg.onerror = () => {
        previewImg.src = 'assets/isotipo-black.png';
      };
    }

    function hidePreview() {
      previewImg.src = '';
      previewBox.style.display = 'none';
      hiddenInput.value = '';
      inputUrl.value = '';
      inputFile.value = '';
    }

    if (btnRemove) {
      btnRemove.addEventListener('click', hidePreview);
    }
  }

  function optimizeImage(dataUrl, maxDimension, quality, callback) {
    const img = new Image();
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      const optimized = canvas.toDataURL('image/jpeg', quality);
      callback(optimized);
    };
    img.src = dataUrl;
  }

  // ==========================================================================
  // SELETOR DE TAMANHOS
  // ==========================================================================
  if (sizesPicker) {
    sizesPicker.addEventListener('click', (e) => {
      const chip = e.target.closest('.admin-size-chip');
      if (!chip) return;
      chip.classList.toggle('active');
      updateHiddenSizes();
    });
  }

  function updateHiddenSizes() {
    const activeChips = sizesPicker.querySelectorAll('.admin-size-chip.active');
    const selected = Array.from(activeChips).map(c => c.getAttribute('data-size'));
    if (hiddenSizesInput) {
      hiddenSizesInput.value = selected.join(',');
    }
  }

  function setSizesInPicker(sizesArray) {
    const list = Array.isArray(sizesArray) ? sizesArray : (sizesArray || '').split(',');
    sizesPicker.querySelectorAll('.admin-size-chip').forEach(chip => {
      const s = chip.getAttribute('data-size');
      chip.classList.toggle('active', list.includes(s));
    });
    updateHiddenSizes();
  }

  // ==========================================================================
  // CARREGAMENTO DE DADOS (PRODUTOS & CATEGORIAS)
  // ==========================================================================
  async function loadAllData() {
    await loadCategoriesData();
    await loadProductsData();
  }

  async function loadCategoriesData() {
    categoriesList.innerHTML = `<div class="admin-loading">Carregando categorias...</div>`;

    try {
      if (window.DRIP081_PRODUCTS && typeof window.DRIP081_PRODUCTS.getCategories === 'function') {
        loadedCategories = await window.DRIP081_PRODUCTS.getCategories();
      } else {
        loadedCategories = window.DRIP081_PRODUCTS?.categories || [];
      }

      renderCategoriesUI(loadedCategories);
      populateCategorySelect(loadedCategories);
    } catch (err) {
      console.error("[ADMIN] Erro ao carregar categorias:", err);
      loadedCategories = window.DRIP081_PRODUCTS?.categories || [];
      renderCategoriesUI(loadedCategories);
      populateCategorySelect(loadedCategories);
    }
  }

  function populateCategorySelect(cats) {
    if (!prodCategorySelect) return;
    const currentVal = prodCategorySelect.value;
    prodCategorySelect.innerHTML = '';

    cats.forEach(cat => {
      const slug = (cat.slug || cat.nome).toLowerCase();
      const nome = cat.nome.toUpperCase();
      const opt = document.createElement('option');
      opt.value = slug;
      opt.textContent = nome;
      prodCategorySelect.appendChild(opt);
    });

    if (currentVal && Array.from(prodCategorySelect.options).some(o => o.value === currentVal)) {
      prodCategorySelect.value = currentVal;
    }
  }

  function renderCategoriesUI(cats) {
    if (catCounter) catCounter.textContent = `${cats.length} CATEGORIAS`;
    if (tabCatCount) tabCatCount.textContent = cats.length;

    categoriesList.innerHTML = '';

    if (!cats || cats.length === 0) {
      categoriesList.innerHTML = `<div class="admin-empty">Nenhuma categoria cadastrada.</div>`;
      return;
    }

    cats.forEach(cat => {
      const slug = (cat.slug || cat.nome).toLowerCase();
      const nome = cat.nome.toUpperCase();
      
      // Conta produtos associados a esta categoria
      const prodCount = loadedProducts.filter(p => (p.categoria || '').toLowerCase() === slug).length;

      const itemEl = document.createElement('div');
      itemEl.className = 'admin-category-item';

      itemEl.innerHTML = `
        <div class="admin-cat-info">
          <h3 class="admin-cat-name">${escapeHTML(nome)}</h3>
          <span class="admin-cat-slug">SLUG: /${escapeHTML(slug)} &bull; ${prodCount} PRODUTO(S)</span>
        </div>
        <div class="admin-item-actions">
          <button type="button" class="btn-action-edit btn-edit-category" title="Editar categoria">EDITAR</button>
          <button type="button" class="btn-action-delete btn-delete-category" title="Excluir categoria">&times;</button>
        </div>
      `;

      // Eventos
      itemEl.querySelector('.btn-edit-category').addEventListener('click', () => handleEditCategory(cat));
      itemEl.querySelector('.btn-delete-category').addEventListener('click', () => handleDeleteCategory(cat));

      categoriesList.appendChild(itemEl);
    });
  }

  async function loadProductsData() {
    productsList.innerHTML = `<div class="admin-loading">Carregando catálogo do Supabase...</div>`;

    try {
      const data = await window.DRIP081_DB.fetchProducts();

      if (data === null) {
        updateDbStatus(false, "AGUARDANDO TABELA 'PRODUTOS'");
        if (adminNotice) adminNotice.style.display = 'block';
        loadedProducts = window.PRODUCTS_DATA || [];
        renderProductsUI(loadedProducts, true);
        return;
      }

      updateDbStatus(true, "CONECTADO AO SUPABASE");
      if (adminNotice) adminNotice.style.display = 'none';

      loadedProducts = data;
      renderProductsUI(loadedProducts, false);
      // Atualiza contadores nas categorias
      renderCategoriesUI(loadedCategories);
    } catch (err) {
      console.error("[ADMIN] Erro ao carregar produtos:", err);
      updateDbStatus(false, "FALHA NA CONEXÃO");
      loadedProducts = window.PRODUCTS_DATA || [];
      renderProductsUI(loadedProducts, true);
    }
  }

  function updateDbStatus(isConnected, message) {
    if (!dbStatusBadge || !dbStatusText) return;
    dbStatusBadge.classList.toggle('is-connected', isConnected);
    dbStatusBadge.classList.toggle('is-error', !isConnected);
    dbStatusText.textContent = message;
  }

  function renderProductsUI(items, isFallback) {
    if (prodCounter) {
      prodCounter.textContent = `${items.length} ITENS ${isFallback ? '(LOCAL MOCK)' : '(BANCO DE DADOS)'}`;
    }
    if (tabProdCount) tabProdCount.textContent = items.length;

    productsList.innerHTML = '';

    if (!items || items.length === 0) {
      productsList.innerHTML = `
        <div class="admin-empty">
          Nenhum produto cadastrado no banco de dados ainda.<br>
          Cadastre uma nova peça ao lado ou clique em "SINCRONIZAR 18 PRODUTOS".
        </div>
      `;
      return;
    }

    items.forEach(prod => {
      const itemEl = document.createElement('div');
      itemEl.className = 'admin-product-item';

      const sizesText = Array.isArray(prod.tamanhos) 
        ? prod.tamanhos.join(', ') 
        : (typeof prod.tamanhos === 'string' ? prod.tamanhos : '-');

      itemEl.innerHTML = `
        <div class="admin-prod-thumb">
          <img src="${prod.imagem}" alt="${escapeHTML(prod.nome)}">
        </div>
        <div class="admin-prod-info">
          <span class="admin-prod-category">${escapeHTML(prod.categoria)}</span>
          <h3 class="admin-prod-name">${escapeHTML(prod.nome)}</h3>
          <div class="admin-prod-price">${currencyFormatter.format(prod.preco)}</div>
          <div class="admin-prod-sizes">Tamanhos: ${escapeHTML(sizesText)}</div>
        </div>
        <div class="admin-item-actions">
          <button type="button" class="btn-action-edit btn-edit-product" title="Editar este produto">EDITAR</button>
          ${
            !isFallback 
              ? `<button type="button" class="btn-action-delete btn-delete-product" title="Excluir produto do Supabase">&times;</button>`
              : `<span class="badge-mock" title="Item em fallback local">LOCAL</span>`
          }
        </div>
      `;

      itemEl.querySelector('.btn-edit-product').addEventListener('click', () => handleEditProduct(prod));

      const delBtn = itemEl.querySelector('.btn-delete-product');
      if (delBtn) {
        delBtn.addEventListener('click', () => handleDeleteProduct(prod.id, prod.nome));
      }

      productsList.appendChild(itemEl);
    });
  }

  // ==========================================================================
  // CRUD: PRODUTO (CRIAR & EDITAR)
  // ==========================================================================
  function handleEditProduct(prod) {
    // Altera para a aba de produtos se necessário
    switchTab('tab-products');

    editProdIdInput.value = prod.id;
    document.getElementById('prod-name').value = prod.nome || '';
    document.getElementById('prod-category').value = (prod.categoria || '').toLowerCase();
    document.getElementById('prod-price').value = prod.preco || '';
    document.getElementById('prod-desc').value = prod.descricao || '';

    // Tamanhos
    setSizesInPicker(prod.tamanhos || []);

    // Imagem 1
    const hiddenImg1 = document.getElementById('prod-image');
    hiddenImg1.value = prod.imagem || '';
    const previewBox1 = document.getElementById('preview-box-1');
    const previewImg1 = document.getElementById('preview-img-1');
    if (prod.imagem) {
      previewImg1.src = prod.imagem;
      previewBox1.style.display = 'flex';
      document.getElementById('prod-image-url-1').value = prod.imagem.startsWith('http') ? prod.imagem : '';
    } else {
      previewBox1.style.display = 'none';
    }

    // Imagem 2
    const hiddenImg2 = document.getElementById('prod-image2');
    hiddenImg2.value = prod.imagem2 || '';
    const previewBox2 = document.getElementById('preview-box-2');
    const previewImg2 = document.getElementById('preview-img-2');
    if (prod.imagem2) {
      previewImg2.src = prod.imagem2;
      previewBox2.style.display = 'flex';
      document.getElementById('prod-image-url-2').value = prod.imagem2.startsWith('http') ? prod.imagem2 : '';
    } else {
      previewBox2.style.display = 'none';
    }

    // Estado do formulário
    prodFormHeading.textContent = `EDITANDO: ${prod.nome}`;
    btnSaveProduct.textContent = "SALVAR ALTERAÇÕES (UPDATE)";
    btnCancelProdEdit.style.display = 'inline-block';

    // Rola até o formulário
    productForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
    document.getElementById('prod-name').focus();
  }

  function resetProductForm() {
    editProdIdInput.value = '';
    productForm.reset();
    prodFormHeading.textContent = "+ NOVO PRODUTO";
    btnSaveProduct.textContent = "CADASTRAR NO SUPABASE";
    btnCancelProdEdit.style.display = 'none';

    // Limpa prévias
    document.getElementById('preview-box-1').style.display = 'none';
    document.getElementById('preview-box-2').style.display = 'none';
    document.getElementById('prod-image').value = '';
    document.getElementById('prod-image2').value = '';

    // Reseta tamanhos
    setSizesInPicker(["P", "M", "G", "GG"]);
  }

  btnCancelProdEdit.addEventListener('click', resetProductForm);

  if (productForm) {
    productForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const editId = editProdIdInput.value;
      const nome = document.getElementById('prod-name').value.trim();
      const categoria = document.getElementById('prod-category').value;
      const preco = parseFloat(document.getElementById('prod-price').value);
      const imagem = document.getElementById('prod-image').value.trim();
      const imagem2 = document.getElementById('prod-image2').value.trim() || null;
      const descricao = document.getElementById('prod-desc').value.trim();
      const rawSizes = hiddenSizesInput ? hiddenSizesInput.value : '';
      const tamanhos = rawSizes ? rawSizes.split(',').filter(Boolean) : ["ÚNICO"];

      if (!nome || isNaN(preco)) {
        showFeedback(prodFeedback, "Por favor, informe o nome e o preço da peça.", false);
        return;
      }

      if (!imagem) {
        showFeedback(prodFeedback, "Por favor, adicione a imagem principal (por URL ou Uploader).", false);
        return;
      }

      const payload = {
        nome: nome.toUpperCase(),
        categoria: categoria.toLowerCase(),
        preco: preco,
        imagem: imagem,
        imagem2: imagem2,
        tamanhos: tamanhos,
        descricao: descricao
      };

      try {
        setProductLoading(true);

        if (editId) {
          // UPDATE
          showFeedback(prodFeedback, `Atualizando "${payload.nome}" no Supabase...`, null);
          await window.DRIP081_DB.updateProduct(editId, payload);
          showFeedback(prodFeedback, `✓ "${payload.nome}" atualizado com sucesso!`, true);
        } else {
          // INSERT
          showFeedback(prodFeedback, "Cadastrando no Supabase...", null);
          await window.DRIP081_DB.insertProduct(payload);
          showFeedback(prodFeedback, `✓ "${payload.nome}" cadastrado com sucesso!`, true);
        }

        resetProductForm();
        await loadProductsData();
      } catch (err) {
        console.error("[ADMIN] Falha ao salvar produto:", err);
        showFeedback(prodFeedback, `Erro ao salvar: ${err.message}`, false);
      } finally {
        setProductLoading(false);
      }
    });
  }

  async function handleDeleteProduct(id, nome) {
    const confirmDelete = confirm(`Deseja realmente excluir "${nome}" do banco de dados?`);
    if (!confirmDelete) return;

    try {
      showFeedback(prodFeedback, `Excluindo produto ID ${id}...`, null);
      await window.DRIP081_DB.deleteProduct(id);
      showFeedback(prodFeedback, `✓ Produto "${nome}" excluído com sucesso.`, true);
      await loadProductsData();
    } catch (err) {
      console.error("[ADMIN] Falha ao excluir produto:", err);
      showFeedback(prodFeedback, `Erro ao excluir: ${err.message}`, false);
    }
  }

  function setProductLoading(isLoading) {
    btnSaveProduct.disabled = isLoading;
    if (isLoading) {
      btnSaveProduct.textContent = "PROCESSANDO...";
    } else {
      btnSaveProduct.textContent = editProdIdInput.value ? "SALVAR ALTERAÇÕES (UPDATE)" : "CADASTRAR NO SUPABASE";
    }
  }

  // ==========================================================================
  // CRUD: CATEGORIAS (CRIAR, EDITAR & EXCLUIR)
  // ==========================================================================
  function handleEditCategory(cat) {
    editCatIdInput.value = cat.id || cat.slug;
    catNameInput.value = cat.nome || '';
    catFormHeading.textContent = `EDITANDO: ${cat.nome}`;
    btnSaveCategory.textContent = "SALVAR ALTERAÇÕES";
    btnCancelCatEdit.style.display = 'inline-block';
    catNameInput.focus();
  }

  function resetCategoryForm() {
    editCatIdInput.value = '';
    categoryForm.reset();
    catFormHeading.textContent = "+ NOVA CATEGORIA";
    btnSaveCategory.textContent = "CADASTRAR CATEGORIA";
    btnCancelCatEdit.style.display = 'none';
  }

  btnCancelCatEdit.addEventListener('click', resetCategoryForm);

  if (categoryForm) {
    categoryForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const editId = editCatIdInput.value;
      const rawName = catNameInput.value.trim();
      if (!rawName) return;

      const slug = rawName
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]/g, "");

      const payload = {
        nome: rawName.toUpperCase(),
        slug: slug
      };

      try {
        btnSaveCategory.disabled = true;
        btnSaveCategory.textContent = "SALVANDO...";

        if (editId) {
          // UPDATE
          showFeedback(catFeedback, `Atualizando categoria "${payload.nome}"...`, null);
          try {
            await window.DRIP081_DB.updateCategory(editId, payload);
          } catch (errDb) {
            console.warn("Update Supabase falhou, atualizando localmente:", errDb);
            // Atualiza cache local
            updateLocalCategory(editId, payload);
          }
          showFeedback(catFeedback, `✓ Categoria "${payload.nome}" atualizada com sucesso!`, true);
        } else {
          // INSERT
          showFeedback(catFeedback, `Cadastrando categoria "${payload.nome}"...`, null);
          try {
            await window.DRIP081_DB.insertCategory(payload);
          } catch (errDb) {
            console.warn("Insert Supabase falhou, inserindo localmente:", errDb);
            insertLocalCategory(payload);
          }
          showFeedback(catFeedback, `✓ Categoria "${payload.nome}" criada com sucesso!`, true);
        }

        resetCategoryForm();
        await loadCategoriesData();
      } catch (err) {
        console.error("[ADMIN] Erro ao salvar categoria:", err);
        showFeedback(catFeedback, `Erro: ${err.message}`, false);
      } finally {
        btnSaveCategory.disabled = false;
        btnSaveCategory.textContent = editCatIdInput.value ? "SALVAR ALTERAÇÕES" : "CADASTRAR CATEGORIA";
      }
    });
  }

  async function handleDeleteCategory(cat) {
    const confirmDelete = confirm(`Deseja excluir a categoria "${cat.nome}"? Produtos associados a ela poderão ficar sem filtro.`);
    if (!confirmDelete) return;

    try {
      showFeedback(catFeedback, `Excluindo categoria "${cat.nome}"...`, null);
      try {
        await window.DRIP081_DB.deleteCategory(cat.id);
      } catch (errDb) {
        console.warn("Delete Supabase falhou, excluindo localmente:", errDb);
        deleteLocalCategory(cat.id || cat.slug);
      }
      showFeedback(catFeedback, `✓ Categoria "${cat.nome}" excluída com sucesso.`, true);
      await loadCategoriesData();
    } catch (err) {
      console.error("[ADMIN] Erro ao excluir categoria:", err);
      showFeedback(catFeedback, `Erro: ${err.message}`, false);
    }
  }

  // Helpers de fallback de categorias no LocalStorage se a tabela ainda não foi criada
  function updateLocalCategory(id, payload) {
    let cats = getLocalCategories();
    cats = cats.map(c => (c.id == id || c.slug == id) ? { ...c, ...payload } : c);
    localStorage.setItem('drip081_cached_categories', JSON.stringify(cats));
  }

  function insertLocalCategory(payload) {
    const cats = getLocalCategories();
    const newCat = { id: Date.now(), ...payload };
    cats.push(newCat);
    localStorage.setItem('drip081_cached_categories', JSON.stringify(cats));
  }

  function deleteLocalCategory(id) {
    let cats = getLocalCategories();
    cats = cats.filter(c => c.id != id && c.slug != id);
    localStorage.setItem('drip081_cached_categories', JSON.stringify(cats));
  }

  function getLocalCategories() {
    try {
      const c = localStorage.getItem('drip081_cached_categories');
      if (c) return JSON.parse(c);
    } catch (e) {}
    return [...(window.DRIP081_PRODUCTS?.categories || [])];
  }

  // ==========================================================================
  // SINCRONIZAÇÃO EM MASSA (18 PRODUTOS)
  // ==========================================================================
  if (btnSeed) {
    btnSeed.addEventListener('click', async () => {
      const confirmSeed = confirm("Deseja sincronizar e inserir os 18 produtos iniciais da DRIP081 no Supabase?");
      if (!confirmSeed) return;

      try {
        btnSeed.disabled = true;
        btnSeed.textContent = "SINCRONIZANDO...";
        showFeedback(prodFeedback, "Inserindo produtos no Supabase, aguarde...", null);

        const defaultProducts = window.PRODUCTS_DATA || [];
        let count = 0;

        for (const item of defaultProducts) {
          const payload = {
            nome: item.nome,
            categoria: item.categoria,
            preco: item.preco,
            imagem: item.imagem,
            imagem2: item.imagem2 || null,
            tamanhos: item.tamanhos || ["P", "M", "G", "GG"],
            descricao: item.descricao || ""
          };

          await window.DRIP081_DB.insertProduct(payload);
          count++;
        }

        showFeedback(prodFeedback, `✓ ${count} produtos sincronizados com sucesso!`, true);
        await loadProductsData();
      } catch (err) {
        console.error("[ADMIN] Erro ao sincronizar:", err);
        showFeedback(prodFeedback, `Erro ao sincronizar: ${err.message}`, false);
      } finally {
        btnSeed.disabled = false;
        btnSeed.textContent = "SINCRONIZAR 18 PRODUTOS";
      }
    });
  }

  function showFeedback(el, msg, isSuccess) {
    if (!el) return;
    el.textContent = msg;
    el.className = 'form-feedback';

    if (isSuccess === true) {
      el.classList.add('is-success');
    } else if (isSuccess === false) {
      el.classList.add('is-error');
    } else {
      el.classList.add('is-info');
    }
  }

  function escapeHTML(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Inicializa tudo
  loadAllData();
}
