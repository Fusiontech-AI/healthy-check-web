import { display } from 'html2canvas/dist/types/css/property-descriptors/display'; import { nonWhiteSpace } from
'html2canvas/dist/types/css/syntax/parser';
<template>
  <div>
    <el-tabs type="border-card" tab-position="left">
      <el-tab-pane :label="item.groupName" v-for="item in props.formSecond">
        <SearchForm :search-param="queryParams" :columns="basicInfoColumnZYB" :searchCol="4" :show-action-group="false"
          :rules="rulesZYB">
        </SearchForm>
        <TransferFilterComplex :tableHeader="tableHeader" @itemChange="itemChange" :isRw="true" :formValue="formValue" />
        <SearchForm :search-param="queryParams" :columns="basicInfoColumn" :searchCol="4" :show-action-group="false"
          class="mt10px">
        </SearchForm>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="tsx" name="second">
import TransferFilterComplex from '@/components/TransferFilterComplex.vue'
import { teamGroupDetail } from '@/api/groupInspectionManagement/taskManagement'
const props = defineProps(['formSecond'])
const tableHeader = ref([
  {
    prop: 'name',
    label: '项目名称'
  },
  {
    prop: 'standardAmount',
    label: '金额'
  },
  {
    prop: 'receivableAmount',
    label: '折后金额'
  },
])
const basicInfoColumn = ref([
  {
    label: '分组折扣 ',
    prop: 'itemDiscount',
    search: { el: 'input' }
  },
  {
    label: '加项折扣 ',
    prop: 'addDiscount',
    search: { el: 'input' }
  },
  {
    label: '标准价格（元）',
    prop: 'standardPrice',
    search: { el: 'input' }
  },
  {
    label: '折后价格（元）',
    prop: 'actualPrice',
    search: { el: 'input' }
  },

])
const basicInfoColumnZYB = ref([
  {
    label: '在岗类型 ',
    prop: 'dutyStatus',
    search: { el: 'select' }
  },
  {
    label: '危害因素 ',
    prop: 'groupHazardsList',
    search: { el: 'select', props: { multiple: true } }
  },
])
watch(() => props.formSecond, (newV) => {
  console.log(newV);
  getInfo(newV[0])
})
//获得需要回显的数据
const getInfo = async (row) => {
  const { id } = row
  const { data } = await teamGroupDetail({ id })
  console.log("🚀 ~ getInfo ~ data:", data)
}
const queryParams = ref({})
const formValue = reactive({})
const rulesZYB = ref(
  {
    dutyStatus: [
      { required: true, message: '请选择在岗类型', trigger: 'change' },
    ],
    groupHazardsList: [
      { required: true, message: '请选择危害因素', trigger: 'change' },
    ],
  }
)
const rules = ref({})
const itemChange = (val) => {
  const { rightTableData, queryObj } = val
}
</script>
<style scoped lang="scss">
.group-price {
  background: #F1F5FB;
  border-radius: 4px;
  display: flex;
  align-items: center;
  padding-top: 20px;
}

:deep(.el-tabs--border-card) {
  border: none;
}
</style>
