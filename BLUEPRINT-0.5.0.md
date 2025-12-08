# Cazzola Propiedades — Blueprint Técnico Versão 0.5.0

## 1. Visão Geral  
A aplicação Cazzola Propiedades é uma imobiliária digital utilizando Node.js + Express + MongoDB + EJS.  
Esta versão define a organização estrutural do backend sem adicionar funcionalidades avançadas.

---

## 2. Estrutura Atual

- **Config:** conexão com MongoDB  
- **Models:** Property, Lead  
- **Controllers:** pageController, propertyController, leadController  
- **Routes:** web, api, validators  
- **Views:** páginas públicas e admin  

---

## 3. Fluxo do Sistema

### 3.1 Usuário Navegação Pública
- Home → lista 3 imóveis recentes
- /imoveis → listagem com filtros
- /imoveis/:id → página de detalhe
- /contato → captação de lead

### 3.2 Rotas Admin (sem autenticação ainda)
- Admin lista imóveis
- Criação de novos imóveis
- Visualização de leads

---

## 4. API REST

### 4.1 Endpoints de Propriedades  
| Método | Rota | Função |
|-------|------|--------|
| GET | /api/imoveis | lista imóveis |
| GET | /api/imoveis/:id | retorna imóvel |
| POST | /api/imoveis | cria imóvel |
| PUT | /api/imoveis/:id | atualiza imóvel |
| DELETE | /api/imoveis/:id | remove imóvel |

### 4.2 Endpoints de Leads  
| Método | Rota | Função |
|-------|------|--------|
| GET | /api/leads | lista leads |
| POST | /api/leads | cria lead |

---

## 5. Modelos

### 5.1 Property
Campos principais:  
- title, type (venda/aluguel), price  
- address, neighborhood, city, state  
- bedrooms, bathrooms, area  
- description, images[]  
- timestamps  
- virtual: fullLocation  

### 5.2 Lead
Campos principais:  
- name, email, phone  
- interest (aluguel/compra/gestao/outro)  
- message  
- status (novo/contatado/convertido)  
- timestamps  

---

## 6. Próximos Passos Obrigatórios (Fase 0.6)
1. Criar Autenticação Admin  
2. Painel Admin real (CRUD completo)  
3. Upload de imagens (Cloudinary ou S3)  
4. SEO e melhoria de views  
5. Paginação de imóveis  
6. Filtros avançados  

---

## 7. Status Atual
Código está funcional para:
- Criar e listar imóveis
- Criar e listar leads
- Renderizar páginas EJS
- Filtrar imóveis
- Estrutura MVC organizada

---

## 8. Observação Técnica
A versão atual é uma base sólida. A partir dela, podemos evoluir para:

✔ Dashboard imobiliário  
✔ API pública documentada  
✔ Integração com WhatsApp / Email  
✔ Multi-usuário (corretor / admin)  
✔ Exportação CSV  
✔ Integração com CRM  

---

**Blueprint gerado — Versão 0.5.0 concluída.**
