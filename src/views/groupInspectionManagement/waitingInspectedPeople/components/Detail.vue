<template>
  <div>
    <el-row :gutter="8">
      <el-col :span="5">
        <el-card>
          <template #header> 胖胖乐公司 </template>
          <div class="mt-[10px] left-card">
            <el-tree
              v-loading="treeLoading"
              ref="treeRef"
              class="unit-tree"
              :data="treeData"
              node-key="id"
              default-expand-all
              @node-click="handleNodeClick"
            />
          </div>
        </el-card>
      </el-col>
      <el-col :span="19">
        <div>
          <el-card class="mb-[10px]">
            <div class="flex justify-between">
              <div>福鑫-女</div>
              <div><el-button type="primary" @click="$router.back()">返回</el-button></div>
            </div>
          </el-card>
          <div class="waiting-right-detail">
            <el-card class="mb-[8px]">
              <template #header> 套餐名称： </template>
              <ProTable
                :columns="tableColumns"
                :toolButton="false"
                :data="dataSourse"
                label-position="right"
                :searchCol="4"
                :highlight-current-row="true"
                row-key="id"
              >
              </ProTable>

              <SearchForm ref="deptFormRef" :search-param="searchParam" :columns="departColumn" :searchCol="4"> </SearchForm>
            </el-card>

            <el-card>
              <template #header> 待检用户： </template>
              <ProTable
                :columns="tableColumns"
                :toolButton="false"
                :data="dataSourse"
                label-position="right"
                :searchCol="4"
                :highlight-current-row="true"
                row-key="id"
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

const treeLoading = ref<boolean>(false)
const dataSourse = ref<any>([])

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


const treeData = ref<Array<any>>([
    {label:'男子组',value:'1'},
    {label:'女子组',value:'2'},
])

// 批量换组
const batchChangeGroup = (ids:any)=> {
  console.log(ids,'====ids')
}

const handleNodeClick = (node:any)=>{
 console.log(node,'===node')
}

const tableColumns = ref([
  { prop: 'f1', label: '项目名称' },
  { prop: 'f2', label: '原金额' },
  { prop: 'f3', label: '折扣'},
  { prop: 'f4', label: '应收额' },
])
</script>
<style lang="scss" scoped>
.left-card {
  height: calc(100vh - 190px);
}
.waiting-right-detail{
  height: calc(100vh - 179px);
  overflow: auto;
}
</style>
