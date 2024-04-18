# Troque-agora API

Essa API contruída com NestJS fornece os serviços necessários para correto funcionamento da plataforma troque-agora.

## Instalação

Use um gerenciador de pacotes como [yarn](https://yarnpkg.com) ou [npm](https://www.npmjs.com) para instalar as dependências.

```bash
yarn install
```

## Iniciando o servidor

```bash
yarn start:dev
```

## Dependências externas

Para garantir o funcionamento da maior parte das rotas, essa API se comunica com quatro aplicações.

- PostgreSQL
- MongoDB 
- Google Firebase
- Keycloak

Todas essas dependências devem ser configuradas e adicionadas as devidas variáveis de ambiente para comunicação.

## Framework

[![Next][Next.js]][Next-url]

<!-- MARKDOWN LINKS & IMAGES -->
[Next.js]: https://nestjs.com/logo-small.ede75a6b.svg
[Next-url]: https://nestjs.com
