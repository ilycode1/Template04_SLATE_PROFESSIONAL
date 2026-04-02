 /* ----------------------------------------------------------
       1. NAVBAR: Scroll + Scroll Spy + Hamburger
    ---------------------------------------------------------- */
    (function initNavbar() {
      var navbar    = document.getElementById('navbar');
      var navMenu   = document.getElementById('navMenu');
      var navToggle = document.getElementById('navToggle');
      var navLinks  = navMenu.querySelectorAll('a');

      window.addEventListener('scroll', function () {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
        updateScrollSpy();
      }, { passive: true });

      function updateScrollSpy() {
        var sections = document.querySelectorAll('main section[id]');
        var current  = '';
        sections.forEach(function (sec) {
          if (sec.offsetTop - 90 <= window.scrollY) {
            current = sec.getAttribute('id');
          }
        });
        navLinks.forEach(function (link) {
          link.classList.toggle('active', link.getAttribute('href') === '#' + current);
        });
      }

      navToggle.addEventListener('click', function () {
        navToggle.classList.toggle('open');
        navMenu.classList.toggle('open');
      });

      navLinks.forEach(function (link) {
        link.addEventListener('click', function () {
          navToggle.classList.remove('open');
          navMenu.classList.remove('open');
        });
      });
    })();

    /* ----------------------------------------------------------
       2. HERO SLIDER
    ---------------------------------------------------------- */
    (function initHeroSlider() {
      var slides  = document.querySelectorAll('.hero-slide');
      var dots    = document.querySelectorAll('.dot');
      var prevBtn = document.querySelector('.hero-prev');
      var nextBtn = document.querySelector('.hero-next');
      var total   = slides.length;
      var current = 0;
      var timer;

      function updateSlider() {
        slides.forEach(function (s, i) { s.classList.toggle('active', i === current); });
        dots.forEach(function (d, i)   { d.classList.toggle('active', i === current); });
      }

      function goTo(index) {
        current = (index + total) % total;
        updateSlider();
      }

      function startTimer() {
        timer = setInterval(function () { goTo(current + 1); }, 4000);
      }

      function resetTimer() {
        clearInterval(timer);
        startTimer();
      }

      prevBtn.addEventListener('click', function () { goTo(current - 1); resetTimer(); });
      nextBtn.addEventListener('click', function () { goTo(current + 1); resetTimer(); });

      dots.forEach(function (dot, i) {
        dot.addEventListener('click', function () { goTo(i); resetTimer(); });
      });

      startTimer();
    })();

    /* ----------------------------------------------------------
       3. HERO PARALLAX (mousemove)
    ---------------------------------------------------------- */
    (function initParallax() {
      var hero   = document.getElementById('hero');
      var layers = hero.querySelectorAll('.hero-parallax-layer[data-speed]');
      var rafId;

      hero.addEventListener('mousemove', function (e) {
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(function () {
          var dx = e.clientX - window.innerWidth  / 2;
          var dy = e.clientY - window.innerHeight / 2;
          layers.forEach(function (layer) {
            var speed = parseFloat(layer.dataset.speed);
            var x = Math.max(-30, Math.min(30, dx * speed * 0.01));
            var y = Math.max(-30, Math.min(30, dy * speed * 0.01));
            layer.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
          });
        });
      }, { passive: true });
    })();

    /* ----------------------------------------------------------
       8. LIGHTBOX (Galeri)
    ---------------------------------------------------------- */
    (function initLightbox() {
      var lb      = document.getElementById('lightbox');
      var lbImg   = document.getElementById('lbImg');
      var lbCap   = document.getElementById('lbCaption');
      var lbClose = document.getElementById('lbClose');
      var lbPrev  = document.getElementById('lbPrev');
      var lbNext  = document.getElementById('lbNext');
      var items   = document.querySelectorAll('.galeri-item');
      var current = 0;

      function open(index) {
        current = index;
        var img = items[current].querySelector('img');
        lbImg.src = img.src;
        lbImg.alt = img.alt;
        lbCap.textContent = img.alt + ' (' + (current + 1) + ' / ' + items.length + ')';
        lb.classList.add('open');
        document.body.style.overflow = 'hidden';
      }

      function close() {
        lb.classList.remove('open');
        document.body.style.overflow = '';
      }

      items.forEach(function (item, i) {
        item.addEventListener('click', function () { open(i); });
      });

      lbClose.addEventListener('click', close);
      lb.addEventListener('click', function (e) { if (e.target === lb) close(); });

      lbNext.addEventListener('click', function () { open((current + 1) % items.length); });
      lbPrev.addEventListener('click', function () { open((current - 1 + items.length) % items.length); });

      document.addEventListener('keydown', function (e) {
        if (!lb.classList.contains('open')) return;
        if (e.key === 'ArrowRight') lbNext.click();
        if (e.key === 'ArrowLeft')  lbPrev.click();
        if (e.key === 'Escape')     close();
      });
    })();

    /* ----------------------------------------------------------
       9. TESTIMONI CAROUSEL
    ---------------------------------------------------------- */
    (function initTestimoni() {
      var track  = document.getElementById('testimoniTrack');
      var dots   = document.querySelectorAll('.t-dot');
      var prev   = document.getElementById('tPrev');
      var next   = document.getElementById('tNext');
      var total  = dots.length;
      var current = 0;
      var timer;

      function goTo(index) {
        current = (index + total) % total;
        track.style.transform = 'translateX(-' + (current * 100) + '%)';
        dots.forEach(function (d, i) { d.classList.toggle('active', i === current); });
      }

      function startTimer() {
        timer = setInterval(function () { goTo(current + 1); }, 5000);
      }
      function resetTimer() { clearInterval(timer); startTimer(); }

      prev.addEventListener('click', function () { goTo(current - 1); resetTimer(); });
      next.addEventListener('click', function () { goTo(current + 1); resetTimer(); });
      dots.forEach(function (d, i) {
        d.addEventListener('click', function () { goTo(i); resetTimer(); });
      });

      /* Pause on hover */
      track.parentElement.addEventListener('mouseenter', function () { clearInterval(timer); });
      track.parentElement.addEventListener('mouseleave', startTimer);

      startTimer();
    })();

    /* ----------------------------------------------------------
       7. TAB FILTER (Kesiswaan)
    ---------------------------------------------------------- */
    (function initTabs() {
      var tabBtns   = document.querySelectorAll('.tab-btn');
      var tabPanels = document.querySelectorAll('.tab-panel');

      tabBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
          var target = btn.dataset.tab;
          var active = document.querySelector('.tab-panel.active');

          // Switch button state
          tabBtns.forEach(function (b) { b.classList.remove('active'); });
          btn.classList.add('active');

          if (active && active.dataset.panel !== target) {
            // Fade out current panel
            active.style.opacity   = '0';
            active.style.transform = 'scale(0.97)';
            active.style.transition = 'opacity 0.25s ease, transform 0.25s ease';

            setTimeout(function () {
              active.classList.remove('active');
              active.style.cssText = '';

              var next = document.querySelector('.tab-panel[data-panel="' + target + '"]');
              if (next) { next.classList.add('active'); }
            }, 250);
          }
        });
      });
    })();

    /* ----------------------------------------------------------
       5. 3D CARD TILT
    ---------------------------------------------------------- */
    (function init3DTilt() {
      document.querySelectorAll('.card-3d').forEach(function (el) {
        el.addEventListener('mousemove', function (e) {
          var rect   = el.getBoundingClientRect();
          var xRot   = ((e.clientY - rect.top)  / rect.height - 0.5) * -16;
          var yRot   = ((e.clientX - rect.left) / rect.width  - 0.5) *  16;
          el.style.transform = 'perspective(1000px) rotateX(' + xRot + 'deg) rotateY(' + yRot + 'deg) translateY(-4px)';
        });
        el.addEventListener('mouseleave', function () {
          el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
        });
      });
    })();

    /* ----------------------------------------------------------
       5. SCROLL ANIMATIONS — Intersection Observer
    ---------------------------------------------------------- */
    (function initScrollAnimations() {
      var elements = document.querySelectorAll('.animate, .animate-left, .animate-right');

      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });

      elements.forEach(function (el) {
        observer.observe(el);
      });
    })();

    /* ----------------------------------------------------------
       6. COUNTER ANIMATION
    ---------------------------------------------------------- */
    (function initCounters() {
      var counters = document.querySelectorAll('.counter');

      function easeOut(t) {
        return 1 - Math.pow(1 - t, 3);
      }

      function animateCounter(el, target, duration) {
        var start = null;
        function step(timestamp) {
          if (!start) start = timestamp;
          var elapsed = timestamp - start;
          var t = Math.min(elapsed / duration, 1);
          el.textContent = Math.round(easeOut(t) * target);
          if (t < 1) requestAnimationFrame(step);
          else el.textContent = target;
        }
        requestAnimationFrame(step);
      }

      var counterObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var el = entry.target;
            var target = parseInt(el.dataset.target, 10);
            animateCounter(el, target, 2000);
            counterObserver.unobserve(el);
          }
        });
      }, { threshold: 0.15 });

      counters.forEach(function (counter) {
        counterObserver.observe(counter);
      });
    })();

    /* ----------------------------------------------------------
       10. BACK TO TOP
    ---------------------------------------------------------- */
    (function initBackToTop() {
      var btn = document.getElementById('backToTop');
      window.addEventListener('scroll', function () {
        btn.classList.toggle('visible', window.scrollY > 400);
      }, { passive: true });
      btn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    })();

    /* ----------------------------------------------------------
       11. CONTACT FORM (simple feedback)
    ---------------------------------------------------------- */
    (function initContactForm() {
      var form = document.getElementById('contactForm');
      if (!form) return;
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var btn = form.querySelector('.form-submit');
        var orig = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-check"></i>&nbsp; Pesan Terkirim!';
        btn.style.background = '#38a169';
        btn.disabled = true;
        setTimeout(function () {
          form.reset();
          btn.innerHTML = orig;
          btn.style.background = '';
          btn.disabled = false;
        }, 3000);
      });
    })();

    /* ----------------------------------------------------------
       4. SMOOTH SCROLL (backup)
    ---------------------------------------------------------- */
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var target = document.querySelector(this.getAttribute('href'));
        if (target) {
          e.preventDefault();
          window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
        }
      });
    });
