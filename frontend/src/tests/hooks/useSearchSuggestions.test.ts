import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSearchSuggestions } from '../../hooks/useSearchSuggestions';

const items = [{ title: 'Blue bottle' }, { title: 'Black wallet' }];
const buildSuggestions = (item: { title: string }, q: string) =>
  item.title.toLowerCase().includes(q) ? [item.title] : [];

describe('useSearchSuggestions', () => {
  it('stays closed when the search term changes because a suggestion was picked', () => {
    const { result, rerender } = renderHook(
      ({ searchInput }) => useSearchSuggestions({ searchInput, items, buildSuggestions }),
      { initialProps: { searchInput: 'bl' } }
    );

    expect(result.current.showSuggestions).toBe(true);

    // Mirrors the page handlers: mark the selection, close, then apply the new term
    act(() => {
      result.current.markSuggestionSelection();
      result.current.setShowSuggestions(false);
    });
    rerender({ searchInput: 'Blue bottle' });

    expect(result.current.showSuggestions).toBe(false);
  });

  it('opens again for a typed search after a selection', () => {
    const { result, rerender } = renderHook(
      ({ searchInput }) => useSearchSuggestions({ searchInput, items, buildSuggestions }),
      { initialProps: { searchInput: 'bl' } }
    );

    act(() => {
      result.current.markSuggestionSelection();
      result.current.setShowSuggestions(false);
    });
    rerender({ searchInput: 'Blue bottle' });
    rerender({ searchInput: 'wal' });

    expect(result.current.showSuggestions).toBe(true);
    expect(result.current.filteredSuggestions).toEqual(['Black wallet']);
  });
});
