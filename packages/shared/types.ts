/**
 * 用户接口
 */
export interface User {
  id: number;
  name: string;
  email: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * 创建用户 DTO
 */
export type CreateUserDto = Omit<User, 'id' | 'created_at' | 'updated_at'>;

/**
 * 更新用户 DTO
 */
export type UpdateUserDto = Partial<Omit<User, 'id' | 'created_at' | 'updated_at'>>;

/**
 * API 响应接口
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  total?: number;
}

/**
 * 错误响应接口
 */
export interface ErrorResponse {
  success: false;
  message: string;
}

/**
 * 搜索结果接口
 */
export interface SearchResult {
  query: string;
  results: User[];
  total: number;
}
