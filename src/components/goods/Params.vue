<template>
<div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
        <!-- 警告区域 -->
        <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" :closable="false" show-icon> </el-alert>

        <!-- 选择商品分类区域 -->
        <el-row class="cat_opt">
            <el-col>
                <span>选择商品分类：</span>
                <!-- 选择商品分类的级联选择框 -->
                <el-cascader v-model="selectedCateKeys" :options="catelist" :props="cateProps" @change="handleChange"></el-cascader>
            </el-col>
        </el-row>

        <!-- tab 标签页 -->
        <el-tabs v-model="activeName" @tab-click="handleTabClick">
            <!-- 添加动态参数的面板 -->
            <el-tab-pane label="动态参数" name="many">
                <!-- 添加参数按钮 -->
                <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible=true">添加参数</el-button>
                <!-- 动态参数表格 -->
                <el-table :data="manyTableData" border>
                    <!-- 展开列 -->
                    <el-table-column type="expand">
                        <template slot-scope="scope">
                            <!-- 循环渲染tag标签 -->
                            <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable @close="handleClosed(i,scope.row)">{{item}}</el-tag>
                            <!-- 输入的文本框 -->
                            <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
                            </el-input>
                            <!-- 添加按钮 -->
                            <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                        </template>
                    </el-table-column>

                    <!-- 索引列 -->
                    <el-table-column type="index"></el-table-column>
                    <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                            <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeParams(scope.row.attr_id)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>

            <!-- 添加静态属性的面板 -->
            <el-tab-pane label="静态属性" name="only">
                <!-- 添加属性按钮 -->
                <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible=true">添加属性</el-button>
                <!-- 静态属性表格 -->
                <el-table :data="onlyTableData" border>
                    <!-- 展开列 -->
                    <el-table-column type="expand">
                        <template slot-scope="scope">
                            <!-- 循环渲染tag标签 -->
                            <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable @close="handleClosed(i,scope.row)">{{item}}</el-tag>
                            <!-- 输入的文本框 -->
                            <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
                            </el-input>
                            <!-- 添加按钮 -->
                            <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                        </template>
                    </el-table-column>

                    <!-- 索引列 -->
                    <el-table-column type="index"></el-table-column>
                    <el-table-column label="属性名称" prop="attr_name"></el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                            <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeParams(scope.row.attr_id)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
        </el-tabs>
    </el-card>

    <!-- 添加 参数/属性 对话框 两个tab页签公用一个 -->
    <el-dialog :title="'添加'+titleText" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
        <!-- 验证表单 -->
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
            <el-form-item :label="titleText" prop="attr_name">
                <el-input v-model="addForm.attr_name"></el-input>
            </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addParams">确 定</el-button>
        </span>
    </el-dialog>

    <!-- 修改 参数/属性 对话框 -->
    <el-dialog :title="'修改'+titleText" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
        <!-- 验证表单 -->
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
            <el-form-item :label="titleText" prop="attr_name">
                <el-input v-model="editForm.attr_name"></el-input>
            </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editParams">确 定</el-button>
        </span>
    </el-dialog>
</div>
</template>

<script>
export default {
    data() {
        return {
            // 商品分类列表
            catelist: [],
            // 级联选择框的配置对象
            cateProps: {
                expandTrigger: 'hover',
                value: 'cat_id',
                label: 'cat_name',
                children: 'children'
            },
            // 级联选择框双向绑定到的数组
            selectedCateKeys: [],
            // 被激活的页签的名称 默认选中动态参数
            activeName: 'many',
            // 动态参数的数据
            manyTableData: [],
            // 静态属性的数据
            onlyTableData: [],
            // 控制添加对话框的显示隐藏
            addDialogVisible: false,
            // 添加参数的表单数据对象
            addForm: {
                attr_name: ''
            },
            // 添加表单的验证规则对象
            addFormRules: {
                attr_name: [{
                    required: true,
                    message: '请输入参数名称',
                    trigger: 'blur'
                }]
            },
            // 控制修改对话框的显示隐藏
            editDialogVisible: false,
            // 修改参数的表单数据对象
            editForm: {},
            // 修改表单的验证规则对象
            editFormRules: {
                attr_name: [{
                    required: true,
                    message: '请输入参数名称',
                    trigger: 'blur'
                }]
            },
            // 问题：每个标签行公用一个 这是不行滴 我们想让每个标签行单独使用自己的 添加按钮和文本框
            // 控制tag标签中 文本框与添加按钮的显示/隐藏 默认隐藏文本框
            // inputVisible:false,
            // 文本框中输入的值
            // inputValue:''
        }
    },
    created() {
        this.getCateList()
    },
    methods: {
        // 获取所有的商品分类列表
        async getCateList() {
            const {
                data: res
            } = await this.$http.get('categories')
            if (res.meta.status !== 200) return this.$message.error('获取商品分类失败')

            this.catelist = res.data
            // console.log(this.catelist);
        },
        // 级联选择框选中项变化，会触发这个函数
        async handleChange() {
            this.getParamsData()
        },
        // tab 页签点击事件的处理函数
        handleTabClick() {
            // console.log(this.activeName);
            this.getParamsData()
        },
        // 获取参数的列表数据
        async getParamsData() {
            // 证明选中的不是三级分类
            if (this.selectedCateKeys.length !== 3) {
                this.selectedCateKeys = []
                // 不是三级分类 需要清空原先的动态参数和静态属性数据
                this.manyTableData = []
                this.onlyTableData = []
                return
            }

            // 证明选中的是三级分类 我们只让选择3级分类
            // console.log(this.selectedCateKeys);
            // 根据所选分类的Id，和当前所处的面板，获取对应的参数
            const {
                data: res
            } = await this.$http.get(`categories/${this.cateId}/attributes`, {
                params: {
                    sel: this.activeName
                }
            })

            if (res.meta.status !== 200) return this.$message.error('获取参数列表失败！')

            // 展开行的每一个标签都是res.data.attr_vals数据 所以我们获取参数列表数据时需要将 所有attr_vals 分割为数组
            // res.data返回的是个数组 而res.data.attr_vals是以空格区分的字符串
            res.data.forEach(item => {
                // 将字符串以 空格分割为数组 如果attr_vals为空返回空数组 不为空切割为数组
                item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []

                // 给每个标签行单独添加自己的 添加按钮和文本框
                // 控制tag标签中 文本框与添加按钮的显示/隐藏 默认隐藏文本框
                item.inputVisible = false
                // 文本框中输入的值
                item.inputValue = ''
            })
            console.log(res.data);

            // 分别挂载到不同的页签
            if (this.activeName === 'many') {
                this.manyTableData = res.data
            } else {
                this.onlyTableData = res.data
            }
        },
        // 监听添加对话框关闭事件
        addDialogClosed() {
            this.$refs.addFormRef.resetFields()
        },
        // 点击按钮，添加参数
        addParams() {
            // 对表单预验证
            this.$refs.addFormRef.validate(async valid => {
                if (!valid) return
                // 预验证通过
                const {
                    data: res
                } = await this.$http.post(`categories/${this.cateId}/attributes`, {
                    // 用户输入的分类名称
                    attr_name: this.addForm.attr_name,
                    // 区分是哪个页签
                    attr_sel: this.activeName
                })

                if (res.meta.status !== 201) return this.$message.error('添加参数失败！')

                this.$message.success('添加参数成功')
                this.addDialogVisible = false;
                this.getParamsData()
            })
        },
        // 关闭修改对话框 重置表单属性
        editDialogClosed() {
            this.$refs.editFormRef.resetFields()
        },
        // 点击按钮，展示修改的对话框
        async showEditDialog(attr_id) {
            // 查询当前参数的信息
            const {
                data: res
            } = await this.$http.get(`categories/${this.cateId}/attributes/${attr_id}`, {
                params: {
                    attr_sel: this.activeName
                }
            })
            if (res.meta.status !== 200) return this.$message.error('获取参数信息失败！')

            this.editForm = res.data
            this.editDialogVisible = true
        },
        // 点击按钮，修改参数信息
        editParams() {
            // 对表单预验证
            this.$refs.editFormRef.validate(async valid => {
                if (!valid) return

                // 通过 发送修改请求
                const {
                    data: res
                } = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`, {
                    attr_name: this.editForm.attr_name,
                    attr_sel: this.activeName
                })

                if (res.meta.status !== 200) {
                    return this.$message.error('修改参数失败！')
                }

                this.$message.success('修改参数成功！')
                this.getParamsData()
                this.editDialogVisible = false
            })
        },
        // 根据Id删除对应的参数项
        async removeParams(attr_id) {
            const confirmResult = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => err)

            // 用户取消了删除的操作
            if (confirmResult !== 'confirm')
                return this.$message.info('已取消删除！')

            // 删除的业务逻辑
            const {
                data: res
            } = await this.$http.delete(`categories/${this.cateId}/attributes/${attr_id}`)
            if (res.meta.status != 200) return this.$message.error('删除参数失败！')

            this.$message.success('删除参数成功！')
            this.getParamsData()
        },
        // 文本框失去焦点，或摁下了 Enter 都会触发
        async handleInputConfirm(row) {
            // 如果用户没有输入内容 失去焦点时清空文本框
            if (row.inputValue.trim().length === 0) {
                row.inputValue = ''
                row.inputVisible = false
                return
            }
            // 用户输入了值 需要保存数据 渲染到页面
            row.attr_vals.push(row.inputValue)
            row.inputValue = ''
            row.inputVisible = false

            // 发起请求，保存这次操作到数据库
            this.saveAttrVals(row)
        },
        // 将对 attr_vals 的操作，保存到数据库
        async saveAttrVals(row) {
            const {
                data: res
            } = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
                attr_name: row.attr_name,
                attr_sel: row.attr_sel,
                // 由于只是将标签页保存到数据库 所以只需要变化attr_vals(服务器存储的是字符串 我们现在保存的是数组形式)
                // 将数组以 空格分割为字符串
                attr_vals: row.attr_vals.join(' ')
            })

            if (res.meta.status !== 200) return this.$message.error('修改参数项失败！')

            this.$message.success('修改参数项成功！')
        },
        // 点击按钮，展示文本输入框
        showInput(row) {
            row.inputVisible = true

            // 文本框自动获得焦点
            // $nextTick 方法的作用，就是当页面上元素被重新渲染之后，才会执行回调函数中的代码
            // 将布尔值重置为true时 页面上的元素没有被重新渲染 页面还是展示button按钮 必须等待回调函数调用(表示页面被重新渲染)
            // 必须先渲染出对应的input对象 再获取加载input对象 这样才不会报错
            this.$nextTick(_ => {
                // 取到元素input对象 获得焦点
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        // 删除对应的参数可选项
        handleClosed(index, row) {
            // index 从数组中删除对应索引 因为前端展示直接通过数组展示的 所以展示需要从数组删除对应索引
            // row 无论是获取数组还是存储到数据库 都需要用到
            row.attr_vals.splice(index, 1)
            // 将此次操作保存到数据库
            this.saveAttrVals(row)
        }
    },
    computed: {
        // 如果按钮需要被禁用，则返回true，否则返回false
        isBtnDisabled() {
            // 选中了3级级联 解除按钮选中状态
            if (this.selectedCateKeys.length !== 3)
                return true
            return false
        },
        // 当前选中的三级分类的Id
        cateId() {
            // 将选中的分类的最后一项(3级)的id返回
            if (this.selectedCateKeys.length === 3)
                return this.selectedCateKeys[2]
            return null;
        },
        // 动态计算添加对话框标题的文本
        titleText() {
            if (this.activeName === 'many')
                return '动态参数'
            return '静态属性'
        }
    }
}
</script>

<style lang="less" scoped>
.cat_opt {
    margin: 15px 0;
}

.el-tag {
    margin: 10px;
}

.input-new-tag {
    width: 120px;
}
</style>>
