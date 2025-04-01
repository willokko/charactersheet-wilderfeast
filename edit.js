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

    // Preenche os traços existentes
    const tracosList = document.getElementById("tracos-list");
    tracosList.innerHTML = ''; // Limpa a lista primeiro
    
    character.tracos.forEach(traco => {
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
    });

    // Preenche o utensílio ou partes
    if (character.tipo === "personagem") {
      document.getElementById("nomeUtensilio").value = character.utensilio.nome;
      document.getElementById("resistencia").value = character.utensilio.resistencia;
      document.getElementById("descricaoUtensilio").value = character.utensilio.descricao;
    }

    // Manipula o envio do formulário de edição
    editForm.addEventListener("submit", function(event) {
      event.preventDefault();

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
        tracos: [],
        utensilio: {
          nome: document.getElementById("nomeUtensilio").value,
          resistencia: parseInt(document.getElementById("resistencia").value) || 0,
          descricao: document.getElementById("descricaoUtensilio").value
        }
      };

      // Coleta todos os traços
      const tracosItems = document.getElementsByClassName("traco-item");
      Array.from(tracosItems).forEach(tracoItem => {
        updatedCharacter.tracos.push({
          nome: tracoItem.querySelector(".traco-nome").value,
          descricao: tracoItem.querySelector(".traco-descricao").value
        });
      });

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
        tracos.forEach(traco => {
          const tracoItem = document.createElement("div");
          tracoItem.className = "traco-modal-item";
          
          const tracoNome = document.createElement("h4");
          tracoNome.textContent = traco.nome;
          
          const tracoDescricao = document.createElement("p");
          tracoDescricao.textContent = traco.descricao;
          
          const addButton = document.createElement("button");
          addButton.textContent = "Adicionar";
          addButton.className = "btn btn-sm btn-success";
          addButton.addEventListener("click", function() {
            addTracoToCharacter(traco);
            closeModal();
          });
          
          tracoItem.appendChild(tracoNome);
          tracoItem.appendChild(tracoDescricao);
          tracoItem.appendChild(addButton);
          
          tracosLista.appendChild(tracoItem);
        });
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

  // Adiciona evento para o botão de adicionar traço
  document.getElementById("add-traco")?.addEventListener("click", showTracosModal);

  // Adiciona eventos para fechar o modal
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
});
