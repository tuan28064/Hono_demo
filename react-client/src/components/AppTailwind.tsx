import React from 'react';
import { useUsers } from '../hooks';
import { UserList } from './UserList';
import { UserForm } from './UserForm';
import { UserSearch } from './UserSearch';

/**
 * 主应用组件 - Tailwind CSS 版本
 */
export const AppTailwind: React.FC = () => {
  const { users, loading, error, createUser, updateUser, deleteUser, refetch } =
    useUsers();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <header className="bg-gradient-to-r from-green-500 to-green-600 text-white py-8 px-6 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">
            Hono API 用户管理系统
          </h1>
          <p className="text-green-100 text-lg">
            React + TypeScript + Tailwind CSS 客户端示例
          </p>
        </div>
      </header>

      {/* 主内容 */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* 创建用户表单 */}
        <section className="bg-white rounded-lg shadow-md p-6">
          <UserForm onSubmit={createUser} />
        </section>

        {/* 搜索用户 */}
        <section className="bg-white rounded-lg shadow-md p-6">
          <UserSearch />
        </section>

        {/* 用户列表 */}
        <section className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              用户列表 ({users.length})
            </h2>
            <button
              onClick={refetch}
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
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

      {/* 页脚 */}
      <footer className="bg-white border-t border-gray-200 mt-12 py-6">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-600">
          <p className="mb-2">
            后端 API:{' '}
            <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
              http://localhost:3000
            </code>
          </p>
          <p className="text-sm">使用 Hono 框架 + Tailwind CSS 构建</p>
        </div>
      </footer>
    </div>
  );
};
