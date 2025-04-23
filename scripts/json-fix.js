// Script para verificar e corrigir o arquivo JSON
const fs = require('fs');

try {
  // Tenta ler o arquivo
  const jsonString = fs.readFileSync('./utensil.json', 'utf8');
  
  console.log('Arquivo lido com sucesso.');
  
  try {
    // Tenta analisar o JSON
    const jsonData = JSON.parse(jsonString);
    console.log('JSON é válido!');
    
    // Salva o JSON formatado corretamente
    fs.writeFileSync('./utensil-fixed.json', JSON.stringify(jsonData, null, 2));
    console.log('JSON reformatado e salvo em utensil-fixed.json');
  } catch (parseError) {
    console.error('Erro ao analisar o JSON:', parseError.message);
    console.log('Posição do erro:', parseError.message.match(/position (\d+)/)?.[1]);
    
    // Se possível, mostra parte do JSON próximo ao erro
    if (parseError.message.includes('position')) {
      const pos = parseInt(parseError.message.match(/position (\d+)/)[1]);
      const start = Math.max(0, pos - 50);
      const end = Math.min(jsonString.length, pos + 50);
      console.log('Trecho com erro:', jsonString.substring(start, end));
    }
  }
} catch (readError) {
  console.error('Erro ao ler o arquivo:', readError.message);
}
