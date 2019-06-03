import Vue from 'vue';
import axios from 'axios';
import Element from 'element-ui';
import VueI18n from 'vue-i18n';

import App from './App';
import router from './router';
import store from './store';

import '../../theme/styles/index.css';

global.Vue = Vue;

const messages = require('./i18n');

if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.http = Vue.prototype.$http = axios;
Vue.config.productionTip = false;
Vue.use(Element);
/* eslint-disable no-new */
new Vue({
  i18n: new VueI18n({
    locale: 'en',
    messages,
  }),
  components: { App },
  router,
  store,
  template: '<App/>',
}).$mount('#app');
