/* © 2026 GraceGrip | Created by IKE/AIKUSAN | MIT License. Attribution is required in all forks. */
import { existsSync } from 'node:fs'
import { spawnSync } from 'node:child_process'

const hasGitDir = existsSync('.git')

if (!hasGitDir) {
  console.log('Skipping git hooks setup because .git is not available in this build environment.')
  process.exit(0)
}

const result = spawnSync('git', ['config', 'core.hooksPath', '.githooks'], {
  stdio: 'inherit',
  shell: process.platform === 'win32',
})

if (result.status !== 0) {
  process.exit(result.status ?? 1)
}
