import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { serve } from '@hono/node-server';

const app = new Hono();

// 中间件示例
app.use('*', logger()); // 日志中间件
app.use('*', prettyJSON()); // 美化 JSON 输出
app.use('*', cors()); // CORS 跨域支持

// 模拟数据库
interface User {
  id: number;
  name: string;
  email: string;
}

let users: User[] = [
  { id: 1, name: '张三', email: 'zhangsan@example.com' },
  { id: 2, name: '李四', email: 'lisi@example.com' },
  { id: 3, name: '王五', email: 'wangwu@example.com' },
];

// 首页路由
app.get('/', (c) => {
  return c.json({
    message: '欢迎使用 Hono 框架！',
    version: '1.0.0',
    endpoints: {
      users: '/users',
      user: '/users/:id',
      hello: '/hello/:name',
      search: '/search?q=keyword',
    },
  });
});

// 获取所有用户 - GET /users
app.get('/users', (c) => {
  return c.json({
    success: true,
    data: users,
    total: users.length,
  });
});

// 获取单个用户 - GET /users/:id
app.get('/users/:id', (c) => {
  const id = parseInt(c.req.param('id'));
  const user = users.find((u) => u.id === id);

  if (!user) {
    return c.json(
      {
        success: false,
        message: '用户不存在',
      },
      404
    );
  }

  return c.json({
    success: true,
    data: user,
  });
});

// 创建用户 - POST /users
app.post('/users', async (c) => {
  try {
    const body = await c.req.json<Omit<User, 'id'>>();

    if (!body.name || !body.email) {
      return c.json(
        {
          success: false,
          message: '请提供 name 和 email',
        },
        400
      );
    }

    const newUser: User = {
      id: users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1,
      name: body.name,
      email: body.email,
    };

    users.push(newUser);

    return c.json(
      {
        success: true,
        message: '用户创建成功',
        data: newUser,
      },
      201
    );
  } catch (error) {
    return c.json(
      {
        success: false,
        message: '请求数据格式错误',
      },
      400
    );
  }
});

// 更新用户 - PUT /users/:id
app.put('/users/:id', async (c) => {
  const id = parseInt(c.req.param('id'));
  const userIndex = users.findIndex((u) => u.id === id);

  if (userIndex === -1) {
    return c.json(
      {
        success: false,
        message: '用户不存在',
      },
      404
    );
  }

  try {
    const body = await c.req.json<Partial<User>>();
    users[userIndex] = {
      ...users[userIndex],
      ...(body.name && { name: body.name }),
      ...(body.email && { email: body.email }),
    };

    return c.json({
      success: true,
      message: '用户更新成功',
      data: users[userIndex],
    });
  } catch (error) {
    return c.json(
      {
        success: false,
        message: '请求数据格式错误',
      },
      400
    );
  }
});

// 删除用户 - DELETE /users/:id
app.delete('/users/:id', (c) => {
  const id = parseInt(c.req.param('id'));
  const userIndex = users.findIndex((u) => u.id === id);

  if (userIndex === -1) {
    return c.json(
      {
        success: false,
        message: '用户不存在',
      },
      404
    );
  }

  users.splice(userIndex, 1);

  return c.json({
    success: true,
    message: '用户删除成功',
  });
});

// 路径参数示例 - GET /hello/:name
app.get('/hello/:name', (c) => {
  const name = c.req.param('name');
  return c.json({
    message: `你好，${name}！`,
    timestamp: new Date().toISOString(),
  });
});

// 查询参数示例 - GET /search?q=keyword&limit=10
app.get('/search', (c) => {
  const query = c.req.query('q') || '';
  const limit = parseInt(c.req.query('limit') || '10');

  const results = users.filter(
    (u) =>
      u.name.includes(query) || u.email.includes(query)
  );

  return c.json({
    success: true,
    data: {
      query,
      results: results.slice(0, limit),
      total: results.length,
    },
  });
});

// 错误处理示例
app.get('/error', (c) => {
  throw new Error('这是一个测试错误');
});

// 全局错误处理
app.onError((err, c) => {
  console.error(`错误: ${err.message}`);
  return c.json(
    {
      success: false,
      message: err.message || '服务器内部错误',
    },
    500
  );
});

// 404 处理
app.notFound((c) => {
  return c.json(
    {
      success: false,
      message: '路由不存在',
      path: c.req.path,
    },
    404
  );
});

const port = 3000;
console.log(`🚀 服务器运行在 http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
