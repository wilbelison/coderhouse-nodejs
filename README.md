# Desafio Obrigatório: Servidor com Express

## Objetivo

Desenvolver um servidor utilizando Express que permita a consulta e manipulação de um arquivo de produtos, fornecendo uma API simples para acesso a esses dados.

## Requisitos

1. **Integração com ProductManager**:

   - Utilize a classe `ProductManager`, previamente implementada para gerenciar produtos com persistência em arquivo.
   - No arquivo principal `app.js`, importe a classe `ProductManager` e a utilize para criar os endpoints do servidor.
2. **Endpoints do Servidor**:

   - **GET /products**:
   - Retorna a lista de produtos presentes no arquivo.
   - Suporta um parâmetro de query opcional `?limit=` para limitar o número de produtos retornados.
   - Se `limit` não for especificado, todos os produtos serão retornados.
   - Se `limit` for fornecido, apenas o número especificado de produtos será retornado.
   - **GET /products/:pid**:
   - Retorna o produto com o ID especificado (`pid`), usando `req.params` para capturar o parâmetro.
   - Se o produto com o ID fornecido não existir, deve ser retornada uma mensagem de erro adequada.

## Dicas

- A classe `ProductManager` faz uso de Promises para leitura de arquivos; portanto, utilize `async/await` nos endpoints para lidar com as operações assíncronas de forma eficiente.
- Utilize um arquivo de produtos pré-existente, pois o foco deste desafio é a implementação dos endpoints de leitura (GET).

## Entrega

- Submeta o link para o repositório GitHub contendo o projeto completo.
  - Estrutura recomendada:
    - Pasta `src` contendo o arquivo `app.js` e o `ProductManager`.
    - `package.json` com as dependências e scripts necessários.
- **Não inclua** a pasta `node_modules` no repositório.

