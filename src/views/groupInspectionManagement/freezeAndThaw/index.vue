<template>
  <div>
    <div class="mb-[10px] card table-main" style="padding-bottom: 0px;">
      <SearchForm
        ref="basicSearchFormRef"
        :search-param="queryParams"
        :columns="basicInfoColumn"
        :searchCol="4"
        :show-action-group="true"
        :search="handleSearch"
        :reset="handleReset"
        class="form-search-freeze"
      >
        <template #teamId>
          <el-tree-select
            v-model="queryParams.teamId"
            :data="teamIdList"
            check-strictly
            :props="{label:'teamName', value:'id' }"
            filterable
            clearable
            default-expand-all
            placeholder="请选择单位"
            @change="handleChange"
          />
        </template>
      </SearchForm>
    </div>
    <div class="card table-main">
      <div class="flex items-center mb-[10px]">
        <div
          v-for="(item,index) in tabList"
          :key="index"
          :class="[item.key===activeTab?'active-tab-btn':'','cursor-pointer py-[4px] px-[10px]']"
          @click="handleClickTab(item)"
        >
          {{ item.label }}
        </div>
      </div>
      <ProTable ref="proTableRef" :columns="columns" :request-api="getTableList" :toolButton="false" rowKey="id" :dataCallback="dataCallback">
        <template #tableHeader="scope">
          <el-button
            class="mb-[10px]"
            :disabled="!scope.isSelected"
            type="primary"
            round
            v-if="activeTab==='1'"
            @click="handleFreeze(scope.selectedListIds)"
          >
            冻结
          </el-button>
          <el-button
            class="mb-[10px]"
            :disabled="!scope.isSelected"
            type="primary"
            round
            v-if="activeTab==='0'"
            @click="handleUnfreeze(scope.selectedListIds)"
            >解冻</el-button
          >
        </template>
        <template #healthyCheckCode="scope">
          <span class="text-[#5a9cf8] cursor-pointer">{{ scope.row.healthyCheckCode }}</span>
        </template>
      </ProTable>
    </div>
  </div>
</template>
<script lang="ts" setup name="groupInspectionManagementFreezeAndThaw">
import { getCurrentInstance, ComponentInternalInstance, ref } from 'vue';
import { basicInfoColumnBasic,columnsBasic } from './data';
import {registerUnfreeze,registerFreeze,registerPage} from '@/api/groupInspectionManagement/freezeAndUnfreeze/index'
import { teamInfoList, teamTaskList } from "@/api/groupInspection/inspectionclosing";
import moment from 'moment'

const teamIdList = ref<any>([]) //单位列表
const teamTaskLists = ref<any>([]) //任务列表

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const basicSearchFormRef = ref()
const proTableRef = ref<any>()

const {bus_healthy_check_status, sys_user_sex, bus_physical_type, bus_personnel_marriage_status, bus_cost_type, bus_category}  =toRefs<any>(proxy?.useDict('bus_healthy_check_status','sys_user_sex','bus_physical_type','bus_personnel_marriage_status','bus_cost_type','bus_category'))
// const basicInfoColumn = ref<any>(basicInfoColumnBasic(bus_healthy_check_status,sys_user_sex,teamIdList,teamTaskLists))
const basicInfoColumn = ref<any>(basicInfoColumnBasic(bus_healthy_check_status,sys_user_sex,teamIdList,[]))

const activeTab = ref<any>('1')
const tabList = markRaw<any>([
  { label: '未冻结', key: '1' },
  { label: '冻结', key: '0' },
])

const columns = reactive<any>(columnsBasic(bus_healthy_check_status, bus_physical_type, bus_personnel_marriage_status, bus_cost_type, bus_category));

const initFormData = {
  pageNum: 1,
  pageSize: 10,
  unit: '',
  task: '',
  peCode: '',
  reportDate: '',
  peStatus: '',
  name: '',
  gender: '',
  idCard: '',
  registerTime: [moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')]
};
const queryParams = ref<any>(initFormData);

// 获取单位-任务接口
const getTeamIdList = async () => {
    const { data } = await teamInfoList({})
    const { rows } = await teamTaskList({ pageSize: -1 })
    teamIdList.value = proxy?.handleTree<any>(data)
    teamTaskLists.value = rows
}
getTeamIdList()

// 单位改变
const handleChange = async (val:any) =>{
  const { rows } = await teamTaskList({teamId:val })
  teamTaskLists.value = rows
  basicInfoColumn.value = basicInfoColumnBasic(bus_healthy_check_status,sys_user_sex,teamIdList,teamTaskLists)
  queryParams.value.taskId = null
}

// 切换tab
const handleClickTab = (tab:any)=>{
  activeTab.value = tab.key
  proTableRef.value?.getTableList()
  proTableRef.value!.clearSelection()
}

const getTableList = async (params: any) =>{
  const [registerTimeStart,registerTimeEnd] = queryParams.value?.registerTime || []
  const data = await registerPage({freezeStatus: activeTab.value,...queryParams.value,registerTime:undefined,registerTimeStart,registerTimeEnd,...params,})
  return {data}
}

const handleSearch = () => {
  queryParams.value.pageNum = 1;
  proTableRef.value?.getTableList()
}

const handleReset = () => {
  queryParams.value.pageNum = 1;
  basicSearchFormRef.value?.resetFields()
  proTableRef.value?.getTableList()
  teamTaskLists.value = []
}

// 冻结
const handleFreeze =async (ids:any) => {
  await proxy?.$modal.confirm('是否冻结所选数据？','操作确认');
  await registerFreeze(ids)
  ElMessage.success('冻结成功')
  nextTick(() =>{
    proTableRef.value?.getTableList()
    proTableRef.value?.clearSelection()
  })
}
// 解冻
const handleUnfreeze =async (ids:any)=>{
  await proxy?.$modal.confirm('是否解冻所选数据？','操作确认');
  await registerUnfreeze(ids)
  ElMessage.success('解冻成功')
  nextTick(() =>{
    proTableRef.value?.getTableList()
    proTableRef.value?.clearSelection()
  })
}

const dataCallback = (data: any) => {
  return {
    list: data.rows,
    total: data.total,
  };
};
</script>

<style lang="scss" scoped>
.active-tab-btn {
  height: 30px;
  border-radius: 93px;
  background: #F1F5FB;
  color: #2879FF;
}
.form-search-freeze{
  padding: 0px;
  margin-bottom: 0px;
}
</style>
