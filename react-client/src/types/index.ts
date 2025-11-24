/**
 * 用户数据类型
 */
export interface User {
  id: number;
  name: string;
  email: string;
}

/**
 * API 响应基础类型
 */
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  total?: number;
}

/**
 * 创建用户的请求参数（不包含 id）
 */
export type CreateUserDto = Omit<User, 'id'>;

/**
 * 更新用户的请求参数（所有字段可选）
 */
export type UpdateUserDto = Partial<Omit<User, 'id'>>;

/**
 * 搜索结果类型
 */
export interface SearchResult {
  query: string;
  results: User[];
  total: number;
}

/**
 * 错误响应类型
 */
export interface ErrorResponse {
  success: false;
  message: string;
}
