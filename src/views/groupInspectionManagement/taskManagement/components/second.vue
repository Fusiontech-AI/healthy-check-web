import { display } from 'html2canvas/dist/types/css/property-descriptors/display'; import { nonWhiteSpace } from
'html2canvas/dist/types/css/syntax/parser';
<template>
  <div>
    <el-tabs type="border-card" tab-position="left">
      <el-tab-pane label="危害上岗男">
        <TransferFilterComplex />
      </el-tab-pane>
      <el-tab-pane label="危害离职男">Config</el-tab-pane>
      <el-tab-pane label="危害离职女">Role</el-tab-pane>
    </el-tabs>
    <div class="group-price">
      <form-guid :fields="fields" :model="form" :rules="rules" :col-count="4" :preview="true" />
    </div>
  </div>
</template>

<script setup lang="tsx" name="second">
import TransferFilterComplex from '@/components/TransferFilterComplex.vue'
const fields=ref([
{
    label: '分组折扣',
    name: 'name',
    component: 'Input',
  },
{
    label: '加项折扣',
    name: 'name',
    component: 'Input',
  },
{
    label: '标准价格（元）',
    name: 'name',
    component: 'Input',
  },
{
    label: '折后价格（元）',
    name: 'name',
    component: 'Input',
  },

])
const form=ref({})
const rules=ref([])
</script>
<style scoped lang="scss">
.group-price{
  background: #F1F5FB;
  border-radius: 4px;
  display:flex;
  align-items:center;
  padding-top:20px;
}
:deep(.el-tabs--border-card){
  border:none;
}
</style>
