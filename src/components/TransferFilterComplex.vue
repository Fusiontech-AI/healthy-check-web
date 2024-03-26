<template>
  <div class="tc">
    <el-row>
      <el-col :span="10">
        <el-card shadow="hover">
          <div v-if="formValue.physicalType == 'ZYJKTJ' || formValue.physicalType == 'FSTJ'">套餐/项目检索</div>
          <div style="display: flex;align-items: center;justify-content: space-between;margin-bottom:6px ; ">
            <div v-if="formValue.physicalType != 'ZYJKTJ' && formValue.physicalType != 'FSTJ'">套餐/项目检索</div>
            <el-radio-group v-model="radio1" size="small" @change="radioChange"
              v-if="formValue.physicalType == 'ZYJKTJ' || formValue.physicalType == 'FSTJ'">
              <el-radio-button label="推荐套餐" value="推荐套餐" />
              <el-radio-button label="职业项目" value="职业项目" />
              <el-radio-button label="健康项目" value="健康项目" />
            </el-radio-group>
            <el-input v-model="form.name1" placeholder="请输入" suffix-icon="Search" style="width:50%;"
              :disabled="props.disabled" />
          </div>
          <div>
            <el-table :data="tableData" style="width: 100%" :height="leftHegiht"
              v-el-table-infinite-scroll="handleTableScroll" :infinite-scroll-distance="50"
              :infinite-scroll-disabled="false">
              <el-table-column :prop="item.prop" :label="item.label" v-for="item in props.tableHeader" />
              <el-table-column prop="date" label="操作" width="80">
                <template #default="{ row, $index }">
                  <el-button class="button" @click="handleSelected(row, 0, '3')" type="primary" link
                    :disabled="props.disabled">选中</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
        <slot name="yiShanChu"></slot>

      </el-col>
      <el-col :span="14">
        <el-card shadow="hover" style="margin-left: 10px;">
          <div style="display: flex;align-items: center;justify-content: space-between; ">
            <div> <span v-if="tcObj.name">套餐名称: ({{ tcObj.name }})</span> 已选项目（共{{ rightTableData.length }}项）</div>
            <div>
              <el-button type="danger" round @click="handleSelected({}, '', '5')" :disabled="props.disabled">清空
              </el-button>
              <el-button type="primary" round @click="handleHY" :disabled="props.disabled">还原
              </el-button>
            </div>
          </div>
          <div>
            <ProTable ref="proTableRef" :columns="tableColumns" :toolButton="false" :data="rightTableData"
              label-position="right" :pagination="false" :height="rightHeight">

              <template #discount="{ row, $index }">
                <el-input v-model="row.discount" placeholder="请输入" @blur="handleSelected(row, $index, '1', '1')"
                  oninput="value=value.replace(/[^\d.]/g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3').replace(/^\./g, '')"
                  :disabled="props.disabled || (title == '团体加项' && row.addFlag == '1') || (title == '个人加项' && row.addFlag == '2') || (title == '个人加项' && row.payType == '1')" />
              </template>

              <template #receivableAmount="{ row, $index }">
                <el-input v-model="row.receivableAmount" placeholder="请输入" @blur="handleSelected(row, $index, '1', '2')"
                  oninput="value=value.replace(/[^\d.]/g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3').replace(/^\./g, '')"
                  :disabled="props.disabled" />
              </template>
              <!-- 个费 -->

              <template #personAmount="{ row, $index }">
                <el-input v-model="row.personAmount" placeholder="请输入" @blur="handleSelected(row, $index, '1', '4')"
                  oninput="value=value.replace(/[^\d.]/g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3').replace(/^\./g, '')"
                  :disabled="props.disabled || (title == '团体加项' && row.addFlag == '1') || (title == '个人加项' && row.addFlag == '2') || (title == '团体加项' && row.addFlag == '2' && row.payType == 1) || (title == '个人加项' && row.payType == '1')" />
              </template>
              <!-- 团费 -->

              <template #teamAmount="{ row, $index }">
                <el-input v-model="row.teamAmount" placeholder="请输入" @blur="handleSelected(row, $index, '1', '5')"
                  oninput="value=value.replace(/[^\d.]/g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3').replace(/^\./g, '')"
                  :disabled="props.disabled || row.addFlag == '1' || (title == '团体加项' && row.addFlag == '1') || (title == '个人加项' && row.addFlag == '2') || row.payType == '0'" />
              </template>
              <!-- 支付方式 -->

              <template #payType="{ row, $index }">
                <el-select v-model="row.payType" placeholder="请选择" class="left-select" clearable
                  :disabled="props.disabled || row.addFlag == '1' || (title == '团体加项' && row.addFlag == '1') || (title == '个人加项' && row.addFlag == '2')"
                  @change="handleSelected(row, $index, '1', '3')">
                  <el-option v-for="item in bus_pay_mode" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </template>

              <template #cz="{ row, $index }">
                <el-button class="button" @click="handleSelected(row, $index, '4')" type="primary" link
                  :disabled="props.disabled || (title == '团体加项' && row.addFlag == '1') || (title == '个人加项' && row.addFlag == '2') || row.checkStatus == 1 || row.payStatus == 1"
                  v-if="!row.required || isRw">删除</el-button>
                <ChangeItem v-if="row.required && !isRw" :formValue="formValue" :row="row"
                  :rightTableData="rightTableData" :index="$index" :handleSelected="handleSelected"
                  :disabled="props.disabled || (title == '团体加项' && row.addFlag == '1') || (title == '个人加项' && row.addFlag == '2') || row.checkStatus == 1 || row.payStatus == 1" />
              </template>
            </ProTable>
          </div>
          <slot name="TcWh"></slot>

        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="tsx" name="TransferFilterComplex">
import { getFirstLetter } from '@/utils/pinyin';
import { debounce, isEmpty } from 'lodash'
import type { TabsPaneContext } from 'element-plus'
import { combinationProjectList, commonDynamicBilling, queryPackageAndProjectPages, queryProjectByPackageId, queryOccupationalPackage, queryOccupationalProject } from '@/api/peis/projectPort'
import ChangeItem from "@/views/peis/package/changeItem";
import { accAdd } from '@/utils'
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { bus_pay_mode } = toRefs<any>(proxy?.useDict('bus_pay_mode'));
const props = defineProps({
  tableHeader: {
    type: Array,
    default: () => []
  },
  tableColumns: {
    type: Array,
    default: () => []
  },
  disabled: {
    type: Boolean,
    default: () => false
  },
  isRw: {
    type: Boolean,
    default: () => false
  },
  formValue: {
    type: Object,
    default: () => { }
  },
  title: {
    type: String,
    default: () => ''
  },
  leftHegiht: {
    type: Number,
    default: () => null
  },
  rightHeight: {
    type: Number,
    default: () => null
  },
})
const emit = defineEmits(['itemChange', 'handleHY'])
const tableData = ref([])
const tableDataClone = ref([])
const rightTableData = ref([])
const tcObj = ref({})
const queryObj = reactive({
  standardAmount: 0,
  discount: 0,
  receivableAmount: 0,
  teamAmount: 0,
  paidTotalAmount: 0,
  paidPersonAmount: 0,
  paidTeamAmount: 0,
  personAmount: 0,
})
const form = reactive({
  name: '',
  pageSize: 10,
  pageNum: 1,
  total: 0,
})
const radio1 = ref('推荐套餐')
//获得左侧列表数据
const getLeftProject = async () => {
  const { formValue, isRw } = props
  let { physicalType, groupHazardsList, shineSource, shineType, BJList } = formValue
  let row = []
  let tota = 0
  if (isRw) {
    //职业病 / 放射
    if ((physicalType == "ZYJKTJ" || physicalType == 'FSTJ') && radio1.value != '健康项目') {
      if (radio1.value == '职业项目') {
        shineSource = undefined
        shineType = undefined
        groupHazardsList = undefined
      }
      const { rows, total } = await queryOccupationalPackage({ ...form, physicalType, shineSource, shineType, groupHazardsList })
      row = rows
      tota = total
    } else if (radio1.value == '健康项目') {
      const itemIdList = BJList.map(item => item.itemId)
      //职业病 / 放射 的健康项目
      if (itemIdList.length == 0) return
      const { rows, total } = await queryOccupationalProject({ ...form, itemIdList, combinProjectName: form.name })
      rows.forEach(item => {
        item.name = item.combinProjectName
        item.receivableAmount = item.standardAmount
      })
      row = rows
      tota = total
    } else {
      //查询套餐和项目混合分页的健康的登记,任务,非职业病
      const { rows, total } = await queryPackageAndProjectPages({ ...form })
      row = rows
      tota = total
    }

  } else {
    //只查询单项的套餐维护用的
    const { rows, total } = await combinationProjectList({ combinSimpleName: form.name, ...form })
    row = rows
    tota = total
  }

  if (tableDataClone.value.length == tota) return
  tableData.value = [...tableData.value, ...row]
  tableDataClone.value = [...tableDataClone.value, ...row]
  form.total = tota
  filterList()
}
// getLeftProject()
const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}

//选中or单项删除 type为true为删除
/**
 *
 * @param row  选中或者删除那一条的数据
 * @param index 索引 选中单项是1  选中套餐不传  删除传它的索引
 * @param changeType  1单项 2总计项 3新增 4删除 5删除全部
 * @param inputType 输入类型(1折扣 2应收金额 3收费方式 4个人应收额 5单位应收额 6分组或加项折扣)
 */
const handleSelected = async (row, index, changeType, inputType) => {
  if (!row.payType) {
    if (props.title == '个人加项') {
      row.payType = '0'
    } else {
      row.payType = '1'
    }
  }
  //体检套餐维护和选择套餐单项的不一样所以这里字段要转一下
  row.combinProjectName = row.name ?? row.combinProjectName
  row.combinProjectCode = row.pySimpleCode ?? row.combinProjectCode
  const { standardAmount, discount, combinProjectCode, combinProjectName, id, type, addFlag, payType, originId, checkType } = row
  //changeType  //1单项 2总计项 3新增 4删除 5删除全部
  //inputType  //输入类型(1折扣 2应收金额 3收费方式 4个人应收额 5单位应收额)
  const sort = changeType ? index + 1 : 1
  const p = {
    groupFlag: props.formValue?.amountCalGroupBo ? '1' : undefined,   //有无分组标志(1有分组)
    regType: props.formValue.regType || '1',//1个检 2团检
    changeType,
    inputType,
    haveAmountCalculationItemBos: rightTableData.value, ////存量
    amountCalculationItemBos: [], ////增量或者减量都传这个
    amountCalGroupBo: props.formValue?.amountCalGroupBo  //团检分组信息对象
  }

  //说明是清空全部的
  if (changeType == '5') {
    p.changeType = '4'
    if (props.title == '个人加项') {
      p.amountCalculationItemBos = rightTableData.value.filter(item => item.addFlag == 1)
    } else if (props.title == '团体加项') {
      p.amountCalculationItemBos = rightTableData.value.filter(item => item.addFlag == 2)
    } else {
      p.amountCalculationItemBos = rightTableData.value
    }
    //状态已检查和已缴费的不允许删除   还有必检项目不能删
    p.amountCalculationItemBos = p.amountCalculationItemBos.filter(item => item.checkStatus != 1 && item.payStatus != 1 && (!item.required || props.isRw))
  } else if (changeType == '3' || changeType == '4') {
    //新增还是删除
    if (props.isRw && type == 1) {
      //为套餐查子项
      const { data } = await queryProjectByPackageId({ packageId: id })
      //先选单项再选套餐会出现重复项
      const combinProjectCodeArr = rightTableData.value.map(item => item.id)
      const arr = data.filter(item => !combinProjectCodeArr.includes(item.id))
      const zxList = []
      arr.forEach((item, i) => {
        const {
          discount,
          id,
          name,
          pySimpleCode,
          receivableAmount,
          standardAmount,
          checkType
        } = item
        const tcFlag = isEmpty(tcObj.value) ? "0" : '1'
        zxList.push(id)
        //如果查出来有
        p.amountCalculationItemBos.push({
          id,
          sort: i + 1,
          standardAmount,
          discount, combinProjectCode: pySimpleCode, combinProjectName: name, receivableAmount,
          payType,//变更类型(0个人 1单位 2混合支付)
          payStatus: '0',
          tcFlag,
          teamAmount: payType != '0' ? receivableAmount : 0,
          personAmount: payType == '0' ? receivableAmount : 0,
          addFlag: props.title == '个人加项' ? '1' : '2',//加项标识:1个人加项 2团队加项
          originId: null,
          checkType
        })
      })
      //第一次选的则为套餐后面的则为加项
      if (isEmpty(tcObj.value)) {
        //记录套餐 和子项
        tcObj.value = { ...row, zxList }
      }
    } else {
      p.amountCalculationItemBos.push({
        id,
        sort,
        standardAmount,
        discount, combinProjectCode, combinProjectName,
        receivableAmount: standardAmount,
        payType,//变更类型(0个人 1单位 2混合支付)
        payStatus: '0',
        tcFlag: '1',
        teamAmount: payType != '0' ? standardAmount : 0,
        personAmount: payType == '0' ? standardAmount : 0,
        addFlag: props.title == '个人加项' ? '1' : '2',//加项标识:1个人加项 2团队加项
        originId,
        checkType
      })
    }

  } else if (changeType == '1') {
    //变更类型(0个人 1单位 2混合支付)
    //当为支付方式变更时不应收金额需要不变
    if (inputType != 3) {
      p.haveAmountCalculationItemBos.forEach(item => {
        if (payType == 0) {
          item.receivableAmount = item.personAmount
        } else if (payType == 1) {
          item.receivableAmount = item.teamAmount
        } else if (payType == 2) {
          item.receivableAmount = accAdd(item.personAmount, item.teamAmount)
        }
      })
    }

    p.sort = sort
  }
  //没有已选项时总折扣和总应收额不触发
  if (changeType == '2' && rightTableData.value.length == 0) return

  //传实际金额折扣和折后金额
  for (const key in queryObj) {
    p[key] = props.formValue[key]
  }

  const { data } = await commonDynamicBilling(p)
  rightTableData.value = data.amountCalculationItemVos
  for (const key in queryObj) {
    props.formValue[key] = data[key]
  }
}

//数据过滤
const filterList = () => {
  const combinProjectCodeArr = rightTableData.value.map(item => item.id)
  //当右边所有项不包含已选套餐的子项时 恢复套餐
  const flag = combinProjectCodeArr.some(item => tcObj.value.zxList?.includes(item))
  if (!flag) {
    tcObj.value = {}
  }
  //过滤左侧
  tableData.value = tableDataClone.value.filter(item => !combinProjectCodeArr.includes(item.id) && item.id !== tcObj.value.id)
}

// // 距离底部多少则触发加载
// :infinite-scroll-distance="50"
// // 首次加载是否禁用
// :infinite-scroll-disabled="true"
//表格滚动分页事件
const handleTableScroll = () => {
  if (tableDataClone.value.length >= form.total) return
  form.pageNum++
  getLeftProject()
}

watch(() => rightTableData.value, (newV) => {
  filterList()
  if (props.isRw) {
    props.formValue.packageId = tcObj.value.id
    props.formValue.packageName = tcObj.value.name
  }
  emit('itemChange', { rightTableData: newV, formValue: props.formValue })
})
watch(() => form.name1, (newVal) => {
  //转换成大写
  form.name = getFirstLetter(newVal);
  getRemote()
})

//回显
const defaultItems = (data) => {
  let result = props.formValue
  if (data) {
    result = data
  }
  const { packageId, defaultItemList, packageName } = result
  const zxList = defaultItemList.map(item => {
    //套餐的放一起
    if (item.tcFlag == '0') {
      return item.id
    }
    return item.itemId
  })
  tcObj.value = { id: packageId, name: packageName, zxList }

  rightTableData.value = defaultItemList
}

//还原接口调用
const handleHY = () => {
  emit('handleHY')
}

const getRemote = debounce(() => {
  form.pageNum = 1
  tableData.value = []
  tableDataClone.value = []
  getLeftProject()
}, 500)
//radioChange
const radioChange = () => {
  getRemote()
}
defineExpose({ handleSelected, defaultItems, getRemote })
</script>

<style scoped lang="scss">
:deep(.el-tabs__nav-wrap::after) {
  height: 0;
}

:deep(.el-tabs__item) {
  padding: 0 10px;
}
</style>
