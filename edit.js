document.addEventListener("DOMContentLoaded", function() {
  /* ====================
   Página de Edição (edit.html)
   ==================== */
  const editForm = document.getElementById("edit-character-form");
  if (editForm) {
    const index = getQueryParam("index");
    const characters = JSON.parse(localStorage.getItem("characters") || "[]");
    
    if (index === null || isNaN(index) || index < 0 || index >= characters.length) {
      document.body.innerHTML = "<p>Personagem não encontrado.</p>";
      return;
    }

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

    // Preenche o formulário com os dados existentes
    const character = characters[index];
    document.getElementById("tipo").value = character.tipo;
    document.getElementById("nome").value = character.nome;
    document.getElementById("imagem").value = character.imagem;

    // Preenche os estilos
    document.getElementById("poderoso").value = character.estilos.poderoso;
    document.getElementById("ligeiro").value = character.estilos.ligeiro;
    document.getElementById("preciso").value = character.estilos.preciso;
    document.getElementById("capcioso").value = character.estilos.capcioso;

    // Preenche as habilidades
    document.getElementById("agarrao").value = character.habilidades.agarrao;
    document.getElementById("armazenamento").value = character.habilidades.armazenamento;
    document.getElementById("assegurar").value = character.habilidades.assegurar;
    document.getElementById("busca").value = character.habilidades.busca;
    document.getElementById("chamado").value = character.habilidades.chamado;
    document.getElementById("cura").value = character.habilidades.cura;
    document.getElementById("exibicao").value = character.habilidades.exibicao;
    document.getElementById("golpe").value = character.habilidades.golpe;
    document.getElementById("manufatura").value = character.habilidades.manufatura;
    document.getElementById("estudo").value = character.habilidades.estudo;
    document.getElementById("tiro").value = character.habilidades.tiro;
    document.getElementById("travessia").value = character.habilidades.travessia;

    // Verifica e aplica o tipo de personagem (personagem ou monstro)
    const tipoSelecionado = character.tipo;
    const utensilioSection = document.getElementById("utensilio-section");
    const partesSection = document.getElementById("partes-section");
    
    // Mostra/oculta seções com base no tipo
    utensilioSection.style.display = tipoSelecionado === "personagem" ? "block" : "none";
    partesSection.style.display = tipoSelecionado === "monstro" ? "block" : "none";

    // Preenche os traços existentes
    const tracosList = document.getElementById("tracos-list");
    tracosList.innerHTML = ''; // Limpa a lista primeiro
    
    character.tracos.forEach(traco => {
      addTracoToCharacter(traco);
    });

    // Preenche o utensílio ou partes
    if (character.tipo === "personagem" && character.utensilio) {
      document.getElementById("nomeUtensilio").value = character.utensilio.nome;
      document.getElementById("resistencia").value = character.utensilio.resistencia;
      document.getElementById("utensilio-nome-display").textContent = character.utensilio.nome;
      
      // Exibe os containers de utensílio
      document.getElementById("utensilio-details").style.display = "block";
      document.getElementById("tecnicas-container").style.display = "block";
      
      // Preenche as técnicas existentes
      const tecnicasList = document.getElementById("tecnicas-list");
      tecnicasList.innerHTML = ''; // Limpa a lista primeiro
      
      if (character.utensilio.tecnicas && character.utensilio.tecnicas.length > 0) {
        character.utensilio.tecnicas.forEach(tecnica => {
          const tecnicaCompleta = {
            nome: tecnica.nome,
            descricao: tecnica.descricao,
            categoria: tecnica.categoria || '',
            passiva: tecnica.detalhes === "Passiva",
            custo: tecnica.detalhes.startsWith("Custo:") ? tecnica.detalhes.substring(6).trim() : ''
          };
          addTecnicaToUtensilio(tecnicaCompleta, tecnica.categoria);
        });
      }
    } else if (character.tipo === "monstro" && character.partes) {
      // Preenche as partes se for um monstro
      const partesList = document.getElementById("partes-list");
      partesList.innerHTML = ''; // Limpa a lista primeiro
      
      character.partes.forEach(parte => {
        const parteItem = document.createElement("div");
        parteItem.className = "parte-item";
        parteItem.innerHTML = `
          <div class="form-group">
            <label>Nome da Parte</label>
            <input type="text" class="parte-nome" value="${parte.nome}" required>
          </div>
          <div class="form-group">
            <label>Resistência</label>
            <input type="number" class="parte-resistencia" value="${parte.resistencia}" required>
          </div>
          <div class="form-group">
            <label>Descrição</label>
            <textarea class="parte-descricao" required>${parte.descricao || ""}</textarea>
          </div>
          <div class="parte-controls">
            <button type="button" class="remove-parte-btn">Remover Parte</button>
          </div>
        `;
        
        partesList.appendChild(parteItem);
        
        // Adiciona evento para remover a parte
        parteItem.querySelector(".remove-parte-btn").addEventListener("click", () => {
          parteItem.remove();
        });
      });
    }

    // Manipula o envio do formulário de edição
    editForm.addEventListener("submit", function(event) {
      event.preventDefault();

      // Verifica se há uma imagem (URL ou arquivo)
      const imageUrl = document.getElementById("imagem").value;
      if (!imageUrl) {
        alert("Por favor, adicione uma imagem para o personagem.");
        return;
      }

      // Atualiza o objeto personagem
      const updatedCharacter = {
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

      // Coleta todos os traços
      const tracosItems = document.getElementsByClassName("traco-item");
      Array.from(tracosItems).forEach(tracoItem => {
        updatedCharacter.tracos.push({
          nome: tracoItem.querySelector(".traco-nome").value,
          descricao: tracoItem.querySelector(".traco-descricao").value
        });
      });

      // Adiciona utensílio ou partes baseado no tipo
      if (updatedCharacter.tipo === "personagem") {
        updatedCharacter.utensilio = {
          nome: document.getElementById("nomeUtensilio").value,
          resistencia: parseInt(document.getElementById("resistencia").value) || 0,
          tecnicas: []
        };
        
        // Coleta técnicas do utensílio
        const tecnicasItems = document.getElementsByClassName("tecnica-item");
        Array.from(tecnicasItems).forEach(tecnicaItem => {
          updatedCharacter.utensilio.tecnicas.push({
            nome: tecnicaItem.querySelector(".tecnica-nome").value,
            categoria: tecnicaItem.querySelector(".tecnica-categoria").value,
            detalhes: tecnicaItem.querySelector(".tecnica-detalhes").value,
            descricao: tecnicaItem.querySelector(".tecnica-descricao").value
          });
        });
      } else {
        updatedCharacter.partes = [];
        const partesItems = document.getElementsByClassName("parte-item");
        Array.from(partesItems).forEach(parteItem => {
          updatedCharacter.partes.push({
            nome: parteItem.querySelector(".parte-nome").value,
            resistencia: parseInt(parteItem.querySelector(".parte-resistencia").value) || 0,
            descricao: parteItem.querySelector(".parte-descricao").value
          });
        });
      }

      // Salva no localStorage
      characters[index] = updatedCharacter;
      localStorage.setItem("characters", JSON.stringify(characters));
      window.location.href = `view.html?index=${index}`;
    });

    // Botão de exclusão
    document.getElementById("delete-character").addEventListener("click", function() {
      if (confirm("Tem certeza que deseja excluir este personagem permanentemente?")) {
        characters.splice(index, 1);
        localStorage.setItem("characters", JSON.stringify(characters));
        window.location.href = "index.html";
      }
    });

    // Botão de cancelar
    document.getElementById("cancel-edit").addEventListener("click", function() {
      window.location.href = `view.html?index=${index}`;
    });
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
    document.getElementById("tracos-modal").style.display = "none";
    document.getElementById("tecnicas-modal").style.display = "none";
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
            const descricao = card.querySelector('.traco-card-desc').textContent.toLowerCase();
            
            if (nome.includes(term) || descricao.includes(term)) {
              card.style.display = '';
            } else {
              card.style.display = 'none';
            }
          });
        });
        
        tracosLista.insertBefore(searchBox, tracosLista.firstChild);
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
    
    // Verifica se o traço já foi adicionado
    const tracosExistentes = tracosList.querySelectorAll(".traco-nome");
    for (let i = 0; i < tracosExistentes.length; i++) {
      if (tracosExistentes[i].value === traco.nome) {
        alert("Este traço já foi adicionado.");
        return;
      }
    }
    
    // Cria o elemento para o traço
    const tracoItem = document.createElement("div");
    tracoItem.className = "traco-item";
    
    tracoItem.innerHTML = `
      <div class="form-group">
        <label>Nome do Traço</label>
        <input type="text" class="traco-nome" value="${traco.nome}" required readonly>
      </div>
      <div class="form-group">
        <label>Descrição</label>
        <textarea class="traco-descricao" required readonly>${traco.descricao}</textarea>
      </div>
      <div class="traco-controls">
        <button type="button" class="remove-traco-btn">Remover Traço</button>
      </div>
    `;
    
    tracosList.appendChild(tracoItem);
    
    // Adiciona evento para remover o traço
    tracoItem.querySelector(".remove-traco-btn").addEventListener("click", () => {
      tracoItem.remove();
    });
  }

  // Função para adicionar uma parte ao monstro
  function addParte() {
    const partesList = document.getElementById("partes-list");
    
    // Cria o elemento para a parte
    const parteItem = document.createElement("div");
    parteItem.className = "parte-item";
    
    parteItem.innerHTML = `
      <div class="form-group">
        <label>Nome da Parte</label>
        <input type="text" class="parte-nome" value="" required>
      </div>
      <div class="form-group">
        <label>Resistência</label>
        <input type="number" class="parte-resistencia" value="0" required>
      </div>
      <div class="form-group">
        <label>Descrição</label>
        <textarea class="parte-descricao" required></textarea>
      </div>
      <div class="parte-controls">
        <button type="button" class="remove-parte-btn">Remover Parte</button>
      </div>
    `;
    
    partesList.appendChild(parteItem);
    
    // Adiciona evento para remover a parte
    parteItem.querySelector(".remove-parte-btn").addEventListener("click", () => {
      parteItem.remove();
    });
  }

  // Adiciona eventos aos botões
  document.getElementById("add-traco")?.addEventListener("click", showTracosModal);
  document.getElementById("add-tecnica")?.addEventListener("click", showTecnicasModal);
  document.getElementById("select-utensilio")?.addEventListener("click", showUtensiliosModal);
  document.getElementById("add-parte")?.addEventListener("click", addParte);

  // Adiciona eventos para fechar o modal
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
});
