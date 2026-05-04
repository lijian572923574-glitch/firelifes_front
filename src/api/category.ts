/**
 * api/category.ts - 分类 API
 * 
 * 功能说明：
 * - 获取所有分类（带分组）
 * - 按类型获取分类（支出/收入）
 * - 获取用户自定义分类
 * - 获取分类图标列表
 * 
 * API 端点：
 * - GET /category - 获取所有分类
 * - GET /category/:type - 按类型获取
 * - GET /category/user/:type - 用户自定义分类
 * - GET /user/icons - 获取图标列表
 * 
 * 技术栈：TypeScript + uni-app
 */

import request from './request'

/**
 * 分类图标接口
 */
export interface CategoryIcon {
  id: number
  name: string
  url: string
  iconType: string
}

/**
 * 分类项接口
 */
export interface CategoryItem {
  id: number
  name: string
  iconId: number
  iconUrl: string
  sortOrder: number
  isUserCreated: boolean
  groupId: number
  type: string
}

/**
 * 分类分组接口
 */
export interface CategoryGroup {
  id: number
  name: string
  sortOrder: number
  children: CategoryItem[]
}

/**
 * 分类响应接口
 */
export interface CategoryResponse {
  expense: CategoryGroup[]
  income: CategoryGroup[]
}

export const categoryApi = {
  /**
   * 获取所有分类（带分组）
   */
  getAllCategories: () => {
    return request<CategoryResponse>({
      url: '/category',
      method: 'GET',
    })
  },

  /**
   * 按类型获取分类（支出/收入）
   * @param type 分类类型：income-收入 expense-支出
   */
  getCategoriesByType: (type: 'income' | 'expense') => {
    return request<CategoryGroup[]>({
      url: `/category/${type}`,
      method: 'GET',
    })
  },

  /**
   * 获取用户自定义分类
   * @param type 分类类型：income-收入 expense-支出
   */
  getUserCategories: (type: 'income' | 'expense') => {
    return request<CategoryGroup[]>({
      url: `/category/user/${type}`,
      method: 'GET',
    })
  },

  /**
   * 获取用户图标列表
   */
  getUserIcons: () => {
    return request<CategoryIcon[]>({
      url: '/user/icons',
      method: 'GET',
    })
  },
}
