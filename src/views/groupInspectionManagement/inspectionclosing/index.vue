<template>
  <div class="closing">
    <el-card class="box-card" shadow="never">
      <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="120px" class="demo-ruleForm" size="default"
        status-icon>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="单位名称" prop="teamId">
              <el-select v-model="ruleForm.teamId" filterable remote reserve-keyword placeholder="请选择单位名称"
                :remote-method="remoteMethod" :loading="loading" style="width: 240px">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="任务名称" prop="year">
              <el-select v-model="ruleForm.year" placeholder="请选择任务名称">
                <el-option v-for="item in taskoptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="searchForm(ruleFormRef)"> 查询 </el-button>
              <el-button @click="resetForm(ruleFormRef)">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card>
      <div class="title">
        <div class="title_name">任务信息</div>
        <div class="clearfix">
          <el-row>
            <el-col :span="6">
              <div>累计人数:{{ taskInfo.personCount }}</div>
            </el-col>
            <el-col :span="6">
              <div>分组金额:{{ taskInfo.groupAmount }}</div>
            </el-col>
            <el-col :span="6">
              <div>加项金额:{{ taskInfo.addAmount }}</div>
            </el-col>
            <el-col :span="6">
              <div>单位应收金额:{{ taskInfo.unitAmount }}</div>
            </el-col>
          </el-row>
        </div>
      </div>
      <ProTable ref="proTableTask" :columns="columnsTask" :request-api="getTableListTask"
        :data-callback="dataCallback" :requestAuto="false" :toolButton="false">
        <!-- Expand -->
        <!-- 表格操作 -->
        <template #operation="scope">
          <el-button type="primary" @click="details('明细', scope.row)">明细</el-button>
        </template>
      </ProTable>


      <div class="title">
        <div style="width: 200px;">结账信息</div>
      </div>
      <div class="payment">
        <div class="payment_btn">
          <el-button type="primary" @click="Add">新增结账</el-button>
          <el-button type="primary" @click="handelInvoice">开票</el-button>
          <el-button type="primary" @click="ticketInvalid">发票作废</el-button>
          <el-button type="primary" @click="cancellationAccount">结账作废</el-button>
        </div>
        <div class="payment_info">
          <el-row>
            <el-col :span="12">
              <div>已结金额:{{ accountsInfo.personCount }}</div>
            </el-col>
            <el-col :span="12">
              <div>余额:{{ accountsInfo.groupAmount }}</div>
            </el-col>
          </el-row>
        </div>
      </div>

      <ProTable ref="proTableAccounts" :columns="columnsAccounts" :request-api="getTableListAccounts"
        :data-callback="dataCallbackAccounts" :requestAuto="false" :toolButton="false">
        <!-- 表格操作 -->
        <template #状态="scope">
          <span :class="{ abandon: scope.row == '1' }">{{ scope.row.username }}</span>
        </template>
        <template #审核状态="scope">
          <span :class="[scope.row == '待审核' ? 'to_reviewed' : 'reviewed']">{{ scope.row.username }}</span>
        </template>
        <template #operation="scope">
          <el-button type="primary" @click="details('详情', scope.row)">详情 |</el-button>
          <el-button type="primary" @click="makeInvoice(scope.row)">开票 |</el-button>
          <el-button type="primary" @click="cancellation(scope.row)">作废 |</el-button>
          <el-button type="primary" @click="deleteInvoice(scope.row)">删除</el-button>
        </template>
      </ProTable>
    </el-card>

    <detailForm ref="detailFormRef" :dialogTitle="dialogTitle" :detailInfo="detailInfo" :dialogVisible="dialogVisible"
      @handleCancle="dialogVisible = false" @handleSure="dialogVisible = false">
    </detailForm>

    <el-drawer v-model="drawer" direction="rtl" :size="738" class="drawer">
      <template #header>
        <h4>团检收费</h4>
      </template>
      <template #default>
        <div>
          <el-form ref="addFormRef" :model="addForm" :rules="addRules" label-width="120px" class="demo-ruleForm"
            status-icon>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="单位名称" prop="name">
                  <el-input v-model="addForm.name" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="任务" prop="name">
                  <el-input v-model="addForm.name" disabled />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="批次号" prop="name">
                  <el-input v-model="addForm.name" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="结算时间" prop="name">
                  <el-date-picker v-model="addForm.date1" value-format="yyyy-MM-dd" type="date" placeholder="选择日期"
                    style="width: 100%" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="实收金额" prop="name">
                  <el-input v-model="addForm.name" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col>
                <el-form-item label="支付方式" prop="name">
                  <el-radio-group v-model="addForm.radio1" class="ml-4">
                    <el-radio v-for="(item, index) in radioList" :key="'ra' + index" label="item.value">{{ item.label
                    }}</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>

          </el-form>
        </div>
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="cancelClick(addFormRef)">取消</el-button>
          <el-button type="primary" @click="confirmClick(addFormRef)">确定</el-button>
        </div>
      </template>
    </el-drawer>

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


  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
// import type { FormInstance, FormRules } from 'element-plus'
// import { ProTableInstance, ColumnProps, HeaderRenderScope } from "@/components/ProTable/interface";
import ProTable from "@/components/TableSearchComponent/ProTable/index.vue";
import { groupList, teamGroupTree } from "@/api/groupInspection/inspectionclosing";
import { onMounted } from 'vue'
import detailForm from './component/detailForm.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import moment from 'moment'


onMounted(() => {
  // getDict()
})

/* interface RuleForm {
  teamId: string
  year: string
} */
//获取表单实例
const ruleFormRef = ref()
const ruleForm = reactive({
  teamId: '',
  year: '',
})
const rules = reactive({
  teamId: [
    { required: true, message: '请选择单位名称', trigger: 'blur' },
  ],
  year: [
    {
      required: true,
      message: '请选择任务名称',
      trigger: 'change',
    },
  ],
})
const options = ref([])
const loading = ref(false)
const taskoptions = ref([])

const remoteMethod = (query: any) => {
  loading.value = true
  // 调用接口
}


//获取单位名称及任务名称下拉列表
const getDict = async () => {
  remoteMethod('')
};
const searchForm = async (formEl:any) => {
  if (!formEl) return
  await formEl.validate((valid: any, fields: any) => {
    if (valid) {
      proTableTask.value?.getTableList();
      proTableAccounts.value?.getTableList();
    } else {
    }
  })
}
const resetForm = (formEl: any) => {
  if (!formEl) return
  formEl.resetFields()
}



//任务信息ProTable 实例
const proTableTask = ref();
//表格列表返回数据
const taskInfo = ref({})
const detailInfo = ref({})
// 表格配置项
const columnsTask = reactive([
  {
    prop: "groupName",
    label: "分组名称",
  },
  {
    prop: "unitAmount",
    label: "单位应收金额",
  },
  {
    prop: "personCount",
    label: "累计人数",
  },
  {
    prop: "groupAmount",
    label: "分组金额",
  },
  {
    prop: "groupPayType",
    label: "分组支付方式",
    enum: [
      { label: '个人', value: '0' },
      { label: '单位', value: '1' }
    ],
  },
  {
    prop: "addPersonCount",
    label: "加项人数",
  },
  {
    prop: "addAmount",
    label: "加项金额",
  },
  {
    prop: "addItemPayType",
    label: "加项支付方式",
  },
  {
    prop: "operation",
    label: "操作",
  },

]);
const dataCallback = (data: any) => {
  taskInfo.value = data
  return {
    list: data.list,
    total: data.total,
    pageNum: data.pageNum,
    pageSize: data.pageSize
  };
};
//获取任务信息列表
const getTableListTask = async (params: any) => {
  let newParams = { ...params }
  ruleForm.teamId && (newParams.teamId = ruleForm.teamId);
  ruleForm.year && (newParams.year = ruleForm.year);
  // const { data } = await groupList(newParams)
  const data = {
    list: [{}],
    total: 0,
    pageNum: 1,
    pageSize: 100
  }
  return data
};




//结账信息ProTable 实例
const proTableAccounts = ref();
// 表格配置项
const accountsInfo = ref({})

const columnsAccounts = reactive([
  {
    prop: "groupName",
    label: "收费批次流水号",
  },
  {
    prop: "unitAmount",
    label: "单位名称",
  },
  {
    prop: "personCount",
    label: "任务名称",
  },
  {
    prop: "groupAmount",
    label: "实收金额",
  },
  {
    prop: "groupPayType",
    label: "是否打印发票",
    enum: [
      { label: '个人', value: '0' },
      { label: '单位', value: '1' }
    ],
  },
  {
    prop: "addPersonCount",
    label: "发票号",
  },
  {
    prop: "addAmount",
    label: "结算人",
  },
  {
    prop: "addItemPayType",
    label: "结算时间",
  },
  {
    prop: "addItemPayType",
    label: "支付方式",
  },
  {
    prop: "addItemPayType",
    label: "录入时间",
  },
  {
    prop: "addItemPayType",
    label: "状态",
  },
  {
    prop: "addItemPayType",
    label: "审核状态",
  },
  {
    prop: "operation",
    fixed: "right",
    label: "操作",
  },

]);
const dataCallbackAccounts = (data: any) => {
  accountsInfo.value = data
  return {
    list: data.list,
    total: data.total,
    pageNum: data.pageNum,
    pageSize: data.pageSize
  };
};
//获取结账信息列表
const getTableListAccounts = async (params: any) => {
  let newParams = { ...params }
  ruleForm.teamId && (newParams.teamId = ruleForm.teamId);
  ruleForm.year && (newParams.year = ruleForm.year);
  const { data } = await groupList(newParams)
  return data
};

// 新增抽屉
const addFormRef = ref()
//抽屉中的表单数据
const addForm = ref({})
const addRules = reactive({
  '结算时间': [
    { required: true, message: '请选择结算时间', trigger: 'blur' },

  ],
  '结算金额': [
    { required: true, message: '请填写结算金额', trigger: 'blur' },
  ]
})
const radioList = reactive([
  { label: '微信', value: '1' },
  { label: '支付宝', value: '2' },
  { label: '现金', value: '3' },
  { label: '银行卡', value: '4' },
])
const drawer = ref(false)
//新增结账
const Add = async () => {
  drawer.value = true
  await nextTick()
  addFormRef.value.clearValidate()
  const r = moment().format('YYYY-MM-DD')
  addForm.value = { date1: moment().format('YYYY-MM-DD') }
}
//取消新增结账
const cancelClick = async (Ref: any) => {
  drawer.value = false
}
//确定新增结账
const confirmClick = async (Ref: any) => {
  if (!Ref) return
  await Ref.validate((valid: any, fields: any) => {
    if (valid) { //校验通过

    } else {

    }
  })
  drawer.value = false
}


const operationDeter = ref(false)
const operationTitle = ref('')
const operationInfo = ref('')
const operationType = ref(-1)   //结账作废1,作废2,删除3

//操作确定
const operationSure = () => {
  switch (operationType.value) {
    case 1: {
      //代码块; 
      break;
    }
    case 2: {
      //代码块; 
      break;
    }
    case 3: {
      //代码块; 
      break;
    }
  }
  operationDeter.value = false
}
//开票(表格上方)
const handelInvoice = () => {

}
//发票作废
const ticketInvalid = () => {

}
//结账作废
const cancellationAccount = () => {
  operationDeter.value = true
  operationTitle.value = '是否确定废弃记录？'
  operationInfo.value = '废弃记录后，将变更该结算单下内人员的收费状态'
  operationType.value = 1
}

//开票
const makeInvoice = (row: any) => {

}
//作废
const cancellation = (row: any) => {
  operationDeter.value = true
  operationTitle.value = '是否确定废弃记录？'
  operationInfo.value = '废弃记录后，将变更该结算单下内人员的收费状态'
  operationType.value = 2
}
//删除
const deleteInvoice = (row: any) => {
  operationDeter.value = true
  operationTitle.value = '是否确定删除记录？'
  operationInfo.value = '删除记录后，该记录将不可恢复'
  operationType.value = 3
}
//


//明细弹框
const dialogVisible = ref(false)
const dialogTitle = ref('')
const details = (title: any, row: any) => {
  detailInfo.value = row
  dialogVisible.value = true
  if (title == '明细') {
    dialogTitle.value = "团检收费明细"

  } else {
    dialogTitle.value = "团检收费详情"
  }
}













</script>

<style scoped lang="scss">
.closing {
  padding: 20px;
  background-color: #f1f1f1;

  .box-card {
    margin-bottom: 10px;
  }

  .title {
    border-left: 6px solid #409eff;
    margin-bottom: 20px;
    padding-left: 10px;
    display: flex;
    justify-content: space-between;

    .title_name {
      width: 100px;
    }

    .clearfix {
      width: 800px
    }
  }

  .payment {
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;

    .payment_btn {
      width: 400px;
    }

    .payment_info {
      width: 300px
    }
  }

  .abandon {
    color: #FF8400;
  }

  .to_reviewed {
    color: #FF8400;
  }

  .reviewed {
    color: #09C268;
  }


  :deep(.el-drawer) {
    background: linear-gradient(180deg, #CBDFFF 0%, #FFFFFF 12%);
    border-radius: 20px 0px 0px 20px;
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

  .no-inherit {
    margin-right: 10px;
    vertical-align: middle;
  }

}</style>
