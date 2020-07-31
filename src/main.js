import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'

// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入全局样式表
import './assets/css/global.css'
// 导入插件
import TreeTable from 'vue-table-with-tree-grid'

import axios from 'axios'
// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/';
// 通过 axios 请求拦截器添加 token，保证拥有获取数据的权限。
// 请求拦截器 就相当于发送请求前的预处理 config是请求对象
axios.interceptors.request.use(config => {
    // console.log(config);
    // 为请求头对象，添加 Token 验证的 Authorization 字段
    config.headers.Authorization = window.sessionStorage.getItem('token');
    // 必须要返回config对象
    return config;
});
// 将axios挂载到Vue的原型对象上 这样每个Vue组件可以通过this直接访问$http 从而发起axios请求
Vue.prototype.$http = axios

Vue.config.productionTip = false

// 全局注册插件
Vue.component('tree-table', TreeTable)

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
