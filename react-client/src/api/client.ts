import { API_BASE_URL, API_TIMEOUT } from './config';
import type { ApiResponse, ErrorResponse } from '../types';

/**
 * API 客户端类
 * 封装了所有 HTTP 请求方法，提供类型安全和统一的错误处理
 */
class ApiClient {
  private baseUrl: string;
  private timeout: number;

  constructor(baseUrl: string = API_BASE_URL, timeout: number = API_TIMEOUT) {
    this.baseUrl = baseUrl;
    this.timeout = timeout;
  }

  /**
   * 通用请求方法
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T> | ErrorResponse> {
    const url = `${this.baseUrl}${endpoint}`;

    // 创建超时控制器
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP Error: ${response.status}`);
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('请求超时');
        }
        throw error;
      }
      throw new Error('未知错误');
    }
  }

  /**
   * GET 请求
   */
  async get<T>(endpoint: string): Promise<ApiResponse<T> | ErrorResponse> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  /**
   * POST 请求
   */
  async post<T>(
    endpoint: string,
    body?: unknown
  ): Promise<ApiResponse<T> | ErrorResponse> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  /**
   * PUT 请求
   */
  async put<T>(
    endpoint: string,
    body?: unknown
  ): Promise<ApiResponse<T> | ErrorResponse> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  /**
   * DELETE 请求
   */
  async delete<T>(endpoint: string): Promise<ApiResponse<T> | ErrorResponse> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// 导出单例
export const apiClient = new ApiClient();
