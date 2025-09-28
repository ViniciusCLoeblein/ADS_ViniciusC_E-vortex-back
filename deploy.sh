#!/bin/bash

rm -rf deploy/apps/$1/*

yarn start $1

docker-compose restart

echo "Deploy do app $1 concluído com sucesso!"