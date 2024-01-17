<template>
  <div class="p-2">
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
          <ProTable ref="proTableRef" :columns="columns" :request-api="getTableList" :toolButton="false" rowKey="id">
            <template #tableHeader="scope">
              <el-button class="mb-[10px]" :disabled="!scope.isSelected" type="primary" round v-if="activeTab===0">冻结</el-button>
              <el-button class="mb-[10px]" :disabled="!scope.isSelected" type="primary" round v-if="activeTab===1">解冻</el-button>
            </template>
            <template #f1="scope">
              <span class="text-[#5a9cf8] cursor-pointer">{{ scope.row.f1 }}</span>
            </template>
          </ProTable>
        </el-card>
      </div>
    </transition>
  </div>
</template>
<script lang="ts" setup name="freezeAndThaw">
import { getCurrentInstance, ComponentInternalInstance, ref } from 'vue';
import { basicInfoColumnBasic,columnsBasic } from './data';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const basicInfoColumn = ref<any>(basicInfoColumnBasic)
const basicSearchFormRef = ref()
const proTableRef = ref<any>()

const activeTab = ref<any>(0)
const tabList = markRaw<any>([
  { label: '未冻结', key: 0 },
  { label: '冻结', key: 1 },
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


// 切换tab
const handleClickTab = (tab:any)=>{
  activeTab.value = tab.key
  proTableRef.value!.clearSelection()
}

const getTableList = () =>{
  return {
    data:{
      list:[
      {
        f1:'123456',
        f2:'F100001',
        f3:'42090902002020',
        f4:'团检',
        f5:'职业病体检',
        f6:'张小刚',
        f7:'已婚',
        f8:'24'
      }
    ],
    total:0,
    pageNum:1,
    pageSize:10
  }
  }
}

const handleSearch = () => {
  queryParams.value.pageNum = 1;
  console.log(queryParams.value,'查询')
}
const handleReset = () => {
  queryParams.value.pageNum = 1;
  basicSearchFormRef.value?.resetFields()
}
</script>

<style lang="scss" scoped>
.active-tab-btn {
  height: 30px;
  border-radius: 93px;
  background: #F1F5FB;
  color: #2879FF;
}
</style>
