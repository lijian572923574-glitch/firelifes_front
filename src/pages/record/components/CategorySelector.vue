<template>
  <view class="category-selector">
    <view v-if="frequentGroup" class="group-section">
      <view class="group-header">
        <text class="group-name">常用</text>
      </view>
      <view class="category-grid">
        <view
          v-for="category in frequentGroup.children"
          :key="category.id"
          class="category-item"
          :class="{ selected: selectedCategoryId === category.id }"
          @click="selectCategoryItem(category)"
        >
          <view class="category-icon">
            <text class="iconfont" :class="getIconClass(category.iconId, category.name)"></text>
          </view>
          <text class="category-name">{{ category.name }}</text>
        </view>
      </view>
    </view>
    <view v-for="group in categoryGroups" :key="group.id" class="group-section">
      <view class="group-header">
        <text class="group-name">{{ group.name }}</text>
      </view>
      <view class="category-grid">
        <view
          v-for="category in group.children"
          :key="category.id"
          class="category-item"
          :class="{ selected: selectedCategoryId === category.id }"
          @click="selectCategoryItem(category)"
        >
          <view class="category-icon">
            <text class="iconfont" :class="getIconClass(category.iconId, category.name)"></text>
          </view>
          <text class="category-name">{{ category.name }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import { categoryApi, type CategoryGroup, type CategoryItem, type CategoryIcon } from '../../../api/category'
import { getFrequentCategoryIds } from '../../../utils/category-frequency'

const props = defineProps<{
  transactionType: 'income' | 'expense'
  selectedCategoryId: number
}>()

const emit = defineEmits<{
  (e: 'select', category: { id: number; name: string; icon: string }): void
}>()

const categoryGroups = ref<CategoryGroup[]>([])
const frequentCategoryIds = ref<number[]>([])

const frequentGroup = computed(() => {
  if (frequentCategoryIds.value.length === 0) return null

  const allChildren: CategoryItem[] = []
  for (const group of categoryGroups.value) {
    for (const child of group.children) {
      allChildren.push(child)
    }
  }

  const topChildren = frequentCategoryIds.value
    .map(id => allChildren.find(c => c.id === id))
    .filter((c): c is CategoryItem => !!c)

  if (topChildren.length === 0) return null

  return {
    id: -1,
    name: '常用',
    sortOrder: -1,
    children: topChildren
  } as CategoryGroup
})
const selectedCategoryId = ref<number>(0)
const userIcons = ref<Map<number, string>>(new Map())

// 分类名→iconfont类名映射
const CATEGORY_ICON_MAP: Record<string, string> = {
  // 饮食消费
  '餐饮': 'icon-canyin', '饮料': 'icon-lingshi', '水果': 'icon-lingshi',
  '零食': 'icon-lingshi', '咖啡': 'icon-lingshi',
  // 居家居住
  '住房': 'icon-fangzi', '居家': 'icon-fangzi', '居住': 'icon-fangzi',
  '维修': 'icon-wj-zd', '快递': 'icon-qitadingdan',
  // 交通出行
  '交通': 'icon-jiaotong', '汽车': 'icon-qiche',
  // 形象与消费
  '服饰': 'icon-yifu', '美发': 'icon-meirong', '美容': 'icon-meirong',
  '购物': 'icon-gouwuche',
  // 兴趣与成长
  '运动': 'icon-yundong-', '健身': 'icon-yundong-', '旅行': 'icon-lvhang',
  '书籍': 'icon-jiaoyu', '学习': 'icon-jiaoyu', '教育': 'icon-jiaoyu',
  '娱乐': 'icon-youxiyouxiji', '电影': 'icon-youxiyouxiji',
  '音乐': 'icon-youxiyouxiji', '游戏': 'icon-youxiyouxiji',
  // 社交关系
  '社交': 'icon-13', '礼物': 'icon-jiangjinjilu', '礼金': 'icon-a-068_lijin',
  '亲友': 'icon-13', '宠物': 'icon-xiedaichongwu',
  // 健康与医疗
  '医疗': 'icon-yiliao',
  // 职场工作
  '办公': 'icon-shezhi', '通讯': 'icon-shouji',
  // 金融理财
  '投资': 'icon-licaishouyi', '彩票': 'icon-licaishouyi',
  // 其他
  '其他': 'icon-qita', '日用': 'icon-riyongpin', '日用品': 'icon-riyongpin',
  '捐赠': 'icon-jiangjinjilu',
  // 历史兼容
  '烟酒': 'icon-yanjiu', '数码家电': 'icon-shumajiadianleimu',
  // 收入
  '工资': 'icon-gongzijianyi', '工资条': 'icon-gongzitiao',
  '奖金': 'icon-jiangjinxiangqing', '兼职': 'icon-a-068_jianzhi',
  '投资收入': 'icon-licaishouyi', '理财': 'icon-licaishouyi',
  '理财收益': 'icon-licaishouyi', '报销': 'icon-tuikuan',
  '礼金收入': 'icon-a-068_lijin', '其他收入': 'icon-qita',
  // 收入历史兼容
  '红包': 'icon-jiangjinjilu', '退款': 'icon-tuikuan', '闲置': 'icon-xianzhi',
  // 通用
  '设置': 'icon-shezhi', '账单': 'icon-zhangdan',
}

watch(() => props.transactionType, async () => {
  selectedCategoryId.value = 0
  await loadCategories()
  await loadFrequentCategories()
})

watch(() => props.selectedCategoryId, (newVal) => {
  selectedCategoryId.value = newVal
})

onMounted(async () => {
  await loadIcons()
  await loadCategories()
  await loadFrequentCategories()
})

const loadIcons = async () => {
  try {
    const res = await categoryApi.getUserIcons()
    if (res.success && res.data) {
      const iconMap = new Map<number, string>()
      res.data.forEach((icon: CategoryIcon) => {
        iconMap.set(icon.id, icon.url)
      })
      userIcons.value = iconMap
    }
  } catch (error) {
    console.error('加载图标失败:', error)
  }
}

const loadCategories = async () => {
  try {
    const res = await categoryApi.getUserCategories(props.transactionType)
    if (res.success && res.data) {
      categoryGroups.value = res.data
    }
  } catch (error) {
    console.error('加载分类失败:', error)
  }
}

const loadFrequentCategories = async () => {
  try {
    const frequencies = await getFrequentCategoryIds(props.transactionType)
    frequentCategoryIds.value = frequencies.map(f => f.typeId)
  } catch {
    frequentCategoryIds.value = []
  }
}

// 根据iconId或分类名返回iconfont类名
const getIconClass = (iconId: number, name: string): string => {
  // 优先使用分类名映射
  if (CATEGORY_ICON_MAP[name]) {
    return CATEGORY_ICON_MAP[name]
  }
  // fallback到API返回的iconUrl或默认图标
  return 'icon-qita'
}

// 保留getIconUrl方法但不再在模板中使用
const getIconUrl = (iconId: number): string => {
  return userIcons.value.get(iconId) || 'icon-qita'
}

const selectCategoryItem = (category: CategoryItem) => {
  selectedCategoryId.value = category.id
  emit('select', {
    id: category.id,
    name: category.name,
    icon: getIconClass(category.iconId, category.name),
  })
}

defineExpose({
  reload: loadCategories
})
</script>

<style scoped>
.category-selector {
  padding: 20rpx;
}

.group-section {
  margin-bottom: 32rpx;
}

.group-header {
  padding: 12rpx 0;
  margin-bottom: 16rpx;
  border-bottom: 2rpx solid var(--color-primary, #0D9488);
}

.group-name {
  font-size: 28rpx;
  color: var(--color-text-primary, #1E293B);
  font-weight: 600;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30rpx 20rpx;
}

.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10rpx;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.category-item:active {
  transform: scale(0.95);
}

.category-icon {
  width: 88rpx;
  height: 88rpx;
  background: var(--color-bg-card, #FFFFFF);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 44rpx;
  margin-bottom: 10rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);
  color: var(--color-primary, #0D9488);
}

.category-item.selected .category-icon {
  background: linear-gradient(135deg, var(--color-primary, #0D9488) 0%, var(--color-primary-dark, #0B7A70) 100%);
  box-shadow: 0 4rpx 16rpx rgba(13, 148, 136, 0.3);
  color: var(--color-text-inverse, #FFFFFF);
}

.category-name {
  font-size: 24rpx;
  color: var(--color-text-primary, #1E293B);
  text-align: center;
}
</style>
