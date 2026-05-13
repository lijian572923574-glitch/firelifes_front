// 账户类型枚举
export type AccountType = 'cash' | 'fixed_asset' | 'depreciable_asset' | 'liability';

// 账户数据结构
export interface Account {
  id: string;
  userId: string;
  name: string;
  icon: string;
  type: AccountType;
  balance: number;
  description?: string;
  isDefault: boolean;
  order: number;
  isVisible: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

// 创建/编辑账户的请求参数
export interface AccountRequest {
  name: string;
  icon: string;
  type: AccountType;
  balance: number;
  description?: string;
}

// 调整余额请求
export interface AdjustBalanceRequest {
  newBalance: number;
  remark?: string;
}

// 账户调整记录
export interface AccountAdjustment {
  id: string;
  userId: string;
  accountId: string;
  oldBalance: number;
  newBalance: number;
  adjustmentAmount: number;
  remark?: string;
  createdAt: string;
  updatedAt: string;
}

// 默认账户配置
export const DEFAULT_ACCOUNTS: Omit<Account, 'id' | 'userId' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: '现金',
    icon: '💵',
    type: 'cash',
    balance: 0,
    description: '日常现金备用',
    order: 1,
    isDefault: true,
    isVisible: true,
    isDeleted: false
  }
]

// 账户类型选项
export const ACCOUNT_TYPE_OPTIONS = [
  { value: 'cash' as AccountType, label: '现金类' },
  { value: 'fixed_asset' as AccountType, label: '固定资产类' },
  { value: 'depreciable_asset' as AccountType, label: '折旧资产类' },
  { value: 'liability' as AccountType, label: '负债类' }
]

// 预设图标
export const ACCOUNT_ICONS = [
  '💵', '🏦', '💚', '📈', '🏠', '🚗', '💳', '📱', '💻', '🎮', '📷', '🎵', '📚', '🎁'
]

// 获取账户类型的余额颜色
export const getBalanceColor = (type: AccountType): string => {
  if (type === 'liability') {
    return '#FA3534'
  }
  return '#19BE6B'
}
