import Vue from 'vue'
import { Button } from 'element-ui'
// 导入表单控件
import { Form, FormItem } from 'element-ui'
import { Input } from 'element-ui'
// 导入弹框提示组件
import { Message } from 'element-ui'
// 导入布局容器组件
import { Container, Header, Aside, Main, Menu } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)

// 将弹框组件挂载到Vue原型对象身上 这样就可以在所有Vue组件中通过this.$message(自定义的)进行弹框提示
Vue.prototype.$message = Message
