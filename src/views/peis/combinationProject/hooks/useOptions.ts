import { ref } from 'vue'
import { systemList, tjksList } from '@/api/basicInfo/basicProjectManagement'

//科室
export const optionsKS = ref([])

//检查类型
export const optionsCheckType = ref([])

//是否需要标本
export const optionsSpecimenNeedFlag = ref([{ label: '是', value: '0' }, { label: '否', value: '1' }])
//所属标本
export const optionsSpecimenType = ref([])
//所属样本
export const optionsSampleType = ref([])

//项目类型
export const optionsProjectType = ref([])

//财务类别
export const optionsFinancialType = ref([{ label: '是', value: '0' }, { label: '否', value: '1' }])

//是否外送
export const optionsOutFlag = ref([{ label: '是', value: '0' }, { label: '否', value: '1' }])




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


export const getOption = async (params) => {
  const { rows } = await systemList({ dictType: params })
  rows.forEach(item => {
    item.label = item.dictLabel
    item.value = item.dictValue
  });
  return rows
}

export const getList = async () => {
  getTypeList()
  optionsCheckType.value = await getOption('bus_check_type')
  optionsSampleType.value = await getOption('bus_sample_type')
  optionsProjectType.value = await getOption('bus_project_type')
  optionsSpecimenType.value = await getOption('bus_affiliation_specimen')
}





