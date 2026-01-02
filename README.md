# Plena - Personal Finance App

![Plena App Showcase](docs/app_showcase.png)

**🌐 Acesse a aplicação em produção:** [https://larissasthefanny-plena-app.vercel.app/login](https://larissasthefanny-plena-app.vercel.app/login)

Bem-vindo ao **Plena**, sua aplicação de finanças pessoais focada na metodologia **50/30/20**.
Este projeto utiliza **Go (Golang)** no backend para alta performance e **Next.js** no frontend para uma experiência de usuário moderna.

---

## 📱 Mobile First & Design Premium

O Plena foi desenhado pensando em você, onde quer que esteja.
*   **Responsividade Total**: Layout se adapta perfeitamente do Desktop ao Mobile.
*   **Dark Mode Nativo**: Interface elegante, confortável para os olhos e com economia de bateria.
*   **Glassmorphism**: Elementos visuais modernos com transparências e blurs que dão profundidade.

## 🚀 Arquitetura do Projeto

O projeto segue os princípios da **Clean Architecture** (Arquitetura Limpa), garantindo que o código seja desacoplado, testável e fácil de manter.

### Estrutura de Pastas (Backend)

`backend/`
*   `cmd/api/`: Ponto de entrada da aplicação (`main.go`). Aqui carregamos as configurações, conectamos ao banco e iniciamos o servidor.
*   `internal/`
    *   `config/`: Gerenciamento centralizado de variáveis de ambiente.
    *   `core/`: Contém a lógica de negócio pura.
        *   `domain/`: Entidades principais (ex: `Transaction`, `User`, `Goal`).
        *   `ports/`: Interfaces que definem os contratos.
        *   `services/`: Implementação da lógica de negócio.
    *   `adapters/`: Camada que se comunica com o mundo externo.
        *   `controllers/`: Recebem as requisições HTTP (antigos handlers).
        *   `router/`: Configuração de rotas e middlewares (CORS, Auth).
        *   `repository/`: Acesso ao banco de dados (PostgreSQL).
        *   `clients/`: Conexões externas (Banco de Dados).
*   `migrations/`: Scripts SQL para criação de tabelas.
*   `.env`: Arquivo de configuração (variáveis de ambiente).

### Estrutura (Frontend)

`frontend/`
*   `src/app/`: Páginas do Next.js (Dashboard, Login, Register).
*   `src/components/`: Componentes reutilizáveis (TransactionModal, GoalModal, GoalCard, etc).
*   Utiliza **Lucide React** para ícones e **Tailwind CSS** para estilização.

---

## 🛠️ Tecnologias Utilizadas

*   **Backend**: Go 1.23+
*   **Frontend**: Next.js 16, React 19, Tailwind CSS 4
*   **Bibliotecas Frontend**: Recharts (Gráficos), Sonner (Notificações), Lucide React (Ícones)
*   **Banco de Dados**: PostgreSQL 15
*   **Autenticação**: JWT (JSON Web Tokens) e BCrypt (Hashing de senhas)
*   **PWA**: @ducanh2912/next-pwa
*   **Testes**: testify (Go), sqlmock (Go)
*   **Ambiente**: Docker (opcional, para rodar o banco)

---

## ⚙️ Configuração e Execução

### 1. Pré-requisitos
*   Go 1.23+ instalado.
*   Node.js 18+ instalado.
*   PostgreSQL rodando (Local ou Docker).

### 2. Configurar Variáveis de Ambiente
No diretório `backend/`, crie um arquivo `.env` baseado no `.env.example`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=user
DB_PASSWORD=passoword
DB_NAME=plena_db
JWT_SECRET=secret
PORT=8080
```

### 3. Rodar o Backend
```bash
cd backend
go get ./...
go run cmd/api/main.go
```
O servidor iniciará em `http://localhost:8080`.

### 4. Rodar o Frontend
```bash
cd frontend
npm install
npm run dev -- --webpack
```
Acesse `http://localhost:3000` no seu navegador.

### 5. Rodar Testes
```bash
# Backend
cd backend
go test ./... -v

# Frontend (se houver)
cd frontend
npm test
```

---

## 🔐 Funcionalidades

1.  **Dashboard 50/30/20**: Visualização automática de quanto você já gastou das suas metas de Essenciais, Desejos e Investimentos.
2.  **Gráficos Interativos**: Gráfico de rosca (PieChart) para melhor visualização da distribuição de gastos.
3.  **CRUD Completo de Transações**: Adicione, edite e exclua receitas e despesas com facilidade.
4.  **Metas Financeiras** 🎯:
    *   Crie metas de economia com nome, valor alvo e prazo.
    *   Acompanhe o progresso visualmente com barras de progresso.
    *   Adicione valores incrementalmente à meta.
    *   Receba notificação quando atingir 100% da meta.
5.  **Feedback Visual**: Notificações modernas (Toasts) para todas as ações.
6.  **Autenticação Completa**: Crie sua conta e faça login. Seus dados são privados e seguros.
7.  **Filtro por Período**: Navegue entre meses para ver seu histórico de transações.
8.  **PWA (Instalável)**: Instale o app no seu celular ou computador para acesso rápido e offline.
9.  **Guia do Método**: Explicação interativa do método 50/30/20 integrada ao dashboard.

---

## 🧪 Testes

O projeto possui cobertura de testes unitários completa no backend:

*   **Controllers**: Testes de HTTP handlers (TransactionController, AuthController, GoalController)
*   **Services**: Testes de lógica de negócio (TransactionService, AuthService, GoalService)
*   **Repositories**: Testes de acesso ao banco com mocks (PostgresTransactionRepository, PostgresGoalRepository)
*   **Router**: Testes de integração de rotas e middlewares

**Total**: 30+ testes unitários ✅

---

## 📝 Próximos Passos (Roadmap)

*   [x] Edição e Exclusão de transações individuais.
*   [x] Visualização gráfica (Gráfico de Rosca).
*   [x] PWA (Instalar no celular).
*   [x] Metas Financeiras (Goals).
*   [ ] Recorrência automática de transações.
*   [ ] Exportação de relatórios (PDF/CSV).
*   [ ] Modo de simulação de investimentos.

---

Desenvolvido com 💜 por Larissa Sthefanny
