<template>
  <div>
    <el-card>
      <el-row>
        <el-col :span="4">
          <div class="sample">
            <div class="sample_title">项目样本类别</div>
            <div class="sample_choice">
              <span style="margin-right: 10px;">当前选择:</span>
              <span style="color:#2879FF;margin-right: 10px;">{{ currentType.dictLabel || '--' }}</span>
              <el-icon v-if="currentType.dictLabel" color="#2879FF" class="no-inherit" @click="cancelKS">
                <CircleClose style="vertical-align: middle;" />
              </el-icon>
            </div>
            <el-input v-model="inputType" @input="searchType" placeholder="样本类别搜索" style="margin-bottom:10px" />
            <div v-for="(item, index) in TypeList" :key="'type' + index" style="cursor:pointer;" class="sample_list"
              @click="ksClick(item, index)" :class="{ 'active': index == activeKS }">{{ item.dictLabel }}</div>
          </div>
        </el-col>

        <el-col :span="20">
          <div class="sample">
            <ProTable ref="proTable" :columns="columns" :request-api="getTableList" :data-callback="dataCallback"
              :init-param="initParam" :height="550" :toolButton="false">
              <template #tableHeader="scope">
                <el-button type="primary" @click="handleAdd(1)">新增</el-button>
                <el-button type="primary" @click="changeClassify(scope.selectedListIds)" :disabled="!scope.isSelected">批量修改分类</el-button>
                <el-button type="danger" @click="batchDisable(scope.selectedListIds)" :disabled="!scope.isSelected">批量禁用</el-button>
              </template>

              <template #status="{ row }">
                <el-switch v-model="row.status" style="--el-switch-on-color: #2879FF; --el-switch-off-color: #dcdfe6"
                  active-value="0" inactive-value="1" @click="changeStatus(row)" />
              </template>
              <template #operation="{ row }">
                <div>
                  <el-button type="primary" text @click="handleAdd(2, row)">详情</el-button>
                  <el-popover placement="bottom" :width="50" trigger="click">
                    <template #reference>
                      <el-button type="primary" text>更多</el-button>
                    </template>
                    <div class="more" @click="handleAdd(3, row)">编辑</div>
                    <div class="more" @click="handleConfiguration(row)">配置</div>
                    <div class="more" style="margin-bottom: 0;color:#F75252 ;" @click="handleForbidden(row.id)">禁用</div>
                  </el-popover>

                </div>
              </template>
            </ProTable>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <!-- 确认操作 -->
    <el-dialog v-model="operationDeter" width="30%" class="sealAccountClass">
      <template #header>
        <div class="my-header">
          <span>{{ operationTitle }}</span>
        </div>
      </template>
      <div>
        <el-icon color="#F75252" class="no-inherit" :size="20">
          <WarningFilled></WarningFilled>
        </el-icon>
        {{ operationInfo }}
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="operationDeter = false">取消</el-button>
          <el-button type="primary" @click="operationSure">
            确定
          </el-button>
        </span>
      </template>

    </el-dialog>

    <!-- 新增抽屉 -->
    <el-drawer v-model="addDrawer" :title="addTitle" direction="rtl" :size="738">
      <div class="title">样本信息</div>
      <addForm :addInfo="addInfo" ref="formRef" :isPreview="isPreview"></addForm>
      <template #footer>
        <div style="flex: auto" v-if="!isPreview">
          <el-button @click="addDrawer = false">取消</el-button>
          <el-button type="primary" @click="confirmClick(formRef.addInfoRef)">确定</el-button>
        </div>
        <div style="flex: auto" v-else>
          <el-button @click="addDrawer = false">关闭</el-button>
        </div>
      </template>
    </el-drawer>

    <!-- 项目配置 -->
    <el-drawer v-model="configurationDrawer" title="配置项目" direction="rtl" :size="1100">
      <configuration ref="configurationRef" :configurationInfo="configurationInfo"></configuration>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="configurationDrawer = false">取消</el-button>
          <el-button type="primary" @click="saveClick">确定</el-button>
        </div>
      </template>
    </el-drawer>

    <!-- 批量修改分类 -->
    <el-dialog v-model="batchEditDialog" title="修改分类" width="600px" class="sealAccountClass" style="height: 250px;">
      <div>
        <div class="my-header" style="margin-bottom: 10px;">
          <el-icon color="#FF8400" class="no-inherit" :size="18">
            <WarningFilled></WarningFilled>
          </el-icon>
          <span style="color: #FF8400;">是否确认将选择的 {{ batchList.length }} 条数据改到下方所属分类</span>
        </div>
        <el-form ref="batchEditRef" :model="batchEditForm" :rules="batchEditRules">
          <el-form-item prop="sampleCategory" label="所属类别">
            <el-select v-model="batchEditForm.sampleCategory" placeholder="请选择所属类别">
              <el-option v-for="item in optionsType" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>

        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="batchEditDialog = false">取消</el-button>
          <el-button type="primary" @click="handleBatchEdit(batchEditRef)">
            确定
          </el-button>
        </span>
      </template>

    </el-dialog>

  </div>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue'
import ProTable from '@/components/TableSearchComponent/ProTable/index.vue'
import addForm from './components/addForm.vue'
import configuration from "./components/configuration.vue";
import { systemList, sampleList, addSample, updataSample, batchUpdateCategory, batchDisableApi, getCombinProjectBySampleId, updateCombinProjectBySampleId } from '@/api/basicInfo/basicProjectManagement'
import useOptions from "./hooks/useOptions";
const { optionsType, optionsSample, optionsCode, optionsPrint, optionsApply, itemType } = useOptions()
onMounted(() => {
  getTypeList('bus_sample_category')
})
const inputType = ref('')
const TypeList = ref([])
const activeKS = ref(-1)
const currentType = ref({})
const initParam = reactive({ sampleCategory: null })
const searchType = () => {
  getTypeList('bus_sample_category', inputType.value)
}
const getTypeList = async (ZDName, params) => {
  if (params) {
    const { rows } = await systemList({
      dictType: ZDName, dictLabel: params
    })
    TypeList.value = rows
  } else {
    const { rows } = await systemList({
      dictType: ZDName
    })
    TypeList.value = rows
  }
}
const ksClick = (item, index) => {
  activeKS.value = index
  currentType.value = item
  initParam.sampleCategory = item.dictValue
}
const cancelKS = () => {
  activeKS.value = -1
  currentType.value = {}
  initParam.sampleCategory = null
}


//任务信息ProTable 实例
const proTable = ref();
// 表格配置项
const columns = reactive([
  { type: "selection", fixed: "left", width: 70 },
  {
    prop: "sampleCode",
    label: "样本编码",
    search: {
      el: 'input'
    },
    width: 120,
  },
  {
    prop: "sampleName",
    label: "样本名称",
    search: {
      el: 'input'
    },
    width: 120,
  },
  {
    prop: "sampleType",
    label: "标本类型",
    enum: optionsSample,
    width: 120,
  },
  {
    prop: "printSort",
    label: "打印顺序",
    width: 120,
  },
  {
    prop: "printNumber",
    label: "打印份数",
    width: 120,
  },
  {
    prop: "printFlag",
    label: "是否打印",
    width: 120,
    enum: [{ label: '是', value: '0' }, { label: '否', value: '1' }],
  },
  {
    prop: "barCodeType",
    label: "条码类型",
    enum: optionsCode,
    width: 120,
  },
  {
    prop: "remark",
    label: "备注",
    width: 120,
  },
  {
    prop: "createBy",
    label: "创建人",
    width: 120,
  },
  {
    prop: "createTime",
    label: "创建时间",
    width: 120,
  },
  {
    prop: "updateBy",
    label: "记录更新人",
    width: 120,
  },
  {
    prop: "updateTime",
    label: "更新时间",
    width: 120,
  },
  {
    prop: "status",
    label: "是否启用",
    enum: [{ label: '正常', value: '0' }, { label: '停用', value: '1' }],
    width: 120,
  },
  {
    prop: "operation",
    label: "操作",
    width: 200,
    fixed: 'right'
  },

]);
const getTableList = (params) => {
  let newParams = { ...params }
  return sampleList(newParams)
}
const dataCallback = (data: any) => {
  return {
    list: data,
  };
}

const operationDeter = ref(false)
const operationTitle = ref('')
const operationInfo = ref('')
const operationType = ref(-1)   //批量禁用1,禁用2
const batchDisableIds = ref([])  //批量禁用id
const disableIds = ref([])  //禁用id

//批量禁用
const batchDisable = (ids) => {
  operationDeter.value = true
  operationTitle.value = '是否确定禁用对应的记录？'
  operationInfo.value = '禁用后，引用此样本的组合项目及套餐不可打印条码'
  operationType.value = 1
  batchDisableIds.value = [...ids]
}

//操作确定
const operationSure = async () => { //批量禁用1,禁用2
  operationDeter.value = false
  switch (operationType.value) {
    case 1: {
      //代码块; 
      await batchDisableApi({ ids: batchDisableIds.value })
      ElMessage.success('批量禁用成功')
      proTable.value?.clearSelection()
      proTable.value?.getTableList();
      break;
    }
    case 2: {
      //代码块;
      await batchDisableApi({ ids: disableIds.value })
      ElMessage.success('禁用成功')
      proTable.value?.getTableList();
      break;
    }
  }

}

//批量修改类别
const batchEditRef = ref(null)
const batchEditDialog = ref(false)
const batchEditForm = ref({})
const batchList = ref([])  //选中的批量修改分类列表
const batchEditRules = ref({
  sampleCategory: [{ required: true, message: '请选择所属类别', trigger: 'blur' }]
})
const handleBatchEdit = async (formEl) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      batchEditDialog.value = false
      await batchUpdateCategory({ ids: batchList.value, sampleCategory: batchEditForm.value.sampleCategory })
      ElMessage.success('批量修改分类成功')
      proTable.value?.clearSelection()
      proTable.value?.getTableList();
    } else {
    }
  })
}
const changeClassify = (ids) => {
  batchList.value = [...ids]
  batchEditDialog.value = true
  batchEditRef.value?.clearValidate()
  batchEditForm.value = {}

}



//新增抽屉
const addDrawer = ref(false)
const addTitle = ref('')
const isPreview = ref(false)
const addInfo = ref({})
//新增表单
const formRef = ref(null)

const handleAdd = (type, row) => { //type=1是新增,2是查看,3是编辑
  addDrawer.value = true
  isPreview.value = false
  formRef.value?.addInfoRef.clearValidate()
  if (type == 1) {
    addTitle.value = '新增样本'
    addInfo.value = { printNumber: '1', printApplyFlag: '1' }
  } else if (type == 2) {
    addTitle.value = '样本详情'
    isPreview.value = true
    addInfo.value = { ...row }
  } else {
    addTitle.value = '编辑样本'
    addInfo.value = { ...row }
  }
}
const confirmClick = async (formEl) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      if (addInfo.value.id) { //编辑
        await updataSample({ ...addInfo.value })
        ElMessage.success('编辑成功')
      } else {
        await addSample({ ...addInfo.value })
        ElMessage.success('新增成功')
      }
      addDrawer.value = false
      proTable.value?.getTableList();
    } else {
    }
  })

}
//编辑是否启用
const changeStatus = async (params) => {
  try {
    await updataSample({ ...params })
    ElMessage.success('切换状态成功')
  } finally {
    proTable.value?.getTableList();
  }
}


//配置项目抽屉
const configurationDrawer = ref(false)
const configurationInfo = ref({})
const configurationRef = ref(null)

const handleConfiguration = async (row) => {
  configurationDrawer.value = true
  configurationInfo.value = { ...row }
  await nextTick()
  configurationRef.value?.getItemList()
}
const saveClick = async () => {
  await updateCombinProjectBySampleId({ id: configurationInfo.value.id, sampleInfoListVos: configurationRef.value?.dataItemTable })
  ElMessage.success('配置成功')
  configurationDrawer.value = false
}

//禁用
const handleForbidden = (id) => {
  operationDeter.value = true
  operationTitle.value = '是否确定禁用对应的记录？'
  operationInfo.value = '禁用后，引用此样本的组合项目及套餐不可打印条码'
  operationType.value = 2
  disableIds.value = [id]
}


</script>

<style scoped lang="scss">
.sample {
  padding: 10px;
  height: 700px;
  border-right: 1px solid #E8E8E8;
}

.sample_title {
  font-weight: 500;
  color: #141C28;
  font-size: 18px;
  margin-bottom: 10px;
}

.sample_choice {
  border-radius: 4px;
  background: #F1F5FB;
  margin-bottom: 10px;
  padding: 10px;
  font-size: 14px;
}

.sample_list {
  margin-bottom: 10px;
  font-size: 14px;
  padding-left: 10px;
}

.active {
  color: #2879FF;
}

.more {
  cursor: pointer;
  margin-bottom: 10px;

  &:hover {
    background: #F3F6FB;
    border-radius: 4px;
  }
}

:deep(.sealAccountClass.el-dialog) {
  width: 400px;
  height: 176px;
  border-radius: 20px;
  background: linear-gradient(180deg, #CBDFFF 0%, #FFFFFF 27%);
}

:deep(.el-dialog__header) {
  border-bottom: none;
}

:deep(.el-dialog__headerbtn) {
  top: 1px;

}

:deep(.el-drawer) {
  background: linear-gradient(180deg, #CBDFFF 0%, #FFFFFF 12%);
  border-radius: 20px 0px 0px 20px;
}

.no-inherit {
  vertical-align: middle;
  margin-right: 5px;
}

.title {
  border-left: 6px solid #FF8F33;
  // margin-bottom: 20px;
  padding-left: 10px;
  display: flex;
  justify-content: space-between;
}

:deep(.form-search) {
  background-color: transparent;
}
</style>