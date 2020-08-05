import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'

// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入全局样式表
import './assets/css/global.css'
// 导入树型表格插件(运行依赖)
import TreeTable from 'vue-table-with-tree-grid'

// 导入富文本编辑器(运行依赖)
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑器对应的样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

import axios from 'axios'

// 项目优化 一、加载进度条
// 1. 导入 NProgress 包对应的JS和CSS
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/';
// 通过 axios 请求拦截器添加 token，保证拥有获取数据的权限。
// 请求拦截器 就相当于发送请求前的预处理 config是请求对象
// 除了登录之外的所有操作都需要权限 只有添加了token才有权限操作
// 2. 在 request (请求)拦截器中，展示进度条 NProgress.start()  如果触发了request拦截器 代表发起了网络请求 显示进度条
axios.interceptors.request.use(config => {
    NProgress.start();
    // console.log(config);
    // 为请求头对象，添加 Token 验证的 Authorization 字段
    config.headers.Authorization = window.sessionStorage.getItem('token');
    // 必须要返回config对象
    return config;
});
// 3. 在 response (响应)拦截器中，隐藏进度条 NProgress.done()  如果触发了response拦截器 代表结束了网络请求 隐藏进度条
axios.interceptors.response.use(config => {
    NProgress.done()
    return config
});
// 将axios挂载到Vue的原型对象上 这样每个Vue组件可以通过this直接访问$http 从而发起axios请求
Vue.prototype.$http = axios

Vue.config.productionTip = false

// 全局注册插件
Vue.component('tree-table', TreeTable)

// 将富文本编辑器 注册为全局可用的组件
Vue.use(VueQuillEditor, /* { default global options } */ )

// 全局注册一个时间过滤器
Vue.filter('dateFormat', function(originVal) {
    // originVal 需要处理的时间
    // 根据给定的时间指定一个时间对象
    const dt = new Date(originVal)

    const y = dt.getFullYear();
    // 关于月份 我们希望指定为两位 不足两位前面用0补充 先转字符串(调用字符串函数) padStart(总长度，不足位数用什么填充)
    const m = (dt.getMonth() + 1 + '').padStart(2, '0');
    const d = (dt.getDate() + '').padStart(2, '0')

    const hh = (dt.getHours() + '').padStart(2, '0')
    const mm = (dt.getMinutes() + '').padStart(2, '0')
    const ss = (dt.getSeconds() + '').padStart(2, '0')

    // return `yyyy-mm-dd hh:mm:ss`
    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
