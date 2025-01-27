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

  //分组支付方式,加项支付方式
  const payType = ref([])

  //业务类别
  const category = ref([])

  //体检类型
  const physicalType = ref([])

  //婚姻状况
  const marriageStatus = ref([])

  //体检状态
  const healthyCheckStatus = ref([])

  //是否需要总检
  const needGeneralReview = ref([])

  const getOption = async (params) => {
    const { rows } = await systemList({ dictType: params })
    rows.forEach(item => {
      item.label = item.dictLabel
      item.value = item.dictValue
    });
    if (params == 'bus_healthy_check_status') {
      rows.forEach(item => {
        if (item.label == '已终检')
          item.tagType = 'success'
      });
    }
    return rows
  }

  const getList = async () => {
    payType.value = await getOption('bus_group_pay_type')
    category.value = await getOption('bus_category')
    physicalType.value = await getOption('bus_physical_type')
    marriageStatus.value = await getOption('bus_marriage_status')
    const healthyList = await getOption('bus_healthy_check_status')
    healthyCheckStatus.value = healthyList
    needGeneralReview.value = await getOption('bus_need_general_review')

  }
  getList()
  const getteamIdList = async () => {
    const { data } = await teamInfoList()
    data.forEach(item => {
      item.label = item.teamName
      item.value = item.id
    })
    teamIdList.value = data
  }
  getteamIdList()
  return { teamIdList, taskList, printInvoiceList, payTypeList, statusList, checkStatusList, payType, category, physicalType, marriageStatus, healthyCheckStatus, needGeneralReview }
}







