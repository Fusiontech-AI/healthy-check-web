<template>
  <div class="flex p-10px" v-loading="loading">
    <div class="w-260px shrink-0">
      <div>
        <span class="w-70px font-bold text-lg inline-block">{{ formValue.name }}</span>
        <span class="mr-10px">{{ filterGender() }}</span> {{ formValue.age }}岁
      </div>
      <div class="p-15px rounded" style="background-color:#81d3f82b;">
        <div>证件号：{{ formValue.credentialNumber }}</div>
        <div class="mt-5px">手机号：{{ formValue.phone }}</div>
      </div>
      <div class="my20px">体检结果汇总</div>
      <div class="p-15px rounded flex items-center cursor-pointer justify-between "
        :style="{ 'background-color': (formValue.id == activeByListObj.id ? '#81d3f82b' : '#fafafa') }"
        @click="handleTJJGHZ">
        <div>查看详情</div>
        <el-icon>
          <ArrowRightBold />
        </el-icon>
      </div>
      <div class="my20px">体检记录（{{ tjList.length }}）</div>
      <el-scrollbar height="465px">
        <div class="p-15px rounded flex items-center cursor-pointer justify-between mb10px"
          :style="{ 'background-color': (activeByListObj.id == item.id ? '#81d3f82b' : '#fafafa') }"
          @click="handleTJJGHZ(item)" v-for="item in tjList">
          <div>
            <div>{{ item.healthyCheckTime }}</div>
            <div class="mt-5px">{{ item.teamName }}</div>
          </div>
          <el-icon>
            <ArrowRightBold />
          </el-icon>
        </div>
      </el-scrollbar>
    </div>

    <div class="ml10px flex-1">
      <div class="text-lg">{{ !flag ? '体检结果汇总' : '体检记录' }}</div>
      <div class="flex">
        <div class="mr-10px">
          <div class="p10px w-180px mb10px cursor-pointer"
            :style="{ 'background-color': (detailObj.id == item.id ? '#81d3f82b' : '#fafafa') }"
            v-for="item in tjjgList" @click="handleDXXZ(item)">
            {{ item.combinProjectName }}
          </div>
        </div>
        <div style="width:calc(100% - 190px)">
          {{ detailObj.combinProjectName }} <el-button link type="primary" v-if="dataSource.length > 0"
            @click="expandFlag = !expandFlag">一键{{ !expandFlag ? '展开' : "收起" }}</el-button>
          <ProTable :columns="tableColumns" :toolButton="false" :data="dataSource" :pagination="false" ref="proTableRef"
            border height="650" :default-expand-all="expandFlag" v-if="expandFlag">
            <template #expand="{ row }">
              <ProTable :columns="expandColums" :toolButton="false" :data="row.dataSource" :pagination="false"
                ref="proTableRef" height="100" border></ProTable>
            </template>
          </ProTable>
          <ProTable :columns="tableColumns" :toolButton="false" :data="dataSource" :pagination="false" ref="proTableRef"
            border height="650" v-else>

            <template #expand="{ row }">
              <ProTable :columns="expandColums" :toolButton="false" :data="row.dataSource" :pagination="false"
                ref="proTableRef" height="100" border></ProTable>
            </template>
          </ProTable>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup name="howManyMedical" lang="ts">
import { getRegisterPage, queryRegCombinProjectList, queryRegBasicProjectList } from '@/api/deskRegistration/deregistration'
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const props = defineProps({
  formValue: {
    type: Object,
    default: () => { },
  },
})
const loading = ref(false)
const { sys_user_sex, } = toRefs<any>(proxy?.useDict('sys_user_sex'))
const flag = ref(false)
const expandFlag = ref(false)
const tjList = ref([])
const tjjgList = ref([])//体检结果
const activeByListObj = ref({
  ...props.formValue
})
const detailObj = ref({})//详情

const tableColumns = ref([
  { type: 'expand', },
  { prop: 'basicProjectName', label: '项目名称' },
  { prop: 'teamName', label: '单位' },
])
const expandColums = ref([
  { prop: 'checkTime', label: '检查时间' },
  { prop: 'basicProjectName', label: '体检明细项目' },
  { prop: 'checkResult', label: '结果' },
  { prop: 'teamName', label: '单位' },
])
const dataSource = ref([])
//缴费状态过滤
const filterGender = () => {
  let txt = ''
  sys_user_sex.value.forEach(item => {
    if (item.value == props.formValue.gender) {
      txt = item.label
    }
  })
  return txt
}
//获得体检记录
const getTJList = async () => {
  try {
    loading.value = true
    const { rows } = await getRegisterPage({ recordCode: props.formValue.recordCode, pageSize: -1 })
    tjList.value = rows
    await handleTJJGHZ()
  } finally {
    loading.value = false
  }
}
//体检结果汇总和体检记录查详情的
const handleTJJGHZ = async (row) => {
  tjjgList.value = []
  dataSource.value = []
  detailObj.value = {}
  if (row?.id) {
    activeByListObj.value = row
    flag.value = true
  } else {
    activeByListObj.value = props.formValue
    flag.value = false
  }
  const { data } = await queryRegCombinProjectList({ id: row?.id || props.formValue.id })
  tjjgList.value = data
  if (data.length == 0) return
  await handleDXXZ(data[0])
}
//体检项目详情
const handleDXXZ = async (row) => {
  detailObj.value = row
  const { data } = await queryRegBasicProjectList({ id: row.id })
  data.forEach((item) => {
    item.teamName = props.formValue.teamName
    item.checkTime = row.checkTime
    item.dataSource = [item]
  })
  dataSource.value = data
}
watch(() => props.formValue.recordCode, (newV) => {
  getTJList()
}, { immediate: true })
</script>

<style scoped lang="scss"></style>
