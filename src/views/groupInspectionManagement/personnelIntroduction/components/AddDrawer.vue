<template>
  <div class="text-[14px] h-full flex flex-col justify-between no-card">
    <div>
      <SearchForm ref="formRef" :columns="unitGroupColumns" :search-param="formValue" :rules="rules">
        <template #groupTitleComponent>
          <div class="font-bold card_title"><span></span>单位分组</div>
        </template>
        <template #infoTitleComponent>
          <div class="font-bold card_title"><span></span>基础信息</div>
        </template>
      </SearchForm>
    </div>
    <div class="flex justify-end mt-4">
      <el-button @click="hanldeClose">取消</el-button>
      <el-button type="primary" @click="hanldeSubmit">确定</el-button>
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
  }
}>()
const unitGroupColumns = ref<any>(unitGroupColumn({teamIdList: props.teamIdList}))
const formRef = ref()
const formValue = ref<any>({
  hazardFactor: []
})
// 监听单位id带出任务
watch(()=> formValue.value.teamId, (newVal)=> {
  unitGroupColumns.value.forEach(async(item:any) => {
    if(newVal) {
      // 任务下拉
      if(item.prop == 'taskId') {
        const {rows:taskList} = await getTeamTaskList({teamId: newVal, pagesize: -1, reviewResult: 1}) // 根据单位带出任务列表
        item.enum = taskList
      }
    }else {
      if(item.prop == 'taskId') {
        item.enum = []
      }
      formValue.value.taskId = ''
    }
  });
}, {immediate: true})

// 监听任务id带出分组
watch(()=> formValue.value.taskId, (newVal)=> {
  unitGroupColumns.value.forEach(async(item:any) => {
    if(newVal) {
      // 任务下拉
      if(item.prop == 'teamGroupId') {
        const {rows} = await teamGroupList({taskId: newVal, pagesize: -1, filterProject: 0}) // 根据任务带出分组列表
        item.enum = rows
      }
    }else {
      if(item.prop == 'teamGroupId') {
        item.enum = []
      }
      formValue.value.teamGroupId = ''
    }
  });
}, {immediate: true})

// 保存提交
const hanldeSubmit = async() => {
  const {data} = await insertRegisterData(formValue.value)
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
