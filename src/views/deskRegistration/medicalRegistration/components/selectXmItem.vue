<template>
  <el-drawer v-model="drawerVisible" :title="title" direction="rtl" size="70%" :append-to-body="true">
    <div class="flex justify-between mb10px">
      <div class="flex">
        <span class="mt3px">实际金额 ：{{ formValue.standardAmount }}</span>
        <div class=" ml40px"> 折扣（%） ：
          <el-input v-model="formValue.discount" clearable :placeholder="`请输入`" style="width:100px"
            @blur="handleBlur('1')"
            oninput="value=value.replace(/[^\d.]/g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3').replace(/^\./g, '')"></el-input>
          <!-- <div style="color:red">最大打折权限：1折</div> -->
        </div>
        <div class=" ml40px"> 折后金额 ：
          <el-input v-model="formValue.receivableAmount" clearable :placeholder="`请输入`" style="width:100px"
            @blur="handleBlur('2')"
            oninput="value=value.replace(/[^\d.]/g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3').replace(/^\./g, '')"></el-input>
        </div>
      </div>
      <div>
        <el-button @click="handleFzSc">复制上次体检项目</el-button>
        <el-button @click="handleFzXzr">选择人复制项目</el-button>
      </div>
    </div>
    <TransferFilterComplex @itemChange="itemChange" :disabled="false" :formValue="formValue" :tableHeader="tableHeader"
      ref="TransferFilterComplexRef" :isRw="true" :tableColumns="isTuanJian ? tableColumnsTj : tableColumnsGj"
      :title="title" :leftHegiht="271" :rightHeight="610" @handleHY="handleHY">
      <template #yiShanChu>
        <el-card shadow="hover" class="mt10px">
          <div class="mb6px">已删除项目（共{{ tableData.length }}项）</div>
          <el-table :data="tableData" style="width: 100%" height="304">
            <el-table-column prop="combinationProjectId" label="项目编码" />
            <el-table-column prop="combinProjectName" label="项目名称" />
            <el-table-column prop="standardAmount" label="原金额" />
            <el-table-column prop="discount" label="折扣" />
            <el-table-column prop="receivableAmount" label="实际金额" />
          </el-table>
        </el-card>
      </template>
      <template #TcWh v-if="formValue.physicalType == 'ZYJKTJ' || formValue.physicalType == 'FSTJ'">
        <div class="flex items-center h35px">
          <span>必检项目:</span> <el-checkbox-group v-model="formValue.bjxmList" :disabled="true" class="mt3px">
            <el-checkbox :label="row.itemId" :value="row.itemId" v-for="row in formValue.BJList">{{ row.name
              }}</el-checkbox>
          </el-checkbox-group>
        </div>
      </template>
    </TransferFilterComplex>

    <template #footer>
      <div style="flex: auto">
        <el-button @click="drawerVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmClick">确定</el-button>
      </div>
    </template>

    <el-dialog v-model="dialogVisible" title="复制项目" width="50%" v-if="dialogVisible">
      <ProTable :columns="tableColumns" :toolButton="false" :request-api="registerPage" :pagination="true"
        :searchCol="3" label-position="right" :height='400' ref="proTableRef">
      </ProTable>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleFZXM">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </el-drawer>
</template>

<script setup name="selectXmItem" lang="tsx">
import {
  queryBasicListByCombinIds
} from "@/api/peis/package";
import { registerPage, queryRegCombinProjectList, registerInfo } from '@/api/deskRegistration/medicalRegistration'
import TransferFilterComplex from '@/components/TransferFilterComplex'
const props = defineProps({
  // title
  title: {
    type: String,
    default: () => '个人加项',
  },
  detailInfo: {
    type: Object,
    default: () => { },
  },
  isTuanJian: {
    type: Boolean,
    default: () => false,
  },
  detailInfoClone: {//表示回显的项目
    type: Object,
    default: () => { },
  },
  formValue1: {
    type: Object,
    default: () => { },
  },
})
const drawerVisible = ref(false)
const TransferFilterComplexRef = ref(null)
const proTableRef = ref()
const formValue = reactive({
  standardAmount: 0,
  discount: 0,
  receivableAmount: 0,
  defaultItemList: [],
  packageId: '',
  packageName: "",
  regType: props.isTuanJian ? '2' : '1',
  amountCalGroupBo: null, //分组信息
  teamAmount: 0,
  paidTotalAmount: 0,
  paidPersonAmount: 0,
  paidTeamAmount: 0,
  personAmount: 0,

})
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { bus_category, bus_physical_type, sys_user_sex } = toRefs<any>(proxy?.useDict('bus_category', 'bus_physical_type', 'sys_user_sex	'))
const dialogVisible = ref(false)
let tableColumns = reactive([])
const tableColumnsTj =
  [
    {
      prop: 'tcFlag',
      label: '项目类型',
      minWidth: 90,
      enum: [
        {
          label: '套餐',
          value: '0'
        },
        {
          label: '项目',
          value: '1'
        },
      ]
    },
    {
      prop: 'combinProjectName',
      label: '项目名称',
      minWidth: 90,
      isShow: true
    },
    {
      prop: 'standardAmount',
      label: '原金额',
      minWidth: 70,
      isShow: true
    },
    {
      prop: 'discount',
      label: '折扣',
      minWidth: 90,
      isShow: true
    },
    {
      prop: 'payType',
      label: '支付方式',
      minWidth: 120,
      isShow: true
    },
    {
      prop: 'personAmount',
      label: '个费',
      minWidth: 90,
      isShow: true
    },
    {
      prop: 'teamAmount',
      label: '团费',
      minWidth: 90,
      isShow: true
    },
    {
      label: '操作',
      minWidth: 60,
      prop: 'cz'
    },
  ]
const tableColumnsGj = [
  {
    label: '项目类型',
    prop: 'tcFlag',
    enum: [
      {
        label: '套餐',
        value: '0'
      },
      {
        label: '项目',
        value: '1'
      },
    ]
  },
  {
    label: '项目名称',
    prop: 'combinProjectName'
  },
  {
    label: '金额',
    prop: 'standardAmount'
  },
  {
    label: '折扣',
    prop: 'discount'
  },
  {
    label: '折后金额',
    prop: 'receivableAmount'
  },
  {
    label: '操作',
    prop: 'cz'
  },
]
const tableData = computed(() => {
  const arr = dataSource.value.map(item => item.id)
  return props.detailInfoClone.dataSource.filter(item => !arr.includes(item.combinationProjectId))
})
const dataSource = ref([])
const handleDrawerChange = async () => {
  const {
    dataSource,
    receivableAmount,
    standardAmount,
    discount,
    packageId,
    packageName,
    teamAmount,
    amountCalGroupBo,
    paidTotalAmount,
    paidPersonAmount,
    paidTeamAmount,
    personAmount } = props.detailInfo
  formValue.defaultItemList = dataSource.map((item, i) => {
    return {
      sort: i + 1,
      payType: item.payMode,//变更类型(0个人 1单位 2混合支付)
      payStatus: item.payStatus,//缴费状态（0：未缴费，1：已缴费，2：申请退费中，3：已退费，）
      tcFlag: item.projectType,//是否套餐'0'是'1'否
      teamAmount: item.teamAmount || (item.payMode == 1 ? item.receivableAmount : 0),//单位应收金额
      personAmount: item.personAmount || (item.payMode == 0 ? item.receivableAmount : 0),//个人应收金额
      combinProjectCode: '',
      combinProjectName: item.combinProjectName,
      standardAmount: item.standardAmount,
      discount: item.discount,
      receivableAmount: item.receivableAmount,
      id: item.combinationProjectId || item.id, //回显取combinationProjectId 新选的取id
      addFlag: item.addFlag,
      originId: item.originId,
      required: item.required
    }
  })
  formValue.standardAmount = standardAmount
  formValue.receivableAmount = receivableAmount
  formValue.discount = discount
  formValue.packageId = packageId
  formValue.packageName = packageName
  formValue.amountCalGroupBo = amountCalGroupBo
  formValue.teamAmount = teamAmount
  formValue.paidTotalAmount = paidTotalAmount
  formValue.paidPersonAmount = paidPersonAmount
  formValue.paidTeamAmount = paidTeamAmount
  formValue.personAmount = personAmount
  const { illuminationSource, jobIlluminationType, dutyStatus, tjRegisterZybHazardBosTes, physicalType, groupHazardsList, BJList } = props.formValue1 || {}
  formValue.shineSource = illuminationSource
  formValue.shineType = jobIlluminationType
  formValue.dutyStatus = dutyStatus
  formValue.groupHazardsList = groupHazardsList
  formValue.physicalType = physicalType
  formValue.BJList = BJList
  drawerVisible.value = true
  await nextTick()
  TransferFilterComplexRef.value.defaultItems()
  TransferFilterComplexRef.value.getRemote()

}
const confirmClick = () => {
  const {
    receivableAmount,
    standardAmount,
    discount,
    packageId,
    packageName,
    teamAmount,
    paidTotalAmount,
    paidPersonAmount,
    paidTeamAmount,
    personAmount } = formValue
  props.detailInfo.dataSource = dataSource.value
  props.detailInfo.receivableAmount = receivableAmount
  props.detailInfo.standardAmount = standardAmount
  props.detailInfo.discount = discount
  props.detailInfo.packageId = packageId
  props.detailInfo.packageName = packageName
  props.detailInfo.paidTotalAmount = paidTotalAmount
  props.detailInfo.teamAmount = teamAmount
  props.detailInfo.paidTotalAmount = paidTotalAmount
  props.detailInfo.paidPersonAmount = paidPersonAmount
  props.detailInfo.paidTeamAmount = paidTeamAmount
  props.detailInfo.personAmount = personAmount
  drawerVisible.value = false
}

const tableHeader = ref([
  {
    prop: 'name',
    label: '套餐/项目名称'
  },
  {
    prop: 'discount',
    label: '折扣'
  },
  {
    prop: 'standardAmount',
    label: '原金额'
  },
  {
    prop: 'receivableAmount',
    label: '实际金额'
  },
])
//复制上次
const handleFzSc = () => {
  dialogVisible.value = true
  tableColumns = [
    { prop: 'healthyCheckTimeArr', label: '体检日期', search: { el: 'date-picker', props: { type: 'daterange', valueFormat: 'YYYY-MM-DD' } }, isShow: false },
    { type: 'radio', label: '勾选', width: 60 },
    { type: 'index', label: '序号', width: 60 },
    { prop: 'registerTimeStart', label: '登记时间' },
    { prop: 'healthyCheckTimeStart', label: '体检日期' },
    { prop: 'businessCategory', label: '业务类别', enum: bus_category, },
    { prop: 'teamName', label: '单位名称' },
    { prop: 'physicalType', label: '体检类型', enum: bus_physical_type, },
    { prop: 'taskName', label: '任务名称' },
    { prop: 'groupName', label: '分组名称' },
    { prop: 'createByName', label: '创建人' },
  ]
}
//复制选择人项目
const handleFzXzr = () => {
  dialogVisible.value = true
  tableColumns = [
    { prop: 'credentialNumber', label: '证件号/体检号', search: { el: 'input' }, isShow: false },
    { prop: 'name', label: '姓名', search: { el: 'input' }, isShow: false },
    { prop: 'healthyCheckTimeArr', label: '体检日期', search: { el: 'date-picker', props: { type: 'daterange', valueFormat: 'YYYY-MM-DD' } }, isShow: false },
    { type: 'radio', label: '勾选', width: 60 },
    { type: 'index', label: '序号', width: 60 },
    { prop: 'healthyCheckCode', label: '体检号' },
    { prop: 'name', label: '姓名' },
    { prop: 'gender', label: '性别', enum: sys_user_sex, },
    { prop: 'credentialNumber', label: '身份证号', },
    { prop: 'businessCategory', label: '业务类型', enum: bus_category, },
    { prop: 'physicalType', label: '体检类型', enum: bus_physical_type, },
    { prop: 'teamName', label: '单位名称' },
    { prop: 'registerTimeStart', label: '登记时间' },
  ]
}

const itemChange = (val) => {
  val.rightTableData.forEach(item => {
    item.projectType = item.tcFlag//项目类型（1：套餐项目，2：加项项目
    item.payMode = item.payType ?? (props.title == '个人加项' ? '0' : "1")
    item.checkStatus = '0'
    item.addFlag = item.addFlag ?? (props.title == '个人加项' ? '1' : '2') //addFlag	加项标识:1个人加项 2团队加项
    if (item.projectType == 0) {
      item.packageId = formValue.packageId
    }
  })
  dataSource.value = val.rightTableData
}

//整体折扣和折后应收失焦
const handleBlur = (type) => {
  TransferFilterComplexRef.value.handleSelected({}, '', '2', type)
}

//还原
const handleHY = () => {
  const { dataSource,
    receivableAmount,
    standardAmount,
    discount,
    packageId,
    packageName,
    teamAmount,
    paidTotalAmount,
    paidPersonAmount,
    paidTeamAmount,
    personAmount } = props.detailInfoClone

  formValue.defaultItemList = dataSource.map((item, i) => {
    return {
      sort: i + 1,
      payType: item.payMode,//变更类型(0个人 1单位 2混合支付)
      payStatus: item.payStatus,//缴费状态（0：未缴费，1：已缴费，2：申请退费中，3：已退费，）
      tcFlag: item.projectType,//是否套餐'0'是'1'否
      teamAmount: item.teamAmount,//单位应收金额
      personAmount: item.personAmount,//个人应收金额
      combinProjectCode: '',
      combinProjectName: item.combinProjectName,
      standardAmount: item.standardAmount,
      discount: item.discount,
      receivableAmount: item.receivableAmount,
      id: item.combinationProjectId || item.id, //回显取combinationProjectId 新选的取id
      addFlag: item.addFlag,
      originId: item.originId,
      required: item.required
    }
  })

  formValue.standardAmount = standardAmount
  formValue.receivableAmount = receivableAmount
  formValue.discount = discount
  formValue.packageId = packageId
  formValue.packageName = packageName
  formValue.teamAmount = teamAmount
  formValue.paidTotalAmount = paidTotalAmount
  formValue.paidPersonAmount = paidPersonAmount
  formValue.paidTeamAmount = paidTeamAmount
  formValue.personAmount = personAmount
  TransferFilterComplexRef.value.defaultItems()
}
//复制项目
const handleFZXM = async () => {
  const info = await registerInfo({ id: proTableRef.value.radio })
  const {
    totalAmount,
    totalStandardAmount,
    discount,
    packageId,
    packageName,
    teamAmount,
    paidTotalAmount,
    paidPersonAmount,
    paidTeamAmount,
    personAmount } = info.data
  const { data } = await queryRegCombinProjectList({ id: proTableRef.value.radio })
  const defaultItemList = data.map(item => {
    item.required = item.projectRequiredType == '1' ? true : false
    item.originId = item.id
    return item
  }
  )
  formValue.defaultItemList = defaultItemList.map((item, i) => {
    return {
      sort: i + 1,
      payType: item.payMode,//变更类型(0个人 1单位 2混合支付)
      payStatus: item.payStatus,//缴费状态（0：未缴费，1：已缴费，2：申请退费中，3：已退费，）
      tcFlag: item.projectType,//是否套餐'0'是'1'否
      teamAmount: item.teamAmount || (item.payMode == 1 ? item.receivableAmount : 0),//单位应收金额
      personAmount: item.personAmount || (item.payMode == 0 ? item.receivableAmount : 0),//个人应收金额
      combinProjectCode: '',
      combinProjectName: item.combinProjectName,
      standardAmount: item.standardAmount,
      discount: item.discount,
      receivableAmount: item.receivableAmount,
      id: item.combinationProjectId || item.id, //回显取combinationProjectId 新选的取id
      addFlag: item.addFlag,
      originId: item.originId,
      required: item.required
    }
  })
  formValue.standardAmount = totalStandardAmount
  formValue.receivableAmount = totalAmount
  formValue.discount = discount
  formValue.packageId = packageId
  formValue.packageName = packageName
  // formValue.teamAmount = teamAmount
  // formValue.paidTotalAmount = paidTotalAmount
  // formValue.paidPersonAmount = paidPersonAmount
  // formValue.paidTeamAmount = paidTeamAmount
  // formValue.personAmount = personAmount
  TransferFilterComplexRef.value.defaultItems()
  dialogVisible.value = false
}
//匹配必检项目的勾选
watch(() => dataSource.value, async (newV) => {
  const { physicalType } = props?.formValue1 || {}
  if (physicalType != 'FSTJ' && physicalType != 'ZYJKTJ') return
  const arr = newV.map(item => item.combinProjectId || item.id)
  if (arr.length == 0) return (formValue.bjxmList = [])
  const { data } = await queryBasicListByCombinIds(arr)
  //匹配勾选
  formValue.bjxmList = data.map(item => item.basicProjectId)
  props.formValue1.bjxmList = formValue.bjxmList
})
defineExpose({ handleDrawerChange })
</script>

<style scoped lang="scss"></style>
