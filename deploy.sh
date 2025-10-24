#!/bin/bash

echo "🚀 Iniciando deploy do E-vortex..."

# Verificar se o Docker está rodando
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker não está rodando. Por favor, inicie o Docker primeiro."
    exit 1
fi

# Verificar se existe arquivo .env
if [ ! -f .env ]; then
    echo "⚠️  Arquivo .env não encontrado!"
    echo "📝 Criando arquivo .env a partir do .env.example..."
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "✅ Arquivo .env criado. Por favor, configure as variáveis de ambiente."
    else
        echo "❌ Arquivo .env.example não encontrado."
        exit 1
    fi
fi

# Parar containers existentes
echo "🛑 Parando containers existentes..."
docker-compose down

# Reconstruir as imagens
echo "🔨 Construindo imagens..."
docker-compose build --no-cache

# Iniciar os serviços
echo "▶️  Iniciando serviços..."
docker-compose up -d

# Aguardar serviços iniciarem
echo "⏳ Aguardando serviços iniciarem..."
sleep 10

# Verificar status
echo "📊 Verificando status dos serviços..."
docker-compose ps

# Verificar health check
echo "🏥 Verificando health check..."
sleep 5
curl -f http://localhost:3000/health > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Deploy concluído com sucesso!"
    echo ""
    echo "🌐 Aplicação disponível em: http://localhost:3000"
    echo "📚 Swagger disponível em: http://localhost:3000/api"
    echo "📖 Redoc disponível em: http://localhost:3000/docs"
    echo ""
else
    echo "⚠️  Health check falhou. Verifique os logs com: docker-compose logs -f app"
fi