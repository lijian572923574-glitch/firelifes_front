<template>
  <view class="custom-tabbar">
    <view 
      v-for="(item, index) in tabList" 
      :key="index"
      class="tab-item"
      @click="switchTab(item.pagePath)"
    >
      <view class="tab-icon">
        <text class="icon-emoji" :class="{ 'active': selectedTab === item.pagePath }">
          {{ item.emoji }}
        </text>
      </view>
      <text class="tab-text" :class="{ 'active': selectedTab === item.pagePath }">
        {{ item.text }}
      </text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const selectedTab = ref('pages/detail/index')

const tabList = [
  {
    pagePath: 'pages/detail/index',
    emoji: '📋',
    text: '明细'
  },
  {
    pagePath: 'pages/statistics/index',
    emoji: '📊',
    text: '统计'
  },
  {
    pagePath: 'pages/record/index',
    emoji: '📝',
    text: '记账'
  },
  {
    pagePath: 'pages/analysis/index',
    emoji: '💰',
    text: '资产'
  },
  {
    pagePath: 'pages/my/index',
    emoji: '👤',
    text: '我的'
  }
]

const switchTab = (pagePath: string) => {
  selectedTab.value = pagePath
  uni.switchTab({ 
    url: '/' + pagePath,
    success: () => {
      console.log('Tab切换成功:', pagePath)
    },
    fail: (err) => {
      console.error('Tab切换失败:', err)
    }
  })
}

const updateTab = () => {
  const pages = getCurrentPages()
  if (pages.length > 0) {
    const currentPage = pages[pages.length - 1]
    selectedTab.value = currentPage.route
  }
}

onMounted(() => {
  updateTab()
})

onUnmounted(() => {
})
</script>

<style scoped>
.custom-tabbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 80px;
  background-color: #ffffff;
  border-top: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: space-around;
  z-index: 999;
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.tab-icon {
  width: 28px;
  height: 28px;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-emoji {
  font-size: 24px;
  opacity: 0.7;
}

.icon-emoji.active {
  opacity: 1;
}

.tab-text {
  font-size: 12px;
  color: #7A7E83;
}

.tab-text.active {
  color: #3cc51f;
}
</style>