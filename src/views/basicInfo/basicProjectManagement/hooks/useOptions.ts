import { ref } from 'vue'
import { systemList } from '@/api/basicInfo/basicProjectManagement'
//所属类别
export const optionsType = ref([])
//标本类型
export const optionsSample = ref([])
//条码类型
export const optionsCode = ref([])
//是否打印
export const optionsPrint = ref([{ label: '是', value: '0' }, { label: '否', value: '1' }])
//打印申请单
export const optionsApply = ref([{ label: '打印 ', value: '0' }, { label: '不打印', value: '1' }])

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
  optionsType.value = await getOption('bus_sample_category')
  optionsSample.value = await getOption('bus_sample_type')
  optionsCode.value = await getOption('bus_bar_type')
}



