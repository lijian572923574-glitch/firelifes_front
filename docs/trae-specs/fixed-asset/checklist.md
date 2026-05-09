# 固定资产管理 - 验收清单

## 功能验收

### 固定资产添加
- [ ] Checkpoint 1: 可通过"添加"按钮进入添加页
- [ ] Checkpoint 2: 必填字段：名称、品类、购入价、购入日期、当前估值
- [ ] Checkpoint 3: 品类选项：房产、车位、商铺、其他
- [ ] Checkpoint 4: 当前估值默认值同购入价
- [ ] Checkpoint 5: 可选关联负债账户
- [ ] Checkpoint 6: 关联负债后实时显示净权益计算
- [ ] Checkpoint 7: 保存后自动创建购入估值记录
- [ ] Checkpoint 8: 保存成功跳转到详情页

### 固定资产数据结构
- [ ] Checkpoint 9: 固定资产包含必要字段：id, name, category, purchasePrice, purchaseDate, currentValue, netEquity, appreciationRate
- [ ] Checkpoint 10: FixedAssetCategory 类型定义正确
- [ ] Checkpoint 11: ValuationRecord 类型定义正确
- [ ] Checkpoint 12: linkedLiabilityAccountId 可选

### 固定资产列表页
- [ ] Checkpoint 13: 顶部显示总净权益和总估值
- [ ] Checkpoint 14: 列表项显示：资产图标 + 名称 + 品类 + 净权益 + 估值 + 增值率
- [ ] Checkpoint 15: 增值率颜色正确（绿色/红色/灰色）
- [ ] Checkpoint 16: 关联负债信息展示
- [ ] Checkpoint 17: 超过6个月未更新显示"估值可能已过时"提示
- [ ] Checkpoint 18: 点击资产卡片跳转详情页
- [ ] Checkpoint 19: 无资产时显示空态引导

### 固定资产详情页
- [ ] Checkpoint 20: 顶部显示资产名称 + 品类标签 + 状态标签
- [ ] Checkpoint 21: 大字显示净权益，颜色为卡布里蓝 #00BFFF
- [ ] Checkpoint 22: 净权益为负时显示红色 #FA3534
- [ ] Checkpoint 23: 显示当前估值和购入价
- [ ] Checkpoint 24: 显示增值率（绿色/红色/灰色）
- [ ] Checkpoint 25: 估值历史折线图正确渲染
- [ ] Checkpoint 26: 估值历史列表显示每条记录
- [ ] Checkpoint 27: 关联负债卡片显示负债名称和剩余金额
- [ ] Checkpoint 28: "更新估值"按钮可用
- [ ] Checkpoint 29: "编辑"按钮可用
- [ ] Checkpoint 30: 超过6个月未更新显示提醒

### 估值更新
- [ ] Checkpoint 31: 更新弹窗显示当前估值
- [ ] Checkpoint 32: 输入新估值后自动计算增值/贬值
- [ ] Checkpoint 33: 可选择更新日期（默认当天）
- [ ] Checkpoint 34: 确认后保存成功
- [ ] Checkpoint 35: 估值历史新增一条记录

### 关联负债
- [ ] Checkpoint 36: 可选择关联负债账户
- [ ] Checkpoint 37: 关联后净权益自动重新计算
- [ ] Checkpoint 38: 可解除关联
- [ ] Checkpoint 39: 解除后净权益等于当前估值

### 估值到期提醒
- [ ] Checkpoint 40: 超过6个月未更新时显示提醒
- [ ] Checkpoint 41: 提醒文案："估值可能已过时，建议更新"

## UI/UX 验收

### 布局
- [ ] Checkpoint 42: 列表页内边距 32rpx
- [ ] Checkpoint 43: 资产卡片高度 160rpx，圆角 16rpx，间距 16rpx
- [ ] Checkpoint 44: 详情页主价值区高度 200rpx
- [ ] Checkpoint 45: 弹窗宽 600rpx，居中弹出

### 颜色（卡布里蓝体系）
- [ ] Checkpoint 46: 页面背景 #FFFFFF
- [ ] Checkpoint 47: 主色描边图标 #00BFFF
- [ ] Checkpoint 48: 净权益大字 #00BFFF
- [ ] Checkpoint 49: 净权益为负 #FA3534
- [ ] Checkpoint 50: 增值率 #19BE6B
- [ ] Checkpoint 51: 贬值率 #FA3534
- [ ] Checkpoint 52: 持平 #999999
- [ ] Checkpoint 53: 提醒提示 #FF9800
- [ ] Checkpoint 54: 负债余额 #FA3534

### 字体
- [ ] Checkpoint 55: 资产名称 32rpx，#333333，加粗
- [ ] Checkpoint 56: 净权益 56rpx，#00BFFF，加粗
- [ ] Checkpoint 57: 估值/购入价 28rpx，#333333
- [ ] Checkpoint 58: 增值率 24rpx
- [ ] Checkpoint 59: 关联负债 26rpx，#666666
- [ ] Checkpoint 60: 时间标签 24rpx，#999999

### 动效
- [ ] Checkpoint 61: 列表加载 fadeIn，300ms，stagger 50ms
- [ ] Checkpoint 62: 卡片点击 scale 0.98，100ms
- [ ] Checkpoint 63: 弹窗出现 slideUp + fadeIn，200ms
- [ ] Checkpoint 64: 数字变化数字滚动动画，800ms

## API 验收

- [ ] Checkpoint 65: GET /api/assets/fixed 返回资产列表和汇总数据
- [ ] Checkpoint 66: GET /api/assets/fixed/:id 返回资产详情和关联负债
- [ ] Checkpoint 67: POST /api/assets/fixed 创建资产成功
- [ ] Checkpoint 68: PUT /api/assets/fixed/:id 更新资产成功
- [ ] Checkpoint 69: PUT /api/assets/fixed/:id/valuation 更新估值成功
- [ ] Checkpoint 70: PUT /api/assets/fixed/:id/link-liability 关联负债成功
- [ ] Checkpoint 71: DELETE /api/assets/fixed/:id/link-liability 解除关联成功
- [ ] Checkpoint 72: API 响应数据结构符合 TypeScript 接口定义

## 计算验证

- [ ] Checkpoint 73: 净权益 = 当前估值 - 负债余额
- [ ] Checkpoint 74: 增值率 = (当前估值 - 购入价) / 购入价
- [ ] Checkpoint 75: 超过6个月（180天）显示估值过期提醒
- [ ] Checkpoint 76: 净权益为负时正确显示

## 边界情况验收

- [ ] Checkpoint 77: 关联的负债账户余额为0时，净权益 = 当前估值
- [ ] Checkpoint 78: 关联的负债账户已删除时，自动解除关联
- [ ] Checkpoint 79: 估值不更新时，正确显示过期提醒
- [ ] Checkpoint 80: 固定资产列表为空时显示空态引导

## 技术验收

- [ ] Checkpoint 81: 使用 Vue3 + TypeScript + SCSS
- [ ] Checkpoint 82: 使用 Wot UI 组件库
- [ ] Checkpoint 83: 遵循 UniApp 兼容性要求
- [ ] Checkpoint 84: API 风格为 RESTful
- [ ] Checkpoint 85: 不依赖 Phase 2/3 的其他功能
- [ ] Checkpoint 86: SVG 线框图标统一主色描边
- [ ] Checkpoint 87: 禁止黄色/暖色系
