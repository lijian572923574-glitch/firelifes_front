<template>
  <view class="page-container">
    <WdNavbar
      title="分类管理"
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

      <view v-else-if="!hasGroups" class="empty-state">
        <text class="empty-icon">📝</text>
        <text class="empty-text">添加你的第一个分类</text>
      </view>

      <view v-else class="group-list">
        <WdSwipeAction
          v-for="(group, index) in groups"
          :key="group.id"
          v-model="openStates[index]"
        >
          <view class="group-card" @click="goToCategoryList(group)">
            <text class="group-name">{{ group.name }}</text>
            <WdIcon name="arrow-right" size="16px" color="#CCCCCC" />
          </view>
          <template #right>
            <view class="swipe-actions">
              <WdButton
                size="small"
                type="primary"
                class="action-btn edit-btn"
                @click.stop="handleEdit(group)"
              >
                编辑
              </WdButton>
              <WdButton
                size="small"
                type="danger"
                class="action-btn delete-btn"
                @click.stop="handleDelete(group)"
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
      :title="editingGroup ? '编辑分类' : '新增分类'"
      :show-cancel-button="true"
      :show-confirm-button="true"
      @confirm="confirmEdit"
      @cancel="closeEditDialog"
    >
      <view class="dialog-content">
        <WdInput
          v-model="editName"
          placeholder="请输入分类名称"
          :maxlength="20"
          show-clear
        />
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
        <text>确定要删除此分类吗？</text>
      </view>
    </WdDialog>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { categoryApi } from '../../api/category'
import type { UserCategoryGroup } from '../../api/category'

const loading = ref(false)
const groups = ref<UserCategoryGroup[]>([])
const openStates = ref<string[]>([])

const showEditDialog = ref(false)
const showDeleteDialog = ref(false)
const editingGroup = ref<UserCategoryGroup | null>(null)
const editName = ref('')
const deletingGroup = ref<UserCategoryGroup | null>(null)

const hasGroups = computed(() => groups.value.length > 0)

async function loadGroups() {
  loading.value = true
  try {
    const res = await categoryApi.getUserGroups()
    if (res.success) {
      groups.value = res.data
      openStates.value = res.data.map(() => 'close')
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
  uni.navigateBack()
}

function goToCategoryList(group: UserCategoryGroup) {
  uni.navigateTo({
    url: `/pages/my/category-list?groupId=${group.id}&groupName=${encodeURIComponent(group.name)}`
  })
}

function handleAdd() {
  editingGroup.value = null
  editName.value = ''
  showEditDialog.value = true
}

function handleEdit(group: UserCategoryGroup) {
  editingGroup.value = group
  editName.value = group.name
  showEditDialog.value = true
}

function handleDelete(group: UserCategoryGroup) {
  deletingGroup.value = group
  showDeleteDialog.value = true
}

async function confirmEdit() {
  if (!editName.value.trim()) {
    uni.showToast({ title: '请输入分类名称', icon: 'none' })
    return
  }

  try {
    let res
    if (editingGroup.value) {
      res = await categoryApi.updateUserGroup(editingGroup.value.id, {
        name: editName.value.trim()
      })
    } else {
      res = await categoryApi.createUserGroup({
        name: editName.value.trim()
      })
    }

    if (res.success) {
      uni.showToast({ title: editingGroup.value ? '编辑成功' : '新增成功', icon: 'success' })
      showEditDialog.value = false
      loadGroups()
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
  editingGroup.value = null
  editName.value = ''
}

async function confirmDelete() {
  if (!deletingGroup.value) return

  try {
    const res = await categoryApi.deleteUserGroup(deletingGroup.value.id)
    if (res.success) {
      uni.showToast({ title: '删除成功', icon: 'success' })
      showDeleteDialog.value = false
      loadGroups()
    } else {
      uni.showToast({ title: res.message || '删除失败', icon: 'none' })
    }
  } catch (err) {
    console.error('删除失败:', err)
    uni.showToast({ title: '网络错误', icon: 'none' })
  }
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

.group-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.group-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 88rpx;
  padding: 0 24rpx;
  background-color: #FFFFFF;
  border-radius: 16rpx;
}

.group-name {
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

.safe-bottom {
  height: env(safe-area-inset-bottom);
}
</style>
