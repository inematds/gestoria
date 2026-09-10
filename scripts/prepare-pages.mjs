import { cpSync, writeFileSync } from 'node:fs';

// O app é compilado pelo Vite; guia e capa permanecem arquivos estáticos.
for (const directory of ['guia', 'capa']) {
  cpSync(directory, `dist/${directory}`, { recursive: true });
}
writeFileSync('dist/.nojekyll', '');
console.log('Pages preparado: aplicativo, guia e capa em dist/.');
