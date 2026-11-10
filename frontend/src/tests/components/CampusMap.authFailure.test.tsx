import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';

vi.mock('@react-google-maps/api', () => ({
  useLoadScript: () => ({ isLoaded: false, loadError: undefined }),
  GoogleMap: () => null,
  InfoWindow: () => null,
}));

describe('CampusMap with a rejected Google Maps key', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it('switches to the simplified map when Google calls gm_authFailure', async () => {
    vi.stubEnv('VITE_GOOGLE_MAPS_API_KEY', 'bad-key');
    const { default: CampusMap } = await import('../../features/map/components/CampusMap');
    render(<CampusMap />);

    expect(screen.queryByText(/simplified campus map/i)).toBeNull();
    const w = window as Window & { gm_authFailure?: () => void };
    expect(typeof w.gm_authFailure).toBe('function');

    act(() => w.gm_authFailure?.());

    expect(screen.getByText(/simplified campus map/i)).toBeTruthy();
  });
});
