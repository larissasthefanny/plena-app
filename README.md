<p align="center">
  <img src="docs/app_showcase.png" alt="Plena App" width="100%">
</p>

<h1 align="center">💜 Plena - Finanças Pessoais Inteligentes</h1>

<p align="center">
  <strong>Transforme sua relação com o dinheiro usando o método 50/30/20</strong>
</p>

<p align="center">
  <a href="https://plena-financas.vercel.app/login">
    <img src="https://img.shields.io/badge/🌐_Demo_Live-Acessar_Aplicação-7c3aed?style=for-the-badge" alt="Demo Live">
  </a>
  <img src="https://img.shields.io/badge/Go-1.24-00ADD8?style=for-the-badge&logo=go" alt="Go">
  <img src="https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js" alt="Next.js">
  <img src="https://img.shields.io/badge/PostgreSQL-15-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
</p>

---

## ✨ O que é o Plena?

**Plena** é mais do que um app de finanças - é seu companheiro para alcançar **liberdade financeira**. Construído com tecnologias modernas (Go + Next.js), oferece uma experiência **rápida, segura e intuitiva** para gerenciar seu dinheiro de forma inteligente.

### 🎯 Por que usar o Plena?

- 💰 **Método 50/30/20 Automático**: Divida suas finanças automaticamente entre Essenciais, Desejos e Investimentos
- 📊 **Visualização Inteligente**: Gráficos interativos e dashboard em tempo real
- 🎨 **Design Premium**: Interface moderna com Dark Mode nativo e efeitos glassmorphism
- 📱 **Mobile First**: Funciona perfeitamente em qualquer dispositivo
- 🔐 **Seguro e Privado**: Seus dados são protegidos com criptografia JWT e BCrypt
- 🚀 **PWA Instalável**: Instale como app nativo no celular ou desktop
- 🎯 **Metas Financeiras**: Crie e acompanhe suas metas de economia com progresso visual

---

## 🚀 Features

<table>
  <tr>
    <td width="50%">
      
### 💼 Gestão Financeira
- ✅ Dashboard inteligente com método 50/30/20
- ✅ Adicionar, editar e excluir transações
- ✅ Filtro por período (mês/ano)
- ✅ Categorização automática
- ✅ Gráficos interativos (PieChart)
      
    </td>
    <td width="50%">
      
### 🎯 Metas & Conquistas
- ✅ Criar metas de economia personalizadas
- ✅ Acompanhamento visual de progresso
- ✅ Adicionar valores incrementalmente
- ✅ Notificações de conquista
- ✅ Histórico de metas concluídas
      
    </td>
  </tr>
  <tr>
    <td>
      
### 🎨 UX Premium
- ✅ Dark Mode nativo
- ✅ Animações fluidas
- ✅ Feedback visual (Toasts)
- ✅ Design responsivo total
- ✅ PWA instalável
      
    </td>
    <td>
      
### 🔐 Segurança
- ✅ Autenticação JWT
- ✅ **Login com Google OAuth**
- ✅ Senhas criptografadas (BCrypt)
- ✅ Dados privados por usuário
- ✅ HTTPS em produção
- ✅ Validação de entrada
      
    </td>
  </tr>
</table>

---

## 🏗️ Arquitetura

O Plena segue os princípios da **Clean Architecture**, garantindo código **desacoplado, testável e escalável**.

```
📦 plena-app
├── 🔧 backend/          # API Go com Clean Architecture
│   ├── cmd/api/         # Entry point (main.go)
│   ├── internal/
│   │   ├── core/        # Lógica de negócio pura
│   │   │   ├── domain/  # Entidades (Transaction, User, Goal)
│   │   │   ├── ports/   # Interfaces (contratos)
│   │   │   └── services/ # Serviços de negócio
│   │   ├── adapters/    # Camada externa
│   │   │   ├── controllers/ # HTTP handlers
│   │   │   ├── repository/  # Acesso ao banco
│   │   │   └── router/      # Rotas e middlewares
│   │   └── config/      # Configurações e env vars
│   └── migrations/      # SQL scripts
│
└── 🎨 frontend/         # Next.js 16 + React 19
    ├── src/app/         # Pages (Dashboard, Login, Register)
    ├── src/components/  # Componentes reutilizáveis
    └── public/          # Assets e PWA config
```

---

## 🛠️ Stack Tecnológica

### Backend
![Go](https://img.shields.io/badge/Go-1.24-00ADD8?logo=go&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Auth-000000?logo=json-web-tokens)
![OAuth](https://img.shields.io/badge/Google_OAuth-2.0-4285F4?logo=google)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)

- **Linguagem**: Go 1.24
- **Database**: PostgreSQL 15
- **Autenticação**: JWT + BCrypt + Google OAuth 2.0
- **OAuth**: golang.org/x/oauth2
- **Testes**: Testify, SQLMock (32+ testes)
- **Deploy**: Railway

### Frontend
![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwind-css&logoColor=white)

- **Framework**: Next.js 16 + React 19
- **Linguagem**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Gráficos**: Recharts
- **Ícones**: Lucide React
- **Notificações**: Sonner
- **PWA**: @ducanh2912/next-pwa
- **Deploy**: Vercel

---

## 🚀 Como Executar

### Pré-requisitos
- Go 1.24+
- Node.js 18+
- PostgreSQL 15+ (ou Docker)

### 1️⃣ Clone o Repositório
```bash
git clone https://github.com/larissasthefanny/plena-app.git
cd plena-app
```

### 2️⃣ Configure o Backend

```bash
cd backend

# Crie o arquivo .env
cat > .env << EOF
DB_HOST=localhost
DB_PORT=5432
DB_USER=plena_user
DB_PASSWORD=plena_password
DB_NAME=plena_db
JWT_SECRET=seu_secret_super_seguro
PORT=8080
ALLOWED_ORIGINS=http://localhost:3000,https://*.vercel.app

# Google OAuth (opcional - para login com Google)
GOOGLE_CLIENT_ID=seu-google-client-id
GOOGLE_CLIENT_SECRET=seu-google-client-secret
GOOGLE_REDIRECT_URL=http://localhost:8080/api/auth/google/callback
FRONTEND_URL=http://localhost:3000
EOF

# Instale dependências e rode
go mod download
go run cmd/api/main.go
```

> 💡 **Login com Google**: Para configurar, siga o [guia de OAuth](docs/OAUTH.md)

### 3️⃣ Configure o Frontend

```bash
cd frontend

# Instale dependências
npm install

# Rode o servidor dev
npm run dev
```

### 4️⃣ Acesse a Aplicação
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8080

---

## 🧪 Testes

O projeto possui **cobertura completa de testes** no backend:

```bash
cd backend
go test ./... -v -cover
```

**Estatísticas**:
- ✅ 30+ testes unitários
- ✅ Controllers, Services e Repositories testados
- ✅ Mocks para banco de dados (SQLMock)
- ✅ Testes de integração de rotas

---

## 📱 PWA - Instale no seu Dispositivo

O Plena pode ser instalado como um **app nativo**:

1. Acesse [plena-financas.vercel.app](https://plena-financas.vercel.app)
2. No navegador, clique em **"Instalar"** ou **"Adicionar à tela inicial"**
3. Pronto! Use como app nativo 🎉

---

## 🎯 Roadmap

- [x] Dashboard com método 50/30/20
- [x] CRUD completo de transações
- [x] Gráficos interativos
- [x] Sistema de metas financeiras
- [x] PWA instalável
- [x] Autenticação segura
- [x] Deploy em produção
- [ ] Recorrência automática de transações
- [ ] Exportação de relatórios (PDF/CSV)
- [ ] Categorias customizáveis
- [ ] Modo simulação de investimentos
- [ ] App mobile nativo (React Native)

---

## 📄 Licença

Este projeto está sob a licença MIT.

---

<p align="center">
  <strong>Desenvolvido com 💜 por <a href="https://github.com/larissasthefanny">Larissa Sthefanny</a></strong>
</p>

<p align="center">
  <a href="https://plena-financas.vercel.app/login">
    <img src="https://img.shields.io/badge/⭐_Experimentar_Agora-7c3aed?style=for-the-badge" alt="Experimentar">
  </a>
</p>
