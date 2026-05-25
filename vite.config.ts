import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { execSync } from 'child_process'
import { watch } from 'fs'
import { resolve } from 'path'

const OBSIDIAN_KNOWLEDGE = 'D:\\杂物\\obsidian\\cangku\\大虾\\knowledge'
const SYNC_SCRIPT = resolve(__dirname, 'scripts', 'sync-obsidian.cjs')

function obsidianWatchPlugin(): Plugin {
  return {
    name: 'obsidian-watch',
    configureServer(server) {
      const run = () => {
        try {
          execSync(`node "${SYNC_SCRIPT}"`, { stdio: 'pipe' })
          server.ws.send({ type: 'full-reload' })
        } catch { /* vault not found, skip */ }
      }
      try {
        watch(OBSIDIAN_KNOWLEDGE, { recursive: true }, (_event, _filename) => {
          if (_filename?.endsWith('.md')) run()
        })
      } catch { /* vault not found, skip */ }
    },
  }
}

export default defineConfig({
  plugins: [obsidianWatchPlugin(), react(), tailwindcss()],
  base: './',
})
