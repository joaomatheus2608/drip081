# DRIP081 — Streetwear Recife

Loja virtual e catálogo da marca de streetwear masculino **DRIP081** (Recife/PE), desenvolvida em HTML, CSS e JavaScript puro (sem frameworks), com estética minimalista inspirada na Palace Skateboards.

## 🛠️ Tecnologias
- **HTML5 & CSS3**: Vanilla, mobile-first, paleta monocromática estrita (#0a0a0a, #1a1a1a, #8a8a8a, #f4f4f4, #ffffff).
- **JavaScript (ES6+)**: Lógica desacoplada de dados, filtros dinâmicos, modais e transições suaves.
- **Supabase**: Banco de dados PostgreSQL para cadastro, edição e exclusão de produtos e categorias em tempo real.

## 📁 Estrutura de Arquivos
- `index.html`: Hero screen imersivo com ticker vertical infinito e chamada para o catálogo.
- `webshop.html`: Vitrine de produtos com grid responsivo, filtros de categoria dinâmicos e modal de compra.
- `admin.html`: Painel administrativo com CRUD completo de produtos (URL ou Uploader) e categorias.
- `supabase_setup.sql`: Script SQL para criação de tabelas (`produtos`, `categorias`) e políticas RLS.
- `css/style.css`: Estilização completa e responsiva.
- `js/products.js`: Dados locais com fallback transparente.
- `js/supabase-client.js`: Cliente de integração com o Supabase.
- `js/main.js`: Lógica do Hero e Webshop.
- `js/admin.js`: Lógica do painel de administração.
- `assets/`: Logotipos, isotipos e mídias visuais.
