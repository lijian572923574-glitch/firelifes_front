<template>
  <view class="my-container">
    <!-- 用户信息卡片 -->
    <view class="user-card" :class="{ 'clickable': !userStore.isLoggedIn() }" @click="handleUserCardClick">
      <view class="user-info">
        <image 
          class="avatar" 
          :src="userStore.isLoggedIn() ? (userStore.user?.avatarUrl || '/static/logo.png') : '/static/logo.png'" 
          mode="aspectFill" 
        />
        <view class="info">
          <text class="nickname">
            {{ userStore.isLoggedIn() ? (userStore.user?.nickname || userStore.user?.username || '未设置昵称') : '点击登录' }}
          </text>
          <text class="phone" v-if="userStore.isLoggedIn()">
            {{ userStore.user?.phone || '' }}
          </text>
        </view>
      </view>
    </view>

    <!-- 菜单列表 -->
    <view class="menu-list">
      <view class="menu-item" @click="navigateToAccountList">
        <view class="menu-left">
          <text class="iconfont icon-zhangdan menu-icon"></text>
          <text class="menu-text">账户设置</text>
        </view>
        <text class="arrow">›</text>
      </view>
    </view>

    <!-- 退出登录按钮 -->
    <view class="logout-btn" v-if="userStore.isLoggedIn()" @click="handleLogout">
      退出登录
    </view>
  </view>
</template>

<script setup lang="ts">
import { useUserStore } from '../../stores/user'
import { logout } from '../../api/auth'

const userStore = useUserStore()

// 用户卡片点击事件
const handleUserCardClick = () => {
  if (!userStore.isLoggedIn()) {
    uni.redirectTo({
      url: '/pages/login/index'
    })
  }
}

// 跳转到账户设置
const navigateToAccountList = () => {
  uni.navigateTo({
    url: '/pages/my/account-setting/account-list'
  })
}

// 退出登录
const handleLogout = () => {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          await logout()
        } catch (err) {
          console.error(err)
        } finally {
          userStore.clearAuth()
          uni.redirectTo({
            url: '/pages/login/index'
          })
        }
      }
    }
  })
}
</script>

<style scoped>
.my-container {
  min-height: 100vh;
  background: #f5f5f5;
}

.user-card {
  background: linear-gradient(135deg, #00BFFF 0%, #0099CC 100%);
  padding: 80rpx 40rpx 60rpx;
}

.user-card.clickable {
  cursor: pointer;
}

.user-info {
  display: flex;
  align-items: center;
}

.avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 60rpx;
  border: 4rpx solid white;
  margin-right: 32rpx;
  background: white;
}

.info {
  display: flex;
  flex-direction: column;
}

.nickname {
  color: white;
  font-size: 36rpx;
  font-weight: bold;
  margin-bottom: 12rpx;
}

.phone {
  color: rgba(255, 255, 255, 0.8);
  font-size: 26rpx;
}

.menu-list {
  background: white;
  margin: 24rpx;
  border-radius: 16rpx;
  overflow: hidden;
}

.menu-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24rpx;
  height: 88rpx;
  border-bottom: 1rpx solid #f0f0f0;
  transition: transform 100ms ease;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-item:active {
  transform: scale(0.98);
}

.menu-left {
  display: flex;
  align-items: center;
}

.menu-icon {
  font-size: 36rpx;
  color: #00BFFF;
  margin-right: 20rpx;
}

.menu-text {
  font-size: 30rpx;
  color: #333;
}

.arrow {
  font-size: 40rpx;
  color: #ccc;
}

.logout-btn {
  margin: 60rpx 24rpx;
  background: white;
  color: #FA3534;
  text-align: center;
  padding: 32rpx;
  border-radius: 16rpx;
  font-size: 32rpx;
  transition: transform 100ms ease;
}

.logout-btn:active {
  transform: scale(0.98);
}
</style>
