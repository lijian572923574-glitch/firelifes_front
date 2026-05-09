# 投资账户追踪 - 验收清单

## 类型定义
- [ ] Checkpoint 1: Account 接口包含 investmentType 字段
- [ ] Checkpoint 2: investmentType 类型定义正确
- [ ] Checkpoint 3: costBasis 字段存在
- [ ] Checkpoint 4: currentValue 字段存在

## 账户创建
- [ ] Checkpoint 5: 投资类型选择正常
- [ ] Checkpoint 6: 持仓成本输入正常
- [ ] Checkpoint 7: 当前市值输入正常
- [ ] Checkpoint 8: 保存成功后账户创建

## 盈亏计算
- [ ] Checkpoint 9: 盈亏金额 = 当前市值 - 持仓成本
- [ ] Checkpoint 10: 收益率 = 盈亏 / 成本 × 100%
- [ ] Checkpoint 11: 盈利显示绿色
- [ ] Checkpoint 12: 亏损显示红色
- [ ] Checkpoint 13: 持平显示灰色

## 市值更新
- [ ] Checkpoint 14: 更新市值弹窗正常
- [ ] Checkpoint 15: 显示当前市值
- [ ] Checkpoint 16: 输入新市值正常
- [ ] Checkpoint 17: 实时计算盈亏变化
- [ ] Checkpoint 18: 确认后更新成功

## 投资账户列表
- [ ] Checkpoint 19: 列表正常显示
- [ ] Checkpoint 20: 显示账户名称
- [ ] Checkpoint 21: 显示当前市值
- [ ] Checkpoint 22: 显示盈亏金额
- [ ] Checkpoint 23: 显示收益率

## 资产总览
- [ ] Checkpoint 24: 投资作为单独大类显示
- [ ] Checkpoint 25: 显示总投资市值
- [ ] Checkpoint 26: 显示总盈亏
- [ ] Checkpoint 27: 点击进入投资详情

## API
- [ ] Checkpoint 28: POST /api/accounts 支持投资类型
- [ ] Checkpoint 29: PUT /api/accounts/:id/market-value 接口正常
- [ ] Checkpoint 30: GET /api/accounts?type=asset 支持筛选

## 边界情况
- [ ] Checkpoint 31: 成本为0时收益率显示 "--"
- [ ] Checkpoint 32: 市值为0时显示 "待录入"
- [ ] Checkpoint 33: 无投资账户时显示空状态
