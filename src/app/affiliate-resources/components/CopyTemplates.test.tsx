import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import CopyTemplates, { templates } from './CopyTemplates';

const REAL_LINK = 'https://ref.walinka.com/jota-f92ee';

describe('CopyTemplates', () => {
  beforeEach(() => {
    Object.assign(navigator, { clipboard: { writeText: vi.fn().mockResolvedValue(undefined) } });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('nunca contiene el enlace hardcodeado "juan-f92ee" en el código fuente de las plantillas', () => {
    const rawText = templates.map((t) => t.text).join('\n');
    expect(rawText).not.toContain('juan-f92ee');
  });

  it('con el enlace real cargado, las 4 plantillas con enlace lo interpolan correctamente', () => {
    render(<CopyTemplates referralLink={REAL_LINK} loading={false} error={false} onRetry={vi.fn()} />);

    // Canal por defecto: WhatsApp. tpl-whatsapp-1 tiene enlace.
    expect(screen.getByText(new RegExp(REAL_LINK.replace(/\./g, '\\.')))).toBeInTheDocument();

    // Instagram y Email también deben interpolar el enlace real.
    fireEvent.click(screen.getByRole('button', { name: 'Instagram' }));
    expect(screen.getByText(new RegExp(REAL_LINK.replace(/\./g, '\\.')))).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Email' }));
    // Email tiene 2 plantillas, ambas con enlace.
    expect(screen.getAllByText(new RegExp(REAL_LINK.replace(/\./g, '\\.'))).length).toBeGreaterThanOrEqual(2);
  });

  it('nunca renderiza "juan-f92ee" en pantalla, con ningún canal activo', () => {
    render(<CopyTemplates referralLink={REAL_LINK} loading={false} error={false} onRetry={vi.fn()} />);

    for (const channel of ['WhatsApp', 'Instagram', 'Email']) {
      fireEvent.click(screen.getByRole('button', { name: channel }));
      expect(screen.queryByText(/juan-f92ee/)).not.toBeInTheDocument();
    }
  });

  it('el botón Copiar copia el texto ya con el enlace real interpolado', () => {
    render(<CopyTemplates referralLink={REAL_LINK} loading={false} error={false} onRetry={vi.fn()} />);

    const [firstCopyButton] = screen.getAllByRole('button', { name: /copiar/i });
    fireEvent.click(firstCopyButton);

    expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(1);
    const copiedText = (navigator.clipboard.writeText as ReturnType<typeof vi.fn>).mock.calls[0][0] as string;
    expect(copiedText).toContain(REAL_LINK);
    expect(copiedText).not.toContain('juan-f92ee');
    expect(copiedText).not.toContain('{{REFERRAL_LINK}}');
  });

  it('mientras el enlace está cargando, no inserta ningún enlace ficticio y no se puede copiar', () => {
    render(<CopyTemplates referralLink={null} loading error={false} onRetry={vi.fn()} />);

    expect(screen.queryByText(/ref\.walinka\.com/)).not.toBeInTheDocument();
    expect(screen.queryByText(/juan-f92ee/)).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /copiar/i })).not.toBeInTheDocument();
  });

  it('en error, muestra el mensaje y el botón Reintentar en vez de un enlace inventado', () => {
    const onRetry = vi.fn();
    render(<CopyTemplates referralLink={null} loading={false} error onRetry={onRetry} />);

    expect(screen.getByText(/no pudimos cargar tu enlace/i)).toBeInTheDocument();
    expect(screen.queryByText(/ref\.walinka\.com/)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /reintentar/i }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
