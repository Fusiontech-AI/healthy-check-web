<template>
  <div class="mt-1px">
    <el-tabs type="card" v-model="tabValue">
      <el-tab-pane label="体检小结" name="1"></el-tab-pane>
      <el-tab-pane label="其他科室小结" name="2"></el-tab-pane>
      <el-tab-pane label="历史本科小结" name="3"></el-tab-pane>
    </el-tabs>
    <div class="no-card mb-1">
      <ProTable
        ref="proTableRef"
        :columns="columns"
        :data="summaryList"
        :tool-button="false"
        :pagination="false"
        :header-cell-style="{ 'font-size': '12px' }"
        :cell-style="{ 'font-size': '12px' }"
        height="calc((100vh - 350px) / 2)"
      >
        <template #tableHeader="{ isSelected, selectedListIds }">
          <div class="ml-1">
            <el-button size="small" type="primary" @click="handleAddSummary">新增</el-button>
            <el-button size="small" :disabled="!isSelected" @click="handleDel(selectedListIds)">批量删除</el-button>
          </div>
        </template>
      </ProTable>
    </div>
    <el-dialog title="选择项目" v-model="projectDialogVisible">
      <div class="no-card">
        <ProTable
          ref="dialogTableRef"
          :tool-button="false"
          :pagination="false"
          :columns="projectSummaryColumns"
          :data="basicProjectList"
          height="350"
          row-key="id"
        ></ProTable>
      </div>
      <div class="w-full flex justify-end mt-18px">
        <el-button @click="projectDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="tsx">
import { getProjectSummaryList, addRegProjectSummary, delRegProjectSummary } from '@/api/doctorsExamination/inputGeneralResults'
import { projectSummaryColumns } from '../rowColumns'
import { ElMessageBox } from 'element-plus'
const registerInfo = inject<any>('registerInfo', reactive({}))
const props = defineProps({
  projectItem: {
    type: Object,
    default: () => { }
  },
  basicProjectList: {
    type: Array,
    default: []
  }
})
const tabValue = ref('1')
const columns = ref<any>([
  { type: 'selection', width: 30, fixed: 'left' },
  { label: '项目名称', prop: 'basicProjectName', fixed: 'left'},
  { label: '项目小结', prop: 'summaryContent'},
])
const proTableRef = ref<any>()
const dialogTableRef = ref<any>()
const projectDialogVisible = ref(false) // 新增选择项目弹窗

// 批量删除
const handleDel = async(ids:any) => {
  ElMessageBox.confirm(`是否确认将选中的${ids.length}条项目小结删除？`, '确认删除', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async()=> {
    await delRegProjectSummary(ids)
    getSummaryList()
    ElMessage.success('删除成功！')
  })
}
// 提交新增
const handleSubmit = () => {
  const selectId = dialogTableRef.value.radio
  if(!selectId) return ElMessage.warning('请选择一个项目！')
  ElMessageBox.prompt('请输入项目小结', {
    inputPlaceholder: '请输入项目小结',
    inputErrorMessage: '请输入项目小结',
    inputPattern: /.+/,
    inputType: 'textarea',
    customClass: 'message_box_class',
    confirmButtonText: '确定',
    cancelButtonText: '取消',
  }).then(async({value})=> {
    const item:any = props.basicProjectList.find((item:any)=> item.id === selectId)
    const params = {
      basicItemId: item.id,
      regItemId: props.projectItem.id,
      regId: item.regId,
      combinationProjectId: item.combinationProjectId,
      basicProjectId: item.basicProjectId,
      basicProjectName: item.basicProjectName,
      summaryContent: value
    }
    await addRegProjectSummary(params)
    getSummaryList()
    projectDialogVisible.value = false
  })
}
// 点击新增体检小结
const handleAddSummary = () => {
  projectDialogVisible.value = true
  if (dialogTableRef.value) dialogTableRef.value.radio = ''
}

const summaryList = ref([]) // 体检小结表格list
// 获取体检小结
const getSummaryList = async () => {
  const { data } = await getProjectSummaryList({ regId: registerInfo.value.id, regItemId: props.projectItem.id})
  summaryList.value = data || []
  proTableRef.value?.clearSelection()
}
defineExpose({getSummaryList})
</script>

<style scoped lang="scss"></style>
