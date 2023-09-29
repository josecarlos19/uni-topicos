# Api Estoque Mestre

### Tecnologias utilizadas

- Node.js
- Express
- Knex
- SQLite
- JWT
- Bcrypt

## Passos para executar o projeto

- Instalar o Nodejs na versão 18.12.1
  - ```Acredito que a partir da versão 16 funcione corretamente```

- Executar **npm install** na raiz do projeto
  - ```Instala as dependências do projeto```
- Criar o arquivo **.env** na raiz do projeto com as variáveis de ambiente. Existe um arquivo chamado **.env.example** que pode ser utilizado como base
  - ```O arquivo .env.example contém as variáveis de ambiente necessárias para o projeto```
- Executar **npx knex migrate:latest**
  - ````Cria o banco de dados e as tabelas````
- Executar **npx knex seed:run**
  - ```Popula o banco de dados. Mais especificamente as tabelas de usuários e produtos```
- E por fim, executar **npm start** para iniciar o servidor na porta 3000
  - ```O servidor estará disponível em http://localhost:3000```
