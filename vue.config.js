/* 通过 vue-cli 3.0 工具生成的项目，默认隐藏了所有 webpack 的配置项
如果程序员有修改 webpack 默认配置的需求，可以在项目根目录中，按需创建 vue.config.js 这个配置文件，从
而对项目的打包发布过程做自定义的配置（具体配置参考 https://cli.vuejs.org/zh/config/#vue-config-js）。 */

module.exports = {
    /* 默认情况下，Vue项目的开发模式与发布模式，共用同一个打包的入口文件（即 src/main.js）。为了将项目
的开发过程与发布过程分离，我们可以为两种模式，各自指定打包的入口文件，即：
    1. 开发模式的入口文件为 src/main-dev.js
    2. 发布模式的入口文件为 src/main-prod.js */

    // 1. chainWebpack 通过链式编程的形式，来修改默认的 webpack 配置
    // 2. configureWebpack 通过操作对象的形式，来修改默认的 webpack 配置
    //定义chainWebpack节点 执行config处理函数
    chainWebpack: config => {
        // when()判断当前处理什么编译模式
        // 发布模式
        config.when(process.env.NODE_ENV === 'production', config => {
            // entry()得到默认的打包入口 clear()清空默认打包入口 add()新增为自己的打包入口文件
            config.entry('app').clear().add('./src/main-prod.js')

            /* 默认情况下，通过 import 语法导入的第三方依赖包，最终会被打包合并到同一个文件中，从而导致打包成功后，单文件体积过大的问题。
            可以通过 webpack 的 externals 节点，来配置并加载外部的 CDN 资源。凡是声明在externals 中的第三方依赖包，都不会被打包。 */
            config.set('externals', {
                // 打包期间 在这里找到模块 会直接去window全局查找对应的模块对象
                vue: 'Vue',
                'vue-router': 'VueRouter',
                axios: 'axios',
                lodash: '_',
                echarts: 'echarts',
                nprogress: 'NProgress',
                'vue-quill-editor': 'VueQuillEditor'
            })

            // 不同的打包环境下，首页内容可能会有所不同。我们可以通过插件的方式进行 首页内容定制
            // 找到html插件 tap()修改插件中的一些相关操作
            config.plugin('html').tap(args => {
                // args 是插件中的参数项
                // 为args 新增一个参数 isProd是自定义追加的属性 根据isProd的值决定如何渲染首页
                args[0].isProd = true
                return args
            })
        })

        // 开发模式
        config.when(process.env.NODE_ENV === 'development', config => {
            config.entry('app').clear().add('./src/main-dev.js')

            config.plugin('html').tap(args => {
                // args 是插件中的参数项
                args[0].isProd = false
                return args
            })
        })
    }
}