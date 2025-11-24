import { useState, useCallback } from 'react';
import { userApi } from '../api';
import type { User } from '../types';

/**
 * 用户搜索 Hook
 */
export function useUserSearch() {
  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState<string>('');

  /**
   * 搜索用户
   */
  const search = useCallback(async (searchQuery: string, limit: number = 10) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setQuery('');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setQuery(searchQuery);

      const response = await userApi.search(searchQuery, limit);

      if (response.success) {
        setResults(response.data.results);
      } else {
        setError(response.message || '搜索失败');
        setResults([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知错误');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 清空搜索结果
   */
  const clear = useCallback(() => {
    setResults([]);
    setQuery('');
    setError(null);
  }, []);

  return {
    results,
    loading,
    error,
    query,
    search,
    clear,
  };
}
