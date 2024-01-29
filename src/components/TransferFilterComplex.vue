<template>
  <div class="tc">
    <el-row>
      <el-col :span="10">
        <el-card shadow="hover">
          <div style="display: flex;align-items: center;justify-content: space-between;margin-bottom:6px ; ">
            <div>套餐/项目检索</div>
            <el-input v-model="form.input" placeholder="请输入" suffix-icon="Search" style="width:50%;" />
          </div>
          <div>
            <el-table :data="tableData" style="width: 100%" height="450" v-el-table-infinite-scroll="handleTableScroll"
              :infinite-scroll-distance="50" :infinite-scroll-disabled="false">
              <el-table-column :prop="item.prop" :label="item.label" v-for="item in props.tableHeader" />
              <el-table-column prop="date" label="操作" width="80">
                <template #default="{ row, $index }">
                  <el-button class="button" @click="handleSelected(row, $index, '3')" type="primary" link>选中</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
      </el-col>
      <el-col :span="14">
        <el-card shadow="hover" style="margin-left: 10px;">
          <div style="display: flex;align-items: center;justify-content: space-between;margin-bottom:6px ; ">
            <div>已选项目（共{{ rightTableData.length }}项）</div>
            <div><el-button type="danger" round @click="handleSelected({}, '', '5')">清空</el-button></div>
          </div>
          <div>
            <el-table :data="rightTableData" style="width: 100%" height="408">
              <el-table-column prop="combinProjectCode" label="项目编码" />
              <el-table-column prop="combinProjectName" label="项目名称" />
              <el-table-column prop="standardAmount" label="金额" />
              <el-table-column prop="discount" label="折扣">
                <template #default="{ row, $index }">
                  <el-input v-model="row.discount" placeholder="请输入" @blur="handleSelected(row, $index, '1', '1')"
                    oninput="value=value.replace(/[^\d.]/g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3').replace(/^\./g, '')" />
                </template>
              </el-table-column>
              <el-table-column prop="receivableAmount" label="折后金额">
                <template #default="{ row, $index }">
                  <el-input v-model="row.receivableAmount" placeholder="请输入" @blur="handleSelected(row, $index, '1', '2')"
                    oninput="value=value.replace(/[^\d.]/g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3').replace(/^\./g, '')" />
                </template>
              </el-table-column>
              <el-table-column prop="cz" label="操作" width="80">
                <template #default="{ row, $index }">
                  <el-button class="button" @click="handleSelected(row, $index, '4')" type="primary" link>删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="mt10px">套餐金额 {{ queryObj.standardAmount }}元
            <span class="ml10px">整体折扣：</span>
            <el-input v-model="queryObj.discount" placeholder="请输入" style="width:100px;"
              @blur="handleSelected({}, '', '2', '1')"
              oninput="value=value.replace(/[^\d.]/g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3').replace(/^\./g, '')" />
            <span class="ml10px">折后应收：</span>
            <el-input v-model="queryObj.receivableAmount" placeholder="请输入" style="width:100px;"
              @blur="handleSelected({}, '', '2', '2')"
              oninput="value=value.replace(/[^\d.]/g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3').replace(/^\./g, '')" />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script setup lang="tsx" name="TransferFilterComplex">
import { debounce } from 'lodash'
import type { TabsPaneContext } from 'element-plus'
import { combinationProjectList, commonDynamicBilling } from '@/api/peis/projectPort'
const props = defineProps(['tableHeader'])
const emit = defineEmits(['itemChange'])
const tableData = ref([])
const tableDataClone = ref([])
const rightTableData = ref([])
const queryObj = reactive({
  standardAmount: 0,
  discount: 0,
  receivableAmount: 0
})
const form = reactive({
  input: '',
  pageSize: 10,
  pageNum: 1,
  total: 0,
})
onMounted(() => {
  getLeftProject()
})
//获得左侧列表数据
const getLeftProject = async () => {
  const { rows, total } = await combinationProjectList({ combinSimpleName: form.input, ...form })
  tableData.value = [...tableData.value, ...rows]
  tableDataClone.value = [...tableDataClone.value, ...rows]
  form.total = total
}
const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}

//选中or单项删除 type为true为删除
const handleSelected = async (row, index, changeType, inputType) => {
  const { standardAmount, discount, combinProjectCode, combinProjectName } = row
  //changeType  //1单项 2总计项 3新增 4删除 5删除全部
  //inputType  //输入类型(1折扣 2应收金额 3收费方式 4个人应收额 5单位应收额)
  const sort = changeType ? index + 1 : 1
  const p = {
    regType: '1',
    changeType,
    inputType,
    haveAmountCalculationItemBos: rightTableData.value, ////存量
    amountCalculationItemBos: [] ////增量或者减量都传这个
  }
  //说明是清空全部的
  if (changeType == '5') {
    p.changeType = '4'
    p.amountCalculationItemBos = rightTableData.value
  } else if (changeType == '3' || changeType == '4') {
    p.amountCalculationItemBos.push({
      sort,
      standardAmount,
      discount, combinProjectCode, combinProjectName,
      receivableAmount: standardAmount,
      payType: '1',
      payStatus: '0',
      tcFlag: '1',
      teamAmount: 0,
      personAmount: standardAmount
    })
  }
  //没有已选项时总折扣和总应收额不触发
  if (changeType == '2' && rightTableData.value.length == 0) return
  const { data } = await commonDynamicBilling({ ...p, ...queryObj })
  rightTableData.value = data.amountCalculationItemVos
  queryObj.standardAmount = data.standardAmount
  queryObj.discount = data.discount
  queryObj.receivableAmount = data.receivableAmount

  const combinProjectCodeArr = rightTableData.value.map(item => item.combinProjectCode)
  //过滤左侧
  tableData.value = tableDataClone.value.filter(item => !combinProjectCodeArr.includes(item.combinProjectCode))
}
// // 距离底部多少则触发加载
// :infinite-scroll-distance="50"
// // 首次加载是否禁用
// :infinite-scroll-disabled="true"
//表格滚动分页事件
const handleTableScroll = () => {
  if (tableData.value.length >= form.total) return
  form.pageNum++
  getLeftProject()
}
watchEffect(() => {
  emit('itemChange', { queryObj, rightTableData: rightTableData.value })
})
watch(() => form.input, (newVal) => {
  form.pageNum = 1
  getRemote()
})
const getRemote = debounce(() => {
  tableData.value = []
  tableDataClone.value = []
  getLeftProject()
}, 500)
</script>
<style scoped lang="scss">
:deep(.el-tabs__nav-wrap::after) {
  height: 0;
}

:deep(.el-tabs__item) {
  padding: 0 10px;
}
</style>
