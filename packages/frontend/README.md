# Hono API React + TypeScript 客户端

这是一个完整的 React + TypeScript 客户端示例，展示如何使用类型安全的方式调用 Hono 后端 API。

## ✨ 特性

- ✅ **完整类型安全**: 使用 TypeScript 确保类型正确
- ✅ **自定义 Hooks**: 封装业务逻辑，易于复用
- ✅ **API 客户端**: 统一的 HTTP 请求封装
- ✅ **错误处理**: 完善的错误处理机制
- ✅ **React 18**: 使用最新的 React 特性
- ✅ **Vite**: 快速的开发体验
- ✅ **响应式设计**: 支持移动端和桌面端

## 📦 技术栈

- **React 18** - UI 框架
- **TypeScript** - 类型系统
- **Vite** - 构建工具
- **CSS3** - 样式

## 📁 项目结构

```
react-client/
├── src/
│   ├── types/           # 类型定义
│   │   └── index.ts     # User, ApiResponse 等类型
│   ├── api/             # API 调用层
│   │   ├── config.ts    # API 配置
│   │   ├── client.ts    # HTTP 客户端封装
│   │   ├── users.ts     # 用户相关 API
│   │   └── index.ts     # 统一导出
│   ├── hooks/           # 自定义 Hooks
│   │   ├── useUsers.ts       # 用户管理 Hook
│   │   ├── useUserSearch.ts  # 用户搜索 Hook
│   │   └── index.ts          # 统一导出
│   ├── components/      # React 组件
│   │   ├── App.tsx      # 主应用组件
│   │   ├── App.css      # 样式文件
│   │   ├── UserList.tsx # 用户列表组件
│   │   ├── UserForm.tsx # 用户表单组件
│   │   ├── UserSearch.tsx # 搜索组件
│   │   └── index.ts     # 统一导出
│   └── main.tsx         # 入口文件
├── index.html           # HTML 模板
├── package.json         # 依赖配置
├── tsconfig.json        # TS 配置
├── vite.config.ts       # Vite 配置
└── README.md            # 本文件
```

## 🚀 快速开始

### 1. 安装依赖

```bash
cd react-client
npm install
```

### 2. 配置环境变量（可选）

```bash
cp .env.example .env
```

编辑 `.env` 文件，修改 API 地址（默认为 `http://localhost:3000`）。

### 3. 启动开发服务器

**重要**: 确保后端 API 服务器正在运行！

```bash
# 在项目根目录启动后端
cd ..
npm run dev

# 在新终端启动前端
cd react-client
npm run dev
```

前端将在 `http://localhost:5173` 启动。

### 4. 构建生产版本

```bash
npm run build
```

构建后的文件在 `dist/` 目录。

### 5. 预览生产版本

```bash
npm run preview
```

## 🎯 核心代码说明

### 1. 类型定义 (src/types/index.ts)

```typescript
export interface User {
  id: number;
  name: string;
  email: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  total?: number;
}

export type CreateUserDto = Omit<User, 'id'>;
export type UpdateUserDto = Partial<Omit<User, 'id'>>;
```

**说明**:
- 定义了与后端 API 一致的数据类型
- 使用 TypeScript 工具类型（`Omit`、`Partial`）创建派生类型
- 确保前后端类型一致

### 2. API 客户端 (src/api/client.ts)

```typescript
class ApiClient {
  async get<T>(endpoint: string): Promise<ApiResponse<T>>
  async post<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>>
  async put<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>>
  async delete<T>(endpoint: string): Promise<ApiResponse<T>>
}
```

**特性**:
- 封装了所有 HTTP 方法
- 支持泛型，提供类型推断
- 统一的错误处理
- 请求超时控制

### 3. 用户 API (src/api/users.ts)

```typescript
export const userApi = {
  async getAll(): Promise<ApiResponse<User[]>>
  async getById(id: number): Promise<ApiResponse<User>>
  async create(data: CreateUserDto): Promise<ApiResponse<User>>
  async update(id: number, data: UpdateUserDto): Promise<ApiResponse<User>>
  async delete(id: number): Promise<ApiResponse<void>>
  async search(query: string, limit?: number): Promise<ApiResponse<SearchResult>>
}
```

**使用示例**:
```typescript
// 获取所有用户
const response = await userApi.getAll();
if (response.success) {
  console.log(response.data); // User[]
}

// 创建用户
const newUser = await userApi.create({
  name: '张三',
  email: 'zhangsan@example.com'
});
```

### 4. useUsers Hook (src/hooks/useUsers.ts)

```typescript
export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const createUser = async (data: CreateUserDto): Promise<boolean> => { ... }
  const updateUser = async (id: number, data: UpdateUserDto): Promise<boolean> => { ... }
  const deleteUser = async (id: number): Promise<boolean> => { ... }

  return { users, loading, error, createUser, updateUser, deleteUser, refetch };
}
```

**特性**:
- 封装了用户的 CRUD 操作
- 自动管理加载和错误状态
- 提供 refetch 方法手动刷新数据

**使用示例**:
```typescript
function UserComponent() {
  const { users, loading, createUser, deleteUser } = useUsers();

  if (loading) return <div>加载中...</div>;

  return (
    <div>
      {users.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}
```

### 5. 组件示例 (src/components/UserForm.tsx)

```typescript
export const UserForm: React.FC<UserFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<CreateUserDto>({
    name: '',
    email: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await onSubmit(formData);
    if (success) {
      setFormData({ name: '', email: '' });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      <button type="submit">创建用户</button>
    </form>
  );
};
```

## 🔧 TypeScript 类型安全示例

### 编译时类型检查

```typescript
// ✅ 正确：类型匹配
const user: User = { id: 1, name: '张三', email: 'test@example.com' };

// ❌ 错误：缺少必需字段
const user: User = { id: 1, name: '张三' }; // Error: Property 'email' is missing

// ✅ 正确：CreateUserDto 不包含 id
const newUser: CreateUserDto = { name: '李四', email: 'lisi@example.com' };

// ❌ 错误：CreateUserDto 不应包含 id
const newUser: CreateUserDto = { id: 1, name: '李四', email: 'test@example.com' };
```

### API 调用类型推断

```typescript
// TypeScript 自动推断返回类型
const response = await userApi.getAll();
//    ↑ 类型: ApiResponse<User[]> | ErrorResponse

if (response.success) {
  response.data.forEach(user => {
    console.log(user.name); // ✅ TypeScript 知道 user 是 User 类型
  });
}
```

## 📝 API 调用流程

```
组件 (Component)
  ↓ 调用
Hook (useUsers)
  ↓ 调用
API 函数 (userApi.getAll)
  ↓ 调用
HTTP 客户端 (apiClient.get)
  ↓ 发送请求
后端 API (Hono Server)
  ↓ 返回响应
← 响应层层返回 ←
← 类型安全保障 ←
```

## 🎨 自定义和扩展

### 添加新的 API

1. **定义类型** (src/types/index.ts)
```typescript
export interface Product {
  id: number;
  name: string;
  price: number;
}
```

2. **创建 API 函数** (src/api/products.ts)
```typescript
export const productApi = {
  async getAll(): Promise<ApiResponse<Product[]>> {
    return apiClient.get<Product[]>('/products');
  },
};
```

3. **创建 Hook** (src/hooks/useProducts.ts)
```typescript
export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  // ... 实现逻辑
  return { products, ... };
}
```

4. **创建组件** (src/components/ProductList.tsx)
```typescript
export const ProductList: React.FC = () => {
  const { products } = useProducts();
  return <div>{/* 渲染产品列表 */}</div>;
};
```

## 🔍 常见问题

### Q: CORS 错误怎么办？

A: 后端 Hono 服务器已经配置了 CORS，如果仍然有问题，检查：
- 后端是否使用了 `cors()` 中间件
- API 地址是否正确
- 浏览器开发者工具的 Network 标签查看具体错误

### Q: 类型报错怎么办？

A: 确保：
- 前后端类型定义一致
- 运行 `npm install` 安装所有依赖
- TypeScript 版本正确

### Q: 如何调试 API 请求？

A:
- 打开浏览器开发者工具 → Network 标签
- 在 API 客户端中添加 `console.log` 调试
- 使用 React DevTools 查看组件状态

## 📚 学习资源

- [React 官方文档](https://react.dev/)
- [TypeScript 官方文档](https://www.typescriptlang.org/)
- [Vite 官方文档](https://vitejs.dev/)
- [Hono 官方文档](https://hono.dev/)

## 🎓 下一步学习

- [ ] 添加用户认证（JWT）
- [ ] 使用 React Router 添加多页面
- [ ] 集成状态管理（Zustand 或 Redux）
- [ ] 添加单元测试（Vitest + React Testing Library）
- [ ] 添加表单验证（Zod + React Hook Form）
- [ ] 优化性能（React.memo、useMemo）

## 📄 License

MIT
