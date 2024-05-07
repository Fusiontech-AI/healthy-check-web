<template>
  <div>
    <div class="mb-10px">
      <span class="head_title">参考值</span>
    </div>
    <ProTable ref="proTable" :columns="columns" :requestApi="basicProjectRefList" :height="550" :toolButton="false"
      v-loading="loading">
      <template #tableHeader="scope">
        <el-button type="primary" @click="handleAdd(1)">新增</el-button>
        <el-button type="danger" @click="batchDelete(scope.selectedListIds, 1)" :disabled="!scope.isSelected">批量删除</el-button>
      </template>

      <template #healthRefer="{ row }">
        {{ row.healthReferStart }}-{{ row.healthReferEnd }}
      </template>

      <template #careerRefer="{ row }">
        {{ row.careerReferStart }}-{{ row.careerReferEnd }}
      </template>

      <template #operation="{ row, $index }">
        <div>
          <el-button type="primary" text @click="handleAdd(2, row)">详情</el-button>
          <el-popover placement="bottom" :width="50" trigger="click" :ref="`popover${$index}`">
            <template #reference>
              <el-button type="primary" text>更多操作</el-button>
            </template>
            <div class="more" @click="handleAdd(3, row, $index)">编辑</div>
            <div class="more" style="margin-bottom: 0;color:#F75252 ;" @click="batchDelete(row.id, 2)">删除</div>
          </el-popover>

        </div>
      </template>
    </ProTable>

    <!-- 新增配置 -->
    <el-drawer v-model="batchEditDialog" :title="addTitle" width="600px" class="sealAccountClass">
      <div>
        <SearchForm ref="batchEditRef" :columns="batchEditColumns" :search-param="batchEditForm" :search-col="1"
          :rules="batchEditRules" :preview="isPreview">
          <template #healthReferComponent>
            <el-form-item prop="healthRefer" label="健康参考值:">
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
          </template>
          <template #careerReferComponent>
            <el-form-item prop="careerRefer" label="职业参考区间:">
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

          </template>
        </SearchForm>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="batchEditDialog = false">取消</el-button>
          <el-button type="primary" @click="handleBatchEdit(batchEditRef)">
            确定
          </el-button>
        </span>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, getCurrentInstance, ComponentInternalInstance } from 'vue'
import ProTable from '@/components/TableSearchComponent/ProTable/index.vue'
import { Search } from '@element-plus/icons-vue'
import { basicProjectRefList, addBasicProjectRef, deleteBasicProjectRef } from '@/api/basicInfo/basicProjectManagement'
import { batchEditColumn } from "../rowColumns";
import useOptions from "../hooks/useOptions";
const { optionsUnit,
  optionsResultType,
  optionsResultGetWay,
  optionsKS,
  optionsSuitSex,
  optionsEnterSummary,
  optionsEnterReport } = useOptions()
const { proxy } = getCurrentInstance() as ComponentInternalInstance

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
//新增抽屉
const batchEditRef = ref(null)
const batchEditDialog = ref(false)
const addTitle = ref('')
const isPreview = ref(false)
const batchEditForm = ref({})
const batchEditColumns = ref<any>(batchEditColumn)
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
const handleAdd = async (type, row, $index) => {
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
    proxy.$refs[`popover${$index}`].hide()
  }
}
const handleBatchEdit = async (formEl) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      await addBasicProjectRef({ ...batchEditForm.value, basicProjectId: props.configurationInfo.id })
      ElMessage.success('新增成功')
      batchEditDialog.value = false
      proTable.value?.getTableList();
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
  proTable.value?.getTableList();
}

//父组件调用方法,刷新列表
const getTabledata = () => {
  proTable.value?.getTableList();
}


defineExpose({ getTabledata })

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

.head_title {
  color: #2879FF;
  padding-bottom: 10px;
  border-bottom: 2px solid #2879FF;
}
</style>