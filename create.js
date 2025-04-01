document.addEventListener("DOMContentLoaded", function() {
  /* ====================
     Página de Criação (create.html)
     ==================== */
  const createForm = document.getElementById("create-character-form");
  if (createForm) {
    // Mantém o evento de alternar tipo que já existe
    document.getElementById("tipo").addEventListener("change", function(e) {
      const tipoSelecionado = e.target.value;
      const utensilioSection = document.getElementById("utensilio-section");
      const partesSection = document.getElementById("partes-section");
      
      // Mostra/oculta seções
      utensilioSection.style.display = tipoSelecionado === "personagem" ? "block" : "none";
      partesSection.style.display = tipoSelecionado === "monstro" ? "block" : "none";

      // Atualiza atributos 'required' dos campos
      const utensilioCampos = utensilioSection.querySelectorAll("[required]");
      const partesCampos = partesSection.querySelectorAll("[required]");
      
      if (tipoSelecionado === "personagem") {
        utensilioCampos.forEach(campo => campo.setAttribute("required", ""));
        partesCampos.forEach(campo => campo.removeAttribute("required"));
      } else {
        utensilioCampos.forEach(campo => campo.removeAttribute("required"));
        partesCampos.forEach(campo => campo.setAttribute("required", ""));
      }
    });

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

    createForm.addEventListener("submit", async function(event) {
      event.preventDefault();

      // Verifica se há uma imagem (URL ou arquivo)
      const imageUrl = document.getElementById("imagem").value;
      if (!imageUrl) {
        alert("Por favor, adicione uma imagem para o personagem.");
        return;
      }

      const character = {
        tipo: document.getElementById("tipo").value,
        nome: document.getElementById("nome").value,
        imagem: document.getElementById("imagem").value,
        estilos: {
          poderoso: parseInt(document.getElementById("poderoso").value) || 0,
          ligeiro: parseInt(document.getElementById("ligeiro").value) || 0,
          preciso: parseInt(document.getElementById("preciso").value) || 0,
          capcioso: parseInt(document.getElementById("capcioso").value) || 0
        },
        habilidades: {
          agarrao: parseInt(document.getElementById("agarrao").value) || 0,
          armazenamento: parseInt(document.getElementById("armazenamento").value) || 0,
          assegurar: parseInt(document.getElementById("assegurar").value) || 0,
          busca: parseInt(document.getElementById("busca").value) || 0,
          chamado: parseInt(document.getElementById("chamado").value) || 0,
          cura: parseInt(document.getElementById("cura").value) || 0,
          exibicao: parseInt(document.getElementById("exibicao").value) || 0,
          golpe: parseInt(document.getElementById("golpe").value) || 0,
          manufatura: parseInt(document.getElementById("manufatura").value) || 0,
          estudo: parseInt(document.getElementById("estudo").value) || 0,
          tiro: parseInt(document.getElementById("tiro").value) || 0,
          travessia: parseInt(document.getElementById("travessia").value) || 0
        },
        tracos: []
      };

      // Coleta traços
      const tracosItems = document.getElementsByClassName("traco-item");
      Array.from(tracosItems).forEach(tracoItem => {
        character.tracos.push({
          nome: tracoItem.querySelector(".traco-nome").value,
          descricao: tracoItem.querySelector(".traco-descricao").value
        });
      });

      // Adiciona utensílio ou partes baseado no tipo
      if (character.tipo === "personagem") {
        character.utensilio = {
          nome: document.getElementById("nomeUtensilio").value,
          resistencia: parseInt(document.getElementById("resistencia").value) || 0,
          descricao: document.getElementById("descricaoUtensilio").value
        };
      } else {
        character.partes = [];
        const partesItems = document.getElementsByClassName("parte-item");
        Array.from(partesItems).forEach(parteItem => {
          character.partes.push({
            nome: parteItem.querySelector(".parte-nome").value,
            resistencia: parseInt(parteItem.querySelector(".parte-resistencia").value) || 0,
            descricao: parteItem.querySelector(".parte-descricao").value
          });
        });
      }

      // Salva no localStorage
      const characters = JSON.parse(localStorage.getItem("characters") || "[]");
      characters.push(character);
      localStorage.setItem("characters", JSON.stringify(characters));

      // Redireciona para a página inicial
      window.location.href = "index.html";
    });
  }

  // Função para carregar e exibir o modal de traços
  function showTracosModal() {
    const modal = document.getElementById("tracos-modal");
    const tracosLista = document.getElementById("tracos-lista");
    
    // Limpa a lista
    tracosLista.innerHTML = "";
    
    // Carrega a lista de traços do JSON
    fetch('traits.json')
      .then(response => response.json())
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
      })
      .catch(error => {
        console.error("Erro ao carregar traços:", error);
        tracosLista.innerHTML = "<p>Erro ao carregar traços.</p>";
      });
    
    // Exibe o modal
    modal.style.display = "block";
  }

  // Função para adicionar o traço selecionado ao personagem
  function addTracoToCharacter(traco) {
    const tracosList = document.getElementById("tracos-list");
    
    // Cria o elemento para o traço
    const tracoItem = document.createElement("div");
    tracoItem.className = "traco-item";
    
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

  // Atualiza o evento do botão de adicionar traço
  document.getElementById("add-traco")?.addEventListener("click", showTracosModal);

  // Adiciona evento para fechar o modal
  document.querySelector(".close")?.addEventListener("click", closeModal);
  document.querySelectorAll(".close-modal").forEach(button => {
    button.addEventListener("click", closeModal);
  });

  // Função para fechar o modal
  function closeModal() {
    document.querySelectorAll(".modal").forEach(modal => {
      modal.style.display = "none";
    });
  }

  // Clique fora do modal também fecha
  window.addEventListener("click", function(event) {
    if (event.target.classList.contains("modal")) {
      closeModal();
    }
  });

  // Função para adicionar parte
  function addParte() {
    const partesList = document.getElementById("partes-list");
    
    // Cria o elemento para a parte
    const parteItem = document.createElement("div");
    parteItem.className = "parte-item";
    
    // Cria os inputs para o nome, resistência e descrição
    const nomeInput = document.createElement("input");
    nomeInput.type = "text";
    nomeInput.className = "parte-nome";
    nomeInput.placeholder = "Nome da parte";
    
    const resistenciaInput = document.createElement("input");
    resistenciaInput.type = "number";
    resistenciaInput.className = "parte-resistencia";
    resistenciaInput.placeholder = "Resistência";
    resistenciaInput.min = "0";
    
    const descricaoInput = document.createElement("textarea");
    descricaoInput.className = "parte-descricao";
    descricaoInput.placeholder = "Descrição da parte";
    
    // Cria o botão para remover a parte
    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "btn btn-sm btn-danger";
    removeButton.textContent = "Remover";
    removeButton.addEventListener("click", function() {
      partesList.removeChild(parteItem);
    });
    
    // Adiciona tudo ao item da parte
    parteItem.appendChild(nomeInput);
    parteItem.appendChild(resistenciaInput);
    parteItem.appendChild(descricaoInput);
    parteItem.appendChild(removeButton);
    
    // Adiciona o item à lista
    partesList.appendChild(parteItem);
  }

  // Adiciona eventos aos botões de adicionar
  document.getElementById("add-traco")?.addEventListener("click", showTracosModal);
  document.getElementById("add-parte")?.addEventListener("click", addParte);
});
