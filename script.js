(function () {
  'use strict';
  var NUM = '22898547904';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  // Année du pied de page
  $('#an').textContent = new Date().getFullYear();

  // Menu mobile
  var burger = $('#burger'), nav = $('#menu-nav');
  function closeMenu() { nav.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); }
  burger.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    burger.setAttribute('aria-expanded', String(open));
  });
  $$('a', nav).forEach(function (a) { a.addEventListener('click', closeMenu); });

  // Ombre de l'en-tête au défilement
  var header = $('.site-header');
  window.addEventListener('scroll', function () {
    header.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });

  // Apparition progressive + lien actif
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: .12 });
    $$('.reveal').forEach(function (el) { io.observe(el); });

    var links = $$('.menu-nav a');
    var so = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) {
          links.forEach(function (l) { l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id); });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('main section[id]').forEach(function (s) { so.observe(s); });
  } else {
    $$('.reveal').forEach(function (el) { el.classList.add('in'); });
  }

  // Boutons « Commander » du menu
  $$('.dish button').forEach(function (b) {
    b.addEventListener('click', function () {
      $('#plat').value = b.getAttribute('data-plat');
      $('#commande').scrollIntoView({ behavior: 'smooth' });
      setTimeout(function () { $('#nom').focus({ preventScroll: true }); }, 600);
    });
  });

  // Formulaire → WhatsApp
  $('#form').addEventListener('submit', function (e) {
    e.preventDefault();
    var nom = $('#nom').value.trim(), qte = Math.max(1, parseInt($('#qte').value, 10) || 1);
    var err = $('#e-nom');
    if (nom.length < 2) { err.textContent = 'Veuillez saisir votre nom.'; $('#nom').focus(); return; }
    err.textContent = '';
    var msg = 'Bonjour Debby, je souhaite commander :\n' +
      '• ' + qte + ' × ' + $('#plat').value + '\n' +
      '• Nom : ' + nom +
      ($('#note').value.trim() ? '\n• Précisions : ' + $('#note').value.trim() : '') +
      '\n(Commande via le site Délices Maison)';
    window.open('https://wa.me/' + NUM + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
  });
})();
