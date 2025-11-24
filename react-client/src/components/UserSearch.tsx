import React, { useState } from 'react';
import { useUserSearch } from '../hooks';

/**
 * 用户搜索组件
 */
export const UserSearch: React.FC = () => {
  const [searchInput, setSearchInput] = useState('');
  const { results, loading, error, query, search, clear } = useUserSearch();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      search(searchInput.trim());
    }
  };

  const handleClear = () => {
    setSearchInput('');
    clear();
  };

  return (
    <div className="user-search">
      <h2>搜索用户</h2>

      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="输入姓名或邮箱搜索..."
          disabled={loading}
        />
        <button type="submit" disabled={loading || !searchInput.trim()}>
          {loading ? '搜索中...' : '搜索'}
        </button>
        {query && (
          <button type="button" onClick={handleClear}>
            清空
          </button>
        )}
      </form>

      {error && <div className="error">错误: {error}</div>}

      {query && (
        <div className="search-results">
          <h3>
            搜索 "{query}" 的结果 ({results.length})
          </h3>
          {results.length === 0 ? (
            <p>没有找到匹配的用户</p>
          ) : (
            <ul>
              {results.map((user) => (
                <li key={user.id}>
                  <strong>{user.name}</strong> - {user.email}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};
