<template>
  <div>
    <div class="head_title">参考值</div>
    <ProTable ref="proTable" :columns="columns" :data="dataTableList" :height="550" :pagination="false"
      :toolButton="false" v-loading="loading">
      <template #tableHeader="scope">
        <el-button type="primary" @click="handleAdd(1)" round>新增</el-button>
        <el-button type="danger" @click="batchDelete(scope.selectedListIds, 1)" :disabled="!scope.isSelected"
          round>批量删除</el-button>
      </template>

      <template #healthRefer="{ row }">
        {{ row.healthReferStart }}-{{ row.healthReferEnd }}
      </template>

      <template #careerRefer="{ row }">
        {{ row.careerReferStart }}-{{ row.careerReferEnd }}
      </template>

      <template #operation="{ row }">
        <div>
          <el-button type="primary" text @click="handleAdd(2, row)">详情</el-button>
          <el-popover placement="bottom" :width="50" trigger="click">
            <template #reference>
              <el-button type="primary" text>更多操作</el-button>
            </template>
            <div class="more" @click="handleAdd(3, row)">编辑</div>
            <div class="more" style="margin-bottom: 0;color:#F75252 ;" @click="batchDelete(row.id, 2)">删除</div>
          </el-popover>

        </div>
      </template>
    </ProTable>

    <!-- 新增配置 -->
    <el-drawer v-model="batchEditDialog" :title="addTitle" width="600px" class="sealAccountClass">
      <div>
        <el-form ref="batchEditRef" :model="batchEditForm" :rules="batchEditRules">
          <el-form-item label="适用性别:" prop="sex">
            <el-select v-model="batchEditForm.sex" v-if="!isPreview">
              <el-option v-for="item in optionsSuitSex" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <span v-else> {{ optionsSuitSexName }}</span>
          </el-form-item>

          <el-form-item label="年龄最低值:" prop="ageStart">
            <el-input v-model="batchEditForm.ageStart" v-if="!isPreview" />
            <span v-else> {{ batchEditForm.ageStart }}</span>
          </el-form-item>

          <el-form-item label="年龄最高值:" prop="ageEnd">
            <el-input v-model="batchEditForm.ageEnd" v-if="!isPreview" />
            <span v-else> {{ batchEditForm.ageEnd }}</span>
          </el-form-item>

          <el-form-item label="健康参考值:" required>
            <el-row v-if="!isPreview">
              <el-col :span="11">
                <el-form-item prop="healthReferStart">
                  <el-input v-model="batchEditForm.healthReferStart" />
                </el-form-item>
              </el-col>
              <el-col :span="2">
                ——
              </el-col>
              <el-col :span="11">
                <el-form-item prop="healthReferEnd">
                  <el-input v-model="batchEditForm.healthReferEnd" />
                </el-form-item>
              </el-col>
            </el-row>
            <span v-else> {{ batchEditForm.healthReferStart }}-{{ batchEditForm.healthReferEnd }}</span>
          </el-form-item>

          <el-form-item label="职业参考区间:" required>
            <el-row v-if="!isPreview">
              <el-col :span="11">
                <el-form-item prop="careerReferStart">
                  <el-input v-model="batchEditForm.careerReferStart" />
                </el-form-item>
              </el-col>
              <el-col :span="2">
                ——
              </el-col>
              <el-col :span="11">
                <el-form-item prop="careerReferEnd">
                  <el-input v-model="batchEditForm.careerReferEnd" />
                </el-form-item>
              </el-col>
            </el-row>
            <span v-else> {{ batchEditForm.careerReferStart }}-{{ batchEditForm.careerReferEnd }}</span>
          </el-form-item>

        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="batchEditDialog = false" round>取消</el-button>
          <el-button type="primary" @click="handleBatchEdit(batchEditRef)" round>
            确定
          </el-button>
        </span>
      </template>
    </el-drawer>

  </div>
</template>

<script setup lang="ts">
import ProTable from '@/components/TableSearchComponent/ProTable/index.vue'
import { Search } from '@element-plus/icons-vue'
import { basicProjectRefList, addBasicProjectRef, deleteBasicProjectRef } from '@/api/basicInfo/basicProjectManagement'
import { optionsKS, optionsSuitSex, optionsEnterSummary, optionsEnterReport, optionsUnit, optionsResultType, optionsResultGetWay, getOption, getList, getTypeList } from "../hooks/useOptions";
// import { itemType, getOption, getList } from "../hooks/useOptions";

onMounted(() => {
  getTableList()
})
const props = defineProps({
  configurationInfo: {
    type: Object,
    default: {}
  }
})

const loading = ref(false)
//项目检索
const proTable = ref(null)
const columns = ref([
  { type: "selection", fixed: "left", width: 70 },
  {
    prop: "sex",
    label: "性别",
    enum: optionsSuitSex
  },
  {
    prop: "ageStart",
    label: "年龄低值",
  },
  {
    prop: "ageEnd",
    label: "年龄高值",
  },
  {
    prop: "healthRefer",
    label: "健康参考区间",
  },
  {
    prop: "careerRefer",
    label: "职业参考区间",
  },
  {
    prop: "operation",
    label: "操作",
    width: 200
  },
])
const dataTableList = ref([])
const getTableList = async () => {
  loading.value = true
  const { rows } = await basicProjectRefList()
  dataTableList.value = rows
  loading.value = false
}

//新增抽屉
const batchEditRef = ref(null)
const batchEditDialog = ref(false)
const addTitle = ref('')
const isPreview = ref(false)
const batchEditForm = ref({})
const batchEditRules = ref({
  sex: [{ required: true, message: '请选择适用性别', trigger: 'blur' }],
  ageStart: [{ required: true, message: '请选择年龄最低值', trigger: 'blur' }],
  ageEnd: [{ required: true, message: '请选择年龄最高值', trigger: 'blur' }],
  healthReferStart: [{ required: true, message: '请选择健康参考低值', trigger: 'blur' }],
  healthReferEnd: [{ required: true, message: '请选择健康参考高值', trigger: 'blur' }],
  careerReferStart: [{ required: true, message: '请选择职业参考高值', trigger: 'blur' }],
  careerReferEnd: [{ required: true, message: '请选择职业参考低值', trigger: 'blur' }],
})

//新增配置
const handleAdd = (type, row) => {
  batchEditDialog.value = true
  isPreview.value = false
  batchEditRef.value?.clearValidate()
  if (type == 1) {
    addTitle.value = '新增'
    batchEditForm.value = {}
  } else if (type == 2) {
    addTitle.value = '详情'
    isPreview.value = true
    batchEditForm.value = { ...row }
  } else {
    addTitle.value = '编辑'
    batchEditForm.value = { ...row }
  }
}
const handleBatchEdit = async (formEl) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      await addBasicProjectRef({ ...batchEditForm.value, basicProjectId: props.configurationInfo.id })
      ElMessage.success('新增成功')
      batchEditDialog.value = false
      getTableList();
    } else {
    }
  })
}
//批量删除
const batchDelete = async (ids, type) => { //type=1是批量,type=2是单项删除
  let param = {}
  if (type == 1) {
    param.ids = [...ids]
  } else {
    param.ids = [ids]
  }
  await deleteBasicProjectRef(param)
  ElMessage.success('删除成功')
  getTableList();
}

//计算属性
const optionsSuitSexName = computed(() => {
  let TypeName = ''
  optionsSuitSex.value.forEach(item => {
    if (item.value == batchEditForm.value.sex) {
      TypeName = item.label
    }
  })
  return TypeName
})

</script>

<style scoped lang="scss">
.more {
  cursor: pointer;
  margin-bottom: 10px;

  &:hover {
    background: #F3F6FB;
    border-radius: 4px;
  }
}
</style>