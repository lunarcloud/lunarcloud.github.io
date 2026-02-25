#!/usr/bin/env node

/**
 * Build a "dist" folder for upload
 */

import { cpSync, mkdirSync, rmSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'


const __dirname = dirname(fileURLToPath(import.meta.url))

// Remove and recreate js/lib directory
const distDir = join(__dirname, 'dist')
rmSync(distDir, { recursive: true, force: true })
mkdirSync(distDir, { recursive: true })

/**
 * Copy a file from node_modules to js/lib directory
 * @param {string} source - Source path relative to project root
 */
function distribute (source) {
  const sourcePath = join(__dirname, source)
  const destPath = join(distDir, source)
  cpSync(sourcePath, destPath, { recursive: true })
  console.log(`Copied ${source} -> ${distDir}/${source}`)
}

distribute('animated-dialog')
distribute('audio')
distribute('controllers')
distribute('css')
distribute('font')
distribute('gltf')
distribute('img')
distribute('include-element')
distribute('lib')
distribute('nav-header')
distribute('page-fade')
distribute('project-display')
distribute('3d-showcase.html')
distribute('home-ala-homestar.html')
distribute('home-console.html')
distribute('home-lcars.html')
distribute('icon.png')
distribute('index.html')
distribute('project-list-view.html')
distribute('projects.html')
distribute('ssarette-portfolio.webmanifest')

console.log('All distribution files copied successfully!')
