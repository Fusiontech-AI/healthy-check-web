<template>
  <div class="text-[14px] h-full flex flex-col justify-between no-card">
    <el-scrollbar height="calc(100vh - 130px)" class="p-10px" >
      <SearchForm ref="formRef" :columns="unitGroupColumns" :search-param="formValue" :rules="rules" v-loading="loading">
        <template #groupTitleComponent>
          <div class="font-bold card_title"><span></span>单位分组</div>
        </template>
        <template #infoTitleComponent>
          <div class="font-bold card_title"><span></span>基础信息</div>
        </template>
        <template #credentialNumberSlot>
          <div class="flex">
            <el-input v-model="formValue.credentialNumber" @input="updateCredentialNum" placeholder="请输入证件号" clearable></el-input>
            <el-button class="ml-1" type="primary" style="padding: 5px 8px;">读取</el-button>
          </div>
        </template>
        <template #contactSeniorityComponent>
          <el-form-item label="接害工龄：" required class="cursor-default">
            <el-row>
              <el-col :span="12">
                <el-form-item label="" prop="contactSeniorityYear" style="width: 100%">
                  <div style="display: flex">
                    <el-input v-model="formValue.contactSeniorityYear" placeholder="请输入" type="number" :min="0" class="mr-1"></el-input>年
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="" prop="contactSeniorityMonth" style="width: 100%">
                  <div style="display: flex">
                    <el-input v-model="formValue.contactSeniorityMonth" placeholder="请输入" type="number" :min="0" class="ml-2 mr-1"></el-input> 月
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
        </template>
        <template #seniorityComponent>
          <el-form-item label="总工龄：" required class="cursor-default">
            <el-row>
              <el-col :span="12">
                <el-form-item label="" prop="seniorityYear" style="width: 100%">
                  <div style="display: flex">
                    <el-input v-model="formValue.seniorityYear" placeholder="请输入" type="number" :min="0" class="mr-1"></el-input>年
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="" prop="seniorityMonth" style="width: 100%">
                  <div style="display: flex">
                    <el-input v-model="formValue.seniorityMonth" placeholder="请输入" type="number" :min="0" class="ml-2 mr-1"></el-input> 月
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
        </template>
      </SearchForm>
    </el-scrollbar>
    <div class="flex justify-end mt-4">
      <el-button @click="hanldeClose">取消</el-button>
      <el-button type="primary" @click="hanldeSubmit">确定</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { unitGroupColumn, rules } from '../rowColumns'
import { teamGroupList } from '@/api/leadershipCockpit/overviewMedicalExaminers'
import { registerAdd } from '@/api/deskRegistration/medicalRegistration';
import { ElMessage, dayjs } from 'element-plus';
import { getBirthday, getCurrentAgeByBirthDate, getSex } from '@/utils';
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { bus_hazardous_factors, bus_job_illumination_source} = toRefs<any>(proxy?.useDict('bus_hazardous_factors', 'bus_job_illumination_source'));

const props = defineProps({
  addShowDrawer: {
    type: Boolean,
    default: false
  },
  teamIdList: {
    type: Array,
    default: () => []
  },
  activeTeamTaskInfo: {
    type: Object,
    default: () => ({})
  }
});

// 证件类型change事件
const updateCredentialType = (val:any)=> {
  formValue.value.birthday = ''
  formValue.value.age = ''
  formValue.value.gender = ''
  if(val == '0') {
    updateCredentialNum(formValue.value.credentialNumber)
  }
  unitGroupColumns.value.forEach((item:any) => {
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
const unitGroupColumns = ref<any>(unitGroupColumn({teamIdList: props.teamIdList, physicalType: '', updateCredentialType}))
const formValue = ref<any>({})
const formRef = ref()
const teamGroupData = ref([]) // 分组数据

// 证件号change事件
const updateCredentialNum = (val:any) => {
  if(!val) return
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
}
// 监听危害因素
watch(()=> formValue.value.hazardFactor, (newV)=> {
  unitGroupColumns.value.forEach((item:any)=> {
    if(item.type == 'hazardFactorOther') {
      item.isShowSearch = newV.includes(item.prop)
    }
  })
})
//监听工种名称
watch(() => formValue.value.jobCode, (newV) => {
  const arr = ['00-44', '00-33', '99-990', '99-9999']
  unitGroupColumns.value.forEach((item:any) => {
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
watch(()=> formValue.value.illuminationSource, (newV)=> {
  formValue.value.jobIlluminationType = ''
  unitGroupColumns.value.forEach((item:any)=> {
    if (item.label == '职业照射种类') {
      if(newV) {
        item.enum = bus_job_illumination_source.value.filter((val: any) => val.busType === newV)
      }else {
        item.enum = []
      }
    }
  })
})
const loading = ref(false)
watch(()=> props.activeTeamTaskInfo, async(newV)=> {
  try {
    loading.value = true
    // 分组列表
    const {rows} = await teamGroupList({taskId: newV?.id, pagesize: -1, filterProject: 0})
    teamGroupData.value = rows
    // 根据体检状态调整字段的显示或隐藏🫥
    unitGroupColumns.value = unitGroupColumn({teamIdList: props.teamIdList, teamGroupList: rows, physicalType: newV?.physicalType, updateCredentialType})
    loading.value = false
  } catch (error) {
    unitGroupColumns.value = unitGroupColumn({teamIdList: props.teamIdList, teamGroupList: [], physicalType: newV?.physicalType, updateCredentialType})
    loading.value = false
  }
}, {immediate: true})

// 打开弹窗和关闭弹窗
watch(()=>props.addShowDrawer, (newV)=> {
  if(newV) {
    formValue.value = {
      teamName: props.activeTeamTaskInfo?.teamName,
      teamId: props.activeTeamTaskInfo?.teamId,
      deptName: props.activeTeamTaskInfo?.deptName,
      taskName: props.activeTeamTaskInfo?.taskName,
      taskId: props.activeTeamTaskInfo?.id,
      physicalType: props.activeTeamTaskInfo?.physicalType,
      gender: '',
      hazardFactor: []
    }
    updateCredentialType('')
  }else {
    formRef.value?.clearValidate()
    formRef.value?.resetFields()
  }
}, {immediate: true})

// 保存提交
const hanldeSubmit = async() => {
  formRef.value.validate(async(valid:any)=> {
    if(valid) {
      try {
        const {reserveTime, dutyStatus, illuminationSource, jobIlluminationType, caseCardType, jobCode, seniorityYear, seniorityMonth, contactSeniorityYear, contactSeniorityMonth, otherJobName, hazardFactor, ...p } = formValue.value
        const params = {
          reserveStartTime: reserveTime?.[0],
          reserveEndTime: reserveTime?.[1],
          businessCategory: '2', // 团检
          occupationalType: formValue.value.physicalType == 'ZYJKTJ'||formValue.value.physicalType == 'FSTJ' ?'0':'1', // 是否职业病
          // healthyCheckTime: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'), // 体检日期
          ...p,
          tjRegisterZybBo: {
            dutyStatus,
            illuminationSource,
            jobIlluminationType,
            caseCardType,
            jobCode,
            seniorityYear,
            seniorityMonth,
            contactSeniorityYear,
            contactSeniorityMonth,
            otherJobName
          },
          tjRegisterZybHazardBos: hazardFactor.map((item:any)=> {
            return {
              hazardFactor: item,
              hazardFactorName: bus_hazardous_factors.value.find((val:any)=> val.dictValue == item)?.dictLabel,
              hazardFactorOther: formValue.value[item]
            }
          })
        }
        await registerAdd(params)
        ElMessage.success('新增成功！')
        emit('closeDialog')
      } catch (error) { }
    }
  })
}

const emit = defineEmits<{
  (e: 'closeDialog'): void;
}>()
const hanldeClose = () => {
  emit('closeDialog')
}
</script>

<style scoped lang="scss">
.card_title {
  display: flex;
  align-items: center;
  margin-bottom: 10px;

  span {
    width: 4px;
    height: 16px;
    margin-right: 4px;
    border-radius: 2px;
    font-weight: bold;
    background: #FF8F33;
  }
}
</style>
