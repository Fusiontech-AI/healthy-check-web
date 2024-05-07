<template>
  <div class="mt-1px">
    <el-tabs type="card" v-model="tabValue">
      <el-tab-pane label="阳性结果发现" name="1"></el-tab-pane>
      <el-tab-pane label="医学科普" name="2"></el-tab-pane>
    </el-tabs>
    <div class="no-card">
      <ProTable
        ref="proTableRef"
        :columns="columns"
        :data="positiveList"
        :tool-button="false"
        :pagination="false"
        :header-cell-style="{ 'font-size': '12px' }"
        :cell-style="{ 'font-size': '12px' }"
        height="calc((100vh - 280px) / 2)"
        :isShowSearch="false"
      >
        <template #tableHeader="{ isSelected, selectedListIds }">
          <div class="ml-1">
            <el-button size="small" type="primary" @click="handleAddKnowledge">知识库检索</el-button>
            <el-button size="small" type="primary" @click="handleAddPositive">新增</el-button>
            <el-button size="small" :disabled="!isSelected" @click="handleDel(selectedListIds)">批量删除</el-button>
          </div>
        </template>
      </ProTable>
    </div>
    <el-dialog title="新增阳性结果" v-model="positiveDialogVisible" width="30%">
      <SearchForm ref="addFormRef" :columns="columns" :searchCol="1" :search-param="addFormValue" :rules="addRules"></SearchForm>
      <div class="w-full flex justify-end mt-18px">
        <el-button @click="positiveDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </div>
  </el-dialog>
    <el-dialog title="知识库检索" v-model="knowledgeDialogVisible" width="60%">
      <div class="no-card">
        <ProTable :columns="knowledgeColumns" :tool-button="false" :request-api="getZdjyList" :searchCol="2" height="calc(100vh - 320px)">
          <template #operation="{ row }">
            <el-button type="primary" link @click="handleKnowledgeAdd(row)">新增</el-button>
          </template>
        </ProTable>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="tsx">
import { getProjectPositiveList, addProjectPositive, delRegProjectPositiv, getZdjyList } from '@/api/doctorsExamination/inputGeneralResults'
import { ElMessageBox } from 'element-plus'
import { knowledgeColumns } from '../rowColumns'
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
  { type: 'selection', width: 30, fixed: 'left', isShowSearch: false },
  { label: '建议名称', prop: 'diagnoseTitle',fixed: 'left',width: 110, search: { el: 'input'}},
  { label: '诊断建议', prop: 'diagnoseAdvice', search: { el: 'input'}},
])
const addRules = ref<any>({
  diagnoseTitle: [{required: true, message: '请输入诊断建议名称', trigger: 'blur'}],
  diagnoseAdvice: [{required: true, message: '请输入诊断建议', trigger: 'blur'}],
})
const knowledgeDialogVisible = ref(false) // 知识库检索
const handleAddKnowledge = ()=> {
  knowledgeDialogVisible.value = true
}
// 批量删除
const handleDel = async(ids:any) => {
  ElMessageBox.confirm(`是否确认将选中的${ids.length}条阳性结果删除？`, '确认删除', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async()=> {
    await delRegProjectPositiv(ids)
    getPositiveList()
    ElMessage.success('删除成功！')
  })
}

const positiveDialogVisible = ref(false) // 新增阳性结果
const addFormValue = ref({})
const addFormRef = ref()
// 从知识库检索新增
const handleKnowledgeAdd = async(row: any) => {
  const params = {
    regId: registerInfo.value.id,
    regItemId: props.projectItem.id,
    diagnoseTitle: row.zyzd,
    diagnoseAdvice: row.zybjy
  }
  await addProjectPositive(params)
  getPositiveList()
  knowledgeDialogVisible.value = false
  ElMessage.success('新增成功！')
}
// 提交新增
const handleSubmit = () => {
  addFormRef.value.validate(async(valid:any)=> {
    if(valid) {
      await addProjectPositive({
        regId: registerInfo.value.id,
        regItemId: props.projectItem.id,
        ...addFormValue.value
      })
      ElMessage.success('新增成功！')
      positiveDialogVisible.value = false
      getPositiveList()
    }
  })
}
// 点击新增 阳性结果
const handleAddPositive = () => {
  positiveDialogVisible.value = true
  if(addFormRef.value) addFormRef.value.resetFields()
}

const positiveList = ref([]) // 阳性结果发现表格list
const proTableRef = ref<any>()
// 获取阳性结果发现
const getPositiveList = async () => {
  const { data } = await getProjectPositiveList({ regId: registerInfo.value.id, regItemId: props.projectItem?.id})
  positiveList.value = data || []
  proTableRef.value?.clearSelection()
}
defineExpose({getPositiveList})
</script>

<style scoped lang="scss"></style>
