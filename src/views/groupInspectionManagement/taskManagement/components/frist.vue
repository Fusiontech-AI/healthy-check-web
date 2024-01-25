<template>
  <div>
    <div>* 分组类型按项目时，金额将根据所选套餐/项目计算得出，无需编辑。</div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="date" label="分组名称" width="120">
        <template #default="scope">
          <el-input v-model="scope.name" clearable :placeholder="`请填写`"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="在岗类型" width="100">
        <template #default="scope">
          <el-select v-model="scope.value" placeholder="请选择" class="left-select">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="分组类型" width="80">
        <template #default="scope">
          <el-select v-model="scope.value" placeholder="请选择" class="left-select">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="性别" width="80">
        <template #default="scope">
          <el-select v-model="scope.value" placeholder="请选择" class="left-select">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="年龄区间" width="150">
        <template #default="scope">
          <div style="display:flex;align-items:center">
            <el-input v-model="scope.name" clearable :placeholder="`请填写`"></el-input>
            —
            <el-input v-model="scope.name" clearable :placeholder="`请填写`"></el-input>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="婚姻状态">
        <template #default="scope">
          <el-select v-model="scope.value" placeholder="请选择" class="left-select">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="金额（元）" width="100">
        <template #default="scope">
          <el-input v-model="scope.name" clearable :placeholder="`请填写`"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="分组支付方式" width="120">
        <template #default="scope">
          <el-select v-model="scope.value" placeholder="请选择" class="left-select">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="分组折扣" width="80">
        <template #default="scope">
          <el-input v-model="scope.name" clearable :placeholder="`请填写`"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="加项支付方式" width="120">
        <template #default="scope">
          <el-select v-model="scope.value" placeholder="请选择" class="left-select">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="加项折扣" width="80">
        <template #default="scope">
          <el-input v-model="scope.name" clearable :placeholder="`请填写`"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="分组同步" width="80">
        <template #default="scope">
          <el-checkbox v-model="scope.name" label="" size="large" />
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作" width="100">
        <template #default="scope">
          <el-button class="button" @click="handleDel(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button class="button" @click="handleAdd">新增一行</el-button>
  </div>
</template>
<script setup lang="tsx" name="first">
const tableData=ref([{}])
const options=ref([])
//新增一行
const handleAdd=()=>{
  tableData.value.push({})
}
//删除一行
const handleDel=(i)=>{
  tableData.value.splice(i,1)
}
</script>
