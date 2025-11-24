import { Hono } from 'hono';

// 创建 API 路由组
export const apiRoutes = new Hono();

// API 路由示例
apiRoutes.get('/status', (c) => {
  return c.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

apiRoutes.get('/version', (c) => {
  return c.json({
    version: '1.0.0',
    node: process.version,
  });
});

// 创建产品路由组
export const productRoutes = new Hono();

interface Product {
  id: number;
  name: string;
  price: number;
}

const products: Product[] = [
  { id: 1, name: 'MacBook Pro', price: 12999 },
  { id: 2, name: 'iPhone 15', price: 5999 },
  { id: 3, name: 'iPad Air', price: 4799 },
];

productRoutes.get('/', (c) => {
  return c.json({
    success: true,
    data: products,
  });
});

productRoutes.get('/:id', (c) => {
  const id = parseInt(c.req.param('id'));
  const product = products.find((p) => p.id === id);

  if (!product) {
    return c.json(
      {
        success: false,
        message: '产品不存在',
      },
      404
    );
  }

  return c.json({
    success: true,
    data: product,
  });
});
