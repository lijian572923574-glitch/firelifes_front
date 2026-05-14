/**
 * api/record.ts - 记账记录 API
 * 
 * 功能说明：
 * - 记账记录的增删改查
 * - 按年月分页查询记录
 * - 获取月份收支汇总
 * 
 * API 端点：
 * - POST /record - 创建记录
 * - PUT /record/:id - 更新记录
 * - GET /record/:id - 获取单条记录
 * - GET /record - 获取所有记录
 * - GET /record/page - 分页查询
 * - GET /record/month-summary - 月份汇总
 * - DELETE /record/:id - 删除记录
 * 
 * 技术栈：TypeScript + uni-app
 */

import request from './request'

/**
 * 记账记录数据接口
 */
export interface RecordData {
  id: number
  typeId: number
  date: string
  amount: number
  type: 'income' | 'expense' | 'transfer' | 'repayment'
  accountId?: number
  toAccountId?: number
  remark?: string
  createdAt?: string
}

/**
 * 月份收支汇总接口
 */
export interface MonthSummary {
  income: number
  expense: number
}

/**
 * 分页结果接口
 */
export interface PageResult<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

export type RecordType = 'income' | 'expense' | 'transfer' | 'repayment'

export interface CreateRecordData {
  typeId: number
  type: RecordType
  amount: number
  accountId?: number
  toAccountId?: number
  remark?: string
  date: string
}

export const recordApi = {
  /**
   * 创建记账记录
   * @param data 记账数据
   */
  createRecord: (data: CreateRecordData) => {
    return request({
      url: '/record',
      method: 'POST',
      data,
    })
  },

  /**
   * 更新记账记录
   * @param id 记录 ID
   * @param data 需要更新的数据
   */
  updateRecord: (
    id: number,
    data: {
      typeId?: number
      type?: 'income' | 'expense'
      amount?: number
      remark?: string
      date?: string
    }
  ) => {
    return request({
      url: `/record/${id}`,
      method: 'PUT',
      data,
    })
  },

  /**
   * 获取单条记账记录
   * @param id 记录 ID
   */
  getRecord: (id: number) => {
    return request<RecordData>({
      url: `/record/${id}`,
      method: 'GET',
    })
  },

  /**
   * 获取当前用户所有记账记录
   */
  getAllRecords: () => {
    return request<RecordData[]>({
      url: '/record',
      method: 'GET',
    })
  },

  /**
   * 按年月分页查询记账记录
   * @param yearMonth 年月（格式：YYYY-MM）
   * @param page 页码
   * @param pageSize 每页条数
   */
  getRecordsByMonth: (yearMonth: string, page: number = 1, pageSize: number = 50) => {
    return request<PageResult<RecordData>>({
      url: '/record/page',
      method: 'GET',
      data: { yearMonth, page, pageSize },
    })
  },

  /**
   * 获取指定月份的收支汇总
   * @param yearMonth 年月（格式：YYYY-MM）
   */
  getMonthSummary: (yearMonth: string) => {
    return request<MonthSummary>({
      url: '/record/month-summary',
      method: 'GET',
      data: { yearMonth },
    })
  },

  /**
   * 删除记账记录
   * @param id 记录 ID
   */
  deleteRecord: (id: number) => {
    return request({
      url: `/record/${id}`,
      method: 'DELETE',
    })
  },
}