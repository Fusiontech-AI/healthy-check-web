<template>
  <div class="h-full bg-white">
    <div class="flex justify-between items-center p-10px pb-0">
      <span class=" text-lg font-500">结果维护</span>
      <el-button type="primary" v-throttle round @click="router.go(-1)">返回</el-button>
    </div>
    <div class="divider"></div>
    <div class="px-10px pb-0 no-card">
      <div class="title mb-6px">基本信息</div>
      <SearchForm class="mx-4px" :columns="infoFileds" :search-col="4" :preview="true" :search-param="infoSearchParam">
      </SearchForm>
    </div>
    <div class="w-full h-1px bg-#E8E8E8 mb-8px"></div>
    <div>
      <ProTable ref="proTableRef" :columns="tableColumns" :tool-button="false" :is-show-search="false"
        height="calc(100vh - 428px)" :request-api="getTableList" :init-param="initParams"
        :expand-row-keys="expandRowKeys">
        <template #tableHeader>
          <div class="flex mb-6px">
            <el-button type="primary" round class="mr-2" @click="handleAddRule">新增规则</el-button>
            <el-input placeholder="请输入规则名称搜索" v-model="initParams.name" style="height: 32px;" prefix-icon="Search"></el-input>
          </div>
        </template>
        <template #expand="{ row, $index }">
          <div class="flex" v-for="(item, i) in row.ruleTjConditionVos" :key="item.id">
            <div class="flex sticky left-0 w-45px z-999 bg-white"></div>
            <div class="flex-1">
              <SearchForm :ref="(el) => subFormRefs[item.id] = el" class="sub_form" :search-param="item"
                :columns="subitemFields" :search-col="7" :rules="subitemRules" :preview="previewId !== item.id">
                <template #variableTypeSlot>
                  <el-select v-if="previewId == item.id" v-model="item.variableType" placeholder="请选择参数类型"
                    @change="val => changeVariableType(val, item)" clearable filterable
                    :disabled="variableTypeDisabled">
                    <el-option label="数值" value="1"></el-option>
                    <el-option label="字符" value="2"></el-option>
                  </el-select>
                  <div v-else>
                    <span v-if="item.variableType == '1'">数值</span>
                    <span v-if="item.variableType == '2'">字符</span>
                  </div>
                </template>
                <template #variableNameSlot>
                  <el-select v-if="previewId == item.id" v-model="item.variableName" placeholder="请选择参数名称"
                    @change="val => changeVariableName(val, item, row)" clearable filterable>
                    <el-option v-for="item in variableNameList" :key="item.value" :label="item.label"
                      :value="item.value"></el-option>
                  </el-select>
                  <div v-else>
                    {{ variableNameList.find((option: any) => option.value == item.variableName)?.label }}
                  </div>
                </template>
                <template #relationTypeSlot>
                  <el-select v-if="previewId == item.id" v-model="item.relationType" placeholder="请选择条件" clearable
                    filterable>
                    <el-option v-for="item in relationTypeList" :key="item.value" :label="item.label"
                      :value="item.value"></el-option>
                  </el-select>
                  <div v-else>
                    {{ relationTypeListAll.find((option: any) => option.value == item.relationType)?.label }}
                  </div>
                </template>
                <template #referenceValueSlot>
                  <el-select v-if="previewId == item.id" v-model="item.referenceValue" placeholder="请选择结果" clearable
                    filterable allow-create>
                    <el-option v-for="item in referenceValueList" :key="item.value" :label="item.label"
                      :value="item.value"></el-option>
                  </el-select>
                  <div v-else>
                    <div v-if="item.variableName == 'isPositive'" v-html="item.referenceValue == '0' ? '阴性' : '阳性'">
                    </div>
                    <div v-else-if="item.variableName == 'isAbnormal'">
                      <span v-if="item.referenceValue == '0'">正常</span>
                      <span v-if="item.referenceValue == '1'">不正常</span>
                      <span v-if="item.referenceValue == '2'">偏高</span>
                      <span v-if="item.referenceValue == '3'">偏低</span>
                      <span v-if="item.referenceValue == '4'">高于极限</span>
                      <span v-if="item.referenceValue == '5'">低于极限</span>
                    </div>
                    <div v-else-if="item.sex == 'isAbnormal'">
                      <span v-if="item.referenceValue == '0'">男</span>
                      <span v-if="item.referenceValue == '1'">女</span>
                    </div>
                    <span v-else>{{ item.referenceValue }}</span>
                  </div>
                </template>
              </SearchForm>
            </div>
            <div class="flex justify-center items-center w-180px sticky right-0 mt-[-16px] z-999 bg-#fff">
              <el-button type="primary" link @click="saveOrEditSubmit(row, item, $index)">
                {{ previewId == item.id ? '保存' : '编辑' }}
              </el-button>
              <el-button type="primary" link v-show="previewId == item.id" @click="subItemCancel(item)">取消</el-button>
              <el-button type="primary" link @click="handleDelSubitem(row, item, i)">删除</el-button>
            </div>
          </div>
        </template>
        <template #operation="{ row, $index }">
          <el-button link type="primary" @click="handleAddSubitem(row)">新增子项</el-button>
          <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
          <el-button link type="primary" @click="handleDelete(row)">删除</el-button>
        </template>
      </ProTable>
    </div>
    <el-drawer v-model="dialogVisible" :title="addSearchParam?.id?'编辑':'新增'" size="50%">
      <div class="no-card">
        <SearchForm ref="addSearchFormRef" :columns="addDialogFields" :search-param="addSearchParam" :search-col="2"
          :rules="addRules">
          <template #infoTitleComponent>
            <div class="mb-3 title">基本信息</div>
          </template>
          <template #zdjyIdSlot>
            <el-select v-model="addSearchParam.zdjyId" placeholder="请选择诊断建议" v-el-select-loadmore="selectLoadmore"
              clearable filterable remote :remote-method="remoteMethod">
              <el-option v-for="item in diagnosisList" :key="item.id" :label="item.jymc" :value="item.id"></el-option>
            </el-select>
          </template>
          <template #dealTitleComponent>
            <div class="mb-3 title">危急值处理</div>
          </template>
        </SearchForm>
      </div>
      <template #footer>
        <el-button round @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" round @click="handleSubmitRule">确定</el-button>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="tsx">
import _ from 'lodash'
import { basicProject, queryRuleTjInfoList, addRuleTjInfo, addRuleTjCondition, getRelationTypeMap, getRuleLogicTypeMap, paramTypeMap, updateRuleTjCondition, deleteRuleTjCondition, updateRuleTjInfo, deleteRuleTjInfo, listDept } from '@/api/basicInfo/diagnosticKnowledge/basicProjecRules'
import { getZdjyList } from '@/api/doctorsExamination/inputGeneralResults'
import { infoFiled, tableColumn, addDialogField, addRule, subitemField, subitemRule } from './rowColumns'
import { tjksList } from '@/api/basicInfo/basicProjectManagement'
import { DeptVO } from '@/api/system/dept/types'
const { proxy } = getCurrentInstance() as ComponentInternalInstance
const route = useRoute()
const router = useRouter()
const initParams = reactive<any>({
  rulesetId: '',
  name: ''
})
watch(() => route.query.id, (newVal) => {
  if (newVal) initParams.rulesetId = newVal
}, { immediate: true })

// 基础信息
const infoFileds = ref<any>(infoFiled)
// 基础信息
const infoSearchParam = ref({})
const tableColumns = ref<any>(tableColumn)
const addDialogFields = ref<any>(addDialogField)
const addRules: any = reactive(addRule)
const subitemFields = ref<any>(subitemField) // 子集表单配置项
const subitemRules = reactive(subitemRule) // 子项表单校验
const variableNameList: any = ref([]) // 参数名称下拉数据
const variableTypeDisabled = ref(false) // 参数类型禁用
const relationTypeList = ref<any>([]) // 条件下拉数据
const relationTypeListAll = ref<any>([]) // 条件下拉所有数据
const referenceValueList = ref<any>([]) // 结果下拉数据

// 参数类型
const changeVariableType = async (val: any, params: any, flag = true) => {
  if (flag) params.relationType = '' // 条件置空
  if (val) {
    const { data } = await getRelationTypeMap({ type: val })
    const arr: any[] = []
    for (let key in data) {
      arr.push({
        label: data[key],
        value: key
      })
    }
    relationTypeList.value = arr
  } else {
    relationTypeList.value = []
  }
}

// 参数名称
const changeVariableName = (val: any, params: any, row: any,) => {
  params.relationType = '' // 条件选项清空
  params.referenceValue = '' // 结果选项清空
  // 当子项选择相同的参数名称时 参数类型需保持一致
  if (row.ruleTjConditionVos && row.ruleTjConditionVos.length > 1) {
    const arr = row.ruleTjConditionVos.filter((item: any) => item.id !== params.id)  // 筛选除了自己的数据
    const findIndex = arr.findIndex((item: any) => item.variableName === val) // 找到如果有参数类型选择与之前一样的
    if (findIndex !== -1) {
      variableTypeDisabled.value = true
      if (params.variableType !== arr[findIndex].variableType) {
        params.variableType = arr[findIndex].variableType
        changeVariableType(arr[findIndex].variableType, params)
        ElMessage.warning('参数类型需与其他保持一致')
      }
    } else {
      variableTypeDisabled.value = false
    }
  }
  getReferenceList(val, params)
}

// 根据参数名称带出对应的结果下拉数据
const getReferenceList = (val: any, params: any) => {
  // 当参数名称为isPositive[阳性]
  if (val === 'isPositive') {
    if (params.variableType == 1) {
      params.relationType = 'EQUAL' // "条件"为EQUAL[等于]
    } else if (params.variableType == 2) {
      params.relationType = 'STRING_EQUAL' // "条件"为EQUAL[等于]
    }
    referenceValueList.value = [
      { label: '阴性', value: '0' },
      { label: '阳性', value: '1' }
    ]
  } else if (val === 'isAbnormal') {
    //当参数名称为isAbnormal[范围]
    if (params.variableType == 1) {
      params.relationType = 'EQUAL' // "条件"为EQUAL[等于]
    } else if (params.variableType == 2) {
      params.relationType = 'STRING_EQUAL' // "条件"为EQUAL[等于]
    }
    referenceValueList.value = [
      { label: '正常', value: '0' },
      { label: '不正常', value: '1' },
      { label: '偏高', value: '2' },
      { label: '偏低', value: '3' },
      { label: '高于极限', value: '4' },
      { label: '低于极限', value: '5' }
    ]
  } else if (val === 'sex') {
    //当参数名称为isAbnormal[范围]
    if (params.variableType == 1) {
      params.relationType = 'EQUAL' // "条件"为EQUAL[等于]
    } else if (params.variableType == 2) {
      params.relationType = 'STRING_EQUAL' // "条件"为EQUAL[等于]
    }
    referenceValueList.value = [
      { label: '男', value: '1' },
      { label: '女', value: '2' }
    ]
  } else {
    referenceValueList.value = []
  }
}

const expandRowKeys = ref<any>([]) // 表格默认展开项
const subSearchParams = ref({// 项目子项规则表单绑定值
  name: '', //条件描述
  variableType: '1', // 参数类型
  variableName: '', // 参数名称
  relationType: '', // 条件
  referenceValue: '', // 结果
  logicType: 'AND', // 逻辑符号
})
const previewId = ref('')
const subItemCancel = (item:any)=> {
  previewId.value = ''
  subFormRefs[item.id].clearValidate()
  proTableRef.value.getTableList()
}
// 新增子项
const handleAddSubitem = (item: any,) => {
  if (previewId.value) return ElMessage.warning('请先保存其他规则条件')
  if (!expandRowKeys.value.includes(item.id)) expandRowKeys.value.push(item.id)
  previewId.value = 'subItemId'
  item.ruleTjConditionVos.push({
    id: 'subItemId',
    ...subSearchParams.value,
    priority: item.ruleTjConditionVos.length !== 0 ? item.ruleTjConditionVos[item.ruleTjConditionVos.length - 1]?.priority - 1 : 10 // 优先级
  })
  changeVariableType('1', item) // 参数类型
}

const subFormRefs = reactive<any>({}) // 用来存储动态 refs 的对象
// 保存或修改提交子项
const saveOrEditSubmit = (row: any, item: any, index: any) => {
  // 保存
  if (previewId.value) {
    subFormRefs[item.id]?.validate(async (valid: any) => {
      if (valid) {
        // 新增保存子项目
        if (item.id === 'subItemId') {
          const { id, ...p } = item
          await addRuleTjCondition({ ruleId: row.id, ...p })
          ElMessage.success('新增成功！')
          proTableRef.value.getTableList()
        } else { // 编辑
          await updateRuleTjCondition({ ruleId: row.id, ...item })
          ElMessage.success('修改成功！')
          proTableRef.value.getTableList()
        }
        previewId.value = ''
      }
    })
  } else {
    // 编辑
    previewId.value = item.id
    changeVariableType(item.variableType, item, false) // 参数类型
    getReferenceList(item.variableName, item)
  }
}
// 删除子项
const handleDelSubitem = (row: any, item: any, index: any) => {
  if (item.id == 'subItemId') {
    row.ruleTjConditionVos?.splice(index, 1)
    previewId.value = ''
    return
  }
  ElMessageBox.confirm('请确认是否删除？', '警告', {
    cancelButtonText: '取消',
    confirmButtonText: '确定',
    type: 'warning',
  }).then(async () => {
    await deleteRuleTjCondition({ id: item.id, ruleId: row.id })
    ElMessage.success('删除成功！')
    proTableRef.value.getTableList()
  }).catch(() => {
    ElMessage({
      type: 'info',
      message: '已取消',
    })
  })
}

const addSearchFormRef = ref()
const dialogVisible = ref(false)
const addSearchParam = ref<any>({})
const proTableRef = ref()
// 新增一级规则项
const handleAddRule = () => {
  dialogVisible.value = true
  const tableData = proTableRef.value.tableData
  addSearchParam.value = {
    // crisisType: '2',
    // privacyType: '2',
    // summaryType: '2',
    // diagnosisType: '2',
    // followType: '2',
    logicType: 'XOR',
    priority: tableData.length !== 0 ? tableData[tableData.length - 1]?.priority - 1 : 10 // 优先级
  }
  if (addSearchFormRef.value) addSearchFormRef.value.resetFields()
}
// 新增保存
const handleSubmitRule = () => {
  addSearchFormRef.value.validate(async (valida: any) => {
    if (valida) {
      if (addSearchParam.value.id) {
        await updateRuleTjInfo({
          rulesetId: route.query.id,
          ...addSearchParam.value
        })
        ElMessage.success('修改成功！')
        proTableRef.value.getTableList()
        dialogVisible.value = false
      } else {
        await addRuleTjInfo({
          rulesetId: route.query.id,
          ...addSearchParam.value
        })
        ElMessage.success('新增成功！')
        proTableRef.value.getTableList()
        dialogVisible.value = false
      }

    }
  })
}
// 修改
const handleEdit = async(item: any) => {
  dialogVisible.value = true
  addSearchParam.value = { ...item }
  const findIndex = diagnosisList.value.findIndex((val:any)=> val.id == item.zdjyId)
  if(findIndex == -1) {
    const { rows } = await getZdjyList({zyzd: item.jymc})
    // diagnosisList.value.unshift(...rows)
    diagnosisList.value = [...rows, ...diagnosisList.value]
  }  
}
// 删除
const handleDelete = (item: any) => {
  ElMessageBox.confirm('请确认是否删除？', '警告', {
    cancelButtonText: '取消',
    confirmButtonText: '确定',
    type: 'warning',
  }).then(async () => {
    await deleteRuleTjInfo({ rulesetId: route.query.id, id: item.id })
    ElMessage.success('删除成功！')
    proTableRef.value.getTableList()
    dialogVisible.value = false
  }).catch(() => {
    ElMessage({
      type: 'info',
      message: '已取消',
    })
  })
}
const getBasicInfo = async () => {
  const {rows} = await tjksList({pageSize: -1})
  infoFileds.value.forEach((item:any)=> {
    if(item.prop == 'ksId') {
      item.enum = rows
    }
  })
  const { data } = await basicProject(route.query.basicProject)
  infoSearchParam.value = data
}
getBasicInfo()

const getTableList = async () => {
  const data = await queryRuleTjInfoList(initParams)
  expandRowKeys.value = data?.rows?.map((item: any) => item.id)
  return data
}
const diagnosisList = ref<any>([]) // 诊断建议list
const diagnosisParams = reactive({
  pageSize: 10,
  pageNum: 1,
  zyzd: ''
})

// 下拉加载
const selectLoadmore = _.debounce(async () => {
  diagnosisParams.pageSize += 10
  getDiagnosisList()
}, 200)

// 远程搜索
const remoteMethod = async (val: any) => {
  diagnosisParams.pageSize = 10
  diagnosisParams.zyzd = val
  getDiagnosisList()
}
// 诊断建议下拉数据
const getDiagnosisList = async () => {
  try {
    const { rows } = await getZdjyList(diagnosisParams)
    diagnosisList.value = rows
  } catch (error) {
  }
}

const getDict = async () => {
  const { data: ruleLogicTypeList } = await getRuleLogicTypeMap() // 规则逻辑符号
  const { data: paramTypeList } = await paramTypeMap() // 参数名称
  const { data: list } = await listDept({ pageSize: -1})
  const deptList = proxy?.handleTree<DeptVO>(list, "deptId")

  const paramTypeArr = []
  // 参数名称
  for (let key in paramTypeList) {
    paramTypeArr.push({
      label: paramTypeList[key],
      value: key
    })
  }
  variableNameList.value = paramTypeArr
  const { data: relationTypeList } = await getRelationTypeMap({ type: 0 })
  const relationTypeArr = []
  for (let key in relationTypeList) {
    relationTypeArr.push({
      label: relationTypeList[key],
      value: key
    })
  }
  relationTypeListAll.value = relationTypeArr


  tableColumns.value.forEach((item: any) => {
    if (item.prop == 'logicType' && item.search.el == 'select') {
      const arr = []
      // 规则逻辑符号
      for (let key in ruleLogicTypeList) {
        arr.push({
          label: ruleLogicTypeList[key],
          value: key
        })
      }
      item.enum = arr
    }
  })
  subitemFields.value.forEach((item: any) => {
    if (item.prop == 'logicType' && item.search.el == 'select') {
      const arr = []
      // 规则逻辑符号
      for (let key in ruleLogicTypeList) {
        arr.push({
          label: ruleLogicTypeList[key],
          value: key
        })
      }
      item.enum = arr
    }
  })
  addDialogFields.value.forEach((item: any) => {
    if (item.prop == 'logicType' && item.search.el == 'select') {
      const arr = []
      // 规则逻辑符号
      for (let key in ruleLogicTypeList) {
        arr.push({
          label: ruleLogicTypeList[key],
          value: key
        })
      }
      item.enum = arr
    }
    if (item.prop == 'recommendDeptCode' && item.search.el == 'tree-select') {
      item.enum = deptList
    }
  })
}
getDict()
</script>

<style scoped lang="scss">
.title {
  display: flex;
  align-items: center;

  &::before {
    content: '';
    width: 4px;
    height: 16px;
    margin-right: 4px;
    border-radius: 2px;
    font-weight: bold;
    background: #FF8F33;
  }
}

:deep(.el-drawer__footer) {
  border-top: none
}
</style>
