<template>
  <div>
    <el-row :gutter="8">
      <el-col :span="5">
        <el-card>
          <template #header> {{ teamName }} </template>
          <div class="mt-[10px] left-card">
            <el-tree
              v-loading="treeLoading"
              ref="treeRef"
              class="unit-tree"
              :data="treeData"
              node-key="name"
              default-expand-all
              :props="{ label: 'name'}"
              @node-click="handleNodeClick"
            />
          </div>
        </el-card>
      </el-col>
      <el-col :span="19">
        <div>
          <el-card class="mb-[10px]">
            <div class="flex justify-between">
              <div>{{ currentClickNode.name }}</div>
              <div><el-button type="primary" @click="$router.back()">返回</el-button></div>
            </div>
          </el-card>
          <div class="waiting-right-detail">
            <el-card class="mb-[8px]">
              <template #header> 套餐名称： </template>
              <ProTable
                ref="packageProTableRef"
                :columns="tableColumns"
                :toolButton="false"
                :request-api="getPackageTableList"
                label-position="right"
                :searchCol="4"
                :highlight-current-row="true"
                row-key="id"
                :dataCallback="dataCallback"
              >
              </ProTable>

              <SearchForm ref="deptFormRef" :search-param="searchParam" :columns="departColumn" :searchCol="4"> </SearchForm>
            </el-card>

            <el-card>
              <template #header> 待检用户： </template>
              <ProTable
                :columns="tableColumnsWaitingUser"
                :toolButton="false"
                label-position="right"
                :searchCol="4"
                :request-api="getWaitingUserTableList"
                :highlight-current-row="true"
                row-key="id"
                :dataCallback="dataCallback"
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
  </div>
</template>
<script setup name="projectCompletionStatusDetail" lang="tsx">
import {ref} from 'vue'
import { registerPage } from '@/api/groupInspectionManagement/freezeAndUnfreeze/index'
import { teamGroupList,teamGroupItem, teamSettleWaitTaskGroupTree} from '@/api/groupInspectionManagement/waitingInspectedPeople/index'
import { tableColumnsWaitingUserBasic } from './data'
import { useRoute } from 'vue-router'

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const treeLoading = ref<boolean>(false)
const route = useRoute()
const treeRef = ref<any>()
const packageProTableRef = ref<any>()

const { teamId, teamName } = route?.query as any

const tableColumnsWaitingUser = ref<any>(tableColumnsWaitingUserBasic)
const currentClickNode = ref<any>({}) //当前选中节点

// 获取待检用户列表
const getWaitingUserTableList = async (params: any) =>{
  const data = await registerPage({...params,healthyCheckStatus:'0'})
  return { data }
}
// 获取套餐列表
const getPackageTableList =async ()=>{
  const data = await teamGroupItem({groupId:currentClickNode.value?.id})
  console.log(data,'==data')
  return {data}
}

const searchParam = ref<any>({
  f1: '10',
  f2: '12',
  f3: '13',
})
const departColumn = reactive<any>([
  {
    prop: 'f1',
    label: '原总额',
    search: { el: 'input',props: { disabled:true } }
  },
  {
    prop: 'f2',
    label: '总折扣',
    search: { el: 'input',props: { disabled:true } }
  },
  {
    prop: 'f3',
    label: '应收金额',
    search: { el: 'input',props: { disabled:true } }
  },
])


const treeData = ref<any>([])

onMounted(() =>{
  getTreeData()
})

const getTreeData =async () =>{
  const { data } = await teamSettleWaitTaskGroupTree(teamId)
  treeData.value = data
  currentClickNode.value = data?.[0]
  nextTick(() =>{
    treeRef.value?.setCurrentKey(data?.[0]?.name);
  })
}

// 批量换组
const batchChangeGroup = (ids:any)=> {
  console.log(ids,'====ids')
}

const handleNodeClick = (node:any)=>{
 console.log(node,'===node')
 currentClickNode.value = node
 console.log(packageProTableRef.value,'====packageProTableRef')
 packageProTableRef.value.getTableList()
}

const tableColumns = ref([
  { prop: 'itemName', label: '项目名称' },
  { prop: 'standardPrice', label: '原金额' },
  { prop: 'discount', label: '折扣'},
  { prop: 'actualPrice', label: '应收额' },
])

const dataCallback = (data: any) => {
  return {
    list: data.rows,
    total: data.total,
  };
};
</script>
<style lang="scss" scoped>
.left-card {
  height: calc(100vh - 190px);
  overflow: auto;
}
.waiting-right-detail{
  height: calc(100vh - 179px);
  overflow: auto;
}

::v-deep(.unit-tree .el-tree-node.is-current>.el-tree-node__content){
    color:#2879FF !important
}
</style>
