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
    const isMonstro = character.tipo === "monstro";
    
    // Elementos do contador de resistência
    const resistanceContainer = document.getElementById("resistance-container");
    const resistanceValue = document.getElementById("resistance-value");
    const resistanceMax = document.getElementById("resistance-max");
    const resistanceSlider = document.getElementById("resistance-slider");
    const healthBarFill = document.getElementById("health-bar-fill");
    const decreaseButton = document.getElementById("decrease-resistance");
    const increaseButton = document.getElementById("increase-resistance");
    
    if (!resistanceContainer || !resistanceValue || !resistanceMax || !resistanceSlider || !healthBarFill) return;
    
    // Configurar valores iniciais baseados no tipo do personagem
    const maxResistance = isMonstro ? 30 : 20;
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
      
      // Mudar a cor do texto baseado na resistência restante
      if (percentage <= 25) {
        resistanceValue.style.color = "#e74c3c"; // Vermelho para resistência crítica
        resistanceValue.style.textShadow = "0 0 8px rgba(231, 76, 60, 0.7)";
      } else if (percentage <= 50) {
        resistanceValue.style.color = "#e67e22"; // Laranja para resistência baixa
        resistanceValue.style.textShadow = "0 0 5px rgba(230, 126, 34, 0.5)";
      } else {
        resistanceValue.style.color = "#e9573f"; // Cor padrão
        resistanceValue.style.textShadow = "1px 1px 2px rgba(0, 0, 0, 0.7)";
      }
      
      // Efeito visual para resistência crítica
      if (percentage <= 10) {
        resistanceValue.classList.add("critical-health");
      } else {
        resistanceValue.classList.remove("critical-health");
      }
    }
    
    // Event listeners
    resistanceSlider.addEventListener("input", function() {
      updateResistance(parseInt(this.value));
    });
    
    decreaseButton.addEventListener("click", function() {
      updateResistance(currentResistance - 1);
    });
    
    increaseButton.addEventListener("click", function() {
      updateResistance(currentResistance + 1);
    });
  }
  
  // Inicializar contador de resistência após carregar a página
  setTimeout(function() {
    if (document.getElementById("resistance-container")) {
      configureResistanceCounter();
    }
    
    // Configuração do checkbox "Soltar o Bicho"
    const soltarBichoCheckbox = document.getElementById('soltarBicho');
    if (soltarBichoCheckbox) {
      const checkboxLabel = document.querySelector('.soltar-bicho-checkbox');
      
      // Atualiza o estado visual inicial
      if (soltarBichoCheckbox.checked) {
        checkboxLabel.classList.add('active');
      }
      
      // Adiciona evento de mudança para atualizar a classe visual
      soltarBichoCheckbox.addEventListener('change', function() {
        if (this.checked) {
          checkboxLabel.classList.add('active');
        } else {
          checkboxLabel.classList.remove('active');
        }
      });
    }
  }, 100);

  // Função para rolar dados atualizada
  window.rolarDados = function(estilo, quantidade) {
    const soltarBicho = document.getElementById('soltarBicho').checked;
    const toaster = document.getElementById('dados-toaster');
    const toasterBody = toaster.querySelector('.dados-toaster-body');
    
    // Atualiza visualmente o estado do label do checkbox
    const checkboxLabel = document.querySelector('.soltar-bicho-checkbox');
    if (soltarBicho) {
      checkboxLabel.classList.add('active');
    } else {
      checkboxLabel.classList.remove('active');
    }
    
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
    toasterBody.innerHTML = `
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
    
    // Mostra o toaster
    toaster.classList.add('show');
    
    // Configura para esconder após 5 segundos
    setTimeout(() => {
      toaster.classList.remove('show');
    }, 5000);
  };
});
