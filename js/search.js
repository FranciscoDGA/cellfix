/**
 * CellFix Brasil - Sistema de Busca
 * Busca de artigos com destaque de termos e normalização de acentos
 */

(function () {
  'use strict';

  // =====================================================
  // DADOS DA BUSCA
  // =====================================================
  let articlesData = [];
  let searchInput = null;
  let searchResults = null;
  let debounceTimer = null;

  // =====================================================
  // NORMALIZAÇÃO DE CARACTERES (acentos pt-BR)
  // =====================================================
  const ACCENT_MAP = {
    'a': /[àáâãäå]/g,
    'e': /[èéêë]/g,
    'i': /[ìíîï]/g,
    'o': /[òóôõö]/g,
    'u': /[ùúûü]/g,
    'y': /[ýÿ]/g,
    'c': /[ç]/g,
    'n': /[ñ]/g,
    'A': /[ÀÁÂÃÄÅ]/g,
    'E': /[ÈÉÊË]/g,
    'I': /[ÌÍÎÏ]/g,
    'O': /[ÒÓÔÕÖ]/g,
    'U': /[ÙÚÛÜ]/g,
    'Y': /[ÝŸ]/g,
    'C': /[Ç]/g,
    'N': /[Ñ]/g,
  };

  function normalizeText(text) {
    if (!text) return '';
    let normalized = text.toLowerCase();
    for (const [char, regex] of Object.entries(ACCENT_MAP)) {
      normalized = normalized.replace(regex, char);
    }
    return normalized;
  }

  // =====================================================
  // CARREGAR DADOS DOS ARTIGOS
  // =====================================================
  async function loadArticlesData() {
    try {
      const response = await fetch('/js/search-data.json');
      if (!response.ok) {
        throw new Error('Erro ao carregar dados de busca: ' + response.status);
      }
      articlesData = await response.json();
    } catch (error) {
      console.error('CellFix Brasil - Erro ao carregar dados de busca:', error);
      // Fallback: buscar dados dos artigos na página
      articlesData = [];
    }
  }

  // =====================================================
  // FUNÇÃO DE BUSCA
  // =====================================================
  function searchArticles(query) {
    if (!query || query.length < 2) return [];

    const normalizedQuery = normalizeText(query);
    const queryTerms = normalizedQuery.split(/\s+/).filter(function (term) {
      return term.length > 0;
    });

    const results = [];

    articlesData.forEach(function (article) {
      const title = normalizeText(article.title || '');
      const description = normalizeText(article.description || '');
      const category = normalizeText(article.category || '');
      const tags = Array.isArray(article.tags)
        ? article.tags.map(normalizeText).join(' ')
        : normalizeText(article.tags || '');
      const content = normalizeText(article.content || '');

      const searchableText = title + ' ' + description + ' ' + category + ' ' + tags + ' ' + content;

      let score = 0;
      let matches = true;

      queryTerms.forEach(function (term) {
        if (searchableText.indexOf(term) === -1) {
          matches = false;
          return;
        }

        // Pontuação baseada em onde o termo foi encontrado
        if (title.indexOf(term) !== -1) score += 10;
        if (tags.indexOf(term) !== -1) score += 5;
        if (category.indexOf(term) !== -1) score += 3;
        if (description.indexOf(term) !== -1) score += 2;
        if (content.indexOf(term) !== -1) score += 1;
      });

      if (matches) {
        results.push({
          article: article,
          score: score,
        });
      }
    });

    // Ordenar por pontuação (maior primeiro)
    results.sort(function (a, b) {
      return b.score - a.score;
    });

    return results.map(function (item) {
      return item.article;
    });
  }

  // =====================================================
  // DESTAQUE DO TEXTO (HIGHLIGHT)
  // =====================================================
  function highlightText(text, query) {
    if (!text || !query) return text || '';

    const normalizedQuery = normalizeText(query);
    const queryTerms = normalizedQuery.split(/\s+/).filter(function (term) {
      return term.length >= 2;
    });

    if (queryTerms.length === 0) return escapeHtml(text);

    let result = text;

    queryTerms.forEach(function (term) {
      // Criar regex que encontra o termo ignorando acentos
      const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp('(' + escapedTerm + ')', 'gi');
      result = result.replace(regex, '<mark>$1</mark>');
    });

    return result;
  }

  // =====================================================
  // ESCAPAR HTML
  // =====================================================
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(text));
    return div.innerHTML;
  }

  // =====================================================
  // EXIBIR RESULTADOS
  // =====================================================
  function displayResults(results, query) {
    if (!searchResults) return;

    if (results.length === 0) {
      searchResults.innerHTML =
        '<div class="search-no-results">' +
        '<p>Nenhum resultado encontrado para "<strong>' +
        escapeHtml(query) +
        '</strong>"</p>' +
        '<p>Tente usar outros termos ou verifique a ortografia.</p>' +
        '</div>';
      return;
    }

    let html = '<div class="search-results-list">';

    results.forEach(function (article) {
      const title = highlightText(article.title || '', query);
      const description = highlightText(article.description || '', query);
      const category = escapeHtml(article.category || '');
      const image = article.image || '/images/placeholder.jpg';

      html +=
        '<a href="' +
        escapeHtml(article.url || '#') +
        '" class="search-result-item">' +
        '<div class="search-result-image">' +
        '<img src="' +
        escapeHtml(image) +
        '" alt="" loading="lazy" />' +
        '</div>' +
        '<div class="search-result-content">' +
        '<span class="search-result-category">' +
        category +
        '</span>' +
        '<h3 class="search-result-title">' +
        title +
        '</h3>' +
        '<p class="search-result-description">' +
        description +
        '</p>' +
        '</div>' +
        '</a>';
    });

    html += '</div>';

    searchResults.innerHTML = html;
  }

  // =====================================================
  // DEBOUNCE
  // =====================================================
  function debounce(func, wait) {
    let timeout;
    return function () {
      const context = this;
      const args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(function () {
        func.apply(context, args);
      }, wait);
    };
  }

  // =====================================================
  // TRATAR INPUT DA BUSCA
  // =====================================================
  function handleSearchInput() {
    if (!searchInput) return;

    const query = searchInput.value.trim();

    if (query.length < 2) {
      if (searchResults) {
        searchResults.innerHTML = '';
      }
      return;
    }

    const results = searchArticles(query);
    displayResults(results, query);
  }

  // =====================================================
  // INICIALIZAR SISTEMA DE BUSCA
  // =====================================================
  function initSearch() {
    searchInput = document.querySelector('.search-input');
    searchResults = document.querySelector('.search-results');

    if (!searchInput) return;

    // Carregar dados dos artigos
    loadArticlesData();

    // Event listener com debounce de 300ms
    const debouncedSearch = debounce(handleSearchInput, 300);
    searchInput.addEventListener('input', debouncedSearch);

    // Limpar resultados quando fechar overlay
    const searchOverlay = document.querySelector('.search-overlay');
    const searchClose = document.querySelector('.search-close');

    if (searchClose) {
      searchClose.addEventListener('click', function () {
        searchInput.value = '';
        if (searchResults) {
          searchResults.innerHTML = '';
        }
      });
    }

    if (searchOverlay) {
      searchOverlay.addEventListener('click', function (e) {
        if (e.target === searchOverlay) {
          searchInput.value = '';
          if (searchResults) {
            searchResults.innerHTML = '';
          }
        }
      });
    }

    // Suporte a navegação por teclado nos resultados
    searchInput.addEventListener('keydown', function (e) {
      const resultsList = searchResults
        ? searchResults.querySelectorAll('.search-result-item')
        : [];
      const activeResult = searchResults
        ? searchResults.querySelector('.search-result-item:focus')
        : null;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (activeResult) {
          const next = activeResult.nextElementSibling;
          if (next) next.focus();
        } else if (resultsList.length > 0) {
          resultsList[0].focus();
        }
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (activeResult) {
          const prev = activeResult.previousElementSibling;
          if (prev) {
            prev.focus();
          } else {
            searchInput.focus();
          }
        }
      }

      if (e.key === 'Enter') {
        if (activeResult) {
          e.preventDefault();
          activeResult.click();
        }
      }
    });
  }

  // =====================================================
  // INICIALIZAR
  // =====================================================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSearch);
  } else {
    initSearch();
  }
})();
