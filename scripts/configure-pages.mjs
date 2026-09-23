/* © 2026 GraceGrip | Created by IKE/AIKUSAN | MIT License */
import { writeFile } from 'node:fs/promises'

const required = [
  'CLOUDFLARE_PAGES_PROJECT',
  'D1_PRODUCTION_DATABASE_ID',
  'D1_PREVIEW_DATABASE_ID',
]
const missing = required.filter((name) => !process.env[name])
if (missing.length) {
  console.error(`Pages configuration needs: ${missing.join(', ')}`)
  process.exit(1)
}

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const productionId = process.env.D1_PRODUCTION_DATABASE_ID
const previewId = process.env.D1_PREVIEW_DATABASE_ID
const project = process.env.CLOUDFLARE_PAGES_PROJECT

if (!uuid.test(productionId) || !uuid.test(previewId) || productionId === previewId) {
  console.error('Production and preview D1 IDs must be distinct UUIDs.')
  process.exit(1)
}
if (!/^[a-z0-9][a-z0-9-]*$/.test(project)) {
  console.error('CLOUDFLARE_PAGES_PROJECT must be a Cloudflare Pages project name.')
  process.exit(1)
}

function binding(name, id) {
  return {
    binding: 'FEEDBACK_DB',
    database_name: name,
    database_id: id,
    migrations_dir: 'd1/migrations',
  }
}

const config = {
  $schema: './node_modules/wrangler/config-schema.json',
  name: project,
  pages_build_output_dir: './out',
  compatibility_date: '2026-09-23',
  compatibility_flags: ['nodejs_compat'],
  d1_databases: [binding('gracegrip-feedback-production', productionId)],
  env: {
    preview: {
      d1_databases: [binding('gracegrip-feedback-preview', previewId)],
    },
  },
}

await writeFile('wrangler.jsonc', `${JSON.stringify(config, null, 2)}\n`, { mode: 0o600 })
console.log('Generated local Wrangler config with separate production and preview D1 bindings.')
