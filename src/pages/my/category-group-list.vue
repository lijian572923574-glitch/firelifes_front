<template>
  <view class="category-group-page">
    <!-- 导航栏 -->
    <view class="navbar">
      <view class="nav-left" @click="goBack">
        <text class="nav-icon">←</text>
      </view>
      <view class="nav-title">分类管理</view>
      <view class="nav-right" @click="handleAdd">
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
      <view v-else-if="!hasGroups" class="empty-state">
        <text class="empty-icon">📭</text>
        <text class="empty-text">还没有分类，点击右上角 + 添加第一个分类</text>
      </view>

      <!-- 分类列表 -->
      <view v-else class="group-list">
        <view
          v-for="group in groups"
          :key="group.id"
          class="group-card"
        >
          <view class="card-left">
            <text class="group-name">{{ group.name }}</text>
          </view>
          <view class="card-right">
            <view class="action-btn" @click.stop="handleEdit(group)">
              <text class="iconfont icon-bianji"></text>
            </view>
            <view class="action-btn delete-btn" @click.stop="handleDelete(group)">
              <text class="iconfont icon-shanchu"></text>
            </view>
          </view>
        </view>
      </view>

      <!-- 底部安全区域 -->
      <view class="safe-bottom"></view>
    </scroll-view>

    <!-- 编辑弹窗 -->
    <view v-if="showEditDialog" class="dialog-mask" @click="closeEditDialog">
      <view class="dialog" @click.stop>
        <view class="dialog-title">{{ editingGroup ? '编辑分类' : '新增大类' }}</view>
        <view class="dialog-content">
          <input
            class="input"
            :value="editName"
            @input="onEditNameInput"
            placeholder="请输入分类名称"
            focus
          />
        </view>
        <view class="dialog-actions">
          <view class="dialog-btn cancel-btn" @click="closeEditDialog">取消</view>
          <view class="dialog-btn confirm-btn" @click="confirmEdit">确定</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { categoryApi, type UserCategoryGroup } from '../../api/category';

// 加载状态
const loading = ref(false);

// 分类列表
const groups = ref<UserCategoryGroup[]>([]);

// 弹窗状态
const showEditDialog = ref(false);
const editingGroup = ref<UserCategoryGroup | null>(null);
const editName = ref('');

// 是否有分类
const hasGroups = computed(() => groups.value.length > 0);

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

// 加载分类列表
const loadGroups = async () => {
  loading.value = true;
  try {
    const res = await categoryApi.getUserGroups();
    if (res.success) {
      groups.value = res.data;
    } else {
      uni.showToast({
        title: res.message || '获取分类列表失败',
        icon: 'none'
      });
    }
  } catch (err) {
    console.error('加载分类列表失败:', err);
    uni.showToast({
      title: '网络错误',
      icon: 'none'
    });
  } finally {
    loading.value = false;
  }
};

// 新增大类
const handleAdd = () => {
  editingGroup.value = null;
  editName.value = '';
  showEditDialog.value = true;
};

// 编辑分类
const handleEdit = (group: UserCategoryGroup) => {
  editingGroup.value = group;
  editName.value = group.name;
  showEditDialog.value = true;
};

// 删除分类
const handleDelete = (group: UserCategoryGroup) => {
  uni.showModal({
    title: '提示',
    content: '确定要删除该分类吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          const resDel = await categoryApi.deleteUserGroup(group.id);
          if (resDel.success) {
            uni.showToast({
              title: '删除成功',
              icon: 'success'
            });
            loadGroups();
          } else {
            uni.showToast({
              title: resDel.message || '删除失败',
              icon: 'none'
            });
          }
        } catch (err) {
          console.error('删除失败:', err);
          uni.showToast({
            title: '删除失败',
            icon: 'none'
          });
        }
      }
    }
  });
};

// 输入名称
const onEditNameInput = (e: any) => {
  editName.value = e.detail.value;
};

// 关闭弹窗
const closeEditDialog = () => {
  showEditDialog.value = false;
  editingGroup.value = null;
  editName.value = '';
};

// 确认编辑
const confirmEdit = async () => {
  if (!editName.value.trim()) {
    uni.showToast({
      title: '请输入分类名称',
      icon: 'none'
    });
    return;
  }

  try {
    let res;
    if (editingGroup.value) {
      res = await categoryApi.updateUserGroup(editingGroup.value.id, { name: editName.value });
    } else {
      res = await categoryApi.createUserGroup({ name: editName.value });
    }

    if (res.success) {
      uni.showToast({
        title: editingGroup.value ? '更新成功' : '创建成功',
        icon: 'success'
      });
      closeEditDialog();
      loadGroups();
    } else {
      uni.showToast({
        title: res.message || '操作失败',
        icon: 'none'
      });
    }
  } catch (err) {
    console.error('操作失败:', err);
    uni.showToast({
      title: '操作失败',
      icon: 'none'
    });
  }
};

// 页面显示时重新加载
onShow(() => {
  loadGroups();
});
</script>

<style>
.category-group-page {
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

/* 分类列表 */
.group-list {
  padding: 0 24rpx;
}

/* 分类卡片 */
.group-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx;
  background-color: #FFFFFF;
  border-radius: 16rpx;
  margin-bottom: 16rpx;
  transition: transform 100ms ease;
}

.group-card:last-child {
  margin-bottom: 0;
}

.group-card:active {
  transform: scale(0.98);
}

.card-left {
  display: flex;
  align-items: center;
  flex: 1;
}

.group-name {
  font-size: 30rpx;
  color: #333333;
  font-weight: 500;
}

.card-right {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-left: 16rpx;
}

.action-btn {
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #00BFFF;
  font-size: 32rpx;
}

.delete-btn {
  color: #FA3534;
}

/* 底部安全区域 */
.safe-bottom {
  height: env(safe-area-inset-bottom);
}

/* 弹窗样式 */
.dialog-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.dialog {
  width: 600rpx;
  background: #FFFFFF;
  border-radius: 16rpx;
  overflow: hidden;
}

.dialog-title {
  padding: 32rpx;
  text-align: center;
  font-size: 32rpx;
  font-weight: 600;
  color: #333333;
  border-bottom: 1rpx solid #F0F0F0;
}

.dialog-content {
  padding: 32rpx;
}

.input {
  width: 100%;
  height: 88rpx;
  border: 1rpx solid #E0E0E0;
  border-radius: 8rpx;
  padding: 0 24rpx;
  font-size: 28rpx;
  box-sizing: border-box;
}

.dialog-actions {
  display: flex;
  border-top: 1rpx solid #F0F0F0;
}

.dialog-btn {
  flex: 1;
  padding: 28rpx;
  text-align: center;
  font-size: 28rpx;
}

.cancel-btn {
  color: #999999;
  border-right: 1rpx solid #F0F0F0;
}

.confirm-btn {
  color: #00BFFF;
}
</style>
