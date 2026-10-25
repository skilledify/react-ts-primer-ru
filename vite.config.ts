import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const repository = process.env.GITHUB_REPOSITORY
const repositoryName = repository?.split('/')[1]

// На GitHub Pages сайт живёт в подпапке /<repo>/, локально — в корне.
// Значение можно переопределить переменной VITE_BASE.
const base = process.env.VITE_BASE ?? (repositoryName ? `/${repositoryName}/` : '/')

export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
})
