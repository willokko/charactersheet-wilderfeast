document.addEventListener("DOMContentLoaded", function() {
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
            <div class="soltar-bicho-container">
              <label class="soltar-bicho-checkbox">
                <input type="checkbox" id="soltarBicho"> Soltar o Bicho
              </label>
            </div>
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

          <!-- Utensílio (2/6) -->
          <div class="column large-column">
            <h3 class="column-title">🔧 Utensílio</h3>
            ${character.utensilio ? `
              <div class="tool-info">
                <p><strong>Nome:</strong> ${character.utensilio.nome}</p>
                <p><strong>Resistência:</strong> ${character.utensilio.resistencia}</p>
              </div>
              
              ${character.utensilio.tecnicas && character.utensilio.tecnicas.length > 0 ? `
                <h4 class="tecnicas-title">Técnicas do Utensílio</h4>
                <div class="traits-content">
                  ${character.utensilio.tecnicas.map(tecnica => `
                    <div class="trait-item tecnica-card">
                      <div class="tecnica-header">
                        <h4 class="trait-name">${tecnica.nome}</h4>
                        ${tecnica.detalhes ? `<span class="tecnica-tag">${tecnica.detalhes}</span>` : ''}
                        ${tecnica.categoria ? `<span class="tecnica-categoria-tag">${tecnica.categoria}</span>` : ''}
                      </div>
                      <p class="trait-description">${tecnica.descricao || ""}</p>
                    </div>
                  `).join('')}
                </div>
              ` : `<p>Este utensílio não possui técnicas.</p>`}
            ` : `<p>Este personagem não possui um utensílio.</p>`}
          </div>

          <!-- Traços (2/6) -->
          <div class="column large-column">
            <h3 class="column-title">🎭 Traços</h3>
            <div class="traits-content">
              ${character.tracos && character.tracos.length > 0 ? 
                character.tracos.map(traco => `
                  <div class="trait-item">
                    <h4 class="trait-name">${traco.nome}</h4>
                    <p class="trait-description">${traco.descricao}</p>
                  </div>
                `).join('') : '<p>Este personagem não possui traços.</p>'
              }
            </div>
          </div>
        </div>
      `;

      characterDetailsContainer.innerHTML = detailsHTML;
      
      // Configurar o contador de resistência logo após carregar os detalhes
      configureResistanceCounter(character);
    }
  }

  // Cria o elemento toaster para os resultados de dados
  if (!document.getElementById('dados-toaster')) {
    const toaster = document.createElement('div');
    toaster.id = 'dados-toaster';
    toaster.className = 'dados-toaster';
    toaster.innerHTML = `
      <div class="dados-toaster-content">
        <div class="dados-toaster-header">
          <span class="dados-toaster-title">Resultado dos Dados</span>
          <button class="dados-toaster-close" onclick="fecharToaster()">&times;</button>
        </div>
        <div class="dados-toaster-body"></div>
      </div>
    `;
    document.body.appendChild(toaster);
  }

  // Fechar o toaster quando o botão de fechar é clicado
  window.fecharToaster = function() {
    document.getElementById('dados-toaster').classList.remove('show');
  };

  // Configurar o contador de resistência
  function configureResistanceCounter(characterData) {
    const index = getQueryParam("index");
    if (index === null || isNaN(index)) return;
    
    const characters = JSON.parse(localStorage.getItem("characters") || "[]");
    if (index < 0 || index >= characters.length) return;
    
    const character = characterData || characters[index];
    
    // Elementos do contador de resistência
    const resistanceContainer = document.getElementById("resistance-container");
    const resistanceValue = document.getElementById("resistance-value");
    const resistanceMax = document.getElementById("resistance-max");
    const resistanceSlider = document.getElementById("resistance-slider");
    const healthBarFill = document.getElementById("health-bar-fill");
    const decreaseButton = document.getElementById("decrease-resistance");
    const increaseButton = document.getElementById("increase-resistance");
    
    if (!resistanceContainer || !resistanceValue || !resistanceMax || !resistanceSlider || !healthBarFill) return;
    
    // Configurar valores iniciais
    const maxResistance = 20;
    let currentResistance = character.resistenciaAtual !== undefined ? 
                           character.resistenciaAtual : maxResistance;
    
    // Atualizar elementos visuais
    resistanceValue.textContent = currentResistance;
    resistanceMax.textContent = maxResistance;
    resistanceSlider.max = maxResistance;
    resistanceSlider.value = currentResistance;
    
    // Atualizar a barra de saúde
    updateHealthBar(currentResistance, maxResistance);
    
    // Função para atualizar a resistência
    function updateResistance(newValue) {
      currentResistance = Math.max(0, Math.min(maxResistance, newValue));
      resistanceValue.textContent = currentResistance;
      resistanceSlider.value = currentResistance;
      
      // Atualizar a barra de saúde
      updateHealthBar(currentResistance, maxResistance);
      
      // Salvar a resistência atual no personagem
      character.resistenciaAtual = currentResistance;
      characters[index] = character;
      localStorage.setItem("characters", JSON.stringify(characters));
    }
    
    // Função para atualizar a barra de saúde
    function updateHealthBar(current, max) {
      // Calcular a porcentagem de saúde restante
      const percentage = (current / max) * 100;
      
      // Atualizar o estilo da barra de saúde
      healthBarFill.style.transform = `scaleX(${percentage / 100})`;
      
      // Adicionar ou remover classe para estado crítico
      if (percentage <= 25) {
        healthBarFill.parentElement.classList.add('health-critical');
      } else {
        healthBarFill.parentElement.classList.remove('health-critical');
      }
    }
    
    // Event listeners para os botões e o slider
    decreaseButton.addEventListener("click", function() {
      updateResistance(currentResistance - 1);
    });
    
    increaseButton.addEventListener("click", function() {
      updateResistance(currentResistance + 1);
    });
    
    resistanceSlider.addEventListener("input", function() {
      updateResistance(parseInt(this.value));
    });
  }
  
  // Função para rolar dados
  window.rolarDados = function(estilo, valor) {
    const numDados = valor;
    const resultado = [];
    let sucesso = 0;
    
    // Verificar se "Soltar o Bicho" está ativado
    const soltarBicho = document.getElementById('soltarBicho').checked;
    
    for (let i = 0; i < numDados; i++) {
      // Lançar o dado
      const dado = Math.floor(Math.random() * 6) + 1;
      resultado.push(dado);
      
      // Contar sucessos
      if (dado > 3) {
        sucesso++;
      }
      
      // Contar sucessos adicionais para "Soltar o Bicho"
      if (soltarBicho && dado === 6) {
        sucesso++;
      }
    }
    
    // Criar a mensagem
    const mensagem = `
      <p><strong>Estilo:</strong> ${estilo}</p>
      <p><strong>Dados:</strong> ${resultado.join(', ')}</p>
      <p><strong>Sucessos:</strong> ${sucesso}</p>
      ${soltarBicho ? '<p><strong>Soltar o Bicho:</strong> Ativado (Dados 6 contam como 2 sucessos)</p>' : ''}
    `;
    
    // Exibir o toaster
    const toaster = document.getElementById('dados-toaster');
    const toasterBody = toaster.querySelector('.dados-toaster-body');
    toasterBody.innerHTML = mensagem;
    toaster.classList.add('show');
  };
});
