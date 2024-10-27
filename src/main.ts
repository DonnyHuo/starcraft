import { createApp } from 'vue';
import App from '@/App.vue';
import store from '@/stores';
import router from '@/router';
import api from '@/globalApi';
import utils from '@/globalUtil';
import walletUtils from '@/globalUtil/walletUtils';
import 'vant/lib/index.css';
import '@/globalStyle/index.scss';

import {
  ConfigProvider,
  setToastDefaultOptions,
  showToast,
  showSuccessToast,
  showFailToast,
  showLoadingToast,
  closeToast,
  showConfirmDialog
} from 'vant';

const app = createApp(App);
app.use(ConfigProvider);
app.use(router);
app.use(store);

app.config.globalProperties.$isProd = process.env.NODE_ENV == 'production';

app.config.globalProperties.$api = api;
app.config.globalProperties.$utils = utils;
app.config.globalProperties.$walletUtils = walletUtils;

app.config.globalProperties.$showToast = showToast;
app.config.globalProperties.$showSuccessToast = showSuccessToast;
app.config.globalProperties.$showFailToast = showFailToast;
app.config.globalProperties.$showLoadingToast = showLoadingToast;
app.config.globalProperties.$closeToast = closeToast;
app.config.globalProperties.$showConfirmDialog = showConfirmDialog;
setToastDefaultOptions({ duration: 3000, wordBreak: 'break-word' });
setToastDefaultOptions('loading', { forbidClick: true, duration: 0 });

app.mount('#app');
