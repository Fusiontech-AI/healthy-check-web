<template>
  <div class="text-[14px] h-full flex flex-col justify-between no-card">
    <el-scrollbar height="calc(100vh - 130px)" class="p-10px">
      <SearchForm ref="formRef" :columns="unitGroupColumns" :search-param="formValue" :rules="rules">
        <template #groupTitleComponent>
          <div class="font-bold card_title"><span></span>单位分组</div>
        </template>
        <template #infoTitleComponent>
          <div class="font-bold card_title"><span></span>基础信息</div>
        </template>
        <template #credentialNumberSlot>
          <div class="flex">
            <el-input v-model="formValue.credentialNumberSlot" placeholder="请输入证件号"></el-input>
            <el-button class="ml-1" round type="primary" style="padding: 5px 8px;">读取</el-button>
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
      <el-button round @click="hanldeClose">取消</el-button>
      <el-button round type="primary" @click="hanldeSubmit">确定</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getTeamTaskList, insertRegisterData } from '@/api/groupInspection/taskAudit'
import { unitGroupColumn, rules } from '../rowColumns'
import { teamGroupList } from '@/api/leadershipCockpit/overviewMedicalExaminers'
const props = defineProps<{
  teamIdList: {
    type: any,
    default: []
  },
  activeTeamTaskInfo: {
    [x: string]: any
    type: object,
    default: {}
  }
}>()
const formValue = ref<any>({})

const unitGroupColumns = ref<any>(unitGroupColumn({teamIdList: props.teamIdList, physicalType: ''}))
const formRef = ref()

watch(()=> props.activeTeamTaskInfo, async(newV)=> {
  formValue.value = {
    teamId: newV?.teamName,
    taskId: newV?.taskName,
    physicalType: newV?.physicalType,
    hazardFactor: []
  }
  unitGroupColumns.value = unitGroupColumn({teamIdList: props.teamIdList, physicalType: newV?.physicalType})
},{immediate: true})

watch(()=> formValue.value.hazardFactor, (newV)=> {
  unitGroupColumns.value.forEach((item:any)=> {
    if(item.type == 'hazardFactorOther') {
      item.isShowSearch = newV.includes(item.prop)
    }
  })
})
watch(()=> formValue.value.physicalType, (newV)=> {
  unitGroupColumns.value = unitGroupColumn({teamIdList: props.teamIdList, physicalType: newV})
  console.log(formValue.value, 'formValue.value');
})

// 保存提交
const hanldeSubmit = async() => {
  // const {data} = await insertRegisterData(formValue.value)
  console.log(formRef.value);
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
