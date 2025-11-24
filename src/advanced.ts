import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { serve } from '@hono/node-server';
import { apiRoutes, productRoutes } from './routes';
import { customLogger, authMiddleware, requestId, rateLimit } from './middleware';

// 定义应用的变量类型
type Variables = {
  requestId: string;
};

const app = new Hono<{ Variables: Variables }>();

// 全局中间件
app.use('*', logger());
app.use('*', cors());
app.use('*', requestId);

// 首页
app.get('/', (c) => {
  return c.json({
    message: 'Hono 高级示例',
    requestId: c.get('requestId'),
  });
});

// 挂载 API 路由组
app.route('/api', apiRoutes);

// 挂载产品路由组
app.route('/products', productRoutes);

// 受保护的路由（需要认证）
const protectedApp = new Hono<{ Variables: Variables }>();
protectedApp.use('*', authMiddleware);

protectedApp.get('/profile', (c) => {
  return c.json({
    success: true,
    data: {
      id: 1,
      username: 'admin',
      role: 'administrator',
    },
  });
});

protectedApp.get('/dashboard', (c) => {
  return c.json({
    success: true,
    data: {
      stats: {
        users: 150,
        products: 42,
        orders: 328,
      },
    },
  });
});

// 挂载受保护的路由
app.route('/protected', protectedApp);

// 应用限流中间件到特定路由
app.get('/limited', rateLimit(5, 60000), (c) => {
  return c.json({
    message: '这个路由每分钟只能访问5次',
    requestId: c.get('requestId'),
  });
});

// 错误处理
app.onError((err, c) => {
  console.error(`错误: ${err.message}`);
  return c.json(
    {
      success: false,
      message: err.message || '服务器内部错误',
      requestId: c.get('requestId'),
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

const port = 3001;
console.log(`🚀 高级示例服务器运行在 http://localhost:${port}`);
console.log('提示：访问 /protected/* 路由需要在请求头中添加：Authorization: Bearer test-token');

serve({
  fetch: app.fetch,
  port,
});
