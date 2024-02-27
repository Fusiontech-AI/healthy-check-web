import { ref } from 'vue'
import { systemList, tjksList } from '@/api/basicInfo/basicProjectManagement'

export default function useOption() {
  //计量单位
  const optionsUnit = ref([])
  //结果类型
  const optionsResultType = ref([])
  //结果获取
  const optionsResultGetWay = ref([])
  //科室
  const optionsKS = ref([])
  //适用性别
  const optionsSuitSex = ref([
    { label: '男', value: '0' },
    { label: '女', value: '1' },
    { label: '不限', value: '2' },
  ])
  //进入小结
  const optionsEnterSummary = ref([
    { label: '是', value: '0' },
    { label: '否', value: '1' },
  ])
  //进入报告
  const optionsEnterReport = ref([
    { label: '是', value: '0' },
    { label: '否', value: '1' },
  ])
  const getTypeList = async () => {
    const { rows } = await tjksList()
    rows.forEach(item => {
      item.label = item.ksName
      item.value = item.id
    })
    optionsKS.value = rows
  }
  getTypeList()
  const getOption = async (params) => {
    const { rows } = await systemList({ dictType: params })
    // console.log("🚀 ~ getOption ~ data:", data)
    rows.forEach(item => {
      item.label = item.dictLabel
      item.value = item.dictValue
    });
    return rows
  }

  const getList = async () => {
    optionsUnit.value = await getOption('bus_unit')
    optionsResultType.value = await getOption('bus_result_type')
    optionsResultGetWay.value = await getOption('bus_result_gateway')
  }
  getList()
  return {
    optionsUnit,
    optionsResultType,
    optionsResultGetWay,
    optionsKS,
    optionsSuitSex,
    optionsEnterSummary,
    optionsEnterReport
  }

}






