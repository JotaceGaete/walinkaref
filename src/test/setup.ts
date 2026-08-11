import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

// vitest.config.ts corre con test.globals desactivado (a propósito, para no
// depender de tipos globales de vitest) — sin esto, @testing-library/react
// no detecta un `afterEach` global y no limpia el DOM entre tests, filtrando
// el render de un test hacia el siguiente.
afterEach(() => {
  cleanup();
});
