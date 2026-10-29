import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, act } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import ScrollToTop from '../../components/common/ScrollToTop';

let navigateRef: ReturnType<typeof useNavigate> | null = null;
const CaptureNavigate = () => {
  navigateRef = useNavigate();
  return null;
};

describe('ScrollToTop', () => {
  beforeEach(() => {
    window.scrollTo = vi.fn() as unknown as typeof window.scrollTo;
  });

  it('scrolls to the top whenever the route path changes', () => {
    render(
      <MemoryRouter initialEntries={['/home']}>
        <ScrollToTop />
        <CaptureNavigate />
      </MemoryRouter>
    );
    expect(window.scrollTo).toHaveBeenCalledTimes(1);

    act(() => navigateRef!('/events'));
    expect(window.scrollTo).toHaveBeenCalledTimes(2);
    expect(window.scrollTo).toHaveBeenLastCalledWith({ top: 0, left: 0, behavior: 'auto' });
  });

  it('leaves in-page anchor navigation to the browser', () => {
    render(
      <MemoryRouter initialEntries={['/home']}>
        <ScrollToTop />
        <CaptureNavigate />
      </MemoryRouter>
    );

    act(() => navigateRef!('/home#features'));
    expect(window.scrollTo).toHaveBeenCalledTimes(1);
  });
});
