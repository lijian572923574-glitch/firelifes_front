<template>
  <view class="account-list-page">
    <!-- 导航栏 -->
    <view class="navbar">
      <view class="nav-left" @click="goBack">
        <text class="iconfont icon-back">←</text>
      </view>
      <view class="nav-title">我的账户</view>
      <view class="nav-right" @click="goToAdd">
        <text class="iconfont icon-add">+</text>
      </view>
    </view>

    <!-- 内容区域 -->
    <scroll-view class="content" scroll-y>
      <!-- 空状态 -->
      <view v-if="!hasAccounts" class="empty-state">
        <text class="iconfont icon-empty">📭</text>
        <text class="empty-text">还没有账户，点击右上角 + 添加第一个账户</text>
      </view>

      <!-- 账户列表 -->
      <template v-else>
        <!-- 资产类分组 -->
        <view v-if="assetAccounts.length > 0" class="group-section">
          <view class="group-title">
            <view class="title-line"></view>
            <text>资产类</text>
          </view>

          <!-- 现金类子分组 -->
          <view v-if="cashAccounts.length > 0" class="sub-group">
            <view class="sub-group-title">现金类</view>
            <view class="account-cards">
              <view
                v-for="account in cashAccounts"
                :key="account.id"
                class="account-card"
                @click="goToEdit(account.id)"
                @touchstart="handleTouchStart"
                @touchend="handleTouchEnd"
              >
                <view class="card-left">
                  <text class="iconfont account-icon" :style="{ color: '#00BFFF' }">{{ account.icon }}</text>
                  <text class="account-name">{{ account.name }}</text>
                </view>
                <view class="card-right">
                  <text class="balance asset-balance">¥{{ formatBalance(account.balance) }}</text>
                  <text class="arrow">›</text>
                </view>
              </view>
            </view>
          </view>

          <!-- 投资类子分组 -->
          <view v-if="investmentAccounts.length > 0" class="sub-group">
            <view class="sub-group-title">投资类</view>
            <view class="account-cards">
              <view
                v-for="account in investmentAccounts"
                :key="account.id"
                class="account-card"
                @click="goToEdit(account.id)"
                @touchstart="handleTouchStart"
                @touchend="handleTouchEnd"
              >
                <view class="card-left">
                  <text class="iconfont account-icon" :style="{ color: '#00BFFF' }">{{ account.icon }}</text>
                  <text class="account-name">{{ account.name }}</text>
                </view>
                <view class="card-right">
                  <text class="balance asset-balance">¥{{ formatBalance(account.balance) }}</text>
                  <text class="arrow">›</text>
                </view>
              </view>
            </view>
          </view>

          <!-- 固定资产子分组 -->
          <view v-if="fixedAccounts.length > 0" class="sub-group">
            <view class="sub-group-title">固定资产</view>
            <view class="account-cards">
              <view
                v-for="account in fixedAccounts"
                :key="account.id"
                class="account-card"
                @click="goToEdit(account.id)"
                @touchstart="handleTouchStart"
                @touchend="handleTouchEnd"
              >
                <view class="card-left">
                  <text class="iconfont account-icon" :style="{ color: '#00BFFF' }">{{ account.icon }}</text>
                  <text class="account-name">{{ account.name }}</text>
                </view>
                <view class="card-right">
                  <text class="balance asset-balance">¥{{ formatBalance(account.balance) }}</text>
                  <text class="arrow">›</text>
                </view>
              </view>
            </view>
          </view>

          <!-- 折旧资产子分组 -->
          <view v-if="depreciatingAccounts.length > 0" class="sub-group">
            <view class="sub-group-title">折旧资产</view>
            <view class="account-cards">
              <view
                v-for="account in depreciatingAccounts"
                :key="account.id"
                class="account-card"
                @click="goToEdit(account.id)"
                @touchstart="handleTouchStart"
                @touchend="handleTouchEnd"
              >
                <view class="card-left">
                  <text class="iconfont account-icon" :style="{ color: '#00BFFF' }">{{ account.icon }}</text>
                  <text class="account-name">{{ account.name }}</text>
                </view>
                <view class="card-right">
                  <text class="balance asset-balance">¥{{ formatBalance(account.balance) }}</text>
                  <text class="arrow">›</text>
                </view>
              </view>
            </view>
          </view>
        </view>

        <!-- 负债类分组 -->
        <view v-if="liabilityAccounts.length > 0" class="group-section">
          <view class="group-title">
            <view class="title-line"></view>
            <text>负债类</text>
          </view>

          <!-- 信用卡子分组 -->
          <view v-if="creditCardAccounts.length > 0" class="sub-group">
            <view class="sub-group-title">信用卡</view>
            <view class="account-cards">
              <view
                v-for="account in creditCardAccounts"
                :key="account.id"
                class="account-card"
                @click="goToEdit(account.id)"
                @touchstart="handleTouchStart"
                @touchend="handleTouchEnd"
              >
                <view class="card-left">
                  <text class="iconfont account-icon" :style="{ color: '#00BFFF' }">{{ account.icon }}</text>
                  <text class="account-name">{{ account.name }}</text>
                </view>
                <view class="card-right">
                  <text class="balance liability-balance">¥{{ formatBalance(account.balance) }}</text>
                  <text class="arrow">›</text>
                </view>
              </view>
            </view>
          </view>

          <!-- 消费信贷子分组 -->
          <view v-if="consumerCreditAccounts.length > 0" class="sub-group">
            <view class="sub-group-title">消费信贷</view>
            <view class="account-cards">
              <view
                v-for="account in consumerCreditAccounts"
                :key="account.id"
                class="account-card"
                @click="goToEdit(account.id)"
                @touchstart="handleTouchStart"
                @touchend="handleTouchEnd"
              >
                <view class="card-left">
                  <text class="iconfont account-icon" :style="{ color: '#00BFFF' }">{{ account.icon }}</text>
                  <text class="account-name">{{ account.name }}</text>
                </view>
                <view class="card-right">
                  <text class="balance liability-balance">¥{{ formatBalance(account.balance) }}</text>
                  <text class="arrow">›</text>
                </view>
              </view>
            </view>
          </view>

          <!-- 房贷/车贷子分组 -->
          <view v-if="mortgageCarLoanAccounts.length > 0" class="sub-group">
            <view class="sub-group-title">房贷/车贷</view>
            <view class="account-cards">
              <view
                v-for="account in mortgageCarLoanAccounts"
                :key="account.id"
                class="account-card"
                @click="goToEdit(account.id)"
                @touchstart="handleTouchStart"
                @touchend="handleTouchEnd"
              >
                <view class="card-left">
                  <text class="iconfont account-icon" :style="{ color: '#00BFFF' }">{{ account.icon }}</text>
                  <text class="account-name">{{ account.name }}</text>
                </view>
                <view class="card-right">
                  <text class="balance liability-balance">¥{{ formatBalance(account.balance) }}</text>
                  <text class="arrow">›</text>
                </view>
              </view>
            </view>
          </view>

          <!-- 借款子分组 -->
          <view v-if="loanAccounts.length > 0" class="sub-group">
            <view class="sub-group-title">借款</view>
            <view class="account-cards">
              <view
                v-for="account in loanAccounts"
                :key="account.id"
                class="account-card"
                @click="goToEdit(account.id)"
                @touchstart="handleTouchStart"
                @touchend="handleTouchEnd"
              >
                <view class="card-left">
                  <text class="iconfont account-icon" :style="{ color: '#00BFFF' }">{{ account.icon }}</text>
                  <text class="account-name">{{ account.name }}</text>
                </view>
                <view class="card-right">
                  <text class="balance liability-balance">¥{{ formatBalance(account.balance) }}</text>
                  <text class="arrow">›</text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </template>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// 模拟数据类型
interface Account {
  id: string
  name: string
  icon: string
  type: 'asset' | 'liability'
  subType: string
  balance: number
}

// 模拟数据
const mockAccounts = ref<Account[]>([
  {
    id: '1',
    name: '现金',
    icon: '💵',
    type: 'asset',
    subType: 'cash',
    balance: 3210.00
  },
  {
    id: '2',
    name: '储蓄卡',
    icon: '🏦',
    type: 'asset',
    subType: 'cash',
    balance: 12345.67
  },
  {
    id: '3',
    name: '支付宝',
    icon: '💚',
    type: 'asset',
    subType: 'cash',
    balance: 5678.90
  },
  {
    id: '4',
    name: '招商信用卡',
    icon: '💳',
    type: 'liability',
    subType: 'credit_card',
    balance: -2345.00
  }
])

// 计算属性 - 分组过滤
const assetAccounts = computed(() => mockAccounts.value.filter(a => a.type === 'asset'))
const liabilityAccounts = computed(() => mockAccounts.value.filter(a => a.type === 'liability'))

// 资产类子分组
const cashAccounts = computed(() => assetAccounts.value.filter(a => a.subType === 'cash'))
const investmentAccounts = computed(() => assetAccounts.value.filter(a => a.subType === 'investment'))
const fixedAccounts = computed(() => assetAccounts.value.filter(a => a.subType === 'fixed'))
const depreciatingAccounts = computed(() => assetAccounts.value.filter(a => a.subType === 'depreciating'))

// 负债类子分组
const creditCardAccounts = computed(() => liabilityAccounts.value.filter(a => a.subType === 'credit_card'))
const consumerCreditAccounts = computed(() => liabilityAccounts.value.filter(a => a.subType === 'consumer_credit'))
const mortgageCarLoanAccounts = computed(() => liabilityAccounts.value.filter(a => a.subType === 'mortgage' || a.subType === 'car_loan'))
const loanAccounts = computed(() => liabilityAccounts.value.filter(a => a.subType === 'loan'))

// 是否有账户
const hasAccounts = computed(() => mockAccounts.value.length > 0)

// 格式化余额
const formatBalance = (balance: number): string => {
  return balance.toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

// 返回上一页
const goBack = () => {
  uni.navigateBack()
}

// 跳转新增账户
const goToAdd = () => {
  uni.navigateTo({
    url: '/pages/my/account-setting/account-edit'
  })
}

// 跳转编辑账户
const goToEdit = (id: string) => {
  uni.navigateTo({
    url: `/pages/my/account-setting/account-edit?id=${id}`
  })
}

// 触摸动画 - 开始
const handleTouchStart = (e: TouchEvent) => {
  const target = e.currentTarget as HTMLElement
  target.style.transform = 'scale(0.98)'
  target.style.transition = 'transform 100ms ease'
}

// 触摸动画 - 结束
const handleTouchEnd = (e: TouchEvent) => {
  const target = e.currentTarget as HTMLElement
  target.style.transform = 'scale(1)'
}
</script>

<style scoped lang="scss">
.account-list-page {
  min-height: 100vh;
  background-color: #F5F5F5;
  display: flex;
  flex-direction: column;
}

/* 导航栏 */
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 88rpx;
  padding: 0 24rpx;
  background-color: #FFFFFF;
  position: sticky;
  top: 0;
  z-index: 100;

  .nav-left,
  .nav-right {
    width: 80rpx;
    height: 88rpx;
    display: flex;
    align-items: center;
    justify-content: center;

    text {
      font-size: 36rpx;
      color: #333333;
    }
  }

  .nav-title {
    font-size: 32rpx;
    font-weight: 600;
    color: #333333;
  }
}

/* 内容区域 */
.content {
  flex: 1;
  overflow-y: auto;
  padding: 16rpx 0;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 48rpx;

  .icon-empty {
    font-size: 120rpx;
    margin-bottom: 32rpx;
    opacity: 0.5;
  }

  .empty-text {
    font-size: 28rpx;
    color: #999999;
    text-align: center;
    line-height: 1.6;
  }
}

/* 分组区域 */
.group-section {
  margin-bottom: 24rpx;
}

/* 分组标题 - 资产类/负债类 */
.group-title {
  display: flex;
  align-items: center;
  height: 64rpx;
  padding-left: 24rpx;
  font-size: 28rpx;
  font-weight: 600;
  color: #666666;

  .title-line {
    width: 6rpx;
    height: 28rpx;
    background: linear-gradient(180deg, #00BFFF 0%, #0099CC 100%);
    border-radius: 3rpx;
    margin-right: 12rpx;
  }
}

/* 子分组 */
.sub-group {
  .sub-group-title {
    height: 48rpx;
    padding-left: 24rpx;
    font-size: 24rpx;
    color: #999999;
    display: flex;
    align-items: center;
  }
}

/* 账户卡片列表 */
.account-cards {
  padding: 0 24rpx;
}

/* 账户卡片 */
.account-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 112rpx;
  padding: 0 24rpx;
  background-color: #FFFFFF;
  border-radius: 16rpx;
  margin-bottom: 16rpx;

  &:last-child {
    margin-bottom: 0;
  }

  .card-left {
    display: flex;
    align-items: center;

    .account-icon {
      font-size: 48rpx;
      margin-right: 16rpx;
    }

    .account-name {
      font-size: 30rpx;
      color: #333333;
      font-weight: 500;
    }
  }

  .card-right {
    display: flex;
    align-items: center;

    .balance {
      font-size: 30rpx;
      font-weight: 600;
      margin-right: 12rpx;

      &.asset-balance {
        color: #19BE6B;
      }

      &.liability-balance {
        color: #FA3534;
      }
    }

    .arrow {
      font-size: 32rpx;
      color: #CCCCCC;
    }
  }
}
</style>
