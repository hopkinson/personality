import { createApiClient } from '@personality/api-client'
import { APP_NAME } from '@personality/shared'
import { useMemo, useState } from 'react'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001'

export function App() {
  const api = useMemo(() => createApiClient({ baseUrl: apiBaseUrl }), [])
  const [serverStatus, setServerStatus] = useState('未检查')

  async function checkServer() {
    setServerStatus('检查中…')

    try {
      const response = await api.health()
      setServerStatus(`${response.service}: ${response.status}`)
    } catch {
      setServerStatus('连接失败，请确认 Server 已启动')
    }
  }

  return (
    <main className="page-shell">
      <section className="hero-card">
        <p className="eyebrow">MONOREPO FOUNDATION</p>
        <h1>{APP_NAME}</h1>
        <p className="description">
          Web、Browser Extension、CLI 与 Server 共用 shared、api-client 与统一工程配置。
        </p>

        <div className="status-row">
          <span>API: {apiBaseUrl}</span>
          <span>Server: {serverStatus}</span>
        </div>

        <button className="primary-button" onClick={checkServer}>
          检查 Server
        </button>
      </section>
    </main>
  )
}
