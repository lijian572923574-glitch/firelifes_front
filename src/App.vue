<!--
  App.vue - 应用程序入口页面
  功能：作为整个应用的入口文件，管理应用生命周期和全局配置
  技术：Vue3 + TypeScript + uni-app
-->
<script setup lang="ts">
import { onLaunch, onShow, onHide, onError } from "@dcloudio/uni-app";
import { useI18n } from 'vue-i18n';
import config from './config/index';
import { storage } from './utils/storage';

const { t } = useI18n();

// 应用启动时触发
onLaunch(() => {
  console.log('[app] 应用启动', t('app.launch'));
  const token = storage.get(config.tokenKey);
  const user = storage.get(config.userKey);
  console.log('[app] 初始状态', { token: token ? '有' : '无', user: user ? user.phone : '无' });
  
  // 全局错误监听
  if (typeof window !== 'undefined') {
    window.addEventListener('unhandledrejection', (event) => {
      console.error('[app] 未处理的Promise拒绝:', event.reason);
      event.preventDefault();
    });
  }
});

// 应用显示时触发
onShow(() => {
  console.log('[app] 应用显示', t('app.show'));
});

// 应用隐藏时触发
onHide(() => {
  console.log('[app] 应用隐藏', t('app.hide'));
});

// 应用发生错误时触发
onError((err) => {
  console.error('[app] 应用发生错误:', err);
  uni.showToast({
    title: '发生错误，请刷新重试',
    icon: 'none',
    duration: 2000
  });
});
</script>

<style>
/* 全局样式 */
@import url("./static/iconfont/iconfont.css");
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
  background: #F5F5F5;
  color: #333;
  -webkit-font-smoothing: antialiased;
}
</style>
