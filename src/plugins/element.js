import Vue from 'vue'
import { Button } from 'element-ui'
// 导入表单控件
import { Form, FormItem } from 'element-ui'
import { Input } from 'element-ui'
// 导入弹框提示组件
import { Message } from 'element-ui'
// 导入布局容器组件
import { Container, Header, Aside, Main } from 'element-ui'
// 导入菜单组件
import { Menu, Submenu, MenuItem } from 'element-ui'
// 导入面包屑导航、卡片、栅格行列
import { Breadcrumb, BreadcrumbItem, Card, Row, Col } from 'element-ui'
// 导入表格和开关按钮 提示信息 分页 对话框 弹框
import { Table, TableColumn, Switch, Tooltip, Pagination, Dialog, MessageBox } from 'element-ui'
// 导入标签组件 树形 下拉框
import { Tag, Tree, Select, Option } from 'element-ui'
// 导入级联选择器 警告 tab页签 步骤条 多选框 图片上传
import { Cascader, Alert, Tabs, TabPane, Steps, Step, CheckboxGroup, Checkbox, Upload } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Cascader)
Vue.use(Alert)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Steps)
Vue.use(Step)
Vue.use(CheckboxGroup)
Vue.use(Checkbox)
Vue.use(Upload)

// 将弹框组件挂载到Vue原型对象身上 这样就可以在所有Vue组件中通过this.$message(自定义的)进行弹框提示
Vue.prototype.$message = Message;
// 将弹窗信息 挂载到Vue
Vue.prototype.$confirm = MessageBox.confirm
