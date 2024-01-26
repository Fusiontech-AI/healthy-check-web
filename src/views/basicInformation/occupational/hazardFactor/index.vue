<template>
  <div class="bg-#fff">
    <Grid ref="gridRef" :cols="5">
      <GridItem :span="1">
        <div class="left_box">
          <div class="p-10px">
            <div class="text-18px font-medium">危害因素分类</div>
            <el-input v-model="searchTreeValue" class="mt-2" placeholder="请输入关键字" @input="getTreeData"></el-input>
          </div>
          <el-scrollbar class="px-10px" height="calc(100vh - 205px)">
            <el-tree v-loading="treeLoading" class="tree_root" highlight-current :data="treeData"
              :default-expanded-keys="['all']" node-key="code" :props="defaultProps" @node-click="handleNodeClick">
            </el-tree>
          </el-scrollbar>
        </div>
      </GridItem>
      <GridItem :span="4">
        <div class="p-10px pb-2px">
          <span class="tab_btn" :class="activeTabValue == item.name && 'active'" v-for="item in tabList" :key="item.name"
            @click="updateTabs(item.name)">{{ item.label }}</span>
        </div>
        <div class="divider"></div>
        <div>
          <pro-table v-if="activeTabValue !== '7'" ref="proTableRef" :columns="columns" :toolButton="false"
            :request-api="getTableList" :data-callback="dataCallback" :isShowSearch="true" rowKey="id">
            <template #tableHeader="{ selectedListIds }">
              <el-button round type="primary" @click="onpenDrawer({})">新增</el-button>
              <el-button round @click="handleDel(selectedListIds)">批量删除</el-button>
            </template>
            <template #operation="{ row }">
              <el-button round type="primary" link @click="onpenDrawer(row, true)">详情</el-button>
              <el-button round type="primary" link @click="onpenDrawer(row)">编辑</el-button>
              <el-button round type="primary" link @click="handleDel([row.id])">删除</el-button>
            </template>
          </pro-table>
          <div v-else class="pr-30%">
            <SearchForm ref="pjbzFormRef" :columns="fields" :search-param="formValue" :rules="rules" :searchCol="1"
              :preview="false" :disabled="isDetail"></SearchForm>
            <div class="flex justify-center mt-4">
              <el-button type="primary" @click="handleSubmit"
                :disabled="(!treeNodeClickObj || Object.keys(treeNodeClickObj).length === 0) && !isDetail">{{ isDetail ?
                  '编辑' : '保存'
                }}</el-button>
            </div>
          </div>
        </div>
      </GridItem>
    </Grid>
    <el-drawer v-model="showDrawer" :title="drawerTitle" size="40%">
      <div class="h-full flex flex-col justify-between">
        <SearchForm style="background: transparent; padding: 18px 30px;" ref="formRef" :columns="fields"
          :search-param="formValue" :rules="rules" :searchCol="1" :preview="false" :disabled="isDetail">
          <!-- 照射源 -->
          <template #shineSource>
            <el-select v-model="formValue.shineSource" @change="changeShineSource" clearable filterable
              style="width: 70%">
              <el-option v-for="item in bus_shine_source" :label="item.label" :value="item.value"
                :key="item.value"></el-option>
            </el-select>
          </template>
          <!-- 职业照射种类 -->
          <template #shineTypeSlot>
            <el-select v-model="formValue.shineType" clearable filterable style="width: 70%">
              <el-option v-for="item in shineTypeOption" :key="item.value" :label="item.label"
                :value="item.value"></el-option>
            </el-select>
          </template>
          <template #selectItemListSlot>
            <div class="w-100% h-160px pl-8px py-4px rounded-4px border border-solid border-#E6EAEF">
              <el-scrollbar height="150px" class="pr-2px">
                <el-tag class="mr-8px" :closable="!isDetail" v-for="item in formValue.itemList" :key="item"
                  @close="handleCloseTag(item)">
                  {{ item + ' ' + options?.find((val: any) => val.value === item)?.label }}</el-tag>
              </el-scrollbar>
            </div>
          </template>
        </SearchForm>
        <div class="flex justify-end mt-4">
          <el-button round @click="showDrawer = false">取消</el-button>
          <el-button round type="primary" @click="handleSubmit" :disabled="isDetail">确定</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup lang="tsx">
import { ref } from 'vue';
import { cloneDeep, isEmpty } from 'lodash'
import { tableColumns, formFields, otherFields, pjFields, rules } from './rowColumns'
import { getHazardFactorsTree, hazardFactorsQuery, saveOrUpdate, batchDeleteByIds, hazardFactorsDetail } from '@/api/basicInfo/occupational/hazardFactor'
import { basicProjectList } from '@/api/basicInfo/basicProjectManagement';

interface Tree {
  label: string,
  id: string,
  children?: Tree[]
}
const { proxy } = getCurrentInstance() as ComponentInternalInstance
const { bus_duty_status, bus_shine_source, bus_job_illumination_source, bus_suspected_zyb, bus_zy_contraindications } = toRefs<any>(proxy?.useDict('bus_duty_status', 'bus_shine_source', 'bus_job_illumination_source', 'bus_suspected_zyb', 'bus_zy_contraindications')); // 字典

const searchTreeValue = ref()
const activeTabValue = ref<string>('1')
const tabList = ref<any[]>([
  { label: '必检项目', name: '1', },
  { label: '目标职业病', name: '2', },
  { label: '职业禁忌症', name: '3' },
  { label: '症状询问重点', name: '4' },
  { label: '体格检查', name: '5' },
  { label: '检查周期', name: '6' },
  { label: '评价标准', name: '7' }
])
const treeLoading = ref<boolean>(false)
const columns = ref<any>(tableColumns({ bus_duty_status, bus_shine_source, bus_job_illumination_source, tab: '1' }))
const fields = ref<any>(formFields({ bus_duty_status, tab: '1' }))
const proTableRef = ref()
const formRef = ref()
const pjbzFormRef = ref()
const showDrawer = ref<boolean>(false)
const formValue = ref<any>({
  enableStatus: '0'
})
const treeNodeClickObj = ref<any>({}) // 当前选中的节点数据
const basicProjectOption = ref<any>([]) // 必检项目下拉数据
const occupationalDict = ref<any>([]) // 职业照射种类下拉框
const shineTypeOption = ref<any>([]) // 根据照射源筛选后的数据
const isDetail = ref<boolean>(false)
const options = ref<any>([])
const drawerTitle = ref('新增')

const handleCloseTag = (tag: any) => {
  formValue.value.itemList?.splice(formValue.value.itemList.indexOf(tag), 1);
}

// 删除
const handleDel = (ids: any) => {
  if (ids.length == 0) return ElMessage({ type: 'warning', message: '请先选择一项' })

  ElMessageBox.confirm('请确认是否删除？', '警告', {
    cancelButtonText: '取消',
    confirmButtonText: '确定',
    type: 'warning'
  }).then(async () => {
    await batchDeleteByIds(ids)
    ElMessage({
      message: '删除成功',
      type: 'success',
    })
    proTableRef.value?.clearSelection();
    proTableRef.value?.getTableList()
  }).catch(() => {
    ElMessage({
      type: 'info',
      message: '已取消',
    })
  })
}

// columns更改 当选择放射危害因素时（sortCode == '14'）表格和表单新增'照射源'和'职业照射种类'下拉框
const updateColumns = (tab: string, sortCode: string) => {
  const option: any = {
    '1': basicProjectOption.value,
    '2': bus_suspected_zyb,
    '3': bus_zy_contraindications
  }

  options.value = unref(option?.[tab]) || []
  columns.value = tableColumns({ bus_duty_status, bus_shine_source, bus_job_illumination_source, tab, sortCode })
  if (tab === '1' || tab === '2' || tab === '3') {
    fields.value = formFields({ bus_duty_status, options: option?.[tab] || [], basicProjectOption, tab, sortCode })
  } else if (tab === '7') {
    fields.value = pjFields()
  } else {
    fields.value = otherFields({ bus_duty_status, tab, sortCode })
  }
}

// 切换tab页
const updateTabs = async (val: string) => {
  activeTabValue.value = val
  updateColumns(val, treeNodeClickObj.value.sortCode) //columns变化
  if (treeNodeClickObj.value.code === 'all') return formValue.value = {}
  if (activeTabValue.value === '7') {
    getPjbzData()
  } else {
    proTableRef.value?.getTableList()
  }
}

// 当选择照射源时 联动职业照射种类
const changeShineSource = (val: string) => {
  formValue.value.shineType = ''
  if (!val) return shineTypeOption.value = []
  shineTypeOption.value = occupationalDict.value.filter((item: any) => item.busType === val)
}
// 新增修改提交保存
const handleSubmit = async () => {
  if (activeTabValue.value === '7') {
    if (isDetail.value) {
      isDetail.value = false
    } else {
      pjbzFormRef.value.validate().then(async () => {
        await saveOrUpdate({ associationType: activeTabValue.value, ...formValue.value, sortCode: treeNodeClickObj.value.sortCode })
        showDrawer.value = false
        getPjbzData()
        ElMessage({
          message: formValue.value.id ? '编辑成功' : '新增成功',
          type: 'success',
        })
        isDetail.value = true
      })
    }
  } else {
    formRef.value.validate().then(async () => {
      await saveOrUpdate({ associationType: activeTabValue.value, ...formValue.value, sortCode: treeNodeClickObj.value.sortCode })
      showDrawer.value = false
      proTableRef.value?.getTableList()
      ElMessage({
        message: formValue.value.id ? '编辑成功' : '新增成功',
        type: 'success',
      })
    }).catch(() => { })
  }
}

// 打开弹框
const onpenDrawer = async (row: any, type = false) => {
  if (isEmpty(treeNodeClickObj.value) || treeNodeClickObj.value.code === 'all' || treeNodeClickObj.value.notPrompt)
    return ElMessage({
      message: '请先选择一个危害因素',
      type: 'warning',
    })
  // type == 1 详情
  isDetail.value = type
  drawerTitle.value = isDetail.value ? '详情' : row.id ? '编辑' : '新增'

  // row.id有值 详情或编辑回显 没值为新增
  const res = row.id && await hazardFactorsDetail({ id: row.id })
  formValue.value = {
    hazardFactorsName: treeNodeClickObj.value.value,
    hazardFactorsCode: treeNodeClickObj.value.code,
    dutyStatus: res?.data?.vo.dutyStatus,
    symptomFocus: res?.data?.vo.symptomFocus,
    physicalExamination: res?.data?.vo.physicalExamination,
    inspectionCycle: res?.data?.vo.inspectionCycle,
    evaluationCriterion: res?.data?.vo.evaluationCriterion,
    shineSource: res?.data?.vo.shineSource,
    shineType: res?.data?.vo.shineType,
    itemList: res?.data?.vo.itemList?.map((item: any) => item.itemId) || [],
    enableStatus: res?.data?.vo.enableStatus || '0',
    id: res?.data?.vo.id,
  }
  // 照射源联动 职业照射种类
  if (formValue.value.shineSource) {
    shineTypeOption.value = occupationalDict.value.filter((item: any) => item.busType === formValue.value.shineSource)
  } else {
    shineTypeOption.value = []
  }
  showDrawer.value = true
  formRef.value?.formRef.resetFields()
}

// dataCallback 是对于返回的表格数据做处理，如果你后台返回的数据不是 list && total && pageNum && pageSize 这些字段，可以在这里进行处理成这些字段
// 或者直接去 hooks/useTable.ts 文件中把字段改为你后端对应的就行
const dataCallback = (data: any) => {
  return {
    list: data.pageVo.rows || [],
    total: data.pageVo.total || 0,
  };
};

// 评价标准数据
const getPjbzData = async () => {
  pjbzFormRef.value?.formRef.resetFields()
  if (treeNodeClickObj.value.code === 'all' || isEmpty(treeNodeClickObj.value)) return formValue.value = {}
  try {
    const { data } = await hazardFactorsQuery(
      {
        associationType: activeTabValue.value,
        hazardFactorsName: treeNodeClickObj.value.value,
        hazardFactorsCode: treeNodeClickObj.value.code
      })

    isDetail.value = data?.vo ? true : false
    formValue.value = {
      hazardFactorsName: treeNodeClickObj.value.value,
      hazardFactorsCode: treeNodeClickObj.value.code,
      evaluationCriterion: data?.vo?.evaluationCriterion,
      id: data?.vo?.id
    }
  } catch (error) {
  }
}
// 获取表格数据
const getTableList: any = async (params: any) => {
  if (treeNodeClickObj.value.code === 'all' || isEmpty(treeNodeClickObj.value)) return
  try {
    return await hazardFactorsQuery(
      {
        ...params,
        associationType: activeTabValue.value,
        hazardFactorsName: treeNodeClickObj.value.value,
        hazardFactorsCode: treeNodeClickObj.value.code
      })
  } catch (error) {
  }
}

// 点击树节点
const handleNodeClick = (row: any) => {
  treeNodeClickObj.value = cloneDeep(row)
  // console.log(treeNodeClickObj.value, 'treeNodeClickObj.value');
  formValue.value = {
    hazardFactorsName: row.value,
    hazardFactorsCode: row.code
  }
  updateColumns(activeTabValue.value, row.sortCode) //columns变化
  if (activeTabValue.value === '7') {
    getPjbzData()
  } else {
    proTableRef.value?.getTableList()
  }
}

// 获取树数据
const treeData = ref<Tree[]>([])
const getTreeData = async () => {
  try {
    treeLoading.value = true
    const { data } = await getHazardFactorsTree({ value: searchTreeValue.value })
    data.forEach((item: any) => {
      item.notPrompt = true
    })
    const arr: any[] = [{ code: 'all', value: '全部单位', children: data }]
    if (data && data.length !== 0) {
      treeData.value = arr
    } else {
      treeData.value = []
    }
    treeLoading.value = false
  } catch (error) {
    treeLoading.value = false
  }
}
getTreeData()

const getData = async () => {
  // 必检项目下拉数据
  const { rows } = await basicProjectList({ status: '0', pagesize: -1, isOccupational: true })
  basicProjectOption.value = rows.map((item: any) => {
    return {
      label: item.basicProjectName,
      value: item.id
    }
  })

  // 职业照射种类下拉框
  occupationalDict.value = bus_job_illumination_source.value.map((item: any) => {
    return { label: item.label, value: item.value, busType: item.busType }
  })

  fields.value = formFields({ bus_duty_status, options: basicProjectOption.value })
}
getData()

const defaultProps = {
  children: 'children',
  label: 'value',
}
</script>

<style scoped lang="scss">
.left_box {
  height: calc(100vh - 105px);
  // margin-right: 10px;
  background: #fff;
  border-right: 1px solid #E8E8E8;
}

.tab_btn {
  cursor: pointer;
  display: inline-block;
  padding: 4px 10px;
  margin-right: 10px;
  border-radius: 93px;
  color: #3F4755;
  transition: .5s all;

  &.active,
  &:hover {
    background: #F1F5FB;
    color: #2879FF;
  }
}

::v-deep {

  .el-select__tags {
    max-height: 100px;
    overflow: auto;

    .el-tag {
      height: auto;

      .el-select__tags-text {
        white-space: normal;
      }
    }


  }

  .el-select {
    ::-webkit-scrollbar {
      width: 0px;
    }
    ::-webkit-scrollbar-thumb {
      background-color: transparent;
    }

    ::-webkit-scrollbar-track {
      background-color: transparent;
    }
  }


  .el-tag {
    height: auto;
    padding: 5px;
    line-height: 1.2;

    .el-tag__content {
      white-space: normal;
    }
  }
}
</style>
