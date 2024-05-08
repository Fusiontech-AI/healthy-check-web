<template>
  <div class="bg-#fff h-full">
    <Grid ref="gridRef" :cols="5">
      <GridItem :span="1">
        <div class="left_box">
          <div class="p-10px">
            <div class="text-18px font-medium">科室结构</div>
            <el-input class="mt-2" placeholder="请输入关键字" v-model="basicProjectName" clearable
              @input="updateInput"></el-input>
          </div>
          <el-scrollbar class="px-10px pb-10px" height="calc(100vh - 200px)">
            <el-tree v-loading="treeLoading" class="tree_root" highlight-current node-key="id" :props="defaultProps"
              :data="departList" @node-click="handleNodeClick">
            </el-tree>
          </el-scrollbar>
        </div>
      </GridItem>
      <GridItem :span="4">
        <div class="table-box">
          <ProTable ref="proTableRef" class="search-table" :columns="columns" :tool-button="false"
            height="calc(100vh - 300px)" :request-auto="false" :init-param="initParam"
            :request-api="queryRuleTjSetPages">
            <template #tableHeader>
              <el-button type="primary" style="padding: 5px 30px;" @click="handleAdd"
                :disabled="_.isEmpty(treeNodeClickObj) || treeNodeClickObj.children ? true : false">新增</el-button>
            </template>
            <template #operation="{ row }">
              <el-button type="primary" link @click="goToRule(row)">规则详情</el-button>
              <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
              <el-button type="primary" link @click="handleDelete(row)">删除</el-button>
            </template>
          </ProTable>
        </div>
      </GridItem>
    </Grid>
    <el-dialog :title="rowId ? '编辑' : '新增'" v-model="dialogVisible" width="30%">
      <SearchForm ref="searchFormRef" :search-param="searchParams" :columns="filedsColumns" :searchCol="1"
        :rules="rules">
      </SearchForm>
      <div class="flex justify-end mt-4">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash'
import { queryTjKsListByBasicName, queryRuleTjSetPages, addRuleTjSet, updateRuleTjSet, deleteRuleTjSet } from '@/api/basicInfo/diagnosticKnowledge/basicProjecRules'
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { bus_occupational_type } = toRefs<any>(proxy?.useDict('bus_occupational_type'))
const router = useRouter();
const columns = ref<any>([
  {
    prop: 'occupationalType',
    label: '适用类别',
    search: {
      el: 'select'
    },
    enum: bus_occupational_type
  },
  {
    prop: 'xmRuleType',
    label: '规则类型',
    search: {
      el: 'select',
    },
    enum: [
      { label: '功能检查', value: '1' },
    ],
    isShowSearch: false,
  },
  {
    prop: 'splitSymbol',
    label: '分割符号',
    search: {
      el: 'input'
    },
    isShowSearch: false,
  },
  {
    prop: 'name',
    label: '修改人',
    isShowSearch: false
  },
  {
    prop: 'expression',
    label: '规则表达式',
    isShowSearch: false
  },
  {
    prop: 'operation',
    label: '操作',
    isShowSearch: false
  },
])
const filedsColumns = ref<any>([
  {
    prop: 'occupationalType',
    label: '适用类别',
    search: {
      el: 'select'
    },
    enum: bus_occupational_type
  },
  {
    prop: 'xmRuleType',
    label: '规则类型',
    search: {
      el: 'select',
      onChange: (val: any) => {
        console.log(val, 'VALGKG');
        if (val === '1') {
          filedsColumns.value.forEach((item: any, i: any) => {
            if (item.prop === 'splitSymbol') {
              filedsColumns.value[i].isShowSearch = true
            }
          })
        } else {
          filedsColumns.value.forEach((item: any, i: any) => {
            if (item.prop === 'splitSymbol') {
              filedsColumns.value[i].isShowSearch = false
            }
          })
          searchParams.value.splitSymbol = ''
        }
      },
    },
    enum: [
      { label: '功能检查', value: '1' },
    ],
  },
  {
    prop: 'splitSymbol',
    label: '分割符号',
    search: {
      el: 'input'
    },
    isShowSearch: false,
  },
])
const rules = reactive({
  occupationalType: [{ required: true, message: '请选择适用类别', trigger: 'change' }],
})
const searchFormRef = ref()
const searchParams = ref<any>({})
const proTableRef = ref()
const rowId = ref('')

// 查看详情
const goToRule = (row: any) => {
  router.push({ path: '/basicInfo/diagnosticKnowledge/criticalRule/ruleDetail',
    query: {id: row.id, basicProject: row.basicProjectId}
  })
}

// 删除
const handleDelete = (row: any) => {
  ElMessageBox.confirm('请确认是否删除？', '警告', {
    cancelButtonText: '取消',
    confirmButtonText: '确定',
    type: 'warning',
  }).then(async()=> {
    await deleteRuleTjSet([row.id])
    ElMessage.success('删除成功！')
    proTableRef.value.getTableList()
  }).catch(() => {
    ElMessage({
      type: 'info',
      message: '已取消',
    })
  })
}

// 提交
const handleSubmit = () => {
  searchFormRef.value.validate(async (valid: any) => {
    if (valid) {
      if (rowId.value) {
        await updateRuleTjSet({
          id: rowId.value,
          ...initParam,
          ...searchParams.value
        })
        ElMessage.success('编辑成功！')
        proTableRef.value.getTableList()
        dialogVisible.value = false
      } else {
        await addRuleTjSet({
          occupationalType: '1',
          ...initParam,
          ...searchParams.value
        })
        ElMessage.success('新增成功！')
        proTableRef.value.getTableList()
        dialogVisible.value = false
      }

    }
  })
}
const handleEdit = (row: any) => {
  rowId.value = row.id
  searchParams.value = {
    xmRuleType: row.xmRuleType,
    splitSymbol: row.splitSymbol
  }
  if (row.xmRuleType === '1') {
    filedsColumns.value.forEach((item:any, i:any) => {
      if (item.prop === 'splitSymbol') {
        filedsColumns.value[i].isShowSearch = true
      }
    })
  } else {
    filedsColumns.value.forEach((item:any, i:any) => {
      if (item.prop === 'splitSymbol') {
        filedsColumns.value[i].isShowSearch = false
      }
    })
  }
  if (searchFormRef.value) searchFormRef.value.resetFields()
  dialogVisible.value = true
}
const handleAdd = () => {
  dialogVisible.value = true
  rowId.value = ''
  searchParams.value = {}
  filedsColumns.value.forEach((item:any, i:any) => {
    if (item.prop === 'splitSymbol') {
      filedsColumns.value[i].isShowSearch = false
    }
  })
  if (searchFormRef.value) searchFormRef.value.resetFields()
}

const treeNodeClickObj = ref<any>({})// 当前选中的节点数据
const initParam = reactive({
  basicProjectId: '', // 基础项目id
  ruleType: '2', // 规则类型 1诊断建议 2危急值 3高危异常
})
// 点击树节点
const handleNodeClick = (row: any) => {
  treeNodeClickObj.value = _.cloneDeep(row)
  if (!row.children) {
    initParam.basicProjectId = row.id
  }
}

const treeLoading = ref(false)
const basicProjectName = ref('')
const departList = ref([])
const dialogVisible = ref(false)
// 获取左侧科室树形数据
const getDepartList = async () => {
  try {
    treeLoading.value = true
    const { data } = await queryTjKsListByBasicName({ basicProjectName: basicProjectName.value })
    departList.value = _.cloneDeep(data)
    treeLoading.value = false
  } catch (error) {
    treeLoading.value = false
  }
}
getDepartList()
const updateInput = _.debounce(getDepartList, 200) // 防抖
const defaultProps = {
  children: 'children',
  label: 'ksName',
}
</script>

<style scoped lang="scss">
.left_box {
  background: #fff;
  border-right: 1px solid #E8E8E8;
}
</style>
