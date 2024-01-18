<template>
  <div>
    <el-row v-loading="loading" :gutter="10">
      <el-col :span="12">
        <div>
          <div class="head_search">
            <div class="head_title">项目检索</div>
            <el-input v-model="inputValue" class="head_input">
              <template #suffix>
                <el-icon class="el-input__icon" @click="searchProject">
                  <search />
                </el-icon>
              </template>
            </el-input>
          </div>
          <ProTable ref="proTable" :columns="columns" :data="dataTableList" :height="670" :pagination="false" :toolButton="false">
            <template #operation="{ row, $index }">
              <el-button @click="handleChecked(row, $index)" text type="primary">选中</el-button>
            </template>
          </ProTable>
        </div>
      </el-col>

      <el-col :span="12">
        <div>
        <div class="head_search">已选项目 (共{{ checkedLength }}项)</div>
        <ProTable ref="itemTable" :columns="itemColumns" :data="dataItemTable" :toolButton="false" :pagination="false" :height="670">
          <template #operation="{ row, $index }">
            <el-button @click="itemDelete(row, $index)" text type="primary">删除</el-button>
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
import { combinationProjectList, getCombinProjectBySampleId } from '@/api/basicInfo/basicProjectManagement'
import { itemType, getOption, getList } from "../hooks/useOptions";

onMounted(() => {
  getList()
  getItemList()
})
const props = defineProps({
  configurationInfo: {
    type: Object,
    default: {}
  }
})

//项目搜索
const loading = ref(false)
const inputValue = ref('')
const searchProject = async () => {
  await getTableList(inputValue.value)
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
const getTableList = async (params) => {
  loading.value = true
  if (params) {
    const { rows } = await combinationProjectList({ combinProjectName: params })
    rows.forEach(item => {
      item.combinProjectId = item.id
    })
    dataTableList.value = rows
  } else {
    const { rows } = await combinationProjectList()
    rows.forEach(item => {
      item.combinProjectId = item.id
    })
    dataTableList.value = rows
  }
  dataTableList.value=filterProject(dataItemTable.value,dataTableList.value)
  loading.value = false
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
  getTableList()
  loading.value = false
}
const itemDelete = (row, $index) => {
  dataTableList.value.push({ ...row })
  dataItemTable.value.splice($index, 1)
}

defineExpose({ dataItemTable })

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