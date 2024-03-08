<template>
  <div>
    <div class="p-10px relative" style="height: calc(100vh - 112px); border-left: 1px solid #E8E8E8; border-right: 1px solid #E8E8E8;">
      <div class="card_title">
        <span></span>
        {{registerInfo.name}}
        {{ sys_user_sex?.find((val: any) => val.dictValue == registerInfo.gender)?.label}}
        {{registerInfo.age}}岁 共30项 / 已检15项
      </div>
      <div class="mt-12px">
        <el-tabs v-model="activetabId" type="card" @tab-change="updateTabs">
          <el-tab-pane v-for="item in combinProjectList" :key="item.id" :name="item.id">
            <template #label>
              <div class="pr-4">
                {{ item.combinProjectName }}
                <span v-if="item.checkStatus == '0'"
                  class="text-xs font-normal absolute inline-block text-#F75252 border border-orange-500 border-solid px-1px rounded-sm right-1"
                  >未检</span
                >
                <span v-if="item.checkStatus == '1'"
                  class="text-xs font-normal absolute inline-block text-#31D09A border border-#31D09A border-solid px-1px rounded-sm right-1"
                  >已检</span
                >
              </div>
            </template>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="no-card mt-4px">
        <ProTable :columns="columns" :data="basicProjectList" :pagination="false" row-key="id" height="calc(100vh - 300px)">
          <template #tableHeader="{isSelected}">
            <el-button round type="primary" @click="handleSave" :disabled="basicProjectList.length == 0">保存</el-button>
            <el-button round :disabled="!isSelected">批量清除</el-button>
            <el-button round>弃检</el-button>
            <el-button round>使用上次体检结果</el-button>
            <el-button round>快速录入</el-button>
          </template>
          <template #toolButton>
            <el-button link class="mt-2">查看图片>></el-button>
          </template>
        </ProTable>
      </div>
      <div class="absolute bottom-0 ">
        <span class="mr-18px">检查医生：{{ activeTabItem?.checkDoctorName || '-' }}</span>
        <span>检查日期：{{ activeTabItem?.checkTime || '-' }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="tsx">
import _ from 'lodash'
import { queryRegCombinProjectList } from '@/api/deskRegistration/medicalRegistration';
import { queryRegBasicProjectList, saveDiagnosis } from '@/api/doctorsExamination/inputGeneralResults';
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const {sys_user_sex, bus_check_result} = toRefs<any>(proxy?.useDict('sys_user_sex', 'bus_check_result'))
const props = defineProps({
  registerInfo: {
    type: Object,
    default: () => ({})
  }
})
const columns = ref<any>([
  {type: 'selection'},
  { label: '序号', type: 'index', width: 60 },
  { label: '项目名称', prop: 'basicProjectName', width: 120, },
  {
    label: '明细结果',
    prop: 'checkResult',
    align: 'left',
    render({row}:any) {
      if(row.selectFlag == '1'){
        return <el-select v-model={row.checkResult} placeholder="请选择"></el-select>
      }
      return <el-input v-model={row.checkResult} type="textarea" autosize={{ minRows: 1, maxRows: 3 }} resize="none" placeholder="请输入明细结果"></el-input>
    },
  },
  { label: '单位', prop: 'unit', width: 70 },
  { label: '参考值', prop: 'reference', width: 80},
  {
    label: '提示',
    prop: 'isAbnormal',
    width: 80,
    enum: bus_check_result,
    fieldNames: { label: 'dictLabel', value: 'dictValue' }
  },
  {
    label: '异常',
    prop: 'isAbnormal',
    width: 60,
    render({row}:any) {
      return <el-checkbox v-model={row.isAbnormal} true-value='1' false-value='0'></el-checkbox>
    }
  }
])

const activetabId = ref('')
const activeTabItem = ref<any>({})
const combinProjectList = ref<any>([]) // 组合项目
const basicProjectList = ref<any>([]) // 组合项目下的基础项目

// 保存
const handleSave = async()=> {
  const params = {
    regId: props.registerInfo.id,
    regItemId: activetabId.value,
    checkDoctorName: activeTabItem.value?.checkDoctorName,
    checkTime: activeTabItem.value?.checkTime,
    regBasicProjects: basicProjectList.value
  }
  await saveDiagnosis(params)
  ElMessage.success('保存成功！')
  getRegBasicProjectList(activetabId.value)
}

const updateTabs = (val:any) => {
  activetabId.value = val
  activeTabItem.value = combinProjectList.value.find((item:any)=> item.id === val)
  getRegBasicProjectList(val)
}
// 根据登记id查询组合项目list信息
const getRegCombinProjectList = async()=> {
  const { data } = await queryRegCombinProjectList({id: props.registerInfo.id})
  combinProjectList.value = _.cloneDeep(data|| [])
  activetabId.value = data?.[0]?.id || ''
  activeTabItem.value = data?.[0] || {}
  if(activetabId.value) {
    getRegBasicProjectList(activetabId.value)
  } else {
    basicProjectList.value = []
  }
}
// 根据组合项目id查询基础项目列表
const getRegBasicProjectList = async(id:any)=> {
  if(!id) return
  const {data: list} =  await queryRegBasicProjectList({id})
  basicProjectList.value = _.cloneDeep(list|| [])
}

watch(()=>props.registerInfo, (newV)=> {
  if(newV.id) {
    getRegCombinProjectList()
  }
}, {immediate: true})
</script>

<style scoped lang="scss">
.card_title {
  display: flex;
  align-items: center;
  font-weight: 700;

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
