// Aguarda o DOM estar completamente carregado
document.addEventListener("DOMContentLoaded", function() {
  console.log("DOM completamente carregado - iniciando configuração");
  
  /* ====================
   Página de Edição (edit.html)
   ==================== */
  
  // Declaração antecipada das funções auxiliares para garantir que estejam disponíveis
  
  // Função para exibir o modal de traços
  function showTracosModal() {
    const modal = document.getElementById("tracos-modal");
    const tracosLista = document.getElementById("tracos-lista");
    
    // Limpa o conteúdo anterior
    tracosLista.innerHTML = "<p>Carregando traços...</p>";
    
    // Carrega os traços do arquivo JSON
    fetch("traits.json")
      .then(response => response.json())
      .then(data => {
        tracosLista.innerHTML = "";
        
        // Cria um grid para os traços
        const tracosGrid = document.createElement("div");
        tracosGrid.className = "tracos-grid";
        tracosLista.appendChild(tracosGrid);
        
        // Adiciona cada traço ao grid
        data.forEach(traco => {
          const tracoCard = document.createElement("div");
          tracoCard.className = "traco-card";
          
          const tracoHeader = document.createElement("div");
          tracoHeader.className = "traco-card-header";
          
          const tracoNome = document.createElement("h3");
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
            closeUtensiliosModal();
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
    console.log("Função selectUtensilio executada para:", utensilio.nome);
    
    // Atualiza o nome do utensílio
    const utensilioNomeDisplay = document.getElementById("utensilio-nome-display");
    if (utensilioNomeDisplay) {
      utensilioNomeDisplay.textContent = utensilio.nome;
      console.log("Nome do utensílio atualizado:", utensilio.nome);
    } else {
      console.error("Elemento utensilio-nome-display não encontrado!");
    }
    
    // Atualiza o valor oculto para submissão do formulário
    const nomeUtensilioInput = document.getElementById("nomeUtensilio");
    if (nomeUtensilioInput) {
      nomeUtensilioInput.value = utensilio.nome;
    } else {
      console.error("Elemento nomeUtensilio não encontrado!");
    }

    // Atualiza a resistência do utensílio, se disponível
    const resistenciaInput = document.getElementById("resistencia");
    if (resistenciaInput) {
      resistenciaInput.value = utensilio.resistencia || 0;
    }

    // Mostra os detalhes do utensílio
    const utensilioDetails = document.getElementById("utensilio-details");
    if (utensilioDetails) {
      utensilioDetails.style.display = "block";
      console.log("Detalhes do utensílio exibidos");
    } else {
      console.error("Elemento utensilio-details não encontrado!");
    }

    // Atualizar o HTML do container de técnicas para garantir que o botão esteja presente
    const tecnicasContainer = document.getElementById("tecnicas-container");
    if (tecnicasContainer) {
      // Limpa a lista de técnicas
      const tecnicasList = document.getElementById("tecnicas-list");
      if (tecnicasList) {
        tecnicasList.innerHTML = '';
        console.log("Lista de técnicas limpa");
      }
      
      // Verifica se o botão de adicionar técnica já existe
      let addTecnicaBtn = document.getElementById("add-tecnica");
      
      // Se o botão não existir, vamos criá-lo
      if (!addTecnicaBtn) {
        console.log("Criando botão de adicionar técnica...");
        addTecnicaBtn = document.createElement("button");
        addTecnicaBtn.type = "button";
        addTecnicaBtn.id = "add-tecnica";
        addTecnicaBtn.className = "add-tecnica-btn btn btn-success";
        addTecnicaBtn.textContent = "+ Adicionar Técnica";
        
        // Adiciona o botão ao final do container de técnicas
        tecnicasContainer.appendChild(addTecnicaBtn);
        console.log("Botão de adicionar técnica criado e adicionado ao DOM");
      }
      
      // Garante que o container esteja visível
      tecnicasContainer.style.display = "block";
      console.log("Container de técnicas exibido");
      
      // Remove eventos antigos e adiciona novo evento
      const newBtn = addTecnicaBtn.cloneNode(true);
      addTecnicaBtn.parentNode.replaceChild(newBtn, addTecnicaBtn);
      
      // Adiciona o evento de clique
      newBtn.addEventListener("click", function() {
        console.log("Botão 'Adicionar Técnica' clicado (via selectUtensilio)");
        showTecnicasModal();
      });
      console.log("Event listener adicionado ao botão 'Adicionar Técnica'");
    } else {
      console.error("Elemento tecnicas-container não encontrado!");
    }
    
    // Fecha o modal de utensílios
    closeUtensiliosModal();
  }
  
  // Função para fechar o modal de utensílios
  function closeUtensiliosModal() {
    document.getElementById("utensilios-modal").style.display = "none";
  }
  
  // Função para fechar o modal de técnicas
  function closeModal() {
    document.getElementById("tecnicas-modal").style.display = "none";
  }
  
  // Função para exibir o modal de técnicas - Definida como propriedade global para acessibilidade
  function showTecnicasModal() {
    console.log("Iniciando a função showTecnicasModal");
    
    const selectedUtensilio = document.getElementById("utensilio-nome-display")?.textContent;
    console.log("Utensílio selecionado:", selectedUtensilio);
    
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
    
    tecnicasLista.innerHTML = "<p>Carregando técnicas...</p>";
    
    console.log("Iniciando fetch para utensil.json");
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
        tecnicasLista.innerHTML = "";
        
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
        tecnicasLista.innerHTML = "<p>Erro ao carregar técnicas: " + error.message + "</p>";
        alert('Erro ao carregar técnicas: ' + error.message);
      });
  }
  
  // Torna a função disponível globalmente para poder ser chamada em qualquer parte do código
  window.showTecnicasModal = showTecnicasModal;
  
  // Função para processar e adicionar técnicas ao grid
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
  
  // Função auxiliar para formatar o nome da categoria
  function formatarNomeCategoria(categoria) {
    // Converte snake_case para Título Formatado
    if (categoria === "tecnicas_ligeiras") return "Técnicas Ligeiras";
    if (categoria === "tecnicas_sagazes") return "Técnicas Sagazes";
    
    // Caso seja outra categoria, formata o texto
    return categoria
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
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

  // Função para adicionar a técnica ao utensílio
  function addTecnicaToUtensilio(tecnica, categoria) {
    console.log("Função addTecnicaToUtensilio chamada", tecnica, categoria);
    
    // Procura o elemento tecnicas-list
    const tecnicasContainer = document.getElementById("tecnicas-container");
    if (!tecnicasContainer) {
      console.error("Elemento tecnicas-container não encontrado!");
      alert("Erro: Não foi possível encontrar o container de técnicas. Tente novamente.");
      return;
    }
    
    // Garante que o tecnicas-list existe dentro do container
    let tecnicasList = tecnicasContainer.querySelector("#tecnicas-list");
    if (!tecnicasList) {
      console.log("Elemento tecnicas-list não encontrado! Criando um novo...");
      
      // Cria o elemento se não existir
      tecnicasList = document.createElement("div");
      tecnicasList.id = "tecnicas-list";
      
      // Adiciona após o título
      const titulo = tecnicasContainer.querySelector("h3");
      if (titulo) {
        titulo.after(tecnicasList);
      } else {
        // Se não houver título, adiciona no início do container
        tecnicasContainer.prepend(tecnicasList);
      }
    }
    
    // Verifica se a técnica já foi adicionada
    const tecnicasExistentes = tecnicasList.querySelectorAll(".tecnica-nome");
    console.log("Verificando entre", tecnicasExistentes.length, "técnicas existentes");
    
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
        <textarea class="tecnica-descricao" required readonly>${tecnica.descricao || ""}</textarea>
      </div>
      <div class="tecnica-controls">
        <button type="button" class="remove-tecnica-btn btn btn-danger">Remover Técnica</button>
      </div>
    `;
    
    // Adiciona a técnica à lista
    tecnicasList.appendChild(tecnicaItem);
    console.log("Técnica adicionada:", tecnica.nome);
    
    // Adiciona evento para remover a técnica
    const removeButton = tecnicaItem.querySelector(".remove-tecnica-btn");
    if (removeButton) {
      removeButton.addEventListener("click", function() {
        tecnicaItem.remove();
        console.log("Técnica removida:", tecnica.nome);
      });
    }
    
    // Mostra o container de técnicas caso esteja escondido
    tecnicasContainer.style.display = "block";
    console.log("Container de técnicas exibido");
  }

  // Função para adicionar parte ao monstro
  function addParte() {
    const partesList = document.getElementById("partes-list");
    
    // Cria o elemento para a parte
    const parteItem = document.createElement("div");
    parteItem.className = "parte-item";
    
    parteItem.innerHTML = `
      <div class="form-group">
        <label>Nome da Parte</label>
        <input type="text" class="parte-nome" required>
      </div>
      <div class="form-group">
        <label>Resistência</label>
        <input type="number" class="parte-resistencia" value="1" required>
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

  // Função para converter arquivo de imagem para Base64
  function convertImageToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  const editForm = document.getElementById("edit-character-form");
  if (editForm) {
    // Função para obter parâmetros da URL (local backup se a do common.js não estiver disponível)
    function getLocalQueryParam(param) {
      const params = new URLSearchParams(window.location.search);
      return params.get(param);
    }
    
    // Usa a função global ou a local
    const getParam = typeof getQueryParam !== 'undefined' ? getQueryParam : getLocalQueryParam;
    
    const index = getParam("index");
    const characters = JSON.parse(localStorage.getItem("characters") || "[]");
    
    if (index === null || isNaN(index) || index < 0 || index >= characters.length) {
      document.body.innerHTML = "<p>Personagem não encontrado.</p>";
      return;
    }

    // Configura a exibição das seções
    const utensilioSection = document.getElementById("utensilio-section");
    const partesSection = document.getElementById("partes-section");
    
    // Por padrão, mostra a seção de utensílio e esconde a seção de partes
    utensilioSection.style.display = "block";
    partesSection.style.display = "none";

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

    // Preenche os traços existentes
    const tracosList = document.getElementById("tracos-list");
    tracosList.innerHTML = ''; // Limpa a lista primeiro
    
    character.tracos.forEach(traco => {
      addTracoToCharacter(traco);
    });

    // Preenche o utensílio se existir
    if (character.utensilio) {
      document.getElementById("nomeUtensilio").value = character.utensilio.nome;
      document.getElementById("resistencia").value = character.utensilio.resistencia;
      document.getElementById("utensilio-nome-display").textContent = character.utensilio.nome;
      
      // Exibe os containers de utensílio
      document.getElementById("utensilio-details").style.display = "block";
      document.getElementById("tecnicas-container").style.display = "block";
      
      // Preenche as técnicas existentes
      const tecnicasContainer = document.getElementById("tecnicas-container");
      tecnicasContainer.innerHTML = ''; // Limpa o container primeiro
      
      character.utensilio.tecnicas.forEach(tecnica => {
        // Cria um novo item de técnica
        const tecnicaItem = document.createElement("div");
        tecnicaItem.className = "tecnica-item";
        
        // Cria o cabeçalho da técnica
        const tecnicaHeader = document.createElement("div");
        tecnicaHeader.className = "tecnica-header";
        
        // Nome da técnica
        const tecnicaNome = document.createElement("input");
        tecnicaNome.type = "text";
        tecnicaNome.className = "tecnica-nome";
        tecnicaNome.value = tecnica.nome;
        tecnicaNome.readOnly = true;
        
        // Categoria da técnica (oculta)
        const tecnicaCategoria = document.createElement("input");
        tecnicaCategoria.type = "hidden";
        tecnicaCategoria.className = "tecnica-categoria";
        tecnicaCategoria.value = tecnica.categoria || '';
        
        // Descrição da técnica
        const tecnicaDescricao = document.createElement("textarea");
        tecnicaDescricao.className = "tecnica-descricao";
        tecnicaDescricao.value = tecnica.descricao || "";
        tecnicaDescricao.readOnly = true;
        
        // Botão para remover a técnica
        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.className = "btn btn-sm btn-danger";
        removeButton.textContent = "Remover";
        removeButton.addEventListener("click", function() {
          tecnicasContainer.removeChild(tecnicaItem);
        });
        
        // Adiciona os elementos ao item
        tecnicaHeader.appendChild(tecnicaNome);
        tecnicaItem.appendChild(tecnicaHeader);
        tecnicaItem.appendChild(tecnicaCategoria);
        tecnicaItem.appendChild(tecnicaDescricao);
        tecnicaItem.appendChild(removeButton);
        
        // Adiciona o item ao container
        tecnicasContainer.appendChild(tecnicaItem);
      });
    }
    // Se houver partes, preenche-as também (para compatibilidade com personagens antigos)
    else if (character.partes) {
      // Preenche as partes
      const partesList = document.getElementById("partes-list");
      partesList.innerHTML = ''; // Limpa a lista primeiro
      
      // Mostra a seção de partes
      utensilioSection.style.display = "none";
      partesSection.style.display = "block";
      
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

      // Cria o objeto do personagem atualizado
      const updatedCharacter = {
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
        updatedCharacter.tracos.push({
          nome: tracoItem.querySelector(".traco-nome").value,
          descricao: tracoItem.querySelector(".traco-descricao").value
        });
      });

      // Verifica qual seção está visível (utensílio ou partes)
      if (document.getElementById("utensilio-section").style.display !== "none") {
        // Adiciona utensílio
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
            descricao: tecnicaItem.querySelector(".tecnica-descricao").value
          });
        });
      } else if (document.getElementById("partes-section").style.display !== "none") {
        // Adiciona partes (para compatibilidade com personagens antigos)
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

      // Atualiza o personagem no localStorage
      const characters = JSON.parse(localStorage.getItem("characters") || "[]");
      characters[index] = updatedCharacter;
      localStorage.setItem("characters", JSON.stringify(characters));

      // Redireciona para a página inicial
      window.location.href = "index.html";
    });

    // Adiciona eventos para os botões de cancelar e excluir
    document.getElementById("cancel-edit").addEventListener("click", function() {
      // Redireciona para a página inicial
      window.location.href = "index.html";
    });

    document.getElementById("delete-character").addEventListener("click", function() {
      if (confirm("Tem certeza que deseja excluir este personagem? Esta ação não pode ser desfeita.")) {
        // Remove o personagem do localStorage
        const characters = JSON.parse(localStorage.getItem("characters") || "[]");
        characters.splice(index, 1);
        localStorage.setItem("characters", JSON.stringify(characters));

        // Redireciona para a página inicial
        window.location.href = "index.html";
      }
    });
  }

  /* Eventos para os botões */
  
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
  
  // Garantindo que o botão de adicionar técnica funcione corretamente
  const addTecnicaBtn = document.getElementById("add-tecnica");
  if (addTecnicaBtn) {
    // Remove eventos antigos
    addTecnicaBtn.replaceWith(addTecnicaBtn.cloneNode(true));
    
    // Obtém a referência atualizada
    const updatedAddTecnicaBtn = document.getElementById("add-tecnica");
    
    // Adiciona o evento de clique
    updatedAddTecnicaBtn.addEventListener("click", function() {
      console.log("Botão 'Adicionar Técnica' clicado");
      showTecnicasModal();
    });
    console.log("Event listener adicionado ao botão 'Adicionar Técnica' (fixo)");
  } else {
    console.error("Botão 'add-tecnica' não encontrado!");
  }
  
  // Event listener para o botão de adicionar traço
  const addTracoBtn = document.getElementById("add-traco");
  if (addTracoBtn) {
    addTracoBtn.addEventListener("click", function() {
      console.log("Botão 'Adicionar Traço' clicado");
      showTracosModal();
    });
    console.log("Event listener adicionado ao botão 'Adicionar Traço'");
  } else {
    console.error("Botão 'add-traco' não encontrado!");
  }
  
  // Event listener para o botão de adicionar parte
  const addParteBtn = document.getElementById("add-parte");
  if (addParteBtn) {
    addParteBtn.addEventListener("click", function() {
      console.log("Botão 'Adicionar Parte' clicado");
      addParte();
    });
    console.log("Event listener adicionado ao botão 'Adicionar Parte'");
  }
  
  // Event listeners para os botões de fechar os modais
  document.querySelectorAll(".modal .close").forEach(button => {
    button.addEventListener("click", function() {
      this.closest(".modal").style.display = "none";
    });
  });
  
  // Clique fora do modal também fecha
  window.addEventListener("click", function(event) {
    if (event.target.classList.contains("modal")) {
      event.target.style.display = "none";
    }
  });

  // Função auxiliar para garantir que o botão de adicionar técnicas esteja visível
  function mostrarBotaoAddTecnica() {
    console.log("Tentando mostrar o botão de adicionar técnicas");
    
    // Garante que o container de técnicas esteja visível
    const tecnicasContainer = document.getElementById("tecnicas-container");
    if (tecnicasContainer) {
      // Remove qualquer estilo inline que possa estar escondendo o container
      tecnicasContainer.removeAttribute("style");
      // Define explicitamente como visível
      tecnicasContainer.style.display = "block";
      
      // Garante que o botão esteja visível e habilitado
      const addTecnicaBtn = document.getElementById("add-tecnica");
      if (addTecnicaBtn) {
        addTecnicaBtn.style.display = "block";
        addTecnicaBtn.disabled = false;
        addTecnicaBtn.classList.add("btn", "btn-success");
        console.log("Botão de adicionar técnica configurado para ser visível");
        
        // Adiciona o event listener novamente para garantir
        addTecnicaBtn.addEventListener("click", function() {
          console.log("Botão 'Adicionar Técnica' clicado (via mostrarBotaoAddTecnica)");
          showTecnicasModal();
        });
      } else {
        console.error("Botão add-tecnica não encontrado em mostrarBotaoAddTecnica!");
      }
    } else {
      console.error("Container de técnicas não encontrado!");
    }
  }

  // Verifica se o utensílio já está selecionado
  const utensilioNomeDisplay = document.getElementById("utensilio-nome-display");
  if (utensilioNomeDisplay && utensilioNomeDisplay.textContent) {
    console.log("Utensílio já selecionado:", utensilioNomeDisplay.textContent);
    
    // Força a exibição do container de técnicas
    const tecnicasContainer = document.getElementById("tecnicas-container");
    if (tecnicasContainer) {
      // Remove o estilo inline que esconde o container
      tecnicasContainer.removeAttribute("style");
      // Força a exibição
      tecnicasContainer.style.display = "block";
      console.log("Container de técnicas forçado a exibir");
    }
  }
  
  // Chama a função para garantir que o botão de adicionar técnicas esteja visível
  mostrarBotaoAddTecnica();
});

// Função para carregar dados do personagem no formulário
function carregarDadosPersonagem() {
  console.log("Carregando dados do personagem...");
  
  // Função para obter parâmetros da URL (local backup se a do common.js não estiver disponível)
  function getLocalQueryParam(param) {
    const params = new URLSearchParams(window.location.search);
    return params.get(param);
  }
  
  // Usa a função global ou a local
  const getParam = typeof getQueryParam !== 'undefined' ? getQueryParam : getLocalQueryParam;
  
  const index = getParam("index");
  const characters = JSON.parse(localStorage.getItem("characters") || "[]");
  
  if (index === null || isNaN(index) || index < 0 || index >= characters.length) {
    document.body.innerHTML = "<p>Personagem não encontrado.</p>";
    return;
  }

  // Configura a exibição das seções
  const utensilioSection = document.getElementById("utensilio-section");
  const partesSection = document.getElementById("partes-section");
  
  // Por padrão, mostra a seção de utensílio e esconde a seção de partes
  utensilioSection.style.display = "block";
  partesSection.style.display = "none";

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

  // Preenche os traços existentes
  const tracosList = document.getElementById("tracos-list");
  tracosList.innerHTML = ''; // Limpa a lista primeiro
  
  character.tracos.forEach(traco => {
    addTracoToCharacter(traco);
  });

  // Preenche o utensílio se existir
  if (character.utensilio) {
    console.log("Personagem possui utensílio:", character.utensilio.nome);
    document.getElementById("nomeUtensilio").value = character.utensilio.nome;
    document.getElementById("resistencia").value = character.utensilio.resistencia;
    document.getElementById("utensilio-nome-display").textContent = character.utensilio.nome;
    
    // Exibe os containers de utensílio
    document.getElementById("utensilio-details").style.display = "block";
    
    // Obtém o container de técnicas
    const tecnicasContainer = document.getElementById("tecnicas-container");
    
    // Salva o botão de adicionar técnica, se existir
    const originalButton = document.getElementById("add-tecnica");
    
    // Cria elemento para a lista de técnicas
    const tecnicasList = document.createElement("div");
    tecnicasList.id = "tecnicas-list";
    
    // Limpa o conteúdo do container de técnicas preservando sua estrutura
    tecnicasContainer.innerHTML = '<h3>Técnicas do Utensílio</h3>';
    
    // Adiciona a lista de técnicas ao container
    tecnicasContainer.appendChild(tecnicasList);
    
    // Adiciona técnicas existentes à lista
    if (character.utensilio.tecnicas && character.utensilio.tecnicas.length > 0) {
      console.log("Carregando", character.utensilio.tecnicas.length, "técnicas");
      character.utensilio.tecnicas.forEach(tecnica => {
        addTecnicaToUtensilio(tecnica, tecnica.categoria || "");
      });
    } else {
      console.log("Utensílio não possui técnicas");
    }
    
    // Cria novo botão de adicionar técnica
    const addTecnicaBtn = document.createElement("button");
    addTecnicaBtn.type = "button";
    addTecnicaBtn.id = "add-tecnica";
    addTecnicaBtn.className = "add-tecnica-btn btn btn-success";
    addTecnicaBtn.textContent = "+ Adicionar Técnica";
    
    // Adiciona evento ao botão
    addTecnicaBtn.addEventListener("click", function() {
      console.log("Botão 'Adicionar Técnica' clicado (carregamento inicial)");
      showTecnicasModal();
    });
    
    // Adiciona o botão ao container
    tecnicasContainer.appendChild(addTecnicaBtn);
    
    // Exibe o container de técnicas
    tecnicasContainer.style.display = "block";
    console.log("Container de técnicas exibido no carregamento inicial");
  }
  
  console.log("Dados do personagem carregados com sucesso");
}

// Função de inicialização para garantir que o botão de técnicas sempre apareça
function inicializarBotaoTecnica() {
  console.log("Inicializando botão de técnicas...");
  
  // Definição local da função showTecnicasModal para evitar problemas de escopo
  function criarEventoClick(btn) {
    btn.addEventListener("click", function() {
      console.log("Botão 'Adicionar Técnica' clicado (inicialização)");
      // Usa a função window.showTecnicasModal para garantir que estamos acessando a função global
      if (typeof window.showTecnicasModal === 'function') {
        window.showTecnicasModal();
      } else {
        console.error("Função showTecnicasModal não encontrada no escopo global!");
        alert("Erro ao mostrar o modal de técnicas. Por favor, tente novamente.");
      }
    });
  }
  
  // Verifica se o utensílio já está selecionado
  const utensilioNomeDisplay = document.getElementById("utensilio-nome-display");
  
  if (utensilioNomeDisplay && utensilioNomeDisplay.textContent) {
    console.log("Utensílio já selecionado:", utensilioNomeDisplay.textContent);
    
    // Obtém ou cria o container de técnicas
    let tecnicasContainer = document.getElementById("tecnicas-container");
    
    if (!tecnicasContainer) {
      console.log("Container de técnicas não encontrado, criando um novo...");
      
      tecnicasContainer = document.createElement("div");
      tecnicasContainer.id = "tecnicas-container";
      
      const utensilioSection = document.getElementById("utensilio-section");
      if (utensilioSection) {
        utensilioSection.appendChild(tecnicasContainer);
      }
    }
    
    // Garante que há um título no container
    if (!tecnicasContainer.querySelector("h3")) {
      const titulo = document.createElement("h3");
      titulo.textContent = "Técnicas do Utensílio";
      tecnicasContainer.appendChild(titulo);
    }
    
    // Obtém ou cria a lista de técnicas
    let tecnicasList = tecnicasContainer.querySelector("#tecnicas-list");
    
    if (!tecnicasList) {
      console.log("Lista de técnicas não encontrada, criando uma nova...");
      
      tecnicasList = document.createElement("div");
      tecnicasList.id = "tecnicas-list";
      tecnicasContainer.appendChild(tecnicasList);
    }
    
    // Remove qualquer botão de adicionar técnica existente
    const botaoExistente = tecnicasContainer.querySelector("#add-tecnica");
    if (botaoExistente) {
      botaoExistente.remove();
    }
    
    // Cria um novo botão de adicionar técnica
    const addTecnicaBtn = document.createElement("button");
    addTecnicaBtn.type = "button";
    addTecnicaBtn.id = "add-tecnica";
    addTecnicaBtn.className = "add-tecnica-btn btn btn-success";
    addTecnicaBtn.style.display = "block";
    addTecnicaBtn.textContent = "+ Adicionar Técnica";
    
    // Adiciona o evento usando a função auxiliar
    criarEventoClick(addTecnicaBtn);
    
    // Adiciona o botão ao container
    tecnicasContainer.appendChild(addTecnicaBtn);
    
    // Força a exibição do container
    tecnicasContainer.style.display = "block";
    
    console.log("Botão de adicionar técnica inicializado e exibido");
    return true;
  } else {
    console.log("Nenhum utensílio selecionado, botão de técnicas não será exibido");
    return false;
  }
}

// Chamada direta para inicializar o botão no carregamento da página
setTimeout(function() {
  console.log("Executando inicialização do botão de técnicas com delay...");
  inicializarBotaoTecnica();
}, 1000); // Um segundo de delay para garantir que tudo está carregado
