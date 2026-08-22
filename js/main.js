/**
 * CellFix Brasil - JavaScript Principal
 * Funcionalidades gerais do site
 */

(function () {
  'use strict';

  // =====================================================
  // MENU MOBILE - Toggle do hamburger
  // =====================================================
  function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.querySelector('.mobile-nav');
    const body = document.body;

    if (!hamburger || !mobileNav) return;

    hamburger.addEventListener('click', function () {
      const isOpen = mobileNav.classList.contains('active');

      hamburger.classList.toggle('active');
      mobileNav.classList.toggle('active');
      body.classList.toggle('nav-open');

      hamburger.setAttribute('aria-expanded', !isOpen);
      mobileNav.setAttribute('aria-hidden', isOpen);
    });

    // Fechar menu ao clicar em um link
    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('active');
        mobileNav.classList.remove('active');
        body.classList.remove('nav-open');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileNav.setAttribute('aria-hidden', 'true');
      });
    });

    // Fechar menu com Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
        hamburger.classList.remove('active');
        mobileNav.classList.remove('active');
        body.classList.remove('nav-open');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileNav.setAttribute('aria-hidden', 'true');
        hamburger.focus();
      }
    });
  }

  // =====================================================
  // OVERLAY DE BUSCA - Abrir/fechar
  // =====================================================
  function initSearchOverlay() {
    const searchBtn = document.querySelector('.search-btn');
    const searchOverlay = document.querySelector('.search-overlay');
    const searchClose = document.querySelector('.search-close');
    const searchBox = document.querySelector('.search-box');
    const searchInput = document.querySelector('.search-input');

    if (!searchBtn || !searchOverlay) return;

    function openSearch() {
      searchOverlay.classList.add('active');
      document.body.classList.add('nav-open');
      if (searchInput) {
        setTimeout(function () {
          searchInput.focus();
        }, 100);
      }
    }

    function closeSearch() {
      searchOverlay.classList.remove('active');
      document.body.classList.remove('nav-open');
    }

    searchBtn.addEventListener('click', openSearch);

    if (searchClose) {
      searchClose.addEventListener('click', closeSearch);
    }

    // Fechar ao clicar fora da caixa de busca
    searchOverlay.addEventListener('click', function (e) {
      if (e.target === searchOverlay) {
        closeSearch();
      }
    });

    // Fechar com tecla Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
        closeSearch();
      }
    });
  }

  // =====================================================
  // BOTÃO VOLTAR AO TOPO
  // =====================================================
  function initBackToTop() {
    const backToTopBtn = document.querySelector('.back-to-top');
    if (!backToTopBtn) return;

    function toggleBackToTop() {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }

    window.addEventListener('scroll', toggleBackToTop, { passive: true });
    toggleBackToTop();

    backToTopBtn.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    });
  }

  // =====================================================
  // LINK DE NAVEGAÇÃO ATIVO
  // =====================================================
  function initActiveNav() {
    const navLinks = document.querySelectorAll('.main-nav a, .mobile-nav a');
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';

    navLinks.forEach(function (link) {
      const href = link.getAttribute('href');
      if (!href) return;

      const linkPath = href.split('/').pop();
      if (linkPath === currentPath) {
        link.classList.add('active');
      }
    });
  }

  // =====================================================
  // BARRA DE PROGRESSO DE LEITURA
  // =====================================================
  function initReadingProgress() {
    const progressBar = document.querySelector('.reading-progress');
    const article = document.querySelector('.article-content');

    if (!progressBar || !article) return;

    function updateProgress() {
      const articleTop = article.offsetTop;
      const articleHeight = article.offsetHeight;
      const windowHeight = window.innerHeight;
      const scrollY = window.scrollY;

      const start = articleTop;
      const end = articleTop + articleHeight - windowHeight;
      const progress = Math.min(Math.max((scrollY - start) / (end - start), 0), 1);

      progressBar.style.width = (progress * 100) + '%';
      progressBar.setAttribute('aria-valuenow', Math.round(progress * 100));
    }

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  // =====================================================
  // SCROLL SUAVE PARA ÂNCORAS
  // =====================================================
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#' || targetId === '#0') return;

        const target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();

        const headerHeight = document.querySelector('.site-header')
          ? document.querySelector('.site-header').offsetHeight
          : 0;

        const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });

        // Atualizar URL sem causar scroll
        history.pushState(null, null, targetId);
      });
    });
  }

  // =====================================================
  // LAZY LOADING DE IMAGENS
  // =====================================================
  function initLazyLoading() {
    // Usar native lazy loading se disponível
    if ('loading' in HTMLImageElement.prototype) {
      document.querySelectorAll('img[data-src]').forEach(function (img) {
        img.src = img.dataset.src;
        if (img.dataset.srcset) {
          img.srcset = img.dataset.srcset;
        }
        img.removeAttribute('data-src');
        img.removeAttribute('data-srcset');
        img.classList.add('loaded');
      });
      return;
    }

    // Fallback com IntersectionObserver
    if (!('IntersectionObserver' in window)) {
      // Carregar todas as imagens se não suportar IntersectionObserver
      document.querySelectorAll('img[data-src]').forEach(function (img) {
        img.src = img.dataset.src;
        img.classList.add('loaded');
      });
      return;
    }

    const imageObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          if (img.dataset.srcset) {
            img.srcset = img.dataset.srcset;
          }
          img.removeAttribute('data-src');
          img.removeAttribute('data-srcset');
          img.classList.add('loaded');
          imageObserver.unobserve(img);
        }
      });
    }, {
      rootMargin: '200px 0px',
    });

    document.querySelectorAll('img[data-src]').forEach(function (img) {
      imageObserver.observe(img);
    });
  }

  // =====================================================
  // LINKS EXTERNOS EM NOVA ABA
  // =====================================================
  function initExternalLinks() {
    const currentHost = window.location.hostname;

    document.querySelectorAll('a[href]').forEach(function (link) {
      const href = link.getAttribute('href');

      // Ignorar links internos, âncoras e mailto/tel
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;

      try {
        const url = new URL(href, window.location.origin);
        if (url.hostname !== currentHost) {
          link.setAttribute('target', '_blank');
          link.setAttribute('rel', 'noopener noreferrer');
        }
      } catch (e) {
        // URL inválida, ignorar
      }
    });
  }

  // =====================================================
  // TABELA DE CONTEÚDO - SCROLL SUAVE
  // =====================================================
  function initTableOfContents() {
    const tocLinks = document.querySelectorAll('.table-of-contents a[href^="#"]');

    tocLinks.forEach(function (link) {
      link.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);

        if (!target) return;

        e.preventDefault();

        const headerHeight = document.querySelector('.site-header')
          ? document.querySelector('.site-header').offsetHeight
          : 0;

        const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });

        history.pushState(null, null, targetId);
      });
    });

    // Destacar seção atual no TOC durante scroll
    if (tocLinks.length > 0) {
      const headings = [];
      tocLinks.forEach(function (link) {
        const target = document.querySelector(link.getAttribute('href'));
        if (target) headings.push({ el: target, link: link });
      });

      function highlightTocItem() {
        const scrollPos = window.scrollY + 100;
        let current = headings[0];

        for (let i = 0; i < headings.length; i++) {
          if (headings[i].el.offsetTop <= scrollPos) {
            current = headings[i];
          }
        }

        tocLinks.forEach(function (link) {
          link.classList.remove('active');
        });
        if (current) {
          current.link.classList.add('active');
        }
      }

      window.addEventListener('scroll', highlightTocItem, { passive: true });
      highlightTocItem();
    }
  }

  // =====================================================
  // ACCORDION FAQ
  // =====================================================
  function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(function (item) {
      const question = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');

      if (!question || !answer) return;

      question.addEventListener('click', function () {
        const isOpen = item.classList.contains('active');

        // Fechar todos os outros itens
        faqItems.forEach(function (otherItem) {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            const otherAnswer = otherItem.querySelector('.faq-answer');
            if (otherAnswer) {
              otherAnswer.style.maxHeight = null;
              otherAnswer.setAttribute('aria-hidden', 'true');
            }
            const otherQuestion = otherItem.querySelector('.faq-question');
            if (otherQuestion) {
              otherQuestion.setAttribute('aria-expanded', 'false');
            }
          }
        });

        // Toggle item atual
        item.classList.toggle('active');
        question.setAttribute('aria-expanded', !isOpen);

        if (!isOpen) {
          answer.style.maxHeight = answer.scrollHeight + 'px';
          answer.setAttribute('aria-hidden', 'false');
        } else {
          answer.style.maxHeight = null;
          answer.setAttribute('aria-hidden', 'true');
        }
      });

      // Acessibilidade - teclado
      question.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          question.click();
        }
      });
    });
  }

  // =====================================================
  // INICIALIZAR TUDO
  // =====================================================
  function init() {
    initMobileMenu();
    initSearchOverlay();
    initBackToTop();
    initActiveNav();
    initReadingProgress();
    initSmoothScroll();
    initLazyLoading();
    initExternalLinks();
    initTableOfContents();
    initFaqAccordion();
  }

  // Aguardar DOM carregar
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
