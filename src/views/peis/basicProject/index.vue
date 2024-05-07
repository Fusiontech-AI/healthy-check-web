<template>
  <div>
    <el-card>
      <el-row>
        <el-col :span="4">
          <div class="sample">
            <div class="sample_title">项目科室分类</div>
            <div class="sample_choice">
              <span style="margin-right: 10px;">当前选择:</span>
              <span style="color:#2879FF;margin-right: 10px;">{{ currentType.ksName || '--' }}</span>
              <el-icon v-if="currentType.ksName" color="#2879FF" class="align-middle" @click="cancelKS">
                <CircleClose style="vertical-align: middle;" />
              </el-icon>
            </div>
            <el-input v-model="inputType" @input="searchType" placeholder="科室搜索" style="margin-bottom:10px" />
            <div v-for="(item, index) in TypeList" :key="'type' + index" style="cursor:pointer;" class="sample_list"
              @click="ksClick(item, index)" :class="{ 'active': index == activeKS }">{{ item.ksName }}</div>
          </div>
        </el-col>

        <el-col :span="20">
          <div class="sample">
            <div>
              <ProTable ref="proTable" :columns="columns" :request-api="basicProjectList" :init-param="initParam"
                :searchCol="3" :height="500" :toolButton="false">
                <template #tableHeader="scope">
                  <el-button type="primary" @click="handleAdd(1)">新增</el-button>
                  <el-button type="primary">同步</el-button>
                  <el-button type="danger" @click="batchDelete(scope.selectedListIds)" :disabled="!scope.isSelected">批量删除</el-button>
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
                      <div class="more" style="margin-bottom: 0;color:#F75252 ;" @click="handleDlete(row.id)">删除</div>
                    </el-popover>

                  </div>
                </template>
              </ProTable>
            </div>

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
    <el-drawer v-model="addDrawer" :title="addTitle" direction="rtl" :size="738" :destroy-on-close="true">
      <div class="title">项目基础信息</div>
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
    <el-drawer v-model="configurationDrawer" title="配置项目" direction="rtl" :size="858">
      <configuration ref="configurationRef" :configurationInfo="configurationInfo"></configuration>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="configurationDrawer = false">确定</el-button>
        </div>
      </template>
    </el-drawer>


  </div>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue'
import ProTable from '@/components/TableSearchComponent/ProTable/index.vue'
import addForm from './components/addForm.vue'
import configuration from "./components/configuration.vue";
import { tjksList, basicProjectList, addBasicProject, updataBasicProject, deleteBasicProject } from '@/api/basicInfo/basicProjectManagement'
import useOptions from "./hooks/useOptions";
const { optionsUnit,
  optionsResultType,
  optionsResultGetWay,
  optionsKS,
  optionsSuitSex,
  optionsEnterSummary,
  optionsEnterReport } = useOptions()

onMounted(() => {
  getSearchTypeList()
})

const inputType = ref('')
const TypeList = ref([])
const activeKS = ref(-1)
let currentType = reactive({})
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
const ksClick = (item: any, index: any) => {
  activeKS.value = index
  currentType = item
  initParam.ksId = item.id
}
const cancelKS = () => {
  activeKS.value = -1
  currentType = {}
  initParam.ksId = null
}


//任务信息ProTable 实例
const proTable = ref();
const initParam = reactive({ ksId: null })
// 表格配置项
const columns = reactive<any>([
  { type: "selection", fixed: "left", width: 70 },
  {
    prop: "basicProjectCode",
    label: "项目编码",
    search: {
      el: 'input',
    },
    width: 120,
  },
  {
    prop: "basicProjectName",
    label: "项目名称",
    search: {
      el: 'input',
    },
    width: 120,
  },
  {
    prop: "basicSimpleName",
    label: "项目简称",
    width: 120,
  },
  {
    prop: "unit",
    label: "项目单位",
    enum: optionsUnit,
    width: 120,
  },
  {
    prop: "defaultValue",
    label: "默认值",
    width: 120,
  },
  {
    prop: "resultType",
    label: "结果类型",
    enum: optionsResultType,
    width: 120,
  },
  {
    prop: "enterSummary",
    label: "是否进入小结",
    enum: optionsEnterSummary,
    width: 120,
  },
  {
    prop: "enterReport",
    label: "是否进入报告",
    enum: optionsEnterReport,
    width: 120,
  },
  {
    prop: "lisCode",
    label: "LIS关联码",
    width: 120,
  },
  {
    prop: "hisCode",
    label: "HIS关联码",
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
  operationDeter.value = false
  switch (operationType.value) {
    case 1: {
      //代码块; 
      await deleteBasicProject({ ids: batchDisableIds.value })
      ElMessage.success('批量删除成功')
      proTable.value?.getTableList();
      break;
    }
    case 2: {
      //代码块;
      await deleteBasicProject({ ids: disableIds.value })
      ElMessage.success('删除成功')
      proTable.value?.getTableList();
      break;
    }
  }

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
  if (type == 1) {
    addTitle.value = '新增'
    formRef.value?.addInfoRef.clearValidate()
    isPreview.value = false
    addInfo.value = {}
  } else if (type == 2) {
    addTitle.value = '详情'
    isPreview.value = true
    addInfo.value = { ...row }
  } else {
    addTitle.value = '编辑'
    formRef.value?.addInfoRef.clearValidate()
    isPreview.value = false
    addInfo.value = { ...row }
  }
}
const confirmClick = async (formEl) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      if (addInfo.value.id) { //编辑
        await updataBasicProject({ ...addInfo.value })
        ElMessage.success('编辑成功')
      } else {
        await addBasicProject({ ...addInfo.value })
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
    await updataBasicProject({ ...params })
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
  configurationRef.value?.getTabledata()
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
.sample {
  padding: 10px;
  height: 700px;
  border-right: 1px solid #E8E8E8;
}

.title {
  border-left: 6px solid #FF8F33;
  margin-bottom: 20px;
  padding-left: 10px;
  display: flex;
  justify-content: space-between;
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
</style>