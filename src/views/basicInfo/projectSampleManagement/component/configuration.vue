<template>
  <div>
    <el-row v-loading="loading" :gutter="10">
      <el-col :span="12">
        <el-card shadow="never">
          <div class="head_search">
            <div class="head_title">项目检索</div>
            <el-input v-model="inputValue" class="head_input" placeholder="请输入">
              <template #suffix>
                <el-icon class="el-input__icon" @click="searchProject">
                  <search />
                </el-icon>
              </template>
            </el-input>
          </div>
          <ProTable ref="proTable" :columns="columns" :requestApi="getTableList" :dataCallback="dataCallback"
            :data="dataTableList" :height="670" :requestAuto="false" :toolButton="false" :initParam="initParam">
            <template #operation="{ row, $index }">
              <el-button @click="handleChecked(row, $index)" text type="primary">选中</el-button>
            </template>
          </ProTable>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card shadow="never" class="h-814px">
          <div class="head_search">已选项目 (共{{ checkedLength }}项)</div>
          <ProTable ref="itemTable" :columns="itemColumns" :data="dataItemTable" :toolButton="false" :pagination="false"
            :height="670">
            <template #operation="{ row, $index }">
              <el-button @click="itemDelete(row, $index)" text type="danger">删除</el-button>
            </template>
          </ProTable>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import ProTable from '@/components/TableSearchComponent/ProTable/index.vue'
import { Search } from '@element-plus/icons-vue'
import { combinationProjectList, getCombinProjectBySampleId } from '@/api/basicInfo/basicProjectManagement'
const props = defineProps({
  configurationInfo: {
    type: Object,
    default: {}
  }
})

//项目搜索
const initParam = reactive({ combinProjectName: null })
const loading = ref(false)
const inputValue = ref('')
const searchProject = () => {
  initParam.combinProjectName = inputValue.value
}

const filterProject = (arr1, arr2) => {
  var result = [];
  for (var i = 0; i < arr2.length; i++) {
    var obj = arr2[i];
    var id = obj.id;
    var isExist = false;
    for (var j = 0; j < arr1.length; j++) {
      var aj = arr1[j];
      var n = aj.id;
      if (n == id) {
        isExist = true;
        break;
      }
    }
    if (!isExist) {
      result.push(obj);
    }
  }
  return result;
}

//项目检索
const proTable = ref(null)
const columns = ref([
  {
    prop: "combinProjectCode",
    label: "项目编码",
  },
  {
    prop: "combinProjectName",
    label: "项目名称",
  },
  {
    prop: "operation",
    label: "操作",
  },
])
const dataTableList = ref([])
const getTableList = async (params: any) => {
  const data = await combinationProjectList(params)
  data.rows.forEach(item => {
    item.combinProjectId = item.id
  })
  dataTableList.value = data.rows
  dataTableList.value = filterProject(dataItemTable.value, dataTableList.value)
  return { data }
}

const dataCallback = (data: any) => {
  return {
    list: data.rows,
    total: data.total
  }
}

const handleChecked = (row, $index) => {
  dataTableList.value.splice($index, 1)
  dataItemTable.value.push({ ...row })
}

//已选项目长度
const checkedLength = computed(() => {
  return dataItemTable.value.length
})


const itemColumns = ref([
  {
    prop: "combinProjectCode",
    label: "项目编码",
  },
  {
    prop: "combinProjectName",
    label: "项目名称",
  },
  {
    prop: "operation",
    label: "操作",
  },
])
const dataItemTable = ref([])

const getItemList = async () => {
  loading.value = true
  const { data } = await getCombinProjectBySampleId({ id: props.configurationInfo.id })
  data.forEach(item => {
    item.id = item.combinProjectId
  })
  dataItemTable.value = data
  await proTable.value?.getTableList()
  loading.value = false
}
// getItemList()

const itemDelete = (row, $index) => {
  dataTableList.value.push({ ...row })
  dataItemTable.value.splice($index, 1)
}

defineExpose({ dataItemTable, getItemList })

</script>

<style scoped lang="scss">
.head_search {
  display: flex;
  height: 30px;
  justify-content: space-between;
  margin-bottom: 10px;


  .head_title {
    width: 100px;
  }

  .head_input {
    width: 200px;
  }
}
</style>