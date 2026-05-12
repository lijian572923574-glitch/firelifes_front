<template>
  <view class="page-container">
    <WdNavbar
      :title="groupName"
      left-arrow
      fixed
      placeholder
      bordered
      safe-area-inset-top
      right-text="+"
      @click-left="goBack"
      @click-right="handleAdd"
    />

    <scroll-view scroll-y class="content-scroll">
      <view v-if="loading" class="loading-state">
        <WdLoading type="ring" />
        <text class="loading-text">加载中...</text>
      </view>

      <view v-else-if="!hasCategories" class="empty-state">
        <text class="empty-icon">📝</text>
        <text class="empty-text">添加你的第一个子分类</text>
      </view>

      <view v-else class="category-list">
        <WdSwipeAction
          v-for="(category, index) in categories"
          :key="category.id"
          v-model="openStates[index]"
        >
          <view class="category-card">
            <text class="category-icon">{{ category.icon?.url || '📦' }}</text>
            <text class="category-name">{{ category.name }}</text>
            <WdIcon name="arrow-right" size="16px" color="#CCCCCC" />
          </view>
          <template #right>
            <view class="swipe-actions">
              <WdButton
                size="small"
                type="primary"
                class="action-btn edit-btn"
                @click.stop="handleEdit(category)"
              >
                编辑
              </WdButton>
              <WdButton
                size="small"
                type="danger"
                class="action-btn delete-btn"
                @click.stop="handleDelete(category)"
              >
                删除
              </WdButton>
            </view>
          </template>
        </WdSwipeAction>
      </view>

      <view class="safe-bottom"></view>
    </scroll-view>

    <WdDialog
      v-model:visible="showEditDialog"
      :title="editingCategory ? '编辑子分类' : '新增子分类'"
      :show-cancel-button="true"
      :show-confirm-button="true"
      @confirm="confirmEdit"
      @cancel="closeEditDialog"
    >
      <view class="dialog-content">
        <view class="form-item">
          <text class="form-label">选择图标</text>
          <view class="icon-grid">
            <view
              v-for="icon in icons"
              :key="icon.id"
              class="icon-item"
              :class="{ 'icon-item-active': editIconId === icon.id }"
              @click="editIconId = icon.id"
            >
              <text class="icon-text">{{ icon.url }}</text>
            </view>
          </view>
        </view>

        <view class="form-item">
          <text class="form-label">分类名称</text>
          <WdInput
            v-model="editName"
            placeholder="请输入分类名称"
            :maxlength="20"
            show-clear
          />
        </view>

        <view v-if="!editingCategory" class="form-item">
          <text class="form-label">分类类型</text>
          <view class="type-selector">
            <view
              class="type-item"
              :class="{ 'type-item-active': editType === 'expense' }"
              @click="editType = 'expense'"
            >
              <text>支出</text>
            </view>
            <view
              class="type-item"
              :class="{ 'type-item-active': editType === 'income' }"
              @click="editType = 'income'"
            >
              <text>收入</text>
            </view>
          </view>
        </view>
      </view>
    </WdDialog>

    <WdDialog
      v-model:visible="showDeleteDialog"
      title="提示"
      :show-cancel-button="true"
      :show-confirm-button="true"
      @confirm="confirmDelete"
    >
      <view class="dialog-content">
        <text>确定要删除此子分类吗？</text>
      </view>
    </WdDialog>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { categoryApi } from '../../api/category'
import type { UserCategory, UserIcon } from '../../api/category'

const groupId = ref<number>(0)
const groupName = ref<string>('子分类管理')

const loading = ref(false)
const categories = ref<UserCategory[]>([])
const icons = ref<UserIcon[]>([])
const openStates = ref<string[]>([])

const showEditDialog = ref(false)
const showDeleteDialog = ref(false)
const editingCategory = ref<UserCategory | null>(null)
const editName = ref('')
const editIconId = ref<number>(0)
const editType = ref<'expense' | 'income'>('expense')
const deletingCategory = ref<UserCategory | null>(null)

const hasCategories = computed(() => categories.value.length > 0)

async function loadCategories() {
  loading.value = true
  try {
    const res = await categoryApi.getCategoriesByGroup(groupId.value)
    if (res.success) {
      categories.value = res.data
      openStates.value = res.data.map(() => 'close')
    } else {
      uni.showToast({
        title: res.message || '获取子分类列表失败',
        icon: 'none'
      })
    }
  } catch (err) {
    console.error('加载子分类列表失败:', err)
    uni.showToast({
      title: '网络错误',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}

async function loadIcons() {
  try {
    const res = await categoryApi.getUserIcons()
    if (res.success && res.data.length > 0) {
      icons.value = res.data
      editIconId.value = res.data[0].id
    }
  } catch (err) {
    console.error('加载图标列表失败:', err)
  }
}

function goBack() {
  uni.navigateBack()
}

function handleAdd() {
  editingCategory.value = null
  editName.value = ''
  editType.value = 'expense'
  if (icons.value.length > 0) {
    editIconId.value = icons.value[0].id
  }
  showEditDialog.value = true
}

function handleEdit(category: UserCategory) {
  editingCategory.value = category
  editName.value = category.name
  editIconId.value = category.iconId
  showEditDialog.value = true
}

function handleDelete(category: UserCategory) {
  deletingCategory.value = category
  showDeleteDialog.value = true
}

async function confirmEdit() {
  if (!editName.value.trim()) {
    uni.showToast({ title: '请输入分类名称', icon: 'none' })
    return
  }
  if (!editIconId.value) {
    uni.showToast({ title: '请选择图标', icon: 'none' })
    return
  }

  try {
    let res
    if (editingCategory.value) {
      res = await categoryApi.updateCategory(editingCategory.value.id, {
        name: editName.value.trim(),
        iconId: editIconId.value
      })
    } else {
      res = await categoryApi.createCategory({
        name: editName.value.trim(),
        groupId: groupId.value,
        iconId: editIconId.value,
        type: editType.value
      })
    }

    if (res.success) {
      uni.showToast({ title: editingCategory.value ? '编辑成功' : '新增成功', icon: 'success' })
      showEditDialog.value = false
      loadCategories()
    } else {
      uni.showToast({ title: res.message || '操作失败', icon: 'none' })
    }
  } catch (err) {
    console.error('操作失败:', err)
    uni.showToast({ title: '网络错误', icon: 'none' })
  }
}

function closeEditDialog() {
  showEditDialog.value = false
  editingCategory.value = null
  editName.value = ''
  editIconId.value = icons.value.length > 0 ? icons.value[0].id : 0
  editType.value = 'expense'
}

async function confirmDelete() {
  if (!deletingCategory.value) return

  try {
    const res = await categoryApi.deleteCategory(deletingCategory.value.id)
    if (res.success) {
      uni.showToast({ title: '删除成功', icon: 'success' })
      showDeleteDialog.value = false
      loadCategories()
    } else {
      uni.showToast({ title: res.message || '删除失败', icon: 'none' })
    }
  } catch (err) {
    console.error('删除失败:', err)
    uni.showToast({ title: '网络错误', icon: 'none' })
  }
}

onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const options = currentPage.options

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
  display: flex;
  flex-direction: column;
}

.content-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 16rpx 24rpx;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 0;
}

.loading-text {
  font-size: 28rpx;
  color: #999999;
  margin-top: 20rpx;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 0;
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

.category-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.category-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 88rpx;
  padding: 0 24rpx;
  background-color: #FFFFFF;
  border-radius: 16rpx;
}

.category-icon {
  font-size: 40rpx;
  margin-right: 16rpx;
}

.category-name {
  flex: 1;
  font-size: 30rpx;
  color: #333333;
  font-weight: 600;
}

.swipe-actions {
  display: flex;
  height: 100%;
}

.action-btn {
  width: 70rpx;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dialog-content {
  padding: 20rpx 0;
}

.form-item {
  margin-bottom: 30rpx;
}

.form-item:last-child {
  margin-bottom: 0;
}

.form-label {
  display: block;
  font-size: 28rpx;
  color: #333333;
  margin-bottom: 16rpx;
  font-weight: 600;
}

.icon-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16rpx;
}

.icon-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80rpx;
  background-color: #F5F5F5;
  border-radius: 12rpx;
  border: 2rpx solid transparent;
  transition: all 0.3s;
}

.icon-item-active {
  background-color: #E6F7FF;
  border-color: #00BFFF;
}

.icon-text {
  font-size: 36rpx;
}

.type-selector {
  display: flex;
  gap: 16rpx;
}

.type-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 72rpx;
  background-color: #F5F5F5;
  border-radius: 12rpx;
  border: 2rpx solid transparent;
  transition: all 0.3s;
}

.type-item-active {
  background-color: #E6F7FF;
  border-color: #00BFFF;
  color: #00BFFF;
}

.type-item text {
  font-size: 28rpx;
  color: #333333;
}

.type-item-active text {
  color: #00BFFF;
  font-weight: 600;
}

.safe-bottom {
  height: env(safe-area-inset-bottom);
}
</style>
