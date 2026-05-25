// 账户类型枚举
export type AccountType = 'cash' | 'investment' | 'fixed_asset' | 'depreciable_asset' | 'liability';

// 还款方式类型
export type RepaymentMethod = 'equal_principal_interest' | 'equal_principal' | 'interest_first' | 'flexible';

// 账户数据结构
export interface Account {
  id: string;
  userId: string;
  name: string;
  icon: string;
  type: AccountType;
  balance: number;
  description?: string;
  isDefaultExpense: boolean;     // 是否为默认支出账户
  isDefaultIncome: boolean;      // 是否为默认收入账户
  // 负债类账户专用字段
  originalPrincipal?: number;         // 原始贷款总本金
  annualInterestRate?: number;        // 贷款年利率
  repaymentMethod?: RepaymentMethod;  // 还款方式
  totalMonths?: number;               // 总还款期数
  remainingMonths?: number;            // 剩余还款期数
  repaymentDay?: number;               // 每月还款日
  linkedAssetAccountId?: string;       // 关联资产账户ID
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
  isDefaultExpense: boolean;
  isDefaultIncome: boolean;
  // 负债类账户专用字段
  originalPrincipal?: number;
  annualInterestRate?: number;
  repaymentMethod?: RepaymentMethod;
  totalMonths?: number;
  remainingMonths?: number;
  repaymentDay?: number;
  linkedAssetAccountId?: string;
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
    isDefaultExpense: true,
    isDefaultIncome: true,
    isVisible: true,
    isDeleted: false
  },
  {
    name: '折旧资产',
    icon: '📱',
    type: 'depreciable_asset',
    balance: 0,
    description: '手机、电脑等折旧物品',
    order: 2,
    isDefaultExpense: false,
    isDefaultIncome: false,
    isVisible: true,
    isDeleted: false
  },
  {
    name: '固定资产',
    icon: '🏠',
    type: 'fixed_asset',
    balance: 0,
    description: '房产、车位等高价值物品',
    order: 3,
    isDefaultExpense: false,
    isDefaultIncome: false,
    isVisible: true,
    isDeleted: false
  }
]

// 账户类型选项
export const ACCOUNT_TYPE_OPTIONS = [
  { value: 'cash' as AccountType, label: '现金类' },
  { value: 'investment' as AccountType, label: '投资类' },
  { value: 'fixed_asset' as AccountType, label: '固定资产类' },
  { value: 'depreciable_asset' as AccountType, label: '折旧资产类' },
  { value: 'liability' as AccountType, label: '负债类' }
]

// 预设图标
export const ACCOUNT_ICONS = [
  '💵', '🏦', '💚', '📈', '🏠', '🚗', '💳', '📱', '💻', '🎮', '📷', '🎵', '📚', '🎁'
]

// 获取账户类型的余额颜色
export const getBalanceColor = (type: AccountType, balance?: number): string => {
  if (balance !== undefined && balance < 0) {
    return '#FA3534'
  }
  if (type === 'liability') {
    return '#FA3534'
  }
  return '#19BE6B'
}
