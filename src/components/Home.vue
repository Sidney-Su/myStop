<template>
<el-container>
    <!-- 注意：每一个 el-container 中提供的组件 其组件名就是类名(可以直接做样式修饰) -->
    <!-- 头部区域 -->
    <el-header>Header<el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
        <!-- 侧边栏 -->
        <el-aside width="200px">Aside</el-aside>
        <el-main>Main</el-main>
    </el-container>
</el-container>
</template>

<script>
export default {
    methods: {
        // 退出登录
        logout() {
            // 清空token
            window.sessionStorage.clear();
            // 跳转到登录页
            this.$router.push('/login');
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
}

.el-aside {
    background-color: #333744;
}

.el-main {
    background-color: #eaedf1;
}
</style>
