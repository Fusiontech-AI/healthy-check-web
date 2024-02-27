import { ref } from 'vue'
import { systemList } from '@/api/basicInfo/basicProjectManagement'
export default function useOption() {
  //所属类别
  const optionsType = ref([])
  //标本类型
  const optionsSample = ref([])
  //条码类型
  const optionsCode = ref([])
  //是否打印
  const optionsPrint = ref([{ label: '是', value: '0' }, { label: '否', value: '1' }])
  //打印申请单
  const optionsApply = ref([{ label: '打印 ', value: '0' }, { label: '不打印', value: '1' }])

  //项目类型
  const itemType = ref([])

  const getOption = async (params) => {
    const { rows } = await systemList({ dictType: params })
    rows.forEach(item => {
      item.label = item.dictLabel
      item.value = item.dictValue
    });
    return rows
  }

  const getList = async () => {
    optionsType.value = await getOption('bus_sample_category')
    optionsSample.value = await getOption('bus_sample_type')
    optionsCode.value = await getOption('bus_bar_type')
    itemType.value = await getOption('bus_project_type')
  }
  getList()

  return { optionsType, optionsSample, optionsCode, optionsPrint, optionsApply, itemType }

}




