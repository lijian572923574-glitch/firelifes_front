# 折旧资产生命周期管理 - 验收清单

## 功能验收

### 记账页"记入资产"开关
- [ ] Checkpoint 1: 记账类型为"支出"时，金额输入区下方显示"记入资产"开关
- [ ] Checkpoint 2: 记账类型为"收入"或"转账"时，不显示开关
- [ ] Checkpoint 3: 开关默认关闭
- [ ] Checkpoint 4: 开关打开后展开资产字段区域
- [ ] Checkpoint 5: 品类标签选项包含：手机、电脑、相机、家电、鞋服、家具、包袋、运动、其他
- [ ] Checkpoint 6: 折旧方法选项：直线法、双倍余额递减法
- [ ] Checkpoint 7: 选择品类后，折旧方法自动推荐（手机/电脑推荐双倍余额递减，其他推荐直线法）
- [ ] Checkpoint 8: 选择品类后，计划使用时长自动填充推荐值
- [ ] Checkpoint 9: 选择品类后，预期残值自动填充（购入价×残值率）
- [ ] Checkpoint 10: 资产名称默认取分类名，可手动修改
- [ ] Checkpoint 11: 折旧方法选定后不可更改
- [ ] Checkpoint 12: 记账完成时同时创建支出记录和折旧资产记录
- [ ] Checkpoint 13: 折旧资产状态默认为"使用中"

### 折旧资产数据结构
- [ ] Checkpoint 14: 折旧资产包含必要字段：id, name, category, depreciationMethod, purchasePrice, purchaseDate, expectedLifeMonths, residualValue, currentValue, status, monthlyDepreciation, usedMonths
- [ ] Checkpoint 15: DepreciatingCategory 类型定义正确（9个品类）
- [ ] Checkpoint 16: DepreciationMethod 类型定义：'straight-line' | 'double-declining-balance'
- [ ] Checkpoint 17: CATEGORY_DEFAULTS 常量包含9个品类的推荐参数和折旧方法
- [ ] Checkpoint 18: calculateDepreciation 函数支持两种方法，计算结果精确到2位小数

### 折旧计算验证

#### 直线法
- [ ] Checkpoint 19: 月折旧额 = (购入价 - 残值) ÷ 使用月数
- [ ] Checkpoint 20: 每月折旧固定不变
- [ ] Checkpoint 21: 示例验证：¥10,000购入，60个月，残值¥1,000，月折旧 = ¥150

#### 双倍余额递减法
- [ ] Checkpoint 22: 月折旧率 = 2 ÷ 使用月数
- [ ] Checkpoint 23: 当月折旧 = 期初账面价值 × 月折旧率
- [ ] Checkpoint 24: 折旧额逐月递减
- [ ] Checkpoint 25: 最后2年自动切换为直线法
- [ ] Checkpoint 26: 最终价值不低于残值
- [ ] Checkpoint 27: 示例验证：¥10,000购入，60个月，残值¥1,000，月折旧率 = 3.33%

### 折旧资产列表页
- [ ] Checkpoint 28: 顶部显示当前总价值和本月折旧额
- [ ] Checkpoint 29: Tab 可切换"使用中"和"已处置"
- [ ] Checkpoint 30: 可按价值降序或购入时间倒序排序
- [ ] Checkpoint 31: 列表项显示：资产图标 + 名称 + 品类标签 + 当前价值 + 折旧进度条
- [ ] Checkpoint 32: 折旧进度条颜色为卡布里蓝 #00BFFF
- [ ] Checkpoint 33: 点击资产卡片跳转详情页
- [ ] Checkpoint 34: 无资产时显示空态引导

### 折旧资产详情页
- [ ] Checkpoint 35: 顶部显示资产名称 + 品类标签 + 状态标签
- [ ] Checkpoint 36: 大字显示当前价值，颜色为卡布里蓝 #00BFFF
- [ ] Checkpoint 37: 显示折旧方法标签（直线法/双倍余额递减法）
- [ ] Checkpoint 38: 价值曲线图正确渲染（直线法为直线，双倍余额递减为曲线）
- [ ] Checkpoint 39: 信息卡片包含：购入价、购入日期、计划使用时长、预期残值、月折旧额、已使用月数
- [ ] Checkpoint 40: "调整价值"按钮可手动修正当前价值
- [ ] Checkpoint 41: "处置"按钮进入处置流程
- [ ] Checkpoint 42: 调整记录历史可查看

### 处置流程
- [ ] Checkpoint 43: 处置弹窗显示资产名称和当前价值
- [ ] Checkpoint 44: 可选择处置方式：报废/赠送/卖出
- [ ] Checkpoint 45: 选择"报废"时，价值归0，不生成收入记录
- [ ] Checkpoint 46: 选择"赠送"时，价值归0，不生成收入记录
- [ ] Checkpoint 47: 选择"卖出"时，显示卖出价格输入框
- [ ] Checkpoint 48: 卖出价格与当前价值对比，正确显示"赚了"或"亏了"
- [ ] Checkpoint 49: 确认卖出后，自动生成收入记录（金额=卖出价，分类=二手出售）
- [ ] Checkpoint 50: 处置后状态变为"已处置"，停止折旧
- [ ] Checkpoint 51: 处置记录保留在资产明细中

### 自动折旧
- [ ] Checkpoint 52: 每月1日自动执行折旧计算
- [ ] Checkpoint 53: 根据资产对应的折旧方法计算月折旧额
- [ ] Checkpoint 54: 当前价值不低于残值
- [ ] Checkpoint 55: 双倍余额递减法到达最后24个月时切换为直线法
- [ ] Checkpoint 56: 折旧记录写入账户变动明细

### 月度折旧汇总
- [ ] Checkpoint 57: 月度 FIRE 报告新增"本月折旧损耗"指标
- [ ] Checkpoint 58: 报告显示本月总折旧金额和折旧资产数量

## UI/UX 验收

### 布局
- [ ] Checkpoint 59: 记账页开关区域高度 80rpx，内边距 24rpx
- [ ] Checkpoint 60: 展开字段间距 24rpx
- [ ] Checkpoint 61: 列表页卡片高度 120rpx，圆角 16rpx，间距 16rpx
- [ ] Checkpoint 62: 详情页主价值区高度 180rpx
- [ ] Checkpoint 63: 处置弹窗宽 600rpx，居中弹出

### 颜色（卡布里蓝体系）
- [ ] Checkpoint 64: 页面背景 #FFFFFF
- [ ] Checkpoint 65: 主色描边图标 #00BFFF
- [ ] Checkpoint 66: 开关打开态 #00BFFF
- [ ] Checkpoint 67: 当前价值大字 #00BFFF
- [ ] Checkpoint 68: 折旧进度条填充 #00BFFF，背景 #E0F7FA
- [ ] Checkpoint 69: 已处置标签 #999999
- [ ] Checkpoint 70: 报废/赠送选项 #666666
- [ ] Checkpoint 71: 卖出选项 #00BFFF
- [ ] Checkpoint 72: 收入金额 #19BE6B

### 字体
- [ ] Checkpoint 73: 资产名称 32rpx，#333333，加粗
- [ ] Checkpoint 74: 当前价值 56rpx，#00BFFF，加粗
- [ ] Checkpoint 75: 品类标签 24rpx，#999999
- [ ] Checkpoint 76: 卡片金额 28rpx，#00BFFF
- [ ] Checkpoint 77: 折旧进度 24rpx，#666666

### 动效
- [ ] Checkpoint 78: 开关切换 slide 动画，200ms
- [ ] Checkpoint 79: 字段展开 slideDown + fadeIn，250ms
- [ ] Checkpoint 80: 列表加载 fadeIn，300ms，stagger 50ms
- [ ] Checkpoint 81: 卡片点击 scale 0.98，100ms
- [ ] Checkpoint 82: 价值变化数字滚动动画，800ms
- [ ] Checkpoint 83: 弹窗出现 slideUp + fadeIn，200ms

## API 验收

- [ ] Checkpoint 84: GET /api/assets/depreciating 返回资产列表和汇总数据
- [ ] Checkpoint 85: GET /api/assets/depreciating/:id 返回资产详情和调整历史
- [ ] Checkpoint 86: POST /api/assets/depreciating 创建资产成功，包含折旧方法字段
- [ ] Checkpoint 87: PUT /api/assets/depreciating/:id 更新资产成功
- [ ] Checkpoint 88: PUT /api/assets/depreciating/:id/dispose 处置资产成功
- [ ] Checkpoint 89: 处置方式为"卖出"时，返回 incomeRecordId
- [ ] Checkpoint 90: API 响应数据结构符合 TypeScript 接口定义

## 边界情况验收

- [ ] Checkpoint 91: 记账时"记入资产"开关未打开，不创建折旧资产
- [ ] Checkpoint 92: 未填完资产字段时点击记账，高亮提示，不提交
- [ ] Checkpoint 93: 卖出价格高于当前价值时，显示"赚了 ¥XX"
- [ ] Checkpoint 94: 卖出价格低于当前价值时，显示"亏了 ¥XX"
- [ ] Checkpoint 95: 资产已使用超过计划时长，价值保持残值
- [ ] Checkpoint 96: 双倍余额递减法在最后24个月自动切换直线法
- [ ] Checkpoint 97: 删除关联的记账记录，折旧资产保留，recordId 置空
- [ ] Checkpoint 98: 资产列表为空时显示"还没有折旧资产"引导

## 技术验收

- [ ] Checkpoint 99: 使用 Vue3 + TypeScript + SCSS
- [ ] Checkpoint 100: 使用 Wot UI 组件库
- [ ] Checkpoint 101: 遵循 UniApp 兼容性要求
- [ ] Checkpoint 102: API 风格为 RESTful
- [ ] Checkpoint 103: 不依赖 Phase 2/3 的其他功能
- [ ] Checkpoint 104: SVG 线框图标统一主色描边
- [ ] Checkpoint 105: 禁止黄色/暖色系
