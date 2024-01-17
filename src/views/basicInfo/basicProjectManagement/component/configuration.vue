<template>
  <div>
    <el-row>
      <el-col :span="12">
        <div>
          <div class="head_search">
            <div class="head_title">项目检索</div>
            <el-input v-model="inputValue" class="head_input">
              <template #suffix>
                <el-icon class="el-input__icon">
                  <search />
                </el-icon>
              </template>
            </el-input>
          </div>
          <ProTable ref="proTable" :columns="columns" :request-api="getTableList" :data-callback="dataCallback"
            :requestAuto="false" :toolButton="false">
            <template #operation="{row}">
             <el-button @click="handleChecked(row)">选中</el-button>
            </template>
          </ProTable>
        </div>
      </el-col>

      <el-col :span="12">
        <div>已选项目 (共{{ checkedLength }}项)</div>
        <ProTable ref="itemTable" :columns="itemColumns" :request-api="getItemTableList" :data-callback="dataItemCallback"
            :requestAuto="false" :toolButton="false">
            <template #operation="{row}">
             <el-button @click="itemDelete(row)">删除</el-button>
            </template>
          </ProTable>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import ProTable from '@/components/TableSearchComponent/ProTable/index.vue'
import { Search } from '@element-plus/icons-vue'
const inputValue = ref('')

const columns = ref([
  {
    prop: "groupName",
    label: "项目编码",
  },
  {
    prop: "unitAmount",
    label: "项目名称",
  },
  {
    prop: "operation",
    label: "操作",
  },
])
const getTableList = () => {

}
const dataCallback = () => {

}
const handleChecked=(row)=>{

}

const checkedLength=ref(0)
const itemColumns=ref([
{
    prop: "groupName",
    label: "项目类型",
  },
  {
    prop: "unitAmount",
    label: "项目名称",
  },
  {
    prop: "operation",
    label: "操作",
  },
])
const getItemTableList=()=>{

}
const dataItemCallback=()=>{

}
const itemDelete=()=>{

}
</script>

<style scoped lang="scss">
.head_search {
  display: flex;
  justify-content: space-between;

  .head_title {
    width: 100px;
  }

  .head_input {
    width: 100px;
  }
}</style>