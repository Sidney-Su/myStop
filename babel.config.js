// 这是项目发布阶段需要用到的 babel 插件
const prodPlugins = []
// 获取编译模式 如果为产品发布模式 需要移除log输出  开发模式不需要移除
if (process.env.NODE_ENV === 'production') {
  // 这个插件用来移除console.log() 的输出  因为上线阶段是不允许有log输出的
  prodPlugins.push('transform-remove-console')
}

module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk'
      }
    ],
    // 发布产品时候的插件数组
    // ...展开运算符 将数组的每一项展开了 放入另一个数组中
    ...prodPlugins,
    // 路由懒加载开发插件
    "@babel/plugin-syntax-dynamic-import"
  ]
}
