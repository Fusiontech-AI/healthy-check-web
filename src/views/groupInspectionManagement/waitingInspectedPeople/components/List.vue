<template>
  <div>
    <ProTable
      ref="proTableRef"
      :columns="tableColumns"
      :toolButton="false"
      :request-api="getTableList"
      label-position="right"
      :searchCol="4"
      :highlight-current-row="true"
      row-key="id"
      :dataCallback="dataCallback"
      :search-param="queryParams"
      :reset="handleReset"
      :requestAuto="false"
    >
      <template #teamId>
        <el-tree-select
          v-model="queryParams.teamId"
          :data="teamIdList"
          check-strictly
          :props="{label:'teamName', value:'id' }"
          filterable
          :clearable="true"
          placeholder="请选择体检单位"
          default-expand-all
          @change="handleChange"
        />
      </template>
      <template #taskId>
        <el-select v-model="queryParams.taskId" placeholder="请选择任务名称" filterable :clearable="true" @change="handleTaskChange">
          <el-option v-for="item in teamTaskLists" :key="item.id" :label="item.taskName" :value="item.id" />
        </el-select>
      </template>
      <template #teamGroupId>
        <el-select v-model="queryParams.teamGroupId" placeholder="请选择分组" filterable>
          <el-option v-for="item in searchGroupList" :key="item.id" :label="item.groupName" :value="item.id" />
        </el-select>
      </template>
      <template #taskName="scope">
        <div class="text-[#5a9cf8] cursor-pointer" @click="handleDetail( scope.row)">{{ scope.row.taskName || '--' }}</div>
      </template>
      <template #tableHeader="scope">
        <el-button type="primary" :disabled="!scope.isSelected" @click="batchChangeGroup(scope.selectedListIds, scope.selectedList)">
          批量换组
        </el-button>
      </template>
      <template #operation="scope">
        <el-button type="primary" link @click="changeGroup(scope.row)">换组</el-button>
      </template>
    </ProTable>

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
          <el-select v-model="formValue.groupName" placeholder="请选择分组名称" filterable :clearable="false">
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

<script setup name="projectCompletionStatus" lang="tsx">
import { ref } from 'vue';
import { changGroupColumnsBasic } from '../data'
import { tableColumnsBasic } from './data'
import { registerPage } from '@/api/groupInspectionManagement/freezeAndUnfreeze/index'
import { teamInfoList, teamTaskList } from "@/api/groupInspection/inspectionclosing";
import { teamGroupList, batchSwitchGroup } from '@/api/groupInspectionManagement/waitingInspectedPeople/index'

const emits = defineEmits(['goTo'])
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { bus_physical_type, sys_user_sex } = toRefs<any>(proxy?.useDict('bus_physical_type','sys_user_sex'))

const peopleFormRef = ref<any>()
const proTableRef = ref<any>()

const initParam = {
  physicalType: null,
  teamId: null,
  taskId: null
}
const searchGroupList = ref<any>([]) //搜索条件分组list
const queryParams = ref<any>(initParam); //查询条件
const showDialog = ref<boolean>(false) //人员换组
const formValue = ref<any>({}) //人员换组
const groupColumn = ref<any>(changGroupColumnsBasic) //人员换组Column

const groupRules = ref<any>({
  taskName: { required: true, message: '请选择任务名称', trigger: ['blur', 'change'] },
  groupName: { required: true, message: '请选择分组名称', trigger: ['blur', 'change'] },
})

const selectIds = ref<any>([]) //批量换组选中Id
const teamIdList = ref<any>([]) //单位列表
const teamTaskLists = ref<any>([]) //任务列表
const groupNameList = ref<any>([]) //人员换组弹框分组名称列表

onMounted(async() =>{
  initData()
})

// 初始化默认数据
const initData = async () =>{
  await getTeamIdList() //获取体检单位
  nextTick(async()=>{
    // queryParams.value.teamId = teamIdList.value?.[0]?.id //默认单位
    await handleChange(queryParams.value.teamId) //查询任务名称
    // queryParams.value.taskId = teamTaskLists.value?.[0]?.id //默认任务
    queryParams.value.taskId = null
    searchGroupList.value = []
    proTableRef.value.getTableList()
    // const { teamId, taskId } = queryParams.value
    // const {rows} = await teamGroupList({teamId,taskId}) //查询分组
    // searchGroupList.value = rows
  })
}

// 获取单位-任务接口
const getTeamIdList = async () => {
  const { data } = await teamInfoList({})
  const { rows } = await teamTaskList({ pageSize: -1 })
  teamIdList.value = proxy?.handleTree<any>(data)
  teamTaskLists.value = rows
}

const tableColumns = ref<any>(tableColumnsBasic(teamTaskLists, bus_physical_type, sys_user_sex))

// 体检单位改变-查询任务名称
const handleChange = async (val: any) =>{
  const { rows } = await teamTaskList({teamId:val }) //查询任务名称
  teamTaskLists.value = rows
  tableColumns.value = tableColumnsBasic(teamTaskLists, bus_physical_type, sys_user_sex)
  // queryParams.value.taskId = rows?.[0]?.id
  queryParams.value.taskId = null
  // handleTaskChange(queryParams.value.taskId)
  queryParams.value.teamGroupId = null
  searchGroupList.value = []
}

// 任务名称改变-查询分组
const handleTaskChange = async (taskId: any) => {
  queryParams.value.teamGroupId = null
  const { teamId } = queryParams.value
  const {rows} = await teamGroupList({teamId,taskId}) //查询分组
  searchGroupList.value = rows
}

const getTableList = async (params: any) =>{
  const data = await registerPage({...params,healthyCheckStatus:'0',...queryParams.value})
  return { data }
}

// 批量换组
const batchChangeGroup = async (selectId:any, row:any) => {
  const hasDifferentId = row?.some((item:any) => item.taskId!==row[0]?.taskId)
  if(hasDifferentId){
    return ElMessage.error('不能跨任务勾选！')
  }else{
    selectIds.value = selectId
    showDialog.value = true
    formValue.value.groupName = ''
    peopleFormRef.value?.resetFields()
    formValue.value.taskName =row[0]?.taskName
    const { teamId, taskId } = row?.[0] as any
    const {rows} = await teamGroupList({teamId,taskId})
    groupNameList.value = rows
  }
}

// 表格行换组
const changeGroup = async (row: any ) => {
  showDialog.value = true
  peopleFormRef.value?.resetFields()
  const { teamId, taskId, taskName, groupName} = row
  const { rows } = await teamGroupList({teamId, taskId}) //根据任务获取分组信息
  formValue.value.taskName = taskName
  formValue.value.groupName = groupName
  groupNameList.value = rows
  selectIds.value = [row?.id]
}

// 关闭人员换组
const handleClose = ()=> {
  showDialog.value = false
}

// 人员换组确定
const handleSubmit = async () =>{
  await batchSwitchGroup({id: selectIds.value, groupId: formValue.value.groupName})
  ElMessage.success('换组成功')
  proTableRef.value.getTableList()
  proTableRef.value?.clearSelection()
  showDialog.value = false
}

// 查看详情
const handleDetail = (row:any)=>{
  emits('goTo','Detail',{ teamId: row.teamId, taskName: row.taskName, teamGroupId: row.teamGroupId, taskId: row.taskId})
}

// 重置
const handleReset = ()=>{
  initData()
  queryParams.value.teamId = null
  queryParams.value.healthyCheckCode = null
  queryParams.value.credentialNumber = null
  queryParams.value.physicalType = null
  queryParams.value.name = null
  proTableRef.value?.clearSelection()
}

const dataCallback = (data: any) => {
  return {
    list: data.rows,
    total: data.total,
  };
};
</script>
