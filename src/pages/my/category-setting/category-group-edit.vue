<template>
  <view
    v-if="visible"
    class="popup-mask"
    @click="close"
  >
    <view class="popup-content" @click.stop>
      <view class="popup-header">
        <text class="popup-title">{{ isEdit ? '编辑大类' : '新增大类' }}</text>
        <text class="popup-close" @click="close">×</text>
      </view>
      <view class="popup-body">
        <view class="form-item">
          <text class="form-label">大类名称</text>
          <input
            v-model="formName"
            class="form-input"
            type="text"
            placeholder="请输入大类名称"
            maxlength="20"
          />
        </view>

        <view v-if="!isEdit" class="form-item">
          <text class="form-label">分类类型</text>
          <view class="type-toggle">
            <view
              v-for="option in typeOptions"
              :key="option.value"
              class="type-tag"
              :class="{ 'type-tag-selected': formType === option.value }"
              @click="formType = option.value"
            >
              <text
                class="type-tag-text"
                :class="{ 'type-tag-text-selected': formType === option.value }"
              >{{ option.label }}</text>
            </view>
          </view>
        </view>

        <view v-else class="form-item">
          <text class="form-label">分类类型</text>
          <view class="type-toggle">
            <view
              v-for="option in typeOptions"
              :key="option.value"
              class="type-tag type-tag-readonly"
              :class="{ 'type-tag-readonly-selected': formType === option.value }"
            >
              <text
                class="type-tag-text"
                :class="{ 'type-tag-text-readonly-selected': formType === option.value, 'type-tag-text-readonly': formType !== option.value }"
              >{{ option.label }}</text>
            </view>
          </view>
        </view>
      </view>

      <view class="popup-footer">
        <view class="footer-btn cancel-btn" @click="close">
          <text class="footer-btn-text">取消</text>
        </view>
        <view
          class="footer-btn confirm-btn"
          :class="{ 'footer-btn-disabled': !canSave }"
          @click="handleSave"
        >
          <text class="footer-btn-text">{{ isEdit ? '保存' : '创建' }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { categoryApi, type UserCategoryGroup } from '../../../api/category'

const emit = defineEmits<{
  (e: 'saved'): void
}>()

const visible = ref(false)
const isEdit = ref(false)
const editGroupId = ref<number>(0)
const formName = ref('')
const formType = ref<'expense' | 'income'>('expense')
const saving = ref(false)

const typeOptions = [
  { value: 'expense' as const, label: '支出' },
  { value: 'income' as const, label: '收入' }
]

const canSave = computed(() => {
  const name = formName.value.trim()
  return name.length > 0 && name.length <= 20 && !saving.value
})

function openAdd() {
  isEdit.value = false
  editGroupId.value = 0
  formName.value = ''
  formType.value = 'expense'
  visible.value = true
}

function openEdit(group: UserCategoryGroup) {
  isEdit.value = true
  editGroupId.value = group.id
  formName.value = group.name
  formType.value = group.type || 'expense'
  visible.value = true
}

function close() {
  visible.value = false
}

async function handleSave() {
  if (!canSave.value || saving.value) return

  saving.value = true
  const name = formName.value.trim()
  const params: { name: string; type?: 'income' | 'expense' } = { name }
  if (!isEdit.value) {
    params.type = formType.value
  }

  try {
    const res = isEdit.value
      ? await categoryApi.updateUserGroup(editGroupId.value, params)
      : await categoryApi.createUserGroup(params)

    if (res.success) {
      uni.showToast({ title: isEdit.value ? '修改成功' : '创建成功', icon: 'success' })
      emit('saved')
      close()
    } else {
      uni.showToast({ title: res.message || '保存失败', icon: 'none' })
    }
  } catch (err) {
    console.error('保存分类失败:', err)
    uni.showToast({ title: '网络错误', icon: 'none' })
  } finally {
    saving.value = false
  }
}

defineExpose({ openAdd, openEdit, close })
</script>

<style scoped>
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

.type-toggle {
  display: flex;
  flex-direction: row;
  gap: 12rpx;
}

.type-tag {
  flex: 1;
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16rpx;
  background-color: #F8F9FA;
  border: 2rpx solid transparent;
  transition: all 0.2s ease;
}

.type-tag-selected {
  background-color: rgba(0, 191, 255, 0.1);
  border-color: #00BFFF;
}

.type-tag-text {
  font-size: 28rpx;
  color: #666666;
  transition: color 0.2s ease;
}

.type-tag-text-selected {
  color: #00BFFF;
  font-weight: 500;
}

.type-tag-readonly {
  opacity: 0.7;
  cursor: default;
}

.type-tag-readonly-selected {
  background-color: rgba(0, 191, 255, 0.1);
  border-color: #00BFFF;
}

.type-tag-text-readonly {
  color: #CCCCCC;
}

.type-tag-text-readonly-selected {
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

.footer-btn-disabled {
  opacity: 0.5;
  pointer-events: none;
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