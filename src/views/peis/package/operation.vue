<template>
  <div class="p-2">
    <el-card shadow="hover">
      <div class="title">
        <div class="title-box"></div>
        基础信息
      </div>
      <form-guid :fields="fields" :model="form" :rules="rules" :col-count="4" :preview="true" />
    </el-card>
    <el-card shadow="hover">
      <div class="title">
        <div class="title-box"></div>
        套餐项目
      </div>
      <TransferFilterComplex />
    </el-card>
    <div class="footer-submit"><el-button class="button" round>取消</el-button><el-button class="button" type="primary" round>确定</el-button></div>
  </div>
</template>

<script setup name="operation" lang="ts">
import TransferFilterComplex from '@/components/TransferFilterComplex'
const fields=ref([
{
    label: '体检类型',
    name: 'name',
    component: 'Select',
  },
  {
    label: '适用性别',
    name: 'idCard',
    component: 'Select'
  },
  {
    label: '套餐名称',
    name: 'peCode',
    component: 'Input'
  },
  {
    label: '套餐简称',
    name: 'groupId',
    component: 'Input',
  },
  {
    label: '套餐简拼',
    name: 'ksrq',
    component: 'Input',
  },
  {
    label: '排序',
    name: 'px',
    component: 'Input',
  },
  {
    label: '复制套餐',
    name: 'fztc',
    component: 'Select',
  },
])
const form=ref({})
const rules=ref([

])
const handleAdd=(type)=>{

}
</script>
<style scoped lang="scss">
.title{
  display:flex;
  align-items:center;
  font-weight:bold;
  margin-bottom:5px;
  .title-box{
    width: 4px;
    height: 16px;
    border-radius: 2px;
    opacity: 1;
    background: #FF8F33;
    margin-right:4px;
  }
}
.footer-submit{
  height: 64px;
  border-radius: 4px 4px 0px 0px;
  opacity: 1;
  background: #FFFFFF;
  box-shadow: 0px -2px 16px 0px rgba(128, 146, 181, 0.1);
  display:flex;
  align-items:center;
}
</style>
