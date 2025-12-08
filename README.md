# Cazzola Propiedades

Site imobiliário focado em venda/aluguel com backend Express + MongoDB, páginas EJS e API RESTful para imóveis e leads.

## Stack final
- **Backend:** Node.js 18+, Express 5, EJS com o layout do protótipo integrado
- **Banco de dados (implementado):** MongoDB com Mongoose — NoSQL flexível para iterar rápido em esquemas de imóveis (campos opcionais, fotos, geolocalização futura)
- **Opção alternativa:** PostgreSQL + Prisma (ou Sequelize) — forte consistência relacional, fácil de usar com BI/SQL, porém exige migrações versionadas e ajustes de schema mais frequentes a cada mudança
- **Middlewares:** cors, morgan, express-validator para validação, dotenv para variáveis de ambiente, multer para upload de imagens em disco (`public/uploads`)
- **Frontend:** CSS autoral baseado no protótipo estático; templates EJS para home, listagem com filtros, detalhe, contato e painel admin

### Banco escolhido e trade-offs
- **MongoDB (atual):** flexível para campos opcionais (fotos, amenidades, georreferência futura), fácil prototipação e inserts em massa (seed). Trade-off: joins/relatórios exigem agregações e índices bem pensados.
- **PostgreSQL (alternativa):** forte em consistência referencial e SQL avançado para BI. Trade-off: cada mudança de schema exige migrações, e o desenvolvimento inicial é menos flexível para atributos que mudam com frequência.

## Pré-requisitos
- Node.js 18+ e npm
- Instância MongoDB acessível e string de conexão válida

## Variáveis de ambiente
1. Copie `.env.example` para `.env`.
2. Preencha `MONGODB_URI` com sua string do Mongo Atlas ou instância própria.

As variáveis padrão são:
```
MONGODB_URI=mongodb://usuario:senha@host:27017/cazzola
JWT_SECRET=sua-chave-secreta
PORT=3000
NODE_ENV=development
APP_NAME=Cazzola Propiedades
APP_URL=http://localhost:3000
DEFAULT_LAW=lgpd_br
DPO_EMAIL=dpo@example.com
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
```bash
npm run dev
```
O servidor inicia em `http://localhost:3000` (ou na porta definida em `PORT`) e expõe `/health` para verificação rápida.

## Deploy no Railway (Node.js)
1. Faça fork ou conecte este repositório no Railway.
2. Crie um novo serviço “Node.js app”.
3. Configure os comandos:
   - **Build:** `npm install`
   - **Start:** `npm start`
4. Em **Environment Variables**, defina:
   - `MONGODB_URI` — string do MongoDB Atlas
   - `NODE_ENV=production`
   - `PORT=3000` (ou deixe o valor padrão do Railway)
5. Faça o deploy e teste a URL gerada (ex.: https://seu-app.up.railway.app).

> Dica: se usar seed em produção, execute manualmente `npm run seed` em um deploy de console, apenas uma vez.

## Rotas principais
### Páginas (EJS)
- `GET /` — home com destaques recentes
- `GET /properties` — listagem com filtros de categoria (casa/apartamento/terreno/comercial), operação (venda/aluguel), preço e cidade
- `GET /properties/:id` — detalhe do imóvel com galeria e mapa embed
- `GET /contact` + `POST /contact` — formulário de lead que grava no MongoDB
- `GET /admin` — atalho para `/admin/properties`
- `GET /admin/properties` — grid de imóveis
- `GET /admin/properties/new` + `POST /admin/properties` — cadastro com upload (campo `images` múltiplo ou `imageUrls` separados por vírgula)
- `GET /admin/properties/edit/:id` + `POST /admin/properties/edit/:id` — edição e anexos adicionais
- `POST /admin/properties/delete/:id` — exclusão
- `GET /admin/leads` — tabela de leads

### API REST (prefixo /api)
- `GET /api/properties` — lista imóveis com filtros por query string (`category`, `type`, `city`, `min`, `max`, `status`)
- `GET /api/properties/:id` — detalhe
- `POST /api/properties` — cria imóvel (JSON ou multipart com campo `images` para upload)
- `PUT /api/properties/:id` — atualiza (JSON ou multipart)
- `DELETE /api/properties/:id` — remove
- `GET /api/leads` — lista leads com paginação simples (`page`, `limit`) e filtro por `status`
- `POST /api/leads` — cria lead a partir de formulários/integrações

### Autenticação (prefixo /auth)
- `POST /auth/register` — cria usuário com consentimento LGPD/Ley PY
- `POST /auth/login` — retorna `accessToken` e `refreshToken`
- `POST /auth/refresh` — gera novo par de tokens a partir de `refreshToken`
- `POST /auth/logout` — invalida o refresh token atual
- `GET /auth/me` — retorna o usuário autenticado (requer Bearer token)

## Testar rotas rapidamente
- Criar imóvel (JSON puro):
  ```bash
  curl -X POST http://localhost:3000/api/properties \
    -H "Content-Type: application/json" \
    -d '{"title":"Kitnet","type":"aluguel","category":"apartamento","status":"ativo","price":500,"address":"Rua A, 100","neighborhood":"Centro","city":"Asunción","bedrooms":1,"bathrooms":1,"area":35,"images":["https://via.placeholder.com/800"]}'
  ```
- Listar imóveis: `curl http://localhost:3000/api/properties?city=Asuncion&category=apartamento`
- Criar lead manualmente: `curl -X POST http://localhost:3000/api/leads -H "Content-Type: application/json" -d '{"name":"Teste","email":"teste@example.com","interest":"compra"}'`

### Modelos
- **Imóvel:** título, tipo (venda/aluguel), categoria (casa/apartamento/terreno/comercial), status (ativo/inativo), preço, endereço, bairro, cidade, estado, quartos, banheiros, metragem, descrição, imagens[], mapUrl, timestamps
- **Lead:** nome, email, telefone, interesse (aluguel/compra/gestão), mensagem, imóvel associado (opcional), status (novo/contatado/convertido), timestamps

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
- Upload de imagens (S3/Cloudinary) e integração de mapas (Leaflet/Google Maps)
- Paginação e filtros avançados (amenidades, geofence) + indexação no Mongo
- Logs/observabilidade, testes automatizados e deploy containerizado
