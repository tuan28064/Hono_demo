import React, { useState } from 'react';
import type { CreateUserDto } from '../types';

interface UserFormProps {
  onSubmit: (data: CreateUserDto) => Promise<boolean>;
}

/**
 * 用户创建表单组件
 */
export const UserForm: React.FC<UserFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<CreateUserDto>({
    name: '',
    email: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim()) {
      alert('请填写所有字段');
      return;
    }

    setSubmitting(true);
    const success = await onSubmit(formData);
    setSubmitting(false);

    if (success) {
      // 清空表单
      setFormData({ name: '', email: '' });
    }
  };

  return (
    <div className="user-form">
      <h2>创建新用户</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">姓名:</label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            placeholder="请输入姓名"
            disabled={submitting}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">邮箱:</label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            placeholder="请输入邮箱"
            disabled={submitting}
            required
          />
        </div>

        <button type="submit" disabled={submitting}>
          {submitting ? '创建中...' : '创建用户'}
        </button>
      </form>
    </div>
  );
};
