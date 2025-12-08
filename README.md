# Cazzola Propiedades

Plataforma imobiliária full-stack com Express, MongoDB e EJS: catálogo de imóveis com filtros, painel administrativo com CRUD, uploads de imagens, leads com consentimento LGPD/Ley PY e autenticação JWT.

---

## Stack
- **Runtime:** Node.js 18+
- **Framework:** Express 5 + EJS (SSR) com layout do protótipo integrado
- **Banco:** MongoDB + Mongoose (NoSQL flexível para atributos dinâmicos)
- **Upload:** Multer salvando em `public/uploads`
- **Middlewares:** morgan (logs), cors, express-validator, dotenv, autenticação JWT
- **Frontend:** CSS autoral em `public/css/site.css`, templates EJS em `src/views`

> Alternativa considerada: PostgreSQL + Prisma (consistência relacional e BI), mas com custo de migrações estruturadas.

---

## Estrutura de pastas
```
public/                 # CSS, JS e uploads
scripts/seed.js         # população inicial
server.js               # shim -> src/server.js
src/
  config/               # env, db, compliance, upload
  controllers/          # lógicas de página, imóveis, leads, auth
  middleware/           # auth JWT, roles, validação
  models/               # Property, Lead, User
  routes/               # web, api, auth
  utils/                # consentimento LGPD/PY
  views/                # templates EJS + partials + admin
```

---

## Variáveis de ambiente
Copie `.env.example` para `.env` e ajuste valores:
```
MONGODB_URI=mongodb+srv://SEU_USUARIO:SUA_SENHA@SEU_CLUSTER.mongodb.net/cazzola?retryWrites=true&w=majority
JWT_SECRET=sua-chave-secreta
PORT=3000
NODE_ENV=development
APP_NAME=Cazzola Propiedades
APP_URL=http://localhost:3000
DEFAULT_LAW=lgpd_br
DPO_EMAIL=dpo@example.com
```
- `MONGODB_URI`: string de conexão (Atlas/local)
- `JWT_SECRET`: chave para assinar tokens (troque em produção)
- `PORT`: porta de escuta (Railway pode definir automaticamente)
- `NODE_ENV`: ambiente (`development`/`production`)
- `APP_NAME`/`APP_URL`: usados em logs/templates
- `DEFAULT_LAW`/`DPO_EMAIL`: parâmetros de compliance e contato do DPO

---

## Modelos principais
- **Property**: título, tipo (venda/aluguel), categoria, status, preço, endereço/bairro/cidade, quartos, banheiros, área, descrição, imagens `[String]`, timestamps.
- **Lead**: nome, email, telefone, interesse, mensagem, propertyId opcional, status, timestamps.
- **User**: nome, email, telefone, senha hash, role (`admin`/`corretor`/`cliente`), status, consentimento LGPD/PY (aceito/data/versão/ip), favoritos `[ObjectId]`, documentos enviados, agenda, notificações, refresh tokens, timestamps.

---

## Rotas Web (EJS)
- `GET /` — home com destaques recentes
- `GET /properties` — listagem com filtros de tipo, categoria, cidade e faixa de preço
- `GET /properties/:id` — detalhe com galeria, mapa placeholder e CTA WhatsApp/contato
- `GET /contact` — formulário de contato; `POST /contact` cria lead
- `GET /admin` — atalho para `/admin/properties`
- `GET /admin/properties` — grid de imóveis com ações
- `GET /admin/properties/new` / `POST /admin/properties` — criação (upload múltiplo)
- `GET /admin/properties/edit/:id` / `POST /admin/properties/edit/:id` — edição
- `POST /admin/properties/delete/:id` — exclusão
- `GET /admin/leads` — listagem de leads

---

## API REST (prefixo /api)
- `GET /api/properties` — lista com filtros por query (`category`, `type`, `city`, `min`, `max`, `status`)
- `GET /api/properties/:id` — detalhe
- `POST /api/properties` — cria (JSON ou multipart `images`)
- `PUT /api/properties/:id` — atualiza (JSON/multipart)
- `DELETE /api/properties/:id` — remove
- `GET /api/leads` — lista com paginação simples (`page`, `limit`, `status`)
- `POST /api/leads` — cria lead

### Autenticação (prefixo /auth)
- `POST /auth/register` — cadastro com consentimento LGPD/PY
- `POST /auth/login` — retorna `accessToken` e `refreshToken`
- `POST /auth/refresh` — renova tokens
- `POST /auth/logout` — invalida o refresh token atual
- `GET /auth/me` — usuário autenticado (Bearer token)
- Middlewares: `authMiddleware` (JWT + refresh) e `checkRole('admin'|'corretor'|'cliente')`

---

## Como rodar localmente
1. Instale dependências: `npm install`
2. (Opcional) Popule dados de exemplo: `npm run seed`
3. Inicie o servidor: `npm run dev`
   - Disponível em `http://localhost:3000` (ou `PORT` definido) com `/health` para verificação

---

## Deploy no Railway
1. Conecte o repositório ao Railway e crie um serviço **Node.js**.
2. Comandos:
   - Build: `npm install`
   - Start: `npm start`
3. Variáveis de ambiente:
   - `MONGODB_URI` (Mongo Atlas)
   - `JWT_SECRET` (chave forte)
   - `NODE_ENV=production`
   - `PORT=3000` (ou deixe Railway definir)
4. Deploy e teste a URL gerada (ex.: `https://seu-app.up.railway.app`).
5. Caso precise de dados exemplo, rode `npm run seed` no console do Railway uma única vez.

---

## Exemplos rápidos de API
```bash
# Criar imóvel
curl -X POST http://localhost:3000/api/properties \
  -H "Content-Type: application/json" \
  -d '{"title":"Kitnet","type":"aluguel","category":"apartamento","status":"ativo","price":500,"address":"Rua A, 100","neighborhood":"Centro","city":"Asunción","bedrooms":1,"bathrooms":1,"area":35,"images":["https://via.placeholder.com/800"]}'

# Listar imóveis filtrando
curl "http://localhost:3000/api/properties?city=Asuncion&category=apartamento"

# Criar lead
curl -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" \
  -d '{"name":"Teste","email":"teste@example.com","interest":"compra"}'
```

---

## Próximos passos
- Armazenar uploads em S3/Cloudinary e adicionar mapas reais (Google/Leaflet)
- Paginação e filtros avançados com índices no MongoDB
- Logs/observabilidade, testes automatizados e deploy containerizado
