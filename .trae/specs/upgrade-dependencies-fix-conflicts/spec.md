# 解决各国插件版本冲突并升级依赖 - 产品需求文档

## Overview
- **Summary**: 解决 firelifes_front 项目中 uni-app 各平台插件版本不一致的问题，升级所有依赖到最新稳定版本，确保项目能够正常构建和运行在多个平台上
- **Purpose**: 解决当前项目依赖版本冲突导致的构建问题，确保项目在各小程序平台（微信、支付宝、百度、QQ、抖音等）、H5 和 App 端都能正常工作
- **Target Users**: 项目开发团队

## Goals
- 统一所有 @dcloudio 相关依赖版本，消除版本冲突
- 升级所有依赖到最新稳定版本，获得最新功能和安全修复
- 确保项目能够正常构建和运行在所有目标平台
- 保持项目的可维护性和可扩展性

## Non-Goals (Out of Scope)
- 不重构项目业务代码
- 不修改现有功能逻辑
- 不迁移到其他技术栈

## Background & Context
当前项目使用 uni-app 框架，支持多个平台，但存在以下问题：
- uni-app 依赖版本为 3.0.0-4080420251103001，最新稳定版本已更新到 4.x 系列
- 部分依赖版本较旧，可能存在安全隐患
- 各平台插件版本可能存在兼容性问题
- TypeScript 版本较旧 (4.9.4)

## Functional Requirements
- **FR-1**: 统一所有 @dcloudio 相关依赖到最新稳定版本
- **FR-2**: 升级其他第三方依赖到兼容的最新稳定版本
- **FR-3**: 确保项目能够正常执行 `npm install`
- **FR-4**: 确保项目能够正常执行 `npm run dev:h5`、`npm run dev:mp-weixin` 等开发命令
- **FR-5**: 确保项目能够正常执行 `npm run build:h5`、`npm run build:mp-weixin` 等构建命令

## Non-Functional Requirements
- **NFR-1**: 升级后项目构建时间不应显著增加
- **NFR-2**: 升级过程应保持向后兼容，不影响现有功能
- **NFR-3**: 所有升级应有明确的版本选择依据

## Constraints
- **Technical**: 必须保持与 uni-app 框架的兼容性；使用 Vue 3.x 作为前端框架
- **Business**: 需要在保证项目正常运行的前提下进行升级
- **Dependencies**: 依赖于 npm 公共 registry

## Assumptions
- npm 公共 registry 可用
- 当前项目代码在现有依赖版本下是可正常运行的
- 升级到最新版本的 uni-app 是安全的

## Acceptance Criteria

### AC-1: 依赖版本统一
- **Given**: 项目根目录存在 package.json
- **When**: 执行依赖升级后
- **Then**: 所有 @dcloudio 相关依赖版本一致且为最新稳定版本
- **Verification**: `programmatic`

### AC-2: npm install 成功
- **Given**: 已更新 package.json
- **When**: 执行 `npm install`
- **Then**: 安装过程无错误，所有依赖成功安装
- **Verification**: `programmatic`

### AC-3: H5 开发模式可运行
- **Given**: 依赖安装成功
- **When**: 执行 `npm run dev:h5`
- **Then**: 开发服务器正常启动，无编译错误
- **Verification**: `programmatic`

### AC-4: H5 构建成功
- **Given**: 依赖安装成功
- **When**: 执行 `npm run build:h5`
- **Then**: 构建成功完成，生成 dist 目录
- **Verification**: `programmatic`

### AC-5: 微信小程序构建成功
- **Given**: 依赖安装成功
- **When**: 执行 `npm run build:mp-weixin`
- **Then**: 构建成功完成，生成 dist/dev/mp-weixin 目录
- **Verification**: `programmatic`

### AC-6: TypeScript 类型检查通过
- **Given**: 依赖安装成功
- **When**: 执行 `npm run type-check`
- **Then**: 类型检查通过，无错误
- **Verification**: `programmatic`

## Open Questions
- [ ] 是否需要升级到 uni-app 4.x 系列，还是保持在 3.x 的最新版本？
- [ ] 是否需要升级 TypeScript 到 5.x 系列？
