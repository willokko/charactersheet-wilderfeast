document.addEventListener("DOMContentLoaded", function() {
  /* ====================
     Página de Criação (create.html)
     ==================== */
  const createForm = document.getElementById("create-character-form");
  if (createForm) {
    // Aplicando limites aos campos de atributos (0-5)
    function aplicarLimitesAtributos() {
      // Lista de todos os atributos (estilos e habilidades)
      const atributos = [
        // Estilos
        "poderoso", "ligeiro", "preciso", "capcioso",
        // Habilidades
        "agarrao", "armazenamento", "assegurar", "busca", "chamado",
        "cura", "exibicao", "golpe", "manufatura", "estudo", "tiro", "travessia"
      ];
      
      // Para cada atributo, adiciona evento de validação
      atributos.forEach(atributo => {
        const campo = document.getElementById(atributo);
        if (campo) {
          // Adiciona evento para validar durante a digitação
          campo.addEventListener("input", function() {
            let valor = parseInt(this.value) || 0;
            
            // Aplica os limites (0-5)
            if (valor < 0) valor = 0;
            if (valor > 5) valor = 5;
            
            // Atualiza o valor no campo
            this.value = valor;
          });
          
          // Também valida quando o campo perde o foco
          campo.addEventListener("blur", function() {
            let valor = parseInt(this.value) || 0;
            
            // Aplica os limites (0-5)
            if (valor < 0) valor = 0;
            if (valor > 5) valor = 5;
            
            // Atualiza o valor no campo
            this.value = valor;
          });
        }
      });
      
      console.log("Limites de atributos (0-5) aplicados a todos os campos");
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
    
    // Aplica os limites aos campos de atributos
    aplicarLimitesAtributos();

    createForm.addEventListener("submit", async function(event) {
      event.preventDefault();

      // Verifica se há uma imagem (URL ou arquivo)
      const imageUrl = document.getElementById("imagem").value;
      if (!imageUrl) {
        alert("Por favor, adicione uma imagem para o personagem.");
        return;
      }
      
      // Função para garantir que os valores estejam entre 0 e 5
      const limitarValor = valor => Math.max(0, Math.min(5, parseInt(valor) || 0));

      const character = {
        tipo: "personagem", // Tipo fixo agora
        nome: document.getElementById("nome").value,
        imagem: document.getElementById("imagem").value,
        estilos: {
          poderoso: limitarValor(document.getElementById("poderoso").value),
          ligeiro: limitarValor(document.getElementById("ligeiro").value),
          preciso: limitarValor(document.getElementById("preciso").value),
          capcioso: limitarValor(document.getElementById("capcioso").value)
        },
        habilidades: {
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

      // Adiciona utensílio
      character.utensilio = {
        nome: document.getElementById("nomeUtensilio").value,
        resistencia: parseInt(document.getElementById("resistencia").value) || 0,
        tecnicas: []
      };
      
      // Coleta técnicas do utensílio
      const tecnicasItems = document.getElementsByClassName("tecnica-item");
      Array.from(tecnicasItems).forEach(tecnicaItem => {
        character.utensilio.tecnicas.push({
          nome: tecnicaItem.querySelector(".tecnica-nome").value,
          categoria: tecnicaItem.querySelector(".tecnica-categoria").value,
          detalhes: tecnicaItem.querySelector(".tecnica-detalhes").value,
          descricao: tecnicaItem.querySelector(".tecnica-descricao").value
        });
      });

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

  // Função para exibir o modal de utensílios
  function showUtensiliosModal() {
    const modal = document.getElementById("utensilios-modal");
    const utensiliosLista = document.getElementById("utensilios-lista");
    
    utensiliosLista.innerHTML = "";
    
    fetch('utensil.json')
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

        utensiliosLista.appendChild(utensiliosGrid);
        modal.style.display = "block";
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Erro ao carregar utensílios: ' + error.message);
      });
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
    }
    
    // Atualiza o valor oculto para submissão do formulário
    const nomeUtensilioInput = document.getElementById("nomeUtensilio");
    if (nomeUtensilioInput) {
      nomeUtensilioInput.value = utensilio.nome;
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
    
    fetch('utensil.json')
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

        tecnicasLista.appendChild(tecnicasGrid);
        modal.style.display = "block";
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Erro ao carregar técnicas: ' + error.message);
      });
  }

  // Função auxiliar para processar e adicionar técnicas ao grid
  function processTecnicas(categoria, tecnicas, container) {
    if (!tecnicas || tecnicas.length === 0) return;
    
    console.log(`Processando ${tecnicas.length} técnicas da categoria ${categoria}`);
    
    tecnicas.forEach(tecnica => {
      const tecnicaCard = document.createElement('div');
      tecnicaCard.className = 'tecnica-card';

      const tecnicaHeader = document.createElement('div');
      tecnicaHeader.className = 'tecnica-card-header';

      const tecnicaNome = document.createElement('h3');
      tecnicaNome.className = 'tecnica-card-title';
      tecnicaNome.textContent = tecnica.nome;

      const tecnicaInfo = document.createElement('div');
      tecnicaInfo.className = 'tecnica-card-info';
      
      // Adiciona a categoria como uma tag
      const categoriaTag = document.createElement('span');
      categoriaTag.className = 'tag categoria';
      
      if (categoria === 'tecnicas_ligeiras') {
        categoriaTag.textContent = 'Ligeira';
        categoriaTag.style.backgroundColor = '#4a9';
      } else if (categoria === 'tecnicas_sagazes') {
        categoriaTag.textContent = 'Sagaz';
        categoriaTag.style.backgroundColor = '#47a';
      } else if (categoria === 'tecnicas_brutas') {
        categoriaTag.textContent = 'Bruta';
        categoriaTag.style.backgroundColor = '#a47';
      } else {
        categoriaTag.textContent = categoria;
      }
      
      tecnicaInfo.appendChild(categoriaTag);
      
      if (tecnica.passiva) {
        const passivaTag = document.createElement('span');
        passivaTag.className = 'tag passiva';
        passivaTag.textContent = 'Passiva';
        tecnicaInfo.appendChild(passivaTag);
      }

      if (tecnica.custo) {
        const custoTag = document.createElement('span');
        custoTag.className = 'tag custo';
        custoTag.textContent = `Custo: ${tecnica.custo}`;
        tecnicaInfo.appendChild(custoTag);
      }

      const tecnicaDescricao = document.createElement('p');
      tecnicaDescricao.className = 'tecnica-card-desc';
      tecnicaDescricao.textContent = tecnica.descricao;

      const addButton = document.createElement('button');
      addButton.className = 'btn btn-success btn-sm';
      addButton.textContent = 'Adicionar';
      addButton.addEventListener('click', function() {
        addTecnicaToUtensilio({
          nome: tecnica.nome,
          custo: tecnica.custo,
          descricao: tecnica.descricao,
          categoria: categoria,
          passiva: tecnica.passiva
        }, categoria);
        document.getElementById("tecnicas-modal").style.display = "none";
      });

      tecnicaHeader.appendChild(tecnicaNome);
      tecnicaHeader.appendChild(tecnicaInfo);
      tecnicaCard.appendChild(tecnicaHeader);
      tecnicaCard.appendChild(tecnicaDescricao);
      tecnicaCard.appendChild(addButton);
      container.appendChild(tecnicaCard);
    });
  }

  function addTecnicaToUtensilio(tecnica, categoria) {
    const tecnicasList = document.getElementById("tecnicas-list");
    
    // Verifica se a técnica já foi adicionada
    const tecnicasExistentes = tecnicasList.querySelectorAll(".tecnica-nome");
    for (let i = 0; i < tecnicasExistentes.length; i++) {
      if (tecnicasExistentes[i].value === tecnica.nome) {
        alert("Esta técnica já foi adicionada.");
        return;
      }
    }
    
    // Cria o elemento para a técnica
    const tecnicaItem = document.createElement("div");
    tecnicaItem.className = "tecnica-item";
    
    // Adiciona nome, categoria e descrição da técnica
    let tecnicaDetalhes = "";
    
    if (tecnica.passiva) {
      tecnicaDetalhes = "Passiva";
    } else if (tecnica.custo) {
      tecnicaDetalhes = "Custo: " + tecnica.custo;
    }
    
    tecnicaItem.innerHTML = `
      <div class="form-group">
        <label>Nome da Técnica</label>
        <input type="text" class="tecnica-nome" value="${tecnica.nome}" required readonly>
        <input type="hidden" class="tecnica-categoria" value="${categoria}">
      </div>
      <div class="form-group">
        <label>Detalhes</label>
        <input type="text" class="tecnica-detalhes" value="${tecnicaDetalhes}" required readonly>
      </div>
      <div class="form-group">
        <label>Descrição</label>
        <textarea class="tecnica-descricao" required readonly>${tecnica.descricao}</textarea>
      </div>
      <div class="tecnica-controls">
        <button type="button" class="remove-tecnica-btn">Remover Técnica</button>
      </div>
    `;
    
    tecnicasList.appendChild(tecnicaItem);
    
    // Adiciona evento para remover a técnica
    tecnicaItem.querySelector(".remove-tecnica-btn").addEventListener("click", () => {
      tecnicaItem.remove();
    });
  }

  // Função para fechar o modal de utensílios
  function closeUtensiliosModal() {
    document.getElementById("utensilios-modal").style.display = "none";
  }

  // Função para fechar o modal de técnicas
  function closeModal() {
    document.getElementById("tecnicas-modal").style.display = "none";
  }

  // Adiciona eventos aos botões
  document.getElementById("add-traco")?.addEventListener("click", showTracosModal);
  document.getElementById("select-utensilio")?.addEventListener("click", showUtensiliosModal);
  document.getElementById("add-tecnica")?.addEventListener("click", showTecnicasModal);
  document.getElementById("add-parte")?.addEventListener("click", addParte);

  // Adiciona eventos para fechar modais
  document.querySelectorAll(".modal .close").forEach(closeBtn => {
    closeBtn.addEventListener("click", function() {
      this.closest(".modal").style.display = "none";
    });
  });

  // Clique fora do modal também fecha
  window.addEventListener("click", function(event) {
    if (event.target.classList.contains("modal")) {
      event.target.style.display = "none";
    }
  });

  // Variável para armazenar o utensílio selecionado
  let selectedUtensilio = null;

  // Adiciona eventos aos botões de adicionar
  document.getElementById("add-traco")?.addEventListener("click", showTracosModal);
  document.getElementById("add-parte")?.addEventListener("click", addParte);

  // Quando o DOM estiver carregado, adicionar todos os event listeners necessários
  document.addEventListener("DOMContentLoaded", function() {
    console.log("DOM carregado, configurando event listeners");
    
    // Adiciona evento para o botão de selecionar utensílio
    const selectUtensilioBtn = document.getElementById("select-utensilio");
    if (selectUtensilioBtn) {
      selectUtensilioBtn.addEventListener("click", function() {
        console.log("Botão 'Escolher Utensílio' clicado");
        showUtensiliosModal();
      });
      console.log("Event listener adicionado ao botão 'Escolher Utensílio'");
    } else {
      console.error("Botão 'select-utensilio' não encontrado!");
    }
    
    // Event listeners para os botões de fechar os modais
    document.querySelectorAll(".modal .close").forEach(button => {
      button.addEventListener("click", function() {
        this.closest(".modal").style.display = "none";
      });
    });
    
    // Event listener para o botão de adicionar técnica
    const addTecnicaBtn = document.getElementById("add-tecnica");
    if (addTecnicaBtn) {
      addTecnicaBtn.addEventListener("click", function() {
        console.log("Botão 'Adicionar Técnica' clicado");
        showTecnicasModal();
      });
      console.log("Event listener adicionado ao botão 'Adicionar Técnica'");
    } else {
      console.error("Botão 'add-tecnica' não encontrado!");
    }
    
    // Event listener para o botão de adicionar traço
    const addTracoBtn = document.getElementById("add-traco");
    if (addTracoBtn) {
      addTracoBtn.addEventListener("click", showTracosModal);
    }

    // Clique fora do modal também fecha
    window.addEventListener("click", function(event) {
      if (event.target.classList.contains("modal")) {
        event.target.style.display = "none";
      }
    });
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
