# Cazzola Propiedades

Site imobiliário focado em venda/aluguel com backend Express + MongoDB, páginas EJS e API RESTful para imóveis, leads e autenticação com roles.

---

## Stack final
- **Backend:** Node.js 18+, Express 5, EJS com layout do protótipo integrado
- **Banco de dados (implementado):** MongoDB com Mongoose — NoSQL flexível para iterar rápido em esquemas de imóveis com campos opcionais, fotos, geolocalização futura
- **Opção alternativa:** PostgreSQL + Prisma — forte consistência relacional e SQL avançado para BI, mas exige migrações versionadas a cada mudança de schema
- **Middlewares:** cors, morgan, express-validator para validação, dotenv para variáveis de ambiente, multer para upload de imagens (salvos em `public/uploads`)
- **Frontend:** CSS autoral baseado no protótipo; templates EJS para home, listagem com filtros, detalhe, contato e painel admin

---

## Banco escolhido e trade-offs
### ✔ MongoDB (atual)
Flexível, rápido para prototipação, ideal para atributos mutáveis (amenidades, fotos, georreferência). Permite seeds simples e schemas que evoluem sem migrações rígidas.

### ✔ PostgreSQL (alternativa)
Consistência relacional alta e SQL poderoso para BI. Trade-off: cada mudança exige migrações estruturadas e planejamento prévio de schema.

---

## Pré-requisitos
- Node.js 18+
- npm
- MongoDB (Atlas ou local) acessível

---

## Variáveis de ambiente
Copie `.env.example` → `.env` e preencha:

```env
MONGODB_URI=mongodb://usuario:senha@host:27017/cazzola
JWT_SECRET=sua-chave-secreta
PORT=3000
NODE_ENV=development
APP_NAME=Cazzola Propiedades
APP_URL=http://localhost:3000
DEFAULT_LAW=lgpd_br
DPO_EMAIL=dpo@example.com
```

- `MONGODB_URI`: string de conexão MongoDB (Atlas ou local)
- `JWT_SECRET`: chave para assinar tokens JWT (trocar em produção)
- `PORT`: porta do servidor Express
- `NODE_ENV`: ambiente (`development` ou `production`)
- `APP_NAME` / `APP_URL`: usados em logs/templates
- `DEFAULT_LAW` e `DPO_EMAIL`: parâmetros de conformidade/contato do DPO

---

## Como rodar localmente
1) Instale as dependências:
```bash
npm install
```
2) (Opcional) Popule imóveis de exemplo:
```bash
npm run seed
```
3) Inicie em modo desenvolvimento (nodemon):
```bash
npm run dev
```
O servidor sobe em `http://localhost:3000` (ou na porta definida em `PORT`) e expõe `/health` para verificação.

---

## Como fazer deploy no Railway
1. Conecte este repositório ao Railway e crie um serviço **Node.js app**.
2. Configure os comandos:
   - **Build:** `npm install`
   - **Start:** `npm start`
3. Em **Environment Variables**, defina:
   - `MONGODB_URI` (string do MongoDB Atlas)
   - `NODE_ENV=production`
   - `PORT=3000` (ou deixe Railway definir)
4. Deploy e teste a URL gerada (ex.: `https://seu-app.up.railway.app`).
> Dica: se precisar de dados de exemplo, rode `npm run seed` via console do Railway apenas uma vez.

---

## Rotas principais
### Páginas (EJS)
- `GET /` — home com destaques recentes
- `GET /properties` — listagem com filtros de categoria, operação, preço e cidade
- `GET /properties/:id` — detalhe do imóvel com galeria e mapa embed
- `GET /contact` + `POST /contact` — formulário de lead que grava no MongoDB
- `GET /admin` — atalho para `/admin/properties`
- `GET /admin/properties` — grid de imóveis
- `GET /admin/properties/new` + `POST /admin/properties` — cadastro com upload múltiplo (`images`) ou URLs separados
- `GET /admin/properties/edit/:id` + `POST /admin/properties/edit/:id` — edição
- `POST /admin/properties/delete/:id` — exclusão
- `GET /admin/leads` — tabela de leads

### API REST (prefixo /api)
- `GET /api/properties` — lista imóveis com filtros por query (`category`, `type`, `city`, `min`, `max`, `status`)
- `GET /api/properties/:id` — detalhe
- `POST /api/properties` — cria imóvel (JSON ou multipart com `images`)
- `PUT /api/properties/:id` — atualiza (JSON ou multipart)
- `DELETE /api/properties/:id` — remove
- `GET /api/leads` — lista leads com paginação simples (`page`, `limit`, `status`)
- `POST /api/leads` — cria lead a partir de formulários/integrações

### Autenticação (prefixo /auth)
- `POST /auth/register` — cria usuário com consentimento LGPD/Ley PY
- `POST /auth/login` — retorna `accessToken` e `refreshToken`
- `POST /auth/refresh` — gera novo par de tokens a partir de `refreshToken`
- `POST /auth/logout` — invalida o refresh token atual
- `GET /auth/me` — retorna o usuário autenticado (Bearer token)

---

## Testar rapidamente
- Criar imóvel (JSON puro):
```bash
curl -X POST http://localhost:3000/api/properties \
  -H "Content-Type: application/json" \
  -d '{"title":"Kitnet","type":"aluguel","category":"apartamento","status":"ativo","price":500,"address":"Rua A, 100","neighborhood":"Centro","city":"Asunción","bedrooms":1,"bathrooms":1,"area":35,"images":["https://via.placeholder.com/800"]}'
```
- Listar imóveis com filtro: `curl "http://localhost:3000/api/properties?city=Asuncion&category=apartamento"`
- Criar lead: `curl -X POST http://localhost:3000/api/leads -H "Content-Type: application/json" -d '{"name":"Teste","email":"teste@example.com","interest":"compra"}'`

---

## Estrutura de pastas (resumida)
```
public/           # CSS, JS e uploads
src/
  config/         # env, db e compliance
  controllers/    # lógica das rotas
  middleware/     # auth, validação, roles
  models/         # Mongoose models
  routes/         # rotas web/api/auth
  utils/          # utilidades (ex.: consentimento)
  views/          # templates EJS + partials
server.js         # shim de entrada -> src/server.js
```

---

## Próximos passos sugeridos
- Upload para S3/Cloudinary e integração de mapas (Leaflet/Google Maps)
- Paginação e filtros avançados + indexação no Mongo
- Logs/observabilidade, testes automatizados e deploy containerizado
