document.addEventListener("DOMContentLoaded", () => {
  // --- CONFIGURAÇÃO DE SEGREDOS E CONSTANTES ---
  // PREENCHA AS 3 CONSTANTES ABAIXO COM OS SEUS DADOS DO AIRTABLE
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

  // --- ELEMENTOS DO FORMULÁRIO DE AUTENTICAÇÃO ---
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

  // Controla a exibição do Preloader
  const handlePreloader = () => {
    preloader.classList.add("hidden");
    document.body.classList.add("loaded");
  };

  // Lógica para alternar o modal entre os modos de Login e Cadastro
  const toggleAuthMode = (e) => {
    if (e) e.preventDefault();
    isLoginMode = !isLoginMode;
    formNote.innerText = ""; // Limpa mensagens de erro/sucesso ao alternar

    if (isLoginMode) {
      // Mudar para o modo LOGIN
      modalTitle.innerText = 'Faça seu login';
      modalDescription.innerText = 'Que bom te ver de volta!';
      nameFieldContainer.style.display = 'none';
      nameInput.required = false;
      authFormBtn.innerText = 'Entrar';
      formNote.style.display = 'none';
      toggleFormText.innerText = 'Não tem uma conta?';
      toggleFormLink.innerText = 'Cadastre-se';
    } else {
      // Mudar para o modo CADASTRO
      modalTitle.innerText = 'Crie sua conta gratuita';
      modalDescription.innerText = 'Comece a sua jornada de aprendizado hoje mesmo.';
      nameFieldContainer.style.display = 'block';
      nameInput.required = true;
      authFormBtn.innerText = 'Criar conta';
      formNote.style.display = 'block';
      formNote.innerText = "Ao se cadastrar, você concorda com nossos Termos de Uso.";
      toggleFormText.innerText = 'Já tem uma conta?';
      toggleFormLink.innerText = 'Faça login';
    }
  };

  // Lida com o envio do formulário de autenticação
  const handleAuthSubmit = (e) => {
    e.preventDefault();
    if (isLoginMode) {
      // --- LÓGICA DE LOGIN (A SER IMPLEMENTADA) ---
      alert('Funcionalidade de login ainda não implementada.');
    } else {
      // --- LÓGICA DE CADASTRO (AIRTABLE) ---
      const nome = document.getElementById('nome').value;
      const email = document.getElementById('email').value;
      const senha = document.getElementById('senha').value;
      
      const originalBtnText = authFormBtn.innerText;
      authFormBtn.disabled = true;
      authFormBtn.innerText = "Enviando...";
      formNote.innerText = "";

      const data = {
        records: [
          {
            fields: {
              "Nome": nome,
              "Email": email,
              "Senha": senha
            }
          }
        ]
      };

      fetch(airtableUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${AIRTABLE_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then(response => {
        if (!response.ok) {
          // Tenta ler o erro vindo da API do Airtable
          return response.json().then(err => { throw err; });
        }
        return response.json();
      })
      .then(data => {
        console.log('Usuário cadastrado com sucesso:', data);
        formNote.style.display = 'block';
        formNote.innerText = "Cadastro realizado com sucesso!";
        formNote.style.color = "green";
        authForm.reset();
        setTimeout(() => {
          closeModal();
          // Resetar o formulário para o modo de cadastro após fechar
          if(isLoginMode) toggleAuthMode(); 
          formNote.innerText = "Ao se cadastrar, você concorda com nossos Termos de Uso.";
          formNote.style.color = "";
        }, 2000);
      })
      .catch(error => {
        console.error('Erro:', error);
        formNote.style.display = 'block';
        formNote.innerText = "Ocorreu um erro. Verifique os dados e tente novamente.";
        // Exibe um erro mais detalhado no console para depuração
        if(error.error) console.error("Detalhe do Airtable:", error.error.message);
        formNote.style.color = "red";
      })
      .finally(() => {
        authFormBtn.disabled = false;
        authFormBtn.innerText = originalBtnText;
      });
    }
  };
  
  // --- INICIALIZAÇÃO E EVENT LISTENERS ---

  window.addEventListener("load", handlePreloader);

  menuBtn?.addEventListener("click", () => menu.classList.toggle("open"));
  menu?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => menu.classList.remove('open'));
  });

  const openModal = () => modal.classList.add("visible");
  const closeModal = () => modal.classList.remove("visible");
  openModalBtns.forEach(btn => btn.addEventListener("click", openModal));
  closeModalBtn?.addEventListener("click", closeModal);
  modal?.addEventListener("click", (e) => e.target === modal && closeModal());
  document.addEventListener('keydown', (e) => e.key === "Escape" && modal.classList.contains('visible') && closeModal());

  accordionItems.forEach(item => {
    const header = item.querySelector(".accordion-header");
    header.addEventListener("click", () => {
        item.classList.toggle('active');
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
