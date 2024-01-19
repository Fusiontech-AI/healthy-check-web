import { ref } from 'vue'
import { systemList,tjksList} from '@/api/basicInfo/basicProjectManagement'
//计量单位
export const optionsUnit = ref([])
//结果类型
export const optionsResultType = ref([])
//结果获取
export const optionsResultGetWay = ref([])

//科室
export const optionsKS = ref([])

export const getTypeList = async () => {
  const { rows } = await tjksList()
  rows.forEach(item => {
    item.label = item.ksName
    item.value = item.id
  })
  optionsKS.value = rows
}
//适用性别
export const optionsSuitSex = ref([
  { label: '男', value: '0' },
  { label: '女', value: '1' },
  { label: '不限', value: '2' },
])

//进入小结
export const optionsEnterSummary = ref([
  { label: '是', value: '0' },
  { label: '否', value: '1' },
])

//进入报告
export const optionsEnterReport = ref([
  { label: '是', value: '0' },
  { label: '否', value: '1' },
])


export const getOption = async (params) => {
  const { rows } = await systemList({ dictType: params })
  // console.log("🚀 ~ getOption ~ data:", data)
  rows.forEach(item => {
    item.label = item.dictLabel
    item.value = item.dictValue
  });
  return rows
}

export const getList = async () => {
  optionsUnit.value = await getOption('bus_unit')
  optionsResultType.value = await getOption('bus_result_type')
  optionsResultGetWay.value = await getOption('bus_result_gateway')
}





