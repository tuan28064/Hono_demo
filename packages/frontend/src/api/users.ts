import { apiClient } from './client';
import type {
  User,
  ApiResponse,
  CreateUserDto,
  UpdateUserDto,
  SearchResult,
  ErrorResponse,
} from '../types';

/**
 * 用户相关 API
 */
export const userApi = {
  /**
   * 获取所有用户
   */
  async getAll(): Promise<ApiResponse<User[]> | ErrorResponse> {
    return apiClient.get<User[]>('/users');
  },

  /**
   * 根据 ID 获取单个用户
   */
  async getById(id: number): Promise<ApiResponse<User> | ErrorResponse> {
    return apiClient.get<User>(`/users/${id}`);
  },

  /**
   * 创建新用户
   */
  async create(data: CreateUserDto): Promise<ApiResponse<User> | ErrorResponse> {
    return apiClient.post<User>('/users', data);
  },

  /**
   * 更新用户信息
   */
  async update(
    id: number,
    data: UpdateUserDto
  ): Promise<ApiResponse<User> | ErrorResponse> {
    return apiClient.put<User>(`/users/${id}`, data);
  },

  /**
   * 删除用户
   */
  async delete(id: number): Promise<ApiResponse<void> | ErrorResponse> {
    return apiClient.delete<void>(`/users/${id}`);
  },

  /**
   * 搜索用户
   */
  async search(
    query: string,
    limit: number = 10
  ): Promise<ApiResponse<SearchResult> | ErrorResponse> {
    const params = new URLSearchParams({
      q: query,
      limit: limit.toString(),
    });
    return apiClient.get<SearchResult>(`/search?${params}`);
  },
};
