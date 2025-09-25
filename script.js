document.addEventListener("DOMContentLoaded", () => {
  // --- CONFIGURAÇÃO DE SEGREDOS E CONSTANTES ---
  const AIRTABLE_TOKEN = "patoWt1Ghg0KNsoHa.0326957161e00f3a0b7e65188f43d77a2d580ca935774b279c74eb192b6405cf"; 
  const AIRTABLE_BASE_ID = "appFKKkbMWXMFHjvD";
  const AIRTABLE_TABLE_NAME = "Usuarios";

  const airtableUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`;
  let isLoginMode = false;

  // --- ELEMENTOS DO DOM ---
  const preloader = document.getElementById("preloader");
  const menuBtn = document.getElementById("menuBtn");
  const menu = document.getElementById("menu");
  const modal = document.getElementById("modal");
  const openModalBtns = document.querySelectorAll("#openModalBtnHero, #openModalBtnCta");
  const closeModalBtn = document.getElementById("closeModalBtn");
  const accordionItems = document.querySelectorAll(".accordion-item");
  const fadeInElements = document.querySelectorAll(".fade-in");
  const authForm = document.getElementById('auth-form');
  const modalTitle = document.getElementById('modal-title');
  const modalDescription = document.getElementById('modal-description');
  const nameFieldContainer = document.getElementById('name-field-container');
  const nameInput = document.getElementById('nome');
  const authFormBtn = document.getElementById('auth-form-btn');
  const formNote = document.getElementById('form-note');
  const toggleFormText = document.getElementById('toggle-form-text');
  const toggleFormLink = document.getElementById('toggle-form-link');

  // --- FUNÇÕES ---

  const handlePreloader = () => {
    preloader.classList.add("hidden");
    document.body.classList.add("loaded");
  };

  const toggleAuthMode = (e) => {
    if (e) e.preventDefault();
    isLoginMode = !isLoginMode;
    formNote.innerText = "Ao se cadastrar, você concorda com nossos Termos de Uso.";
    formNote.style.color = "";
    authForm.reset();

    if (isLoginMode) {
      modalTitle.innerText = 'Faça seu login';
      modalDescription.innerText = 'Que bom te ver de volta!';
      nameFieldContainer.style.display = 'none';
      nameInput.required = false;
      authFormBtn.innerText = 'Entrar';
      formNote.style.display = 'none';
      toggleFormText.innerText = 'Não tem uma conta?';
      toggleFormLink.innerText = 'Cadastre-se';
    } else {
      modalTitle.innerText = 'Crie sua conta gratuita';
      modalDescription.innerText = 'Comece a sua jornada de aprendizado hoje mesmo.';
      nameFieldContainer.style.display = 'block';
      nameInput.required = true;
      authFormBtn.innerText = 'Criar conta';
      formNote.style.display = 'block';
      toggleFormText.innerText = 'Já tem uma conta?';
      toggleFormLink.innerText = 'Faça login';
    }
  };
  
  const loginSuccess = (userData) => {
    localStorage.setItem('educonnect_username', userData.Nome);
    localStorage.setItem('educonnect_useremail', userData.Email);
    window.location.href = 'dashboard.html';
  };

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const originalBtnText = authFormBtn.innerText;
    authFormBtn.disabled = true;
    authFormBtn.innerText = "Verificando...";
    formNote.innerText = "";
    
    if (isLoginMode) {
      const filterUrl = `${airtableUrl}?filterByFormula=({Email} = '${email}')`;
      fetch(filterUrl, { headers: { 'Authorization': `Bearer ${AIRTABLE_TOKEN}` } })
      .then(response => response.json())
      .then(data => {
        if (data.records && data.records.length > 0) {
          const user = data.records[0].fields;
          if (user.Senha === senha) {
            formNote.innerText = "Login efetuado! Redirecionando...";
            formNote.style.color = "green";
            setTimeout(() => loginSuccess(user), 1000);
          } else {
            throw new Error("Senha incorreta.");
          }
        } else {
          throw new Error("Usuário não encontrado.");
        }
      })
      .catch(error => {
        formNote.innerText = error.message;
        formNote.style.color = "red";
        authFormBtn.disabled = false;
        authFormBtn.innerText = originalBtnText;
      });
    } else {
      const nome = document.getElementById('nome').value;
      const data = { records: [{ fields: { "Nome": nome, "Email": email, "Senha": senha } }] };
      fetch(airtableUrl, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${AIRTABLE_TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      .then(response => {
        if (!response.ok) { return response.json().then(err => { throw err; }); }
        return response.json();
      })
      .then(data => {
        formNote.innerText = "Cadastro realizado! Redirecionando...";
        formNote.style.color = "green";
        const newUser = data.records[0].fields;
        setTimeout(() => loginSuccess(newUser), 1000);
      })
      .catch(error => {
        formNote.innerText = "Ocorreu um erro. O e-mail já pode estar em uso.";
        formNote.style.color = "red";
        authFormBtn.disabled = false;
        authFormBtn.innerText = originalBtnText;
      });
    }
  };
  
  // --- INICIALIZAÇÃO E EVENT LISTENERS ---
  window.addEventListener("load", handlePreloader);

  menuBtn?.addEventListener("click", () => {
    menu.classList.toggle("open");
    menuBtn.classList.toggle("open");
  });

  menu?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      menuBtn.classList.remove('open');
    });
  });

  const openModal = () => modal.classList.add("visible");
  const closeModal = () => modal.classList.remove("visible");
  openModalBtns.forEach(btn => btn.addEventListener("click", openModal));
  closeModalBtn?.addEventListener("click", closeModal);
  modal?.addEventListener("click", (e) => e.target === modal && closeModal());
  document.addEventListener('keydown', (e) => e.key === "Escape" && modal.classList.contains('visible') && closeModal());

  // LÓGICA DO ACORDEÃO (FAQ) CORRIGIDA
  accordionItems.forEach(item => {
    const header = item.querySelector(".accordion-header");
    header.addEventListener("click", () => {
        const content = item.querySelector(".accordion-content");
        item.classList.toggle('active');
        if (item.classList.contains('active')) {
            // Define a altura máxima para a altura real do conteúdo
            content.style.maxHeight = content.scrollHeight + "px";
        } else {
            // Recolhe o item
            content.style.maxHeight = "0";
        }
    });
  });
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  fadeInElements.forEach((el) => observer.observe(el));

  toggleFormLink.addEventListener('click', toggleAuthMode);
  authForm.addEventListener('submit', handleAuthSubmit);
});
