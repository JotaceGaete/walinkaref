import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import ReferralLandingError from './error';

describe('ReferralLandingError (app/[code]/error.tsx)', () => {
  it('muestra un mensaje genérico sin exponer detalles del error', () => {
    render(<ReferralLandingError />);

    expect(screen.getByText(/no pudimos verificar este enlace/i)).toBeInTheDocument();
  });
});
