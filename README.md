# Estoque Mestre

## Backend
### Tecnologias utilizadas no backend
- Node.js
- Express
- Knex
- SQLite
- JWT
- Bcrypt

## Passos para executar o projeto backend
- Entrar na pasta backend
- Instalar o Nodejs na versão 18 ou superior
- Executar **npm install** na raiz do projeto
  - ```Instala as dependências do projeto```
- Criar o arquivo **.env** na raiz do projeto com as variáveis de ambiente. Existe um arquivo chamado **.env.example** que pode ser utilizado como base
  - ```O arquivo .env.example contém as variáveis de ambiente necessárias para o projeto```
- Executar **npx knex migrate:latest**
  - ````Cria o banco de dados e as tabelas````
- Executar **npx knex seed:run**
  - ```Popula o banco de dados. Mais especificamente as tabelas de usuários e produtos```
- E por fim, executar **npm run dev** para iniciar o servidor na porta 3001
  - ```O servidor estará disponível em http://localhost:3001```

## Frontend
### Tecnologias utilizadas no frontend
- Next.js
- Ant Design

## Passos para executar o projeto frontend

- Entrar na pasta frontend
- Instalar o Nodejs na versão 18 ou superior
- Executar **npm install** na raiz do projeto
  - ```Instala as dependências do projeto```

- E por fim, executar **npm run dev** para iniciar o projeto na porta 3000
  - ```O projeto estará disponível em http://localhost:3000```

## Testes
### Tecnologias utilizadas nos testes
- Jest
- Supertest

## Passos para executar os testes
- Entrar na pasta backend
- Executar **npm run test** na raiz da pasta backend
  - ```Executa os testes```
