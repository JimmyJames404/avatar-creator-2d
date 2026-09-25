import { copyFile, mkdir } from 'node:fs/promises';

await mkdir('dist/avatar-demo', { recursive: true });
await copyFile('dist/index.html', 'dist/avatar-demo/index.html');
