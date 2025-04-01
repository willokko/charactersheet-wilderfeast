// Funções utilitárias comuns a todas as páginas
document.addEventListener("DOMContentLoaded", function() {
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
          console.error("Erro ao importar dados:", error);
          alert("Erro ao importar dados. Verifique se o arquivo está no formato correto.");
        }
      };
      
      reader.readAsText(file);
    });
  }
});

// Função para obter parâmetros da URL
function getQueryParam(param) {
  const params = new URLSearchParams(window.location.search);
  return params.get(param);
}
