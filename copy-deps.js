#!/usr/bin/env node

/**
 * Copy third-party dependencies from node_modules to js/lib directory
 * This script replaces the previous copy-deps.sh shell script
 */

import { cpSync, mkdirSync, rmSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Remove and recreate js/lib directory
const libDir = join(__dirname, 'lib')
rmSync(libDir, { recursive: true, force: true })
mkdirSync(libDir, { recursive: true })

/**
 * Copy a file from node_modules to js/lib directory
 * @param {string} source - Source path relative to project root
 * @param {string} destination - Destination filename in js/lib directory
 */
function copyDependency (source, destination) {
  const sourcePath = join(__dirname, source)
  const destPath = join(libDir, destination)
  cpSync(sourcePath, destPath, { recursive: true })
  console.log(`Copied ${source} -> lib/${destination}`)
}

// gamepad library
copyDependency('node_modules/gameinputjs', 'gameinputjs')

console.log('All dependencies copied successfully!')
