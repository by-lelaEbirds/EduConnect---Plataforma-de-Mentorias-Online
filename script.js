document.addEventListener("DOMContentLoaded", () => {
  // --- CONFIGURAÇÃO DE SEGREDOS E CONSTANTES ---
  const AIRTABLE_TOKEN = "patoWt1Ghg0KNsoHa.0326957161e00f3a0b7e65188f43d77a2d580ca935774b279c74eb192b6405cf"; 
  const AIRTABLE_BASE_ID = "appFKKkbMWXMFHjvD";
  const AIRTABLE_TABLE_NAME = "Usuarios";

  const airtableUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`;
  let isLoginMode = false;

  // --- ELEMENTOS DO DOM ---
  const preloader = document.getElementById("preloader");
  const authForm = document.getElementById('auth-form');
  const modal = document.getElementById("modal");
  // ... (outros elementos que você já tem)

  // --- FUNÇÕES ---

  // Lógica para alternar o modal entre os modos de Login e Cadastro
  const toggleAuthMode = (e) => {
    // ... (função toggleAuthMode que você já tem, sem alterações)
  };
  
  // Função para redirecionar o usuário e salvar seus dados
  const loginSuccess = (userData) => {
    // Salva os dados do usuário no localStorage para usar na outra página
    localStorage.setItem('educonnect_username', userData.Nome);
    localStorage.setItem('educonnect_useremail', userData.Email);

    // Redireciona o usuário para o dashboard
    window.location.href = 'dashboard.html';
  };


  // Lida com o envio do formulário de autenticação (Cadastro E Login)
  const handleAuthSubmit = (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const authFormBtn = document.getElementById('auth-form-btn');
    const formNote = document.getElementById('form-note');
    const originalBtnText = authFormBtn.innerText;
    authFormBtn.disabled = true;
    authFormBtn.innerText = "Verificando...";
    formNote.innerText = "";
    
    if (isLoginMode) {
      // --- LÓGICA DE LOGIN ---
      const filterUrl = `${airtableUrl}?filterByFormula=({Email} = '${email}')`;

      fetch(filterUrl, {
        headers: { 'Authorization': `Bearer ${AIRTABLE_TOKEN}` }
      })
      .then(response => response.json())
      .then(data => {
        if (data.records && data.records.length > 0) {
          const user = data.records[0].fields;
          if (user.Senha === senha) {
            // Senha correta! Login bem-sucedido.
            formNote.innerText = "Login efetuado com sucesso! Redirecionando...";
            formNote.style.color = "green";
            setTimeout(() => loginSuccess(user), 1000);
          } else {
            // Senha incorreta
            throw new Error("Senha incorreta.");
          }
        } else {
          // Usuário não encontrado
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
      // --- LÓGICA DE CADASTRO (AIRTABLE) ---
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
  // (Cole aqui toda a parte de inicialização e event listeners do seu script.js anterior)
  // Exemplo:
  // window.addEventListener("load", handlePreloader);
  // menuBtn?.addEventListener("click", ...);
  // toggleFormLink.addEventListener('click', toggleAuthMode);
  // authForm.addEventListener('submit', handleAuthSubmit);
  // etc.

  // Para garantir, aqui está a seção de inicialização completa novamente:
  const menuBtn = document.getElementById("menuBtn");
  const menu = document.getElementById("menu");
  const toggleFormLink = document.getElementById('toggle-form-link');

  window.addEventListener("load", () => preloader.classList.add("hidden"));

  menuBtn?.addEventListener("click", () => menu.classList.toggle("open"));
  menu?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => menu.classList.remove('open'));
  });

  const openModalBtns = document.querySelectorAll("#openModalBtnHero, #openModalBtnCta");
  const closeModalBtn = document.getElementById("closeModalBtn");
  const openModal = () => modal.classList.add("visible");
  const closeModal = () => modal.classList.remove("visible");
  openModalBtns.forEach(btn => btn.addEventListener("click", openModal));
  closeModalBtn?.addEventListener("click", closeModal);
  modal?.addEventListener("click", (e) => e.target === modal && closeModal());
  document.addEventListener('keydown', (e) => e.key === "Escape" && modal.classList.contains('visible') && closeModal());

  const accordionItems = document.querySelectorAll(".accordion-item");
  accordionItems.forEach(item => {
    item.querySelector(".accordion-header").addEventListener("click", () => {
        item.classList.toggle('active');
    });
  });
  
  const fadeInElements = document.querySelectorAll(".fade-in");
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
