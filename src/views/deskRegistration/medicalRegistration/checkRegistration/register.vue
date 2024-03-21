<template>
  <el-row :gutter="10" class="p10px">
    <el-col :span="8">
      <el-card shadow="hover">
        <template #header>
          <div class="flex justify-between items-center">
            <!-- 体检次数 -->
            <HowManyMedical ref="howManyMedical" :formValue="formValue" />
            <div>
              <el-button round @click="formValue = formObj"
                v-if="!formValue.healthyCheckStatus || formValue.healthyCheckStatus == 0">清空</el-button>
              <el-button round @click="preview = false" v-if="id && formValue.healthyCheckStatus != 0 && preview"
                type="primary">编辑</el-button>
              <el-button round @click="getDetail"
                v-if="id && !preview && formValue.healthyCheckStatus != 0">取消</el-button>
              <el-button round @click="handleBC('信息')" v-if="id && !preview && formValue.healthyCheckStatus != 0"
                type="primary">保存</el-button>
            </div>
          </div>
        </template>
        <SearchForm ref="formRef" :columns="formColumns" :search-param="formValue" :search-col="2" :rules="rules"
          :disabled="preview" label-position="right" :preview="preview">

          <template #searchcredentialImage>
            <div class="flex justify-around mb-10px">
              <ImageUpload :isShowTip="false" v-model="formValue.credentialImage" :limit="1">
                <template #txt>
                  <div class="absolute top-60%">身份证识别</div>
                </template>
              </ImageUpload>
              <ImageUpload :isShowTip="false" v-model="formValue.credentialImage" :limit="1">

                <template #txt>
                  <div class="absolute top-60%">人脸采集</div>
                </template>
              </ImageUpload>
              <div class="mt30px z-999 w-50px">
                <div class="mb30px">
                  <el-button type="primary" round>拍照</el-button>
                </div>
                <el-button type="primary" round @click="formValue.credentialImage = ''">删除</el-button>
              </div>
            </div>
          </template>

          <template #reserveTimeArr>
            <el-time-picker v-model="formValue.reserveTimeArr" is-range arrow-control range-separator="至"
              start-placeholder="开始时间" end-placeholder="结束时间" v-if="!preview" value-format='HH:mm:ss' />
            <span v-if="preview && formValue.reserveStartTime">{{ formValue.reserveStartTime }} 至 {{
    formValue.reserveEndTime }}</span>
          </template>
        </SearchForm>
      </el-card>
    </el-col>
    <el-col :span="16">
      <el-card shadow="hover">
        <div class="flex justify-between items-center">
          <div>
            个检详情
            缴费状态：{{ filterPayStatus() }}
          </div>
          <div>
            <el-select v-model="value" placeholder="请选择" class="mr10px" v-if="!id || formValue.healthyCheckStatus == 0"
              style="width: 240px;">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <el-button round type="primary" @click="handleDJ" :disabled="detailInfo.dataSource.length == 0"
              v-if="!id || formValue.healthyCheckStatus == 0">登记</el-button>
            <el-button round type="primary" @click="handleDJ"
              v-if="id && formValue.healthyCheckStatus != 0">打印条形码</el-button>
            <el-button round type="primary" @click="handleDJ"
              v-if="id && formValue.healthyCheckStatus != 0">打印导检单</el-button>
            <el-button round type="primary" @click="handleJXDJ"
              v-if="id && formValue.healthyCheckStatus != 0">继续登记</el-button>
            <el-button round type="primary" @click="handleBC"
              v-if="id && formValue.healthyCheckStatus != 0">保存</el-button>
            <el-button round @click="router.go(-1)">返回</el-button>
          </div>
        </div>
      </el-card>
      <el-card shadow="hover" class="mt10px">

        <template #header>
          <div class="flex justify-between items-center">
            <div>
              <span>已选项目</span>
              <span class="m10px"> 检验{{ JYXMSL }}项/共{{ detailInfo.dataSource.length }}项</span>
              <span>原金额 ：{{ detailInfo.standardAmount }}</span>
              <span class="m10px">应收金额 ：{{ detailInfo.receivableAmount }}</span>
              <span>已缴金额 ：{{ detailInfo.paidTotalAmount }}</span>
              <span class="m10px">未缴金额 ：{{ amountWJ }}</span>
            </div>
            <div>
              <el-button round type="danger" @click="handleSC('')">删除</el-button>
              <el-button round type="primary" @click="handleJx">
                <el-icon class="avatar-uploader-icon">
                  <plus />
                </el-icon>个人加项
              </el-button>
            </div>
          </div>
        </template>
        <ProTable :columns="tableColumns" :toolButton="false" :data="detailInfo.dataSource" :pagination="false"
          @selectionChange="selectionChange" ref="proTableRef" height="600">

          <template #operation="{ row, $index }">
            <el-button type="danger" round @click="handleSC($index)"
              :disabled="row.checkStatus == 1 || row.payStatus == 1">删除</el-button>
          </template>
        </ProTable>
      </el-card>
    </el-col>
    <SelectXmItem ref="selectXmItem" :detailInfo="detailInfo" :detailInfoClone="detailInfoClone" />
  </el-row>
</template>

<script setup name="register" lang="ts">
import { cloneDeep, debounce } from 'lodash'
import SelectXmItem from '@/views/deskRegistration/medicalRegistration/components/selectXmItem.vue'
import HowManyMedical from '@/views/deskRegistration/medicalRegistration/components/howManyMedical.vue'
import ImageUpload from '@/components/ImageUpload'
import { formInfoColumns, formRules, tableColumns } from '@/views/deskRegistration/medicalRegistration/checkRegistration/rowColumns.tsx'
import { teamInfoList } from "@/api/groupInspection/inspectionclosing";
import { registerAdd, registerChangeRegCombin, registerInfo, queryRegCombinProjectList, registerUpdate } from '@/api/deskRegistration/medicalRegistration'
import { commonDynamicBilling } from '@/api/peis/projectPort'
import { accSub, getBirthday, getCurrentAgeByBirthDate, getSex } from '@/utils'
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
import type { TabsPaneContext } from 'element-plus'
const formObj = {
  // credentialNumber: '420117199507186555',
  // phone: '18571714455',
  credentialType: '0',
  // name: '123',
  // checkType: '11',
  // reserveTimeArr: [],
  // birthday: '1995-07-18',
  // age: 28,
  // gender: '0',
  // physicalType: 'JKTJ',
  costType: '1',
  payType: '1',
}
const formValue = ref<any>({ ...formObj }) // 基本信息绑定的值
const teamIdList = ref<any>([]) //单位列表
const howManyMedical = ref()
//证件类型change事件
const zjlxChange = (val) => {
  formValue.value.birthday = ''
  formValue.value.age = ''
  formValue.value.gender = ''
  formColumns.value.forEach(item => {
    if (val == '0') {
      if (item.label == '出生日期' || item.label == '年龄' || item.label == '性别') {
        item.search.disabled = true
      }
    } else {
      if (item.label == '出生日期' || item.label == '年龄' || item.label == '性别') {
        item.search.disabled = false
      }
    }
  })
}
//证件号型zjhInput事件
const zjhInput = (val) => {
  getRemote(val)
}
//防抖控制请求次数
const getRemote = debounce((val) => {
  formValue.value.birthday = ''
  formValue.value.age = ''
  formValue.value.gender = ''
  if (formValue.value.credentialType == '0') {
    formValue.value.birthday = getBirthday(val)
    if (getBirthday(val).length === 10) {
      formValue.value.age = getCurrentAgeByBirthDate(formValue.value.birthday)
      formValue.value.gender = getSex(val, 'num')
    }
  }
  howManyMedical.value.getNum()
}, 500)
const formColumns = ref<any>(formInfoColumns(teamIdList, zjlxChange, zjhInput))
const value = ref('')
const options = reactive([])
const checkedList = ref([])
const rules = reactive(formRules)
const selectXmItem = ref(null)
const formRef = ref(null)
const proTableRef = ref(null)
const preview = ref(false)
const router = useRouter();
const route = useRoute();
const info = {
  dataSource: [],
  receivableAmount: 0,
  standardAmount: 0,
  discount: 0,
  packageId: '',
  packageName: '',
  teamAmount: 0,
  paidTotalAmount: 0,
  paidPersonAmount: 0,
  paidTeamAmount: 0,
  personAmount: 0,
}
const detailInfo = ref({ ...info })
const detailInfoClone = ref({ ...info })
const {
  bus_pay_status,
} = toRefs<any>(proxy?.
  useDict(
    'bus_pay_status',
  )
);

const id = ref(route.query.id)

// 获取单位-任务接口
const getTeamIdList = async () => {
  const { data } = await teamInfoList({})
  teamIdList.value = proxy?.handleTree<any>(data)
}
getTeamIdList()

//获得详情
const getDetail = async () => {
  const { data } = await registerInfo({ id: id.value })
  formValue.value = data
  if (data.reserveStartTime && data.reserveEndTime) {
    formValue.value.reserveTimeArr = [data.reserveStartTime, data.reserveEndTime]
  }
  detailInfo.value.standardAmount = data.totalStandardAmount
  detailInfo.value.receivableAmount = data.totalAmount
  detailInfo.value.discount = data.discount
  detailInfo.value.packageId = data.packageId
  detailInfo.value.packageName = data.packageName
  detailInfo.value.teamAmount = data.teamAmount
  detailInfo.value.paidTotalAmount = data.paidTotalAmount
  detailInfo.value.paidTeamAmount = data.paidTeamAmount
  detailInfo.value.paidPersonAmount = data.paidPersonAmount
  detailInfo.value.personAmount = data.personAmount
  data.healthyCheckStatus != 0 && (preview.value = true)
  getXm()
}
//获得需要回显的项目
const getXm = async () => {
  const { data } = await queryRegCombinProjectList({ id: id.value })
  detailInfo.value.dataSource = data.map(item => {
    item.originId = item.id
    return item
  }
  )
  detailInfoClone.value = cloneDeep(detailInfo.value)
}
id.value && getDetail()

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}

//计算未缴金额
const amountWJ = computed(() => {
  return accSub(detailInfo.value.paidTotalAmount, detailInfo.value.receivableAmount)
})
//检验项目数量
const JYXMSL = computed(() => {
  return detailInfo.value.dataSource.filter(item => item.checkType == 1).length
})

//个人加项
const handleJx = () => {
  selectXmItem.value.handleDrawerChange()
}

//登记
const handleDJ = () => {
  formRef.value.validate(async (valid, fields) => {
    if (valid) {
      //登记信息的接口
      formValue.value.businessCategory = '1'
      formValue.value.occupationalType = '1'
      formValue.value.healthyCheckTime = proxy?.$moment().format('YYYY-MM-DD HH:mm:ss')
      formValue.value.reserveStartTime = formValue.value.reserveTimeArr?.[0]
      formValue.value.reserveEndTime = formValue.value.reserveTimeArr?.[1]
      formValue.value.packageId = detailInfo.value.packageId
      const { data } = await registerAdd(formValue.value)
      id.value = data
      data && await handleUpdate('新增')
      // proxy?.$modal.msgSuccess("登记成功");
      !route.query.id && router.push(`/deskRegistration/medicalRegistration-childPage/checkRegistration?id=${data}`);
    }
  })

}

//删除
const handleSC = async (i) => {
  if (i === '' && checkedList.value.length == 0) {
    return proxy?.$modal.msgWarning("请选择项目");
  }
  const txt = i === '' ? `${checkedList.value.length}个` : ''
  await proxy?.$modal.confirm(`<span style="font-weight:bold">是否确定删除选中的${txt}项目？</span><br/> 删除项目后，该记录将不可恢复`)
  const haveAmountCalculationItemBos = detailInfo.value.dataSource.map((item, i) => {
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
      id: item.combinationProjectId,
      xmId: item.id,
      originId: item.originId
    }
  })
  const amountCalculationItemBos = i === '' ? haveAmountCalculationItemBos.filter((item) => checkedList.value.includes(item.xmId)) : haveAmountCalculationItemBos.filter((item, s) => s == i)
  //changeType  //1单项 2总计项 3新增 4删除 5删除全部
  //inputType  //输入类型(1折扣 2应收金额 3收费方式 4个人应收额 5单位应收额)
  const { standardAmount, discount, receivableAmount } = detailInfo.value
  const p = {
    groupFlag: undefined,   //有无分组标志(1有分组)
    regType: '1',//1个检 2团检
    changeType: '4',
    inputType: undefined,
    haveAmountCalculationItemBos, ////存量
    amountCalculationItemBos, ////增量或者减量都传这个
    standardAmount,
    discount,
    receivableAmount
  }
  //状态已检查和已缴费的不允许删除
  p.amountCalculationItemBos = p.amountCalculationItemBos.filter(item => item.checkStatus != 1 && item.payStatus != 1)
  const { data } = await commonDynamicBilling(p)
  if (i === '') {
    for (let index = detailInfo.value.dataSource.length - 1; index >= 0; index--) {
      if (checkedList.value.includes(detailInfo.value.dataSource[index].id) && detailInfo.value.dataSource[index].checkStatus != 1 && detailInfo.value.dataSource[index].payStatus != 1) {
        detailInfo.value.dataSource.splice(index, 1)
      }
    }
  } else {
    detailInfo.value.dataSource.splice(i, 1)
  }
  // detailInfo.value.dataSource = data.amountCalculationItemVos.map(item => {
  //   return {
  //     combinationProjectId: item.id,
  //     combinProjectName: item.combinProjectName,
  //     projectType: item.tcFlag,
  //     standardAmount: item.standardAmount,
  //     discount: item.discount,
  //     receivableAmount: item.receivableAmount,
  //     personAmount: item.receivableAmount,
  //     teamAmount: "0",
  //     payStatus: item.payStatus,
  //     payMode: "0",
  //     checkStatus: "0",
  //     projectRequiredType: "0",
  //     abandonTime: null,
  //     delayTime: null,
  //     delayReason: null,
  //     checkDoctor: null,
  //     checkDoctorName: null,
  //     checkTime: null,
  //     checkResult: null,
  //     addFlag: "1",
  //     checkType: "0"
  //   }
  // })
  detailInfo.value.receivableAmount = data.receivableAmount
  detailInfo.value.discount = data.discount
  detailInfo.value.standardAmount = data.standardAmount
  detailInfo.value.teamAmount = data.teamAmount
  detailInfo.value.paidTotalAmount = data.paidTotalAmount
  detailInfo.value.paidTeamAmount = data.paidTeamAmount
  detailInfo.value.paidPersonAmount = data.paidPersonAmount
  detailInfo.value.personAmount = data.personAmount
  proTableRef.value.clearSelection()
}

//缴费状态过滤
const filterPayStatus = () => {
  let txt = '未缴费'
  bus_pay_status.value.forEach(item => {
    if (item.value == formValue.value.chargeStatus) {
      txt = item.label
    }
  })
  return txt
}

//编辑项目
const handleUpdate = async (type) => {
  const tjRegCombinItemBos = detailInfo.value.dataSource.map(item => {
    const {
      id,
      combinationProjectId,
      standardAmount,
      discount,
      receivableAmount,
      tcFlag,
      projectType, packageId, originId
    } = item
    return {
      combinationProjectId: combinationProjectId || id,
      projectType: projectType || tcFlag,//编辑是projectType,新增是tcFlag
      standardAmount,
      discount,
      receivableAmount,
      personAmount: receivableAmount,
      teamAmount: 0,
      payStatus: "0",
      payMode: "0",
      checkStatus: "0",
      addFlag: "1",
      packageId,
      id: originId
    }
  })
  const {
    receivableAmount,
    standardAmount,
    discount,
    teamAmount,
    paidTotalAmount,
    paidPersonAmount,
    paidTeamAmount,
    personAmount, packageId } = detailInfo.value
  const p = {
    operationType: type == '新增' ? '1' : '3',  //1:登记，2:报道 3:变更项目 4:暂存
    registerId: id.value,
    standardAmount,
    discount,
    receivableAmount,
    personAmount,
    teamAmount,
    paidTotalAmount,
    paidPersonAmount,
    paidTeamAmount,
    tjRegCombinItemBos,
    packageId
  }
  await registerChangeRegCombin(p)
  id.value && proxy?.$modal.msgSuccess("保存成功");
}

//勾选
const selectionChange = (val) => {
  checkedList.value = []
  checkedList.value = val.map(item => item.id)
}

//继续登记
const handleJXDJ = () => {
  router.push(`/deskRegistration/medicalRegistration-childPage/checkRegistration`);
}

//编辑保存
const handleBC = async (type) => {
  formRef.value.validate(async (valid, fields) => {
    if (valid) {
      formValue.value.businessCategory = '1'
      formValue.value.occupationalType = '1'
      formValue.value.healthyCheckTime = proxy?.$moment().format('YYYY-MM-DD HH:mm:ss')
      formValue.value.reserveStartTime = formValue.value.reserveTimeArr?.[0]
      formValue.value.reserveEndTime = formValue.value.reserveTimeArr?.[1]
      formValue.value.packageId = detailInfo.value.packageId
      await registerUpdate(formValue.value)
      type == '信息' && (proxy?.$modal.msgSuccess("修改成功"))
      type == '信息' && (preview.value = true)
      type != '信息' && handleUpdate()
    }
  })
}

watch(() => route.query.id, (newV) => {
  if (!newV) {
    id.value = ''
    detailInfo.value = info
    detailInfo.value.dataSource = []
    formValue.value = formObj
    preview.value = false
  } else {
    id.value = newV
    getDetail()
  }

})

defineExpose({
  formValue, getDetail
})
</script>

<style scoped lang="scss">
:deep(.el-upload--picture-card) {
  width: 120px
}
</style>
