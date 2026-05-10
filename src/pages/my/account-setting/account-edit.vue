<template>
  <view class="account-edit-page">
    <!-- 导航栏 -->
    <view class="navbar">
      <view class="nav-left" @click="goBack">
        <text class="nav-icon">←</text>
      </view>
      <view class="nav-title">{{ isEdit ? '编辑账户' : '新增账户' }}</view>
      <view class="nav-right"></view>
    </view>

    <!-- 内容区域 -->
    <scroll-view class="content" scroll-y>
      <view class="form-container">
        <!-- 图标选择 -->
        <view class="form-item">
          <view class="form-label">账户图标</view>
          <view class="icon-selector">
            <view
              v-for="icon in ACCOUNT_ICONS"
              :key="icon"
              class="icon-item"
              :class="{ active: formData.icon === icon }"
              @click="formData.icon = icon"
            >
              <text class="icon-text">{{ icon }}</text>
            </view>
          </view>
        </view>

        <!-- 账户名称 -->
        <view class="form-item">
          <view class="form-label">账户名称</view>
          <input
            class="form-input"
            type="text"
            v-model="formData.name"
            placeholder="请输入账户名称"
            placeholder-class="placeholder"
          />
        </view>

        <!-- 账户类型 -->
        <view class="form-item">
          <view class="form-label">账户类型</view>
          <view class="type-selector">
            <view
              v-for="type in ACCOUNT_TYPE_OPTIONS"
              :key="type.value"
              class="type-item"
              :class="{ active: formData.type === type.value }"
              @click="formData.type = type.value"
            >
              <text class="type-text">{{ type.label }}</text>
            </view>
          </view>
        </view>

        <!-- 账户余额 -->
        <view class="form-item">
          <view class="form-label">账户余额</view>
          <view class="input-wrapper">
            <text class="currency">¥</text>
            <input
              class="form-input"
              type="digit"
              v-model="balanceInput"
              placeholder="0.00"
              placeholder-class="placeholder"
              @input="onBalanceInput"
            />
          </view>
        </view>

        <!-- 账户说明 -->
        <view class="form-item">
          <view class="form-label">账户说明</view>
          <textarea
            class="form-textarea"
            v-model="formData.description"
            placeholder="请输入账户说明（选填）"
            placeholder-class="placeholder"
            :maxlength="200"
            :auto-height="true"
          />
          <view class="char-count">{{ (formData.description || '').length }}/200</view>
        </view>
      </view>

      <!-- 删除按钮 - 仅编辑模式且非默认账户显示 -->
      <view v-if="isEdit && !account?.isDefault" class="delete-section">
        <view class="delete-btn" @click="handleDelete">
          删除账户
        </view>
      </view>

      <!-- 保存按钮 -->
      <view class="save-section">
        <view
          class="save-btn"
          :class="{ disabled: !canSave }"
          @click="handleSave"
        >
          保存
        </view>
      </view>

      <!-- 底部安全区域 -->
      <view class="safe-bottom"></view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { onLoad, onShow } from '@dcloudio/uni-app';
import { getAccountDetail, createAccount, updateAccount, deleteAccount } from '../../../api/account';
import type { Account, AccountType, AccountRequest } from '../../../types/account';
import { ACCOUNT_TYPE_OPTIONS, ACCOUNT_ICONS } from '../../../types/account';

// 路由参数
const accountId = ref<string | null>(null);

// 是否编辑模式
const isEdit = computed(() => !!accountId.value);

// 账户详情
const account = ref<Account | null>(null);

// 表单数据
const formData = ref<AccountRequest>({
  name: '',
  icon: '💵',
  type: 'cash',
  balance: 0,
  description: ''
});

// 余额输入框值
const balanceInput = ref('');

// 是否可以保存
const canSave = computed(() => {
  return formData.value.name.trim().length > 0 &&
         formData.value.name.length <= 20 &&
         !isNaN(formData.value.balance);
});

// 加载账户详情
const loadAccountDetail = async (id: string) => {
  try {
    const res = await getAccountDetail(id);
    if (res.success) {
      account.value = res.data;
      formData.value = {
        name: res.data.name,
        icon: res.data.icon,
        type: res.data.type,
        balance: res.data.balance,
        description: res.data.description
      };
      balanceInput.value = res.data.balance.toString();
    } else {
      uni.showToast({
        title: res.message || '获取账户详情失败',
        icon: 'none'
      });
    }
  } catch (err) {
    console.error('加载账户详情失败:', err);
    uni.showToast({
      title: '网络错误',
      icon: 'none'
    });
  }
};

// 余额输入处理
const onBalanceInput = (e: any) => {
  const value = e.detail.value;
  // 验证输入格式，只能是数字和小数点
  const regex = /^\d*\.?\d{0,2}$/;
  if (regex.test(value) || value === '') {
    balanceInput.value = value;
    if (value !== '') {
      formData.value.balance = parseFloat(value) || 0;
    } else {
      formData.value.balance = 0;
    }
  }
};

// 保存账户
const handleSave = async () => {
  if (!canSave.value) return;

  try {
    if (isEdit.value && accountId.value) {
      // 编辑模式
      const res = await updateAccount(accountId.value, formData.value);
      if (res.success) {
        uni.showToast({
          title: '修改成功',
          icon: 'success'
        });
        setTimeout(() => {
          uni.navigateBack();
        }, 1500);
      } else {
        uni.showToast({
          title: res.message || '修改失败',
          icon: 'none'
        });
      }
    } else {
      // 新增模式
      const res = await createAccount(formData.value);
      if (res.success) {
        uni.showToast({
          title: '创建成功',
          icon: 'success'
        });
        setTimeout(() => {
          uni.navigateBack();
        }, 1500);
      } else {
        uni.showToast({
          title: res.message || '创建失败',
          icon: 'none'
        });
      }
    }
  } catch (err) {
    console.error('保存失败:', err);
    uni.showToast({
      title: '网络错误',
      icon: 'none'
    });
  }
};

// 删除账户
const handleDelete = () => {
  uni.showModal({
    title: '确认删除',
    content: '删除后该账户的相关记录将无法恢复，确定要删除吗？',
    confirmColor: '#FA3534',
    success: async (res) => {
      if (res.confirm && accountId.value) {
        try {
          const deleteRes = await deleteAccount(accountId.value);
          if (deleteRes.success) {
            uni.showToast({
              title: '删除成功',
              icon: 'success'
            });
            setTimeout(() => {
              uni.navigateBack();
            }, 1500);
          } else {
            uni.showToast({
              title: deleteRes.message || '删除失败',
              icon: 'none'
            });
          }
        } catch (err) {
          console.error('删除失败:', err);
          uni.showToast({
            title: '网络错误',
            icon: 'none'
          });
        }
      }
    }
  });
};

// 返回上一页
const goBack = () => {
  uni.navigateBack();
};

// 页面加载
onLoad((options: any) => {
  if (options.id) {
    accountId.value = options.id;
    loadAccountDetail(options.id);
  } else {
    // 新增模式，重置表单
    formData.value = {
      name: '',
      icon: '💵',
      type: 'cash',
      balance: 0,
      description: ''
    };
    balanceInput.value = '';
  }
});
</script>

<style>
.account-edit-page {
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
  padding: 24rpx 0;
}

/* 表单容器 */
.form-container {
  background-color: #FFFFFF;
  margin: 0 24rpx;
  border-radius: 16rpx;
  padding: 32rpx 24rpx;
}

/* 表单项 */
.form-item {
  margin-bottom: 40rpx;
}

.form-item:last-child {
  margin-bottom: 0;
}

.form-label {
  font-size: 28rpx;
  color: #333333;
  font-weight: 500;
  margin-bottom: 16rpx;
}

.form-input {
  width: 100%;
  height: 80rpx;
  font-size: 30rpx;
  color: #333333;
  background-color: #F8F8F8;
  border-radius: 12rpx;
  padding: 0 20rpx;
}

.form-textarea {
  width: 100%;
  min-height: 160rpx;
  font-size: 30rpx;
  color: #333333;
  background-color: #F8F8F8;
  border-radius: 12rpx;
  padding: 16rpx 20rpx;
}

.placeholder {
  color: #CCCCCC;
}

.input-wrapper {
  display: flex;
  align-items: center;
  background-color: #F8F8F8;
  border-radius: 12rpx;
  padding: 0 20rpx;
  height: 80rpx;
}

.currency {
  font-size: 32rpx;
  color: #333333;
  font-weight: 600;
  margin-right: 8rpx;
}

.input-wrapper .form-input {
  flex: 1;
  background-color: transparent;
  padding: 0;
}

.char-count {
  font-size: 24rpx;
  color: #999999;
  text-align: right;
  margin-top: 8rpx;
}

/* 图标选择器 */
.icon-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.icon-item {
  width: 96rpx;
  height: 96rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #F8F8F8;
  border-radius: 12rpx;
  border: 2rpx solid transparent;
  transition: all 0.2s ease;
}

.icon-item.active {
  border-color: #00BFFF;
  background-color: rgba(0, 191, 255, 0.1);
}

.icon-text {
  font-size: 48rpx;
}

/* 类型选择器 */
.type-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.type-item {
  padding: 12rpx 24rpx;
  background-color: #F8F8F8;
  border-radius: 40rpx;
  border: 2rpx solid transparent;
  transition: all 0.2s ease;
}

.type-item.active {
  border-color: #00BFFF;
  background-color: rgba(0, 191, 255, 0.1);
}

.type-text {
  font-size: 26rpx;
  color: #333333;
}

.type-item.active .type-text {
  color: #00BFFF;
  font-weight: 500;
}

/* 删除区域 */
.delete-section {
  margin: 40rpx 24rpx;
}

.delete-btn {
  width: 100%;
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #FFFFFF;
  border-radius: 16rpx;
  font-size: 30rpx;
  color: #FA3534;
  font-weight: 500;
}

/* 保存区域 */
.save-section {
  margin: 40rpx 24rpx;
  margin-bottom: 24rpx;
}

.save-btn {
  width: 100%;
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #00BFFF 0%, #0099CC 100%);
  border-radius: 44rpx;
  font-size: 32rpx;
  color: #FFFFFF;
  font-weight: 600;
  transition: opacity 0.2s ease;
}

.save-btn.disabled {
  opacity: 0.5;
}

/* 底部安全区域 */
.safe-bottom {
  height: env(safe-area-inset-bottom);
}
</style>
