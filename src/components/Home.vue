<template>
<el-container>
    <!-- 注意：每一个 el-container 中提供的组件 其组件名就是类名(可以直接做样式修饰) -->
    <!-- 头部区域 -->
    <el-header>
        <div>
            <img src="../assets/heima.png" alt="">
            <span>电商管理系统</span>
        </div>
        <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
        <!-- 左侧侧边栏 如果菜单折叠宽度为64px -->
        <el-aside :width="isCollapse?'64px':'200px'">
            <!-- 折叠按钮 点击按钮折叠菜单 -->
            <div class="toggle-button" @click="toggleCollapse">|||</div>
            <!-- unique-opened 是否只保持一个子菜单的展开  collapse 是否水平折叠收起菜单  collapse-transition 是否开启折叠动画(一定要绑定形式赋值才会是bool 不然就是字符串不起作用) -->
            <!-- router	是否使用 vue-router 的模式，启用该模式会在激活导航时以 index 作为 path 进行路由跳转 -->
            <!-- default-active	当前激活菜单的 index -->
            <el-menu :default-active="activePath" class="el-menu-vertical-demo" background-color="#333744" text-color="#fff" active-text-color="#409EFF" unique-opened :collapse='isCollapse' :collapse-transition='false' router>
                <!-- 一级菜单 问题：当我们进行循环生成的一级菜单展开时，所有的一级菜单全部展开 原因是使用的同一index，我们只需要将一级菜单的index改为循环得到的id(或index) -->
                <!-- 给一级菜单绑定唯一标识 区分单独展开子菜单 但是elementUI设定index只能为字符串 我们需要将item.id数值转换为字符串 -->
                <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
                    <!-- 一级菜单的模板区域 -->
                    <template slot="title">
                        <!-- 图标 一级菜单的图标根据数组id值对图标对象value进行匹配 -->
                        <i :class="iconsObj[item.id]"></i>
                        <!-- 文本 -->
                        <span>{{item.authName}}</span>
                    </template>

                    <!-- 二级菜单 将子菜单项的index改为路由path 这样就能点击跳到指定路由路径 -->
                    <!-- 点击菜单选项时要保存选中状态 使菜单高亮显示  -->
                    <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveNavState('/' + subItem.path)">
                        <template slot="title">
                            <i class="el-icon-menu"></i>
                            <span>{{subItem.authName}}</span>
                        </template>
                    </el-menu-item>
                </el-submenu>
            </el-menu>
        </el-aside>
        <!-- 右侧内容主体 -->
        <el-main>
            <!-- 路由占位符 -->
            <router-view></router-view>
        </el-main>
    </el-container>
</el-container>
</template>

<script>
export default {
    data() {
        return {
            // 左侧菜单数据
            menuList: [],
            // 一级菜单的图标对象 根据数组中id作为key值
            iconsObj: {
                '125': 'iconfont icon-user',
                '103': 'iconfont icon-tijikongjian',
                '101': 'iconfont icon-shangpin',
                '102': 'iconfont icon-danju',
                '145': 'iconfont icon-baobiao'
            },
            // 是否对菜单进行折叠 默认不折叠
            isCollapse: false,
            // 被激活的链接地址
            activePath: ''
        }
    },
    // 在页面被创建时就需要从服务端获取数据
    created() {
        this.getMenuList();
        // 加载菜单选中状态 使其高亮显示
        this.activePath = window.sessionStorage.getItem('activePath');
    },
    methods: {
        // 退出登录
        logout() {
            // 清空token
            window.sessionStorage.clear();
            // 跳转到登录页
            this.$router.push('/login');
        },
        // 获取所有的菜单
        async getMenuList() {
            const {
                data: res
            } = await this.$http.get('menus');
            if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
            // 返回的data也是一个数组 直接赋值给空数组是没问题的
            this.menuList = res.data;
            console.log(res);
        },
        // 点击按钮，切换菜单的折叠与展开
        toggleCollapse() {
            this.isCollapse = !this.isCollapse;
        },
        // 点击时，保存链接的激活状态
        saveNavState(activePath) {
            window.sessionStorage.setItem('activePath', activePath);
            this.activePath = activePath;
        }
    }
}
</script>

<style lang="less" scoped>
.el-container {
    height: 100%;
}

.el-header {
    background-color: #373d41;
    // 制定flex布局
    display: flex;
    // 左右贴边对齐
    justify-content: space-between;
    padding-left: 0;
    // 让子项目垂直居中
    align-items: center;
    font-size: 20px;
    color: #fff;

    >div {
        display: flex;
        align-items: center;

        span {
            margin-left: 15px;
        }
    }
}

.el-aside {
    background-color: #333744;

    .el-menu {
        // 去掉右侧有个对不齐的小边框
        border-right: 0;
    }
}

.iconfont {
    margin-right: 10px;
}

.el-main {
    background-color: #eaedf1;
}

.toggle-button {
    background-color: #4a5064;
    font-size: 10px;
    color: #fff;
    line-height: 24px;
    text-align: center;
    cursor: pointer;
    // 字体之间隔开.2em距离
    letter-spacing: 0.2em;
}
</style>
