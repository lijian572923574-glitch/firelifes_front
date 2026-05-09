# FIRE目标设定 - 验收清单

## 页面结构
- [ ] Checkpoint 1: FIRE 目标页面创建完成
- [ ] Checkpoint 2: 页面内边距 32rpx
- [ ] Checkpoint 3: 空状态引导正确显示

## 目标月支出输入
- [ ] Checkpoint 4: 金额输入框正常
- [ ] Checkpoint 5: 输入验证（正数）
- [ ] Checkpoint 6: "自动计算"按钮存在
- [ ] Checkpoint 7: 自动计算显示月份选择

## 自动计算
- [ ] Checkpoint 8: 接口 GET /api/fire/avg-expense 正常
- [ ] Checkpoint 9: 支持 3/6/12 个月参数
- [ ] Checkpoint 10: 计算结果填入输入框
- [ ] Checkpoint 11: 计算中显示 loading

## 安全提现率滑块
- [ ] Checkpoint 12: 滑块组件创建完成
- [ ] Checkpoint 13: 范围 1%-6%
- [ ] Checkpoint 14: 默认值 4%
- [ ] Checkpoint 15: 显示常用预设标签
- [ ] Checkpoint 16: 拖动时实时更新

## 投资回报率滑块
- [ ] Checkpoint 17: 范围 1%-12%
- [ ] Checkpoint 18: 默认值 7%
- [ ] Checkpoint 19: 显示说明文字

## 退休年龄滑块
- [ ] Checkpoint 20: 范围 30-70
- [ ] Checkpoint 21: 默认值 55

## 目标净资产预览
- [ ] Checkpoint 22: 公式正确：目标月支出 × 12 ÷ 安全提现率
- [ ] Checkpoint 23: 显示大字（64rpx）
- [ ] Checkpoint 24: 数字使用卡布里蓝色
- [ ] Checkpoint 25: 数字变化使用滚动动画

## 保存功能
- [ ] Checkpoint 26: POST /api/fire/goal 接口正常
- [ ] Checkpoint 27: 必填项验证正常
- [ ] Checkpoint 28: 保存成功后显示提示
- [ ] Checkpoint 29: 保存后返回上一页

## 数据加载
- [ ] Checkpoint 30: GET /api/fire/goal 接口正常
- [ ] Checkpoint 31: 有目标时回填表单
- [ ] Checkpoint 32: 无目标时显示空状态

## 表单交互
- [ ] Checkpoint 33: 修改参数实时更新预览
- [ ] Checkpoint 34: 滑块拖动流畅
- [ ] Checkpoint 35: 页面切换无白屏
