<template>
  <view class="account-list-page">
    <!-- 导航栏 -->
    <view class="navbar">
      <view class="nav-left" @click="goBack">
        <text class="nav-icon">←</text>
      </view>
      <view class="nav-title">账户列表</view>
      <view class="nav-right" @click="goToAdd">
        <text class="nav-icon">+</text>
      </view>
    </view>

    <!-- 内容区域 -->
    <scroll-view class="content" scroll-y>
      <!-- 加载中 -->
      <view v-if="loading" class="loading-state">
        <text class="loading-text">加载中...</text>
      </view>

      <!-- 空状态 -->
      <view v-else-if="!hasAccounts" class="empty-state">
        <text class="empty-icon">📭</text>
        <text class="empty-text">还没有账户，点击右上角 + 添加第一个账户</text>
      </view>

      <!-- 账户列表 -->
      <view v-else>
        <!-- 按类型分组 -->
        <view v-for="group in groupedAccounts" :key="group.type" class="group-section">
          <view class="group-title">
            <view class="title-line"></view>
            <text>{{ getTypeLabel(group.type) }}</text>
          </view>
          <view class="account-cards">
            <view
              v-for="account in group.accounts"
              :key="account.id"
              class="account-card"
              @click="goToEdit(account.id)"
            >
              <view class="card-left">
                <text class="account-icon">{{ account.icon }}</text>
                <view class="account-info">
                  <text class="account-name">{{ account.name }}</text>
                  <text v-if="account.description" class="account-desc">{{ account.description }}</text>
                </view>
              </view>
              <view class="card-right">
                <text class="balance" :style="{ color: getBalanceColor(account.type) }">
                  ¥{{ formatBalance(account.balance) }}
                </text>
                <text class="arrow">›</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 底部安全区域 -->
      <view class="safe-bottom"></view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { getAccountList } from '../../../api/account';
import type { Account, AccountType } from '../../../types/account';
import { ACCOUNT_TYPE_OPTIONS, getBalanceColor } from '../../../types/account';

// 加载状态
const loading = ref(false);

// 账户列表
const accounts = ref<Account[]>([]);

// 分组后的账户
const groupedAccounts = computed(() => {
  const groups: { type: AccountType; accounts: Account[] }[] = [];
  const typeOrder: AccountType[] = ['cash', 'investment', 'fixed_asset', 'depreciable_asset', 'liability'];

  typeOrder.forEach(type => {
    const typeAccounts = accounts.value.filter(a => a.type === type);
    if (typeAccounts.length > 0) {
      groups.push({ type, accounts: typeAccounts });
    }
  });

  return groups;
});

// 是否有账户
const hasAccounts = computed(() => accounts.value.length > 0);

// 获取账户类型标签
const getTypeLabel = (type: AccountType): string => {
  const option = ACCOUNT_TYPE_OPTIONS.find(o => o.value === type);
  return option?.label || type;
};

// 格式化余额
const formatBalance = (balance: number): string => {
  return balance.toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

// 加载账户列表
const loadAccounts = async () => {
  loading.value = true;
  try {
    const res = await getAccountList();
    if (res.success) {
      accounts.value = res.data;
    } else {
      uni.showToast({
        title: res.message || '获取账户列表失败',
        icon: 'none'
      });
    }
  } catch (err) {
    console.error('加载账户列表失败:', err);
    uni.showToast({
      title: '网络错误',
      icon: 'none'
    });
  } finally {
    loading.value = false;
  }
};

// 返回上一页
const goBack = () => {
  const pages = getCurrentPages();
  if (pages.length > 1) {
    uni.navigateBack();
  } else {
    uni.redirectTo({
      url: '/pages/my/index'
    });
  }
};

// 跳转新增账户
const goToAdd = () => {
  uni.navigateTo({
    url: '/pages/my/account-setting/account-edit'
  });
};

// 跳转编辑账户
const goToEdit = (id: string) => {
  uni.navigateTo({
    url: `/pages/my/account-setting/account-edit?id=${id}`
  });
};

// 页面显示时重新加载
onShow(() => {
  loadAccounts();
});
</script>

<style>
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
}

.nav-left,
.nav-right {
  width: 80rpx;
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-icon {
  font-size: 36rpx;
  color: #333333;
}

.nav-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333333;
}

/* 内容区域 */
.content {
  flex: 1;
  overflow-y: auto;
  padding: 16rpx 0;
}

/* 加载状态 */
.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 120rpx 48rpx;
}

.loading-text {
  font-size: 28rpx;
  color: #999999;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 48rpx;
}

.empty-icon {
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

/* 分组区域 */
.group-section {
  margin-bottom: 24rpx;
}

/* 分组标题 */
.group-title {
  display: flex;
  align-items: center;
  height: 64rpx;
  padding-left: 24rpx;
  font-size: 28rpx;
  font-weight: 600;
  color: #666666;
}

.title-line {
  width: 6rpx;
  height: 28rpx;
  background: linear-gradient(180deg, #00BFFF 0%, #0099CC 100%);
  border-radius: 3rpx;
  margin-right: 12rpx;
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
  padding: 24rpx;
  background-color: #FFFFFF;
  border-radius: 16rpx;
  margin-bottom: 16rpx;
  transition: transform 100ms ease;
}

.account-card:last-child {
  margin-bottom: 0;
}

.account-card:active {
  transform: scale(0.98);
}

.card-left {
  display: flex;
  align-items: center;
  flex: 1;
}

.account-icon {
  font-size: 48rpx;
  margin-right: 16rpx;
}

.account-info {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.account-name {
  font-size: 30rpx;
  color: #333333;
  font-weight: 500;
  margin-bottom: 4rpx;
}

.account-desc {
  font-size: 24rpx;
  color: #999999;
  line-height: 1.4;
}

.card-right {
  display: flex;
  align-items: center;
  margin-left: 16rpx;
}

.balance {
  font-size: 30rpx;
  font-weight: 600;
  margin-right: 12rpx;
}

.arrow {
  font-size: 32rpx;
  color: #CCCCCC;
}

/* 底部安全区域 */
.safe-bottom {
  height: env(safe-area-inset-bottom);
}
</style>
