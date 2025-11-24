import { useState, useEffect, useCallback } from 'react';
import { userApi } from '../api';
import type { User, CreateUserDto, UpdateUserDto } from '../types';

/**
 * 用户管理 Hook
 * 提供完整的用户 CRUD 操作和状态管理
 */
export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * 获取所有用户
   */
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await userApi.getAll();

      if (response.success) {
        setUsers(response.data);
      } else {
        setError(response.message || '获取用户列表失败');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知错误');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 创建用户
   */
  const createUser = useCallback(
    async (data: CreateUserDto): Promise<boolean> => {
      try {
        setError(null);
        const response = await userApi.create(data);

        if (response.success) {
          setUsers((prev) => [...prev, response.data]);
          return true;
        } else {
          setError(response.message || '创建用户失败');
          return false;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : '未知错误');
        return false;
      }
    },
    []
  );

  /**
   * 更新用户
   */
  const updateUser = useCallback(
    async (id: number, data: UpdateUserDto): Promise<boolean> => {
      try {
        setError(null);
        const response = await userApi.update(id, data);

        if (response.success) {
          setUsers((prev) =>
            prev.map((user) => (user.id === id ? response.data : user))
          );
          return true;
        } else {
          setError(response.message || '更新用户失败');
          return false;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : '未知错误');
        return false;
      }
    },
    []
  );

  /**
   * 删除用户
   */
  const deleteUser = useCallback(async (id: number): Promise<boolean> => {
    try {
      setError(null);
      const response = await userApi.delete(id);

      if (response.success) {
        setUsers((prev) => prev.filter((user) => user.id !== id));
        return true;
      } else {
        setError(response.message || '删除用户失败');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知错误');
      return false;
    }
  }, []);

  // 组件挂载时获取用户列表
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    createUser,
    updateUser,
    deleteUser,
    refetch: fetchUsers,
  };
}
