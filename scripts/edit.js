document.addEventListener("DOMContentLoaded", function() {
  console.log("Iniciando carregamento da página de edição");
  
  /* ====================
     Página de Edição (edit.html)
     ==================== */
  
  // Obtém o índice do personagem da URL usando a função do common.js
  const characterIndex = parseInt(getQueryParam("index"));
  console.log("Índice do personagem:", characterIndex);
  
  // Recupera a lista de personagens do localStorage
  const characters = JSON.parse(localStorage.getItem("characters") || "[]");
  console.log("Número de personagens encontrados:", characters.length);
  
  // Verifica se o índice é válido
  if (isNaN(characterIndex) || characterIndex < 0 || characterIndex >= characters.length) {
    console.error("Índice inválido:", characterIndex);
    alert("Personagem não encontrado!");
    window.location.href = "../index.html";
    return;
  }
  
  // Obtém o personagem específico
  const character = characters[characterIndex];
  console.log("Personagem encontrado:", character.nome);
  
  // Atualiza o título da página com o nome do personagem
  document.title = `${character.nome} - Editar Personagem`;
  
  // Preenche o formulário com os dados do personagem
  function populateForm() {
    console.log("Iniciando preenchimento do formulário");
    
    try {
      // Dados básicos
      const nomeInput = document.getElementById("nome");
      const imagemInput = document.getElementById("imagem");
      
      if (!nomeInput || !imagemInput) {
        throw new Error("Elementos básicos não encontrados");
      }
      
      nomeInput.value = character.nome;
      imagemInput.value = character.imagem;
      console.log("Dados básicos preenchidos");
      
      // Estilos
      const estilos = ["poderoso", "ligeiro", "preciso", "capcioso"];
      estilos.forEach(estilo => {
        const input = document.getElementById(estilo);
        if (!input) {
          throw new Error(`Input do estilo ${estilo} não encontrado`);
        }
        input.value = character.estilos[estilo];
      });
      console.log("Estilos preenchidos");
      
      // Habilidades
      const habilidades = [
        "agarrao", "armazenamento", "assegurar", "busca", "chamado",
        "cura", "exibicao", "golpe", "manufatura", "estudo", "tiro", "travessia"
      ];
      habilidades.forEach(habilidade => {
        const input = document.getElementById(habilidade);
        if (!input) {
          throw new Error(`Input da habilidade ${habilidade} não encontrado`);
        }
        input.value = character.habilidades[habilidade];
      });
      console.log("Habilidades preenchidas");
      
      // Traços
      const tracosList = document.getElementById("tracos-list");
      if (!tracosList) {
        throw new Error("Lista de traços não encontrada");
      }
      tracosList.innerHTML = "";
      
      character.tracos.forEach(traco => {
        const tracoItem = document.createElement("div");
        tracoItem.className = "traco-item";
        if (traco.personalizado) {
          tracoItem.dataset.personalizado = "true";
          tracoItem.classList.add("personalizado");
        }
        
        const nomeInput = document.createElement("input");
        nomeInput.type = "text";
        nomeInput.className = "traco-nome";
        nomeInput.value = traco.nome;
        
        const descricaoInput = document.createElement("textarea");
        descricaoInput.className = "traco-descricao";
        descricaoInput.value = traco.descricao;
        
        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.className = "btn btn-sm btn-danger";
        removeButton.textContent = "Remover";
        removeButton.addEventListener("click", function() {
          tracosList.removeChild(tracoItem);
        });
        
        tracoItem.appendChild(nomeInput);
        tracoItem.appendChild(descricaoInput);
        tracoItem.appendChild(removeButton);
        
        tracosList.appendChild(tracoItem);
      });
      console.log("Traços preenchidos");
      
      // Utensílio
      const nomeUtensilioInput = document.getElementById("nomeUtensilio");
      const resistenciaInput = document.getElementById("resistencia");
      const utensilioNomeDisplay = document.getElementById("utensilio-nome-display");
      const utensilioDetails = document.getElementById("utensilio-details");
      
      if (!nomeUtensilioInput || !resistenciaInput || !utensilioNomeDisplay || !utensilioDetails) {
        throw new Error("Elementos do utensílio não encontrados");
      }
      
      nomeUtensilioInput.value = character.utensilio.nome;
      resistenciaInput.value = character.utensilio.resistencia;
      utensilioNomeDisplay.textContent = character.utensilio.nome;
      
      if (character.utensilio.personalizado) {
        utensilioNomeDisplay.classList.add("personalizado");
        nomeUtensilioInput.dataset.personalizado = "true";
      }
      
      utensilioDetails.style.display = "block";
      console.log("Utensílio preenchido");
      
      // Técnicas
      const tecnicasList = document.getElementById("tecnicas-list");
      if (!tecnicasList) {
        throw new Error("Lista de técnicas não encontrada");
      }
      tecnicasList.innerHTML = "";
      
      character.utensilio.tecnicas.forEach(tecnica => {
        const tecnicaItem = document.createElement("div");
        tecnicaItem.className = "tecnica-item";
        if (tecnica.personalizada) {
          tecnicaItem.dataset.personalizada = "true";
          tecnicaItem.classList.add("personalizada");
        }
        
        const nomeInput = document.createElement("input");
        nomeInput.type = "text";
        nomeInput.className = "tecnica-nome";
        nomeInput.value = tecnica.nome;
        
        const categoriaInput = document.createElement("input");
        categoriaInput.type = "hidden";
        categoriaInput.className = "tecnica-categoria";
        categoriaInput.value = tecnica.categoria;
        
        const detalhesInput = document.createElement("input");
        detalhesInput.type = "text";
        detalhesInput.className = "tecnica-detalhes";
        detalhesInput.value = tecnica.detalhes;
        
        const descricaoInput = document.createElement("textarea");
        descricaoInput.className = "tecnica-descricao";
        descricaoInput.value = tecnica.descricao;
        
        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.className = "btn btn-sm btn-danger";
        removeButton.textContent = "Remover";
        removeButton.addEventListener("click", function() {
          tecnicasList.removeChild(tecnicaItem);
        });
        
        tecnicaItem.appendChild(nomeInput);
        tecnicaItem.appendChild(categoriaInput);
        tecnicaItem.appendChild(detalhesInput);
        tecnicaItem.appendChild(descricaoInput);
        tecnicaItem.appendChild(removeButton);
        
        tecnicasList.appendChild(tecnicaItem);
      });
      console.log("Técnicas preenchidas");
      
      // Inventário
      const inventarioList = document.getElementById("inventario-list");
      if (!inventarioList) {
        throw new Error("Lista de inventário não encontrada");
      }
      inventarioList.innerHTML = "";
      
      if (character.inventario && character.inventario.length > 0) {
        character.inventario.forEach(item => {
          addItemToInventory(item);
        });
      }
      console.log("Inventário preenchido");
      
    } catch (error) {
      console.error("Erro ao preencher formulário:", error);
      alert("Erro ao carregar os dados do personagem. Por favor, tente novamente.");
    }
  }
  
  // Função para converter arquivo de imagem para Base64
  function convertImageToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  // Adiciona o evento para o input de arquivo de imagem
  const imageInput = document.getElementById("image-file");
  const imageUrlInput = document.getElementById("imagem");

  if (imageInput && imageUrlInput) {
    imageInput.addEventListener("change", async function(e) {
      const file = e.target.files[0];
      if (file) {
        try {
          const base64Image = await convertImageToBase64(file);
          imageUrlInput.value = base64Image;
        } catch (error) {
          console.error("Erro ao converter imagem:", error);
          alert("Erro ao processar a imagem. Por favor, tente novamente.");
        }
      }
    });
  }
  
  // Função para carregar e exibir o modal de traços
  function showTracosModal() {
    const modal = document.getElementById("tracos-modal");
    const tracosLista = document.getElementById("tracos-lista");
    
    // Limpa a lista
    tracosLista.innerHTML = "";
    
    // Carrega a lista de traços do JSON
    fetch('../data/traits.json')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(tracos => {
        tracosLista.innerHTML = '<div class="tracos-grid"></div>';
        const tracosGrid = tracosLista.querySelector('.tracos-grid');
        
        tracos.forEach(traco => {
          const tracoCard = document.createElement("div");
          tracoCard.className = "traco-card";
          
          const tracoHeader = document.createElement("div");
          tracoHeader.className = "traco-card-header";
          
          const tracoNome = document.createElement("h4");
          tracoNome.className = "traco-card-title";
          tracoNome.textContent = traco.nome;
          tracoHeader.appendChild(tracoNome);
          
          const tracoDescricao = document.createElement("p");
          tracoDescricao.className = "traco-card-desc";
          tracoDescricao.textContent = traco.descricao;
          
          const addButton = document.createElement("button");
          addButton.textContent = "Adicionar";
          addButton.className = "btn btn-sm btn-success";
          addButton.addEventListener("click", function() {
            addTracoToCharacter(traco);
            closeModal();
          });
          
          tracoCard.appendChild(tracoHeader);
          tracoCard.appendChild(tracoDescricao);
          tracoCard.appendChild(addButton);
          
          tracosGrid.appendChild(tracoCard);
        });

        // Adiciona um campo de pesquisa
        const searchBox = document.createElement("input");
        searchBox.type = "text";
        searchBox.placeholder = "Filtrar traços...";
        searchBox.className = "search-tracos";
        searchBox.addEventListener("input", function() {
          const term = this.value.toLowerCase();
          const cards = tracosGrid.querySelectorAll('.traco-card');
          
          cards.forEach(card => {
            const nome = card.querySelector('.traco-card-title').textContent.toLowerCase();
            const desc = card.querySelector('.traco-card-desc').textContent.toLowerCase();
            
            if (nome.includes(term) || desc.includes(term)) {
              card.style.display = '';
            } else {
              card.style.display = 'none';
            }
          });
        });
        
        tracosLista.insertBefore(searchBox, tracosGrid);

        // Adiciona botão para criar traço personalizado
        const createCustomTracoBtn = document.createElement("button");
        createCustomTracoBtn.textContent = "Criar Traço Personalizado";
        createCustomTracoBtn.className = "btn btn-primary create-custom-btn";
        createCustomTracoBtn.addEventListener("click", function() {
          showCustomTracoForm();
        });
        
        tracosLista.insertBefore(createCustomTracoBtn, searchBox);
      })
      .catch(error => {
        console.error("Erro ao carregar traços:", error);
        tracosLista.innerHTML = "<p>Erro ao carregar traços.</p>";
      });
    
    // Exibe o modal
    modal.style.display = "block";
  }

  // Função para mostrar formulário de criação de traço personalizado
  function showCustomTracoForm() {
    const modal = document.getElementById("tracos-modal");
    const tracosLista = document.getElementById("tracos-lista");
    
    // Salva o conteúdo atual para poder voltar
    const originalContent = tracosLista.innerHTML;
    
    // Limpa a lista e cria o formulário
    tracosLista.innerHTML = "";
    
    const formContainer = document.createElement("div");
    formContainer.className = "custom-traco-form";
    
    const title = document.createElement("h3");
    title.textContent = "Criar Traço Personalizado";
    
    const nameLabel = document.createElement("label");
    nameLabel.textContent = "Nome do Traço:";
    nameLabel.htmlFor = "custom-traco-nome";
    
    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.id = "custom-traco-nome";
    nameInput.className = "form-control";
    nameInput.required = true;
    
    const descLabel = document.createElement("label");
    descLabel.textContent = "Descrição:";
    descLabel.htmlFor = "custom-traco-desc";
    
    const descInput = document.createElement("textarea");
    descInput.id = "custom-traco-desc";
    descInput.className = "form-control";
    descInput.rows = 4;
    descInput.required = true;
    
    const buttonContainer = document.createElement("div");
    buttonContainer.className = "button-container";
    
    const saveButton = document.createElement("button");
    saveButton.textContent = "Salvar";
    saveButton.className = "btn btn-success";
    saveButton.addEventListener("click", function() {
      const nome = nameInput.value.trim();
      const descricao = descInput.value.trim();
      
      if (nome && descricao) {
        const customTraco = {
          nome: nome,
          descricao: descricao,
          personalizado: true
        };
        
        addTracoToCharacter(customTraco);
        closeModal();
      } else {
        alert("Por favor, preencha todos os campos.");
      }
    });
    
    const cancelButton = document.createElement("button");
    cancelButton.textContent = "Cancelar";
    cancelButton.className = "btn btn-secondary";
    cancelButton.addEventListener("click", function() {
      tracosLista.innerHTML = originalContent;
    });
    
    buttonContainer.appendChild(saveButton);
    buttonContainer.appendChild(cancelButton);
    
    formContainer.appendChild(title);
    formContainer.appendChild(nameLabel);
    formContainer.appendChild(nameInput);
    formContainer.appendChild(descLabel);
    formContainer.appendChild(descInput);
    formContainer.appendChild(buttonContainer);
    
    tracosLista.appendChild(formContainer);
  }

  // Função para adicionar o traço selecionado ao personagem
  function addTracoToCharacter(traco) {
    const tracosList = document.getElementById("tracos-list");
    
    // Cria o elemento para o traço
    const tracoItem = document.createElement("div");
    tracoItem.className = "traco-item";
    if (traco.personalizado) {
      tracoItem.dataset.personalizado = "true";
      tracoItem.classList.add("personalizado");
    }
    
    // Cria os inputs para o nome e descrição
    const nomeInput = document.createElement("input");
    nomeInput.type = "text";
    nomeInput.className = "traco-nome";
    nomeInput.value = traco.nome;
    
    const descricaoInput = document.createElement("textarea");
    descricaoInput.className = "traco-descricao";
    descricaoInput.value = traco.descricao;
    
    // Cria o botão para remover o traço
    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "btn btn-sm btn-danger";
    removeButton.textContent = "Remover";
    removeButton.addEventListener("click", function() {
      tracosList.removeChild(tracoItem);
    });
    
    // Adiciona tudo ao item do traço
    tracoItem.appendChild(nomeInput);
    tracoItem.appendChild(descricaoInput);
    tracoItem.appendChild(removeButton);
    
    // Adiciona o item à lista
    tracosList.appendChild(tracoItem);
  }

  // Função para exibir o modal de utensílios
  function showUtensiliosModal() {
    const modal = document.getElementById("utensilios-modal");
    const utensiliosLista = document.getElementById("utensilios-lista");
    
    utensiliosLista.innerHTML = "";
    
    fetch('../data/utensil.json')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        const utensiliosGrid = document.createElement('div');
        utensiliosGrid.className = 'grid-container';

        data.utensilios.forEach(utensilio => {
          const utensilioCard = document.createElement('div');
          utensilioCard.className = 'utensilio-card';

          const utensilioHeader = document.createElement('div');
          utensilioHeader.className = 'utensilio-card-header';

          const utensilioNome = document.createElement('h3');
          utensilioNome.className = 'utensilio-card-title';
          utensilioNome.textContent = utensilio.nome;

          const addButton = document.createElement('button');
          addButton.className = 'btn btn-success btn-sm';
          addButton.textContent = 'Selecionar';
          addButton.addEventListener('click', function() {
            selectUtensilio(utensilio);
            modal.style.display = "none";
          });

          utensilioHeader.appendChild(utensilioNome);
          utensilioCard.appendChild(utensilioHeader);
          utensilioCard.appendChild(addButton);
          utensiliosGrid.appendChild(utensilioCard);
        });

        // Adiciona botão para criar utensílio personalizado
        const createCustomUtensilioBtn = document.createElement("button");
        createCustomUtensilioBtn.textContent = "Criar Utensílio Personalizado";
        createCustomUtensilioBtn.className = "btn btn-primary create-custom-btn";
        createCustomUtensilioBtn.addEventListener("click", function() {
          showCustomUtensilioForm();
        });
        
        utensiliosLista.appendChild(createCustomUtensilioBtn);
        utensiliosLista.appendChild(utensiliosGrid);
        modal.style.display = "block";
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Erro ao carregar utensílios: ' + error.message);
      });
  }

  // Função para mostrar formulário de criação de utensílio personalizado
  function showCustomUtensilioForm() {
    const modal = document.getElementById("utensilios-modal");
    const utensiliosLista = document.getElementById("utensilios-lista");
    
    // Salva o conteúdo atual para poder voltar
    const originalContent = utensiliosLista.innerHTML;
    
    // Limpa a lista e cria o formulário
    utensiliosLista.innerHTML = "";
    
    const formContainer = document.createElement("div");
    formContainer.className = "custom-utensilio-form";
    
    const title = document.createElement("h3");
    title.textContent = "Criar Utensílio Personalizado";
    
    const nameLabel = document.createElement("label");
    nameLabel.textContent = "Nome do Utensílio:";
    nameLabel.htmlFor = "custom-utensilio-nome";
    
    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.id = "custom-utensilio-nome";
    nameInput.className = "form-control";
    nameInput.required = true;
    
    const buttonContainer = document.createElement("div");
    buttonContainer.className = "button-container";
    
    const saveButton = document.createElement("button");
    saveButton.textContent = "Salvar";
    saveButton.className = "btn btn-success";
    saveButton.addEventListener("click", function() {
      const nome = nameInput.value.trim();
      
      if (nome) {
        const customUtensilio = {
          nome: nome,
          personalizado: true
        };
        
        selectUtensilio(customUtensilio);
        modal.style.display = "none";
      } else {
        alert("Por favor, preencha o nome do utensílio.");
      }
    });
    
    const cancelButton = document.createElement("button");
    cancelButton.textContent = "Cancelar";
    cancelButton.className = "btn btn-secondary";
    cancelButton.addEventListener("click", function() {
      utensiliosLista.innerHTML = originalContent;
    });
    
    buttonContainer.appendChild(saveButton);
    buttonContainer.appendChild(cancelButton);
    
    formContainer.appendChild(title);
    formContainer.appendChild(nameLabel);
    formContainer.appendChild(nameInput);
    formContainer.appendChild(buttonContainer);
    
    utensiliosLista.appendChild(formContainer);
  }
  
  // Adiciona evento para o botão de selecionar utensílio
  document.getElementById("select-utensilio")?.addEventListener("click", showUtensiliosModal);

  // Função para selecionar o utensílio
  function selectUtensilio(utensilio) {
    // Remove as técnicas existentes
    const tecnicasList = document.getElementById("tecnicas-list");
    if (tecnicasList) {
      tecnicasList.innerHTML = '';
    }

    // Atualiza o nome do utensílio
    const utensilioNomeDisplay = document.getElementById("utensilio-nome-display");
    if (utensilioNomeDisplay) {
      utensilioNomeDisplay.textContent = utensilio.nome;
      if (utensilio.personalizado) {
        utensilioNomeDisplay.classList.add("personalizado");
      } else {
        utensilioNomeDisplay.classList.remove("personalizado");
      }
    }
    
    // Atualiza o valor oculto para submissão do formulário
    const nomeUtensilioInput = document.getElementById("nomeUtensilio");
    if (nomeUtensilioInput) {
      nomeUtensilioInput.value = utensilio.nome;
      if (utensilio.personalizado) {
        nomeUtensilioInput.dataset.personalizado = "true";
      } else {
        delete nomeUtensilioInput.dataset.personalizado;
      }
    }

    // Mostra os detalhes do utensílio
    const utensilioDetails = document.getElementById("utensilio-details");
    if (utensilioDetails) {
      utensilioDetails.style.display = "block";
    }
    
    // Mostra o container de técnicas
    const tecnicasContainer = document.getElementById("tecnicas-container");
    if (tecnicasContainer) {
      tecnicasContainer.style.display = "block";
    }

    // Habilita o botão de adicionar técnica
    const addTecnicaBtn = document.getElementById("add-tecnica");
    if (addTecnicaBtn) {
      addTecnicaBtn.disabled = false;
    }
  }

  // Função para exibir o modal de técnicas
  function showTecnicasModal() {
    const selectedUtensilio = document.getElementById("utensilio-nome-display")?.textContent;
    if (!selectedUtensilio) {
      alert("Por favor, selecione um utensílio primeiro.");
      return;
    }

    const modal = document.getElementById("tecnicas-modal");
    const tecnicasLista = document.getElementById("tecnicas-lista");
    
    if (!tecnicasLista) {
      console.error("Elemento tecnicas-lista não encontrado!");
      return;
    }
    
    tecnicasLista.innerHTML = "";
    
    // Verifica se o utensílio é personalizado
    const nomeUtensilioInput = document.getElementById("nomeUtensilio");
    const isPersonalizado = nomeUtensilioInput && nomeUtensilioInput.dataset.personalizado === "true";
    
    if (isPersonalizado) {
      // Para utensílios personalizados, mostra apenas o formulário de criação de técnica
      showCustomTecnicaForm();
    } else {
      // Para utensílios padrão, carrega as técnicas do JSON
      fetch('../data/utensil.json')
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          console.log("Dados carregados do utensil.json:", data);
          const utensilio = data.utensilios.find(u => u.nome === selectedUtensilio);
          
          if (!utensilio) {
            throw new Error('Utensílio não encontrado');
          }
          
          console.log("Utensílio encontrado:", utensilio);
          
          const tecnicasGrid = document.createElement('div');
          tecnicasGrid.className = 'grid-container';
          
          // Verifica se existem categorias e processa cada uma
          if (utensilio.categorias) {
            Object.entries(utensilio.categorias).forEach(([categoria, tecnicas]) => {
              processTecnicas(categoria, tecnicas, tecnicasGrid);
            });
          }
          
          // Também verifica as técnicas ligeiras e sagazes diretamente
          if (utensilio.tecnicas_ligeiras) {
            processTecnicas('tecnicas_ligeiras', utensilio.tecnicas_ligeiras, tecnicasGrid);
          }
          
          if (utensilio.tecnicas_sagazes) {
            processTecnicas('tecnicas_sagazes', utensilio.tecnicas_sagazes, tecnicasGrid);
          }
          
          if (tecnicasGrid.children.length === 0) {
            tecnicasGrid.innerHTML = '<p>Este utensílio não possui técnicas disponíveis.</p>';
          }

          // Adiciona botão para criar técnica personalizada
          const createCustomTecnicaBtn = document.createElement("button");
          createCustomTecnicaBtn.textContent = "Criar Técnica Personalizada";
          createCustomTecnicaBtn.className = "btn btn-primary create-custom-btn";
          createCustomTecnicaBtn.addEventListener("click", function() {
            showCustomTecnicaForm();
          });
          
          tecnicasLista.appendChild(createCustomTecnicaBtn);
          tecnicasLista.appendChild(tecnicasGrid);
          modal.style.display = "block";
        })
        .catch(error => {
          console.error('Error:', error);
          alert('Erro ao carregar técnicas: ' + error.message);
        });
    }
  }

  // Função para mostrar formulário de criação de técnica personalizada
  function showCustomTecnicaForm() {
    const modal = document.getElementById("tecnicas-modal");
    const tecnicasLista = document.getElementById("tecnicas-lista");
    
    // Salva o conteúdo atual para poder voltar
    const originalContent = tecnicasLista.innerHTML;
    
    // Limpa a lista e cria o formulário
    tecnicasLista.innerHTML = "";
    
    const formContainer = document.createElement("div");
    formContainer.className = "custom-tecnica-form";
    
    const title = document.createElement("h3");
    title.textContent = "Criar Técnica Personalizada";
    
    const nameLabel = document.createElement("label");
    nameLabel.textContent = "Nome da Técnica:";
    nameLabel.htmlFor = "custom-tecnica-nome";
    
    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.id = "custom-tecnica-nome";
    nameInput.className = "form-control";
    nameInput.required = true;
    
    const categoriaLabel = document.createElement("label");
    categoriaLabel.textContent = "Categoria:";
    categoriaLabel.htmlFor = "custom-tecnica-categoria";
    
    const categoriaSelect = document.createElement("select");
    categoriaSelect.id = "custom-tecnica-categoria";
    categoriaSelect.className = "form-control";
    
    const categorias = [
      "iniciante", "intermediario", "avancado", 
      "tecnicas_ligeiras", "tecnicas_precisas", "tecnicas_poderosas", "tecnicas_sagazes"
    ];
    
    categorias.forEach(categoria => {
      const option = document.createElement("option");
      option.value = categoria;
      option.textContent = formatarNomeCategoria(categoria);
      categoriaSelect.appendChild(option);
    });
    
    const detalhesLabel = document.createElement("label");
    detalhesLabel.textContent = "Detalhes (custo, passiva, etc):";
    detalhesLabel.htmlFor = "custom-tecnica-detalhes";
    
    const detalhesInput = document.createElement("input");
    detalhesInput.type = "text";
    detalhesInput.id = "custom-tecnica-detalhes";
    detalhesInput.className = "form-control";
    detalhesInput.placeholder = "Ex: Custo: 2 Ações, Passiva, etc.";
    
    const descLabel = document.createElement("label");
    descLabel.textContent = "Descrição:";
    descLabel.htmlFor = "custom-tecnica-desc";
    
    const descInput = document.createElement("textarea");
    descInput.id = "custom-tecnica-desc";
    descInput.className = "form-control";
    descInput.rows = 4;
    descInput.required = true;
    
    const buttonContainer = document.createElement("div");
    buttonContainer.className = "button-container";
    
    const saveButton = document.createElement("button");
    saveButton.textContent = "Salvar";
    saveButton.className = "btn btn-success";
    saveButton.addEventListener("click", function() {
      const nome = nameInput.value.trim();
      const categoria = categoriaSelect.value;
      const detalhes = detalhesInput.value.trim();
      const descricao = descInput.value.trim();
      
      if (nome && descricao) {
        const customTecnica = {
          nome: nome,
          descricao: descricao,
          categoria: categoria,
          detalhes: detalhes,
          personalizada: true
        };
        
        addTecnicaToUtensilio(customTecnica, categoria);
        modal.style.display = "none";
      } else {
        alert("Por favor, preencha pelo menos o nome e a descrição.");
      }
    });
    
    const cancelButton = document.createElement("button");
    cancelButton.textContent = "Cancelar";
    cancelButton.className = "btn btn-secondary";
    cancelButton.addEventListener("click", function() {
      if (originalContent) {
        tecnicasLista.innerHTML = originalContent;
      } else {
        modal.style.display = "none";
      }
    });
    
    buttonContainer.appendChild(saveButton);
    buttonContainer.appendChild(cancelButton);
    
    formContainer.appendChild(title);
    formContainer.appendChild(nameLabel);
    formContainer.appendChild(nameInput);
    formContainer.appendChild(categoriaLabel);
    formContainer.appendChild(categoriaSelect);
    formContainer.appendChild(detalhesLabel);
    formContainer.appendChild(detalhesInput);
    formContainer.appendChild(descLabel);
    formContainer.appendChild(descInput);
    formContainer.appendChild(buttonContainer);
    
    tecnicasLista.appendChild(formContainer);
  }
  
  // Função para processar as técnicas de uma categoria
  function processTecnicas(categoria, tecnicas, container) {
    if (!tecnicas || tecnicas.length === 0) return;
    
    const categoriaTitle = document.createElement('h3');
    categoriaTitle.textContent = formatarNomeCategoria(categoria);
    categoriaTitle.className = 'categoria-title';
    container.appendChild(categoriaTitle);
    
    tecnicas.forEach(tecnica => {
      const tecnicaCard = document.createElement('div');
      tecnicaCard.className = 'tecnica-card';
      
      const tecnicaHeader = document.createElement('div');
      tecnicaHeader.className = 'tecnica-card-header';
      
      const tecnicaNome = document.createElement('h4');
      tecnicaNome.className = 'tecnica-card-title';
      tecnicaNome.textContent = tecnica.nome;
      tecnicaHeader.appendChild(tecnicaNome);
      
      const tecnicaDesc = document.createElement('p');
      tecnicaDesc.className = 'tecnica-card-desc';
      tecnicaDesc.textContent = tecnica.descricao;
      
      const addButton = document.createElement('button');
      addButton.className = 'btn btn-success btn-sm';
      addButton.textContent = 'Adicionar';
      addButton.addEventListener('click', function() {
        addTecnicaToUtensilio(tecnica, categoria);
        modal.style.display = "none";
      });
      
      tecnicaCard.appendChild(tecnicaHeader);
      tecnicaCard.appendChild(tecnicaDesc);
      tecnicaCard.appendChild(addButton);
      container.appendChild(tecnicaCard);
    });
  }
  
  // Função para formatar o nome da categoria
  function formatarNomeCategoria(categoria) {
    // Substitui underscores por espaços e capitaliza cada palavra
    return categoria
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  
  // Função para adicionar a técnica ao utensílio
  function addTecnicaToUtensilio(tecnica, categoria) {
    const tecnicasList = document.getElementById("tecnicas-list");
    
    // Cria o elemento para a técnica
    const tecnicaItem = document.createElement("div");
    tecnicaItem.className = "tecnica-item";
    if (tecnica.personalizada) {
      tecnicaItem.dataset.personalizada = "true";
      tecnicaItem.classList.add("personalizada");
    }
    
    // Cria os inputs para o nome, categoria, detalhes e descrição
    const nomeInput = document.createElement("input");
    nomeInput.type = "text";
    nomeInput.className = "tecnica-nome";
    nomeInput.value = tecnica.nome;
    
    const categoriaInput = document.createElement("input");
    categoriaInput.type = "hidden";
    categoriaInput.className = "tecnica-categoria";
    categoriaInput.value = categoria;
    
    const detalhesInput = document.createElement("input");
    detalhesInput.type = "text";
    detalhesInput.className = "tecnica-detalhes";
    detalhesInput.value = tecnica.detalhes || tecnica.custo || tecnica.passiva ? "Passiva" : "";
    
    const descricaoInput = document.createElement("textarea");
    descricaoInput.className = "tecnica-descricao";
    descricaoInput.value = tecnica.descricao;
    
    // Cria o botão para remover a técnica
    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "btn btn-sm btn-danger";
    removeButton.textContent = "Remover";
    removeButton.addEventListener("click", function() {
      tecnicasList.removeChild(tecnicaItem);
    });
    
    // Adiciona tudo ao item da técnica
    tecnicaItem.appendChild(nomeInput);
    tecnicaItem.appendChild(categoriaInput);
    tecnicaItem.appendChild(detalhesInput);
    tecnicaItem.appendChild(descricaoInput);
    tecnicaItem.appendChild(removeButton);
    
    // Adiciona o item à lista
    tecnicasList.appendChild(tecnicaItem);
  }

  // Função para adicionar um item ao inventário
  function addItemToInventory(item) {
    const inventarioList = document.getElementById("inventario-list");
    
    // Criar o elemento para o item
    const itemElement = document.createElement("div");
    itemElement.className = "inventario-item-form";
    
    // Criar inputs para o nome, quantidade e descrição
    const nomeInput = document.createElement("input");
    nomeInput.type = "text";
    nomeInput.className = "item-nome";
    nomeInput.value = item.nome;
    nomeInput.placeholder = "Nome do item";
    
    const quantidadeInput = document.createElement("input");
    quantidadeInput.type = "number";
    quantidadeInput.className = "item-quantidade";
    quantidadeInput.value = item.quantidade;
    quantidadeInput.min = "1";
    
    const descricaoInput = document.createElement("textarea");
    descricaoInput.className = "item-descricao";
    descricaoInput.value = item.descricao || "";
    descricaoInput.placeholder = "Descrição (opcional)";
    descricaoInput.rows = "3";
    
    // Criar labels
    const nomeLabel = document.createElement("label");
    nomeLabel.textContent = "Nome:";
    nomeLabel.appendChild(nomeInput);
    
    const quantidadeLabel = document.createElement("label");
    quantidadeLabel.textContent = "Quantidade:";
    quantidadeLabel.appendChild(quantidadeInput);
    
    const descricaoLabel = document.createElement("label");
    descricaoLabel.textContent = "Descrição:";
    descricaoLabel.appendChild(descricaoInput);
    
    // Criar o botão de remover
    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "btn btn-sm btn-danger";
    removeButton.textContent = "Remover";
    removeButton.addEventListener("click", function() {
      inventarioList.removeChild(itemElement);
    });
    
    // Adicionar tudo ao elemento do item
    itemElement.appendChild(nomeLabel);
    itemElement.appendChild(quantidadeLabel);
    itemElement.appendChild(descricaoLabel);
    itemElement.appendChild(removeButton);
    
    // Adicionar o elemento à lista
    inventarioList.appendChild(itemElement);
  }

  // Adiciona evento para o botão de adicionar técnica
  document.getElementById("add-tecnica")?.addEventListener("click", showTecnicasModal);
  
  // Adiciona evento para o botão de adicionar traço
  document.getElementById("add-traco")?.addEventListener("click", showTracosModal);

  // Adicionar evento para abrir o modal de inventário
  document.getElementById("add-item").addEventListener("click", function() {
    const modal = document.getElementById("inventario-modal");
    // Limpar o formulário
    document.getElementById("item-form").reset();
    // Mostrar o modal
    modal.style.display = "block";
  });

  // Adicionar evento para fechar o modal de inventário
  document.querySelectorAll("#inventario-modal .close, #cancel-item").forEach(element => {
    element.addEventListener("click", function() {
      document.getElementById("inventario-modal").style.display = "none";
    });
  });

  // Adicionar evento para o formulário de item
  document.getElementById("item-form").addEventListener("submit", function(event) {
    event.preventDefault();
    
    // Pegar os valores do formulário
    const nome = document.getElementById("item-nome").value.trim();
    const quantidade = parseInt(document.getElementById("item-quantidade").value) || 1;
    const descricao = document.getElementById("item-descricao").value.trim();
    
    if (nome) {
      // Adicionar item ao inventário
      addItemToInventory({ nome, quantidade, descricao });
      // Fechar o modal
      document.getElementById("inventario-modal").style.display = "none";
    }
  });

  // Função para fechar o modal
  function closeModal() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
      modal.style.display = "none";
    });
  }
  
  // Adiciona evento para os botões de fechar modal
  const closeButtons = document.querySelectorAll('.close');
  closeButtons.forEach(button => {
    button.addEventListener('click', closeModal);
  });
  
  // Fecha o modal se clicar fora dele
  window.addEventListener('click', function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    });
  });
  
  // Adiciona evento para o botão de cancelar edição
  document.getElementById("cancel-edit")?.addEventListener("click", function() {
    window.location.href = "../index.html";
  });
  
  // Adiciona evento para o botão de excluir personagem
  document.getElementById("delete-character")?.addEventListener("click", function() {
    if (confirm("Tem certeza que deseja excluir este personagem? Esta ação não pode ser desfeita.")) {
      // Remove o personagem da lista
      characters.splice(characterIndex, 1);
      
      // Atualiza o localStorage
      localStorage.setItem("characters", JSON.stringify(characters));
      
      // Redireciona para a página inicial
      window.location.href = "../index.html";
    }
  });
  
  // Adiciona evento para o formulário de edição
  document.getElementById("edit-character-form")?.addEventListener("submit", function(event) {
    event.preventDefault();
    
    // Função para garantir que os valores estejam entre 0 e 5
    const limitarValor = valor => Math.max(0, Math.min(5, parseInt(valor) || 0));
    
    // Atualiza os dados do personagem
    character.nome = document.getElementById("nome").value;
    character.imagem = document.getElementById("imagem").value;
    
    // Atualiza os estilos
    character.estilos = {
      poderoso: limitarValor(document.getElementById("poderoso").value),
      ligeiro: limitarValor(document.getElementById("ligeiro").value),
      preciso: limitarValor(document.getElementById("preciso").value),
      capcioso: limitarValor(document.getElementById("capcioso").value)
    };
    
    // Atualiza as habilidades
    character.habilidades = {
      agarrao: limitarValor(document.getElementById("agarrao").value),
      armazenamento: limitarValor(document.getElementById("armazenamento").value),
      assegurar: limitarValor(document.getElementById("assegurar").value),
      busca: limitarValor(document.getElementById("busca").value),
      chamado: limitarValor(document.getElementById("chamado").value),
      cura: limitarValor(document.getElementById("cura").value),
      exibicao: limitarValor(document.getElementById("exibicao").value),
      golpe: limitarValor(document.getElementById("golpe").value),
      manufatura: limitarValor(document.getElementById("manufatura").value),
      estudo: limitarValor(document.getElementById("estudo").value),
      tiro: limitarValor(document.getElementById("tiro").value),
      travessia: limitarValor(document.getElementById("travessia").value)
    };
    
    // Atualiza os traços
    character.tracos = [];
    const tracosItems = document.getElementsByClassName("traco-item");
    Array.from(tracosItems).forEach(tracoItem => {
      character.tracos.push({
        nome: tracoItem.querySelector(".traco-nome").value,
        descricao: tracoItem.querySelector(".traco-descricao").value,
        personalizado: tracoItem.dataset.personalizado === "true"
      });
    });
    
    // Atualiza o utensílio
    character.utensilio = {
      nome: document.getElementById("nomeUtensilio").value,
      resistencia: parseInt(document.getElementById("resistencia").value) || 0,
      personalizado: document.getElementById("nomeUtensilio").dataset.personalizado === "true",
      tecnicas: []
    };
    
    // Atualiza as técnicas
    const tecnicasItems = document.getElementsByClassName("tecnica-item");
    Array.from(tecnicasItems).forEach(tecnicaItem => {
      character.utensilio.tecnicas.push({
        nome: tecnicaItem.querySelector(".tecnica-nome").value,
        categoria: tecnicaItem.querySelector(".tecnica-categoria").value,
        detalhes: tecnicaItem.querySelector(".tecnica-detalhes").value,
        descricao: tecnicaItem.querySelector(".tecnica-descricao").value,
        personalizada: tecnicaItem.dataset.personalizada === "true"
      });
    });
    
    // Atualiza o inventário
    character.inventario = [];
    const inventarioItems = document.getElementsByClassName("inventario-item-form");
    Array.from(inventarioItems).forEach(inventarioItem => {
      character.inventario.push({
        nome: inventarioItem.querySelector(".item-nome").value,
        quantidade: parseInt(inventarioItem.querySelector(".item-quantidade").value) || 1,
        descricao: inventarioItem.querySelector(".item-descricao").value
      });
    });
    
    // Atualiza a lista de personagens no localStorage
    characters[characterIndex] = character;
    localStorage.setItem("characters", JSON.stringify(characters));
    
    // Redireciona para a página de visualização
    window.location.href = `view.html?index=${characterIndex}`;
  });
  
  // Preenche o formulário com os dados do personagem
  console.log("Chamando populateForm");
  populateForm();
  console.log("Formulário preenchido");

  // Adicionar evento para abrir o modal de traço personalizado
  document.getElementById("add-traco-personalizado").addEventListener("click", function() {
    const modal = document.getElementById("traco-personalizado-modal");
    document.getElementById("traco-personalizado-form").reset();
    modal.style.display = "block";
  });

  // Adicionar evento para fechar o modal de traço personalizado
  document.querySelectorAll("#traco-personalizado-modal .close, #cancel-traco-personalizado").forEach(element => {
    element.addEventListener("click", function() {
      document.getElementById("traco-personalizado-modal").style.display = "none";
    });
  });

  // Adicionar evento para o formulário de traço personalizado
  document.getElementById("traco-personalizado-form").addEventListener("submit", function(event) {
    event.preventDefault();
    
    // Pegar os valores do formulário
    const nome = document.getElementById("traco-personalizado-nome").value.trim();
    const descricao = document.getElementById("traco-personalizado-descricao").value.trim();
    
    if (nome) {
      // Criar traço personalizado
      const tracoPersonalizado = {
        nome: nome,
        descricao: descricao,
        personalizado: true
      };
      
      // Adicionar o traço à lista
      addTracoToCharacter(tracoPersonalizado);
      
      // Fechar o modal
      document.getElementById("traco-personalizado-modal").style.display = "none";
    }
  });

  // Adicionar evento para abrir o modal de técnica personalizada
  document.getElementById("add-tecnica-personalizada").addEventListener("click", function() {
    const modal = document.getElementById("tecnica-personalizada-modal");
    document.getElementById("tecnica-personalizada-form").reset();
    modal.style.display = "block";
  });

  // Adicionar evento para fechar o modal de técnica personalizada
  document.querySelectorAll("#tecnica-personalizada-modal .close, #cancel-tecnica-personalizada").forEach(element => {
    element.addEventListener("click", function() {
      document.getElementById("tecnica-personalizada-modal").style.display = "none";
    });
  });

  // Adicionar evento para o formulário de técnica personalizada
  document.getElementById("tecnica-personalizada-form").addEventListener("submit", function(event) {
    event.preventDefault();
    
    // Pegar os valores do formulário
    const nome = document.getElementById("tecnica-personalizada-nome").value.trim();
    const categoria = document.getElementById("tecnica-personalizada-categoria").value;
    const detalhes = document.getElementById("tecnica-personalizada-detalhes").value.trim();
    const descricao = document.getElementById("tecnica-personalizada-descricao").value.trim();
    
    if (nome && categoria) {
      // Criar técnica personalizada
      const tecnicaPersonalizada = {
        nome: nome,
        categoria: categoria,
        detalhes: detalhes,
        descricao: descricao,
        personalizada: true
      };
      
      // Adicionar a técnica à lista
      addTecnicaToUtensilio(tecnicaPersonalizada, categoria);
      
      // Fechar o modal
      document.getElementById("tecnica-personalizada-modal").style.display = "none";
    }
  });
});
