import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 全局引入样式
import '@/assets/css/reset-pc.css'

// 全局挂载脚本
import './api/mock/index.js'
import Api from './api/axios/index.js'
Vue.prototype.$api = Api;

// import plugin from './plugin'
// Vue.use(plugin)

import alikeIcon from '../packages/icon/icon'
import alikeLine from '../packages/line/line'
import alikeDivider from '../packages/divider/divider'
import alikeButton from '../packages/button/button'
Vue.component(alikeIcon.name,alikeIcon);
Vue.component(alikeLine.name,alikeLine);
Vue.component(alikeDivider.name,alikeDivider);
Vue.component(alikeButton.name,alikeButton);


Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app')