import Vue from 'vue'
import VueRouter from 'vue-router'
// 导入自定义的登录组件
import Login from '../components/Login.vue'
// 导入后台主页组件
import Home from '../components/Home.vue'

Vue.use(VueRouter)

const routes = [
  // 定义路由规则
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/home', component: Home }
]

const router = new VueRouter({
  routes
})

/* 3. 路由导航守卫控制访问权限
如果用户没有登录，但是直接通过URL访问特定页面，需要重新导航到登录页面。 */
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个路径跳转而来
  // next 是一个函数，表示放行
  //     next()  放行    next('/login')  强制跳转

  // 如果用户访问的是登录页面(不需要权限) 直接放行
  if (to.path === '/login') return next();
  // 有权限页面
  const tokenStr = window.sessionStorage.getItem('token');
  if (!tokenStr) return next('/login');
  // 有token值 放行
  next();
})

export default router
