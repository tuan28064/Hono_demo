import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import type { User } from '@hono-demo/shared';

// 定义环境变量类型
type Bindings = {
  DB: D1Database;
  ASSETS: any;
};

const app = new Hono<{ Bindings: Bindings }>();

// 中间件示例
app.use('*', logger()); // 日志中间件
app.use('/api/*', prettyJSON()); // 美化 JSON 输出（仅 API 路由）
app.use('*', cors()); // CORS 跨域支持

// API 路由组
const api = new Hono<{ Bindings: Bindings }>();

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
api.get('/users', async (c) => {
  try {
    const { results } = await c.env.DB.prepare(
      'SELECT id, name, email, created_at, updated_at FROM users ORDER BY id'
    ).all();

    return c.json({
      success: true,
      data: results,
      total: results.length,
    });
  } catch (error) {
    console.error('Database error:', error);
    return c.json(
      {
        success: false,
        message: '获取用户列表失败',
      },
      500
    );
  }
});

// 获取单个用户 - GET /api/users/:id
api.get('/users/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    const user = await c.env.DB.prepare(
      'SELECT id, name, email, created_at, updated_at FROM users WHERE id = ?'
    )
      .bind(id)
      .first();

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
  } catch (error) {
    console.error('Database error:', error);
    return c.json(
      {
        success: false,
        message: '获取用户失败',
      },
      500
    );
  }
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

    // 检查邮箱是否已存在
    const existingUser = await c.env.DB.prepare(
      'SELECT id FROM users WHERE email = ?'
    )
      .bind(body.email)
      .first();

    if (existingUser) {
      return c.json(
        {
          success: false,
          message: '该邮箱已被使用',
        },
        400
      );
    }

    // 插入新用户
    const result = await c.env.DB.prepare(
      'INSERT INTO users (name, email) VALUES (?, ?) RETURNING id, name, email, created_at, updated_at'
    )
      .bind(body.name, body.email)
      .first();

    return c.json(
      {
        success: true,
        message: '用户创建成功',
        data: result,
      },
      201
    );
  } catch (error) {
    console.error('Database error:', error);
    return c.json(
      {
        success: false,
        message: '创建用户失败',
      },
      500
    );
  }
});

// 更新用户 - PUT /api/users/:id
api.put('/users/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    const body = await c.req.json<Partial<User>>();

    // 检查用户是否存在
    const user = await c.env.DB.prepare('SELECT id FROM users WHERE id = ?')
      .bind(id)
      .first();

    if (!user) {
      return c.json(
        {
          success: false,
          message: '用户不存在',
        },
        404
      );
    }

    // 构建更新语句
    const updates: string[] = [];
    const values: any[] = [];

    if (body.name) {
      updates.push('name = ?');
      values.push(body.name);
    }
    if (body.email) {
      updates.push('email = ?');
      values.push(body.email);
    }

    if (updates.length === 0) {
      return c.json(
        {
          success: false,
          message: '没有提供要更新的字段',
        },
        400
      );
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const result = await c.env.DB.prepare(
      `UPDATE users SET ${updates.join(', ')} WHERE id = ? RETURNING id, name, email, created_at, updated_at`
    )
      .bind(...values)
      .first();

    return c.json({
      success: true,
      message: '用户更新成功',
      data: result,
    });
  } catch (error) {
    console.error('Database error:', error);
    return c.json(
      {
        success: false,
        message: '更新用户失败',
      },
      500
    );
  }
});

// 删除用户 - DELETE /api/users/:id
api.delete('/users/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'));

    // 检查用户是否存在
    const user = await c.env.DB.prepare('SELECT id FROM users WHERE id = ?')
      .bind(id)
      .first();

    if (!user) {
      return c.json(
        {
          success: false,
          message: '用户不存在',
        },
        404
      );
    }

    // 删除用户
    await c.env.DB.prepare('DELETE FROM users WHERE id = ?').bind(id).run();

    return c.json({
      success: true,
      message: '用户删除成功',
    });
  } catch (error) {
    console.error('Database error:', error);
    return c.json(
      {
        success: false,
        message: '删除用户失败',
      },
      500
    );
  }
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
api.get('/search', async (c) => {
  try {
    const query = c.req.query('q') || '';
    const limit = parseInt(c.req.query('limit') || '10');

    const { results } = await c.env.DB.prepare(
      'SELECT id, name, email, created_at, updated_at FROM users WHERE name LIKE ? OR email LIKE ? ORDER BY id LIMIT ?'
    )
      .bind(`%${query}%`, `%${query}%`, limit)
      .all();

    return c.json({
      success: true,
      data: {
        query,
        results: results,
        total: results.length,
      },
    });
  } catch (error) {
    console.error('Database error:', error);
    return c.json(
      {
        success: false,
        message: '搜索失败',
      },
      500
    );
  }
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
