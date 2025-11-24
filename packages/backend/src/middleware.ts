import type { Context, Next } from "hono";

// 自定义日志中间件
export const customLogger = async (c: Context, next: Next) => {
  const start = Date.now();
  await next();
  const end = Date.now();
  console.log(`${c.req.method} ${c.req.path} - ${end - start}ms`);
};

// 认证中间件示例
export const authMiddleware = async (c: Context, next: Next) => {
  const token = c.req.header("Authorization");

  if (!token) {
    return c.json(
      {
        success: false,
        message: "未提供认证令牌",
      },
      401,
    );
  }

  // 这里可以验证 token
  // 示例：简单检查 token 是否为 "Bearer test-token"
  if (token !== "Bearer test-token") {
    return c.json(
      {
        success: false,
        message: "认证令牌无效",
      },
      401,
    );
  }

  await next();
};

// 请求ID中间件
export const requestId = async (c: Context, next: Next) => {
  const id = crypto.randomUUID();
  c.set("requestId", id);
  c.header("X-Request-ID", id);
  await next();
};

// 限流中间件示例（简单版本）
const requests = new Map<string, number[]>();

export const rateLimit = (limit: number, windowMs: number) => {
  return async (c: Context, next: Next) => {
    const ip = c.req.header("x-forwarded-for") || "unknown";
    const now = Date.now();
    const userRequests = requests.get(ip) || [];

    // 清除过期的请求记录
    const validRequests = userRequests.filter((time) => now - time < windowMs);

    if (validRequests.length >= limit) {
      return c.json(
        {
          success: false,
          message: "请求过于频繁，请稍后再试",
        },
        429,
      );
    }

    validRequests.push(now);
    requests.set(ip, validRequests);

    await next();
  };
};
