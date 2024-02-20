<template>
  <div class="tabs">
    <el-tabs type="border-card" tab-position="left" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane :label="item.groupName" :name="item.groupName" v-for="item in props.formSecond">
        <SearchForm :search-param="item" :columns="basicInfoColumnZYB" :searchCol="4" :show-action-group="false"
          :rules="rulesZYB" :disabled="preview" v-if="props.form.physicalType == 'ZYJKTJ'">
        </SearchForm>
        <TransferFilterComplex ref="TransferFilterComplexRef" :tableHeader="tableHeader"
          @itemChange="(val) => itemChange(val, item)" :isRw="true" :formValue="item" :disabled="preview"
          @handleHY="handleHY" />
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
const props = defineProps(['formSecond', 'preview', 'form'])
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
const basicInfoColumnZYB = ref([
  {
    label: '在岗类型 ',
    prop: 'dutyStatus',
    search: { el: 'select' }
  },
  {
    label: '危害因素 ',
    prop: 'groupHazardsList',
    search: { el: 'select', props: { multiple: true } }
  },
])
watch(() => props.formSecond, async (newV) => {
  props.formSecond.forEach((item => {
    const { groupType, price, groupPayType, addPayType, itemDiscount, addDiscount, groupItemList, standardPrice, actualPrice, } = item
    item.groupFlag = '1'
    item.amountCalGroupBo = { groupType, price, groupPayType, addPayType, itemDiscount, addDiscount }
    item.defaultItemList = groupItemList
    item.standardAmount = standardPrice
    item.receivableAmount = actualPrice
  }))
  const { groupName } = newV[0]
  activeName.value = groupName
  await nextTick()
  TransferFilterComplexRef.value.forEach(item => {
    item.defaultItems()
  })
})

const rulesZYB = reactive(
  {
    dutyStatus: [
      { required: true, message: '请选择在岗类型', trigger: 'change' },
    ],
    groupHazardsList: [
      { required: true, message: '请选择危害因素', trigger: 'change' },
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
  // let index = getIndex(tab.props.label)
  // const { groupType, price, groupPayType, addPayType, itemDiscount, addDiscount, groupItemList } = props.formSecond[index]
  // props.formSecond[index].amountCalGroupBo = {
  //   groupType, price, groupPayType, addPayType, itemDiscount, addDiscount
  // }
  // props.formSecond[index].defaultItemList = groupItemList
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
  console.log(123);

  const { rightTableData } = val
  item.groupItemList = rightTableData.map(item => {
    return {
      itemId: item.id,
      itemName: item.combinProjectName,
      combinProjectCode: item.combinProjectCode,
      standardPrice: item.standardAmount,
      actualPrice: item.receivableAmount,
      discount: item.discount,
      include: item.type == '1' ? '1' : '0',
      isRequired: false,
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
  const { groupType, price, groupPayType, addPayType, itemDiscount, addDiscount, groupItemList, standardPrice, actualPrice, } = data
  data.groupFlag = '1'
  data.amountCalGroupBo = { groupType, price, groupPayType, addPayType, itemDiscount, addDiscount }
  data.defaultItemList = groupItemList
  data.standardAmount = standardPrice
  data.receivableAmount = actualPrice
  props.formSecond[index] = data
  TransferFilterComplexRef.value[index].defaultItems()
}
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

.tabs {
  :deep(.el-tabs__item) {
    pointer-events: auto !important;
  }
}
</style>
