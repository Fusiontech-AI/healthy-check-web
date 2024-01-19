<template>
  <div>
    <div>支持文件格式：.rar .zip .doc .docx .pdf ，单个文件不能超过500kb</div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="date" label="文件类型" />
      <el-table-column prop="date" label="模板">
        <template #default="scope">
          <el-button class="button" @click="handleLook(scope.$index)">预览 </el-button>
          <el-button class="button" @click="handleDel(scope.$index)">下载</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="上传" width="170">
        <template #default="scope">
          <el-button class="button" @click="handleLook(scope.$index)">查看</el-button>
          <el-button class="button" @click="handleDel(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="tsx" name="fourth">
const tableData=ref([{}])
const handleDel=()=>{

}
const handleLook=()=>{

}
</script>
