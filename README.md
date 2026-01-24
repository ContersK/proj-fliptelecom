# 🌐 Sistema de Gestão Flip Telecom

Sistema completo de gestão empresarial desenvolvido para Flip Telecom, com foco em gerenciamento de funcionários, comissões, métricas de desempenho e controle administrativo.

## 📋 Sobre o Projeto

O Sistema de Gestão Flip Telecom é uma aplicação web robusta que permite o gerenciamento completo de colaboradores, incluindo cadastro, avaliação de desempenho, cálculo automático de comissões baseado em métricas mensais e configurações personalizadas por setor.

### ✨ Principais Funcionalidades

- **Gestão de Funcionários**: Cadastro completo com informações de cargo, turno, setor e status
- **Registro de Métricas**: Sistema de avaliação mensal com notas de 1 a 5 para cada funcionário
- **Cálculo Automático de Comissões**: Baseado em regras configuráveis por setor e performance
- **Dashboard Administrativo**: Visualização de dados e métricas em tempo real
- **Controle de Acesso**: Sistema de autenticação e autorização por perfis
- **Configurações Personalizadas**: Regras de comissão, notificações e segurança

## 🚀 Tecnologias Utilizadas

### Frontend

- **[Next.js 16.1.3](https://nextjs.org)** - Framework React com App Router e Turbopack
- **[React 19.2.3](https://react.dev)** - Biblioteca para construção de interfaces
- **[Chakra UI v3](https://www.chakra-ui.com)** - Sistema de componentes modernos
- **[Tailwind CSS v4](https://tailwindcss.com)** - Framework CSS utilitário
- **[Lucide React](https://lucide.dev)** - Ícones modernos e customizáveis
- **[Recharts](https://recharts.org)** - Gráficos e visualizações de dados

### Backend

- **[Prisma ORM 7.3.0](https://www.prisma.io)** - ORM type-safe para Node.js
- **[SQLite](https://www.sqlite.org)** - Banco de dados relacional
- **[bcryptjs](https://www.npmjs.com/package/bcryptjs)** - Hash seguro de senhas
- **API Routes do Next.js** - Endpoints REST

### Desenvolvimento

- **TypeScript 5** - Tipagem estática para JavaScript
- **ESLint** - Linter para qualidade de código
- **Prisma Client** - Cliente auto-gerado type-safe

## 📦 Instalação

### Pré-requisitos

- Node.js 20+ instalado
- npm, yarn, pnpm ou bun

### Passos para Instalação

1. **Clone o repositório**

```bash
git clone https://github.com/seu-usuario/proj-fliptelecom.git
cd proj-fliptelecom
```

2. **Instale as dependências**

```bash
npm install
```

3. **Configure o banco de dados**

```bash
# Gerar o Prisma Client
npx prisma generate

# Executar as migrations
npx prisma migrate dev

# (Opcional) Popular o banco com dados de teste
npm run seed
```

4. **Inicie o servidor de desenvolvimento**

```bash
npm run dev
```

5. **Acesse a aplicação**

```
http://localhost:3000
```

## 🗂️ Estrutura do Projeto

```
proj-fliptelecom/
├── prisma/
│   ├── schema.prisma          # Schema do banco de dados
│   ├── seed.ts                # Script de seed
│   └── migrations/            # Histórico de migrações
├── src/
│   ├── app/
│   │   ├── (admin)/          # Rotas administrativas
│   │   │   ├── comissoes/    # Gestão de comissões
│   │   │   ├── configuracoes/ # Configurações do sistema
│   │   │   ├── funcionarios/  # Gestão de funcionários
│   │   │   └── usuarios/      # Gestão de usuários
│   │   ├── (auth)/           # Rotas de autenticação
│   │   ├── (dashboard)/      # Dashboard principal
│   │   ├── api/              # API Routes
│   │   │   ├── funcionarios/ # Endpoints de funcionários
│   │   │   ├── metricas/     # Endpoints de métricas
│   │   │   ├── login/        # Autenticação
│   │   │   └── logout/       # Logout
│   │   ├── layout.tsx        # Layout principal
│   │   └── globals.css       # Estilos globais
│   ├── components/           # Componentes reutilizáveis
│   │   ├── ui/              # Componentes de UI
│   │   ├── Navbar.tsx       # Barra de navegação
│   │   └── Sidebar.tsx      # Menu lateral
│   └── lib/
│       └── prisma.ts        # Configuração do Prisma Client
├── public/                  # Arquivos estáticos
├── package.json            # Dependências e scripts
├── tsconfig.json          # Configuração TypeScript
├── next.config.ts         # Configuração Next.js
└── README.md             # Documentação
```

## 🔑 Funcionalidades Principais

### 1. Gestão de Funcionários

- CRUD completo de colaboradores
- Organização por cargo, turno e setor
- Status ativo/inativo
- Filtros e busca avançada

### 2. Sistema de Métricas

- Registro mensal de avaliações (notas 1-5)
- Cálculo automático de score final ponderado
- Histórico de performance
- Interface intuitiva para digitação de notas

### 3. Cálculo de Comissões

- Regras personalizadas por setor
- Cálculo automático baseado em métricas
- Porcentagem e valor de comissão
- Relatórios detalhados

### 4. Dashboard e Relatórios

- Visualização de dados em tempo real
- Gráficos de performance
- Métricas consolidadas
- Exportação de relatórios

## 🛠️ Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia o servidor de desenvolvimento

# Build e Produção
npm run build        # Cria build de produção
npm start            # Inicia servidor de produção

# Qualidade de Código
npm run lint         # Executa ESLint

# Banco de Dados
npx prisma studio    # Interface visual para o banco
npx prisma generate  # Gera Prisma Client
npx prisma migrate dev  # Cria nova migration
npm run seed         # Popula banco com dados de teste
```

## 🔐 Segurança

- Senhas criptografadas com bcryptjs
- Validação de entrada em todas as rotas
- Proteção de rotas administrativas
- Sanitização de dados

## 📊 Modelo de Dados

### Principais Entidades

- **Funcionario**: Dados dos colaboradores
- **MetricasMensais**: Avaliações mensais
- **Usuario**: Usuários do sistema
- **Gerencia**: Estrutura hierárquica

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer fork do projeto
2. Criar uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abrir um Pull Request

## 📝 Licença

Este projeto é privado e proprietário da Flip Telecom.

## 👥 Contato

Para dúvidas ou sugestões, entre em contato com a equipe de desenvolvimento.

---

**Desenvolvido com ❤️ para Flip Telecom**
