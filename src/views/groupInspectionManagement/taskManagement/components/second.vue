<template>
  <div class="tabs">
    <el-tabs type="border-card" tab-position="left" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane :label="item.groupName" :name="item.groupName" v-for="item in props.formSecond">
        <SearchForm :search-param="item" :columns="columsFun(item)" :searchCol="4" :show-action-group="false"
          :rules="rulesZYB" :disabled="preview"
          v-if="props.form.physicalType == 'ZYJKTJ' || props.form.physicalType == 'FSTJ'">
        </SearchForm>

        <TransferFilterComplex ref="TransferFilterComplexRef" :tableHeader="tableHeader"
          @itemChange="(val) => itemChange(val, item)" :isRw="true" :formValue="item" :disabled="preview"
          @handleHY="handleHY" :tableColumns="tableColumns" :leftHegiht="374"
          :rightHeight="(props.form.physicalType == 'ZYJKTJ' || props.form.physicalType == 'FSTJ') ? 316 : 350">
          <template #TcWh v-if="props.form.physicalType == 'ZYJKTJ' || props.form.physicalType == 'FSTJ'">
            <div class="flex items-center h35px">
              <span>必检项目:</span> <el-checkbox-group v-model="item.bjxmList" :disabled="true" class="mt3px">
                <el-checkbox :label="row.itemId" :value="row.itemId" v-for="row in item.BJList">{{ row.name
                  }}</el-checkbox>
              </el-checkbox-group>
            </div>
          </template>
        </TransferFilterComplex>

        <SearchForm :search-param="item" :columns="basicInfoColumn" :searchCol="4" :show-action-group="false"
          class="mt10px" :rules="rules" :disabled="preview">
        </SearchForm>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="tsx" name="second">
import { teamGroupInfo } from '@/api/groupInspectionManagement/taskManagement'
import TransferFilterComplex from '@/components/TransferFilterComplex.vue'
import {
  queryItemByFactorsCodeAndDutyStauts, queryCompulsoryInspectionProject, queryBasicListByCombinIds
} from "@/api/peis/package";
const props = defineProps(['formSecond', 'preview', 'form'])

const { proxy } = getCurrentInstance() as ComponentInternalInstance
const { bus_hazardous_factors, bus_duty_status, bus_shine_source, bus_job_illumination_source } = toRefs<any>(proxy?.useDict('bus_hazardous_factors', 'bus_duty_status', 'bus_shine_source', 'bus_job_illumination_source'))

const tableHeader = ref([
  {
    prop: 'name',
    label: '项目名称'
  },
  {
    prop: 'standardAmount',
    label: '金额'
  },
  {
    prop: 'receivableAmount',
    label: '折后金额'
  },
])
const tableColumns = [
  {
    label: '项目类型',
    prop: 'tcFlag',
    enum: [
      {
        label: '套餐',
        value: '0'
      },
      {
        label: '项目',
        value: '1'
      },
    ]
  },
  {
    label: '项目名称',
    prop: 'combinProjectName'
  },
  {
    label: '金额',
    prop: 'standardAmount'
  },
  {
    label: '折扣',
    prop: 'discount'
  },
  {
    label: '折后金额',
    prop: 'receivableAmount'
  },
  {
    label: '操作',
    prop: 'cz'
  },
]
const TransferFilterComplexRef = ref(null)
const activeName = ref('')
const basicInfoColumn = ref([
  {
    label: '分组折扣 ',
    prop: 'itemDiscount',
    search: { el: 'input' },
    blur: (val) => handleBlur('6')
  },
  {
    label: '加项折扣 ',
    prop: 'addDiscount',
    search: { el: 'input' },
    blur: (val) => handleBlur('6')
  },
  {
    label: '标准价格（元）',
    prop: 'standardPrice',
    search: { el: 'input', disabled: true }
  },
  {
    label: '折后价格（元）',
    prop: 'actualPrice',
    search: { el: 'input' },
    blur: (val) => handleBlur('2')
  },

])
//根据危害因素编码、在岗状态查询必检项目
const getBJList = async () => {
  const index = getIndex(activeName.value)
  const { hazardsBoList, dutyStatus, shineSource, shineType } = props.formSecond[index]
  if (props.form.physicalType == 'FSTJ') {
    if (hazardsBoList.length == 0 || !dutyStatus || !shineSource || !shineType) {
      props.formSecond[index].defaultItemList = []
      props.formSecond[index].BJList = []
      TransferFilterComplexRef.value[index].defaultItems()
      return
    }
  } else {
    if (hazardsBoList.length == 0 || !dutyStatus) {
      props.formSecond[index].defaultItemList = []
      props.formSecond[index].BJList = []
      TransferFilterComplexRef.value[index].defaultItems()
      return
    }
  }
  await getBjFun(props.formSecond[index])

  //查询必检组合项目
  const k = {
    itemIdList: props.formSecond[index].BJList.map(item => item.itemId),
    combinProjectName: ''
  }
  const data1 = await queryCompulsoryInspectionProject(k)
  //required为true的放右边
  const arr = data1.data.filter(item => item.required)
  arr.forEach(item => item.combinProjectId = item.id)
  props.formSecond[index].defaultItemList = arr.map((item, i) => {
    return {
      sort: i + 1,
      payType: '1',//变更类型(0个人 1单位 2混合支付)
      payStatus: '0',//缴费状态（0：未缴费，1：已缴费，2：申请退费中，3：已退费，）
      tcFlag: '1',//是否套餐'0'是'1'否
      teamAmount: 0,//单位应收金额
      personAmount: item.standardAmount,//个人应收金额
      ...item,
      id: item.combinProjectId
    }
  })
  //重置数据
  TransferFilterComplexRef.value[index].defaultItems()
  ////查询组合项目下基础项目信息看必检项目有没有勾上
  getXmNews(props.formSecond[index])
  //触发一次算费
  TransferFilterComplexRef.value[index].handleSelected({}, 0, '1', '1')
}
//获得必检项目
const getBjFun = async (row) => {
  if (props.form.physicalType != 'ZYJKTJ' && props.form.physicalType != 'FSTJ') return
  const { hazardsBoList, dutyStatus, shineSource, shineType } = row
  if (hazardsBoList.length == 0) return
  const p = {
    codeList: hazardsBoList,
    dutyStatus,
    shineSource,
    shineType,
  }
  const { data } = await queryItemByFactorsCodeAndDutyStauts(p)
  row.BJList = data
}
//查询组合项目下基础项目信息
const getXmNews = async (row) => {
  const arr = row.defaultItemList.map(item => item.combinProjectId || item.id)
  if (arr.length == 0) return
  const { data } = await queryBasicListByCombinIds(arr)
  //匹配勾选
  row.bjxmList = data.map(item => item.basicProjectId)
}
const basicInfoColumnZYB = ref([
  {
    label: '在岗类型 ',
    prop: 'dutyStatus',
    search: { el: 'select' },
    enum: bus_duty_status,
    change: getBJList
  },
  {
    label: '危害因素 ',
    prop: 'hazardsBoList',
    search: { el: 'select', props: { multiple: true }, span: 2 },
    enum: bus_hazardous_factors,
    change: getBJList
  },
  {
    label: '照射源',
    prop: 'shineSource',
    enum: bus_shine_source,
    search: { el: 'select', },
    isShowSearch: false,
    change: getBJList
  },
  {
    label: '职业照射种类',
    prop: 'shineType',
    enum: bus_job_illumination_source,
    search: { el: 'select', },
    isShowSearch: false,
    change: getBJList
  },
  {
    label: '其他放射因素',
    prop: 'fs',
    search: { el: 'input', },
    isShowSearch: false
  },
  {
    label: '其他粉尘因素',
    prop: 'fc',
    search: { el: 'input', },
    isShowSearch: false
  },
  {
    label: '其他生物因素',
    prop: 'sw',
    search: { el: 'input', },
    isShowSearch: false
  },
  {
    label: '其他物理因素',
    prop: 'wl',
    search: { el: 'input', },
    isShowSearch: false
  },
  {
    label: '其他化学因素',
    prop: 'hx',
    search: { el: 'input', },
    isShowSearch: false
  },
])
watch(() => props.formSecond, async (newV) => {
  props.formSecond.forEach((item => {
    //危害因素重新赋值
    // 其他放射14999
    // 其他生物15999
    // 其他物理13999
    // 其他粉尘11999
    // 其他化学12999
    item.hazardsBoList = item.groupHazardsList.map(row => {
      if (row.hazardFactorsCode == 14999) {
        item.fs = row.hazardFactorsOther
      }
      if (row.hazardFactorsCode == 15999) {
        item.sw = row.hazardFactorsOther
      }
      if (row.hazardFactorsCode == 13999) {
        item.wl = row.hazardFactorsOther
      }
      if (row.hazardFactorsCode == 11999) {
        item.fc = row.hazardFactorsOther
      }
      if (row.hazardFactorsCode == 12999) {
        item.hx = row.hazardFactorsOther
      }
      return row.hazardFactorsCode
    })
    item.basicInfoColumnZYB = basicInfoColumnZYB.value
    const { groupType, price, groupPayType, addPayType, itemDiscount, addDiscount, groupItemList, standardPrice, actualPrice, } = item
    item.regType = '2'
    item.amountCalGroupBo = { groupType, price: price ? price : 100000, groupPayType, addPayType, itemDiscount, addDiscount }
    item.defaultItemList = groupItemList.map((item, i) => {
      return {
        sort: i + 1,
        payType: '1',//变更类型(0个人 1单位 2混合支付)
        payStatus: '0',//缴费状态（0：未缴费，1：已缴费，2：申请退费中，3：已退费，）
        tcFlag: item.include,//是否套餐'0'是'1'否
        teamAmount: item.actualPrice,//单位应收金额
        personAmount: 0,//个人应收金额
        combinProjectCode: item.combinProjectCode,
        combinProjectName: item.itemName,
        standardAmount: item.standardPrice,
        discount: item.discount,
        receivableAmount: item.actualPrice,
        id: item.itemId,
        required: item.required
      }
    })
    item.standardAmount = standardPrice
    item.receivableAmount = actualPrice
  }))
  const { groupName } = newV?.[0] || {}
  activeName.value = groupName
  getBjFun(newV?.[0])
  getXmNews(newV?.[0])
  await nextTick()
  TransferFilterComplexRef.value?.forEach(item => {
    item.defaultItems()
  })
})

const rulesZYB = reactive(
  {
    dutyStatus: [
      { required: true, message: '请选择在岗类型', trigger: 'change' },
    ],
    hazardsBoList: [
      { required: true, message: '请选择危害因素', trigger: 'change' },
    ],
    shineSource: [
      { required: true, message: '请选择照射源', trigger: 'change' },
    ],
    shineType: [
      { required: true, message: '请选择职业照射种类', trigger: 'change' },
    ],
    fc: [
      { required: true, message: '请输入其他粉尘因素', trigger: 'blur' },
    ],
    sw: [
      { required: true, message: '请输入其他生物因素', trigger: 'blur' },
    ],
    wl: [
      { required: true, message: '请输入其他物理因素', trigger: 'blur' },
    ],
    hx: [
      { required: true, message: '请输入其他化学因素', trigger: 'blur' },
    ],
    fs: [
      { required: true, message: '请输入其他放射因素', trigger: 'blur' },
    ],
  }
)
//金额校验
const validatePrice = (rule: any, value: any, callback: any) => {
  let pattern = new RegExp('^[0-9]*[1-9][0-9]*$')
  if (value === '') {
    callback()
  } else if (!pattern.test(value)) {
    callback(new Error('请输入正整数'))
  } else {
    callback()
  }
}
const rules = reactive({
  itemDiscount: [
    { required: true, message: '请输入分组折扣', trigger: 'blur' },
    { validator: validatePrice },
  ],
  addDiscount: [
    { required: true, message: '请输入加项折扣', trigger: 'blur' },
    { type: validatePrice },
  ],
  actualPrice: [
    { required: true, message: '请输入折后价格', trigger: 'blur' },
    { type: validatePrice },
  ],
})
//tab切换
const handleClick = (tab, event) => {
  let index = getIndex(tab.props.label)
  // const { groupType, price, groupPayType, addPayType, itemDiscount, addDiscount, groupItemList } = props.formSecond[index]
  // props.formSecond[index].amountCalGroupBo = {
  //   groupType, price, groupPayType, addPayType, itemDiscount, addDiscount
  // }
  // props.formSecond[index].defaultItemList = groupItemList
  getBjFun(props.formSecond[index])
  ////查询组合项目下基础项目信息看必检项目有没有勾上
  getXmNews(props.formSecond[index])
}
//失焦事件
const handleBlur = (val) => {
  let index = getIndex(activeName.value)
  props.formSecond[index].standardAmount = props.formSecond[index].standardPrice
  props.formSecond[index].receivableAmount = props.formSecond[index].actualPrice
  TransferFilterComplexRef.value[index].handleSelected({}, '', '2', val)
}
//根据tabName返回索引
const getIndex = (name) => {
  let index = 0
  props.formSecond.forEach((item, i) => {
    if (item.groupName == name) {
      index = i
    }
  })
  return index
}
const itemChange = (val, item) => {
  const { rightTableData } = val
  item.groupItemList = rightTableData.map(item => {
    return {
      itemId: item.id,
      itemName: item.combinProjectName,
      combinProjectCode: item.combinProjectCode,
      standardPrice: item.standardAmount,
      actualPrice: item.receivableAmount,
      discount: item.discount,
      include: item.tcFlag == '1' ? '1' : '0',
      //type	1套餐 2项目
      //include	是否套餐包含的项目0是1否
      // tcFlag	是否套餐项目标志1是
      required: item.required,
    }
  })
  let { standardAmount, receivableAmount, discount } = item
  item.standardPrice = standardAmount
  item.actualPrice = receivableAmount
  item.discount = discount
}
//还原
const handleHY = async () => {
  let id = ''
  let index = ''
  props.formSecond.forEach((item, i) => {
    if (item.groupName == activeName.value) {
      id = item.id
      index = i
    }
  })
  const { data } = await teamGroupInfo({ id })
  const { groupType, price, groupPayType, addPayType, itemDiscount, addDiscount, groupItemList, standardPrice, actualPrice, groupHazardsList } = data
  data.regType = '2'
  data.amountCalGroupBo = { groupType, price: price ? price : 10000, groupPayType, addPayType, itemDiscount, addDiscount }
  data.standardAmount = standardPrice
  data.receivableAmount = actualPrice
  data.defaultItemList = groupItemList.map((item, i) => {
    return {
      sort: i + 1,
      payType: '1',//变更类型(0个人 1单位 2混合支付)
      payStatus: '0',//缴费状态（0：未缴费，1：已缴费，2：申请退费中，3：已退费，）
      tcFlag: item.include,//是否套餐'0'是'1'否
      teamAmount: item.actualPrice,//单位应收金额
      personAmount: 0,//个人应收金额
      combinProjectCode: item.combinProjectCode,
      combinProjectName: item.itemName,
      standardAmount: item.standardPrice,
      discount: item.discount,
      receivableAmount: item.actualPrice,
      id: item.itemId,
      required: item.required
    }
  })
  data.groupHazardsList == groupHazardsList.map(row => {
    if (row.hazardFactorsCode == 14999) {
      props.formSecond[index].fs = row.hazardFactorsOther
    }
    if (row.hazardFactorsCode == 15999) {
      props.formSecond[index].sw = row.hazardFactorsOther
    }
    if (row.hazardFactorsCode == 13999) {
      props.formSecond[index].wl = row.hazardFactorsOther
    }
    if (row.hazardFactorsCode == 11999) {
      props.formSecond[index].fc = row.hazardFactorsOther
    }
    if (row.hazardFactorsCode == 12999) {
      props.formSecond[index].hx = row.hazardFactorsOther
    }
    return row.hazardFactorsCode
  })

  props.formSecond[index] = data
  TransferFilterComplexRef.value[index].defaultItems(data)
}
//根据其他危害因素展示
const columsFun = (item) => {
  // 其他放射14999
  // 其他生物15999
  // 其他物理13999
  // 其他粉尘11999
  // 其他化学12999
  if (item.groupName != activeName.value) return
  if (!item.basicInfoColumnZYB) {
    item.basicInfoColumnZYB = basicInfoColumnZYB.value
  }
  if (!item.hazardsBoList) {
    item.hazardsBoList = item.groupHazardsList.map(row => {
      if (row.hazardFactorsCode == 14999) {
        item.fs = item.hazardFactorsOther
      }
      if (row.hazardFactorsCode == 15999) {
        item.sw = item.hazardFactorsOther
      }
      if (row.hazardFactorsCode == 13999) {
        item.wl = item.hazardFactorsOther
      }
      if (row.hazardFactorsCode == 11999) {
        item.fc = item.hazardFactorsOther
      }
      if (row.hazardFactorsCode == 12999) {
        item.hx = item.hazardFactorsOther
      }
      return row.hazardFactorsCode
    })
  }
  return item.basicInfoColumnZYB.map(row => {
    if (row.isShowSearch != undefined) {
      if (row.label == '其他放射因素') {
        if (item.hazardsBoList.includes('14999')) {
          row.isShowSearch = true
        } else {
          row.isShowSearch = false
        }
      }
      if (row.label == '其他生物因素') {
        if (item.hazardsBoList.includes('15999')) {
          row.isShowSearch = true
        } else {
          row.isShowSearch = false
        }
      }
      if (row.label == '其他物理因素') {
        if (item.hazardsBoList.includes('13999')) {
          row.isShowSearch = true
        } else {
          row.isShowSearch = false
        }
      }
      if (row.label == '其他粉尘因素') {
        if (item.hazardsBoList.includes('11999')) {
          row.isShowSearch = true
        } else {
          row.isShowSearch = false
        }
      }
      if (row.label == '其他化学因素') {
        if (item.hazardsBoList.includes('12999')) {
          row.isShowSearch = true
        } else {
          row.isShowSearch = false
        }
      }
    }
    return row
  })
}
watch(() => props.form.physicalType, (newV) => {

  basicInfoColumnZYB.value.forEach(item => {
    if (newV == 'FSTJ') {
      (item.isShowSearch != undefined) && (item.isShowSearch = true)
    } else {
      (item.isShowSearch != undefined) && (item.isShowSearch = false)
    }
  })
})
</script>

<style scoped lang="scss">
.group-price {
  background: #F1F5FB;
  border-radius: 4px;
  display: flex;
  align-items: center;
  padding-top: 20px;
}

:deep(.el-tabs--border-card) {
  border: none;
}

.tabsClass {
  .tabs {
    :deep(.el-tabs__item) {
      pointer-events: auto !important;
    }
  }
}
</style>
