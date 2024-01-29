<template>
  <div>
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div class="mb-[10px]">
        <el-card shadow="hover">
          <SearchForm
            ref="basicSearchFormRef"
            :search-param="queryParams"
            :columns="basicInfoColumn"
            :searchCol="4"
            :show-action-group="true"
            :search="handleSearch"
            :reset="handleReset"
          >
          </SearchForm>
          <el-divider class="!mt-[-10px]" />
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
        </el-card>
      </div>
    </transition>
  </div>
</template>
<script lang="ts" setup name="groupInspectionManagementFreezeAndThaw">
import { getCurrentInstance, ComponentInternalInstance, ref } from 'vue';
import { basicInfoColumnBasic,columnsBasic } from './data';
import {registerUnfreeze,registerFreeze,registerPage} from '@/api/groupInspectionManagement/freezeAndUnfreeze/index'
import { teamInfoList, teamTaskList } from "@/api/groupInspection/inspectionclosing";

const teamIdList = ref<any>([]) //单位列表
const teamTaskLists = ref<any>([]) //任务列表

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const basicSearchFormRef = ref()
const proTableRef = ref<any>()

const {bus_healthy_check_status,sys_user_sex}  =toRefs<any>(proxy?.useDict('bus_healthy_check_status','sys_user_sex'))
const basicInfoColumn = ref<any>(basicInfoColumnBasic(bus_healthy_check_status,sys_user_sex,teamIdList,teamTaskLists))

const activeTab = ref<any>('1')
const tabList = markRaw<any>([
  { label: '未冻结', key: '1' },
  { label: '冻结', key: '0' },
])

const columns = reactive<any>(columnsBasic);

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
};
const queryParams = ref<any>(initFormData);

// 获取单位-任务接口
const getteamIdList = async () => {
    const { data } = await teamInfoList({})
    const { rows } = await teamTaskList({ pageSize: -1 })
    teamIdList.value = proxy?.handleTree<any>(data)
    teamTaskLists.value = rows
}
getteamIdList()

// 切换tab
const handleClickTab = (tab:any)=>{
  activeTab.value = tab.key
  proTableRef.value?.getTableList()
  proTableRef.value!.clearSelection()
}

const getTableList = async () =>{
  const [registerTimeStart,registerTimeEnd] = queryParams.value?.registerTime || []
  const data = await registerPage({freezeStatus: activeTab.value,...queryParams.value,registerTime:undefined,registerTimeStart,registerTimeEnd})
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
}

// 冻结
const handleFreeze =async (ids:any) => {
  await registerFreeze(ids)
  ElMessage.success('冻结成功')
  nextTick(() =>{
    proTableRef.value?.getTableList()
    proTableRef.value?.clearSelection()
  })
}
// 解冻
const handleUnfreeze =async (ids:any)=>{
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
</style>
