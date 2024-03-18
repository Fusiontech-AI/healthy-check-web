<template>
  <div>
    <el-button class="button" @click="handleBG" type="primary" link v-bind="$attrs">变更</el-button>
    <el-dialog v-model="dialogVisible" title="请选择变更项目" width="70%" :append-to-body="true">
      <ProTable ref="proTableRef" :columns="tableColumns" :toolButton="false" :data="dataSource" label-position="right"
        :pagination="false" height="300">
        <template #cz="{ row, $index }">
          <el-button class="button" @click="handleSelectedBG(row)" type="primary" link>变更</el-button>
        </template>
      </ProTable>
    </el-dialog>
  </div>
</template>

<script setup lang="tsx" name="changeItem">
import {
  queryOtherCompulsoryInspection
} from "@/api/peis/package";
const dialogVisible = ref(false)
const dataSource = ref([])
const tableColumns = ref([
  { prop: 'combinProjectCode', label: '项目编码', },
  { prop: 'combinProjectName', label: '项目名称', },
  { prop: 'standardAmount', label: '标准价格', },
  { prop: 'discount', label: '折扣', },
  { prop: 'cz', label: '操作', },
])
const props = defineProps({
  formValue: {
    type: Object,
    default: () => { }
  },
  row: {
    type: Object,
    default: () => { }
  },
  rightTableData: {
    type: Array,
    default: () => { }
  },
  index: {
    type: Number,
    default: () => 0
  },
  handleSelected: {
    type: Function,
    default: () => null
  },
})
const handleBG = async () => {
  dialogVisible.value = true
  const { shineSource, shineType, dutyStatus, hazardsBoList } = props.formValue
  const { combinProjectId, originId } = props.row
  const combinProjectIdList = props.rightTableData.filter(item => item.required)?.map(item => item.combinProjectId || item.originId)
  const p = {
    combinProjectId: combinProjectId || originId,
    codeList: hazardsBoList,
    dutyStatus,
    combinProjectIdList,
    shineSource,
    shineType,
  }
  const { data } = await queryOtherCompulsoryInspection(p)
  dataSource.value = data
}
const handleSelectedBG = async (row) => {
  let p = {
    sort: props.index + 1,
    payType: '1',//变更类型(0个人 1单位 2混合支付)
    payStatus: '0',//缴费状态（0：未缴费，1：已缴费，2：申请退费中，3：已退费，）
    tcFlag: '1',//是否套餐'0'是'1'否
    teamAmount: 0,//单位应收金额
    personAmount: row.standardAmount,//个人应收金额
    ...row,
    combinProjectId: row.id,
    required: true
  }

  props.rightTableData.splice(props.index, 1, p)
  props.handleSelected({}, 0, '1', '1')
}
</script>
