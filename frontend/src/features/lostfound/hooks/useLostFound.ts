import { useState, useEffect, useCallback, useRef } from 'react';
import { LostFoundItem, LostFoundFilters } from '../types';
import { lostFoundApi } from '../api';

export const useLostFound = (token: string | null) => {
  const [items, setItems] = useState<LostFoundItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);

  const [filters, setFilters] = useState<LostFoundFilters>({
    type: 'all',
    resolved: 'all',
    search: '',
    page: 1,
  });

  const itemsPerPage = 9;
  // Tracks whether the first page has loaded, so later fetches show the lighter "filtering"
  // state. A ref (not list length) keeps fetch callbacks stable and avoids duplicate requests.
  const hasLoadedRef = useRef(false);

  const fetchItems = useCallback(async (currentFilters: LostFoundFilters, isMore = false) => {
    if (!token) return;

    try {
      if (!isMore) {
        if (currentFilters.page === 1 && !hasLoadedRef.current) {
          setLoading(true);
        } else {
          setIsFiltering(true);
        }
      } else {
        setIsFetchingMore(true);
      }

      setError(null);
      const data = await lostFoundApi.listItems(token, currentFilters, itemsPerPage);

      if (isMore) {
        setItems(prev => [...prev, ...data.items]);
      } else {
        setItems(data.items);
      }
      setTotalPages(data.totalPages);
      hasLoadedRef.current = true;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch items');
    } finally {
      setLoading(false);
      setIsFiltering(false);
      setIsFetchingMore(false);
    }
  }, [token]);

  useEffect(() => {
    fetchItems(filters);
  }, [token, filters.type, filters.resolved, filters.search, fetchItems]);

  useEffect(() => {
    if (filters.page > 1) {
      fetchItems(filters, true);
    }
  }, [filters.page, fetchItems]);

  const setPage = useCallback((page: number) => {
    setFilters(prev => ({ ...prev, page }));
  }, []);

  const updateFilters = useCallback((newFilters: Partial<LostFoundFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  }, []);

  const refresh = useCallback(() => {
    fetchItems(filters);
  }, [fetchItems, filters]);

  const markAsResolved = useCallback(async (id: string) => {
    if (!token) return;
    try {
      await lostFoundApi.resolveItem(token, id);
      setItems(prev => prev.map(item => item._id === id ? { ...item, resolved: true } : item));
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to resolve item');
      return false;
    }
  }, [token]);

  const removeItem = useCallback(async (id: string) => {
    if (!token) return;
    try {
      await lostFoundApi.deleteItem(token, id);
      setItems(prev => prev.filter(item => item._id !== id));
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to delete item');
      return false;
    }
  }, [token]);

  return {
    items,
    loading,
    error,
    totalPages,
    isFetchingMore,
    isFiltering,
    filters,
    updateFilters,
    setPage,
    refresh,
    markAsResolved,
    removeItem,
  };
};
