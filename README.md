# ♻️ EcoPonto — Frontend

Aplicativo web de **reciclagem gamificada** integrado a uma **lixeira inteligente (ESP32)**.
O usuário escaneia o QR Code da lixeira, faz o descarte, a máquina identifica o material e o app credita pontos em tempo real — com ranking, tickets de sorteio e acompanhamento de impacto ambiental.

Construído em **React + Vite**, com **Framer Motion** para transições fluidas e um **modo demonstração** que funciona **sem back-end** (ideal para deploy imediato e apresentação).

---

## ✨ Funcionalidades

- **Autenticação completa**: login, cadastro e recuperação de senha em 3 passos (e-mail → código → nova senha), com **refresh token** automático.
- **Home**: saldo de pontos, meta mensal (anel de progresso), posição no ranking e atividades recentes.
- **Escaneamento + minigame**: leitor de QR Code (câmera) e sessão via **WebSocket** que reage aos eventos da lixeira (`conectado → analisando → correto/errado`), com confete na vitória.
- **Ranking**: pódio (top 3) e lista com **scroll infinito**, destacando o usuário atual.
- **Atividades**: filtros por período, materiais reciclados e **impacto ambiental** (CO₂, energia e água economizados).
- **Pontos e recompensas**: progresso até o próximo ticket e explicação de como o sistema funciona.
- **Perfil**: edição de dados e meta mensal.
- **Mobile-first**: layout em coluna estilo telefone, centralizado, com ambientação no desktop.

---

## 🧱 Stack

| Camada | Tecnologia |
|---|---|
| UI | React 18 + Vite 5 (JSX) |
| Rotas | React Router v6 |
| Animações | Framer Motion 11 |
| QR Code | html5-qrcode |
| Servidor de produção | Express 4 (SPA estático) |
| Estilo | CSS puro com design tokens (sem framework) |

> **Por que Express?** No Render, o app é publicado como **Web Service**: o Vite gera os arquivos estáticos em `dist/` e o `server.js` (Express) os serve com *fallback* de SPA (toda rota cai no `index.html`).

---

## 📁 Estrutura do projeto

```
ecoponto-frontend/
├── index.html                 # HTML raiz (fontes, metas, #root)
├── package.json
├── vite.config.js
├── server.js                  # Express: serve dist/ + fallback SPA (produção)
├── render.yaml                # Blueprint de deploy no Render
├── .env.example               # Variáveis de ambiente (modelo)
├── public/
│   └── favicon.svg
└── src/
    ├── main.jsx               # Entry point (ReactDOM.createRoot)
    ├── App.jsx                # Providers + rotas animadas (AnimatePresence)
    ├── index.css              # Importa os 4 arquivos de estilo
    ├── styles/
    │   ├── tokens.css         # Paleta, gradientes, raios, sombras, fontes
    │   ├── base.css           # Reset, layout (app-shell), utilitários
    │   ├── components.css     # Botões, inputs, cards, nav, chips, etc.
    │   └── pages.css          # Estilos específicos de cada página
    ├── lib/
    │   ├── env.js             # API_URL, WS_BASE, USE_MOCK
    │   ├── format.js          # Formatação pt-BR + metadados de materiais
    │   ├── api.js             # Cliente HTTP (Bearer + refresh) e endpoints
    │   ├── mock.js            # Back-end simulado (modo demo)
    │   ├── useSession.js      # Hook do minigame (WebSocket + simulação)
    │   └── useAsync.js        # Hook de carregamento de dados
    ├── context/
    │   └── AuthContext.jsx    # Sessão do usuário (tokens, login/logout)
    ├── routes/
    │   └── ProtectedRoute.jsx # Guardas de rota (privada / pública)
    ├── components/
    │   ├── Icons.jsx          # ~40 ícones SVG inline
    │   ├── Logo.jsx           # Marca + wordmark
    │   ├── Button.jsx         # Botão + Spinner
    │   ├── Field.jsx          # Inputs (+ campo de senha)
    │   ├── Progress.jsx       # Anel, barra e contador animado
    │   ├── Toast.jsx          # Notificações (context + host)
    │   ├── Confetti.jsx       # Confete da vitória
    │   ├── PageTransition.jsx # Wrapper de transição de página
    │   ├── Chrome.jsx         # Avatar + TopBar
    │   ├── BottomNav.jsx      # Navegação inferior (5 itens + FAB)
    │   └── AppShell.jsx       # Moldura do app + nav condicional
    └── pages/
        ├── auth/
        │   ├── Login.jsx
        │   ├── Register.jsx
        │   ├── RecoverEmail.jsx
        │   ├── RecoverCode.jsx
        │   └── RecoverReset.jsx
        ├── Home.jsx
        ├── Ranking.jsx
        ├── Rewards.jsx
        ├── Activities.jsx
        ├── Points.jsx
        ├── PointsExplained.jsx
        ├── Profile.jsx
        ├── ProfileEdit.jsx
        ├── NotFound.jsx
        └── scan/
            ├── Scan.jsx       # Câmera + leitor de QR + chave manual
            ├── FindMachine.jsx
            └── Session.jsx    # Minigame (estados do WebSocket)
```

---

## 🚀 Rodando localmente

Pré-requisitos: **Node.js 18+**.

```bash
# 1. Instalar dependências
npm install

# 2. Configurar ambiente
cp .env.example .env

# 3. Subir em desenvolvimento
npm run dev
```

Acesse `http://localhost:5173`.

No **modo demo** (padrão), use as credenciais de teste:
- **E-mail:** `joao.teste@ecoponto.com.br`
- **Senha:** `secret`

Para testar o minigame, vá em **Escanear** → **Conectar manualmente** (a chave `ecoponto-teste` já vem preenchida) → use o botão **Simular descarte**.

### Build de produção (local)

```bash
npm run build     # gera a pasta dist/
npm start         # sobe o Express servindo dist/ (porta 3000)
```

---

## 🔌 Modo demo × Back-end real

O comportamento é controlado por **duas variáveis de ambiente** (lidas em `src/lib/env.js`):

| Variável | Demo | Produção (real) |
|---|---|---|
| `VITE_USE_MOCK` | `true` | `false` |
| `VITE_API_URL` | (ignorada) | URL pública da API, ex.: `https://ecoponto-api.onrender.com` |

> ⚠️ **Importante:** variáveis `VITE_*` são embutidas em **tempo de build**. Ao mudar qualquer uma delas, é preciso **rebuildar** (no Render, isso acontece a cada deploy).

### Como integrar o back-end FastAPI

1. Defina `VITE_USE_MOCK=false`.
2. Defina `VITE_API_URL` com a URL pública da sua API.
3. Rebuild/redeploy.

Pronto — o cliente (`src/lib/api.js`) passa a chamar a API real, anexando o header `Authorization: Bearer <access_token>` e renovando o token automaticamente em respostas `401`.

A URL do **WebSocket** é derivada automaticamente da `VITE_API_URL` (troca `http`→`ws` / `https`→`wss`), no formato:

```
{ws|wss}://<host>/api/session/{session_id}/ws?token={ws_token}
```

---

## 🧩 Arquivos que dependem do back-end (pontos de integração)

Toda a comunicação está **centralizada** — não há chamadas espalhadas pelas páginas. Para a integração, foque nestes arquivos:

| Arquivo | Papel na integração |
|---|---|
| **`src/lib/env.js`** | Define `API_URL` e deriva `WS_BASE`. Ponto de partida da configuração. |
| **`src/lib/api.js`** | **Principal.** Cliente HTTP e todos os endpoints REST (auth, usuário, home, pontos, ranking, atividades, sessão). Anexa o Bearer token e trata refresh em `401`. |
| **`src/lib/useSession.js`** | Conexão **WebSocket** do minigame: trata os eventos `discard_started`, `discard_finished` e `session_interrupted`, e envia `close_session`. |
| **`src/context/AuthContext.jsx`** | Guarda os tokens (`localStorage`), sincroniza o perfil e atualiza pontos/tickets após cada descarte. |
| **`src/lib/mock.js`** | Back-end **simulado**. Usado só quando `VITE_USE_MOCK=true`. Pode ser ignorado/removido na produção, mas serve como **referência do contrato** esperado da API. |

Os endpoints consumidos (já implementados no cliente):

```
POST   /api/auth/login | /register | /logout | /refresh
POST   /api/auth/password/forgot | /resend-code | /verify-code | /reset
GET    /api/users/me           PATCH /api/users/me
GET    /api/home/summary
GET    /api/points/summary
GET    /api/rankings/summary    GET /api/rankings/list?limit&offset
GET    /api/activities/summary?period=week|month|year|all
POST   /api/session/create
WS     /api/session/{session_id}/ws?token={ws_token}
```

> As rotas internas da lixeira (`GET /api/session/active` e `POST /api/discard/process`, protegidas por `X-ESP32-KEY`) **não** são chamadas pelo frontend — são responsabilidade do hardware/back-end.

---

## ☁️ Deploy no Render

O app é publicado como **Web Service** (Node).

- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`
- **Environment:** `Node`

### Opção A — Blueprint (1 clique)

O repositório já inclui o `render.yaml`.

1. No Render: **New +** → **Blueprint**.
2. Conecte o repositório do GitHub.
3. O Render lê o `render.yaml` e cria o serviço já em **modo demo** (`VITE_USE_MOCK=true`) — o app funciona de imediato.
4. (Opcional) Para usar o back-end real, edite as variáveis do serviço: `VITE_USE_MOCK=false` e `VITE_API_URL=https://sua-api...`, e faça **Manual Deploy** para rebuildar.

### Opção B — Manual

1. **New +** → **Web Service** → conecte o repositório.
2. Configure:
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
3. Em **Environment**, adicione:
   - `VITE_USE_MOCK` = `true` (demo) ou `false` (real)
   - `VITE_API_URL` = URL da API (somente se `false`)
   - `NODE_VERSION` = `20.11.1`
4. **Create Web Service**.

> O Render injeta a porta via `process.env.PORT`; o `server.js` já a respeita (com fallback `3000`).

---

## 🎨 Identidade visual

Paleta principal:

| Cor | Hex | Uso |
|---|---|---|
| Verde | `#00A85A` | Marca, ações primárias |
| Navy | `#021433` | Texto, contraste |
| Dourado | `#FFCC00` | Pontos / tickets |
| Vermelho | `#FF383C` | Erros |

Tipografia: **Sora** (títulos) + **Plus Jakarta Sans** (texto/UI).

---

## 📝 Notas

- Sem `localStorage` proibido: a sessão (tokens) é persistida em `localStorage` por ser um app real implantável.
- Acessibilidade: respeita `prefers-reduced-motion` e usa `:focus-visible`.
- O modo demo cobre **todos** os endpoints e simula o minigame, permitindo demonstrar o fluxo completo sem infraestrutura.
