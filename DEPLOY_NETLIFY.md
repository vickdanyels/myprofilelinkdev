# Guia de Publicação no Netlify (Link-in-Bio SaaS)

Este guia orienta você passo a passo para colocar seu projeto SaaS no ar usando a **Netlify**.

> [!IMPORTANT]
> **Atenção sobre o Banco de Dados (SQLite vs PostgreSQL):**
> O seu projeto atualmente usa **SQLite** (`provider = "sqlite"`). O SQLite salva os dados em um arquivo local (`dev.db`).
> A Netlify é uma plataforma "Serverless" (sem servidor permanente), o que significa que **arquivos locais são apagados a cada nova versão ou reinicialização**. Se você publicar com SQLite, **seus usuários perderão os dados** constantemente.
>
> **Solução:** Para produção, recomendamos mudar para um banco **PostgreSQL** gratuito (ex: **[Neon.tech](https://neon.tech)** ou **Supabase**). Este guia inclui essa etapa.

---

## Passo 1: Preparar o Banco de Dados (Produção)

1.  Crie uma conta gratuita no **[Neon.tech](https://neon.tech)** (recomendado por ser Postgres nativo e fácil) ou Supabase.
2.  Crie um novo projeto.
3.  Copie a **Connection String** (URL de conexão) que será algo parecido com:
    `postgres://usuario:senha@ep-xyz.aws.neon.tech/neondb?sslmode=require`

## Passo 2: Ajustar o Código para Postgres

No seu editor:

1.  Abra o arquivo `prisma/schema.prisma`.
2.  Mude o `provider` de `"sqlite"` para `"postgresql"`.

```prisma
datasource db {
  provider = "postgresql" // Mude de "sqlite" para "postgresql"
  url      = env("DATABASE_URL")
}
```

3.  (Opcional) Se você quiser testar localmente com o novo banco, troque o `DATABASE_URL` no seu arquivo `.env` pela URL do Neon que você copiou.

## Passo 3: Enviar para o GitHub

A maneira mais fácil de usar a Netlify é conectando ao GitHub.

1.  Crie um repositório no **GitHub**.
2.  Envie seu código:
    ```bash
    git init
    git add .
    git commit -m "Preparando para deploy"
    git branch -M main
    git remote add origin https://github.com/SEU_USUARIO/SEU_REPO.git
    git push -u origin main
    ```

## Passo 4: Configurar na Netlify

1.  Acesse **[netlify.com](https://www.netlify.com)** e faça login.
2.  Clique em **"Add new site"** > **"Import from an existing project"**.
3.  Escolha **GitHub**.
4.  Selecione o repositório que você acabou de criar.

A Netlify deve detectar automaticamente que é um projeto **Next.js**.

### Configurações de Build:
*   **Build command:** `next build`
*   **Publish directory:** `.next`

### Variáveis de Ambiente (Environment Variables):
Clique em **"Add environment variables"** (ou vá em Site Settings > Environment variables depois). Você precisa adicionar:

1.  `DATABASE_URL`: Cole a URL do seu banco Postgres (Neon/Supabase) que você copiou no Passo 1.
2.  `NEXTAUTH_SECRET`: Gere um código aleatório (pode usar `openssl rand -base64 32` no terminal ou digitar uma senha longa e complexa).
3.  `NEXTAUTH_URL`: Coloque a URL do seu site na Netlify (ex: `https://seu-projeto.netlify.app`). *Nota: Na primeira vez, você pode não saber a URL exata, pode preencher depois de criar o site.*

## Passo 5: Deploy

Clique em **"Deploy"**.

A Netlify vai começar a construir o site. Se falhar na etapa do Prisma, pode ser necessário adicionar um script de "postinstall" no seu `package.json` para gerar o cliente Prisma:

**No `package.json` localize "scripts" e adicione:**
```json
"scripts": {
  "postinstall": "prisma generate",
  ...outros scripts
}
```
*(Lembre-se de enviar essa alteração para o GitHub se fizer).*

## Passo 6: Criação das Tabelas (Migração)

Como o banco de produção (Neon) está vazio, você precisa criar as tabelas lá. Você pode fazer isso do seu computador local, apontando para o banco de produção:

1.  No seu terminal local (garanta que o arquivo `.env` esteja com a `DATABASE_URL` do Neon, ou passe a URL no comando):
    ```bash
    npx prisma db push
    ```
    *Isso vai ler seu schema e criar as tabelas no banco remoto.*

## Pronto! 🚀
Seu SaaS estará no ar.
