import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import ResourcesHero from './ResourcesHero';
import { templates } from './CopyTemplates';
import { banners } from './BannerAssets';
import { videos } from './VideoLibrary';

// El valor y el label de cada stat card comparten el mismo <div> padre,
// como hermanos <p>: se busca por label para no ambigüar cuando dos arrays
// (hoy templates y banners) tienen la misma longitud.
function getStatValue(label: string): string | null | undefined {
  return screen.getByText(label).previousElementSibling?.textContent;
}

describe('ResourcesHero', () => {
  it('los conteos de recursos se derivan de los arrays reales, no de números fijos', () => {
    render(<ResourcesHero />);

    expect(getStatValue('Plantillas de texto')).toBe(String(templates.length));
    expect(getStatValue('Banners descargables')).toBe(String(banners.length));
    expect(getStatValue('Videos explicativos')).toBe(String(videos.length));

    const total = templates.length + banners.length + videos.length;
    expect(screen.getByText(`${total} recursos disponibles`)).toBeInTheDocument();
  });

  it('ya no muestra la card "Guías de venta" (sin conteo real coherente detrás)', () => {
    render(<ResourcesHero />);

    expect(screen.queryByText('Guías de venta')).not.toBeInTheDocument();
  });

  it('no muestra el total fijo "24 recursos disponibles" del mock original', () => {
    render(<ResourcesHero />);

    expect(screen.queryByText('24 recursos disponibles')).not.toBeInTheDocument();
  });
});
