import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { Client } from '@modelcontextprotocol/client'
import {
  StdioClientTransport,
  type StdioServerParameters,
} from '@modelcontextprotocol/client/stdio'

type ServerConfig = {
  command: string
  args?: string[]
  env?: Record<string, string>
}

type OpenDesignConfigFile = {
  context_servers?: Record<string, ServerConfig & { source?: string }>
  mcpServers?: Record<string, ServerConfig>
  command?: string
  args?: string[]
  env?: Record<string, string>
}

const DEFAULT_CONFIG_PATH = path.resolve('.opendesign.mcp.local.json')

function processEnv(): Record<string, string> {
  return Object.fromEntries(
    Object.entries(process.env).filter(
      (entry): entry is [string, string] => entry[1] !== undefined,
    ),
  )
}

function windowsPathToWsl(value: string): string {
  if (process.platform === 'win32') return value
  const match = /^([a-zA-Z]):\\(.*)$/.exec(value)
  if (!match) return value

  const [, drive, rest] = match
  return `/mnt/${drive.toLowerCase()}/${rest.replace(/\\/g, '/')}`
}

function buildWslEnv(
  configEnv: Record<string, string>,
): Record<string, string> {
  const env = { ...processEnv(), ...configEnv }

  if (process.platform === 'win32' || Object.keys(configEnv).length === 0) {
    return env
  }

  // WSL does not pass arbitrary Linux child-process env vars to Windows
  // executables. WSLENV explicitly forwards the OpenDesign variables while
  // preserving their Windows-formatted values.
  const existing = (process.env.WSLENV ?? '').split(':').filter(Boolean)
  const forwarded = new Set(existing.map((entry) => entry.split('/')[0]))
  const additions = Object.keys(configEnv).filter((key) => !forwarded.has(key))

  env.WSLENV = [...existing, ...additions].join(':')
  return env
}

function toTransportConfig(config: ServerConfig): StdioServerParameters {
  const env = config.env ?? {}

  return {
    command: windowsPathToWsl(config.command),
    args: config.args ?? [],
    env: buildWslEnv(env),
    stderr: 'pipe',
  }
}

async function loadConfig(): Promise<ServerConfig> {
  const configPath = path.resolve(
    process.env.OPENDESIGN_MCP_CONFIG ?? DEFAULT_CONFIG_PATH,
  )
  const raw = JSON.parse(
    await fs.readFile(configPath, 'utf8'),
  ) as OpenDesignConfigFile
  const config =
    raw.context_servers?.['open-design'] ??
    raw.mcpServers?.['open-design'] ??
    raw

  if (!config.command) {
    throw new Error(`Missing OpenDesign MCP command in ${configPath}`)
  }

  return {
    command: config.command,
    args: config.args ?? [],
    env: config.env ?? {},
  }
}

async function withClient<T>(run: (client: Client) => Promise<T>): Promise<T> {
  const config = await loadConfig()
  const client = new Client({
    name: 'personality-opendesign',
    version: '0.1.0',
  })
  const transport = new StdioClientTransport(toTransportConfig(config))

  transport.stderr?.on('data', (chunk) => {
    process.stderr.write(`[OpenDesign] ${String(chunk)}`)
  })

  try {
    await client.connect(transport)
    return await run(client)
  } finally {
    await client.close().catch(() => undefined)
  }
}

function printResult(value: unknown): void {
  console.log(JSON.stringify(value, null, 2))
}

async function main(): Promise<void> {
  const [command = 'test', ...args] = process.argv.slice(2)

  if (command === 'test' || command === 'tools') {
    await withClient(async (client) => {
      const { tools } = await client.listTools()

      if (command === 'tools') {
        printResult(tools)
        return
      }

      const names = tools.map((tool) => tool.name)
      const expected = ['search_files', 'get_file', 'get_artifact']
      const missing = expected.filter((name) => !names.includes(name))

      console.log(`OpenDesign MCP connected. ${tools.length} tools available.`)
      console.log(`Tools: ${names.join(', ')}`)

      if (missing.length > 0) {
        throw new Error(
          `Connected, but expected read tools are missing: ${missing.join(', ')}`,
        )
      }
    })
    return
  }

  if (command === 'call') {
    const [toolName, jsonArguments = '{}'] = args
    if (!toolName) {
      throw new Error('Usage: pnpm od:call -- <tool-name> \'{"key":"value"}\'')
    }

    const toolArguments = JSON.parse(jsonArguments) as Record<string, unknown>
    await withClient(async (client) => {
      const result = await client.callTool({
        name: toolName,
        arguments: toolArguments,
      })
      printResult(result)
    })
    return
  }

  throw new Error(`Unknown command: ${command}. Use test, tools, or call.`)
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
