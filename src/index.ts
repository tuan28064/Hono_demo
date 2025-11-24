import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';

const app = new Hono();

// 中间件示例
app.use('*', logger()); // 日志中间件
app.use('/api/*', prettyJSON()); // 美化 JSON 输出（仅 API 路由）
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

// API 路由组
const api = new Hono();

// API 首页 - GET /api
api.get('/', (c) => {
  return c.json({
    message: '欢迎使用 Hono 框架！',
    version: '1.0.0',
    endpoints: {
      users: '/api/users',
      user: '/api/users/:id',
      hello: '/api/hello/:name',
      search: '/api/search?q=keyword',
    },
  });
});

// 获取所有用户 - GET /api/users
api.get('/users', (c) => {
  return c.json({
    success: true,
    data: users,
    total: users.length,
  });
});

// 获取单个用户 - GET /api/users/:id
api.get('/users/:id', (c) => {
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

// 创建用户 - POST /api/users
api.post('/users', async (c) => {
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

// 更新用户 - PUT /api/users/:id
api.put('/users/:id', async (c) => {
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

// 删除用户 - DELETE /api/users/:id
api.delete('/users/:id', (c) => {
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

// 路径参数示例 - GET /api/hello/:name
api.get('/hello/:name', (c) => {
  const name = c.req.param('name');
  return c.json({
    message: `你好，${name}！`,
    timestamp: new Date().toISOString(),
  });
});

// 查询参数示例 - GET /api/search?q=keyword&limit=10
api.get('/search', (c) => {
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

// 错误处理示例 - GET /api/error
api.get('/error', (c) => {
  throw new Error('这是一个测试错误');
});

// 挂载 API 路由到 /api 前缀
app.route('/api', api);

// 静态文件服务（用于 Cloudflare Workers）
app.get('*', async (c) => {
  // 获取 assets binding
  const env = c.env as any;
  if (!env?.ASSETS) {
    return c.notFound();
  }

  try {
    // 尝试获取静态资产
    const url = new URL(c.req.url);
    let assetPath = url.pathname;

    // 对于根路径或没有文件扩展名的路径，返回 index.html（SPA 路由）
    if (assetPath === '/' || !assetPath.includes('.')) {
      assetPath = '/index.html';
    }

    // 从 assets 获取文件
    const asset = await env.ASSETS.fetch(new URL(assetPath, url.origin));

    if (asset.status === 404) {
      // 如果文件不存在且不是 API 路由，返回 index.html（SPA 路由）
      if (!url.pathname.startsWith('/api')) {
        const indexAsset = await env.ASSETS.fetch(new URL('/index.html', url.origin));
        return new Response(indexAsset.body, {
          headers: indexAsset.headers,
          status: 200,
        });
      }
      return c.notFound();
    }

    return asset;
  } catch (error) {
    console.error('静态文件服务错误:', error);
    return c.notFound();
  }
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

export default app;
