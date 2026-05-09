# 折旧资产生命周期管理 - 实施计划

## [ ] Task 1: 创建折旧资产 API 接口
- **Priority**: P0
- **Depends On**: None
- **File**: `src/api/assets/depreciating.ts`
- **Description**: 
  - 创建 GET /api/assets/depreciating - 获取折旧资产列表
  - 创建 GET /api/assets/depreciating/:id - 获取详情
  - 创建 POST /api/assets/depreciating - 创建资产（包含 depreciationMethod 字段）
  - 创建 PUT /api/assets/depreciating/:id - 更新资产
  - 创建 PUT /api/assets/depreciating/:id/dispose - 处置资产
  - 创建 GET /api/assets/depreciating/:id/adjustments - 获取调整历史
- **Acceptance Criteria Addressed**: AC-1, AC-5, AC-10, AC-11, AC-15
- **Test Requirements**: `api-mock` TR-1.1: 各接口返回符合数据结构定义

## [ ] Task 2: 创建品类推荐参数常量
- **Priority**: P0
- **Depends On**: None
- **File**: `src/constants/depreciating-categories.ts`
- **Description**: 
  - 定义 DepreciatingCategory 类型（9个品类：phone, computer, camera, appliance, footwear, furniture, bag, sports, other）
  - 定义 DepreciationMethod 类型（'straight-line' | 'double-declining-balance'）
  - 定义 CATEGORY_DEFAULTS 常量（品类→折旧方法+默认寿命+残值率）
  - 导出 getCategoryDefaults(category) 函数
  - 导出 calculateDepreciation 函数（支持两种方法）
- **Acceptance Criteria Addressed**: AC-3, AC-7, AC-8, AC-9, AC-13
- **Test Requirements**: `unit-test` TR-2.1: calculateDepreciation 计算结果正确

## [ ] Task 3: 创建记账页"记入资产"开关组件
- **Priority**: P0
- **Depends On**: Task 2
- **File**: `src/pages/record/components/DepreciatingAssetSwitch.vue`
- **Description**: 
  - 组件 props: modelValue (Boolean), purchasePrice (Number), defaultCategory (String)
  - 组件 emits: update:modelValue, change (assetFields)
  - 显示"记入资产"开关，仅 type=expense 时渲染
  - 开关打开时展开字段：
    - 品类标签选择器（9个选项）
    - 折旧方法选择器（直线法 / 双倍余额递减法）
    - 计划使用时长输入（月）
    - 预期残值输入（元）
    - 资产名称输入（默认取分类名）
  - 选择品类后自动推荐折旧方法和填充推荐参数
  - 显示当前折旧方法的月折旧估算说明
  - 折旧方法选择后禁用（只读）
- **Acceptance Criteria Addressed**: AC-1, AC-2, AC-3, AC-4
- **Test Requirements**: `human-judgment` TR-3.1: 开关展开/收起动画流畅

## [ ] Task 4: 集成"记入资产"开关到记账页
- **Priority**: P0
- **Depends On**: Task 1, Task 3
- **File**: `src/pages/record/index.vue`
- **File**: `src/pages/record/components/RecordForm.vue`
- **Description**: 
  - 在金额输入区下方、选择账户之后引入 DepreciatingAssetSwitch
  - 记账类型为"支出"时显示开关
  - 开关打开时收集资产字段数据（包含 depreciationMethod）
  - 提交记账时同时调用创建折旧资产 API
- **Acceptance Criteria Addressed**: AC-1, AC-5
- **Test Requirements**: `integration-test` TR-4.1: 记账成功同时创建资产记录

## [ ] Task 5: 创建折旧资产卡片组件
- **Priority**: P0
- **Depends On**: None
- **File**: `src/components/DepreciatingAssetCard.vue`
- **Description**: 
  - 组件 props: asset (DepreciatingAsset)
  - 显示：资产图标 + 名称 + 品类标签 + 折旧方法标签 + 当前价值 + 折旧进度条
  - 折旧进度 = (购入价 - 当前价值) / (购入价 - 残值)
  - 进度条颜色：卡布里蓝 #00BFFF
  - 点击跳转详情页
- **Acceptance Criteria Addressed**: AC-6
- **Test Requirements**: `human-judgment` TR-5.1: 卡片布局和信息展示正确

## [ ] Task 6: 创建折旧进度条组件
- **Priority**: P1
- **Depends On**: None
- **File**: `src/components/DepreciationProgress.vue`
- **Description**: 
  - 组件 props: current (Number), total (Number), maxValue (Number)
  - 进度 = (total - current) / (total - maxValue) * 100%
  - 进度条填充：#00BFFF，背景：#E0F7FA
  - 圆角端点样式
- **Acceptance Criteria Addressed**: AC-6
- **Test Requirements**: `unit-test` TR-6.1: 进度计算正确

## [ ] Task 7: 创建资产价值曲线图组件
- **Priority**: P1
- **Depends On**: None
- **File**: `src/components/AssetValueChart.vue`
- **Description**: 
  - 组件 props: depreciationCurve (Array<{month, value}>), purchasePrice (Number), residualValue (Number), method (DepreciationMethod)
  - 使用 ECharts 折线图
  - X轴：月份，Y轴：金额
  - 数据线：
    - 直线法：购入价水平虚线 + 当前价值直线
    - 双倍余额递减法：购入价水平虚线 + 当前价值递减曲线
  - 图表样式：卡布里蓝主色，浅蓝色区域填充
- **Acceptance Criteria Addressed**: AC-6 (详情页)
- **Test Requirements**: `human-judgment` TR-7.1: 图表渲染正确，加载动画流畅

## [ ] Task 8: 创建处置弹窗组件
- **Priority**: P0
- **Depends On**: Task 1
- **File**: `src/components/DisposeModal.vue`
- **Description**: 
  - 组件 props: visible (Boolean), asset (DepreciatingAsset)
  - 组件 emits: close, confirm (disposalData)
  - 显示资产名称和当前价值
  - Radio 选择处置方式：报废/赠送/卖出
  - 选择"卖出"时显示卖出价格输入框
  - 卖出价格与当前价值对比，显示"赚了"/"亏了"
  - 底部按钮：取消 / 确认处置
- **Acceptance Criteria Addressed**: AC-10, AC-11, AC-12
- **Test Requirements**: `human-judgment` TR-8.1: 弹窗交互流畅

## [ ] Task 9: 创建折旧资产列表页
- **Priority**: P0
- **Depends On**: Task 1, Task 5, Task 6
- **File**: `src/pages/assets/depreciating/index.vue`
- **Description**: 
  - 顶部汇总区：本月总折旧额、当前总价值
  - Tab 筛选：使用中 / 已处置
  - 排序切换：按价值 / 按时间
  - 列表渲染：DepreciatingAssetCard（显示折旧方法标签）
  - 空态：引导"还没有折旧资产"
  - 请求 GET /api/assets/depreciating
- **Acceptance Criteria Addressed**: AC-6
- **Test Requirements**: `integration-test` TR-9.1: 列表数据正确展示

## [ ] Task 10: 创建折旧资产详情页
- **Priority**: P0
- **Depends On**: Task 1, Task 6, Task 7, Task 8
- **File**: `src/pages/assets/depreciating/detail.vue`
- **Description**: 
  - 请求 GET /api/assets/depreciating/:id
  - 顶部：资产名称 + 品类标签 + 折旧方法标签 + 状态标签
  - 大字当前价值（卡布里蓝）
  - 价值曲线图（AssetValueChart，根据 method 渲染直线或曲线）
  - 信息卡片：购入价/日期/时长/残值/月折旧/已用月数
  - 操作按钮："调整价值" / "处置"
  - 调整价值弹窗：输入框 + 确认
  - 处置弹窗（DisposeModal）
- **Acceptance Criteria Addressed**: AC-3, AC-7, AC-8, AC-10, AC-11, AC-12, AC-15
- **Test Requirements**: `integration-test` TR-10.1: 详情页数据完整

## [ ] Task 11: 创建资产总览页折旧资产区块
- **Priority**: P0
- **Depends On**: Task 1, Task 5
- **File**: `src/pages/assets/index.vue`
- **Description**: 
  - 在资产总览页新增"折旧资产"区块
  - 展示：当前总价值 + 本月折旧额 + "查看全部"入口
  - 点击"查看全部"跳转列表页
  - 请求汇总数据 GET /api/assets/depreciating
- **Acceptance Criteria Addressed**: AC-6
- **Test Requirements**: `human-judgment` TR-11.1: 区块位置和样式符合设计

## [ ] Task 12: 创建资产模块 Pinia Store
- **Priority**: P0
- **Depends On**: Task 1
- **File**: `src/store/modules/depreciating-assets.ts`
- **Description**: 
  - 定义 state: assets, currentAsset, loading, summary
  - 定义 actions: fetchAssets, fetchAssetDetail, createAsset, updateAsset, disposeAsset, adjustValue
  - 定义 getters: activeAssets, disposedAssets, totalCurrentValue
  - 本地缓存：读取缓存优先，请求后更新缓存
- **Acceptance Criteria Addressed**: All
- **Test Requirements**: `unit-test` TR-12.1: Store 状态管理正确

## [ ] Task 13: 添加路由配置
- **Priority**: P0
- **Depends On**: Task 9, Task 10
- **File**: `src/router/index.ts`
- **Description**: 
  - 添加 /pages/assets/depreciating/index 路由
  - 添加 /pages/assets/depreciating/detail 路由
- **Acceptance Criteria Addressed**: None
- **Test Requirements**: `manual` TR-13.1: 路由跳转正常

## [ ] Task 14: 自动折旧定时任务（后端）
- **Priority**: P1
- **Depends On**: Task 1
- **File**: `server/jobs/monthly-depreciation.ts`
- **Description**: 
  - 每月1日00:00执行
  - 查询所有"使用中"且"已使用月数 < 计划使用月数"的资产
  - 根据 depreciationMethod 执行折旧计算
  - 双倍余额递减法到达剩余期≤总期×40%时切换直线法
  - 更新当前价值
  - 写入折旧记录到 account_changes 表
  - 到达使用期限的资产停止折旧
- **Acceptance Criteria Addressed**: AC-8, AC-9, AC-13
- **Test Requirements**: `integration-test` TR-14.1: 定时任务执行正确

## [ ] Task 15: 月度 FIRE 报告折旧损耗集成
- **Priority**: P1
- **Depends On**: Task 14
- **File**: `src/pages/fire-report/index.vue`
- **Description**: 
  - 月度 FIRE 报告页新增"本月折旧损耗"指标
  - 展示：本月总折旧金额 + 折旧资产数量
  - 请求汇总数据时包含月度折旧信息
- **Acceptance Criteria Addressed**: AC-14
- **Test Requirements**: `integration-test` TR-15.1: 报告正确展示折旧数据
