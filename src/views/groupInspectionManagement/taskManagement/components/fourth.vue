<template>
  <div>
    <div>支持文件格式：.rar .zip .doc .docx .pdf ，单个文件不能超过500kb</div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="fileType" label="文件类型">
        <template #default="{ row }">
          <div v-if="row.fileType == 1">职业健康检查委托协议书</div>
          <div v-if="row.fileType == 2">体检方案</div>
          <div v-if="row.fileType == 3">职业健康检查表</div>
        </template>
      </el-table-column>
      <el-table-column prop="mb" label="模板">
        <template #default="{ row }">
          <el-button type="primary" @click="" link :disabled="preview">预览 </el-button>
          <el-button type="primary" @click="" link :disabled="preview">下载</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="file" label="上传" width="370">
        <template #default="{ row }">
          <FileUploadNew :isShowTip="false" :limit="1" action="/peis/teamTaskFile"
            :data="{ taskId: props.form.taskId, fileType: row.fileType }" :modelValue="row.modelValue"
            @handleSctp="getFileList" :disabled="preview" />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="tsx" name="fourth">
import FileUploadNew from '@/components/FileUploadNew'
import { teamTaskFileList } from '@/api/groupInspectionManagement/taskManagement'
const props = defineProps(['form', 'preview'])
const tableData = reactive([
  {
    fileType: '1',
    mb: '',
    file: null,
    modelValue: []
  },
  {
    fileType: '2',
    mb: '',
    file: null,
    modelValue: []
  },
  {
    fileType: '3',
    mb: '',
    file: null,
    modelValue: []
  },
])

//文件列表
const getFileList = async () => {
  let p = {
    taskId: props.form.taskId
  }
  const { rows } = await teamTaskFileList(p)
  tableData[0].modelValue = rows.filter(item => item.fileType == 1)
  tableData[1].modelValue = rows.filter(item => item.fileType == 2)
  tableData[2].modelValue = rows.filter(item => item.fileType == 3)
}
getFileList()
</script>
