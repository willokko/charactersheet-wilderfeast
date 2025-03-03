document.addEventListener("DOMContentLoaded", function() {

  // Função para obter parâmetros da URL
  function getQueryParam(param) {
    const params = new URLSearchParams(window.location.search);
    return params.get(param);
  }

  // Seleciona as seções onde os cards serão exibidos
  const charactersSection = document.getElementById("character-list");
  const monstersSection = document.getElementById("monster-list");

  // Recupera a lista de fichas (personagens e monstros) do localStorage
  const characters = JSON.parse(localStorage.getItem("characters") || "[]");

  /* ====================
      Página Inicial (index.html)
      ==================== */

  // Limpa as seções para evitar duplicações
  if (charactersSection) charactersSection.innerHTML = "";
  if (monstersSection) monstersSection.innerHTML = "";

  // Caso não haja nenhuma ficha cadastrada, exibe uma mensagem informativa
  if (characters.length === 0) {
    if (charactersSection) {
      charactersSection.innerHTML = "<p>Nenhum personagem ou monstro criado.</p>";
    }
  } else {
    // Percorre cada ficha (personagem ou monstro)
    characters.forEach((character, index) => {
      // Cria o container do card
      const card = document.createElement("div");
      card.className = "character-card";

      // Cria um link que direciona para a página de visualização (passando o index como parâmetro)
      const link = document.createElement("a");
      link.href = `view.html?index=${index}`;

      // Cria e configura a imagem do card
      const img = document.createElement("img");
      img.src = character.imagem;
      img.alt = character.nome;
      img.className = "character-image";
      link.appendChild(img);

      // Cria e configura o elemento com o nome da ficha
      const nameEl = document.createElement("h3");
      nameEl.textContent = character.nome;

      // Adiciona o link e o nome ao card
      card.appendChild(link);
      card.appendChild(nameEl);

      // Verifica o tipo da ficha e adiciona o card na seção correspondente
      if (character.tipo === "personagem") {
        if (charactersSection) charactersSection.appendChild(card);
      } else if (character.tipo === "monstro") {
        if (monstersSection) monstersSection.appendChild(card);
      }
    });
  }


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
    
    // Limpa a lista atual
    tracosLista.innerHTML = '';
    
    // Carrega os traços do JSON
    fetch('traits.json')
      .then(response => response.json())
      .then(tracos => {
        tracos.forEach(traco => {
          const tracoElement = document.createElement('div');
          tracoElement.className = 'traco-option';
          tracoElement.innerHTML = `
            <h3>${traco.nome}</h3>
            <p>${traco.descricao}</p>
          `;
          
          tracoElement.addEventListener('click', () => {
            addTracoToCharacter(traco);
            modal.style.display = "none";
          });
          
          tracosLista.appendChild(tracoElement);
        });
      });
    
    modal.style.display = "block";
  }

  // Função para adicionar o traço selecionado ao personagem
  function addTracoToCharacter(traco) {
    const tracosList = document.getElementById("tracos-list");
    
    // Verifica se o traço já foi adicionado
    const tracoExistente = Array.from(tracosList.getElementsByClassName("traco-nome"))
      .some(input => input.value === traco.nome);
      
    if (tracoExistente) {
      alert("Este traço já foi adicionado ao personagem!");
      return;
    }

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

  // Atualiza o evento do botão de adicionar traço
  document.getElementById("add-traco")?.addEventListener("click", showTracosModal);

  // Adiciona evento para fechar o modal
  document.querySelector(".close")?.addEventListener("click", () => {
    document.getElementById("tracos-modal").style.display = "none";
  });

  // Fecha o modal se clicar fora dele
  window.addEventListener("click", (event) => {
    const modal = document.getElementById("tracos-modal");
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

  // Função para adicionar parte
  function addParte() {
    const partesList = document.getElementById("partes-list");
    const parteItem = document.createElement("div");
    parteItem.className = "item-container parte-item";
    parteItem.innerHTML = `
      <div class="form-group">
        <label>Nome da Parte</label>
        <input type="text" class="item-nome parte-nome" required>
      </div>
      <div class="form-group">
        <label>Resistência</label>
        <input type="number" class="parte-resistencia" value="0" required>
      </div>
      <div class="form-group">
        <label>Descrição</label>
        <textarea class="item-descricao parte-descricao" required></textarea>
      </div>
      <div class="item-controls">
        <button type="button" class="remove-btn">Remover Parte</button>
      </div>
    `;

    partesList.appendChild(parteItem);

    parteItem.querySelector(".remove-btn").addEventListener("click", () => {
      parteItem.remove();
    });
  }

  // Adiciona eventos aos botões de adicionar
  document.getElementById("add-traco")?.addEventListener("click", showTracosModal);
  document.getElementById("add-parte")?.addEventListener("click", addParte);

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

/* ====================
   Página de Visualização (view.html)
   ==================== */
const characterDetailsContainer = document.getElementById("character-details");
if (characterDetailsContainer) {
  const index = getQueryParam("index");
  const characters = JSON.parse(localStorage.getItem("characters") || "[]");

  if (index === null || isNaN(index) || index < 0 || index >= characters.length) {
    characterDetailsContainer.innerHTML = "<p>Personagem não encontrado.</p>";
  } else {
    const character = characters[index];
    
    // Template HTML para a página de visualização
    const detailsHTML = `
      <!-- Cabeçalho Compacto -->
      <div class="compact-header">
        <img src="${character.imagem}" alt="${character.nome}" class="compact-image">
        <h2 class="compact-name">${character.nome}</h2>
      </div>

      <!-- Grid principal -->
      <div class="main-columns">
        <!-- Estilos (1/6) -->
        <div class="column small-column">
          <h3 class="column-title">🏋️ Estilos</h3>
          <div class="styles-grid">
            ${Object.entries(character.estilos).map(([key, value]) => 
              `<div class="style-item">
                <span class="style-label">${key}</span>
                <span class="style-value" onclick="rolarDados('${key}', ${value})">${value}</span>
              </div>`
            ).join('')}
          </div>
        </div>

        <!-- Habilidades (1/6) -->
        <div class="column small-column">
          <h3 class="column-title">⚡ Habilidades</h3>
          <div class="skills-grid">
            ${Object.entries(character.habilidades).map(([key, value]) => 
              `<div class="skill-item">
                <span class="skill-label">${key}</span>
                <span class="skill-value">${value}</span>
              </div>`
            ).join('')}
          </div>
        </div>

        <!-- Utensílio/Partes (2/6) -->
        <div class="column large-column">
          ${character.tipo === "personagem" ? `
            <h3 class="column-title">🔧 Utensílio</h3>
            <div class="tool-info">
              <p><strong>Nome:</strong> ${character.utensilio.nome}</p>
              <p><strong>Resistência:</strong> ${character.utensilio.resistencia}</p>
              <p><strong>Descrição:</strong> ${character.utensilio.descricao}</p>
            </div>
          ` : `
            <h3 class="column-title">🦾 Partes</h3>
            <div class="traits-content">
              ${character.partes.map(parte => `
                <div class="trait-item">
                  <h4 class="trait-name">${parte.nome} (Resistência: ${parte.resistencia})</h4>
                  <p class="trait-description">${parte.descricao}</p>
                </div>
              `).join('')}
            </div>
          `}
        </div>

        <!-- Traços (2/6) -->
        <div class="column large-column">
          <h3 class="column-title">🎭 Traços</h3>
          <div class="traits-content">
            ${character.tracos.map(traco => `
              <div class="trait-item">
                <h4 class="trait-name">${traco.nome}</h4>
                <p class="trait-description">${traco.descricao}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    characterDetailsContainer.innerHTML = detailsHTML;
  }
}

// Primeiro, vamos modificar o HTML do container de resultado
const resultadoDiv = document.getElementById('resultado-dados');
if (resultadoDiv) {
  resultadoDiv.innerHTML = `
    <div class="roll-options">
      <label class="soltar-bicho">
        <input type="checkbox" id="soltarBicho"> Soltar o Bicho
      </label>
    </div>
    <div class="roll-results"></div>
  `;
}

// Função para rolar dados atualizada
window.rolarDados = function(estilo, quantidade) {
  const soltarBicho = document.getElementById('soltarBicho').checked;
  const resultadoDiv = document.getElementById('resultado-dados');
  const resultArea = resultadoDiv.querySelector('.roll-results');
  
  // Gera os resultados dos d6
  const resultados = [];
  let total = 0;
  
  // Se "Soltar o Bicho" estiver marcado, remove 1 d6
  const qtdD6 = soltarBicho ? Math.max(0, quantidade - 1) : quantidade;
  
  // Rola os d6
  for (let i = 0; i < qtdD6; i++) {
    const resultado = Math.floor(Math.random() * 6) + 1;
    resultados.push({ valor: resultado, tipo: 'd6' });
    total += resultado;
  }
  
  // Rola o dado extra (d8 ou d20)
  const dadoExtra = soltarBicho ? 
    { valor: Math.floor(Math.random() * 20) + 1, tipo: 'd20' } :
    { valor: Math.floor(Math.random() * 8) + 1, tipo: 'd8' };
  
  resultados.push(dadoExtra);
  total += dadoExtra.valor;

  // Prepara o HTML para exibição
  resultArea.innerHTML = `
    <h4>${estilo} (${qtdD6}d6 + 1${dadoExtra.tipo})</h4>
    <div class="dados">
      ${resultados.map(r => `
        <span class="dado ${r.tipo === 'd6' ? 'dado-d6' : 
          (r.tipo === 'd8' ? 'dado-d8' : 'dado-d20')}">${r.valor}</span>
      `).join('')}
    </div>
    <div class="resultado-total">
      Total: ${total}
    </div>
  `;
  
  // Mostra o resultado com animação
  resultadoDiv.classList.remove('active');
  void resultadoDiv.offsetWidth; // Força um reflow para reiniciar a animação
  resultadoDiv.classList.add('active');
};

  // Sistema de abas
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');

  if (tabButtons.length > 0) {
    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Remove a classe active de todas as abas e conteúdos
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        // Adiciona a classe active na aba clicada
        button.classList.add('active');

        // Mostra o conteúdo correspondente
        const targetId = button.getAttribute('data-tab');
        const targetContent = document.getElementById(`${targetId}-section`);
        if (targetContent) {
          targetContent.classList.add('active');
        }
      });
    });
  }

  /* ====================
     Funcionalidades Globais de Importação/Exportação
     ==================== */
  // Exportar todos os personagens
  const exportAllButton = document.getElementById("export-characters");
  if (exportAllButton) {
    exportAllButton.addEventListener("click", function() {
      const characters = JSON.parse(localStorage.getItem("characters") || "[]");
      const blob = new Blob([JSON.stringify(characters, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "todos-personagens.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }

  // Importar personagens
  const importButton = document.getElementById("import-characters");
  const fileInput = document.getElementById("file-input");

  if (importButton && fileInput) {
    importButton.addEventListener("click", function() {
      fileInput.click();
    });
    
    fileInput.addEventListener("change", function(e) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = function(e) {
        try {
          const importedData = JSON.parse(e.target.result);
          
          // Verifica se é um array (múltiplos personagens) ou objeto único
          if (Array.isArray(importedData)) {
            const characters = JSON.parse(localStorage.getItem("characters") || "[]");
            characters.push(...importedData);
            localStorage.setItem("characters", JSON.stringify(characters));
          } else {
            const characters = JSON.parse(localStorage.getItem("characters") || "[]");
            characters.push(importedData);
            localStorage.setItem("characters", JSON.stringify(characters));
          }
          
          alert("Importação realizada com sucesso!");
          window.location.reload();
        } catch (error) {
          alert("Erro ao importar arquivo. Verifique se o formato está correto.");
        }
      };
      
      reader.readAsText(file);
    });
  }
});