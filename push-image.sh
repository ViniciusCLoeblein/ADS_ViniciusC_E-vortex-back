#!/bin/bash
error() {
    if [ $? != 0 ]; then
        echo "Erro ao executar o comando!"
        exit 122
    fi
}

build() {
    echo "=> Construindo imagem: ${1} com app: ${2}"
    docker build . -t ${1} --build-arg APP_NAME=${2}
    error
    echo "=> Imagem construída com sucesso: ${1}"
}

tag() {
    echo "=> Criando tag para imagem: ${1}"
    docker tag ${1} ${1}
    error
    echo "=> Tag criada com sucesso: ${1}"
}

if [ $# -ne 2 ]; then
    echo "Uso: $0 <nome-imagem> <nome-app>"
    exit 1
fi

build ${1} ${2}
tag ${1}

echo "Processo finalizado com sucesso!"
exit 0