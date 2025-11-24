import React, { useState } from 'react';
import type { User, UpdateUserDto } from '../types';

interface UserListProps {
  users: User[];
  loading: boolean;
  error: string | null;
  onUpdate: (id: number, data: UpdateUserDto) => Promise<boolean>;
  onDelete: (id: number) => Promise<boolean>;
}

/**
 * 用户列表组件
 */
export const UserList: React.FC<UserListProps> = ({
  users,
  loading,
  error,
  onUpdate,
  onDelete,
}) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<UpdateUserDto>({});

  // 开始编辑
  const handleEdit = (user: User) => {
    setEditingId(user.id);
    setEditForm({ name: user.name, email: user.email });
  };

  // 取消编辑
  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  // 保存编辑
  const handleSave = async (id: number) => {
    const success = await onUpdate(id, editForm);
    if (success) {
      setEditingId(null);
      setEditForm({});
    }
  };

  // 删除用户
  const handleDelete = async (id: number, name: string) => {
    if (window.confirm(`确定要删除用户 "${name}" 吗？`)) {
      await onDelete(id);
    }
  };

  if (loading) {
    return <div className="loading">加载中...</div>;
  }

  if (error) {
    return <div className="error">错误: {error}</div>;
  }

  if (users.length === 0) {
    return <div className="empty">暂无用户数据</div>;
  }

  return (
    <div className="user-list">
      <h2>用户列表 ({users.length})</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>姓名</th>
            <th>邮箱</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>
                {editingId === user.id ? (
                  <input
                    type="text"
                    value={editForm.name || ''}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                    placeholder="姓名"
                  />
                ) : (
                  user.name
                )}
              </td>
              <td>
                {editingId === user.id ? (
                  <input
                    type="email"
                    value={editForm.email || ''}
                    onChange={(e) =>
                      setEditForm({ ...editForm, email: e.target.value })
                    }
                    placeholder="邮箱"
                  />
                ) : (
                  user.email
                )}
              </td>
              <td>
                {editingId === user.id ? (
                  <>
                    <button onClick={() => handleSave(user.id)}>保存</button>
                    <button onClick={handleCancel}>取消</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEdit(user)}>编辑</button>
                    <button onClick={() => handleDelete(user.id, user.name)}>
                      删除
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
