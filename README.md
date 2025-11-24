# Hono 框架学习 Demo

这是一个 Hono 框架的完整学习示例，包含了常用功能和最佳实践。

## 什么是 Hono？

Hono 是一个轻量级、超快速的 Web 框架，支持多种 JavaScript 运行时（Node.js、Bun、Deno、Cloudflare Workers 等）。它的特点是：

- 🚀 极快的性能
- 🪶 轻量级（~12KB）
- 🔋 内置多种实用中间件
- 📝 完整的 TypeScript 支持
- 🌐 支持多种运行时环境

## 项目结构

```
hono_demo/
├── src/
│   ├── index.ts       # 基础示例（推荐从这里开始）
│   ├── advanced.ts    # 高级示例（路由分组、认证等）
│   ├── routes.ts      # 路由模块示例
│   └── middleware.ts  # 自定义中间件示例
├── package.json
├── tsconfig.json
└── README.md
```

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 运行基础示例

```bash
npm run dev
```

服务器将在 `http://localhost:3000` 启动。

### 3. 运行高级示例

```bash
npx tsx watch src/advanced.ts
```

服务器将在 `http://localhost:3001` 启动。

## 基础示例功能 (src/index.ts)

### 1. 获取所有用户

```bash
curl http://localhost:3000/users
```

### 2. 获取单个用户

```bash
curl http://localhost:3000/users/1
```

### 3. 创建用户

```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name":"赵六","email":"zhaoliu@example.com"}'
```

### 4. 更新用户

```bash
curl -X PUT http://localhost:3000/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"张三（已更新）"}'
```

### 5. 删除用户

```bash
curl -X DELETE http://localhost:3000/users/1
```

### 6. 路径参数示例

```bash
curl http://localhost:3000/hello/世界
```

### 7. 查询参数示例

```bash
curl "http://localhost:3000/search?q=张&limit=5"
```

## 高级示例功能 (src/advanced.ts)

### 1. API 路由组

```bash
# 检查服务状态
curl http://localhost:3001/api/status

# 获取版本信息
curl http://localhost:3001/api/version
```

### 2. 产品路由

```bash
# 获取所有产品
curl http://localhost:3001/products

# 获取单个产品
curl http://localhost:3001/products/1
```

### 3. 受保护的路由（需要认证）

```bash
# 不带 token（会失败）
curl http://localhost:3001/protected/profile

# 带正确的 token
curl http://localhost:3001/protected/profile \
  -H "Authorization: Bearer test-token"

# 访问仪表板
curl http://localhost:3001/protected/dashboard \
  -H "Authorization: Bearer test-token"
```

### 4. 限流示例

```bash
# 快速请求多次（超过5次会被限制）
for i in {1..7}; do
  curl http://localhost:3001/limited
  echo ""
done
```

## 核心概念讲解

### 1. 路由 (Routing)

Hono 支持所有标准 HTTP 方法：

```typescript
app.get('/path', (c) => { /* ... */ })     // GET
app.post('/path', (c) => { /* ... */ })    // POST
app.put('/path', (c) => { /* ... */ })     // PUT
app.delete('/path', (c) => { /* ... */ })  // DELETE
```

### 2. 路径参数 (Path Parameters)

```typescript
app.get('/users/:id', (c) => {
  const id = c.req.param('id')
  // ...
})
```

### 3. 查询参数 (Query Parameters)

```typescript
app.get('/search', (c) => {
  const query = c.req.query('q')
  const limit = c.req.query('limit')
  // ...
})
```

### 4. 请求体 (Request Body)

```typescript
app.post('/users', async (c) => {
  const body = await c.req.json()
  // ...
})
```

### 5. 响应 (Response)

```typescript
// JSON 响应
return c.json({ message: 'Hello' })

// 带状态码的响应
return c.json({ error: 'Not found' }, 404)

// 文本响应
return c.text('Hello World')

// HTML 响应
return c.html('<h1>Hello</h1>')
```

### 6. 中间件 (Middleware)

```typescript
// 全局中间件
app.use('*', logger())

// 特定路径的中间件
app.use('/api/*', authMiddleware)

// 自定义中间件
const myMiddleware = async (c, next) => {
  console.log('Before')
  await next()
  console.log('After')
}
```

### 7. 路由分组 (Route Grouping)

```typescript
const api = new Hono()
api.get('/status', (c) => { /* ... */ })
api.get('/version', (c) => { /* ... */ })

app.route('/api', api)  // 挂载到 /api 路径下
```

### 8. 错误处理 (Error Handling)

```typescript
// 全局错误处理
app.onError((err, c) => {
  return c.json({ error: err.message }, 500)
})

// 404 处理
app.notFound((c) => {
  return c.json({ error: 'Not found' }, 404)
})
```

## 内置中间件

Hono 提供了丰富的内置中间件：

- `logger()` - 请求日志
- `cors()` - CORS 跨域支持
- `prettyJSON()` - 美化 JSON 输出
- `jwt()` - JWT 认证
- `basicAuth()` - 基础认证
- `bearerAuth()` - Bearer Token 认证
- `compress()` - 响应压缩
- `etag()` - ETag 支持
- 更多请查看 [官方文档](https://hono.dev/middleware/builtin)

## 构建和部署

### 构建项目

```bash
npm run build
```

构建后的文件在 `dist/` 目录。

### 运行生产版本

```bash
npm start
```

## 学习建议

1. **从基础开始**：先运行 `src/index.ts`，理解基本的路由和请求处理
2. **尝试修改代码**：修改路由、添加新的端点，观察效果
3. **学习中间件**：查看 `src/middleware.ts`，了解如何创建自定义中间件
4. **探索高级功能**：运行 `src/advanced.ts`，学习路由分组和认证
5. **阅读官方文档**：[https://hono.dev](https://hono.dev)

## 更多资源

- [Hono 官方网站](https://hono.dev)
- [Hono GitHub](https://github.com/honojs/hono)
- [示例代码集合](https://github.com/honojs/examples)

## 常见问题

### Q: Hono 和 Express 有什么区别？

A: Hono 更轻量、更快，支持多种运行时，TypeScript 支持更好。Express 生态更成熟，但只支持 Node.js。

### Q: 可以在生产环境使用 Hono 吗？

A: 可以！Hono 已经在许多生产环境中使用，性能和稳定性都很好。

### Q: 如何连接数据库？

A: Hono 不限制你使用任何数据库。你可以使用 Prisma、Drizzle ORM、或原生数据库驱动。

## 下一步

- 尝试添加数据库集成（如 SQLite、PostgreSQL）
- 实现完整的 JWT 认证系统
- 添加数据验证（使用 Zod 或 Valibot）
- 部署到 Cloudflare Workers 或 Vercel

祝学习愉快！🎉
