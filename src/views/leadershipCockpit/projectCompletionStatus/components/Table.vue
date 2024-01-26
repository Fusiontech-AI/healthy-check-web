<template>
  <div>
    <ProTable :columns="tableColumns" :toolButton="false" :data="dataSourse" label-position="right" row-key="id" :show-search="false"> </ProTable>
  </div>
</template>
<script setup name="peInformationQueryTable" lang="tsx">

 defineProps({
    dataSourse:{
        type:Array,
        default:()=>[]
    },
    tableColumns:{
        type:Array,
        default:()=>[]
    }
})
</script>
