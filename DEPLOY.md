# 🚀 Guia de Deploy - E-vortex Backend

Este guia apresenta as instruções para fazer o deploy da aplicação E-vortex usando Docker.

## 📋 Pré-requisitos

- Docker Engine 20.10+
- Docker Compose 2.0+
- Node.js 22+ (para desenvolvimento local)

## 🏗️ Estrutura da Aplicação

A aplicação foi reorganizada seguindo o padrão do NestJS:

```
src/
├── main.ts              # Ponto de entrada
├── app.module.ts        # Módulo principal
├── health.controller.ts # Health check
├── auth/                # Módulo de autenticação
├── sales/               # Módulo de vendas
├── customer/            # Módulo de clientes
├── entities/            # Entidades do banco
└── generics/            # Código compartilhado
```

## 🐳 Deploy com Docker

### 1. Construir a Imagem

```bash
docker build -t evortex:latest .
```

### 2. Iniciar os Serviços

```bash
docker-compose up -d
```

Este comando irá:
- Criar e iniciar o container da aplicação
- Conectar ao banco de dados em nuvem
- Configurar volumes para uploads

### 3. Verificar o Status

```bash
docker-compose ps
```

### 4. Visualizar Logs

```bash
# Logs de todos os serviços
docker-compose logs -f

# Logs apenas da aplicação
docker-compose logs -f app
```

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Database
DATA_BASE_USER=seu_usuario
DATA_BASE_PASSWORD=sua_senha
DATA_BASE_HOST=seu_host
DATA_BASE_PORT=5432
DATA_BASE_DB=nome_do_banco
DATA_BASE_CA=-----BEGIN CERTIFICATE-----...-----END CERTIFICATE-----

# JWT
JWT_PRIVATE_KEY=sua-chave-secreta-muito-segura-aqui
JWT_EXPIRES_IN=7d

# Node Environment
NODE_ENV=production
```

**⚠️ Importante:** Configure todas as variáveis de banco de dados conforme seu ambiente em nuvem.

### Portas

- **Aplicação**: `http://localhost:3000`
- **Swagger**: `http://localhost:3000/api`
- **Redoc**: `http://localhost:3000/docs`
- **Health Check**: `http://localhost:3000/health`

## 📝 Comandos Úteis

### Parar os Serviços

```bash
docker-compose stop
```

### Remover os Containers

```bash
docker-compose down
```

### Remover Containers e Volumes

```bash
docker-compose down -v
```

### Reconstruir a Imagem

```bash
docker-compose build --no-cache
```

### Reiniciar um Serviço Específico

```bash
docker-compose restart app
```

### Executar Comandos no Container

```bash
# Acessar o shell do container
docker-compose exec app sh

# Executar migrations (se necessário)
docker-compose exec app yarn migration:run
```

## 🧪 Testes

### Testar a Aplicação

```bash
# Health check
curl http://localhost:3000/health

# Swagger
open http://localhost:3000/api
```

## 🐛 Troubleshooting

### Erro de Conexão com o Banco

1. Verifique se todas as variáveis de banco estão corretas no arquivo `.env`:
   - `DATA_BASE_USER`
   - `DATA_BASE_PASSWORD`
   - `DATA_BASE_HOST`
   - `DATA_BASE_PORT`
   - `DATA_BASE_DB`
   - `DATA_BASE_CA` (certificado SSL)
2. Verifique se o banco de dados em nuvem está acessível
3. Verifique se o IP da aplicação está na whitelist do banco
4. Verifique os logs da aplicação:
   ```bash
   docker-compose logs -f app
   ```

### Erro de Permissão

Se houver problemas com permissões de arquivos:

```bash
# Dê permissão de execução ao script
chmod +x deploy.sh

# Ajuste permissões do diretório de uploads
chmod -R 755 uploads
```

### Limpar Cache do Docker

```bash
# Remover imagens não utilizadas
docker image prune

# Remover tudo (cuidado!)
docker system prune -a
```

## 🔄 Atualização

Para atualizar a aplicação:

```bash
# 1. Parar os serviços
docker-compose stop

# 2. Reconstruir a imagem
docker-compose build --no-cache

# 3. Iniciar novamente
docker-compose up -d

# 4. Verificar logs
docker-compose logs -f app
```

## 📊 Monitoramento

### Health Check

A aplicação expõe um endpoint de health check em `/health`:

```bash
curl http://localhost:3000/health
```

### Logs da Aplicação

Os logs são exibidos no console e podem ser visualizados com:

```bash
docker-compose logs -f app
```

## 🛡️ Segurança

### Recomendações

1. **Nunca** commite o arquivo `.env` no repositório
2. Use uma `JWT_PRIVATE_KEY` forte e única
3. Configure HTTPS em produção
4. Use secrets do Docker para variáveis sensíveis
5. Configure firewall adequadamente

### Usando Docker Secrets

```bash
# Criar secret
echo "sua-chave-secreta" | docker secret create jwt_private_key -

# Usar no docker-compose.yml
secrets:
  jwt_private_key:
    external: true
```

## 📦 Produção

### Build Otimizado

```bash
docker build -t evortex:latest --target production .
```

### Usar Docker Registry

```bash
# Tag da imagem
docker tag evortex:latest seu-registry.com/evortex:latest

# Push para o registry
docker push seu-registry.com/evortex:latest
```

## 🎯 Próximos Passos

1. Configure um reverse proxy (Nginx/Traefik)
2. Configure SSL/TLS
3. Implemente CI/CD
4. Configure monitoramento (Prometheus/Grafana)
5. Configure alertas
6. Configure backup do banco de dados em nuvem

## 📞 Suporte

Em caso de problemas:

1. Verifique os logs: `docker-compose logs -f`
2. Verifique o status: `docker-compose ps`
3. Consulte a documentação do NestJS
4. Abra uma issue no repositório

---

**Desenvolvido com ❤️ usando NestJS**

