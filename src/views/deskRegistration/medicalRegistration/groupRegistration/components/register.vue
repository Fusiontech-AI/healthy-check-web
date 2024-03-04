<template>
  <div class="flex p-10px">
    <div class="w-500px">
      <el-card shadow="hover">
        <template #header>
          <div class="flex justify-between items-center">
            <div>
              体检人员信息
            </div>
            <div>
              <el-button round type="primary" v-if="ydjHas" @click="handleDJ">新增</el-button>
              <el-button round @click="formValue = {}"
                v-if="!formValue.healthyCheckStatus || formValue.healthyCheckStatus == 0">清空</el-button>
              <el-button round @click="preview = false" v-if="id && formValue.healthyCheckStatus != 0 && preview"
                type="primary">编辑</el-button>
              <el-button round @click="getDetail(route.query.id)"
                v-if="id && !preview && formValue.healthyCheckStatus != 0">取消</el-button>
              <el-button round @click="handleBC" v-if="id && !preview && formValue.healthyCheckStatus != 0"
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

          <template #jhgl>
            <div class="flex">
              <el-form-item label="" prop="contactSeniorityYear">
                <div class="flex">
                  <el-input v-model="formValue['contactSeniorityYear']" clearable :placeholder="`请输入`"></el-input>
                  <span class="mx20px">年</span>
                </div>
              </el-form-item>

              <el-form-item label="" prop="contactSeniorityMonth">
                <div class="flex">
                  <el-input v-model="formValue['contactSeniorityMonth']" clearable :placeholder="`请输入`"></el-input>
                  <span class="mx20px">月</span>
                </div>
              </el-form-item>

            </div>
          </template>

          <template #zgl>
            <div class="flex">
              <el-form-item label="" prop="seniorityYear">
                <div class="flex">
                  <el-input v-model="formValue['seniorityYear']" clearable :placeholder="`请输入`"></el-input>
                  <span class="mx20px">年</span>
                </div>
              </el-form-item>

              <el-form-item label="" prop="seniorityMonth">
                <div class="flex">
                  <el-input v-model="formValue['seniorityMonth']" clearable :placeholder="`请输入`"></el-input>
                  <span class="mx20px">月</span>
                </div>
              </el-form-item>

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
    </div>
    <div class="flex-1 ml10px">
      <el-card shadow="hover">
        <div class="flex justify-between items-center">
          <div>
            团检详情
            缴费状态：{{ filterPayStatus() }}
          </div>
          <div>
            <el-select v-model="value" placeholder="请选择" class="w-240px mr10px"
              v-if="formValue.healthyCheckStatus == 0">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <el-button round type="primary" @click="handleBC('暂存')" :disabled="detailInfo.dataSource.length == 0"
              v-if="formValue.healthyCheckStatus == 0">暂存</el-button>
            <el-button round type="primary" @click="handleBC('报到')" :disabled="detailInfo.dataSource.length == 0"
              v-if="formValue.healthyCheckStatus == 0">报到</el-button>
            <el-button round type="primary" @click="handleDJ"
              v-if="id && formValue.healthyCheckStatus != 0">打印条形码</el-button>
            <el-button round type="primary" @click="handleDJ"
              v-if="id && formValue.healthyCheckStatus != 0">打印导检单</el-button>
            <el-button round type="primary" @click="handleDJ"
              v-if="id && formValue.healthyCheckStatus != 0">继续登记</el-button>
            <el-button round type="primary" @click="handleUpdate"
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
              <el-button round type="danger" @click="handleSC('')" v-if="!ydjHas">删除</el-button>
              <el-button round type="primary" @click="handleGjJx" v-if="!ydjHas">
                <el-icon class="avatar-uploader-icon">
                  <plus />
                </el-icon>个人加项
              </el-button>
              <el-button round type="primary" @click="handleTjJx" v-if="!ydjHas">
                <el-icon class="avatar-uploader-icon">
                  <plus />
                </el-icon>团体加项
              </el-button>
            </div>
          </div>
        </template>
        <ProTable :columns="tableColumns" :toolButton="false" :data="detailInfo.dataSource" :pagination="false"
          @selectionChange="selectionChange" ref="proTableRef">

          <template #operation="{ $index }">
            <el-button type="danger" round @click="handleSC($index)">删除</el-button>
          </template>
        </ProTable>
      </el-card>
    </div>
    <SelectXmItem ref="selectXmItemGj" :detailInfo="detailInfo" :isTuanJian="true" :detailInfoClone="detailInfoClone" />
    <SelectXmItem ref="selectXmItemTj" title="团体加项" :detailInfo="detailInfo" :isTuanJian="true"
      :detailInfoClone="detailInfoClone" />

    <!-- 选择预登记信息 -->
    <el-dialog title="选择预登记信息" v-model="dialogVisible" width="55%">
      <ProTable ref="proTableRef" :columns="tableColumnsYDJList" :toolButton="false" :request-api="registerPage"
        :request-auto="true" :queryParams="queryParams">
      </ProTable>
      <div class="flex justify-end mt-4">
        <el-button round @click="dialogVisible = false">取消</el-button>
        <el-button round type="primary" @click="handleYDJ">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script setup name="groupRegistrationRegister" lang="ts">
import { cloneDeep } from 'lodash'
import SelectXmItem from '@/views/deskRegistration/medicalRegistration/components/selectXmItem.vue'
import ImageUpload from '@/components/ImageUpload'
import { teamGroupInfo } from '@/api/groupInspectionManagement/taskManagement'
import { registerPage } from '@/api/deskRegistration/medicalRegistration'
import { formInfoColumns, formRules, tableColumns, tableColumnsYDJ } from '@/views/deskRegistration/medicalRegistration/groupRegistration/rowColumns.tsx'
import { teamInfoList } from "@/api/groupInspection/inspectionclosing";
import { registerAdd, registerChangeRegCombin, registerInfo, queryRegCombinProjectList, registerUpdate } from '@/api/deskRegistration/medicalRegistration'
import { teamGroupList } from '@/api/leadershipCockpit/overviewMedicalExaminers'
import { getTeamTaskList } from '@/api/groupInspection/taskAudit'
import { commonDynamicBilling } from '@/api/peis/projectPort'
import { accSub, getBirthday, getCurrentAgeByBirthDate, getSex } from '@/utils'
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
import type { TabsPaneContext } from 'element-plus'
const formObj = {
  credentialNumber: '420117199507186555',
  // phone: '18571714455',
  // name: '123',
  // checkType: '11',
  // reserveTimeArr: [],
  // birthday: '1995-07-18 00:00:00',
  // age: 28,
  // gender: '0',
  // physicalType: 'JKTJ',
  credentialType: '0',
  payType: '1',
  marriageStatus: '2',
  checkType: '11',
}
const formValue = ref<any>(formObj) // 基本信息绑定的值
const teamIdList = ref<any>([]) //单位列表
const taskList = ref<any>([]) //任务列表
const groupList = ref<any>([]) //分组列表

//证件类型change事件
const zjlxChange = (val) => {
  formValue.value.birthday = ''
  formValue.value.age = ''
  formValue.value.gender = ''
  formValue.value.credentialNumber = ''
  formColumns.value.forEach(item => {
    if (item.label == '出生日期' || item.label == '年龄' || item.label == '性别') {
      if (val == '0') {
        item.search.disabled = true
      } else {
        item.search.disabled = false
      }
    }
  })
}
//证件号型zjhInput事件
const zjhInput = async (val) => {
  formValue.value.birthday = ''
  formValue.value.age = ''
  formValue.value.gender = ''
  if (formValue.value.credentialType == '0') {
    formValue.value.birthday = getBirthday(val) + ' ' + '00:00:00'
    if (getBirthday(val).length === 10) {
      formValue.value.age = getCurrentAgeByBirthDate(formValue.value.birthday)
      formValue.value.gender = getSex(val, 'num')
    }
    //根据身份证查询是否有多条登记记录
    if (val.length == 18 && !id.value) {
      const { rows, total } = await registerPage({
        pageNum: 1,
        pageSize: 10,
        credentialNumber: formValue.value.credentialNumber,
        healthyCheckStatus: '0'
      })
      // total == 1 && //router.push(`/deskRegistration/medicalRegistration-childPage/groupRegistration?id=${rows[0].id}`);
      ydjHas.value = false
      total == 1 && (getDetail(rows[0].id))
      total > 1 && (queryParams.params.credentialNumber = formValue.value.credentialNumber, dialogVisible.value = true)
      //要支持预登记
      total == 0 && (refset(), proxy?.$modal.msgWarning("此证件号无预登记信息!"), formValue.value = formObj, ydjHas.value = true)
    }
  }
}
//根据选择的分组显示分组金额和折扣
const teamGroupIdChange = async (val) => {
  detailInfo.value = { ...info }
  formValue.value.actualPrice = ''
  formValue.value.itemDiscount = ''
  groupList.value.forEach(item => {
    if (item.id == val) {
      formValue.value.actualPrice = item.actualPrice
      formValue.value.itemDiscount = item.itemDiscount
    }
  })
  if (!val) return
  const { data } = await teamGroupInfo({ id: val })
  //有分组就要传amountCalGroupBo
  const { groupType, price, groupPayType, addPayType, itemDiscount, addDiscount, groupItemList, standardPrice, actualPrice, packageId } = data
  detailInfo.value.packageId = packageId
  detailInfo.value.amountCalGroupBo = { groupType, price, groupPayType, addPayType, itemDiscount, addDiscount }
  handleChangeGroup(data)
}
//单位change事件
const dwChange = async (val) => {
  taskList.value = []
  formValue.value.taskId = ''
  formValue.value.teamGroupId = ''
  formValue.value.actualPrice = ''
  formValue.value.itemDiscount = ''
  detailInfo.value = { ...info }
  const { rows } = await getTeamTaskList({ teamId: val, pagesize: -1, isAccord: 0 }) // 根据单位带出任务列表
  rows.forEach(item => {
    item.label = item.taskName
    item.value = item.id
  })
  taskList.value = rows
}
//任务change事件
const rwChange = async (val) => {
  //体检类型由任务带出
  formValue.value.physicalType = ''
  taskList.value.forEach(item => {
    if (item.id == val) {
      formValue.value.physicalType = item.physicalType
    }
  })
  groupList.value = []
  formValue.value.teamGroupId = ''
  detailInfo.value = { ...info }
  const { rows } = await teamGroupList({ taskId: val, pagesize: -1, filterProject: 0 }) // 根据任务带出分组列表
  rows.forEach(item => {
    item.label = item.groupName
    item.value = item.id
  })
  groupList.value = rows
}

const formColumns = ref<any>(formInfoColumns(teamIdList, taskList, groupList, zjhInput, zjlxChange, teamGroupIdChange, dwChange, rwChange))
const tableColumnsYDJList = ref<any>(tableColumnsYDJ(teamIdList))
const queryParams = reactive<any>({
  params: {
    credentialNumber: '',
    healthyCheckStatus: '0'
  }
})
const ydjHas = ref(false)
const value = ref('')
const options = reactive([])
const checkedList = ref([])
const rules = reactive(formRules)
const formRef = ref(null)
const proTableRef = ref(null)
const selectXmItemGj = ref(null)
const selectXmItemTj = ref(null)
const preview = ref(false)
const dialogVisible = ref(false)
const router = useRouter();
const route = useRoute();
const info = {
  dataSource: [],
  receivableAmount: 0,
  standardAmount: 0,
  discount: 0,
  packageId: '',
  packageName: '',
  amountCalGroupBo: null,
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
  teamIdList.value = proxy?.handleTree<any>(data) || []
}
getTeamIdList()

//获得详情
const getDetail = async (id) => {
  const { data } = await registerInfo({ id })
  dwChange(data.teamId)//查询任务
  rwChange(data.taskId)//查询分组
  formValue.value = data
  formValue.value.actualPrice = data.tjTeamGroupVo?.price
  formValue.value.itemDiscount = data.tjTeamGroupVo?.itemDiscount
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
  getXm(id)
}
//获得需要回显的项目
const getXm = async (id) => {
  const { data } = await queryRegCombinProjectList({ id })
  detailInfo.value.dataSource = data
  detailInfoClone.value = cloneDeep(detailInfo.value)
}
id.value && getDetail(id.value)

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
const handleGjJx = () => {
  selectXmItemGj.value.handleDrawerChange()
}
//团检加项
const handleTjJx = () => {
  selectXmItemTj.value.handleDrawerChange()
}

//新增预登记
const handleDJ = () => {
  formRef.value.validate(async (valid, fields) => {
    if (valid) {
      //登记信息的接口
      formValue.value.businessCategory = '2' //业务类别（1：个检，2：团检
      formValue.value.occupationalType = '1' //是否职业病(0：是，1：否)
      formValue.value.healthyCheckTime = proxy?.$moment().format('YYYY-MM-DD HH:mm:ss')
      formValue.value.reserveStartTime = formValue.value.reserveTimeArr?.[0]
      formValue.value.reserveEndTime = formValue.value.reserveTimeArr?.[1]
      formValue.value.packageId = detailInfo.value.packageId
      const { data } = await registerAdd(formValue.value)
      // id.value = data
      formValue.value.id = data
      data && await handleUpdate('暂存')
      // proxy?.$modal.msgSuccess("预登记成功");
      ydjHas.value = false
      // router.push(`/deskRegistration/medicalRegistration-childPage/groupRegistration?id=${data}`);
      data && getDetail(data)
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
      teamAmount: item.teamAmount,//单位应收金额
      personAmount: item.personAmount,//个人应收金额
      combinProjectCode: '',
      combinProjectName: item.combinProjectName,
      standardAmount: item.standardAmount,
      discount: item.discount,
      receivableAmount: item.receivableAmount,
      id: item.combinationProjectId,
      xmId: item.id
    }
  })
  const amountCalculationItemBos = i === '' ? haveAmountCalculationItemBos.filter((item) => checkedList.value.includes(item.xmId)) : haveAmountCalculationItemBos.filter((item, s) => s == i)
  //changeType  //1单项 2总计项 3新增 4删除 5删除全部
  //inputType  //输入类型(1折扣 2应收金额 3收费方式 4个人应收额 5单位应收额)
  const { standardAmount, discount, receivableAmount, amountCalGroupBo } = detailInfo.value
  const p = {
    groupFlag: amountCalGroupBo ? '1' : undefined,   //有无分组标志(1有分组)
    regType: '2',//1个检 2团检
    changeType: '4',
    inputType: undefined,
    haveAmountCalculationItemBos, ////存量
    amountCalculationItemBos, ////增量或者减量都传这个
    amountCalGroupBo, //团检分组信息对象
    standardAmount,
    discount,
    receivableAmount
  }
  const { data } = await commonDynamicBilling(p)
  if (i === '') {
    for (let index = detailInfo.value.dataSource.length - 1; index >= 0; index--) {
      if (checkedList.value.includes(detailInfo.value.dataSource[index].id)) {
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
      id, combinationProjectId,
      standardAmount,
      discount,
      receivableAmount,
      tcFlag,
      projectType, addFlag, payMode, teamAmount, personAmount, packageId
    } = item
    return {
      combinationProjectId: combinationProjectId || id,
      projectType: projectType || tcFlag,//编辑是projectType,新增是tcFlag
      standardAmount,
      discount,
      receivableAmount,
      personAmount,
      teamAmount,
      payStatus: "0",
      payMode,
      checkStatus: "0",
      addFlag, packageId, id
    }
  })
  const operationType = type == '报到' ? '2' : type == '暂存' ? '4' : '3' //1:登记，2:报道 3:变更项目 4:暂存
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
    operationType,  //1:登记，2:报道 3:变更项目 4:暂存
    registerId: formValue.value.id,
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
  proxy?.$modal.msgSuccess("操作成功");
  type == '报到' && router.push(`/deskRegistration/medicalRegistration-childPage/groupRegistration?id=${formValue.value.id}`);
  id.value = formValue.value.id
  type != '报到' && getDetail(formValue.value.id)
}

//勾选
const selectionChange = (val) => {
  checkedList.value = []
  checkedList.value = val.map(item => item.id)
}

//编辑保存
const handleBC = (type) => {
  formRef.value?.validate(async (valid, fields) => {
    if (valid) {
      formValue.value.businessCategory = '2'
      formValue.value.occupationalType = '1' //是否职业病(0：是，1：否)
      formValue.value.healthyCheckTime = proxy?.$moment().format('YYYY-MM-DD HH:mm:ss') //体检日期
      formValue.value.reserveStartTime = formValue.value.reserveTimeArr?.[0]
      formValue.value.reserveEndTime = formValue.value.reserveTimeArr?.[1]
      formValue.value.packageId = detailInfo.value.packageId
      await registerUpdate(formValue.value);
      (type != '暂存' && type != '报到') && proxy?.$modal.msgSuccess(`操作成功`);
      (type != '暂存' && type != '报到') && (preview.value = true);
      (type == '暂存' || type == '报到') && handleUpdate(type)
    }
  })
}

//预登记单项确认
const handleYDJ = () => {
  if (!proTableRef.value.radio) return proxy?.$modal.msgWarning("请选择一项");
  getDetail(proTableRef.value.radio)
  dialogVisible.value = false
}

// 重置数据
const refset = () => {
  id.value = ''
  detailInfo.value = info
  formValue.value = formObj
  preview.value = false
}

//切换分组需要重新调用算费接口
const handleChangeGroup = async (row) => {
  if (row.groupItemList.length == 0) return
  const amountCalculationItemBos = row.groupItemList.map((item, i) => {
    return {
      sort: i + 1,
      payType: '1',//变更类型(0个人 1单位 2混合支付)
      payStatus: '0',//缴费状态（0：未缴费，1：已缴费，2：申请退费中，3：已退费，）
      tcFlag: item.include,//是否套餐'0'是'1'否
      teamAmount: item.actualPrice,//单位应收金额
      personAmount: 0,//个人应收金额
      combinProjectCode: '',
      combinProjectName: item.itemName,
      standardAmount: item.standardPrice,
      discount: item.discount,
      receivableAmount: item.actualPrice,
      id: item.itemId,
    }
  })
  //changeType  //1单项 2总计项 3新增 4删除 5删除全部
  //inputType  //输入类型(1折扣 2应收金额 3收费方式 4个人应收额 5单位应收额)
  const p = {
    groupFlag: detailInfo.value.amountCalGroupBo ? '1' : undefined,   //有无分组标志(1有分组)
    regType: '2',//1个检 2团检
    changeType: '3',
    inputType: undefined,
    haveAmountCalculationItemBos: [], ////存量
    amountCalculationItemBos, ////增量或者减量都传这个
    amountCalGroupBo: detailInfo.value.amountCalGroupBo, //团检分组信息对象
    standardAmount: row.standardPrice,
    discount: row.discount,
    receivableAmount: row.actualPrice
  }
  const { data } = await commonDynamicBilling(p)
  detailInfo.value.receivableAmount = data.receivableAmount
  detailInfo.value.discount = data.discount
  detailInfo.value.standardAmount = data.standardAmount
  detailInfo.value.dataSource = data.amountCalculationItemVos.map(item => {
    if (item.tcFlag == 0) {
      item.packageId = detailInfo.value.packageId
    }
    return {
      ...item,
      projectType: item.tcFlag,//项目类型（1：套餐项目，2：加项项目
      payMode: item.payType,
      checkStatus: '0',
      addFlag: item.addFlag  //addFlag	加项标识:1个人加项 2团队加项
    }
  })
}

//根据体检类型区分是职业病还是普通体检
watch(() => formValue.value.physicalType, (newV) => {
  formColumns.value.forEach(item => {
    if (item.label == '在岗状态' || item.label == '危害因素' || item.label == '照射源' || item.label == '职业照射种类' || item.label == '个案卡类别' || item.label == '工种名称' || item.label == '接害工龄' || item.label == '总工龄') {
      if (newV == 'ZYJKTJ') {
        // item.
      } else {

      }
    }

  })

})
watch(() => route.query.id, (newV) => {
  if (!newV) {
    refset()
  } else {
    getDetail(newV)
  }

})
watch(() => ydjHas.value, (newV) => {
  formColumns.value.forEach(item => {
    if (item.label == '单位' || item.label == '任务' || item.label == '分组') {
      if (newV) {
        item.search.disabled = false
      } else {
        item.search.disabled = true
      }
    }
  })
})
</script>

<style scoped lang="scss">
:deep(.el-upload--picture-card) {
  width: 120px
}
</style>
