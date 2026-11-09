# vDrive API

API REST desenvolvida em **Node.js** com **TypeScript** para gerenciamento de frotas de automóveis, motoristas e registro de utilizações de veículos.

---

## Gerenciador de Pacotes: Por que usamos o pnpm?

O projeto utiliza o **[pnpm](https://pnpm.io/)** (versão configurada: `11.x`) como gerenciador de pacotes.

## Como Executar o Projeto

### 1. Pré-requisitos
- **Node.js**: Versão **22.x** ou superior instalada (o projeto faz uso da execução direta de arquivos `.ts` nativa do Node 22 com ESM).
- **pnpm**: Versão **10.x** ou **11.x**. Caso não tenha instalado:
  ```bash
  npm install -g pnpm
  # ou habilite via Corepack:
  corepack enable
  corepack prepare pnpm@11.23.0 --activate
  ```

### 2. Clonar ou Acessar a Pasta do Projeto
```bash
cd vdrive-api
```

### 3. Instalar as Dependências
Utilize o `pnpm` para instalar:
```bash
pnpm install
```

### 4. Configurar as Variáveis de Ambiente
Verifique o arquivo `.env` na raiz do projeto (ou copie a partir do `.env.example`):
```bash
cp .env.example .env
```
Conteúdo padrão:
```env
PORT=10003
```

### 5. Executar a Aplicação
Você pode rodar em modo de desenvolvimento ou inicialização direta:

- **Modo Desenvolvimento (com auto-reload ao alterar arquivos):**
  ```bash
  pnpm dev
  ```
- **Modo Padrão / Produção:**
  ```bash
  pnpm start
  ```
- **Validação de Tipos TypeScript (sem emitir arquivos):**
  ```bash
  pnpm typecheck
  ```

A aplicação iniciará e exibirá no terminal:
```text
App listening on port 10003
```

### 6. Executar os Testes
O projeto utiliza **Vitest** e **Supertest** para os testes automatizados da API. Os testes utilizam um banco isolado (`tests/database/`), que é resetado automaticamente a cada teste:

- **Executar todos os testes (unitários e e2e):**
  ```bash
  pnpm test
  ```
- **Executar apenas os testes unitários (entidades e casos de uso):**
  ```bash
  pnpm test:unit
  ```
- **Executar apenas os testes de integração / E2E (rotas HTTP com Supertest):**
  ```bash
  pnpm test:e2e
  ```
- **Executar testes em modo contínuo (watch):**
  ```bash
  pnpm test:watch
  ```

---

## Rotas da API

Todas as rotas possuem o prefixo base `/api`.

### Automóveis (`/api/automobiles`)
| Método | Rota | Descrição |
| :--- | :--- | :--- |
| `GET` | `/api/automobiles` | Lista automóveis (filtros opcionais: `?color=...&brand=...`) |
| `GET` | `/api/automobiles/:id` | Retorna um automóvel pelo ID |
| `POST` | `/api/automobiles/create` | Cadastra um novo automóvel |
| `PUT` | `/api/automobiles/:id` | Atualiza placa, cor ou marca do automóvel |
| `DELETE`| `/api/automobiles/:id` | Remove um automóvel (se não estiver em uso) |

### Motoristas (`/api/drivers`)
| Método | Rota | Descrição |
| :--- | :--- | :--- |
| `GET` | `/api/drivers` | Lista motoristas (filtro opcional: `?name=...`) |
| `GET` | `/api/drivers/:id` | Retorna um motorista pelo ID |
| `POST` | `/api/drivers/create` | Cadastra um novo motorista |
| `PUT` | `/api/drivers/:id` | Atualiza o nome do motorista |
| `DELETE`| `/api/drivers/:id` | Remove um motorista (se não estiver em uso) |

### Utilizações de Veículos (`/api/usages`)
| Método | Rota | Descrição |
| :--- | :--- | :--- |
| `GET` | `/api/usages` | Lista todas as utilizações registradas |
| `POST` | `/api/usages/create` | Inicia o uso de um automóvel por um motorista |
| `PATCH`| `/api/usages/:id/finish` | Finaliza a utilização do automóvel |

---

## Coleção do Postman

O projeto inclui uma coleção pronta para uso no Postman localizada na raiz:
- **Arquivo:** [`vdrive-api.postman_collection.json`](./vdrive-api.postman_collection.json) (Versão 2.1.0)

### Como importar no Postman:
1. Abra o Postman e clique em **Import** (canto superior esquerdo).
2. Arraste ou selecione o arquivo `vdrive-api.postman_collection.json`.
3. A coleção **vDrive API** será importada com:
   - Todas as 12 requisições organizadas por módulos (`Motoristas`, `Automóveis`, `Utilizações`).
   - Variáveis de coleção pré-configuradas (`baseUrl`, `driverId`, `automobileId`, `usageId`).
   - Testes automatizados incluídos para validação de status code e formato de resposta.