<template>
  <div class="mt-1px">
    <el-tabs type="card" v-model="tabValue">
      <el-tab-pane label="体检小结" name="1"></el-tab-pane>
      <el-tab-pane label="其他科室小结" name="2"></el-tab-pane>
      <el-tab-pane label="历史本科小结" name="3"></el-tab-pane>
    </el-tabs>
    <div class="no-card mb-2">
      <ProTable ref="proTableRef" :columns="columns" :data="summaryList" :tool-button="false" :pagination="false"
        :header-cell-style="{ 'font-size': '12px' }" :cell-style="{ 'font-size': '12px' }"
        height="calc((100vh - 250px) / 2)">
        <template #tableHeader="{ isSelected }">
          <div class="ml-1">
            <el-button round size="small" type="primary" @click="handleAddSummary">新增</el-button>
            <el-button round size="small" :disabled="!isSelected">批量删除</el-button>
          </div>
        </template>
      </ProTable>
    </div>
    <el-dialog title="选择项目" v-model="projectDialogVisible">
      <div class="no-card">
        <ProTable ref="dialogTableRef" :tool-button="false" :pagination="false" :columns="projectSummaryColumns"
          :data="basicProjectList" height="350" row-key="id"></ProTable>
      </div>
      <div class="w-full flex justify-end mt-18px">
        <el-button round @click="projectDialogVisible = false">取消</el-button>
        <el-button type="primary" round @click="handleSubmit">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="tsx">
import { getProjectSummaryList, addRegProjectSummary } from '@/api/doctorsExamination/inputGeneralResults'
import { projectSummaryColumns } from '../rowColumns'
import { ElForm, ElFormItem, ElInput, ElMessageBox } from 'element-plus'
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
  { label: '项目名称', prop: 'basicProjectName', fixed: 'left' },
  { label: '项目小结', prop: 'summaryContent' },
])
const proTableRef = ref<any>()
const dialogTableRef = ref<any>()
const projectDialogVisible = ref(false) // 新增选择项目弹窗

// 提交新增
const handleSubmit = () => {
  const selectId = dialogTableRef.value.radio
  if(!selectId) return ElMessage.warning('请选择一个项目！')
  ElMessageBox.prompt('请输入项目小结', {
    inputPlaceholder: '请输入项目小结',
    inputErrorMessage: '请输入项目小结',
    inputPattern: /.+/,
    inputType: 'textarea',
    roundButton: true,
    customClass: 'message_box_class',
    confirmButtonText: '确定',
    cancelButtonText: '取消',
  }).then(async({value})=> {
    const item:any = props.basicProjectList.find((item:any)=> item.id === selectId)
    const params = {
      id: item.id,
      basicItemId: item.id,
      regItemId: item.combinationProjectId,
      regId: item.regId,
      combinationProjectId: item.combinationProjectId,
      basicProjectId: item.basicProjectId,
      basicProjectName: item.basicProjectName,
      summaryContent: value
    }
    console.log(params, value);
    
    await addRegProjectSummary(params)
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
  // console.log(props.projectItem, 'props.projectItem');
  // regItemId: props.projectItem.combinationProjectId
  const { data } = await getProjectSummaryList({ regId: registerInfo.value.id,  })
  summaryList.value = data || []
}
watch([() => registerInfo.value, () => props.projectItem], ([newV1, newV2]) => {
  console.log(111);
  
  if (newV1.id && newV2.id) {
    // getSummaryList()
  }
}, { immediate: true, deep: true })
</script>

<style scoped lang="scss">
</style>
