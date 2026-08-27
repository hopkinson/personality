#!/usr/bin/env node

import { createApiClient } from '@personality/api-client'
import { APP_NAME } from '@personality/shared'
import { Command } from 'commander'

const program = new Command()
const apiBaseUrl = process.env.PERSONALITY_API_BASE_URL ?? 'http://localhost:3001'

program
  .name('personality')
  .description(`${APP_NAME} command line client`)
  .version('0.1.0')

program
  .command('doctor')
  .description('Check whether the PERSONALITY Server is reachable')
  .action(async () => {
    const api = createApiClient({ baseUrl: apiBaseUrl })

    try {
      const response = await api.health()
      console.log(`${response.app}: ${response.service} is ${response.status}`)
    } catch (error) {
      console.error(
        `Unable to reach PERSONALITY Server at ${apiBaseUrl}`,
        error instanceof Error ? error.message : error,
      )
      process.exitCode = 1
    }
  })

await program.parseAsync(process.argv)
