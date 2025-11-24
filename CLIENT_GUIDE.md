# 客户端调用 API 指南

本指南展示如何在不同的客户端环境中调用 Hono API。

## 📋 目录

1. [原生 JavaScript (fetch)](#1-原生-javascript-fetch)
2. [使用 axios](#2-使用-axios)
3. [React 中使用](#3-react-中使用)
4. [Vue 3 中使用](#4-vue-3-中使用)
5. [jQuery](#5-jquery)
6. [React Native](#6-react-native)
7. [错误处理](#7-错误处理)

---

## 1. 原生 JavaScript (fetch)

### 获取所有用户

```javascript
async function getAllUsers() {
  const response = await fetch('http://localhost:3000/users');
  const data = await response.json();
  console.log(data);
  // { success: true, data: [...], total: 3 }
}
```

### 获取单个用户

```javascript
async function getUser(id) {
  const response = await fetch(`http://localhost:3000/users/${id}`);
  const data = await response.json();

  if (!response.ok) {
    console.error('用户不存在');
    return;
  }

  console.log(data);
  // { success: true, data: { id: 1, name: "张三", ... } }
}
```

### 创建用户

```javascript
async function createUser(name, email) {
  const response = await fetch('http://localhost:3000/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email }),
  });

  const data = await response.json();

  if (response.ok) {
    console.log('创建成功:', data);
  } else {
    console.error('创建失败:', data.message);
  }
}

// 使用
createUser('新用户', 'newuser@example.com');
```

### 更新用户

```javascript
async function updateUser(id, updates) {
  const response = await fetch(`http://localhost:3000/users/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });

  const data = await response.json();
  return data;
}

// 使用 - 只更新名字
updateUser(1, { name: '新名字' });

// 只更新邮箱
updateUser(1, { email: 'new@example.com' });

// 同时更新
updateUser(1, { name: '新名字', email: 'new@example.com' });
```

### 删除用户

```javascript
async function deleteUser(id) {
  const response = await fetch(`http://localhost:3000/users/${id}`, {
    method: 'DELETE',
  });

  const data = await response.json();

  if (response.ok) {
    console.log('删除成功');
  } else {
    console.error('删除失败:', data.message);
  }
}
```

### 搜索用户

```javascript
async function searchUsers(query, limit = 10) {
  const params = new URLSearchParams({
    q: query,
    limit: limit.toString(),
  });

  const response = await fetch(`http://localhost:3000/search?${params}`);
  const data = await response.json();

  console.log(`找到 ${data.total} 个结果`);
  console.log(data.results);
}

// 使用
searchUsers('张', 5);
```

---

## 2. 使用 axios

### 安装

```bash
npm install axios
```

### 基础配置

```javascript
import axios from 'axios';

// 创建 axios 实例
const api = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 响应拦截器
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API 错误:', error.response?.data?.message);
    return Promise.reject(error);
  }
);
```

### API 调用

```javascript
// 获取所有用户
const users = await api.get('/users');

// 获取单个用户
const user = await api.get(`/users/${id}`);

// 创建用户
const newUser = await api.post('/users', {
  name: '新用户',
  email: 'new@example.com',
});

// 更新用户
const updated = await api.put(`/users/${id}`, {
  name: '更新后的名字',
});

// 删除用户
await api.delete(`/users/${id}`);

// 搜索用户
const results = await api.get('/search', {
  params: { q: '张', limit: 10 },
});
```

---

## 3. React 中使用

### 使用 useState 和 useEffect

```jsx
import { useState, useEffect } from 'react';

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 获取用户列表
  useEffect(() => {
    fetch('http://localhost:3000/users')
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // 创建用户
  const handleCreate = async (name, email) => {
    const response = await fetch('http://localhost:3000/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email }),
    });

    const data = await response.json();

    if (response.ok) {
      setUsers([...users, data.data]);
    }
  };

  // 更新用户
  const handleUpdate = async (id, updates) => {
    const response = await fetch(`http://localhost:3000/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });

    const data = await response.json();

    if (response.ok) {
      setUsers(users.map((u) => (u.id === id ? data.data : u)));
    }
  };

  // 删除用户
  const handleDelete = async (id) => {
    const response = await fetch(`http://localhost:3000/users/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      setUsers(users.filter((u) => u.id !== id));
    }
  };

  if (loading) return <div>加载中...</div>;
  if (error) return <div>错误: {error}</div>;

  return (
    <div>
      <h1>用户列表</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} - {user.email}
            <button onClick={() => handleUpdate(user.id, { name: '新名字' })}>
              更新
            </button>
            <button onClick={() => handleDelete(user.id)}>删除</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### 使用自定义 Hook

```jsx
// hooks/useUsers.js
import { useState, useEffect } from 'react';

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:3000/users');
      const data = await response.json();
      setUsers(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const createUser = async (name, email) => {
    const response = await fetch('http://localhost:3000/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email }),
    });
    const data = await response.json();
    if (response.ok) {
      setUsers([...users, data.data]);
    }
    return data;
  };

  const updateUser = async (id, updates) => {
    const response = await fetch(`http://localhost:3000/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    const data = await response.json();
    if (response.ok) {
      setUsers(users.map((u) => (u.id === id ? data.data : u)));
    }
    return data;
  };

  const deleteUser = async (id) => {
    const response = await fetch(`http://localhost:3000/users/${id}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      setUsers(users.filter((u) => u.id !== id));
    }
  };

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

// 使用
function App() {
  const { users, loading, createUser, deleteUser } = useUsers();

  if (loading) return <div>加载中...</div>;

  return (
    <div>
      {users.map((user) => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}
```

---

## 4. Vue 3 中使用

### 使用 Composition API

```vue
<template>
  <div>
    <h1>用户列表</h1>

    <div v-if="loading">加载中...</div>
    <div v-else-if="error">错误: {{ error }}</div>

    <div v-else>
      <ul>
        <li v-for="user in users" :key="user.id">
          {{ user.name }} - {{ user.email }}
          <button @click="updateUser(user.id, { name: '新名字' })">更新</button>
          <button @click="deleteUser(user.id)">删除</button>
        </li>
      </ul>

      <form @submit.prevent="handleCreate">
        <input v-model="newUser.name" placeholder="名字" required />
        <input v-model="newUser.email" type="email" placeholder="邮箱" required />
        <button type="submit">创建用户</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const users = ref([]);
const loading = ref(true);
const error = ref(null);
const newUser = ref({ name: '', email: '' });

const API_BASE = 'http://localhost:3000';

// 获取用户列表
async function fetchUsers() {
  try {
    const response = await fetch(`${API_BASE}/users`);
    const data = await response.json();
    users.value = data.data;
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
}

// 创建用户
async function handleCreate() {
  try {
    const response = await fetch(`${API_BASE}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser.value),
    });

    const data = await response.json();

    if (response.ok) {
      users.value.push(data.data);
      newUser.value = { name: '', email: '' };
    }
  } catch (err) {
    error.value = err.message;
  }
}

// 更新用户
async function updateUser(id, updates) {
  try {
    const response = await fetch(`${API_BASE}/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });

    const data = await response.json();

    if (response.ok) {
      const index = users.value.findIndex((u) => u.id === id);
      if (index !== -1) {
        users.value[index] = data.data;
      }
    }
  } catch (err) {
    error.value = err.message;
  }
}

// 删除用户
async function deleteUser(id) {
  if (!confirm('确定要删除吗？')) return;

  try {
    const response = await fetch(`${API_BASE}/users/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      users.value = users.value.filter((u) => u.id !== id);
    }
  } catch (err) {
    error.value = err.message;
  }
}

onMounted(() => {
  fetchUsers();
});
</script>
```

---

## 5. jQuery

```javascript
// 获取所有用户
$.ajax({
  url: 'http://localhost:3000/users',
  method: 'GET',
  success: function(data) {
    console.log(data);
  },
  error: function(xhr) {
    console.error('错误:', xhr.responseJSON);
  }
});

// 创建用户
$.ajax({
  url: 'http://localhost:3000/users',
  method: 'POST',
  contentType: 'application/json',
  data: JSON.stringify({
    name: '新用户',
    email: 'new@example.com'
  }),
  success: function(data) {
    console.log('创建成功:', data);
  }
});

// 更新用户
$.ajax({
  url: 'http://localhost:3000/users/1',
  method: 'PUT',
  contentType: 'application/json',
  data: JSON.stringify({ name: '更新后的名字' }),
  success: function(data) {
    console.log('更新成功:', data);
  }
});

// 删除用户
$.ajax({
  url: 'http://localhost:3000/users/1',
  method: 'DELETE',
  success: function(data) {
    console.log('删除成功:', data);
  }
});
```

---

## 6. React Native

```javascript
import { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, TextInput } from 'react-native';

function UserListScreen() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:3000/users');
      const data = await response.json();
      setUsers(data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (name, email) => {
    const response = await fetch('http://localhost:3000/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email }),
    });

    if (response.ok) {
      fetchUsers(); // 重新获取列表
    }
  };

  const deleteUser = async (id) => {
    await fetch(`http://localhost:3000/users/${id}`, {
      method: 'DELETE',
    });
    fetchUsers();
  };

  if (loading) {
    return <Text>加载中...</Text>;
  }

  return (
    <View>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <Text>{item.name} - {item.email}</Text>
            <Button title="删除" onPress={() => deleteUser(item.id)} />
          </View>
        )}
      />
    </View>
  );
}
```

---

## 7. 错误处理

### 完整的错误处理示例

```javascript
async function apiCall(url, options = {}) {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || '请求失败');
    }

    return data;
  } catch (error) {
    if (error.name === 'TypeError') {
      console.error('网络错误: 无法连接到服务器');
    } else {
      console.error('错误:', error.message);
    }
    throw error;
  }
}

// 使用
try {
  const users = await apiCall('http://localhost:3000/users');
  console.log(users);
} catch (error) {
  // 处理错误
}
```

### HTTP 状态码处理

```javascript
async function fetchWithErrorHandling(url, options) {
  const response = await fetch(url, options);
  const data = await response.json();

  switch (response.status) {
    case 200:
    case 201:
      return data;
    case 400:
      throw new Error('请求参数错误: ' + data.message);
    case 401:
      throw new Error('未授权: ' + data.message);
    case 404:
      throw new Error('资源不存在: ' + data.message);
    case 500:
      throw new Error('服务器错误: ' + data.message);
    default:
      throw new Error('未知错误: ' + data.message);
  }
}
```

---

## 🎯 快速测试

打开项目根目录的 `client-examples.html` 文件，在浏览器中可以直接测试所有 API！

```bash
# 在浏览器中打开
open client-examples.html

# 或者使用 Python 启动一个简单的 HTTP 服务器
python3 -m http.server 8080
# 然后访问 http://localhost:8080/client-examples.html
```

---

## 📚 更多资源

- [Fetch API MDN 文档](https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API)
- [axios 文档](https://axios-http.com/)
- [React 官方文档](https://react.dev/)
- [Vue 官方文档](https://vuejs.org/)
