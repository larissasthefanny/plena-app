# Plena - Personal Finance App

![Plena App Showcase](docs/app_showcase.png)

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
        *   `domain/`: Entidades principais (ex: `Transaction`, `User`).
        *   `ports/`: Interfaces que definem os contratos.
        *   `services/`: Implementação da lógica de negócio.
    *   `adapters/`: Camada que se comunica com o mundo externo.
        *   `controllers/`: Recebem as requisições HTTP (antigos handlers).
        *   `router/`: Configuração de rotas e middlewares (CORS, Auth).
        *   `repository/`: Acesso ao banco de dados (PostgreSQL).
        *   `clients/`: Conexões externas (Banco de Dados).
*   `.env`: Arquivo de configuração (variáveis de ambiente).

### Estrutura (Frontend)

`frontend/`
*   `src/app/`: Páginas do Next.js (Dashboard, Login, Register).
*   `src/components/`: Componentes reutilizáveis (ex: Modais).
*   Utiliza **Lucide React** para ícones e **Tailwind CSS** para estilização.

---

## 🛠️ Tecnologias Utilizadas

*   **Backend**: Go 1.23+
*   **Frontend**: Next.js 14, React, Tailwind CSS, Recharts (Gráficos), Sonner (Notificações)
*   **Banco de Dados**: PostgreSQL
*   **Autenticação**: JWT (JSON Web Tokens) e BCrypt (Hashing de senhas)
*   **Ambiente**: Docker (opcional, para rodar o banco)

---

## ⚙️ Configuração e Execução

### 1. Pré-requisitos
*   Go instalado.
*   Node.js instalado.
*   PostgreSQL rodando (Local ou Docker).

### 2. Configurar Variáveis de Ambiente
No diretório `backend/`, crie um arquivo `.env` baseado no `.env.example`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=user
DB_PASSWORD=password
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
npm run dev
```
Acesse `http://localhost:3000` no seu navegador.

---

## 🔐 Funcionalidades

1.  **Dashboard 50/30/20**: Visualização automática de quanto você já gastou das suas metas de Essenciais, Desejos e Investimentos.
2.  **Gráficos Interativos**: Gráfico de rosca para melhor visualização da distribuição de gastos.
3.  **CRUD Completo**: Adicione, edite e exclua transações com facilidade.
4.  **Feedback Visual**: Notificações modernas (Toasts) para todas as ações.
5.  **Autenticação Completa**: Crie sua conta e faça login. Seus dados são privados e seguros.
6.  **Filtro por Período**: Navegue entre meses para ver seu histórico.

---

## 📝 Próximos Passos (Roadmap)

*   [x] Edição e Exclusão de transações individuais.
*   [x] Visualização gráfica (Gráfico de Rosca).
*   [ ] PWA (Instalar no celular).
*   [ ] Exportação de relatórios (PDF/CSV).

Desenvolvido por Larissa Sthefanny 💜
