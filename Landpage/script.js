/* =========================================================
  script.js — MKMine Pro 75 RGB / TechKeys
  Organizado em funções separadas por responsabilidade:
  - Menu mobile
  - Rolagem suave / navegação
  - Botão voltar ao topo
  - Animação de seções ao rolar a página (scroll reveal)
  - Contadores animados
  - Validação completa do formulário de contato
========================================================= */

document.addEventListener('DOMContentLoaded', function () {
  initMobileMenu();
  initSmoothScroll();
  initBackToTop();
  initScrollReveal();
  initCounters();
  initContactForm();
});

/* =========================================================
  MENU MOBILE (abrir/fechar)
========================================================= */
function initMobileMenu() {
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');

  if (!navToggle || !mainNav) return;

  navToggle.addEventListener('click', function () {
    const isOpen = mainNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  // Fecha o menu automaticamente ao clicar em um link (útil no mobile)
  mainNav.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      mainNav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* =========================================================
  ROLAGEM SUAVE PARA ÂNCORAS INTERNAS
  (o CSS já define scroll-behavior: smooth, esta função
  garante compatibilidade e controle programático)
========================================================= */
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach(function (link) {
    link.addEventListener('click', function (event) {
      const targetId = link.getAttribute('href');
      const targetEl = document.querySelector(targetId);

      if (targetEl) {
        event.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* =========================================================
  BOTÃO "VOLTAR AO TOPO"
  Aparece após o usuário rolar a página além de um limite
========================================================= */
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTop');
  if (!backToTopBtn) return;

  const SCROLL_THRESHOLD = 400;

  window.addEventListener('scroll', function () {
    if (window.scrollY > SCROLL_THRESHOLD) {
      backToTopBtn.classList.add('is-visible');
    } else {
      backToTopBtn.classList.remove('is-visible');
    }
  });

  backToTopBtn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* =========================================================
  ANIMAÇÃO DE SEÇÕES AO APARECER NO SCROLL
  Utiliza IntersectionObserver para adicionar a classe
  'is-visible' quando a seção entra na viewport
========================================================= */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');
  if (!revealElements.length) return;

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealElements.forEach(function (el) {
    observer.observe(el);
  });
}

/* =========================================================
  CONTADORES ANIMADOS (clientes, teclados vendidos, satisfação)
========================================================= */
function initCounters() {
  const counters = document.querySelectorAll('.counter-number');
  if (!counters.length) return;

  const DURATION = 1600; // duração da animação em ms

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'), 10) || 0;
    const startTime = performance.now();

    function step(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / DURATION, 1);
      const currentValue = Math.floor(progress * target);
      el.textContent = currentValue.toLocaleString('pt-BR');

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target.toLocaleString('pt-BR');
      }
    }

    requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(function (counter) {
    observer.observe(counter);
  });
}

/* =========================================================
  VALIDAÇÃO COMPLETA DO FORMULÁRIO DE CONTATO
========================================================= */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const successMessage = document.getElementById('formSuccess');

  form.addEventListener('submit', function (event) {
    event.preventDefault(); // impede o recarregamento da página

    const isValid = validateForm();

    if (isValid) {
      successMessage.textContent = 'Solicitação enviada com sucesso!';
      form.reset();
      clearAllFieldMessages();

      // Limpa a mensagem de sucesso após alguns segundos
      setTimeout(function () {
        successMessage.textContent = '';
      }, 5000);
    } else {
      successMessage.textContent = '';
    }
  });
}

/* Executa todas as validações e retorna true somente se tudo estiver correto */
function validateForm() {
  const nomeValido = validarNome();
  const emailValido = validarEmail();
  const telefoneValido = validarTelefone();
  const quantidadeValida = validarQuantidade();
  const mensagemValida = validarMensagem();
  const termosValidos = validarTermos();

  return (
    nomeValido &&
    emailValido &&
    telefoneValido &&
    quantidadeValida &&
    mensagemValida &&
    termosValidos
  );
}

/* ---------- Validação: Nome Completo ---------- */
function validarNome() {
  const campo = document.getElementById('nome');
  const valor = campo.value.trim();

  if (valor.length === 0) {
    exibirMensagem('nomeMsg', 'O nome é obrigatório.', 'error');
    return false;
  }

  if (valor.length < 3) {
    exibirMensagem('nomeMsg', 'O nome deve ter no mínimo 3 caracteres.', 'error');
    return false;
  }

  exibirMensagem('nomeMsg', 'Nome válido.', 'success');
  return true;
}

/* ---------- Validação: E-mail ---------- */
function validarEmail() {
  const campo = document.getElementById('email');
  const valor = campo.value.trim();
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (valor.length === 0) {
    exibirMensagem('emailMsg', 'O e-mail é obrigatório.', 'error');
    return false;
  }

  if (!regexEmail.test(valor)) {
    exibirMensagem('emailMsg', 'Digite um e-mail válido.', 'error');
    return false;
  }

  exibirMensagem('emailMsg', 'E-mail válido.', 'success');
  return true;
}

/* ---------- Validação: Telefone ---------- */
function validarTelefone() {
  const campo = document.getElementById('telefone');
  const valor = campo.value.trim();
  const apenasNumeros = /^[0-9]+$/;

  if (valor.length === 0) {
    exibirMensagem('telefoneMsg', 'O telefone é obrigatório.', 'error');
    return false;
  }

  if (!apenasNumeros.test(valor)) {
    exibirMensagem('telefoneMsg', 'Use apenas números, sem espaços ou símbolos.', 'error');
    return false;
  }

  if (valor.length < 10 || valor.length > 11) {
    exibirMensagem('telefoneMsg', 'Informe um telefone com DDD (10 ou 11 dígitos).', 'error');
    return false;
  }

  exibirMensagem('telefoneMsg', 'Telefone válido.', 'success');
  return true;
}

/* ---------- Validação: Quantidade ---------- */
function validarQuantidade() {
  const campo = document.getElementById('quantidade');
  const valor = campo.value.trim();
  const numero = Number(valor);

  if (valor.length === 0) {
    exibirMensagem('quantidadeMsg', 'Informe a quantidade desejada.', 'error');
    return false;
  }

  if (!Number.isInteger(numero) || numero <= 0) {
    exibirMensagem('quantidadeMsg', 'A quantidade deve ser um número positivo.', 'error');
    return false;
  }

  exibirMensagem('quantidadeMsg', 'Quantidade válida.', 'success');
  return true;
}

/* ---------- Validação: Mensagem ---------- */
function validarMensagem() {
  const campo = document.getElementById('mensagem');
  const valor = campo.value.trim();

  if (valor.length === 0) {
    exibirMensagem('mensagemMsg', 'A mensagem é obrigatória.', 'error');
    return false;
  }

  if (valor.length < 10) {
    exibirMensagem('mensagemMsg', 'A mensagem deve ter no mínimo 10 caracteres.', 'error');
    return false;
  }

  exibirMensagem('mensagemMsg', 'Mensagem válida.', 'success');
  return true;
}

/* ---------- Validação: Checkbox de Termos ---------- */
function validarTermos() {
  const campo = document.getElementById('termos');

  if (!campo.checked) {
    exibirMensagem('termosMsg', 'Você precisa concordar com os termos para continuar.', 'error');
    return false;
  }

  exibirMensagem('termosMsg', '', 'success');
  return true;
}

/* =========================================================
  FUNÇÕES AUXILIARES DE MENSAGEM
========================================================= */

/* Exibe uma mensagem de erro (vermelho) ou sucesso (verde) abaixo do campo */
function exibirMensagem(elementoId, texto, tipo) {
  const elemento = document.getElementById(elementoId);
  if (!elemento) return;

  elemento.textContent = texto;
  elemento.classList.remove('error', 'success');
  elemento.classList.add(tipo);
}

/* Limpa todas as mensagens de validação (usado após envio bem-sucedido) */
function clearAllFieldMessages() {
  document.querySelectorAll('.field-message').forEach(function (el) {
    el.textContent = '';
    el.classList.remove('error', 'success');
  });
}
