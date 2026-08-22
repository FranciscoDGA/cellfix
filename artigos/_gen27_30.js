const fs = require('fs');
const path = require('path');
const dir = __dirname;

function head(title, desc, slug, cat, catName) {
return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${desc}">
  <link rel="canonical" href="https://www.cellfixbrasil.com.br/artigos/${slug}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${desc}">
  <meta property="og:url" content="https://www.cellfixbrasil.com.br/artigos/${slug}">
  <meta property="og:type" content="article">
  <meta property="og:locale" content="pt_BR">
  <meta property="og:site_name" content="CellFix Brasil">
  <meta property="og:image" content="https://www.cellfixbrasil.com.br/imagens/artigos/${slug.replace('.html','-cover.webp')}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${desc}">
  <meta name="twitter:image" content="https://www.cellfixbrasil.com.br/imagens/artigos/${slug.replace('.html','-cover.webp')}">
  <link rel="stylesheet" href="../css/style.css">
  <link rel="stylesheet" href="../css/article.css">
  <link rel="stylesheet" href="../css/responsive.css">
</head>
<body>
  <a class="skip-link" href="#conteudo-principal">Ir para o conte&uacute;do</a>
  <header class="site-header" id="site-header">
    <div class="header-inner">
      <a href="../index.html" class="logo">CellFix<span>Brasil</span></a>
      <nav class="main-nav" id="main-nav">
        <a href="../index.html">In&iacute;cio</a>
        <a href="../categorias/erros-de-apps.html">Erros de Apps</a>
        <a href="../categorias/android.html">Android</a>
        <a href="../categorias/iphone.html">iPhone</a>
        <a href="../categorias/configuracoes-e-dicas.html"${cat==='config'?' class="active"':''}>Configura&ccedil;&otilde;es e Dicas</a>
        <a href="../categorias/apps-populares.html"${cat==='apps'?' class="active"':''}>Apps Populares</a>
        <a href="../sobre.html">Sobre</a>
        <a href="../contato.html">Contato</a>
      </nav>
      <button class="search-btn" id="search-btn" aria-label="Buscar">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      </button>
      <button class="hamburger" id="hamburger" aria-label="Menu"><span></span><span></span><span></span></button>
    </div>
  </header>
  <div class="search-overlay" id="search-overlay">
    <form class="search-form" role="search">
      <input type="search" placeholder="Buscar no CellFix Brasil..." id="search-input" aria-label="Buscar">
      <button type="submit">Buscar</button>
      <button type="button" class="close-search" id="close-search" aria-label="Fechar busca">&times;</button>
    </form>
  </div>

  <main id="conteudo-principal">
    <div class="container">
      <nav class="breadcrumbs" aria-label="breadcrumb">
        <a href="../index.html">In&iacute;cio</a> &gt;
        <a href="../categorias/${cat==='config'?'configuracoes-e-dicas':'apps-populares'}.html">${catName}</a> &gt;
        <span>${title.split('—')[0].trim()}</span>
      </nav>

      <article class="article-page">
        <header class="article-header">
          <h1>${title}</h1>
          <div class="article-meta">
            <span class="author">Por <strong>Equipe CellFix Brasil</strong></span>
            <time datetime="2026-08-20">20 ago 2026</time>
            <span class="updated">Atualizado em <time datetime="2026-08-22">22 ago 2026</time></span>
            <span class="reading-time">8 min de leitura</span>
          </div>
        </header>

        <figure class="article-featured-image">
          <img src="../imagens/artigos/${slug.replace('.html','-cover.webp')}" alt="${title}" width="1200" height="630" loading="eager">
          <figcaption>${title.split('—')[0].trim()}</figcaption>
        </figure>

        <div class="article-body">
`;
}

function tail(slug, title, cat, catName, faqItems) {
  let faqHtml = faqItems.map(f => `
        <details>
          <summary>${f.q}</summary>
          <p>${f.a}</p>
        </details>`).join('\n');

  let breadcrumbName = title.split('—')[0].trim();
  let catUrl = cat==='config'?'configuracoes-e-dicas':'apps-populares';

  return `
        <h2>Perguntas Frequentes (FAQ)</h2>
${faqHtml}

        <div class="author-box">
          <div class="author-info">
            <strong>Equipe CellFix Brasil</strong>
            <p>Equipe t&eacute;cnica especializada em solu&ccedil;&otilde;es para celulares e dispositivos m&oacute;veis.</p>
          </div>
        </div>

        <section class="related-articles">
          <h3>Artigos Relacionados</h3>
          <div class="related-grid">
            <a href="ativar-modo-escuro-todos-apps.html" class="related-card">
              <span class="category-badge">Configura&ccedil;&otilde;es e Dicas</span>
              <h4>Como ativar modo escuro em todos os apps do celular</h4>
            </a>
            <a href="liberar-espaco-celular-samsung.html" class="related-card">
              <span class="category-badge">Configura&ccedil;&otilde;es e Dicas</span>
              <h4>Como liberar espa&ccedil;o no celular Samsung sem apagar fotos</h4>
            </a>
            <a href="proteger-celular-de-virus.html" class="related-card">
              <span class="category-badge">Configura&ccedil;&otilde;es e Dicas</span>
              <h4>Como proteger celular de v&iacute;rus e golpes</h4>
            </a>
          </div>
        </section>
      </article>
    </div>
  </main>

  <footer class="site-footer">
    <div class="footer-inner">
      <div class="footer-col">
        <a href="../index.html" class="logo">CellFix<span>Brasil</span></a>
        <p>Resolvendo problemas de celulares e apps para milh&otilde;es de brasileiros.</p>
      </div>
      <div class="footer-col">
        <h4>Navega&ccedil;&atilde;o</h4>
        <nav>
          <a href="../index.html">In&iacute;cio</a>
          <a href="../sobre.html">Sobre</a>
          <a href="../contato.html">Contato</a>
        </nav>
      </div>
      <div class="footer-col">
        <h4>Categorias</h4>
        <nav>
          <a href="../categorias/erros-de-apps.html">Erros de Apps</a>
          <a href="../categorias/android.html">Android</a>
          <a href="../categorias/iphone.html">iPhone</a>
          <a href="../categorias/configuracoes-e-dicas.html">Configura&ccedil;&otilde;es e Dicas</a>
          <a href="../categorias/apps-populares.html">Apps Populares</a>
        </nav>
      </div>
      <div class="footer-col">
        <h4>Legal</h4>
        <nav>
          <a href="../politica-de-privacidade.html">Pol&iacute;tica de Privacidade</a>
          <a href="../termos-de-uso.html">Termos de Uso</a>
        </nav>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; 2026 CellFix Brasil. Todos os direitos reservados.</p>
    </div>
  </footer>

  <script src="../js/main.js"></script>
  <script src="../js/search.js"></script>
  <script src="../js/cookies.js"></script>

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "${title.replace(/"/g, '\\"')}",
    "description": "${desc_}",
    "author": {"@type": "Organization", "name": "Equipe CellFix Brasil"},
    "publisher": {"@type": "Organization", "name": "CellFix Brasil", "logo": {"@type": "ImageObject", "url": "https://www.cellfixbrasil.com.br/images/logo.png"}},
    "datePublished": "2026-08-20",
    "dateModified": "2026-08-22",
    "image": "https://www.cellfixbrasil.com.br/imagens/artigos/${slug.replace('.html','-cover.webp')}",
    "mainEntityOfPage": {"@type": "WebPage", "@id": "https://www.cellfixbrasil.com.br/artigos/${slug}"}
  }
  </script>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {"@type": "ListItem", "position": 1, "name": "In&iacute;cio", "item": "https://www.cellfixbrasil.com.br/"},
      {"@type": "ListItem", "position": 2, "name": "${catName}", "item": "https://www.cellfixbrasil.com.br/categorias/${catUrl}.html"},
      {"@type": "ListItem", "position": 3, "name": "${breadcrumbName}", "item": "https://www.cellfixbrasil.com.br/artigos/${slug}"}
    ]
  }
  </script>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [${faqItems.map(f => `{"@type": "Question", "name": "${f.q.replace(/"/g, '\\"')}", "acceptedAnswer": {"@type": "Answer", "text": "${f.a.replace(/"/g, '\\"').replace(/<[^>]*>/g, '')}"}}`).join(',')}]
  }
  </script>
</body>
</html>`;
}

console.log('Generator loaded. Run individual article generators.');
