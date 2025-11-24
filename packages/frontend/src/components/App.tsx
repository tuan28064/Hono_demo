import React from 'react';
import { useUsers } from '../hooks';
import { UserList } from './UserList';
import { UserForm } from './UserForm';
import { UserSearch } from './UserSearch';
import './App.css';

/**
 * 主应用组件
 */
export const App: React.FC = () => {
  const { users, loading, error, createUser, updateUser, deleteUser, refetch } =
    useUsers();

  return (
    <div className="app">
      <header>
        <h1>Hono API 用户管理系统</h1>
        <p>React + TypeScript 客户端示例</p>
      </header>

      <main>
        {/* 创建用户表单 */}
        <section className="section">
          <UserForm onSubmit={createUser} />
        </section>

        {/* 搜索用户 */}
        <section className="section">
          <UserSearch />
        </section>

        {/* 用户列表 */}
        <section className="section">
          <div className="list-header">
            <button onClick={refetch} disabled={loading}>
              {loading ? '刷新中...' : '刷新列表'}
            </button>
          </div>
          <UserList
            users={users}
            loading={loading}
            error={error}
            onUpdate={updateUser}
            onDelete={deleteUser}
          />
        </section>
      </main>

      <footer>
        <p>
          后端 API: <code>http://localhost:3000</code>
        </p>
        <p>使用 Hono 框架构建</p>
      </footer>
    </div>
  );
};
