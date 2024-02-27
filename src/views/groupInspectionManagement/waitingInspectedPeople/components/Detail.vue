<template>
  <div>
    <el-row :gutter="8">
      <el-col :span="5">
        <el-card>
          <template #header> {{ taskName }} </template>
          <div class="mb-[5px]"><el-input v-model="searchKey" placeholder="请输入分组名称搜索" clearable /></div>
          <div class="left-card">
            <el-tree
              v-loading="treeLoading"
              ref="treeRef"
              class="unit-tree"
              :data="treeData"
              node-key="id"
              default-expand-all
              :props="{ label: 'groupName'}"
              :filter-node-method="filterNode"
              :expand-on-click-node="false"
              @node-click="handleNodeClick"
            />
          </div>
        </el-card>
      </el-col>
      <el-col :span="19">
        <div>
          <el-card class="mb-[10px]">
            <div class="flex items-center justify-between">
              <div>{{ currentClickNode?.groupName }}</div>
              <div><el-button type="primary" @click="$router.back()">返回</el-button></div>
            </div>
          </el-card>
          <div class="waiting-right-detail">
            <el-card class="mb-[8px]">
              <template #header>
                <div class="flex justify-between">
                  <div>套餐名称</div>
                  <div>
                    <el-button link class="mr-2" @click="packageListShow = !packageListShow" :icon="packageListShow ? ArrowUpBold : ArrowDownBold" />
                  </div>
                </div>
              </template>
              <el-collapse-transition>
                <div v-if="packageListShow">
                  <ProTable
                    v-show="packageListShow"
                    ref="packageProTableRef"
                    :columns="tableColumns"
                    :toolButton="false"
                    :data="packageTableDataSource"
                    label-position="right"
                    :searchCol="4"
                    :highlight-current-row="true"
                    row-key="id"
                    :pagination="false"
                    :dataCallback="dataCallback"
                  >
                  </ProTable>
                  <SearchForm v-show="packageListShow" ref="deptFormRef" :search-param="searchParam" :columns="packageFormColumn" :searchCol="4">
                  </SearchForm>
                </div>
              </el-collapse-transition>
            </el-card>

            <el-card>
              <template #header> 待检用户 </template>
              <ProTable
                ref="userProTableRef"
                :columns="tableColumnsWaitingUser"
                :toolButton="false"
                label-position="right"
                :searchCol="4"
                :data="waitingUserTableDataSource"
                :highlight-current-row="true"
                row-key="id"
                :dataCallback="dataCallback"
                :pagination="false"
              >
                <template #tableHeader="scope">
                  <el-button type="primary" :disabled="!scope.isSelected" @click="batchChangeGroup(scope.selectedListIds)">批量换组 </el-button>
                </template>
              </ProTable>
            </el-card>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 人员换组 -->
    <el-dialog v-model="showDialog" title="人员换组" width="35%" :before-close="handleClose">
      <SearchForm
        ref="peopleFormRef"
        :search-param="formValue"
        :columns="groupColumn"
        :searchCol="1"
        :rules="groupRules"
        style="background: transparent; padding: 18px 30px;"
      >
        <template #taskName>
          <el-input v-model="formValue.taskName" placeholder="请输入任务名称" :disabled="true" />
        </template>
        <template #groupName>
          <el-select v-model="formValue.groupName" placeholder="请选择分组名称" filterable clearable>
            <el-option v-for="item in groupNameList" :key="item.id" :label="item.groupName" :value="item.id" />
          </el-select>
        </template>
      </SearchForm>
      <template #footer>
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script setup name="projectCompletionStatusDetail" lang="tsx">
import {ref} from 'vue'
import { registerPage } from '@/api/groupInspectionManagement/freezeAndUnfreeze/index'
import { teamGroupList, teamGroupItem, batchSwitchGroup} from '@/api/groupInspectionManagement/waitingInspectedPeople/index'
import { tableColumnsWaitingUserBasic, changGroupColumnsBasic, packageColumnsBasic, packageFormColumnBasic } from './data'
import { useRoute } from 'vue-router'
import { ArrowUpBold, ArrowDownBold } from "@element-plus/icons-vue";

interface Tree {
  [key: string]: any;
}

const route = useRoute()
const { teamId, taskName, taskId } = route?.query as any

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { sys_user_sex } = toRefs<any>(proxy?.useDict('sys_user_sex'))

const treeRef = ref<any>()
const packageProTableRef = ref<any>()
const userProTableRef = ref<any>()
const peopleFormRef = ref<any>()

const treeLoading = ref<boolean>(false)
const searchKey = ref<any>('') //搜索关键词
const treeData = ref<any>([])

const formValue = ref<any>({})
const showDialog = ref<boolean>(false)
const groupNameList = ref<any>([])
const packageListShow = ref<any>(true)

const currentClickNode = ref<any>({}) //当前选中节点
const selectIds = ref<any>([]) //待检用户选中ID

const packageTableDataSource = ref<any>([]) //套餐表格数据
const waitingUserTableDataSource = ref<any>([]) //待检用户表格数据
const groupColumn = ref<any>(changGroupColumnsBasic) //人员换组弹框
const tableColumns = ref<any>(packageColumnsBasic) //套餐列表
const tableColumnsWaitingUser = ref<any>(tableColumnsWaitingUserBasic(sys_user_sex)) //待检用户列表
const packageFormColumn = reactive<any>(packageFormColumnBasic) //套餐折扣计算

//套餐 - 原总额-总折扣-应收金额
const searchParam = ref<any>({
  standardPrice: 0,
  projectDiscount: 100,
  actualPrice: 0,
})

// 获取套餐列表
const getPackageTableList =async ()=>{
  const {rows} = await teamGroupItem({groupId:currentClickNode.value?.id})
  packageTableDataSource.value = rows
}

// 获取待检用户列表
const getWaitingUserTableList = async () =>{
  const { rows } = await registerPage({healthyCheckStatus:'0', taskId, teamId, teamGroupId:currentClickNode.value?.id})
  waitingUserTableDataSource.value = rows
}

onMounted(() =>{
  getTreeData()
})

const getTreeData = async () =>{
  const { rows } = await teamGroupList({teamId, taskId})
  treeData.value = rows;
  currentClickNode.value = rows?.[0]
  nextTick(async() =>{
    await treeRef.value?.setCurrentKey(rows?.[0]?.id);
    getPackageTableList()
    getWaitingUserTableList()
  })
}

// 批量换组
const batchChangeGroup = async (ids:any)=> {
  selectIds.value = ids
  showDialog.value = true
  formValue.value.groupName = currentClickNode.value?.id
  peopleFormRef.value?.resetFields()
  formValue.value.taskName = taskName
  const { rows } = await teamGroupList({teamId, taskId})
  groupNameList.value = rows
}

// 批量换组关闭
const handleClose = () => {
  showDialog.value = false
}

// 批量换组提交
const handleSubmit = async () => {
  await batchSwitchGroup({id: selectIds.value, groupId: formValue.value.groupName})
  ElMessage.success('批量换组成功')
  showDialog.value = false
  await getWaitingUserTableList()
  userProTableRef.value!.clearSelection()
  selectIds.value = []
 }

const handleNodeClick = (node:any)=>{
  currentClickNode.value = node
  getPackageTableList()
  getWaitingUserTableList()
  nextTick(() => {
    userProTableRef.value!.clearSelection()
  })
}

watch(searchKey, (val) => {
  treeRef.value?.filter(val);
});

// 计算总金额总折扣
watchEffect(() =>{
  searchParam.value.standardPrice = packageTableDataSource.value?.reduce((sum:any,b:any)=>sum + Number(b.standardPrice),0).toFixed(2)
  searchParam.value.actualPrice = packageTableDataSource.value?.reduce((sum:any,b:any)=>sum + Number(b.actualPrice),0).toFixed(2)
  if(searchParam.value.standardPrice !== "0.00"){
    searchParam.value.projectDiscount = ((searchParam.value.actualPrice/searchParam.value.standardPrice).toFixed(2))*100
  }else{
    searchParam.value.projectDiscount = 100
  }
})

const filterNode = (value: string, data: Tree) => {
  if (!value) return true;
  return data.groupName.includes(value);
};

const groupRules = ref<any>({
  taskName: { required: true, message: '请选择任务名称', trigger: ['blur', 'change'] },
  groupName: { required: true, message: '请选择分组名称', trigger: ['blur', 'change'] },
})

const dataCallback = (data: any) => {
  return {
    list: data.rows,
    total: data.total,
  };
};
</script>
<style lang="scss" scoped>
.left-card {
  height: calc(100vh - 213px);
  overflow: auto;
}
.waiting-right-detail{
  height: calc(100vh - 173px);
  overflow: auto;
}

::v-deep(.unit-tree .el-tree-node.is-current>.el-tree-node__content){
    color:#2879FF !important;
    background: #f0f1f3 !important;
    border-radius: 2px;
}
</style>
