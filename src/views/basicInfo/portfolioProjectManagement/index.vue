<template>
  <div style="padding:10px">
    <el-card>
      <el-row>
        <el-col :span="4">
          <div class="sample">
            <div class="sample_title">项目科室分类</div>
            <div class="sample_choice">
              <span style="margin-right: 10px;">当前选择:</span>
              <span style="color:#2879FF;margin-right: 10px;">{{ currentType.ksName }}</span>
              <el-icon v-if="currentType.ksName" color="#2879FF" class="no-inherit" @click="cancelKS">
                <CircleClose style="vertical-align: middle;" />
              </el-icon>
            </div>
            <el-input v-model="inputType" @input="searchType" style="margin-bottom:10px" />
            <div v-for="(item, index) in TypeList" :key="'type' + index" style="cursor:pointer;" class="sample_list"
              @click="ksClick(item, index)" :class="{ 'active': index == activeKS }">{{ item.ksName }}</div>
          </div>
        </el-col>

        <el-col :span="20">
          <div class="sample">
            <ProTable ref="proTable" :columns="columns" :request-api="getTableList" :data-callback="dataCallback"
              :height="550" :toolButton="false">
              <template #tableHeader="scope">
                <el-button type="danger" @click="batchDelete(scope.selectedListIds)" :disabled="!scope.isSelected"
                  round>批量删除</el-button>
                <el-button type="primary" round>同步</el-button>
                <el-button type="primary" @click="handleAdd(1)" round>新增</el-button>
              </template>

              <template #operation="{ row }">
                <div>
                  <el-button type="primary" text @click="handleAdd(2, row)">详情</el-button>
                  <el-popover placement="bottom" :width="50" trigger="click">
                    <template #reference>
                      <el-button type="primary" text>更多</el-button>
                    </template>
                    <div class="more" @click="handleAdd(3, row)">编辑</div>
                    <div class="more" style="margin-bottom: 0;color:#F75252 ;" @click="handleDlete(row.id)">删除</div>
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
          <el-icon color="#F75252" class="no-inherit" :size="20">
            <WarningFilled></WarningFilled>
          </el-icon>
          <span>{{ operationTitle }}</span>
        </div>
      </template>
      <div>
        {{ operationInfo }}
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="operationDeter = false" round>取消</el-button>
          <el-button type="primary" @click="operationSure" round>
            确定
          </el-button>
        </span>
      </template>

    </el-dialog>

    <!-- 新增抽屉 -->
    <el-drawer v-model="addDrawer" v-if="addDrawer" :title="addTitle" direction="rtl" :size="1100">
      <div class="title_bord">项目基础信息</div>
      <addForm :addInfo="addInfo" ref="formRef" :isPreview="isPreview"></addForm>
      <template #footer>
        <div style="flex: auto" v-if="!isPreview">
          <el-button @click="addDrawer = false" round>取消</el-button>
          <el-button type="primary" @click="confirmClick(formRef.addInfoRef)" round>确定</el-button>
        </div>
        <div style="flex: auto" v-else>
          <el-button @click="addDrawer = false" round>关闭</el-button>
        </div>
      </template>
    </el-drawer>

  </div>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue'
import ProTable from '@/components/TableSearchComponent/ProTable/index.vue'
import addForm from './component/addForm.vue'
import configuration from "./component/configuration.vue";
import { tjksList, addBasicProject, updataBasicProject, deleteBasicProject, combinationProjectList, addCombinationProject, updataCombinationProject, deleteCombinationProject } from '@/api/basicInfo/basicProjectManagement'
import { optionsKS, optionsSuitSex, optionsSampleType, getList, getTypeList, optionsFinancialType } from "./hooks/useOptions";

onMounted(() => {
  getSearchTypeList()
  getList()
})

const inputType = ref('')
const TypeList = ref([])
const activeKS = ref(-1)
const currentType = ref({})
const searchType = () => {
  getSearchTypeList(inputType.value)
}
const getSearchTypeList = async (params) => {
  if (params) {
    const { rows } = await tjksList({
      ksName: params
    })
    TypeList.value = rows
  } else {
    const { rows } = await tjksList()
    TypeList.value = rows
  }
}
const ksClick = (item, index) => {
  activeKS.value = index
  currentType.value = item
}
const cancelKS = () => {
  activeKS.value = -1
  currentType.value = {}
}

//任务信息ProTable 实例
const proTable = ref();
// 表格配置项
const columns = reactive([
  { type: "selection", fixed: "left", width: 70 },
  {
    prop: "combinProjectCode",
    label: "项目编码",
    search: {
      el: 'input'
    },
    width: 120,
  },
  {
    prop: "combinProjectName",
    label: "项目名称",
    search: {
      el: 'input'
    },
    width: 120,
  },
  {
    prop: "ksId",
    label: "所属科室",
    enum: optionsKS,
    width: 120,
  },
  {
    prop: "suitSex",
    label: "适用性别",
    enum: optionsSuitSex,
    width: 120,
  },
  // {
  //   prop: "sampleType",
  //   label: "样本分类",
  //   width: 120,
  // },
  {
    prop: "sampleType",
    label: "样本类型",
    enum: optionsSampleType,
    width: 120,
  },
  {
    prop: "standardAmount",
    label: "金额",
    width: 120,
  },
  {
    prop: "checkAddress",
    label: "检查地址",
    width: 120,
  },
  {
    prop: "hisCode",
    label: "HIS关联码",
    width: 120,
  },
  {
    prop: "lisCode",
    label: "LIS关联码",
    width: 120,
  },
  {
    prop: "pacsCode",
    label: "影像关联码",
    width: 120,
  },
  {
    prop: "financialType",
    label: "财务类别",
    enum: optionsFinancialType,
    width: 120,
  },
  // {
  //   prop: "体检中心",
  //   label: "体检中心",
  //   width: 120,
  // },
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
  if (currentType.value.id) {
    newParams.ksId = currentType.value.id
  }
  return combinationProjectList(newParams)
}
const dataCallback = (data: any) => {
  return {
    list: data,
    total: data.total
  };
}

const operationDeter = ref(false)
const operationTitle = ref('')
const operationInfo = ref('')
const operationType = ref(-1)   //批量禁用1,禁用2
const batchDisableIds = ref([])  //批量禁用id
const disableIds = ref([])  //禁用id

//批量删除
const batchDelete = (ids) => {
  operationDeter.value = true
  operationTitle.value = '是否确定批量删除对应的记录？'
  operationInfo.value = '删除后，引用此基础项目的组合项目及套餐不可用'
  operationType.value = 1
  batchDisableIds.value = [...ids]
}

//操作确定
const operationSure = async () => { //批量禁用1,禁用2
  switch (operationType.value) {
    case 1: {
      //代码块; 
      await deleteCombinationProject({ ids: batchDisableIds.value })
      ElMessage.success('批量删除成功')
      proTable.value?.getTableList();
      break;
    }
    case 2: {
      //代码块;
      await deleteCombinationProject({ ids: disableIds.value })
      ElMessage.success('删除成功')
      proTable.value?.getTableList();
      break;
    }
  }
  operationDeter.value = false
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
    addTitle.value = '新增'
    addInfo.value = { privacyFlag: '1', guideFlag: '0', workerFlag: '0' }
  } else if (type == 2) {
    addTitle.value = '详情'
    isPreview.value = true
    addInfo.value = { ...row }
  } else {
    addTitle.value = '编辑'
    addInfo.value = { ...row }
  }
}
const confirmClick = async (formEl) => {
  if (!formEl) return
  const flag = await formEl.validate()
  if (!flag) return
  addInfo.value.infoItemBos = formRef.value?.configurationRef.dataItemTable
  if (addInfo.value.id) { //编辑
    await updataCombinationProject({ ...addInfo.value })
    ElMessage.success('编辑成功')
  } else {
    await addCombinationProject({ ...addInfo.value })
    ElMessage.success('新增成功')
  }
  addDrawer.value = false
  proTable.value?.getTableList();
}


//删除
const handleDlete = (id) => {
  operationDeter.value = true
  operationTitle.value = '是否确定删除对应的记录？'
  operationInfo.value = '删除后，引用此基础项目的组合项目及套餐不可用'
  operationType.value = 2
  disableIds.value = [id]
}


</script>

<style scoped lang="scss">
.title_bord {
  border-left: 6px solid #FF8F33;
  margin-bottom: 20px;
  padding-left: 10px;
}

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

  :deep(.el-dialog__header) {
    border-bottom: none;
  }

  :deep(.el-dialog__headerbtn) {
    top: 1px;

  }
}

:deep(.el-drawer) {
  background: linear-gradient(180deg, #CBDFFF 0%, #FFFFFF 12%);
  border-radius: 20px 0px 0px 20px;
}
</style>