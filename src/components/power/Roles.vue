<template>
<div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
        <!-- 添加角色按钮区域 -->
        <el-row>
            <el-col>
                <el-button type="primary">添加角色</el-button>
            </el-col>
        </el-row>

        <!-- 角色列表区域 -->
        <el-table :data="rolesList" border stripe>
            <!-- 展开列 -->
            <el-table-column type="expand">
                <template slot-scope="scope">
                    <!-- 给所有行添加上下分割线 由于需要动态绑定 所以不能直接写字符串,写成:class="['dbbottom']" 如果是第一个索引加上上边框 -->
                    <el-row :class="['dbbottom',i1 === 0 ? 'bdtop':'', 'vcenter']," v-for="(item1,i1) in scope.row.children" :key="item1.id">
                        <!-- 渲染一级权限 -->
                        <el-col :span="5">
                            <el-tag closable @close="emoveRightById(scope.row,item1.id)">
                                {{item1.authName}}
                            </el-tag>
                            <i class="el-icon-caret-right"></i>
                        </el-col>

                        <!-- 渲染二级和三级权限 -->
                        <el-col :span="19">
                            <!-- 每个栅格内部又划分了24份 -->
                            <!-- 每个二级权限需要独占一行 添加边框线区分(由于已经有上框线了 所以第一个索引去掉上框线) -->
                            <el-row :class="[i2 === 0 ? '':'bdtop', 'vcenter']" v-for="(item2,i2) in item1.children" :key="item2.id">
                                <!-- 渲染二级权限 -->
                                <el-col :span="6">
                                    <el-tag type="success" closable @close="emoveRightById(scope.row,item2.id)">
                                        {{item2.authName}}
                                    </el-tag>
                                    <i class="el-icon-caret-right"></i>
                                </el-col>

                                <!-- 渲染三级权限 因为三级权限隶属于二级权限 并且下面没有了分支 所以不需要独占一行渲染 -->
                                <el-col :span="18">
                                    <el-tag type="warning" v-for="item3 in item2.children" :key="item3.id" closable @close="emoveRightById(scope.row,item3.id)">
                                        {{item3.authName}}
                                    </el-tag>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>

                    <!-- <pre>{{scope.row}}</pre> -->
                </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="角色名称" prop="roleName"></el-table-column>
            <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
            <el-table-column label="操作" width="300px">
                <template slot-scope="scope">
                    <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
                    <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
                    <el-button size="mini" type="warning" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">分配权限</el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-card>

    <!-- 分配权限的对话框 -->
    <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%" @close="setRightDialogClosed">
        <!-- 树形结构 :data数据源 :props树形控件的属性绑定对象 node-key每个节点选中后具体选中为id default-expand-all 是否默认展开所有节点 default-checked-keys 默认勾选的节点的 key 的数组 -->
        <el-tree :data="rightslist" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys" ref="treeRef"></el-tree>
        <span slot="footer" class="dialog-footer">
            <el-button @click="setRightDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="allotRights">确 定</el-button>
        </span>
    </el-dialog>
</div>
</template>

<script>
export default {
    data() {
        return {
            // 所有角色列表数据
            rolesList: [],
            // 控制分配权限对话框的显示与隐藏
            setRightDialogVisible:false,
            // 保存所有权限的数据
            rightslist:[],
            // 树形控件的属性绑定对象
            treeProps:{
                // 显示的名称
                label:'authName',
                // 父子节点通过哪个属性实现嵌套
                children:'children'
            },
            // 默认选中的节点Id值数组 只需要把三级权限的id存入数组 就能默认选中对应id的节点了
            defKeys: [],
            // 当前即将分配权限的角色id
            roleId:''
        }
    },
    created() {
        this.getRolesList()
    },
    methods: {
        // 获取所有角色的列表
        async getRolesList() {
            const {
                data: res
            } = await this.$http.get('roles')
            if (res.meta.status !== 200) return this.$message.error('获取角色列表失败！')

            this.rolesList = res.data;
            // console.log(this.rolesList);
        },
        // 根据Id删除对应的权限
        async emoveRightById(role, rightId) {
            // 弹框提示用户是否要删除
            const confirmResult = await this.$confirm(
                '此操作将永久删除该文件, 是否继续?',
                '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }
            ).catch(err => err)

            if (confirmResult !== 'confirm') return this.$message.info('取消了删除')

            // 需要传递要删除的角色id和权限id
            const {
                data: res
            } = await this.$http.delete(
                `roles/${role.id}/rights/${rightId}`
            )

            if (res.meta.status !== 200) return this.$message.error('删除权限失败！')

            // this.getRolesList() //会刷新整个页面 对用户体验不好
            // 直接将返回的新权限赋值给角色的children属性 这样可以局部刷新(不会刷新整个页面)
            role.children = res.data;
        },
        // 展示分配权限的对话框
        async showSetRightDialog(role) {
            // 点击分配权限按钮时 保存当前角色的id值 供后续请求时引用
            this.roleId=role.id;

            // 获取所有权限的数据 以树状形式
            const { data: res } = await this.$http.get('rights/tree')

            if(res.meta.status !== 200) return this.$message.error('获取权限数据失败！')
        
            // 把获取到的权限数据保存到 data 中
            this.rightslist=res.data;
            // console.log(this.rightslist);

            // 递归获取三级节点的Id role代表所有的一级节点
            this.getLeafKeys(role,this.defKeys)

            // 显示对话框
            this.setRightDialogVisible=true;
        },
        // 通过递归的形式，获取角色下所有三级权限的id，并保存到 defKeys 数组中
        getLeafKeys(node,arr){
            // 如果当前 node 节点不包含 children 属性，则是三级节点
            if(!node.children)
            {
                return arr.push(node.id);
            }

            // 不是三级节点 继续递归 循环node中所有数组
            // 将数组每项都执行递归
            node.children.forEach(item=>this.getLeafKeys(item,arr));
        },
        // 监听分配权限对话框的关闭事件
        setRightDialogClosed(){
            // 对话框关闭时 清空选中权限数组 防止权限累加越来越多
            this.defKeys=[];
        },
        // 点击为角色分配权限
        async allotRights(){
            // 点击确认按钮 需要获取到选中状态和未选中状态的权限id  合并为一个数组
            // getCheckedKeys() 则返回目前被选中的节点的 key 所组成的数组
            // getHalfCheckedKeys() 返回目前半选中的节点的 key 所组成的数组
            // 由于这些方法属于tree对象的 需要拿到tree对象的引用
            // 由于不确定参数个数 需要通过...展开运算符存入数组
            const keys=[
                ...this.$refs.treeRef.getCheckedKeys(),
                ...this.$refs.treeRef.getHalfCheckedKeys(),
            ]

            // console.log(keys);
            // 将数组以逗号的形式拼接成字符串
            const idStr = keys.join(',')

            // 发送请求 更改权限
            const {data:res} = await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr})

            if(res.meta.status !== 200) return this.$message.error('分配权限失败！')
            
            this.$message.success('分配权限成功！')
            // 刷新列表
            this.getRolesList()

            // 隐藏对话框
            this.setRightDialogVisible = false
        }
    }
}
</script>

<style lang="less" scoped>
.el-tag {
    margin: 7px;
}

.bdtop {
    border-top: 1px solid #eee;
}

.dbbottom {
    border-bottom: 1px solid #eee;
}

// 设定纵向对齐
.vcenter {
    display: flex;
    align-items: center;
}
</style>
