document.addEventListener("DOMContentLoaded", () => {
  // --- PRELOADER ---
  const preloader = document.getElementById("preloader");
  window.addEventListener("load", () => {
    preloader.classList.add("hidden");
    document.body.classList.add("loaded");
  });

  // --- EFEITO PARALLAX (se houver um hero com imagem de fundo) ---
  const hero = document.querySelector('.hero');
  if (hero) {
    window.addEventListener('scroll', () => {
        const scrollPosition = window.pageYOffset;
        hero.style.backgroundPositionY = scrollPosition * 0.5 + 'px';
    });
  }

  // --- MENU MOBILE ---
  const menuBtn = document.getElementById("menuBtn");
  const menu = document.getElementById("menu");
  menuBtn?.addEventListener("click", () => {
    menu.classList.toggle("open");
    menuBtn.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", menu.classList.contains("open"));
  });
  menu?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (menu.classList.contains('open')) {
        menu.classList.remove('open');
        menuBtn.classList.remove('open');
        menuBtn.setAttribute("aria-expanded", false);
      }
    });
  });

  // --- MODAL ---
  const modal = document.getElementById("modal");
  const openModalBtns = document.querySelectorAll("#openModalBtnHero, #openModalBtnCta");
  const closeModalBtn = document.getElementById("closeModalBtn");
  const openModal = () => modal.classList.add("visible");
  const closeModal = () => modal.classList.remove("visible");
  openModalBtns.forEach(btn => btn.addEventListener("click", openModal));
  closeModalBtn?.addEventListener("click", closeModal);
  modal?.addEventListener("click", (e) => e.target === modal && closeModal());
  document.addEventListener('keydown', (e) => e.key === "Escape" && modal.classList.contains('visible') && closeModal());

  // --- FORMULÁRIOS E CTAs (SIMULAÇÃO) ---
  const handleFormSubmit = (e, successMessage) => {
    e.preventDefault();
    const form = e.target, note = form.nextElementSibling, originalNoteText = note ? note.textContent : "";
    const btn = form.querySelector('button[type="submit"]'), originalBtnText = btn.textContent;
    btn.disabled = true; btn.textContent = "Enviando...";
    setTimeout(() => {
      form.reset(); btn.disabled = false; btn.textContent = originalBtnText;
      if (note) { note.textContent = successMessage; note.style.color = "var(--accent)"; }
      if (form.id === 'form-lead') setTimeout(closeModal, 2000);
      setTimeout(() => { if (note) { note.textContent = originalNoteText; note.style.color = ""; } }, 5000);
    }, 1500);
  };
  // ATENÇÃO: Esta função será substituída pela lógica de conexão com o Airtable.
  document.getElementById("form-lead")?.addEventListener("submit", (e) => handleFormSubmit(e, "Cadastro realizado! Bem-vindo(a)."));

  // --- ACCORDION ---
  const accordionItems = document.querySelectorAll(".accordion-item");
  accordionItems.forEach(item => {
    const header = item.querySelector(".accordion-header");
    header.addEventListener("click", () => {
        const content = item.querySelector(".accordion-content");
        item.classList.toggle('active');
        if (item.classList.contains('active')) {
            content.style.maxHeight = content.scrollHeight + "px";
            content.style.padding = "0 24px 18px";
        } else {
            content.style.maxHeight = "0";
            content.style.padding = "0 24px";
        }
    });
  });
  
  // --- ANIMAÇÕES DE SCROLL (IntersectionObserver) ---
  const fadeInElements = document.querySelectorAll(".fade-in");
  const statsSection = document.getElementById("stats");
  let statsAnimated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Animação fade-in
        entry.target.classList.add("visible");

        // Animação dos contadores
        if (entry.target.id === 'stats' && !statsAnimated) {
            const counters = document.querySelectorAll(".stat-number");
            counters.forEach(counter => {
                const target = +counter.getAttribute('data-target');
                const duration = 1500; // Duração da animação em ms
                let start = 0;
                const step = timestamp => {
                    if (!start) start = timestamp;
                    const progress = timestamp - start;
                    const increment = Math.min(progress / duration, 1);
                    counter.innerText = Math.floor(increment * target);
                    if (increment < 1) {
                        requestAnimationFrame(step);
                    }
                };
                requestAnimationFrame(step);
            });
            statsAnimated = true;
        }
        
        if(entry.target.classList.contains('fade-in')) {
            observer.unobserve(entry.target);
        }
      }
    });
  }, { threshold: 0.1 });
  
  fadeInElements.forEach((el) => observer.observe(el));
  if (statsSection) observer.observe(statsSection);
});
