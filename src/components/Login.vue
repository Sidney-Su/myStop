<template>
<div class="login_container">
    <div class="login_box">
        <!-- 头像区域 -->
        <div class="avatar_box">
            <img src="../assets/logo.png" alt="">
        </div>
        <!-- 登录表单区域 绑定数据对象 :model="loginForm" 绑定表单校验对象 :rules="loginFormRules" -->
        <!-- 给表单定义引用 其值就是表单的实例对象 -->
        <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_form">
            <!-- 用户名 -->
            <el-form-item prop="username">
                <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <!-- 密码 -->
            <el-form-item prop="password">
                <el-input v-model="loginForm.password" prefix-icon="iconfont icon-3702mima" placeholder="请输入密码" type="password"></el-input>
            </el-form-item>
            <!-- 按钮区域 -->
            <el-form-item class="btns">
                <el-button type="primary" @click="login">登录</el-button>
                <el-button type="info" @click="resetLoginForm">重置</el-button>
            </el-form-item>
        </el-form>
    </div>

</div>
</template>

<script>
export default {
    data() {
        return {
            // 这是登录表单的数据绑定对象
            loginForm: {
                username: 'admin',
                password: '123456'
            },
            // 这是表单的验证规则对象
            loginFormRules: {
                // 验证用户名是否合法 失去焦点触发
                username: [{
                        required: true,
                        message: '请输入用户名',
                        trigger: 'blur'
                    },
                    {
                        min: 3,
                        max: 10,
                        message: '长度在 3 到 10 个字符',
                        trigger: 'blur'
                    }
                ],
                // 验证密码是否合法
                password: [{
                        required: true,
                        message: '请输入密码',
                        trigger: 'blur'
                    },
                    {
                        min: 6,
                        max: 16,
                        message: '长度在 6 到 16 个字符',
                        trigger: 'blur'
                    }
                ]
            }
        }
    },
    methods: {
        // 点击重置按钮，重置登录表单
        resetLoginForm() {
            // console.log(this);
            // 通过引用取到实例对象 调用实例对象方法重置登录表单
            this.$refs.loginFormRef.resetFields();
        },
        // 点击登录按钮 对整个表单进行预验证
        login() {
            this.$refs.loginFormRef.validate(async valid => {
                // valid 是 bool 代表表单有无通过验证
                // console.log(valid);
                if (!valid) return;
                // 由于axios返回的对象只有data才是服务端返回的数据 我们需要将data解构出来 重命名为res
                // this.loginForm 是用户输入的值 双向绑定的 我们直接拿来判断就好
                const { data: res } = await this.$http.post('login', this.loginForm);
                if(res.meta.status !== 200) return this.$message.error('登录失败！');
                this.$message.success('登录成功！');
                // 1. 将登录成功之后的 token，保存到客户端的 sessionStorage 中
                //   1.1 项目中出了登录之外的其他API接口，必须在登录之后才能访问
                //   1.2 token 只应在当前网站打开期间生效，所以将 token 保存在 sessionStorage(会话期间存储机制)中 而不是localStorage(持久化的存储机制)
                window.sessionStorage.setItem('token',res.data.token);
                // 2. 通过编程式导航跳转到后台主页，路由地址是 /home
                this.$router.push('/home');
            });
        }
    }
}
</script>

<style lang="less" scoped>
/*  scoped代表区域 加上表示这个样式只能此组件生效
    不加scoped代表全局生效 建议加上 */
.login_container {
    background-color: #2b4b6b;
    height: 100%;
}

.login_box {
    height: 300px;
    width: 540px;
    background-color: #fff;
    border-radius: 3px;
    // 居中显示 用margin只能水平居中
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    .avatar_box {
        width: 130px;
        height: 130px;
        border: 1px solid #eee;
        border-radius: 50%;
        padding: 10px;
        position: absolute;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #fff;
        // 阴影水平偏移量其值(负值时，阴影在对象的左边) 阴影的垂直偏移量(负值时，阴影在对象的顶部)  阴影模糊半径 阴影扩展半径
        box-shadow: 0 0 10px #ddd;

        img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background-color: #eee;
        }
    }
}

.login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
}

.btns {
    display: flex;
    // 居右对齐
    justify-content: flex-end;
}
</style>
