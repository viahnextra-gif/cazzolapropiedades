# Cazzola Propiedades

Site imobiliário focado em venda/aluguel com backend Express + MongoDB, páginas EJS e API RESTful para imóveis e leads.

## Stack final
- **Backend:** Node.js 18+, Express 5, EJS para renderização server-side
- **Banco de dados (implementado):** MongoDB com Mongoose — NoSQL flexível para iterar rápido em esquemas de imóveis (campos opcionais, fotos, geolocalização futura)
- **Opção alternativa:** PostgreSQL + Prisma (ou Sequelize) — forte consistência relacional, fácil de usar com BI/SQL, porém exige migrações versionadas e ajustes de schema mais frequentes a cada mudança
- **Middlewares:** cors, morgan, express-validator para validação, dotenv para variáveis de ambiente
- **Frontend:** Bootstrap 5 + CSS customizado; templates EJS para home, listagem, detalhe, contato e formulário de cadastro de imóvel

### Banco escolhido e trade-offs
- **MongoDB (atual):** flexível para campos opcionais (fotos, amenidades, georreferência futura), fácil prototipação e inserts em massa (seed). Trade-off: joins/relatórios exigem agregações e índices bem pensados.
- **PostgreSQL (alternativa):** forte em consistência referencial e SQL avançado para BI. Trade-off: cada mudança de schema exige migrações, e o desenvolvimento inicial é menos flexível para atributos que mudam com frequência.

## Pré-requisitos
- Node.js 18+ e npm
- Instância MongoDB acessível e string de conexão válida

## Variáveis de ambiente
Crie um arquivo `.env` na raiz com:
```
MONGODB_URI=mongodb://usuario:senha@host:27017/cazzola
PORT=3000
CORS_ORIGIN=*
```

## Instalação
```
npm install
```

Para semear dados iniciais (3–5 imóveis de exemplo) após configurar a conexão:
```
npm run seed
```
Use `SEED_RESET=true` no `.env` ou no comando para limpar coleções antes de recriar os exemplos.

## Executar localmente
```
npm run dev
```
A aplicação roda em `http://localhost:3000` e expõe `/health` para verificação.

## Rotas principais
### Páginas (EJS)
- `GET /` — home com destaques do banco
- `GET /imoveis` — listagem com filtros básicos
- `GET /imoveis/:id` — detalhe do imóvel
- `GET /contato` + `POST /contato` — formulário de lead que salva no MongoDB
- `GET /admin/properties` — grid simples de imóveis
- `GET /admin/properties/new` + `POST /admin/properties/new` — cadastro de imóveis (sem autenticação nesta fase)
- `GET /admin/leads` — tabela de leads

### API REST (prefixo /api)
- `GET /api/imoveis` — lista imóveis com filtros por query string
- `GET /api/imoveis/:id` — detalhe
- `POST /api/imoveis` — cria imóvel (JSON)
- `PUT /api/imoveis/:id` — atualiza
- `DELETE /api/imoveis/:id` — remove
- `GET /api/leads` — lista leads com paginação simples (`page`, `limit`) e filtro por `status`
- `POST /api/leads` — cria lead a partir de formulários/integrações

## Testar rotas rapidamente
- Criar imóvel:
  ```bash
  curl -X POST http://localhost:3000/api/imoveis \
    -H "Content-Type: application/json" \
    -d '{"title":"Kitnet","type":"aluguel","status":"ativo","price":500,"address":"Rua A, 100","neighborhood":"Centro","city":"Asunción","bedrooms":1,"bathrooms":1,"area":35,"images":["https://via.placeholder.com/800"]}'
  ```
- Listar imóveis: `curl http://localhost:3000/api/imoveis?city=Asuncion`
- Criar lead manualmente: `curl -X POST http://localhost:3000/api/leads -H "Content-Type: application/json" -d '{"name":"Teste","email":"teste@example.com","interest":"compra"}'`

### Modelos
- **Imóvel:** título, tipo (venda/aluguel), status (ativo/inativo), preço, endereço, bairro, cidade, estado, quartos, banheiros, metragem, descrição, imagens[], timestamps
- **Lead:** nome, email, telefone, interesse (aluguel/compra/gestão), mensagem, status (novo/contatado/convertido), timestamps

## Estrutura de pastas
```
public/           # CSS, JS e assets
src/
  config/         # Conexão com banco
  controllers/    # Lógica das rotas
  models/         # Mongoose models
  routes/         # Rotas de páginas (web.js) e APIs (api.js)
  views/          # Templates EJS e partials
server.js         # Entrypoint Express
```

## Próximos passos sugeridos
- Adicionar autenticação/admin para CRUD de imóveis e visualização de leads
- Upload de imagens (S3/Cloudinary) e integração de mapas (Leaflet/Google Maps)
- Paginação e filtros avançados (amenidades, geofence) + indexação no Mongo
- Logs/observabilidade, testes automatizados e deploy containerizado
