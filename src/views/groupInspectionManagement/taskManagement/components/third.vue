<template>
  <div>
    <div style="display:flex;align-items:center;justify-content:space-between">
      <div>* 请根据当前任务所选体检类型，下载对应模板后再上传</div>
      <div class="mb10px">
        <el-button type="primary" @click="importTemplate" plain :disabled="preview">下载模板</el-button>
        <el-button type="primary" @click="batchImportDialog = true" plain :disabled="preview">批量导入</el-button>
      </div>
    </div>
    <ProTable ref="proTableRef" :columns="tableColumns" :toolButton="false" :request-api="queryTaskReviewRegister"
      :init-param="initParam" :request-auto="true" height="350">
      <template #operation="{ row }">
        <el-button type="primary" link :disabled="preview" @click="viewPersonDetail(row)">查看</el-button>
        <el-button type="danger" link :disabled="preview" @click="handleDel(row)">删除</el-button>
      </template>
    </ProTable>
    <el-dialog title="批量导入" v-model="batchImportDialog" width="55%">
      <batch-import :is-show-dialog="batchImportDialog" :team-task-info="props.form"
        @close-dialog="batchImportDialog = false; proTableRef?.getTableList()"></batch-import>
    </el-dialog>
    <el-dialog title="人员信息详情" v-model="showPersonDialog" width="45%">
      <el-scrollbar height="550px" class="no-card">
        <SearchForm ref="formRef" :columns="personColumns" :search-param="personInfo" :search-col="2" :preview="true">
        </SearchForm>
        <!-- <Grid ref="gridRef" :gap="20" :cols="2">
          <GridItem :span="1" v-for="item in personColumns " :key="item.label">
            <div class="flex text-[14px] text-[#141C28] ml-4">
              <span class="w-[120px] text-[#89919F]">{{ item.label }}：</span>
              <span class="flex-1">{{ item.value }}</span>
            </div>
          </GridItem>
        </Grid> -->
      </el-scrollbar>
      <div class="flex justify-end mt-4">
        <el-button @click="showPersonDialog = false">取消</el-button>
        <el-button type="primary" @click="showPersonDialog = false">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="tsx" name="third">
import { queryTaskReviewRegister, deleteTaskRegister, getRegisterById } from '@/api/groupInspection/taskAudit';
import BatchImport from '@/views/groupInspectionManagement/personnelIntroduction/components/BatchImport.vue'
import { tableColumn, personColumn } from '@/views/groupInspectionManagement/personnelIntroduction/rowColumns'
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const showPersonDialog = ref<boolean>(false) // 人员信息弹窗显示隐藏
const batchImportDialog = ref<boolean>(false) // 批量导入弹框显示隐藏
const personColumns = ref<any>(personColumn)
const props = defineProps(['form', 'preview'])
const initParam = reactive({ taskId: props.form.id })
const tableColumns = ref<any>(tableColumn)
const proTableRef = ref(null)
const personInfo = ref({})
/** 下载模板操作 */
const importTemplate = () => {
  proxy?.download("/peis/teamTask/exportRegisterTemplate", {
    taskId: props.form.id,
    templateType: props.form.physicalType
  }, `人员导入模版.xlsx`);
}
// 查看人员详情
const viewPersonDetail = async (row: any) => {
  showPersonDialog.value = true
  const { data } = await getRegisterById(row.id)
  personInfo.value = data
}
// 删除
const handleDel = async (row: any) => {
  await proxy?.$modal.confirm('是否删除此条数据？')
  await deleteTaskRegister(row.id)
  ElMessage({
    message: '删除成功',
    type: 'success',
  })
  proTableRef.value?.getTableList()

}
</script>
