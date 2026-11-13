import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dataDir = resolve(raiz, 'packages/params/data')
const salida = resolve(raiz, 'apps/web/public/params.json')

const archivos = ['rmv', 'uit', 'afp', 'renta', 'afectaciones', 'normas'] as const

const entradas = await Promise.all(
  archivos.map(async (archivo) => {
    const contenido = await readFile(resolve(dataDir, `${archivo}.json`), 'utf8')
    return [archivo, JSON.parse(contenido)] as const
  }),
)

const payload = {
  version: '0.1.0',
  generadoEl: new Date().toISOString(),
  ...Object.fromEntries(entradas),
}

await mkdir(dirname(salida), { recursive: true })
await writeFile(salida, `${JSON.stringify(payload, null, 2)}\n`, 'utf8')
console.log(`params.json generado en ${salida}`)
