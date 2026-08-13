import dotenv from 'dotenv'
dotenv.config()
dotenv.config({ path: '.env.local', override: true })
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite only serves the frontend; the /api routes are Vercel serverless
// functions. Without this the dev server hands back their source code instead
// of running them, so nothing that touches the database works locally.
// This executes each handler in-process with a request/response shim close
// enough to Vercel's for development.
function apiRoutes() {
  return {
    name: 'dev-api-routes',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url.startsWith('/api/')) return next()

        const url = new URL(req.url, 'http://localhost')
        const routeName = url.pathname.replace(/^\/api\//, '').replace(/\/$/, '')
        if (!routeName) return next()

        try {
          const mod = await server.ssrLoadModule(`/api/${routeName}.js`)

          // Routes that opt out of body parsing (e.g. the Stripe webhook, which
          // needs the untouched raw body for signature verification) must get
          // the request stream exactly as Vercel gives it - reading it here
          // first would drain it before the handler's own reader ever attaches.
          const bodyParsingDisabled = mod.config?.api?.bodyParser === false

          if (!bodyParsingDisabled) {
            const body = await new Promise((resolve) => {
              if (req.method === 'GET' || req.method === 'HEAD') return resolve({})
              const chunks = []
              req.on('data', (c) => chunks.push(c))
              req.on('end', () => {
                const raw = Buffer.concat(chunks).toString()
                try {
                  resolve(raw ? JSON.parse(raw) : {})
                } catch {
                  resolve({})
                }
              })
            })
            req.body = body
          }

          req.query = Object.fromEntries(url.searchParams)

          res.status = (code) => { res.statusCode = code; return res }
          res.json = (payload) => {
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(payload))
            return res
          }
          res.send = (payload) => { res.end(String(payload)); return res }

          await mod.default(req, res)
        } catch (err) {
          server.config.logger.error(`[dev-api] ${routeName}: ${err.stack || err}`)
          if (!res.writableEnded) {
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ success: false, message: 'Dev API route error. See the server log.' }))
          }
        }
      })
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), apiRoutes()],
  server: {
    port: 3000,
    host: true
  }
})
