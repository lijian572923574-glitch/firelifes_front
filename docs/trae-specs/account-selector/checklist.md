# 账户来源选择 - 验收清单（已重构）

## 组件结构
- [ ] Checkpoint 1: AccountSelector 组件创建完成
- [ ] Checkpoint 2: Header 显示区存在
- [ ] Checkpoint 3: 弹窗区域存在
- [ ] Checkpoint 4: 空状态区域存在

## Header 显示区
- [ ] Checkpoint 5: 显示账户图标（48rpx）
- [ ] Checkpoint 6: 显示账户名称
- [ ] Checkpoint 7: 显示账户余额
- [ ] Checkpoint 8: 资产余额显示绿色
- [ ] Checkpoint 9: 负债余额显示红色
- [ ] Checkpoint 10: 点击触发弹窗
- [ ] Checkpoint 11: 未选中时显示"选择账户"占位

## 弹窗列表
- [ ] Checkpoint 12: 弹窗 slideUp + fadeIn 动画正常
- [ ] Checkpoint 13: 按资产类/负债类分组
- [ ] Checkpoint 14: 分组标题正确
- [ ] Checkpoint 15: 账户项显示图标
- [ ] Checkpoint 16: 账户项显示名称
- [ ] Checkpoint 17: 账户项显示余额
- [ ] Checkpoint 18: 选中态背景 #E0F7FA
- [ ] Checkpoint 19: 点击选中后关闭弹窗
- [ ] Checkpoint 20: Header 更新显示选中账户

## 搜索功能
- [ ] Checkpoint 21: 搜索框存在
- [ ] Checkpoint 22: 输入关键词实时过滤
- [ ] Checkpoint 23: 无匹配时显示"未找到"
- [ ] Checkpoint 24: 清除搜索恢复正常列表

## 添加入口
- [ ] Checkpoint 25: "+ 添加新账户"按钮存在
- [ ] Checkpoint 26: 点击跳转账户编辑页
- [ ] Checkpoint 27: 添加成功后选中账户
- [ ] Checkpoint 28: 添加成功后关闭弹窗

## 管理入口
- [ ] Checkpoint 29: "管理账户"按钮存在
- [ ] Checkpoint 30: 点击跳转账户管理页

## 空状态引导
- [ ] Checkpoint 31: 无账户时显示引导
- [ ] Checkpoint 32: "一键添加预设账户"按钮存在
- [ ] Checkpoint 33: 点击批量创建5个账户
- [ ] Checkpoint 34: "自定义添加账户"按钮存在

## 记账页集成
- [ ] Checkpoint 35: 记账页集成 AccountSelector
- [ ] Checkpoint 36: 未选择账户时记账按钮禁用
- [ ] Checkpoint 37: 选择账户后记账按钮启用
- [ ] Checkpoint 38: 提交时传递 accountId

## 数据加载
- [ ] Checkpoint 39: GET /api/accounts 接口正常
- [ ] Checkpoint 40: 账户数据缓存5分钟
- [ ] Checkpoint 41: 网络错误时显示缓存

## 动画效果
- [ ] Checkpoint 42: 弹窗动画流畅
- [ ] Checkpoint 43: 列表项点击反馈
- [ ] Checkpoint 44: 余额更新滚动动画
