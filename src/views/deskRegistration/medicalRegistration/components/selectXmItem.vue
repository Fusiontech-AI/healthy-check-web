<template>
  <el-drawer v-model="drawerVisible" :title="title" direction="rtl" size="60%">
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
      ref="TransferFilterComplexRef" :isRw="true">
      <template #yiShanChu>
        <el-card shadow="hover" class="mt10px">
          <div class="mb6px">已删除项目（共13项）</div>
          <el-table :data="tableData" style="width: 100%" height="280">
            <el-table-column prop="date" label="项目编码" />
            <el-table-column prop="date" label="项目名称" />
            <el-table-column prop="date" label="原金额" />
            <el-table-column prop="date" label="折扣" />
            <el-table-column prop="date" label="实际金额" />
          </el-table>
        </el-card>
      </template>
    </TransferFilterComplex>

    <template #footer>
      <div style="flex: auto">
        <el-button @click="drawerVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmClick">确定</el-button>
      </div>
    </template>

    <el-dialog v-model="dialogVisible" title="复制项目" width="50%" v-if="dialogVisible">
      <ProTable :columns="tableColumns" :toolButton="false" :data="[{ name: 'aaaaaakaskhaskhahadhsa,d' }]"
        :pagination="false" :searchCol="3" label-position="right">
        <template #gx>
          <el-radio label="" size="large"></el-radio>
        </template>
      </ProTable>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="dialogVisible = false">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </el-drawer>
</template>

<script setup name="selectXmItem" lang="ts">
import TransferFilterComplex from '@/components/TransferFilterComplex'
const drawerVisible = ref(false)
const TransferFilterComplexRef = ref(null)
const formValue = reactive({
  standardAmount: 0,
  discount: 0,
  receivableAmount: 0,
  defaultItemList: []
})
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
})

const dialogVisible = ref(false)
let tableColumns = reactive([])
let tableData = reactive([])
const dataSource = ref([])
const handleDrawerChange = async () => {

  formValue.defaultItemList = props.detailInfo.dataSource.map((item, i) => {
    return {
      sort: i + 1,
      payType: item.payMode,//变更类型(0个人 1单位 2混合支付)
      payStatus: item.payStatus,//缴费状态（0：未缴费，1：已缴费，2：申请退费中，3：已退费，）
      tcFlag: item.projectType,//是否套餐'0'是'1'否
      teamAmount: 0,//单位应收金额
      personAmount: item.receivableAmount,//个人应收金额
      combinProjectCode: '',
      combinProjectName: item.combinProjectName,
      standardAmount: item.standardAmount,
      discount: item.discount,
      receivableAmount: item.receivableAmount,
      id: item.combinationProjectId || item.id //回显取combinationProjectId 新选的取id
    }
  })
  formValue.standardAmount = props.detailInfo.totalStandardAmount
  formValue.receivableAmount = props.detailInfo.totalAmount
  formValue.discount = props.detailInfo.discount
  drawerVisible.value = true
  await nextTick()
  TransferFilterComplexRef.value.defaultItems()

}

const confirmClick = () => {
  props.detailInfo.dataSource = dataSource.value
  props.detailInfo.totalAmount = formValue.receivableAmount
  props.detailInfo.totalStandardAmount = formValue.standardAmount
  props.detailInfo.discount = formValue.discount
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
    { prop: 'name', label: '体检时间', search: { el: 'date-picker', props: { type: 'daterange' } }, isShow: false },
    { prop: 'gx', label: '勾选' },
    { prop: 'name', label: '序号' },
    { prop: 'name', label: '登记时间' },
    { prop: 'name', label: '体检日期' },
    { prop: 'name', label: '业务类型' },
    { prop: 'name', label: '单位名称' },
    { prop: 'name', label: '体检类型' },
    { prop: 'name', label: '任务名称' },
    { prop: 'name', label: '分组名称' },
    { prop: 'name', label: '创建人' },
  ]
}
//复制选择人项目
const handleFzXzr = () => {
  dialogVisible.value = true
  tableColumns = [
    { prop: 'name', label: '证件号/体检号', search: { el: 'input' }, isShow: false },
    { prop: 'name', label: '姓名', search: { el: 'input' }, isShow: false },
    { prop: 'name', label: '体检时间', search: { el: 'date-picker', props: { type: 'daterange' } }, isShow: false },
    { prop: 'gx', label: '勾选' },
    { prop: 'name', label: '序号' },
    { prop: 'name', label: '体检号' },
    { prop: 'name', label: '姓名' },
    { prop: 'name', label: '性别' },
    { prop: 'name', label: '身份证号' },
    { prop: 'name', label: '业务类型' },
    { prop: 'name', label: '体检类型' },
    { prop: 'name', label: '单位名称' },
    { prop: 'name', label: '登记时间' },
  ]
}

const itemChange = (val) => {
  val.rightTableData.forEach(item => {
    item.projectType = item.tcFlag
    item.payMode = '0'
    item.checkStatus = '0'
  })
  dataSource.value = val.rightTableData
}

//整体折扣和折后应收失焦
const handleBlur = (type) => {
  TransferFilterComplexRef.value.handleSelected({}, '', '2', type)
}
defineExpose({ handleDrawerChange })
</script>
<style scoped lang="scss"></style>
