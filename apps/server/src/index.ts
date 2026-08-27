import { serve } from '@hono/node-server'
import { APP_NAME } from '@personality/shared'
import { Hono } from 'hono'
import { cors } from 'hono/cors'

const app = new Hono()

app.use('*', cors())

app.get('/health', (context) =>
  context.json({
    status: 'ok' as const,
    service: 'personality-server',
    app: APP_NAME,
  }),
)

const port = Number(process.env.PORT ?? 3001)

serve({
  fetch: app.fetch,
  port,
})

console.log(`${APP_NAME} Server listening on http://localhost:${port}`)
