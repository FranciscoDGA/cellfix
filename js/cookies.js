/**
 * CellFix Brasil - Gerenciamento de Consentimento de Cookies
 * Banner de cookies com opções de aceitar, rejeitar e personalizar
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'cellfix_cookie_consent';
  const SCRIPTS_KEY = 'cellfix_loaded_scripts';

  // =====================================================
  // PREFERÊNCIAS PADRÃO
  // =====================================================
  const defaultPreferences = {
    analytics: false,
    ads: false,
    timestamp: null,
  };

  // =====================================================
  // OBTER PREFERÊNCIAS SALVAS
  // =====================================================
  function getSavedPreferences() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('CellFix Brasil - Erro ao ler preferências de cookies:', e);
    }
    return null;
  }

  // =====================================================
  // SALVAR PREFERÊNCIAS
  // =====================================================
  function savePreferences(preferences) {
    try {
      preferences.timestamp = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    } catch (e) {
      console.error('CellFix Brasil - Erro ao salvar preferências de cookies:', e);
    }
  }

  // =====================================================
  // CRIAR BANNER DE COOKIES
  // =====================================================
  function createCookieBanner() {
    // Verificar se já existe
    if (document.querySelector('.cookie-banner')) return;

    const banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Consentimento de cookies');
    banner.innerHTML =
      '<div class="cookie-banner-content">' +
      '<div class="cookie-banner-text">' +
      '<h3>Privacidade e Cookies</h3>' +
      '<p>' +
      'Utilizamos cookies para melhorar sua experiência, analisar o tráfego do site e ' +
      'exibir conteúdo personalizado. Você pode escolher quais categorias de cookies ' +
      'deseja permitir. Saiba mais em nossa ' +
      '<a href="/politica-privacidade" target="_blank" rel="noopener noreferrer">' +
      'Política de Privacidade</a>.' +
      '</p>' +
      '</div>' +
      '<div class="cookie-banner-actions">' +
      '<button class="cookie-btn cookie-btn-settings" data-action="settings">' +
      'Personalizar' +
      '</button>' +
      '<button class="cookie-btn cookie-btn-reject" data-action="reject">' +
      'Rejeitar' +
      '</button>' +
      '<button class="cookie-btn cookie-btn-accept" data-action="accept">' +
      'Aceitar Todos' +
      '</button>' +
      '</div>' +
      '</div>' +
      '<div class="cookie-settings-panel" aria-hidden="true">' +
      '<h4>Configurações de Cookies</h4>' +
      '<div class="cookie-option">' +
      '<label class="cookie-option-label">' +
      '<input type="checkbox" name="analytics" class="cookie-checkbox" />' +
      '<span class="cookie-option-text">' +
      '<strong>Analytics</strong>' +
      '<span>Cookies para entender como os visitantes interagem com o site.</span>' +
      '</span>' +
      '</label>' +
      '</div>' +
      '<div class="cookie-option">' +
      '<label class="cookie-option-label">' +
      '<input type="checkbox" name="ads" class="cookie-checkbox" />' +
      '<span class="cookie-option-text">' +
      '<strong>Publicidade</strong>' +
      '<span>Cookies para exibir anúncios relevantes e medir campanhas.</span>' +
      '</span>' +
      '</label>' +
      '</div>' +
      '<button class="cookie-btn cookie-btn-save-settings" data-action="save-settings">' +
      'Salvar Preferências' +
      '</button>' +
      '</div>';

    document.body.appendChild(banner);
    return banner;
  }

  // =====================================================
  // CRIAR BANNER MÍNIMO (Fallback para erro de criação)
  // =====================================================
  function ensureBannerExists() {
    let banner = document.querySelector('.cookie-banner');
    if (!banner) {
      banner = createCookieBanner();
    }
    return banner;
  }

  // =====================================================
  // FECHAR BANNER
  // =====================================================
  function hideBanner() {
    const banner = document.querySelector('.cookie-banner');
    if (banner) {
      banner.classList.add('hidden');
      // Remover do DOM após animação
      setTimeout(function () {
        if (banner.parentNode) {
          banner.parentNode.removeChild(banner);
        }
      }, 500);
    }
  }

  // =====================================================
  // CARREGAR SCRIPTS NÃO ESSENCIAIS
  // =====================================================
  function loadNonEssentialScripts(preferences) {
    if (!preferences) return;

    // Verificar se já foram carregados
    try {
      const loaded = JSON.parse(localStorage.getItem(SCRIPTS_KEY) || '{}');
      if (loaded.analytics && loaded.ads) return;
    } catch (e) {
      // Ignorar erro
    }

    // Google Analytics
    if (preferences.analytics) {
      loadAnalytics();
    }

    // Google AdSense
    if (preferences.ads) {
      loadAdSense();
    }

    // Marcar como carregados
    try {
      localStorage.setItem(
        SCRIPTS_KEY,
        JSON.stringify({
          analytics: preferences.analytics || false,
          ads: preferences.ads || false,
        })
      );
    } catch (e) {
      // Ignorar erro
    }
  }

  // =====================================================
  // CARREGAR GOOGLE ANALYTICS
  // =====================================================
  function loadAnalytics() {
    // Evitar carregar duas vezes
    if (document.querySelector('script[data-cellfix-analytics]')) return;

    // Substitua GA_MEASUREMENT_ID pelo seu ID do Google Analytics
    const GA_ID = 'G-XXXXXXXXXX';

    // gtag.js
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    script.setAttribute('data-cellfix-analytics', 'true');
    document.head.appendChild(script);

    const inlineScript = document.createElement('script');
    inlineScript.setAttribute('data-cellfix-analytics', 'true');
    inlineScript.textContent =
      "window.dataLayer = window.dataLayer || [];\n" +
      "function gtag(){dataLayer.push(arguments);}\n" +
      "gtag('js', new Date());\n" +
      "gtag('config', '" + GA_ID + "');";
    document.head.appendChild(inlineScript);

    console.log('CellFix Brasil - Google Analytics carregado');
  }

  // =====================================================
  // CARREGAR GOOGLE ADSENSE
  // =====================================================
  function loadAdSense() {
    // Evitar carregar duas vezes
    if (document.querySelector('script[data-cellfix-adsense]')) return;

    // Substitua ca-pub-XXXX pelo seu ID de publisher do AdSense
    const ADSENSE_ID = 'ca-pub-XXXXXXXXXXXXXXXX';

    const script = document.createElement('script');
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + ADSENSE_ID;
    script.setAttribute('data-cellfix-adsense', 'true');
    document.head.appendChild(script);

    console.log('CellFix Brasil - Google AdSense carregado');
  }

  // =====================================================
  // AÇÃO: ACEITAR TODOS
  // =====================================================
  function handleAcceptAll() {
    const preferences = {
      analytics: true,
      ads: true,
    };
    savePreferences(preferences);
    hideBanner();
    loadNonEssentialScripts(preferences);
  }

  // =====================================================
  // AÇÃO: REJEITAR TODOS
  // =====================================================
  function handleRejectAll() {
    const preferences = {
      analytics: false,
      ads: false,
    };
    savePreferences(preferences);
    hideBanner();
  }

  // =====================================================
  // AÇÃO: SALVAR PERSONALIZADO
  // =====================================================
  function handleSaveSettings() {
    const checkboxes = document.querySelectorAll('.cookie-checkbox');
    const preferences = {
      analytics: false,
      ads: false,
    };

    checkboxes.forEach(function (checkbox) {
      if (checkbox.checked) {
        preferences[checkbox.name] = true;
      }
    });

    savePreferences(preferences);
    hideBanner();
    loadNonEssentialScripts(preferences);
  }

  // =====================================================
  // AÇÃO: ABRIR PAINEL DE CONFIGURAÇÕES
  // =====================================================
  function handleToggleSettings() {
    const panel = document.querySelector('.cookie-settings-panel');
    const banner = document.querySelector('.cookie-banner');

    if (!panel || !banner) return;

    const isHidden = panel.getAttribute('aria-hidden') === 'true';

    panel.setAttribute('aria-hidden', !isHidden);
    panel.classList.toggle('active');
    banner.classList.toggle('expanded');
  }

  // =====================================================
  // REABRIR BANNER (via link "Gerenciar cookies" no footer)
  // =====================================================
  function reopenBanner() {
    const preferences = getSavedPreferences();

    // Criar banner novamente
    const banner = ensureBannerExists();
    if (!banner) return;

    // Preencher checkboxes com preferências salvas
    if (preferences) {
      const analyticsCheckbox = banner.querySelector('input[name="analytics"]');
      const adsCheckbox = banner.querySelector('input[name="ads"]');

      if (analyticsCheckbox) analyticsCheckbox.checked = preferences.analytics || false;
      if (adsCheckbox) adsCheckbox.checked = preferences.ads || false;
    }

    // Mostrar banner
    banner.classList.remove('hidden');
  }

  // =====================================================
  // VINCULAR EVENTOS
  // =====================================================
  function bindEvents() {
    const banner = document.querySelector('.cookie-banner');
    if (!banner) return;

    // Event delegation para botões
    banner.addEventListener('click', function (e) {
      const btn = e.target.closest('[data-action]');
      if (!btn) return;

      const action = btn.getAttribute('data-action');

      switch (action) {
        case 'accept':
          handleAcceptAll();
          break;
        case 'reject':
          handleRejectAll();
          break;
        case 'settings':
          handleToggleSettings();
          break;
        case 'save-settings':
          handleSaveSettings();
          break;
      }
    });

    // Link "Gerenciar cookies" no footer
    const manageCookiesLink = document.querySelector('.manage-cookies');
    if (manageCookiesLink) {
      manageCookiesLink.addEventListener('click', function (e) {
        e.preventDefault();
        reopenBanner();
      });
    }
  }

  // =====================================================
  // INICIALIZAR
  // =====================================================
  function init() {
    const preferences = getSavedPreferences();

    // Se já fez uma escolha anteriormente
    if (preferences && preferences.timestamp) {
      // Carregar scripts baseado nas preferências salvas
      loadNonEssentialScripts(preferences);

      // Vincular evento do link "Gerenciar cookies"即使 o banner não está visível
      const manageCookiesLink = document.querySelector('.manage-cookies');
      if (manageCookiesLink) {
        manageCookiesLink.addEventListener('click', function (e) {
          e.preventDefault();
          reopenBanner();
        });
      }
      return;
    }

    // Primeira visita: criar e mostrar banner
    createCookieBanner();
    bindEvents();
  }

  // =====================================================
  // AGUARDAR DOM
  // =====================================================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
