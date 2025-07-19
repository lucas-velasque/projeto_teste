# aluguel-social
Projeto de conclusão de semestre em Desenvolvimento Web utilizando Nodejs e Sequelize. 


# Como usar e acessar


** Backend
  - npm run start:dev

** Frontend
  - npm run dev

** Acessar

- Login de Cliente/Usuário: http://localhost:3002/auth/login-user
- Login de Administrador: http://localhost:3002/auth/login-admin
- Login de Fornecedor: http://localhost:3002/auth/login-supplier

# Dependências

0. Banco de dados:

- sqlite3 --version = 3.50.2

2. Next.js, React e React DOM

- npm install next@latest react@18 react-dom@18 --legacy-peer-deps

2. React..

- npm install @tanstack/react-query axios react-hook-form @hookform/resolvers zod react-hot-toast lucide-react --legacy-peer-deps

3. Dependências dev

- npm install -D typescript @types/node @types/react @types/react-dom autoprefixer postcss tailwindcss eslint eslint-config-next --legacy-peer-deps

4. Tudo: node

- npm install


# Funcionalidades do projeto

## Autenticação
- Login com validação
- Proteção de rotas
- Interceptors para token JWT
- Logout automático

## Usuário (Beneficiário)

### Login e Cadastro
- Realizar login na plataforma  
- Registrar-se como usuário comum  

### Visualização de Propriedades
- Visualizar propriedades disponíveis para aluguel social  

### Reservas
- Solicitar/reservar propriedades disponíveis  
- Visualizar suas reservas  

### Tarefas
- Visualizar tarefas atribuídas a si  

### Créditos de Serviço
- Visualizar saldo de créditos de serviço (horas de hospedagem)  
- Utilizar créditos para reservas, conforme regras do sistema  

---

## Fornecedor

### Login
- Realizar login como fornecedor  

### Gestão de Propriedades
- Cadastrar novas propriedades  
- Editar/excluir apenas propriedades criadas por si  
- Visualizar lista de suas propriedades  

### Visualização de Reservas
- Visualizar reservas feitas em suas propriedades  

### Tarefas
- Visualizar tarefas relacionadas às suas propriedades  

---

## Administrador

### Login
- Realizar login como administrador  

### Gestão de Usuários
- Visualizar todos os usuários  
- Criar, editar e excluir usuários  

### Gestão de Propriedades
- Visualizar todas as propriedades  
- (Edição/remover pode estar restrito, conforme ajustes recentes)  

### Gestão de Reservas
- Visualizar todas as reservas  
- Aprovar ou rejeitar reservas  

### Gestão de Tarefas
- Criar, editar e excluir tarefas  
- Visualizar todas as tarefas  
- Atribuir tarefas a usuários  

### Gestão de Créditos de Serviço
- Criar, editar e excluir créditos de serviço (horas de hospedagem)  
- Visualizar créditos de todos os usuários  

### Assistência Social
- Gerenciar e visualizar registros de assistência social  


# Estrutura 

<details>
  <summary><strong>📁 Estrutura de Diretórios</strong></summary>

<br>

```plaintext
aluguel-social/src/
├── modules/
│   ├── auth/
│   │   ├── auth.controller.spec.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.guard.ts
│   │   ├── auth.module.ts
│   │   ├── auth.service.ts
│   │   ├── dto/
│   │   │   ├── login-auth.dto.ts
│   │   │   └── register-auth.dto.ts
│   │   └── strategies/
│   │       └── jwt.strategy.ts
│   ├── users/
│   │   ├── dto/
│   │   │   ├── create-user.dto.ts
│   │   │   └── update-user.dto.ts
│   │   ├── entities/
│   │   │   └── user.entity.ts
│   │   ├── repositories/
│   │   │   └── user.repository.ts
│   │   ├── users.controller.spec.ts
│   │   ├── users.controller.ts
│   │   ├── users.module.ts
│   │   └── users.service.ts
│   ├── properties/
│   │   ├── dto/
│   │   │   ├── create-property.dto.ts
│   │   │   └── update-property.dto.ts
│   │   ├── entities/
│   │   │   └── property.entity.ts
│   │   ├── repositories/
│   │   │   └── property.repository.ts
│   │   ├── properties.controller.spec.ts
│   │   ├── properties.controller.ts
│   │   ├── properties.module.ts
│   │   └── properties.service.ts
│   ├── bookings/
│   │   ├── dto/
│   │   │   ├── create-booking.dto.ts
│   │   │   └── update-booking.dto.ts
│   │   ├── entities/
│   │   │   └── booking.entity.ts
│   │   ├── repositories/
│   │   │   └── bookings.repository.ts
│   │   ├── bookings.controller.spec.ts
│   │   ├── bookings.controller.ts
│   │   ├── bookings.module.ts
│   │   └── bookings.service.ts
│   ├── work-credits/
│   │   ├── dto/
│   │   │   ├── create-work-credit.dto.ts
│   │   │   └── update-work-credit.dto.ts
│   │   ├── entities/
│   │   │   └── work-credit.entity.ts
│   │   ├── repositories/
│   │   │   └── work-credit.repository.ts
│   │   ├── work-credits.controller.spec.ts
│   │   ├── work-credits.controller.ts
│   │   ├── work-credits.module.ts
│   │   └── work-credits.service.ts
│   └── social-assistance/  <-- Módulo Criado
│       ├── dto/
│       │   ├── create-social-assistance.dto.ts
│       │   └── update-social-assistance.dto.ts
│       ├── entities/
│       │   └── social-assistance.entity.ts
│       ├── repositories/
│       │   └── social-assistance.repository.ts
│       ├── social-assistance.controller.spec.ts
│       ├── social-assistance.controller.ts
│       ├── social-assistance.module.ts
│       └── social-assistance.service.ts
├── config/
│   ├── database.config.ts
│   └── .env
├── shared/
│   ├── dtos/
│   │   └── base.dto.ts
│   ├── middlewares/
│   │   └── logger.middleware.ts
│   └── utils/
│       └── helpers.ts
└── main.ts
