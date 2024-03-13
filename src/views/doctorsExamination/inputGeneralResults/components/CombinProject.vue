<template>
  <div>
    <Grid ref="gridRef" :cols="3">
      <GridItem :span="2">
        <div class="p-10px relative" style="height: calc(100vh - 112px); border-left: 1px solid #E8E8E8; border-right: 1px solid #E8E8E8;">
          <div class="card_title">
            {{registerInfo.name}}
            {{ sys_user_sex?.find((val: any) => val.dictValue == registerInfo.gender)?.label}}
            {{registerInfo.age}}岁 共
            <span class="text-red-500"> {{ combinProjectList.length }} </span>
            项 / 已检 <span class="text-red-500">{{ combinProjectList.filter((item:any)=>item.checkStatus == '1')?.length}}</span> 项
          </div>
          <div class="mt-12px">
            <el-tabs v-model="activetabId" type="card" @tab-change="updateTabs">
              <el-tab-pane v-for="item in combinProjectList" :key="item.id" :name="item.id">
                <template #label>
                  <div class="pr-4 relative">
                    {{ item.combinProjectName }}
                    <span
                      v-if="item.checkStatus == '0'"
                      class="text-xs font-normal inline-block text-#F75252 border border-orange-500 border-solid px-1px rounded-sm absolute right--4 top--2"
                      >未检</span
                    >
                    <span
                      v-if="item.checkStatus == '1'"
                      class="text-xs font-normal inline-block text-#31D09A border border-#31D09A border-solid px-1px rounded-sm absolute right--4 top--2"
                      >已检</span
                    >
                  </div>
                </template>
              </el-tab-pane>
            </el-tabs>
          </div>
          <div class="no-card mt-4px">
            <ProTable ref="projectTableRef" :columns="columns" :data="basicProjectList" :pagination="false" row-key="id" height="calc(100vh - 300px)">
              <template #tableHeader="{isSelected, selectedList}">
                <el-button round type="primary" @click="handleSave" :disabled="basicProjectList.length == 0">保存</el-button>
                <el-button round :disabled="!isSelected" @click="handleClear(selectedList)">批量清除</el-button>
                <el-button round :disabled="!isSelected">弃检</el-button>
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
      </GridItem>
      <GridItem :span="1">
        <div class="h-full right_card">
          <project-summary :projectItem="activeTabItem" :basicProjectList="basicProjectList"></project-summary>
          <el-tabs type="card">
            <el-tab-pane label="阳性结果发现" name="1"></el-tab-pane>
            <el-tab-pane label="医学科普" name="2"></el-tab-pane>
          </el-tabs>
          <div class="no-card">
            <ProTable
              :columns="columns2"
              :data="[{ name: '1' }, { name: '1' }, { name: '1' }, { name: '1' }, { name: '1' }, { name: '1' }, { name: '1' }, { name: '1' }, { name: '1' }]"
              :tool-button="false"
              :pagination="false"
              :header-cell-style="{ 'font-size': '12px' }"
              height="calc((100vh - 250px) / 2)"
            ></ProTable>
          </div>
        </div>
      </GridItem>
    </Grid>
  </div>
</template>

<script setup lang="tsx">
import _ from 'lodash'
import { queryRegCombinProjectList } from '@/api/deskRegistration/medicalRegistration';
import { queryRegBasicProjectList, saveDiagnosis } from '@/api/doctorsExamination/inputGeneralResults';
import ProjectSummary from './ProjectSummary.vue';
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const {sys_user_sex, bus_check_result} = toRefs<any>(proxy?.useDict('sys_user_sex', 'bus_check_result'))
const registerInfo = inject<any>('registerInfo', reactive({}))

const columns = ref<any>([
  {type: 'selection'},
  { label: '序号', type: 'index', width: 55 },
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
const columns2 = ref<any>([
  { type: 'selection', fixed: 'left' },
  { label: '建议名称', prop: 'name' },
  { label: '诊断建议', prop: 'name' },
])
const activetabId = ref('')
const activeTabItem = ref<any>({})
const combinProjectList = ref<any>([]) // 组合项目
const basicProjectList = ref<any>([]) // 组合项目下的基础项目
const projectTableRef = ref<any>()

// 批量清除
const handleClear = (selectedList:any)=> {
  selectedList.forEach((item:any)=> {
    item.checkResult = ''
    item.isAbnormal = ''
  })
  projectTableRef.value?.clearSelection()
  ElMessage.success('清除成功！')
}
// 保存
const handleSave = async()=> {
  const params = {
    regId: registerInfo.value.id,
    regItemId: activetabId.value,
    checkDoctorName: activeTabItem.value?.checkDoctorName,
    checkTime: activeTabItem.value?.checkTime,
    regBasicProjects: basicProjectList.value
  }
  await saveDiagnosis(params)
  ElMessage.success('保存成功！')
  // 将未检改为已检
  combinProjectList.value.forEach((item:any, i:any)=> {
    if(item.id == activetabId.value) {
      combinProjectList.value[i].checkStatus = '1'
    }
  })
  getRegBasicProjectList(activetabId.value)
}

const updateTabs = (val:any) => {
  activetabId.value = val
  activeTabItem.value = combinProjectList.value.find((item:any)=> item.id === val)
  getRegBasicProjectList(val)
}
// 根据登记id查询组合项目list信息
const getRegCombinProjectList = async()=> {
  const { data } = await queryRegCombinProjectList({id: registerInfo.value.id})
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
  projectTableRef.value.clearSelection()
}

watch(()=>registerInfo.value, (newV)=> {
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
  &::before {
    content: '';
    width: 4px;
    height: 16px;
    margin-right: 4px;
    border-radius: 2px;
    font-weight: bold;
    background: #FF8F33;
  }
}
.right_card {
  :deep(.el-table) {
    .el-table__inner-wrapper {
      min-height: 0px;
    }
    .el-scrollbar {
      min-height: 0px;
    }
  }
}
</style>
