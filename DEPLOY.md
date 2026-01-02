# 🚀 Guia de Deploy - Plena App

## 📋 Pré-requisitos

- Conta no Railway (recomendado)
- Conta no Vercel (para o frontend)
- GitHub repository atualizado

## 🗄️ 1. Hospedar o Banco de Dados (PostgreSQL)

### Opção 1: Railway (Recomendado - Fácil)
1. Acesse [Railway.app](https://railway.app)
2. Crie uma conta gratuita
3. Clique em "New Project" → "Database" → "PostgreSQL"
4. Anote as credenciais:
   - `DATABASE_URL` (Railway fornece automaticamente)

### Opção 2: Supabase (Gratuito)
1. Acesse [Supabase.com](https://supabase.com)
2. Crie um projeto
3. Vá em Settings → Database → Connection string
4. Use a connection string fornecida

## 🔧 2. Hospedar o Backend (Go)

### No Railway:
1. No mesmo projeto Railway, clique "New" → "GitHub Repo"
2. Conecte seu repositório `plena-app`
3. Configure as variáveis de ambiente:
   ```
   PORT=8080
   DB_HOST=containers-us-west-1.railway.app (ou o host do seu DB)
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=sua_senha
   DB_NAME=railway
   JWT_SECRET=sua_chave_secreta_segura
   ```
4. Railway detectará automaticamente como app Go
5. O deploy será automático a cada push

### Verificando o Deploy:
- Railway fornecerá uma URL como: `https://plena-app-production.up.railway.app`
- Teste a health check: `https://sua-url.railway.app/api/health`

## 🌐 3. Hospedar o Frontend (Next.js)

### No Vercel:
1. Acesse [Vercel.com](https://vercel.com)
2. Importe seu repositório GitHub
3. Configure a variável de ambiente:
   ```
   NEXT_PUBLIC_API_URL=https://sua-url-railway.app
   ```
4. Deploy automático!

## 🔗 4. Conectar Frontend ao Backend

Após ambos hospedados:
1. No Vercel, vá em Settings → Environment Variables
2. Adicione: `NEXT_PUBLIC_API_URL=https://sua-api-railway.up.railway.app`
3. Re-deploy o frontend

## ✅ 5. Teste Final

1. Acesse seu app no Vercel
2. Tente fazer login/cadastro
3. Verifique se as transações funcionam
4. Teste no mobile (PWA)

## 🐛 Troubleshooting

### Erro de CORS:
- Certifique-se que o backend permite o domínio do Vercel
- Verifique os headers CORS no router Go

### Erro de Database:
- Confirme as credenciais do banco
- Verifique se as tabelas foram criadas (use migrations)

### Erro 500 no login:
- Verifique logs do Railway
- Confirme JWT_SECRET está configurado

## 💡 Dicas

- **Railway Free Tier**: 512MB RAM, suficiente para desenvolvimento
- **Vercel Free**: Perfeito para Next.js
- **Monitoramento**: Use logs do Railway para debug
- **Backup**: Railway faz backup automático do banco

---

🎉 **Sucesso!** Seu app estará rodando em produção!