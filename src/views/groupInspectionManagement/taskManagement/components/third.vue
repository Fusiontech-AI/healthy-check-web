<template>
  <div>
    <div style="display:flex;align-items:center;justify-content:space-between">
      <div>* 请根据当前任务所选体检类型，下载对应模板后再上传</div>
      <div>
        <el-button class="button" @click="handleLook(scope.$index)">下载模板</el-button>
        <el-button class="button" @click="handleLook(scope.$index)">批量导入</el-button>
      </div>
    </div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="date" label="序号" />
      <el-table-column prop="date" label="姓名" />
      <el-table-column prop="date" label="年龄" />
      <el-table-column prop="date" label="身份证号" />
      <el-table-column prop="date" label="项目分组" />
      <el-table-column prop="date" label="在岗类型" />
      <el-table-column prop="date" label="体检状态" />
      <el-table-column prop="address" label="操作" width="170">
        <template #default="scope">
          <el-button class="button" @click="handleLook(scope.$index)">查看</el-button>
          <el-button class="button" @click="handleDel(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="tsx" name="third">
const tableData=ref([{}])
const handleDel=()=>{

}
const handleLook=()=>{

}
</script>
