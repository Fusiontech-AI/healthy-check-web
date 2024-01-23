import { ref } from 'vue'
import { systemList } from '@/api/basicInfo/basicProjectManagement'
import { teamInfoList, teamTaskList } from "@/api/groupInspection/inspectionclosing";
//单位名称
export default function useOption() {
  // 单位名称
  const teamIdList = ref([])
  // 任务名称
  const taskList = ref([])
  // 是否打印发票
  const printInvoiceList = ref([
    { label: '否', value: '0' },
    { label: '是', value: '1' }])
  // 支付方式
  const payTypeList = ref([
    { label: '微信', value: '1' },
    { label: '支付宝', value: '2' },
    { label: '现金', value: '3' },
    { label: '银行卡', value: '4' },
  ])
  // 状态
  const statusList = ref([
    { label: '正常', value: '0' },
    { label: '废弃', value: '2' }
  ])

  // 审核状态
  const checkStatusList = ref([
    { label: '待审核', value: '0' },
    { label: '已审核', value: '1' },
    { label: '审核不通过', value: '2' },
  ])

  const getOption = async (params) => {
    const { rows } = await systemList({ dictType: params })
    rows.forEach(item => {
      item.label = item.dictLabel
      item.value = item.dictValue
    });
    return rows
  }

  const getList = async () => {
    // teamIdList.value = await getOption('')
  }
  getList()
  const getteamIdList = async () => {
    const { data } = await teamInfoList()
    const { rows } = await teamTaskList({ pageSize: -1 })
    data.forEach(item => {
      item.label = item.teamName
      item.value = item.id
    })
    rows.forEach(item => {
      item.label = item.taskName
      item.value = item.id
    })
    teamIdList.value = data
    taskList.value = rows
  }
  getteamIdList()
  return { teamIdList, taskList, printInvoiceList, payTypeList, statusList, checkStatusList }
}







