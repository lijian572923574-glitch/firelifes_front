<template>
  <view class="page-container">
    <wd-navbar
      title="分类设置"
      left-arrow
      fixed
      placeholder
      bordered
      safe-area-inset-top
      right-text="+"
      @click-right="handleAdd"
      @click-left="goBack"
    />

    <view class="content-scroll">
      <view v-if="loading" class="loading-state">
        <text class="loading-icon">⏳</text>
        <text class="loading-text">加载中...</text>
      </view>

      <view v-else-if="!hasGroups" class="empty-state">
        <text class="empty-icon">📝</text>
        <text class="empty-text">添加你的第一个分类</text>
      </view>

      <view v-else class="group-list">
        <wd-swipe-action
          v-for="group in groups"
          :key="group.id"
          :right-width="140"
        >
          <template #default>
            <view
              class="group-card"
              :class="{ 'card-disabled': !group.isEnabled }"
              @click="goToCategoryList(group)"
            >
              <view class="card-content">
                <view class="card-title-row">
                  <text class="card-title">{{ group.name }}</text>
                  <view v-if="!group.isUserCreated" class="default-badge">
                    <text class="badge-text">默认</text>
                  </view>
                </view>
                <text v-if="!group.isEnabled" class="disabled-label">已禁用</text>
              </view>
              <text class="card-arrow">›</text>
            </view>
          </template>

          <template #right>
            <view class="swipe-actions">
              <view
                class="swipe-btn swipe-btn-edit"
                @click.stop="handleEdit(group)"
              >
                <text class="swipe-btn-text">编辑</text>
              </view>
              <view
                v-if="group.isUserCreated"
                class="swipe-btn swipe-btn-delete"
                @click.stop="handleDelete(group)"
              >
                <text class="swipe-btn-text">删除</text>
              </view>
              <view
                v-else
                class="swipe-btn swipe-btn-toggle"
                @click.stop="handleToggle(group)"
              >
                <text class="swipe-btn-text">{{ group.isEnabled ? '禁用' : '启用' }}</text>
              </view>
            </view>
          </template>
        </wd-swipe-action>
      </view>

      <view class="safe-bottom"></view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { categoryApi, type UserCategoryGroup } from '../../api/category'
import { navigateBack } from '../../utils/navigate'

const loading = ref(false)
const groups = ref<UserCategoryGroup[]>([])

const hasGroups = computed(() => groups.value.length > 0)

async function loadGroups() {
  loading.value = true
  try {
    const res = await categoryApi.getUserGroups()
    if (res.success) {
      groups.value = res.data
    } else {
      uni.showToast({
        title: res.message || '获取分类列表失败',
        icon: 'none'
      })
    }
  } catch (error) {
    console.error('加载分类列表失败:', error)
    uni.showToast({
      title: '网络错误',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}

function goBack() {
  navigateBack('/pages/my/index')
}

function goToCategoryList(group: UserCategoryGroup) {
  uni.navigateTo({
    url: `/pages/my/category-list?groupId=${group.id}&groupName=${encodeURIComponent(group.name)}`
  })
}

async function handleAdd() {
  uni.showModal({
    title: '新增分类',
    editable: true,
    placeholderText: '请输入分类名称',
    content: '',
    success: async (res) => {
      if (res.confirm) {
        const name = (res.content || '').trim()
        if (!name) {
          uni.showToast({ title: '请输入分类名称', icon: 'none' })
          return
        }
        const isDuplicate = groups.value.some(g => g.name === name)
        if (isDuplicate) {
          uni.showToast({ title: '分类名称已存在', icon: 'none' })
          return
        }
        try {
          const apiRes = await categoryApi.createUserGroup({ name })
          if (apiRes.success) {
            uni.showToast({ title: '新增成功', icon: 'success' })
            loadGroups()
          } else {
            uni.showToast({ title: apiRes.message || '新增失败', icon: 'none' })
          }
        } catch (err) {
          uni.showToast({ title: '网络错误', icon: 'none' })
        }
      }
    }
  })
}

async function handleEdit(group: UserCategoryGroup) {
  uni.showModal({
    title: '编辑分类',
    editable: true,
    placeholderText: '请输入分类名称',
    content: group.name,
    success: async (res) => {
      if (res.confirm) {
        const name = (res.content || '').trim()
        if (!name) {
          uni.showToast({ title: '请输入分类名称', icon: 'none' })
          return
        }
        const isDuplicate = groups.value.some(g => g.name === name && g.id !== group.id)
        if (isDuplicate) {
          uni.showToast({ title: '分类名称已存在', icon: 'none' })
          return
        }
        try {
          const apiRes = await categoryApi.updateUserGroup(group.id, { name })
          if (apiRes.success) {
            uni.showToast({ title: '编辑成功', icon: 'success' })
            loadGroups()
          } else {
            uni.showToast({ title: apiRes.message || '编辑失败', icon: 'none' })
          }
        } catch (err) {
          uni.showToast({ title: '网络错误', icon: 'none' })
        }
      }
    }
  })
}

async function handleToggle(group: UserCategoryGroup) {
  try {
    const res = await categoryApi.toggleUserGroup(group.id)
    if (res.success) {
      uni.showToast({
        title: res.data.isEnabled ? '已启用' : '已禁用',
        icon: 'success'
      })
      loadGroups()
    } else {
      uni.showToast({ title: res.message || '操作失败', icon: 'none' })
    }
  } catch (error) {
    console.error('操作失败:', error)
    uni.showToast({ title: '网络错误', icon: 'none' })
  }
}

async function handleDelete(group: UserCategoryGroup) {
  uni.showModal({
    title: '提示',
    content: '确定要删除此分类吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          const apiRes = await categoryApi.deleteUserGroup(group.id)
          if (apiRes.success) {
            uni.showToast({ title: '删除成功', icon: 'success' })
            loadGroups()
          } else {
            uni.showToast({ title: apiRes.message || '删除失败', icon: 'none' })
          }
        } catch (err) {
          uni.showToast({ title: '网络错误', icon: 'none' })
        }
      }
    }
  })
}

onMounted(() => {
  loadGroups()
})

onShow(() => {
  loadGroups()
})
</script>

<style scoped>
.page-container {
  overflow-x: hidden;
  min-height: 100vh;
  background-color: #F5F5F5;
}

.content-scroll {
  padding: 24rpx;
}

.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 160rpx 0;
}

.loading-icon,
.empty-icon {
  font-size: 120rpx;
  margin-bottom: 24rpx;
  opacity: 0.4;
}

.loading-text,
.empty-text {
  font-size: 28rpx;
  color: #999999;
  text-align: center;
  line-height: 1.6;
}

.group-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.group-card {
  height: 120rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32rpx;
  background-color: #FFFFFF;
  border-radius: 20rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.04);
}

.group-card:active {
  background-color: #F8F9FA;
}

.card-disabled {
  opacity: 0.6;
}

.card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.card-title-row {
  display: flex;
  align-items: center;
  gap: 12rpx;
  flex-wrap: wrap;
}

.card-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333333;
}

.default-badge {
  background: linear-gradient(135deg, #00BFFF 0%, #0099CC 100%);
  padding: 2rpx 12rpx;
  border-radius: 8rpx;
}

.badge-text {
  font-size: 20rpx;
  color: #FFFFFF;
  font-weight: 500;
}

.disabled-label {
  font-size: 24rpx;
  color: #FAAD14;
}

.card-arrow {
  font-size: 44rpx;
  color: #CCCCCC;
  line-height: 1;
}

.swipe-actions {
  display: flex;
  height: 100%;
}

.swipe-btn {
  width: 70rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.swipe-btn-edit {
  background-color: #00BFFF;
}

.swipe-btn-delete {
  background-color: #FA3534;
}

.swipe-btn-toggle {
  background-color: #FAAD14;
}

.swipe-btn-text {
  font-size: 26rpx;
  color: #FFFFFF;
  font-weight: 500;
}

.safe-bottom {
  height: calc(env(safe-area-inset-bottom) + 40rpx);
}
</style>
