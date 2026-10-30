import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';

const listComplaints = vi.fn();

vi.mock('../../features/complaints/api', () => ({
  complaintsApi: {
    listComplaints: (...args: unknown[]) => listComplaints(...args),
    deleteComplaint: vi.fn(),
  },
}));

import { useComplaints } from '../../features/complaints/hooks/useComplaints';

const page = (ids: string[], totalPages = 2) => ({
  complaints: ids.map((_id) => ({ _id })),
  totalPages,
});

describe('useComplaints', () => {
  beforeEach(() => {
    listComplaints.mockReset();
  });

  it('fetches the first page exactly once on mount', async () => {
    listComplaints.mockResolvedValue(page(['a', 'b']));

    const { result } = renderHook(() => useComplaints('token'));

    await waitFor(() => expect(result.current.loading).toBe(false));
    // Give any follow-up effects a chance to fire before asserting
    await new Promise((resolve) => setTimeout(resolve, 20));

    expect(listComplaints).toHaveBeenCalledTimes(1);
    expect(result.current.complaints.map((c) => c._id)).toEqual(['a', 'b']);
  });

  it('appends the next page once without duplicating it', async () => {
    listComplaints.mockResolvedValueOnce(page(['a', 'b'])).mockResolvedValueOnce(page(['c']));

    const { result } = renderHook(() => useComplaints('token'));
    await waitFor(() => expect(result.current.complaints).toHaveLength(2));

    act(() => result.current.setPage(2));

    await waitFor(() => expect(result.current.complaints).toHaveLength(3));
    await new Promise((resolve) => setTimeout(resolve, 20));

    expect(listComplaints).toHaveBeenCalledTimes(2);
    expect(result.current.complaints.map((c) => c._id)).toEqual(['a', 'b', 'c']);
  });
});
