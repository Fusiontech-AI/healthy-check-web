<template>
  <div class="tc">
    <el-row>
      <el-col :span="10">
        <el-card shadow="hover">
          <div style="display: flex;align-items: center;justify-content: space-between;margin-bottom:6px ; ">
            <div>套餐/项目检索</div>
            <el-input v-model="form.value" placeholder="请输入" suffix-icon="Search" style="width:50%;" />
          </div>
          <div>
            <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
              <el-tab-pane label="推荐套餐" name="first">
                <el-table :data="tableData" style="width: 100%" height="280">
                  <el-table-column :prop="item.prop" :label="item.label" v-for="item in props.tableHeader" />
                  <el-table-column prop="date" label="操作" width="80">
                    <template #default="{ row }">
                      <el-button class="button" @click="handleSelected(row)" type="primary" link>选中</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane label="职业项目" name="second">
                <el-table :data="tableData" style="width: 100%" height="280">
                  <el-table-column prop="date" label="项目名称" />
                  <el-table-column prop="date" label="最大折扣" />
                  <el-table-column prop="date" label="原金额" />
                  <el-table-column prop="date" label="实际金额" />
                  <el-table-column prop="date" label="操作" width="80">
                    <template #default="scope">
                      <el-button class="button" @click="handleSelected(scope.$index)" type="primary" link>选中</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane label="健康项目" name="third">
                <el-table :data="tableData" style="width: 100%" height="280">
                  <el-table-column prop="date" label="项目名称" />
                  <el-table-column prop="date" label="最大折扣" />
                  <el-table-column prop="date" label="原金额" />
                  <el-table-column prop="date" label="实际金额" />
                  <el-table-column prop="date" label="操作" width="80">
                    <template #default="scope">
                      <el-button class="button" @click="handleSelected(scope.$index)" type="primary" link>选中</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
            </el-tabs>
          </div>
        </el-card>
        <!-- 已删除模块插槽 -->
        <slot name="yiShanChu" />
      </el-col>
      <el-col :span="14">
        <el-card shadow="hover" style="margin-left: 10px;">
          <div style="display: flex;align-items: center;justify-content: space-between;margin-bottom:6px ; ">
            <div>已选项目（共13项）</div>
            <div><el-button round>清空</el-button> <el-button round>还原</el-button></div>
          </div>
          <div>
            <el-table :data="rightTableData" style="width: 100%" height="658">
              <el-table-column prop="date" label="项目编码" />
              <el-table-column prop="date" label="项目名称" />
              <el-table-column prop="date" label="原金额" />
              <el-table-column prop="date" label="折扣">
                <template #default="scope">
                  <el-input v-model="form.value" placeholder="请输入" />
                </template>
              </el-table-column>
              <el-table-column prop="date" label="折后金额">
                <template #default="scope">
                  <el-input v-model="form.value" placeholder="请输入" />
                </template>
              </el-table-column>
              <el-table-column prop="date" label="操作" width="80">
                <template #default="scope">
                  <el-button class="button" @click="handleSelected(scope.$index)" type="primary" link>删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script setup lang="tsx" name="TransferFilterComplex">
import type { TabsPaneContext } from 'element-plus'
import { combinationProjectList, commonDynamicBilling } from '@/api/peis/projectPort'
const props = defineProps(['tableHeader'])
const activeName = ref('first')
const tableData = ref([])
const rightTableData = ref([])
const form = reactive({
  value: '',
  pageSize: 10,
  pageNum: 1,
  total: 0
})
onMounted(() => {
  getLeftProject()
})
//获得左侧列表数据
const getLeftProject = async () => {
  const { rows, total } = await combinationProjectList({ combinSimpleName: form.value, ...form })
  tableData.value = rows
  form.total = total
}
const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}

//选中
const handleSelected = async (row) => {
  console.log("🚀 ~ handleSelected ~ row:", row)
  const { standardAmount, discount, combinProjectCode, combinProjectName } = row
  const p = {
    regType: '1',
    changeType: '3',
    inputType: '',
    haveAmountCalculationItemBos: [], ////存量
    amountCalculationItemBos: [] ////增量或者减量都传这个
  }

  p.amountCalculationItemBos.push({
    sort: 1,
    standardAmount,
    discount, combinProjectCode, combinProjectName,
    receivableAmount: standardAmount,
    payType: '1',
    payStatus: '0',
    tcFlag: '1',
    teamAmount: 0,
    personAmount: standardAmount
  })
  const { data } = await commonDynamicBilling(p)
  console.log("🚀 ~ handleSelected ~ data:", data)
  rightTableData.value.push(...data.amountCalculationItemVos)
}
</script>
<style scoped lang="scss">
:deep(.el-tabs__nav-wrap::after) {
  height: 0;
}

:deep(.el-tabs__item) {
  padding: 0 10px;
}
</style>
