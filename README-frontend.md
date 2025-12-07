# Protótipo estático do front-end — Cazzola Propiedades

Este diretório contém um protótipo visual (HTML + CSS + JS) para as páginas principais do site. Ele não depende do backend Express/Mongo e pode ser aberto direto no navegador ou via um servidor estático simples.

## Estrutura

```
frontend-prototype/
├── index.html             # Home com destaque, serviços e blog
├── listings.html          # Listagem com filtros (dados dummy em scripts.js)
├── property-detail.html   # Ficha do imóvel (carrega pelo parâmetro ?id=)
├── contact.html           # Formulário de contato/lead (console.log no submit)
├── styles.css             # Identidade visual (cores, layout, responsividade)
└── scripts.js             # Dados fictícios e lógica de renderização
```

## Como visualizar localmente

1. Instale um servidor estático leve (opcional). Exemplos:
   - `npm install -g serve` e depois `serve frontend-prototype`
   - ou `npm install -g live-server` e depois `live-server frontend-prototype`
   - ou `python -m http.server 8080` dentro da pasta `frontend-prototype`
2. Abra `http://localhost:3000` ou a porta informada pelo servidor (para `python`, use `http://localhost:8080`).
3. Também é possível abrir o `index.html` diretamente no navegador, mas a navegação entre páginas fica mais fluida via servidor.

## Como alterar os dados dummy

- O array `properties` em `frontend-prototype/scripts.js` centraliza as informações dos imóveis fictícios (título, tipo, preço, localização, metragem e galeria). Edite esse array para mudar o conteúdo visual rapidamente.
- A página de detalhe lê o parâmetro `?id=` da URL (`property-detail.html?id=p-101`). Se nenhum `id` for informado, o primeiro item do array é usado.
- O formulário de contato e o de interesse na ficha apenas fazem `console.log` do payload. Substitua esse trecho por um `fetch` para `/api/leads` quando o backend estiver pronto.

## Próximos passos de integração

- Substituir os dados dummy por chamadas à API real (REST ou GraphQL) e conectar as imagens ao CMS ou storage.
- Integrar o formulário a um endpoint real e adicionar feedback de sucesso/erro.
- Incluir mapa interativo na página de contato/detalhe com Google Maps ou Mapbox.
- Reutilizar este visual em um framework (React/Vue) ou migrar para partials no servidor (EJS/Pug) conforme a arquitetura definida.
