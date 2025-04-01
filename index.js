document.addEventListener("DOMContentLoaded", function() {
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
});
