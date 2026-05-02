import { defineConfig } from 'vite'
import { copyFileSync, mkdirSync, readdirSync } from 'fs'
import { join } from 'path'

const isAndroid = process.env.BUILD_TARGET === 'android'

export default defineConfig({
  root: '.',
  base: isAndroid ? './' : '/Nstp3-RPG-project/',
  build: {
    outDir: isAndroid ? 'dist-android' : 'dist',
  },
  plugins: [
    {
      name: 'copy-assets',
      closeBundle() {
        if (!isAndroid) return
        const dest = 'dist-android/assets'
        mkdirSync(dest, { recursive: true })
        for (const file of readdirSync('assets')) {
          copyFileSync(join('assets', file), join(dest, file))
          console.log(`copied: ${file}`)
        }
        console.log('✓ все картинки скопированы в dist-android/assets/')
      }
    }
  ]
})