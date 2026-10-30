import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

const signup = vi.fn();

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({ signup, loginWithGoogle: vi.fn() }),
}));

import Signup from '../../components/Signup';

const fill = (container: HTMLElement, confirm: string) => {
  fireEvent.change(screen.getByPlaceholderText('Your full name'), {
    target: { value: 'Asha Rao' },
  });
  fireEvent.change(container.querySelector('input[type="email"]')!, {
    target: { value: 'asha@example.com' },
  });
  const passwords = container.querySelectorAll('input[autocomplete="new-password"]');
  fireEvent.change(passwords[0], { target: { value: 'Str0ng!pass' } });
  fireEvent.change(passwords[1], { target: { value: confirm } });
};

describe('Signup confirm password', () => {
  beforeEach(() => signup.mockReset());

  it('blocks submission when the passwords do not match', () => {
    const { container } = render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );
    fill(container, 'Different!1');
    fireEvent.submit(container.querySelector('form')!);

    expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
    expect(signup).not.toHaveBeenCalled();
  });

  it('submits when the passwords match', () => {
    signup.mockResolvedValue(undefined);
    const { container } = render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );
    fill(container, 'Str0ng!pass');
    fireEvent.submit(container.querySelector('form')!);

    expect(signup).toHaveBeenCalledWith('asha@example.com', 'Str0ng!pass', 'Asha Rao', false);
  });
});
