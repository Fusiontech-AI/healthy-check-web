<template>
  <div class="flex p-10px">
    <div class="w-500px shrink-0">
      <el-card shadow="hover">
        <template #header>
          <div class="flex justify-between">
            体检人员信息
            <div><el-button type="primary" round @click="handleXg" :disabled="!formValue.id">保存</el-button></div>
          </div>
        </template>
        <SearchForm ref="formRef" :columns="formColumns" :search-param="formValue" :search-col="2" :rules="rules"
          :disabled="false" label-position="right">
          <template #searchimg>
            <div class="flex justify-around mb-10px">
              <ImageUpload :isShowTip="false" disabled :modelValue="modelValue" :limit="1">
                <template #txt>
                  <div class="absolute top-60%">身份证识别</div>
                </template>
              </ImageUpload>
              <ImageUpload :isShowTip="false" disabled :modelValue="modelValue" :limit="1">
                <template #txt>
                  <div class="absolute top-60%">人脸采集</div>
                </template>
              </ImageUpload>
            </div>
          </template>
        </SearchForm>
      </el-card>
    </div>
    <div class="flex-1 ml10px">
      <el-card shadow="hover">
        <div>体检号:
          <el-input v-model="value" clearable :placeholder="`请输入`" style="width: 200px;"></el-input>
          <el-button type="primary" round class="ml10px" @click="handleCx">查询</el-button>
          <el-button type="primary" round v-if="!formValue.id" :disabled="!formValue.id">电子存档</el-button>
          <el-dropdown class="mx10px" v-else>
            <el-button type="primary" round>电子存档</el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>对接高拍仪，可直接调用拍摄储存</el-dropdown-item>
                <el-dropdown-item @click="handleSctp">未对接,需要采用上传图片的方式</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-button type="danger" round @click="handleCxOrHs(1)" :disabled="!formValue.id">撤销</el-button>
          <el-button type="primary" round @click="handleCxOrHs(0)" :disabled="!formValue.id">回收</el-button>
        </div>
        <el-radio-group v-model="radio1" size="large" class="my15px" v-if="formValue.id">
          <el-radio-button :label="item.label" v-for="(item, i) of radioList1" @change="handleRadio1Change(i)" />
        </el-radio-group>
        <div v-if="radio1 == '电子导检单' && formValue.id">
          <el-radio-group v-model="radio2" size="large">
            <el-radio-button :label="item.label" v-for="(item, i) of radioList2" @change="handleRadio2Change(item)" />
          </el-radio-group>
        </div>
        <!-- 导检单 -->
        <div class="overflow-y-auto h-620px mt20px" v-if="radio1 == '电子导检单' && formValue.id && radio2 == '导检单'">
          <el-image v-for=" { url }  in  modelValueSctp1 " :key="url" :src="url" lazy />
        </div>
        <!-- 职业问询单 -->
        <div class="overflow-y-auto h-620px mt20px" v-if="radio1 == '电子导检单' && formValue.id && radio2 == '职业问询单'">
          <el-image v-for=" { url }  in  modelValueSctp0 " :key="url" :src="url" lazy />
        </div>
        <ProTable :columns="tableColumns" :toolButton="false" :data="dataSource" :pagination="false"
          v-if="radio1 != '电子导检单' && formValue.id" ref="proTable">
          <template #tableHeader>
            <div v-if="radio1 == '未检项目'">
              <el-button type="primary" round @click="handleFq">批量放弃</el-button>
              <el-button type="primary" round @click="handleYq">批量延期</el-button>
            </div>
            <el-button type="primary" round v-if="radio1 == '延期项目'" @click="handleYq">批量改期</el-button>
            <el-button type="primary" round v-if="radio1 == '弃检项目' || radio1 == '延期项目'" @click="handleHf">批量恢复</el-button>
          </template>
          <template #operation="{ row }">
            <div v-if="radio1 == '未检项目'">
              <el-button type="primary" round @click="handleYq(row)">延期</el-button>
              <el-button type="danger" round @click="handleFq(row)">弃检</el-button>
            </div>
            <el-button type="primary" round v-if="radio1 == '延期项目'" @click="handleYq(row)">改期</el-button>
            <el-button type="primary" round v-if="radio1 == '弃检项目' || radio1 == '延期项目'"
              @click="handleHf(row)">恢复</el-button>
          </template>
        </ProTable>

      </el-card>
    </div>
    <!-- 延期弹窗 -->
    <el-dialog v-model="dialogVisibleYq" title="操作确认" style="width:400px;">
      <SearchForm ref="formRefYq" :columns="formColumnsYq" :search-param="formValueYq" :search-col="1" :rules="rulesYq"
        :disabled="false" label-position="right">
      </SearchForm>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisibleYq = false">取消</el-button>
          <el-button type="primary" @click="handleSubmitYq"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 上传图片 -->
    <el-dialog v-model="dialogVisibleSctp" title="上传附件" style="width:970px;">
      <div class="my10px">
        <span style="color: red;">*</span>体检指引单回收(限6张)
      </div>
      <ImageUpload :isShowTip="false" :modelValue="modelValueSctp1" :limit="6" action="/peis/guideSheetLog"
        :data="{ ...dataSctp, occupationalType: '1' }" @handleSctp="getPicList"></ImageUpload>
      <div class="my10px">
        <span style="color: red;">*</span>职业症状问询单回收（限6张）
      </div>
      <ImageUpload :isShowTip="false" :modelValue="modelValueSctp0" :limit="6" action="/peis/guideSheetLog"
        :data="{ ...dataSctp, occupationalType: '0' }" @handleSctp="getPicList"></ImageUpload>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisibleSctp = false">取消</el-button>
          <el-button type="primary" @click="dialogVisibleSctp = false"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>

  </div>
</template>
<script setup name="guideSheetRecovery" lang="ts">
import { cloneDeep } from 'lodash'
import ImageUpload from '@/components/ImageUploadNew'
import { useHandleData } from '@/hooks/useHandleData'
import { registerGetSingleInfo, regCombinationProjectList, abandonProjects, delayProjects, saveOrWithdrawGuideSheet, regCombinationProjectRestoreProjects, guideSheetLogList, register } from '@/api/deskRegistration/guideSheetRecovery'
const radioList1 = reactive([
  {
    label: '未检项目',
    value: '0'
  },
  {
    label: '弃检项目',
    value: '2'
  },
  {
    label: '延期项目',
    value: '4'
  },
  {
    label: '电子导检单',
    value: '5'
  },
])
const radioList2 = reactive([
  {
    label: '导检单',
    value: '1'
  },
  {
    label: '职业问询单',
    value: '0'
  },
])
const radio1 = ref('未检项目')
const radio2 = ref('导检单')
const modelValue = ref([])
const dataSctp = reactive({})
const modelValueSctp1 = ref([])//非职业病
const modelValueSctp0 = ref([])//职业病
const proTable = ref(null)
const { proxy } = getCurrentInstance() as ComponentInternalInstance
const { bus_credential_type, sys_user_sex, bus_person_category, bus_marriage_status, bus_physical_type, bus_need_general_review, bus_combination_project_type, bus_project_required_type } = toRefs<any>(proxy?.useDict("bus_credential_type", 'sys_user_sex', 'bus_person_category', 'bus_marriage_status', 'bus_physical_type', 'bus_need_general_review', 'bus_combination_project_type', 'bus_project_required_type'));
const formColumns = ref<any>([
  {
    slot: 'img',
    search: { span: 24 }
  },
  {
    prop: 'patientId',
    label: '患者ID',
    search: { el: 'input', disabled: true }
  },
  {
    prop: 'credentialType',
    label: '证件类型',
    enum: bus_credential_type,
    search: { el: 'select', disabled: true }
  },
  {
    prop: 'recordCode',
    label: '档案号',
    search: { el: 'input', disabled: true }
  },
  {
    prop: 'credentialNumber',
    label: '身份证号',
    search: { el: 'input', disabled: true }
  },
  {
    prop: 'healthyCheckCode',
    label: '体检号',
    search: { el: 'input', disabled: true }
  },
  {
    prop: 'birthday',
    label: '出生日期',
    search: { el: 'date-picker', props: { type: 'date', valueFormat: 'YYYY-MM-DD' }, disabled: true }
  },
  {
    prop: 'name',
    label: '姓名',
    search: { el: 'input', disabled: true }
  },
  {
    prop: 'nation',
    label: '民族',
    search: { el: 'input', disabled: true }
  },
  {
    prop: 'age',
    label: '年龄',
    search: { el: 'input', disabled: true }
  },
  {
    prop: 'credentialImage',
    label: '人员类别',
    enum: bus_person_category,
    search: { el: 'select', disabled: true }
  },
  {
    prop: 'gender',
    label: '性别',
    enum: sys_user_sex,
    search: { el: 'select', disabled: true }
  },
  {
    prop: 'physicalType',
    label: '体检类型',
    enum: bus_physical_type,
    search: { el: 'select', disabled: true }
  },
  {
    prop: 'marriageStatus',
    label: '婚否',
    enum: bus_marriage_status,
    search: { el: 'select', disabled: true }
  },
  {
    prop: 'phone',
    label: '联系电话',
    search: { el: 'input', disabled: true }
  },
  {
    prop: 'needGeneralReview',
    label: '总检',
    enum: bus_need_general_review,
    search: { el: 'select', span: 24 }
  },
  {
    prop: 'guideSheetReceived',
    label: '是否邮寄',
    enum: [
      {
        label: '是',
        value: '0'
      },
      {
        label: '否',
        value: '1'
      },
    ],
    search: {
      el: 'select', span: 24,
    },
    change: (val) => {
      const arr = [{
        prop: 'recipient',
        label: '收件人',
        search: { el: 'input', span: 24 }
      },
      {
        prop: 'receiptPhone',
        label: '收件电话',
        search: { el: 'input', span: 24 }
      },
      {
        prop: 'postAddress',
        label: '邮寄地址',
        search: { el: 'input', span: 24 }
      }]
      if (val === '0') {
        formColumns.value = [...formColumns1.value, ...arr]
        return
      }
      formColumns.value = formColumns1.value
    }
  },

])
const formColumns1 = ref(formColumns.value)
const formValue = ref<any>({}) // 基本信息绑定的值
const dataSource = ref<any>([]) // 基本信息绑定的值
const dialogVisibleYq = ref(false)
const dialogVisibleSctp = ref(false)
const formRefYq = ref(null)
const formColumnsYq = reactive([
  {
    prop: 'delayTime',
    label: '延期时间',
    search: { el: 'date-picker', props: { type: 'date', valueFormat: 'YYYY-MM-DD' } }
  },
  {
    prop: 'delayReason',
    label: '延期理由',
    search: { el: 'input', props: { type: 'textarea', inRows: 2, maxRows: 4 } }
  },
])
const formValueYq = ref({})
const rulesYq = reactive({
  delayTime: [
    { required: true, message: '请选择延期时间', trigger: 'change' },
  ]
})
const value = ref('')
const rules = reactive({
  name: [
    { required: true, message: '请输入任务名称', trigger: 'blur' },
  ]
})

const tableColumns = reactive([
  { type: 'selection', },
  { prop: 'combinProjectCode', label: '项目编码' },
  { prop: 'combinProjectName', label: '项目名称' },
  { prop: 'sectionName', label: '科室名称' },
  { prop: 'projectType', label: '项目类型', enum: bus_combination_project_type },
  { prop: 'projectRequiredType', label: '项目属性', enum: bus_project_required_type },
  { prop: 'operation', label: '操作' },
])
//体检号查询
const handleCx = async () => {
  const { data } = await registerGetSingleInfo({ healthyCheckCode: value.value })
  await getTableList()
  formValue.value = data
  modelValue.value = [{ url: data.userImage }]
}
// 如果你想在请求之前对当前请求参数做一些操作，可以自定义如下函数：params 为当前所有的请求参数（包括分页），最后返回请求列表接口
// 默认不做操作就直接在 ProTable 组件上绑定	:requestApi="getUserList"
const getTableList = async () => {
  // 检查状态（0：未检查，1：已检查，2：弃捡，3：未保存，4：延期）见字典
  const p = {
    registerId: value.value,
    checkStatus: ''
  }
  radioList1.forEach(item => {
    if (radio1.value == item.label) {
      p.checkStatus = item.value
    }
  })

  const { rows } = await regCombinationProjectList(p)
  dataSource.value = [...rows]

};
//radio1change事件
const handleRadio1Change = (value) => {
  if (value == 3) return getPicList('1')
  getTableList()
}
//radio2change事件
const handleRadio2Change = (row) => {
  getPicList(row.value)
}
//批量放弃
const handleFq = async (row) => {
  let ids = []
  if (row.id) {
    //说明是列表按钮
    ids = [row.id]
  } else {
    ids = proTable.value.selectedListIds
  }
  if (ids.length == 0) return ElMessage({
    type: "warning",
    message: `请至少选择一项!`
  });
  await useHandleData(abandonProjects, { ids }, '弃检')
  getTableList()
}
//批量延期
const handleYq = async (row) => {
  formValueYq.value = {}
  if (row.id) {
    //说明是列表按钮
    formValueYq.value.ids = [row.id]
    dialogVisibleYq.value = true
    return
  }
  const ids = proTable.value.selectedListIds
  if (ids.length == 0) return ElMessage({
    type: "warning",
    message: `请至少选择一项!`
  });
  formValueYq.value.ids = ids
  dialogVisibleYq.value = true
}
//延期确认
const handleSubmitYq = () => {
  formRefYq.value.validate(async (valid, fields) => {
    if (valid) {
      await delayProjects({
        ...formValueYq.value
      })
      dialogVisibleYq.value = false
      getTableList()
      ElMessage({
        type: "success",
        message: `操作成功!`
      });
    }
  })

}
//撤销或者回收
const handleCxOrHs = async (type) => {
  await saveOrWithdrawGuideSheet({ registerId: formValue.value.id, guideSheetReceived: type })
  ElMessage({
    type: "success",
    message: `操作成功!`
  });
}
//批量恢复
const handleHf = async (row) => {
  let ids = []
  if (row.id) {
    //说明是列表按钮
    ids = [row.id]
  } else {
    ids = proTable.value.selectedListIds
  }
  if (ids.length == 0) return ElMessage({
    type: "warning",
    message: `请至少选择一项!`
  });
  await useHandleData(regCombinationProjectRestoreProjects, { ids }, '恢复')
  getTableList()
}
//上传图片
const handleSctp = async (val = '') => {
  dataSctp.registerId = formValue.value.id
  dialogVisibleSctp.value = true
  getPicList(val)
}
//获得图片list
const getPicList = async (val) => {
  const { data } = await guideSheetLogList({
    registerId: formValue.value.id,
    occupationalType: ''
  })
  data.forEach(item => item.url = item.imagePath)
  modelValueSctp1.value = data.filter(item => item.occupationalType == '1')
  modelValueSctp0.value = data.filter(item => item.occupationalType == '0')
}
//修改信息保存
const handleXg = async () => {
  await register(formValue.value)
  ElMessage({
    type: "success",
    message: `保存成功!`
  });
}
</script>
<style scoped lang="scss">
:deep(.el-upload--picture-card) {
  // width: 120px
}

:deep(.el-image) {
  display: block;
  height: 100%;
}
</style>


