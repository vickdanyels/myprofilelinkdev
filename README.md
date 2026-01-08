# LinkBio Pro - Link-in-Bio SaaS Platform

Uma plataforma premium de Link-in-Bio construída com Next.js, Tailwind CSS e Prisma.

## 🚀 Features

- ✅ **Autenticação completa** - Login/Registro com email e senha
- ✅ **Dashboard intuitivo** - Gerencie seu perfil e links facilmente
- ✅ **Preview em tempo real** - Veja as mudanças instantaneamente
- ✅ **Páginas públicas SEO-friendly** - URL personalizada (dominio.com/username)
- ✅ **Design premium** - Interface moderna com glassmorphism e animações
- ✅ **Mobile-first** - Responsivo em todos os dispositivos
- ✅ **Estrutura PRO pronta** - Preparado para temas premium e analytics

## 🛠️ Tech Stack

- **Frontend:** Next.js 16 (App Router), React, Tailwind CSS
- **Backend:** Server Actions, API Routes
- **Database:** SQLite (Prisma ORM)
- **Auth:** Auth.js (NextAuth v5)
- **Validação:** Zod, React Hook Form

## 📦 Instalação

```bash
# 1. Navegue até o diretório do projeto
cd link-in-bio-saas

# 2. Instale as dependências
npm install

# 3. Crie o arquivo .env (já existe com DATABASE_URL)
# DATABASE_URL="file:./dev.db"

# 4. Gere o Prisma Client e execute as migrações
npx prisma generate
npx prisma migrate dev

# 5. Inicie o servidor de desenvolvimento
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── [username]/      # Página pública do perfil
│   ├── api/auth/        # API de autenticação
│   ├── dashboard/       # Dashboard do usuário
│   ├── login/           # Página de login
│   ├── register/        # Página de cadastro
│   ├── globals.css      # Design system
│   ├── layout.tsx       # Layout raiz
│   └── page.tsx         # Landing page
├── actions/             # Server Actions
│   ├── auth.ts          # Ações de autenticação
│   └── profile.ts       # Ações de perfil/links
├── components/
│   ├── dashboard/       # Componentes do dashboard
│   └── ui/              # Componentes reutilizáveis
├── lib/
│   ├── auth.ts          # Configuração Auth.js
│   ├── prisma.ts        # Cliente Prisma
│   └── validations.ts   # Schemas Zod
└── types/               # Tipos TypeScript
```

## 🗃️ Banco de Dados

### Modelos principais:

- **User** - Usuários da plataforma
- **ProfilePage** - Páginas públicas dos usuários
- **Link** - Links dos perfis
- **ClickAnalytics** - Analytics de cliques (PRO)
- **Theme** - Temas personalizados
- **Plan** - Planos FREE/PRO

### Comandos Prisma:

```bash
# Visualizar banco no Studio
npx prisma studio

# Criar nova migração
npx prisma migrate dev --name nome_da_migracao

# Resetar banco
npx prisma migrate reset
```

## 🌐 Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Banco de dados
DATABASE_URL="file:./dev.db"

# Auth.js (NextAuth)
AUTH_SECRET="sua-chave-secreta-aqui"

# Para produção com PostgreSQL:
# DATABASE_URL="postgresql://user:password@host:5432/database"
```

## 🚀 Deploy (Vercel)

1. Faça push do projeto para um repositório Git
2. Conecte o repositório na Vercel
3. Configure as variáveis de ambiente:
   - `DATABASE_URL` (usar PostgreSQL em produção)
   - `AUTH_SECRET` (gere com `openssl rand -base64 32`)
4. Deploy automático!

## 📱 Páginas

| Rota | Descrição |
|------|-----------|
| `/` | Landing page institucional |
| `/login` | Página de login |
| `/register` | Página de cadastro |
| `/dashboard` | Dashboard do usuário |
| `/[username]` | Página pública do perfil |

## 🎨 Customização

O design system está em `src/app/globals.css`. Principais variáveis:

```css
:root {
  --color-primary: 124 58 237;        /* Violet */
  --color-accent: 6 182 212;          /* Cyan */
  --color-background: 9 9 11;         /* Dark */
  /* ... */
}
```

## 📄 Licença

MIT License - Use livremente para projetos pessoais ou comerciais.
