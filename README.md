# CharacterSheet-WilderFeast

Sistema de fichas de personagem para o jogo WilderFeast.

## Estrutura do Projeto

O projeto foi reorganizado em uma estrutura de diretórios mais semântica:

```
/
├── index.html                # Página principal (listagem de personagens)
├── styles/                   # Arquivos CSS
│   └── style.css             # Estilos globais da aplicação
├── scripts/                  # Arquivos JavaScript
│   ├── common.js             # Funções utilitárias comuns
│   ├── index.js              # Script da página principal
│   ├── create.js             # Script da página de criação
│   ├── edit.js               # Script da página de edição
│   ├── view.js               # Script da página de visualização
│   ├── script.js             # Scripts adicionais
│   └── json-fix.js           # Utilitário para correção de JSON
├── pages/                    # Páginas HTML secundárias
│   ├── create.html           # Página de criação de personagem
│   ├── edit.html             # Página de edição de personagem
│   ├── view.html             # Página de visualização de personagem
│   └── traits.html           # Página de traços
└── data/                     # Arquivos de dados
    ├── traits.json           # Dados dos traços
    └── utensil.json          # Dados dos utensílios
```

## Funcionalidades

- Listagem de personagens
- Criação de novos personagens
- Edição de personagens existentes
- Visualização detalhada de personagens
- Consulta de traços disponíveis
- Importação e exportação de personagens

## Observações Técnicas

- A aplicação utiliza localStorage para armazenar os dados dos personagens
- Os arquivos JSON (traits.json e utensil.json) contêm dados estáticos para traços e utensílios
- A interface é responsiva e adaptada para diferentes tamanhos de tela

## Problemas Conhecidos

- Na página de traços (traits.html), pode ocorrer um erro ao carregar os traços. Isso pode ser devido a problemas com o caminho do arquivo traits.json.

## Como Usar

1. Abra o arquivo `index.html` em um navegador web
2. Use o botão "Criar Personagem" para adicionar um novo personagem
3. Clique em um personagem existente para visualizar seus detalhes
4. Na página de visualização, use o botão "Editar" para modificar um personagem
5. Use os botões "Exportar" e "Importar" para salvar ou carregar personagens
