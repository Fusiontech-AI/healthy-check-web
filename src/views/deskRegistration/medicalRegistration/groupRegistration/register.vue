<template>
  <el-row :gutter="10" class="p10px">
    <el-col :span="8">
      <el-card shadow="hover">
        <template #header>
          <div class="flex justify-between items-center">
            <div>
              体检人员信息
            </div>
            <div>
              <el-button round type="primary" v-if="ydjHas" @click="handleDJ">新增</el-button>
              <el-button round @click="refset('清空')"
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
                  <el-input v-model="formValue['contactSeniorityYear']" clearable :placeholder="`请输入`"
                    style="width: 100px;"
                    oninput="value=value.replace(/[^\d.]/g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3').replace(/^\./g, '')"
                    v-if="!preview"></el-input>
                  <div v-if="preview">{{ formValue['contactSeniorityYear'] }}</div>
                  <span class="mx20px">年</span>
                </div>
              </el-form-item>

              <el-form-item label="" prop="contactSeniorityMonth">
                <div class="flex">
                  <el-input v-model="formValue['contactSeniorityMonth']" clearable :placeholder="`请输入`"
                    style="width: 100px;"
                    oninput="value=value.replace(/[^\d.]/g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3').replace(/^\./g, '')"
                    v-if="!preview"></el-input>
                  <div v-if="preview">{{ formValue['contactSeniorityMonth'] }}</div>
                  <span class="mx20px">月</span>
                </div>
              </el-form-item>

            </div>
          </template>

          <template #zgl>
            <div class="flex">
              <el-form-item label="" prop="seniorityYear">
                <div class="flex">
                  <el-input v-model="formValue['seniorityYear']" clearable :placeholder="`请输入`" style="width: 100px;"
                    oninput="value=value.replace(/[^\d.]/g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3').replace(/^\./g, '')"
                    v-if="!preview">
                  </el-input>
                  <div v-if="preview">{{ formValue['seniorityYear'] }}</div>
                  <span class="mx20px">年</span>
                </div>
              </el-form-item>

              <el-form-item label="" prop="seniorityMonth">
                <div class="flex shrink-0">
                  <el-input v-model="formValue['seniorityMonth']" clearable :placeholder="`请输入`" style="width: 100px;"
                    oninput="value=value.replace(/[^\d.]/g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3').replace(/^\./g, '')"
                    v-if="!preview"></el-input>
                  <div v-if="preview">{{ formValue['seniorityMonth'] }}</div>
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
    </el-col>
    <el-col :span="16">
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
            <el-button round type="primary" @click="handleJXDJ"
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
              <el-button round type="primary" @click="handleGjJx" v-if="!ydjHas">
                <el-icon class="avatar-uploader-icon">
                  <plus />
                </el-icon>团体加项
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
      <SelectXmItem ref="selectXmItemGj" :detailInfo="detailInfo" :isTuanJian="true" :detailInfoClone="detailInfoClone"
        :formValue1="formValue" />
      <SelectXmItem ref="selectXmItemTj" title="团体加项" :detailInfo="detailInfo" :isTuanJian="true"
        :detailInfoClone="detailInfoClone" :formValue1="formValue" />

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
    </el-col>
  </el-row>
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
import {
  queryItemByFactorsCodeAndDutyStauts, queryCompulsoryInspectionProject, queryBasicListByCombinIds
} from "@/api/peis/package";
import { accSub, accAdd, getBirthday, getCurrentAgeByBirthDate, getSex } from '@/utils'
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
import type { TabsPaneContext } from 'element-plus'
const formObj = reactive(
  {
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
    taskId: '',
    teamId: '',
    tjRegisterZybHazardBosTes: []
  }
)
const formValue = ref<any>({ ...formObj }) // 基本信息绑定的值
const teamIdList = ref<any>([]) //单位列表
const taskList = ref<any>([]) //任务列表
const groupList = ref<any>([]) //分组列表
const BJList = ref([])//必检项目
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
      total > 1 && (refset(), queryParams.params.credentialNumber = formValue.value.credentialNumber, dialogVisible.value = true)
      //要支持预登记
      total == 0 && (refset(), proxy?.$modal.msgWarning("此证件号无预登记信息!"), ydjHas.value = true)
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
  if (!val) {
    formValue.value.dutyStatus = ''
    formValue.value.illuminationSource = ''
    formValue.value.jobIlluminationType = ''
    formValue.value.tjRegisterZybHazardBosTes = []
    formValue.value.fs = ''
    formValue.value.sw = ''
    formValue.value.wl = ''
    formValue.value.fc = ''
    formValue.value.hx = ''
    return
  }
  const { data } = await teamGroupInfo({ id: val })
  //有分组就要传amountCalGroupBo
  const { groupType, price, groupPayType, addPayType, itemDiscount, addDiscount, groupItemList, standardPrice, actualPrice, packageId, groupHazardsList, dutyStatus, shineSource, shineType } = data
  //有分组则带出在岗状态和危害因素  照射源  职业照射种类
  formValue.value.dutyStatus = dutyStatus
  formValue.value.illuminationSource = shineSource
  formValue.value.jobIlluminationType = shineType
  formValue.value.tjRegisterZybHazardBosTes = groupHazardsList.map(item => {
    if (item.hazardFactorsCode == 14999) {
      formValue.value.fs = item.hazardFactorsOther
    }
    if (item.hazardFactorsCode == 15999) {
      formValue.value.sw = item.hazardFactorsOther
    }
    if (item.hazardFactorsCode == 13999) {
      formValue.value.wl = item.hazardFactorsOther
    }
    if (item.hazardFactorsCode == 11999) {
      formValue.value.fc = item.hazardFactorsOther
    }
    if (item.hazardFactorsCode == 12999) {
      formValue.value.hx = item.hazardFactorsOther
    }
    return item.hazardFactorsCode
  })
  detailInfo.value.packageId = packageId
  detailInfo.value.amountCalGroupBo = { groupType, price, groupPayType, addPayType, itemDiscount, addDiscount }
  // 预登记切换项目分组时要传,initFlag:'1'
  if (groupType == '1') {
    detailInfo.value.amountCalGroupBo.initFlag = '1'
  }
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
  groupList.value = rows
}
const ZYBChange = async () => {
  const { dutyStatus, tjRegisterZybHazardBosTes, illuminationSource, jobIlluminationType, physicalType } = formValue.value
  if (physicalType == 'FSTJ') {
    if (tjRegisterZybHazardBosTes.length == 0 || !dutyStatus || !jobIlluminationType || !illuminationSource) {
      detailInfo.value = info
      return
    }
  } else {
    if (tjRegisterZybHazardBosTes.length == 0 || !dutyStatus) {
      detailInfo.value = info
      return
    }
  }
  await getBjFun()
}

//获得必检项目
const getBjFun = async (type) => {
  const { dutyStatus, tjRegisterZybHazardBosTes, illuminationSource, jobIlluminationType } = formValue.value
  const p = {
    codeList: tjRegisterZybHazardBosTes,
    dutyStatus,
    shineSource: jobIlluminationType,
    shineType: illuminationSource,
  }
  const { data } = await queryItemByFactorsCodeAndDutyStauts(p)
  formValue.value.BJList = data
  type != '必检' && await handleBJ()
}

const formColumns = ref<any>(formInfoColumns(teamIdList, taskList, groupList, zjhInput, zjlxChange, teamGroupIdChange, dwChange, rwChange, ZYBChange))
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
  bus_pay_status, bus_hazardous_factors, bus_physical_type
} = toRefs<any>(proxy?.
  useDict(
    'bus_pay_status', 'bus_hazardous_factors', 'bus_physical_type'
  )
);

const id = ref(route.query.id)

// 获取单位-任务接口
const getTeamIdList = async () => {
  const { data } = await teamInfoList({})
  teamIdList.value = proxy?.handleTree<any>(data) || []
}
!id.value && getTeamIdList()

//获得详情
const getDetail = async (id) => {
  const { data } = await registerInfo({ id })
  //组装单位任务.分组数据
  teamIdList.value = [{ teamName: data.teamName, id: data.teamId }]
  taskList.value = [{ taskName: data.taskName, id: data.taskId }]
  groupList.value = [{ groupName: data.groupName, id: data.teamGroupId }]
  // await dwChange(data.teamId)//查询任务
  // await rwChange(data.taskId)//查询分组
  // await teamGroupIdChange(data.teamGroupId)//分组
  const { tjRegisterZybHazardVos } = data.tjRegisterZybVo || {}
  data.tjRegisterZybHazardBosTes = tjRegisterZybHazardVos?.map(item => {
    if (item.hazardFactor == 14999) {
      data.fs = item.hazardFactorOther
    }
    if (item.hazardFactor == 15999) {
      data.sw = item.hazardFactorOther
    }
    if (item.hazardFactor == 13999) {
      data.wl = item.hazardFactorOther
    }
    if (item.hazardFactor == 11999) {
      data.fc = item.hazardFactorOther
    }
    if (item.hazardFactor == 12999) {
      data.hx = item.hazardFactorOther
    }
    return item.hazardFactor
  }) || []

  formValue.value = { ...data, ...data?.tjRegisterZybVo, ...data?.tjTeamGroupVo, id: data.id }
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
  //data?.tjTeamGroupVo分组信息
  if (data?.tjTeamGroupVo) {
    const { groupType, price, groupPayType, addPayType, itemDiscount, addDiscount } = data?.tjTeamGroupVo
    detailInfo.value.amountCalGroupBo = { groupType, price, groupPayType, addPayType, itemDiscount, addDiscount }
  }

  data.healthyCheckStatus != 0 && (preview.value = true)
  await getXm(id)
}
//获得需要回显的项目
const getXm = async (id) => {
  const { data } = await queryRegCombinProjectList({ id })
  detailInfo.value.dataSource = data.map(item => {
    item.required = item.projectRequiredType == '1' ? true : false
    item.originId = item.id
    return item
  }
  )
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
const handleGjJx = async () => {
  await getBjFun('必检')
  selectXmItemGj.value.handleDrawerChange()
}
//团检加项
// const handleTjJx = () => {
//   selectXmItemTj.value.handleDrawerChange()
// }

//新增预登记
const handleDJ = () => {
  formRef.value.validate(async (valid, fields) => {
    if (valid) {
      //登记信息的接口
      formValue.value.businessCategory = '2' //业务类别（1：个检，2：团检
      // formValue.value.occupationalType = '1' //是否职业病(0：是，1：否)
      formValue.value.healthyCheckTime = proxy?.$moment().format('YYYY-MM-DD HH:mm:ss')
      formValue.value.reserveStartTime = formValue.value.reserveTimeArr?.[0]
      formValue.value.reserveEndTime = formValue.value.reserveTimeArr?.[1]
      formValue.value.packageId = detailInfo.value.packageId
      if (formValue.value.occupationalType == 0) {//0zyb

        //职业病组装
        const { dutyStatus, illuminationSource, jobIlluminationType, caseCardType, jobCode, seniorityYear, seniorityMonth, contactSeniorityYear, contactSeniorityMonth, tjRegisterZybHazardBosTes, fs, sw, wl, fc, hx, otherJobName } = formValue.value
        formValue.value.tjRegisterZybBo = {
          dutyStatus, illuminationSource, jobIlluminationType, caseCardType, jobCode, seniorityYear, seniorityMonth, contactSeniorityYear, contactSeniorityMonth, otherJobName
        }
        const tjPackageHazardsBoList = []
        tjRegisterZybHazardBosTes.forEach(item => {
          if (item == '14999') {
            tjPackageHazardsBoList.push({
              hazardFactorOther: fs,
              hazardFactorName: (bus_hazardous_factors.value.filter(row => row.dictValue == item))[0].dictLabel,
              hazardFactor: item
            })
          } else if (item == '15999') {
            tjPackageHazardsBoList.push({
              hazardFactorOther: sw,
              hazardFactorName: (bus_hazardous_factors.value.filter(row => row.dictValue == item))[0].dictLabel,
              hazardFactor: item
            })
          } else if (item == '13999') {
            tjPackageHazardsBoList.push({
              hazardFactorOther: wl,
              hazardFactorName: (bus_hazardous_factors.value.filter(row => row.dictValue == item))[0].dictLabel,
              hazardFactor: item
            })
          } else if (item == '11999') {
            tjPackageHazardsBoList.push({
              hazardFactorOther: fc,
              hazardFactorName: (bus_hazardous_factors.value.filter(row => row.dictValue == item))[0].dictLabel,
              hazardFactor: item
            })
          } else if (item == '12999') {
            tjPackageHazardsBoList.push({
              hazardFactorOther: hx,
              hazardFactorName: (bus_hazardous_factors.value.filter(row => row.dictValue == item))[0].dictLabel,
              hazardFactor: item
            })
          } else {
            tjPackageHazardsBoList.push({
              hazardFactorOther: '',
              hazardFactorName: (bus_hazardous_factors.value.filter(row => row.dictValue == item))[0].dictLabel,
              hazardFactor: item
            })
          }

        })
        formValue.value.tjRegisterZybHazardBos = tjPackageHazardsBoList
      }
      const { data } = await registerAdd(formValue.value)
      // id.value = data
      formValue.value.id = data
      data && await handleUpdate('暂存')
      // proxy?.$modal.msgSuccess("预登记成功");
      ydjHas.value = false
      // router.push(`/deskRegistration/medicalRegistration-childPage/groupRegistration?id=${data}`);
      // data && getDetail(data)
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
      xmId: item.id,
      originId: item.originId
    }
  })
  const amountCalculationItemBos = i === '' ? haveAmountCalculationItemBos.filter((item) => checkedList.value.includes(item.xmId)) : haveAmountCalculationItemBos.filter((item, s) => s == i)
  //changeType  //1单项 2总计项 3新增 4删除 5删除全部
  //inputType  //输入类型(1折扣 2应收金额 3收费方式 4个人应收额 5单位应收额)
  const { standardAmount, discount, receivableAmount, amountCalGroupBo } = detailInfo.value
  if (amountCalGroupBo?.initFlag) {
    delete amountCalGroupBo.initFlag
  }
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
      id, combinationProjectId,
      standardAmount,
      discount,
      receivableAmount,
      tcFlag,
      projectType, addFlag, payMode, teamAmount, personAmount, packageId, originId, required
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
      addFlag, packageId, id: originId,
      projectRequiredType: required ? '1' : '0' //0：选检项目，1：必检项目
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
  type == '报到' && (id.value = formValue.value.id);
  (type != '报到' || route.query.id) && getDetail(formValue.value.id)
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
      const { dutyStatus, illuminationSource, jobIlluminationType, caseCardType, jobCode, seniorityYear, seniorityMonth, contactSeniorityYear, contactSeniorityMonth, tjRegisterZybHazardBosTes, fs, sw, wl, fc, hx, tjRegisterZybVo, otherJobName, occupationalType, physicalType, reserveTimeArr } = formValue.value
      //为职业病/放射需要校验必检项目
      if (physicalType == 'ZYJKTJ' || physicalType == 'FSTJ') {
        //职业病/放射才调用
        await getBjFun()
        const { BJList, bjxmList } = formValue.value
        const flag = BJList.some(item => !bjxmList?.includes(item.itemId))
        if (flag) return proxy?.$modal.msgWarning(`必检项目未全部选择!`)
      }
      formValue.value.businessCategory = '2'
      // formValue.value.occupationalType = '1' //是否职业病(0：是，1：否)
      formValue.value.healthyCheckTime = proxy?.$moment().format('YYYY-MM-DD HH:mm:ss') //体检日期
      formValue.value.reserveStartTime = reserveTimeArr?.[0]
      formValue.value.reserveEndTime = reserveTimeArr?.[1]
      formValue.value.packageId = detailInfo.value.packageId
      if (occupationalType == 0) {//0zyb
        //职业病组装
        formValue.value.tjRegisterZybBo = {
          id: tjRegisterZybVo?.id,
          regId: tjRegisterZybVo?.regId,
          dutyStatus, illuminationSource, jobIlluminationType, caseCardType, jobCode, seniorityYear, seniorityMonth, contactSeniorityYear, contactSeniorityMonth, otherJobName
        }
        const tjPackageHazardsBoList = []
        tjRegisterZybHazardBosTes.forEach(item => {
          if (item == '14999') {
            tjPackageHazardsBoList.push({
              // id: tjRegisterZybVo.id,
              regId: tjRegisterZybVo.regId,
              hazardFactorOther: fs,
              hazardFactorName: (bus_hazardous_factors.value.filter(row => row.dictValue == item))[0].dictLabel,
              hazardFactor: item
            })
          } else if (item == '15999') {
            tjPackageHazardsBoList.push({
              // id: tjRegisterZybVo.id,
              regId: tjRegisterZybVo.regId,
              hazardFactorOther: sw,
              hazardFactorName: (bus_hazardous_factors.value.filter(row => row.dictValue == item))[0].dictLabel,
              hazardFactor: item
            })
          } else if (item == '13999') {
            tjPackageHazardsBoList.push({
              // id: tjRegisterZybVo.id,
              regId: tjRegisterZybVo.regId,
              hazardFactorOther: wl,
              hazardFactorName: (bus_hazardous_factors.value.filter(row => row.dictValue == item))[0].dictLabel,
              hazardFactor: item
            })
          } else if (item == '11999') {
            tjPackageHazardsBoList.push({
              // id: tjRegisterZybVo.id,
              regId: tjRegisterZybVo.regId,
              hazardFactorOther: fc,
              hazardFactorName: (bus_hazardous_factors.value.filter(row => row.dictValue == item))[0].dictLabel,
              hazardFactor: item
            })
          } else if (item == '12999') {
            tjPackageHazardsBoList.push({
              // id: tjRegisterZybVo.id,
              regId: tjRegisterZybVo.regId,
              hazardFactorOther: hx,
              hazardFactorName: (bus_hazardous_factors.value.filter(row => row.dictValue == item))[0].dictLabel,
              hazardFactor: item
            })
          } else {
            tjPackageHazardsBoList.push({
              // id: tjRegisterZybVo.id,
              regId: tjRegisterZybVo.regId,
              hazardFactorOther: '',
              hazardFactorName: (bus_hazardous_factors.value.filter(row => row.dictValue == item))[0].dictLabel,
              hazardFactor: item
            })
          }

        })
        formValue.value.tjRegisterZybHazardBos = tjPackageHazardsBoList
      }
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
const refset = (type) => {
  const { credentialNumber, birthday, age, gender } = formValue.value
  id.value = ''
  detailInfo.value = info
  formValue.value = type == '清空' ? { ...formObj } : { ...formObj, credentialNumber, birthday, age, gender }
  preview.value = false
  formRef.value.resetFields()
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
      required: item.required
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

//继续登记
const handleJXDJ = () => {
  router.push(`/deskRegistration/medicalRegistration-childPage/groupRegistration`);
}
//初始化时必检项目的勾选情况
const handleBJ = async () => {
  const arr = detailInfo.value.dataSource.map(item => item.combinationProjectId)
  if (arr.length == 0) return (formValue.value.bjxmList = [])
  const { data } = await queryBasicListByCombinIds(arr)
  //匹配勾选
  formValue.value.bjxmList = data.map(item => item.basicProjectId)
}
//根据体检类型区分是职业病还是普通体检
watch(() => formValue.value.physicalType, (newV) => {
  const arr = ['在岗状态', '危害因素', '个案卡类别', '工种名称', '接害工龄', '总工龄']
  const arr1 = ['照射源', '职业照射种类']
  bus_physical_type.value.forEach(item => {
    if (item.dictValue == newV) {
      formValue.value.occupationalType = item.busType //是否职业病(0：是，1：否)
    }
  })
  formColumns.value.forEach(item => {
    if (arr.includes(item.label)) {
      if (newV == 'ZYJKTJ' || newV == 'FSTJ') {
        item.isShowSearch = true
      } else {
        item.isShowSearch = false
      }
    }
    if (arr1.includes(item.label)) {
      if (newV == 'FSTJ') {
        item.isShowSearch = true
      } else {
        item.isShowSearch = false
      }
    }
  })

})
//监听危害因素显示其他
watch(() => formValue.value.tjRegisterZybHazardBosTes, (newV) => {
  // 其他放射14999
  // 其他生物15999
  // 其他物理13999
  // 其他粉尘11999
  // 其他化学12999
  formColumns.value.forEach(item => {
    if (item.isShowSearch != undefined) {
      if (item.label == '其他放射因素') {
        if (newV.includes('14999')) {
          item.isShowSearch = true
        } else {
          formValue.value.fs = ''
          item.isShowSearch = false
        }
      }
      if (item.label == '其他生物因素') {
        if (newV.includes('15999')) {
          item.isShowSearch = true
        } else {
          formValue.value.sw = ''

          item.isShowSearch = false
        }
      }
      if (item.label == '其他物理因素') {
        if (newV.includes('13999')) {
          item.isShowSearch = true
        } else {
          formValue.value.wl = ''

          item.isShowSearch = false
        }
      }
      if (item.label == '其他粉尘因素') {
        if (newV.includes('11999')) {
          item.isShowSearch = true
        } else {
          formValue.value.fc = ''

          item.isShowSearch = false
        }
      }
      if (item.label == '其他化学因素') {
        if (newV.includes('12999')) {
          item.isShowSearch = true
        } else {
          formValue.value.hx = ''

          item.isShowSearch = false
        }
      }

    }
  })
})
//监听分组 有分组危害因素等都是带出来 的
watch(() => formValue.value.teamGroupId, (newV) => {
  const arr = ['在岗状态', '危害因素', '照射源', '职业照射种类']
  formColumns.value.forEach(item => {
    if (arr.includes(item.label)) {
      if (!newV) {
        item.search.disabled = false
      } else {
        item.search.disabled = true
      }
    }
  })
})
//监听工种名称
watch(() => formValue.value.jobCode, (newV) => {
  const arr = ['00-44', '00-33', '99-990', '99-9999']
  formColumns.value.forEach(item => {
    if (item.label == '其他工种名称') {
      if (!arr.includes(newV)) {
        formValue.value.otherJobName = ''
        item.isShowSearch = false
      } else {
        item.isShowSearch = true
      }
    }
  })
})
//监听路由id
watch(() => route.query.id, (newV) => {
  if (!newV) {
    refset()
  } else {
    id.value = newV
    getDetail(newV)
  }

})
//当输入的身份证没有登记时
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
defineExpose({
  formValue, getDetail
})
</script>

<style scoped lang="scss">
:deep(.el-upload--picture-card) {
  width: 120px
}
</style>
