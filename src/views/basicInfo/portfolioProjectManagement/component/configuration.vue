<template>
  <div>
    <div class="title_bord">绑定项目</div>
    <el-row v-loading="loading" :gutter="10">
      <el-col :span="12">
        <div>
          <div class="head_search">
            <div class="head_title">项目检索</div>
            <el-input v-model="inputValue" class="head_input" :disabled="isPreview">
              <template #suffix>
                <el-icon class="el-input__icon" @click="searchProject">
                  <search />
                </el-icon>
              </template>
            </el-input>
          </div>
          <ProTable ref="proTable" :columns="columns" :requestApi="getTableList" :dataCallback="dataCallback"
            :data="dataTableList" :initParam="initParam" :height="400" :toolButton="false">
            <template #operation="{ row, $index }">
              <el-button @click="handleChecked(row, $index)" text type="primary" :disabled="isPreview">选中</el-button>
            </template>
          </ProTable>
        </div>
      </el-col>

      <el-col :span="12">
        <div>
          <div class="head_search">已选项目 (共{{ checkedLength }}项)</div>
          <ProTable ref="itemTable" :columns="itemColumns" :data="dataItemTable" :toolButton="false" :pagination="false"
            :height="400">
            <template #operation="{ row, $index }">
              <el-button @click="itemDelete(row, $index)" text type="danger" :disabled="isPreview">删除</el-button>
            </template>
          </ProTable>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import ProTable from '@/components/TableSearchComponent/ProTable/index.vue'
import { Search } from '@element-plus/icons-vue'
import { basicProjectList, combinationProjectInfoList } from '@/api/basicInfo/basicProjectManagement'
import { itemType, getOption, getList } from "../hooks/useOptions";

onMounted(() => {
  getList()
  getItemList()
})
const props = defineProps({
  configurationInfo: {
    type: Object,
    default: {}
  },
  isPreview: {
    type: Boolean,
    default: false
  }
})

//项目搜索
const loading = ref(false)
const inputValue = ref('')
const initParam = reactive({ basicProjectName: null })
const searchProject = async () => {
  initParam.basicProjectName = inputValue.value
}

const filterProject = (arr1, arr2) => {
  var result = [];
  for (var i = 0; i < arr2.length; i++) {
    var obj = arr2[i];
    var id = obj.id;
    var isExist = false;
    for (var j = 0; j < arr1.length; j++) {
      var aj = arr1[j];
      var n = aj.basicProjectId;
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

const findProject = (arr1, arr2) => {
  var result = [];
  for (var i = 0; i < arr2.length; i++) {
    var obj = arr2[i];
    var id = obj.id;
    var isExist = false;

    for (var j = 0; j < arr1.length; j++) {
      var aj = arr1[j];
      var n = aj.basicProjectId;
      if (n == id) {
        isExist = true;
        break;
      }
    }
    if (isExist) {
      result.push(obj);
    }
  }
  return result;
}

//项目检索
const columns = ref([
  {
    prop: "basicProjectCode",
    label: "项目编码",
  },
  {
    prop: "basicProjectName",
    label: "项目名称",
  },
  {
    prop: "operation",
    label: "操作",
  },
])
const dataTableList = ref([])

//查询所有的项目检索
const tableListAll = async (params) => {
  const { rows } = await basicProjectList()
  rows.forEach(item => {
    item.basicProjectId = item.id
  })
  return rows
}


const getTableList = async (params) => {
  const data = await basicProjectList(params)
  data.rows.forEach(item => {
    item.basicProjectId = item.id
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
    prop: "basicProjectCode",
    label: "项目编码",
  },
  {
    prop: "basicProjectName",
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
  if (!props.configurationInfo.id) {
    dataItemTable.value = []
    await getTableList()
    loading.value = false
    return
  }
  const list = await tableListAll()
  const { rows } = await combinationProjectInfoList({ combinProjectId: props.configurationInfo.id })
  dataItemTable.value = findProject(rows, list)
  await getTableList()
  loading.value = false
}
const itemDelete = (row, $index) => {
  dataTableList.value.push({ ...row })
  dataItemTable.value.splice($index, 1)
}

defineExpose({ dataItemTable })

</script>

<style scoped lang="scss">
.title_bord {
  border-left: 6px solid #FF8F33;
  margin-bottom: 20px;
  padding-left: 10px;
}

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