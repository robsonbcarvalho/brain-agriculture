# Rural Producers API

Este é um projeto NestJS para gerenciar o cadastro de produtores rurais, suas fazendas, culturas e safras. Ele utiliza TypeORM para mapeamento objeto-relacional e PostgreSQL como banco de dados. A API RESTful fornece endpoints para realizar operações CRUD (Create, Read, Update, Delete) nas entidades.

## Visão Geral

A aplicação permite:

*   Cadastrar produtores rurais com informações de CPF/CNPJ e nome.
*   Registrar fazendas (propriedades) vinculadas aos produtores, incluindo localização (cidade, estado) e áreas (total, agricultável, vegetação).
*   Gerenciar safras e culturas plantadas em cada fazenda ao longo dos anos.

## Tecnologias Utilizadas

*   [NestJS](https://nestjs.com/): Framework Node.js para construção de aplicações escaláveis e de fácil manutenção.
*   [TypeORM](https://typeorm.io/): ORM (Object-Relational Mapping) para TypeScript e JavaScript.
*   [PostgreSQL](https://www.postgresql.org/): Banco de dados relacional.
*   [Docker](https://www.docker.com/): Plataforma de containerização.
*   [Swagger](https://swagger.io/): Documentação da API.
*   [Jest](https://jestjs.io/): Framework de teste JavaScript.
*   [Winston](https://github.com/winstonjs/winston): Biblioteca de logging.
*   [Morgan](https://github.com/expressjs/morgan): Middleware para HTTP request logging.

## Pré-requisitos

*   [Node.js](https://nodejs.org/en/download/) (versão 18 ou superior)
*   [Docker](https://www.docker.com/get-started) (opcional, para execução em container)
*   [Docker Compose](https://docs.docker.com/compose/install/) (opcional, para execução em container)

## Configuração

1.  **Clone o repositório:**

    ```bash
    git https://github.com/robsonbcarvalho/brain-agriculture.git
    cd brain-agriculture
    ```

2.  **Copie o arquivo de exemplo de variáveis de ambiente:**

    ```bash
    copy .env.example .env
    ```

3.  **Configure as variáveis de ambiente:**

    Modifique a senha para o postgresql no arquivo `.env` criado:

    ```
    POSTGRES_PASSWORD=YOUR_PASSWORD

    **Importante:** Substitua o valor `YOUR_PASSWORD` pelo valor desejado para o seu ambiente.

4.  **Construa a imagem Docker:**

    ```bash
    docker-compose up --build
    ```

    *  Acesse a aplicação em `http://localhost:3000`

## Documentação da API

A documentação da API está disponível através do Swagger UI. Para acessá-la, execute a aplicação e abra o seguinte URL no seu navegador:
Use code with caution.
Markdown
http://localhost:3000/api
(Substitua `3000` pela porta em que a sua aplicação está rodando).

## Testes Unitários

Para executar os testes unitários, execute o seguinte comando:

```bash
npm run test
```

Para verificar a cobertura de testes, execute o seguinte comando:

```bash
npm run test:cov
```

A cobertura de testes deve ser alta para garantir a qualidade da aplicação. Os arquivos de módulo (arquivos .module.ts) e os arquivos de teste nos diretórios dto são ignorados no cálculo da cobertura para obter resultados mais precisos.

## Estrutura do Projeto
```
src/
  app.module.ts          # Módulo principal da aplicação
  main.ts                # Arquivo de entrada da aplicação
  config/               # Arquivos de configuração
  logger/               # Código relacionado ao logger personalizado
  interceptors/         # Interceptadores (ex: LoggingInterceptor)
  filters/              # Filtros de exceção (ex: QueryFailedExceptionFilter)
  producer/             # Módulo para gerenciar produtores
    producer.entity.ts    # Entidade Produtor
    producer.service.ts   # Serviço Produtor
    producer.controller.ts # Controlador Produtor
    dto/                 # DTOs (Data Transfer Objects)
      create-producer.dto.ts
      update-producer.dto.ts
    producer.module.ts    # Modulo Producer
    producer.controller.spec.ts # Testes unitários do Controller
    producer.service.spec.ts # Testes unitários do Service
  farm/                 # Módulo para gerenciar fazendas (estrutura similar ao producer)
  crop/                 # Módulo para gerenciar culturas (estrutura similar ao producer)
  state/                # Módulo para gerenciar estados (estrutura similar ao producer)
  city/                 # Módulo para gerenciar cidades (estrutura similar ao producer)
  season/               # Módulo para gerenciar safras (estrutura similar ao producer)
  planting/             # Módulo para gerenciar plantios (estrutura similar ao producer)
  migrations/           # Arquivos de migration do TypeORM
  validators/           # Validadores personalizados
    is-cpf-cnpj.validator.ts
    is-valid-area-sum.validator.ts
```

## Observabilidade
A aplicação utiliza as seguintes ferramentas e técnicas para observabilidade:

* __Logging__ centralizado: Winston é usado para criar um logger personalizado que permite configurar diferentes níveis de log e direcionar os logs para diferentes destinos.

* __Request logging__: Morgan é usado para registrar automaticamente informações sobre as requisições HTTP.

* __Interceptadores__: Interceptadores são usados para registrar automaticamente o tempo de execução dos métodos e a ocorrência de exceções.

* __Filtros de exceção__: Filtros de exceção são usados para tratar exceções de forma centralizada e retornar respostas HTTP apropriadas para o cliente.

### Próximos Passos
* Implementar autenticação e autorização.

* Adicionar paginação aos endpoints que retornam listas de dados.

* Implementar testes de integração.

* Configurar um sistema de monitoramento (Prometheus, Grafana) para monitorar o desempenho da aplicação em produção.

* Implementar rastreamento distribuído (Jaeger, Zipkin) para rastrear as requisições em ambientes de microsserviços.

* Gerenciar informações confidenciais.

## Contribuição
Contribuições são bem-vindas! Se você encontrar algum problema ou tiver alguma sugestão de melhoria, sinta-se à vontade para abrir uma issue ou enviar um pull request.

## License

[MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
