document.addEventListener("DOMContentLoaded", function() {
  // Seleciona a seção onde os cards serão exibidos
  const charactersSection = document.getElementById("character-list");

  // Recupera a lista de fichas (personagens e monstros) do localStorage
  const characters = JSON.parse(localStorage.getItem("characters") || "[]");

  /* ====================
      Página Inicial (index.html)
      ==================== */

  // Limpa a seção para evitar duplicações
  if (charactersSection) charactersSection.innerHTML = "";

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
      nameEl.title = character.nome; // Adiciona tooltip para nomes longos

      // Adiciona o link e o nome ao card
      card.appendChild(link);
      card.appendChild(nameEl);

      // Adiciona o card na seção de personagens
      if (charactersSection) charactersSection.appendChild(card);
    });
  }

  // Configurar o botão de exportação
  const exportButton = document.getElementById("export-characters");
  if (exportButton) {
    exportButton.addEventListener("click", function() {
      if (characters.length === 0) {
        alert("Não há personagens para exportar.");
        return;
      }

      const dataStr = JSON.stringify(characters, null, 2);
      const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
      
      const exportFileName = "personagens_wilderfeast_" + new Date().toISOString().split("T")[0] + ".json";
      
      const linkElement = document.createElement("a");
      linkElement.setAttribute("href", dataUri);
      linkElement.setAttribute("download", exportFileName);
      linkElement.click();
    });
  }

  // Configurar o botão de importação
  const importButton = document.getElementById("import-characters");
  const fileInput = document.getElementById("file-input");
  
  if (importButton && fileInput) {
    importButton.addEventListener("click", function() {
      fileInput.click();
    });
    
    fileInput.addEventListener("change", function(e) {
      const file = e.target.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = function(e) {
        try {
          const importedData = JSON.parse(e.target.result);
          
          if (!Array.isArray(importedData)) {
            throw new Error("Formato inválido. Esperava um array.");
          }
          
          if (confirm(`Deseja importar ${importedData.length} personagem(ns)? Isso substituirá todos os personagens existentes.`)) {
            localStorage.setItem("characters", JSON.stringify(importedData));
            alert("Personagens importados com sucesso!");
            window.location.reload();
          }
        } catch (error) {
          alert("Erro ao importar dados: " + error.message);
        }
      };
      reader.readAsText(file);
    });
  }
});
