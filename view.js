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
    // Verificar se "Soltar o Bicho" está ativado
    const soltarBicho = document.getElementById('soltarBicho').checked;
    
    // Determinar quantidade de dados
    const qtdD6 = soltarBicho ? Math.max(0, valor - 1) : valor;
    const tipoDadoExtra = soltarBicho ? 'd20' : 'd8';
    
    // Configuração da animação
    const framesPorDado = 8; // Número de "frames" de animação para cada dado
    const duracaoFrameMs = 50; // Duração de cada frame em milissegundos
    let frameAtual = 0;
    const dadosAnimados = [];
    
    // Preparar estrutura para animação
    for (let i = 0; i < qtdD6; i++) {
      dadosAnimados.push({
        tipo: 'd6',
        valor: Math.floor(Math.random() * 6) + 1, // Valor inicial aleatório
        final: Math.floor(Math.random() * 6) + 1  // Valor final (resultado real)
      });
    }
    
    // Adicionar dado extra (d8 ou d20)
    const valorMaxDadoExtra = soltarBicho ? 20 : 8;
    dadosAnimados.push({
      tipo: tipoDadoExtra,
      valor: Math.floor(Math.random() * valorMaxDadoExtra) + 1, // Valor inicial
      final: Math.floor(Math.random() * valorMaxDadoExtra) + 1  // Valor final
    });
    
    // Exibir o toaster
    const toaster = document.getElementById('dados-toaster');
    const toasterBody = toaster.querySelector('.dados-toaster-body');
    const toasterTitle = toaster.querySelector('.dados-toaster-title');
    
    // Atualizar o título do toaster
    toasterTitle.textContent = `${estilo} (${qtdD6}d6 + 1${tipoDadoExtra})`;
    
    // Mostrar o toaster
    toaster.classList.add('show');
    
    // Função para atualizar a UI durante a animação
    function atualizarAnimacao() {
      // Criar HTML para a exibição dos dados
      let dadosHTML = `<div class="dados-container">`;
      
      // Adicionar cada dado à visualização
      dadosAnimados.forEach((dado) => {
        dadosHTML += `
          <div class="dado ${dado.tipo === 'd6' ? 'dado-d6' : (dado.tipo === 'd8' ? 'dado-d8' : 'dado-d20')}">
            ${dado.valor}
          </div>
        `;
      });
      
      dadosHTML += `</div>`;
      
      toasterBody.innerHTML = dadosHTML;
    }
    
    // Função para atualizar valores dos dados a cada frame
    function animarFrame() {
      frameAtual++;
      
      // Atualizar valor de cada dado
      dadosAnimados.forEach((dado) => {
        if (frameAtual < framesPorDado) {
          // Durante a animação, mostrar valores aleatórios
          dado.valor = dado.tipo === 'd6' ? 
            Math.floor(Math.random() * 6) + 1 : 
            Math.floor(Math.random() * (dado.tipo === 'd8' ? 8 : 20)) + 1;
        } else {
          // No último frame, mostrar o valor final
          dado.valor = dado.final;
        }
      });
      
      // Atualizar a UI
      atualizarAnimacao();
      
      // Continuar a animação ou finalizar
      if (frameAtual < framesPorDado) {
        setTimeout(animarFrame, duracaoFrameMs);
      } else {
        // Animação completa, verificar se temos um "grande sucesso"
        const ultimoDado = dadosAnimados[dadosAnimados.length - 1];
        const grandeSuccesso = (ultimoDado.tipo === 'd8' && ultimoDado.final === 8) || 
                              (ultimoDado.tipo === 'd20' && ultimoDado.final === 20);
        
        // Aplicar classe de grande sucesso se necessário
        if (grandeSuccesso) {
          toaster.classList.add('grande-sucesso');
        } else {
          toaster.classList.remove('grande-sucesso');
        }
      }
    }
    
    // Iniciar a animação
    atualizarAnimacao();
    setTimeout(animarFrame, duracaoFrameMs);
    
  };
});
