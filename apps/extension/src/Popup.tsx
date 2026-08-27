import { createApiClient } from '@personality/api-client'
import { APP_NAME } from '@personality/shared'
import { useMemo, useState } from 'react'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001'
const webUrl = import.meta.env.VITE_WEB_URL ?? 'http://localhost:5173'

export function Popup() {
  const api = useMemo(() => createApiClient({ baseUrl: apiBaseUrl }), [])
  const [serverStatus, setServerStatus] = useState('未检查')

  async function checkServer() {
    setServerStatus('检查中…')

    try {
      const response = await api.health()
      setServerStatus(response.status)
    } catch {
      setServerStatus('连接失败')
    }
  }

  return (
    <main className="popup-shell">
      <p className="eyebrow">QUICK ENTRY</p>
      <h1>{APP_NAME}</h1>
      <p className="copy">浏览器插件只保留快速记录、今日摘要和 AI 入口。</p>

      <div className="status">Server: {serverStatus}</div>

      <div className="actions">
        <button onClick={checkServer}>检查 Server</button>
        <a href={webUrl} target="_blank" rel="noreferrer">
          打开 Web
        </a>
      </div>
    </main>
  )
}
