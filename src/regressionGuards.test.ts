import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const SRC_DIR = path.resolve(__dirname);

function walk(dir: string, files: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, files);
    } else if (/\.(ts|tsx)$/.test(entry.name) && !/\.test\.(ts|tsx)$/.test(entry.name)) {
      files.push(fullPath);
    }
  }
  return files;
}

describe('sin residuos del código demo "juan-f92ee" en código de producción', () => {
  it('ningún archivo .ts/.tsx de producción (excluyendo *.test.*) contiene el código hardcodeado', () => {
    const offenders = walk(SRC_DIR)
      .filter((file) => fs.readFileSync(file, 'utf-8').includes('juan-f92ee'))
      .map((file) => path.relative(SRC_DIR, file));

    expect(offenders).toEqual([]);
  });
});

describe('la ruta dinámica [code] convive con las rutas estáticas existentes', () => {
  const appDir = path.join(SRC_DIR, 'app');
  const staticRoutes = ['affiliate-dashboard', 'affiliate-resources', 'sign-up-login-screen', 'auth/callback'];

  it('cada ruta estática conserva su propio page.tsx (Next.js siempre prioriza un segmento estático sobre uno dinámico en el mismo nivel, así que ninguna de estas puede ser capturada por [code])', () => {
    for (const route of staticRoutes) {
      expect(fs.existsSync(path.join(appDir, route, 'page.tsx'))).toBe(true);
    }
  });

  it('app/[code]/page.tsx existe en la raíz, al mismo nivel que las rutas estáticas', () => {
    expect(fs.existsSync(path.join(appDir, '[code]', 'page.tsx'))).toBe(true);
  });

  it('la ruta mock anterior (referral-landing-page) ya no existe: fue convertida, no duplicada', () => {
    expect(fs.existsSync(path.join(appDir, 'referral-landing-page'))).toBe(false);
  });
});
