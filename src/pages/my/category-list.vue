<template>
  <view class="page-container">
    <wd-navbar
      :title="groupName"
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

      <view v-else-if="!hasCategories" class="empty-state">
        <text class="empty-icon">📂</text>
        <text class="empty-text">添加你的第一个子分类</text>
      </view>

      <view v-else class="category-list">
        <wd-swipe-action
          v-for="category in categories"
          :key="category.id"
          :right-width="140"
        >
          <template #default>
            <view
              class="category-card"
              :class="{ 'card-disabled': !category.isEnabled }"
            >
              <view class="card-icon-wrapper">
                <text class="card-icon">{{ getIconUrl(category) }}</text>
              </view>
              <view class="card-info">
                <view class="card-title-row">
                  <text class="card-title">{{ category.name }}</text>
                  <view v-if="!category.isUserCreated" class="default-badge">
                    <text class="badge-text">默认</text>
                  </view>
                </view>
                <text v-if="!category.isEnabled" class="disabled-label">已禁用</text>
              </view>
            </view>
          </template>

          <template #right>
            <view class="swipe-actions">
              <view
                class="swipe-btn swipe-btn-edit"
                @click.stop="handleEdit(category)"
              >
                <text class="swipe-btn-text">编辑</text>
              </view>
              <view
                v-if="category.isUserCreated"
                class="swipe-btn swipe-btn-delete"
                @click.stop="handleDelete(category)"
              >
                <text class="swipe-btn-text">删除</text>
              </view>
              <view
                v-else
                class="swipe-btn swipe-btn-toggle"
                @click.stop="handleToggle(category)"
              >
                <text class="swipe-btn-text">{{ category.isEnabled ? '禁用' : '启用' }}</text>
              </view>
            </view>
          </template>
        </wd-swipe-action>
      </view>

      <view class="safe-bottom"></view>
    </view>

    <view
      v-if="showEditPopup"
      class="popup-mask"
      @click="closeEditPopup"
    >
      <view class="popup-content" @click.stop>
        <view class="popup-header">
          <text class="popup-title">{{ editingCategory ? '编辑子分类' : '新增子分类' }}</text>
          <text class="popup-close" @click="closeEditPopup">×</text>
        </view>
        <view class="popup-body">
          <view class="form-item">
            <text class="form-label">选择图标</text>
            <scroll-view scroll-x class="icon-scroll">
              <view class="icon-list">
                <view
                  v-for="icon in icons"
                  :key="icon.id"
                  class="icon-item"
                  :class="{ 'icon-item-active': editIconId === icon.id }"
                  @click="editIconId = icon.id"
                >
                  <text class="icon-emoji">{{ icon.url }}</text>
                </view>
              </view>
            </scroll-view>
          </view>

          <view class="form-item">
            <text class="form-label">分类名称</text>
            <input
              v-model="editName"
              class="form-input"
              type="text"
              placeholder="请输入分类名称"
              maxlength="20"
            />
          </view>

          <view v-if="!editingCategory" class="form-item">
            <text class="form-label">分类类型</text>
            <view class="type-selector">
              <view
                class="type-btn"
                :class="{ 'type-btn-active': editType === 'expense' }"
                @click="editType = 'expense'"
              >
                <text class="type-icon">💸</text>
                <text class="type-text">支出</text>
              </view>
              <view
                class="type-btn"
                :class="{ 'type-btn-active': editType === 'income' }"
                @click="editType = 'income'"
              >
                <text class="type-icon">💰</text>
                <text class="type-text">收入</text>
              </view>
            </view>
          </view>
        </view>

        <view class="popup-footer">
          <view class="footer-btn cancel-btn" @click="closeEditPopup">
            <text class="footer-btn-text">取消</text>
          </view>
          <view class="footer-btn confirm-btn" @click="confirmEdit">
            <text class="footer-btn-text">确定</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { categoryApi, type UserCategory, type UserIcon } from '../../api/category'
import { navigateBack } from '../../utils/navigate'

const groupId = ref(0)
const groupName = ref('')
const loading = ref(false)
const categories = ref<UserCategory[]>([])
const icons = ref<UserIcon[]>([])

const showEditPopup = ref(false)
const editingCategory = ref<UserCategory | null>(null)
const editName = ref('')
const editIconId = ref(0)
const editType = ref<'income' | 'expense'>('expense')

const hasCategories = computed(() => categories.value.length > 0)

function getIconUrl(category: UserCategory) {
  return category.icon?.url || '📦'
}

async function loadIcons() {
  try {
    const res = await categoryApi.getUserIcons()
    if (res.success && res.data.length > 0) {
      icons.value = res.data
      if (editIconId.value === 0) {
        editIconId.value = res.data[0].id
      }
    }
  } catch (err) {
    console.error('加载图标列表失败:', err)
  }
}

async function loadCategories() {
  loading.value = true
  try {
    const res = await categoryApi.getCategoriesByGroup(groupId.value)
    if (res.success) {
      categories.value = res.data
    } else {
      uni.showToast({
        title: res.message || '获取分类列表失败',
        icon: 'none'
      })
    }
  } catch (err) {
    console.error('加载分类列表失败:', err)
    uni.showToast({
      title: '网络错误',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}

function goBack() {
  navigateBack('/pages/my/category-group-list')
}

function handleAdd() {
  editingCategory.value = null
  editName.value = ''
  editType.value = 'expense'
  if (icons.value.length > 0) {
    editIconId.value = icons.value[0].id
  }
  showEditPopup.value = true
}

function handleEdit(category: UserCategory) {
  editingCategory.value = category
  editName.value = category.name
  editIconId.value = category.iconId
  showEditPopup.value = true
}

async function handleToggle(category: UserCategory) {
  try {
    const res = await categoryApi.toggleCategory(category.id)
    if (res.success) {
      uni.showToast({
        title: res.data.isEnabled ? '已启用' : '已禁用',
        icon: 'success'
      })
      loadCategories()
    } else {
      uni.showToast({ title: res.message || '操作失败', icon: 'none' })
    }
  } catch (err) {
    console.error('操作失败:', err)
    uni.showToast({ title: '网络错误', icon: 'none' })
  }
}

async function handleDelete(category: UserCategory) {
  uni.showModal({
    title: '提示',
    content: '确定要删除此分类吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          const apiRes = await categoryApi.deleteCategory(category.id)
          if (apiRes.success) {
            uni.showToast({ title: '删除成功', icon: 'success' })
            loadCategories()
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

async function confirmEdit() {
  const name = editName.value.trim()
  if (!name) {
    uni.showToast({ title: '请输入分类名称', icon: 'none' })
    return
  }
  if (!editIconId.value) {
    uni.showToast({ title: '请选择图标', icon: 'none' })
    return
  }

  const isDuplicate = editingCategory.value
    ? categories.value.some(c => c.name === name && c.id !== editingCategory.value!.id)
    : categories.value.some(c => c.name === name)

  if (isDuplicate) {
    uni.showToast({ title: '子分类名称已存在', icon: 'none' })
    return
  }

  try {
    let res
    if (editingCategory.value) {
      res = await categoryApi.updateCategory(editingCategory.value.id, {
        name,
        iconId: editIconId.value
      })
    } else {
      res = await categoryApi.createCategory({
        name,
        groupId: groupId.value,
        iconId: editIconId.value,
        type: editType.value
      })
    }

    if (res.success) {
      uni.showToast({ title: editingCategory.value ? '编辑成功' : '新增成功', icon: 'success' })
      showEditPopup.value = false
      loadCategories()
    } else {
      uni.showToast({ title: res.message || '操作失败', icon: 'none' })
    }
  } catch (err) {
    console.error('操作失败:', err)
    uni.showToast({ title: '网络错误', icon: 'none' })
  }
}

function closeEditPopup() {
  showEditPopup.value = false
  editingCategory.value = null
  editName.value = ''
  editIconId.value = icons.value.length > 0 ? icons.value[0].id : 0
  editType.value = 'expense'
}

onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1] as any
  const options = (currentPage.$page?.options || currentPage.options || {}) as Record<string, string>

  if (options.groupId) {
    groupId.value = parseInt(options.groupId)
  }
  if (options.groupName) {
    groupName.value = decodeURIComponent(options.groupName)
  }

  loadIcons()
  loadCategories()
})

onShow(() => {
  if (groupId.value > 0) {
    loadCategories()
  }
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

.category-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.category-card {
  height: 120rpx;
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 0 32rpx;
  background-color: #FFFFFF;
  border-radius: 20rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.04);
}

.category-card:active {
  background-color: #F8F9FA;
}

.card-disabled {
  opacity: 0.6;
}

.card-icon-wrapper {
  width: 88rpx;
  height: 88rpx;
  background: linear-gradient(135deg, rgba(0, 191, 255, 0.1) 0%, rgba(0, 153, 204, 0.1) 100%);
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.card-icon {
  font-size: 48rpx;
  line-height: 1;
}

.card-info {
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

/* 弹窗样式 - 仅用于子分类新增/编辑（含图标选择器） */
.popup-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.popup-content {
  width: 100%;
  max-height: 80vh;
  background-color: #FFFFFF;
  border-radius: 32rpx 32rpx 0 0;
  display: flex;
  flex-direction: column;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

.popup-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx;
  border-bottom: 1rpx solid #F0F2F5;
}

.popup-title {
  font-size: 34rpx;
  font-weight: 600;
  color: #333333;
}

.popup-close {
  font-size: 48rpx;
  color: #999999;
  line-height: 1;
}

.popup-body {
  flex: 1;
  overflow-y: auto;
  padding: 32rpx;
  display: flex;
  flex-direction: column;
  gap: 32rpx;
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.form-label {
  font-size: 28rpx;
  color: #666666;
}

.form-input {
  height: 88rpx;
  padding: 0 24rpx;
  background-color: #F8F9FA;
  border-radius: 16rpx;
  font-size: 28rpx;
  color: #333333;
}

.icon-scroll {
  width: 100%;
}

.icon-list {
  display: flex;
  gap: 16rpx;
  padding: 8rpx 0;
}

.icon-item {
  width: 96rpx;
  height: 96rpx;
  background-color: #F8F9FA;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 150ms ease;
  flex-shrink: 0;
}

.icon-item-active {
  background: linear-gradient(135deg, rgba(0, 191, 255, 0.15) 0%, rgba(0, 153, 204, 0.15) 100%);
  border: 2rpx solid #00BFFF;
}

.icon-emoji {
  font-size: 52rpx;
  line-height: 1;
}

.type-selector {
  display: flex;
  gap: 16rpx;
}

.type-btn {
  flex: 1;
  height: 96rpx;
  background-color: #F8F9FA;
  border-radius: 16rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  transition: all 150ms ease;
}

.type-btn-active {
  background: linear-gradient(135deg, rgba(0, 191, 255, 0.15) 0%, rgba(0, 153, 204, 0.15) 100%);
  border: 2rpx solid #00BFFF;
}

.type-icon {
  font-size: 36rpx;
  line-height: 1;
}

.type-text {
  font-size: 24rpx;
  color: #666666;
}

.type-btn-active .type-text {
  color: #00BFFF;
  font-weight: 500;
}

.popup-footer {
  display: flex;
  gap: 16rpx;
  padding: 32rpx;
  padding-bottom: calc(32rpx + env(safe-area-inset-bottom));
  border-top: 1rpx solid #F0F2F5;
}

.footer-btn {
  flex: 1;
  height: 88rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 150ms ease;
}

.cancel-btn {
  background-color: #F0F2F5;
}

.confirm-btn {
  background: linear-gradient(135deg, #00BFFF 0%, #0099CC 100%);
}

.footer-btn:active {
  opacity: 0.8;
  transform: scale(0.98);
}

.footer-btn-text {
  font-size: 30rpx;
  font-weight: 500;
  color: #666666;
}

.confirm-btn .footer-btn-text {
  color: #FFFFFF;
}
</style>
