## E‑Vortex Back-end

API back-end (NestJS/TypeScript) para um ambiente de e‑commerce/marketplace. Centraliza operações de catálogo (produtos, categorias, variações, imagens), carrinho, favoritos e utilidades de armazenamento de arquivos, expondo endpoints REST documentados via OpenAPI/Swagger.

### Principais recursos
- **Produtos**: criação, consulta detalhada e listagem com paginação, busca e métricas básicas (avaliação média, total de avaliações, estoque).
- **Variações de produto**: gestão de variações (tipo, valor, SKU, preço adicional, estoque, ordenação).
- **Imagens de produto**: upload (com validação de tipo/tamanho), listagem e remoção; integração com um `StorageService` para salvar/servir arquivos.
- **Categorias**: CRUD completo com slug único, ordenação e hierarquia (categoria pai).
- **Carrinho de compras**: criação e recuperação por usuário ou sessão anônima; adicionar/atualizar/remover itens; cálculo de total considerando variações.
- **Favoritos**: adicionar/remover e listar produtos favoritados por usuário.
- **Listagem de produtos enriquecida**: cada item traz variações e imagens associadas para facilitar o consumo no front-end.

### Stack e arquitetura
- **NestJS (Node.js + TypeScript)** como framework de aplicação.
- **TypeORM** para mapeamento objeto‑relacional (banco relacional).
- **OpenAPI/Swagger** para documentação e tipos de resposta dos endpoints.
- **Docker** e instruções de deploy prontas para produção (ver `DEPLOY.md`).
- **StorageService** abstrato para persistência de imagens (ex.: S3, file system, etc.).

### Módulos e domínios
- `sales`:
  - Produtos, Categorias, Variações, Imagens
  - Carrinho e Itens do Carrinho
  - Favoritos
- `generics`:
  - `storage` (serviço de armazenamento de arquivos/imagens)
- `entities`:
  - Definições TypeORM para tabelas (ex.: `produtos`, `variacoes_produto`, `imagens_produto`, `categorias`, `carrinhos`, etc.).

### Rotas (visão geral)
- `GET /produtos` — lista produtos (pagina, limite, busca, categoria)
- `GET /produtos/:id` — obtém produto com variações e imagens
- `POST /produtos` — cria produto (regras de negócio aplicáveis)
- `POST /variacoes` / `PUT /variacoes/:id` / `DELETE /variacoes/:id`
- `POST /imagens/upload` / `GET /imagens/produto/:produtoId` / `DELETE /imagens/:id`
- `GET /categorias` / `POST /categorias` / `PUT /categorias/:id` / `DELETE /categorias/:id`
- `GET /carrinho` / `POST /carrinho/itens` / `PUT /carrinho/itens/:id` / `DELETE /carrinho/itens/:id`
- `POST /favoritos` / `DELETE /favoritos` / `GET /favoritos`

Observação: a lista acima é ilustrativa. Consulte a documentação Swagger da aplicação ou o código do controlador `sales.controller.ts` para detalhes de payloads e respostas.

### Como executar (resumo)
1. Configure variáveis de ambiente (.env) para banco e storage.
2. Instale dependências e rode o servidor de desenvolvimento (scripts padrão NestJS, por exemplo `npm run start:dev`).
3. Acesse a documentação Swagger na rota exposta pela aplicação (comumente `/api` ou `/docs`, conforme configuração).

### Deploy
O guia de deploy está em `DEPLOY.md`, incluindo:
- build da imagem Docker
- uso de Docker Compose
- estratégias para rebuild sem cache e atualização de serviços

 
 ### Segurança
 - **Autenticação por JWT (Bearer Token)**: tokens criados no registro/login e validados em rotas protegidas. Configuração via env: `JWT_PRIVATE_KEY` (segredo) e `JWT_EXPIRES_IN` (ex.: `7d`, `12h`). Documentado no Swagger (`ApiBearerAuth`).
 - **Autorização baseada em papéis (RBAC)**: uso de `@Roles(...)` em controladores e `RolesGuard` global para checagem de permissões (ex.: `vendedor`, `admin`). `JwtAuthGuard` valida o token e injeta o usuário na request.
 - **Hash de senhas com bcrypt**: senhas nunca são armazenadas em texto puro; são salvas como `senhaHash` utilizando `bcryptjs` (salt de 10 rounds). A autenticação compara a senha fornecida com o hash.
 - **Proteção de dados sensíveis**: campos de cartões são persistidos com hash (`numero_hash`, `cvv_hash`) usando `bcryptjs`.
 - **Rate limiting**: `ThrottlerGuard` aplicado globalmente para mitigar abuso de endpoints.
 - **Upload seguro**: validação de `mimetype` permitido (JPEG/PNG/WEBP) e limite de tamanho (5MB) para imagens de produto.
 

