# 储蓄率追踪 - 验收清单

## 页面结构
- [ ] Checkpoint 1: 储蓄率趋势页面创建完成
- [ ] Checkpoint 2: 页面内边距 32rpx

## 储蓄率标签
- [ ] Checkpoint 3: 标签组件创建完成
- [ ] Checkpoint 4: 进度条显示正常
- [ ] Checkpoint 5: 百分比显示正常
- [ ] Checkpoint 6: 进度条高度 24rpx
- [ ] Checkpoint 7: 进度条圆角 12rpx

## 储蓄率计算
- [ ] Checkpoint 8: 公式正确：(收入 - 支出) / 收入
- [ ] Checkpoint 9: 储蓄率为负时计算正确
- [ ] Checkpoint 10: 收支平衡时储蓄率为0

## 颜色分级
- [ ] Checkpoint 11: ≥50% 使用绿色 #19BE6B
- [ ] Checkpoint 12: 30%-50% 使用蓝色 #00BFFF
- [ ] Checkpoint 13: 10%-30% 使用橙色 #FF9800
- [ ] Checkpoint 14: <10% 或 <0% 使用红色 #FA3534
- [ ] Checkpoint 15: 进度条颜色正确

## 柱状图
- [ ] Checkpoint 16: 柱状图组件创建完成
- [ ] Checkpoint 17: 显示近12个月数据
- [ ] Checkpoint 18: 柱子颜色按分级
- [ ] Checkpoint 19: 高度动画加载正常
- [ ] Checkpoint 20: X轴显示月份
- [ ] Checkpoint 21: Y轴显示百分比

## 年度累计
- [ ] Checkpoint 22: 显示已存金额
- [ ] Checkpoint 23: 显示累计储蓄率
- [ ] Checkpoint 24: 数字滚动动画正常

## 月度明细
- [ ] Checkpoint 25: 明细列表正常显示
- [ ] Checkpoint 26: 显示月份、收入、支出、储蓄率
- [ ] Checkpoint 27: 列表项颜色分级正确

## 明细页集成
- [ ] Checkpoint 28: 明细页顶部显示储蓄率标签
- [ ] Checkpoint 29: 标签可点击
- [ ] Checkpoint 30: 点击进入储蓄率趋势页

## 数据加载
- [ ] Checkpoint 31: GET /api/analytics/savings-rate 接口正常
- [ ] Checkpoint 32: Loading 状态显示
- [ ] Checkpoint 33: 无数据时显示空状态

## 异常处理
- [ ] Checkpoint 34: 无收入时显示 "--"
- [ ] Checkpoint 35: 无数据时显示引导
- [ ] Checkpoint 36: 支出大于收入时储蓄率为负
