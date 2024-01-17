<template>
  <div>
    <el-card>
      <el-row>
        <el-col :span="4">
          <div class="sample">
            <div class="sample_title">项目样本类别</div>
            <div class="sample_choice">
              <span style="margin-right: 10px;">当前选择:</span>
              <span style="color:#2879FF;margin-right: 10px;">{{ currentType.dictLabel }}</span>
              <el-icon v-if="currentType.dictLabel" color="#2879FF" class="no-inherit" @click="cancelKS">
                <CircleClose style="vertical-align: middle;" />
              </el-icon>
            </div>
            <el-input v-model="inputType" @input="searchType" style="margin-bottom:10px" />
            <div v-for="(item, index) in TypeList" :key="'type' + index" style="cursor:pointer;" class="sample_list"
              @click="ksClick(item, index)" :class="{ 'active': index == activeKS }">{{ item.dictLabel }}</div>
          </div>
        </el-col>

        <el-col :span="20">
          <el-form :model="searchForm" label-width="120px">
            <el-row>
              <el-col :span="8">
                <el-form-item label="项目名称">
                  <el-input v-model="searchForm.combinProjectName"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="项目编码">
                  <el-input v-model="searchForm.combinProjectCode"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item>
                  <el-button @click="searchTable" round>搜索</el-button>
                  <el-button @click="resetTable" round>重置</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>

          <ProTable ref="proTable" :columns="columns" :request-api="getTableList" :data-callback="dataCallback"
            :toolButton="false">
            <template #tableHeader="scope">
              <el-button type="danger" @click="batchDisable(scope.selectedListIds)" :disabled="!scope.isSelected" round>批量禁用</el-button>
              <el-button type="primary" @click="changeClassify(scope.selectedListIds)" :disabled="!scope.isSelected" round>批量修改分类</el-button>
              <el-button type="primary" @click="handleAdd(1)" round>新增</el-button>
            </template>

            <template #operation="{row}">
              <div style="position: relative;">
                <el-button type="primary" text @click="handleAdd(2,row)">详情</el-button>
                <el-button type="primary" text @click="row.isMore = true">更多</el-button>
                <div class="more" v-show="row.isMore">
                  <div style="cursor: pointer;" @click="handleAdd(3)">编辑</div>
                  <div style="cursor: pointer;" @click="handleConfiguration">配置</div>
                  <div style="cursor: pointer;" @click="handleForbidden">禁用</div>
                </div>
              </div>
            </template>
          </ProTable>
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
    <el-drawer v-model="addDrawer" :title="addTitle" direction="rtl">
      <div>样本信息</div>
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

    <!-- 项目配置 -->
    <el-drawer v-model="configurationDrawer" title="配置项目" direction="rtl">
      <configuration></configuration>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="configurationDrawer = false" round>取消</el-button>
          <el-button type="primary" @click="saveClick" round>确定</el-button>
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
import { systemList, sampleList, addSample } from '@/api/basicInfo/basicProjectManagement'
import { optionsType,optionsSample,optionsCode,optionsPrint,optionsApply,getOption,getList } from "./hooks/useOptions";

onMounted(() => {
  getTypeList('bus_sample_category')
  getList()
})

const inputType = ref('')
const TypeList = ref([])
const activeKS = ref(-1)
const currentType = ref({})
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
}
const cancelKS = () => {
  activeKS.value = -1
  currentType.value = {}
}

// 表格搜索
const searchForm = ref({})
const searchTable = () => {
  proTable.value?.getTableList(currentParams.value);
}
const resetTable = () => {
  searchForm.value={}
  proTable.value?.getTableList(currentParams.value);
}

//任务信息ProTable 实例
const proTable = ref();
//表格列表返回数据
const isMore = ref(false)
const detailInfo = ref({})
const currentParams=ref({})
// 表格配置项
const columns = reactive([
  { type: "selection", fixed: "left", width: 70 },
  {
    prop: "sampleCode",
    label: "样本编码",
    width: 120,
  },
  {
    prop: "sampleName",
    label: "样本名称",
    width: 120,
  },
  {
    prop: "sampleType",
    label: "标本类型",
    enum:optionsSample,
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
    enum:optionsCode,
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
    enum:[{ label: '正常', value: '0' }, { label: '停用', value: '1' }],
    width: 120,
  },
  {
    prop: "operation",
    label: "操作",
    width: 200,
    fixed: 'right'
  },

]);
const getTableList =  (params) => {
  console.log("🚀 ~ getTableList ~ params:", params)
  currentParams.value=ref({...params})
  let newParams = { ...params }
  if (currentType.value.dictValue) {
    newParams.sampleCategory = currentType.value.dictValue
  }
  if (searchForm.value != {}) {
    newParams = { ...newParams, ...searchForm.value }
  }
  return  sampleList(newParams)
}
const dataCallback = (data: any) => {
  console.log("🚀 ~ dataCallback ~ data:", data)
  return {
    list: data,
  };
}

const operationDeter = ref(false)
const operationTitle = ref('')
const operationInfo = ref('')
const operationType = ref(-1)   //批量禁用1,禁用2
const checkIds=ref([])


const batchDisable = (ids) => {
  operationDeter.value = true
  operationTitle.value = '是否确定禁用对应的记录？'
  operationInfo.value = '删除后，引用此样本的组合项目及套餐不可打印条码'
  operationType.value = 1
}
const changeClassify = (ids) => {

}



//新增抽屉
const addDrawer = ref(false)
const addTitle = ref('')
const isPreview = ref(false)
const addInfo = ref({})
//新增表单
const formRef = ref(null)

const handleAdd = (type,row) => { //type=1是新增,2是查看,3是编辑
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
  }
}
const confirmClick = async (formEl) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      console.log('submit!')
      await addSample({ ...addInfo.value })
      ElMessage.success('新增成功')
      addDrawer.value = false
      proTable.value?.getTableList();
    } else {
      console.log('error submit!', fields)
    }
  })

}


//配置项目抽屉
const configurationDrawer = ref(false)

const handleConfiguration = () => {
  configurationDrawer.value = true
}
const saveClick = () => {

}

const handleForbidden = () => {
  operationDeter.value = true
  operationTitle.value = '是否确定禁用对应的记录？'
  operationInfo.value = '删除后，引用此样本的组合项目及套餐不可打印条码'
  operationType.value = 2
}

//操作确定
const operationSure = () => { //批量禁用1,禁用2
  switch (operationType.value) {
    case 1: {
      //代码块; 
      break;
    }
    case 2: {
      //代码块; 
      break;
    }
  }
  operationDeter.value = false
}




</script>

<style scoped lang="scss">
.sample {
  padding: 10px;
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
  position: absolute;
  width: 40px;
  top: 9px;
  right: 20px;
  background-color: red;
  z-index: 999;
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
:deep(.el-table__cell){
  // z-index: 3 !important;
  .cell{
    overflow:visible; 
  }
}
</style>