<template>
  <div>
    <el-form ref="addInfoRef" :model="addInfo" :rules="addRules" label-width="120px" class="demo-ruleForm">
      <el-row>
        <el-col :span="12">
          <el-form-item label="项目编码:" prop="basicProjectCode">
            <el-input v-model="addInfo.basicProjectCode" v-if="!isPreview" />
            <span v-else> {{ addInfo.basicProjectCode }}</span>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="项目名称:" prop="basicProjectName">
            <el-input v-model="addInfo.basicProjectName" v-if="!isPreview" />
            <span v-else> {{ addInfo.basicProjectName }}</span>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="项目简称:" prop="basicSimpleName">
            <el-input v-model="addInfo.basicSimpleName" v-if="!isPreview" />
            <span v-else> {{ addInfo.basicSimpleName }}</span>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="所属科室:" prop="ksId">
            <el-select v-model="addInfo.ksId" v-if="!isPreview">
              <el-option v-for="item in optionsKS" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <span v-else> {{ optionsKSName }}</span>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="计量单位:" prop="unit">
            <el-select v-model="addInfo.unit" v-if="!isPreview">
              <el-option v-for="item in optionsUnit" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <span v-else> {{ optionsUnitName }}</span>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="结果类型:" prop="resultType">
            <el-select v-model="addInfo.resultType" v-if="!isPreview">
              <el-option v-for="item in optionsResultType" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <span v-else> {{ optionsResultTypeName }}</span>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="结果获取:" prop="resultGetWay">
            <el-select v-model="addInfo.resultGetWay" v-if="!isPreview">
              <el-option v-for="item in optionsResultGetWay" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <span v-else> {{ optionsResultGetWayName }}</span>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="适用性别:" prop="suitSex">
            <el-select v-model="addInfo.suitSex" v-if="!isPreview">
              <el-option v-for="item in optionsSuitSex" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <span v-else> {{ optionsSuitSexName }}</span>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="默认值:" prop="defaultValue">
            <el-input v-model="addInfo.defaultValue" v-if="!isPreview" />
            <span v-else> {{ addInfo.defaultValue }}</span>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="排序:" prop="projectSort">
            <el-input v-model="addInfo.projectSort" v-if="!isPreview" />
            <span v-else> {{ addInfo.projectSort }}</span>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="进入小结:" prop="enterSummary">
            <el-select v-model="addInfo.enterSummary" v-if="!isPreview">
              <el-option v-for="item in optionsEnterSummary" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <span v-else> {{ optionsEnterSummaryName }}</span>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="进入报告:" prop="enterReport">
            <el-select v-model="addInfo.enterReport" v-if="!isPreview">
              <el-option v-for="item in optionsEnterReport" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <span v-else> {{ optionsEnterReportName }}</span>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="LIS编码:" prop="lisCode">
            <el-input v-model="addInfo.lisCode" v-if="!isPreview" />
            <span v-else> {{ addInfo.lisCode }}</span>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="PACS编码:" prop="pacsCode">
            <el-input v-model="addInfo.pacsCode" v-if="!isPreview" />
            <span v-else> {{ addInfo.pacsCode }}</span>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="HIS编码:" prop="hisCode">
            <el-input v-model="addInfo.hisCode" v-if="!isPreview" />
            <span v-else> {{ addInfo.hisCode }}</span>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="职业病编码:" prop="zybCode">
            <el-input v-model="addInfo.zybCode" v-if="!isPreview" />
            <span v-else> {{ addInfo.zybCode }}</span>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="是否启用:" prop="status">
            <el-switch :disabled="isPreview" v-model="addInfo.status"
              style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" active-value="0" inactive-value="1" />
          </el-form-item>
        </el-col>

      </el-row>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {optionsKS, optionsSuitSex,optionsEnterSummary,optionsEnterReport, optionsUnit, optionsResultType, optionsResultGetWay, getOption, getList,getTypeList } from "../hooks/useOptions";
const props = defineProps({
  addInfo: {
    type: Object,
    default: {}
  },
  isPreview: {
    type: Boolean,
    default: false
  }
})

const addInfoRef = ref(null)
defineExpose({ addInfoRef })

onMounted(() => {
  getList()
  getTypeList() //科室
})
const addRules = {
  basicProjectCode: [{ required: true, message: '请输入项目编码', trigger: 'blur' }],
  basicProjectName: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
  ksId: [{ required: true, message: '请输入所属科室', trigger: 'blur' }],
  unit: [{ required: true, message: '请输入计量单位', trigger: 'blur' }],
  resultType: [{ required: true, message: '请输入结果类型', trigger: 'blur' }],
  resultGetWay: [{ required: true, message: '请输入结果获取', trigger: 'blur' }],
  projectSort: [{ required: true, message: '请输入排序', trigger: 'blur' }],
}


/*const optionsKS = ref([])
const getTypeList = async () => {
  const { rows } = await tjksList()
  rows.forEach(item => {
    item.label = item.ksName
    item.value = item.id
  })
  optionsKS.value = rows
}
//适用性别
const optionsSuitSex = ref([
  { label: '男', value: '0' },
  { label: '女', value: '1' },
  { label: '不限', value: '2' },
])

//进入小结
const optionsEnterSummary = ref([
  { label: '是', value: '0' },
  { label: '否', value: '1' },
])

//进入报告
const optionsEnterReport = ref([
  { label: '是', value: '0' },
  { label: '否', value: '1' },
])
 */

//计算属性
const optionsKSName = computed(() => {
  let TypeName = ''
  optionsKS.value.forEach(item => {
    if (item.value == props.addInfo.ksId) {
      TypeName = item.label
    }
  })
  return TypeName
})
const optionsUnitName = computed(() => {
  let TypeName = ''
  optionsUnit.value.forEach(item => {
    if (item.value == props.addInfo.unit) {
      TypeName = item.label
    }
  })
  return TypeName
})
const optionsResultTypeName = computed(() => {
  let TypeName = ''
  optionsResultType.value.forEach(item => {
    if (item.value == props.addInfo.resultType) {
      TypeName = item.label
    }
  })
  return TypeName
})
const optionsResultGetWayName = computed(() => {
  let TypeName = ''
  optionsResultGetWay.value.forEach(item => {
    if (item.value == props.addInfo.resultGetWay) {
      TypeName = item.label
    }
  })
  return TypeName
})
const optionsSuitSexName = computed(() => {
  let TypeName = ''
  optionsSuitSex.value.forEach(item => {
    if (item.value == props.addInfo.suitSex) {
      TypeName = item.label
    }
  })
  return TypeName
})

const optionsEnterSummaryName = computed(() => {
  let TypeName = ''
  optionsEnterSummary.value.forEach(item => {
    if (item.value == props.addInfo.enterSummary) {
      TypeName = item.label
    }
  })
  return TypeName
})

const optionsEnterReportName = computed(() => {
  let TypeName = ''
  optionsEnterReport.value.forEach(item => {
    if (item.value == props.addInfo.enterReport) {
      TypeName = item.label
    }
  })
  return TypeName
})


</script>

<style scoped></style>