// Servidor leve para servir o build (SPA) no Render como "Web Service".
// Faz fallback de todas as rotas para index.html (necessario para o React Router).
import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distDir = path.join(__dirname, 'dist')

const app = express()

// Arquivos estaticos (JS/CSS/imagens) com cache agressivo - tem hash no nome.
app.use(
  express.static(distDir, {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('index.html')) {
        res.setHeader('Cache-Control', 'no-cache')
      } else {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
      }
    },
  })
)

// Qualquer outra rota -> index.html (client-side routing).
app.get('*', (_req, res) => {
  res.sendFile(path.join(distDir, 'index.html'))
})

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`🌱 EcoPonto frontend rodando na porta ${port}`)
})
