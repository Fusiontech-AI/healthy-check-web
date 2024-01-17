<template>
  <div>
    <span class="title-before font-bold">单位基础信息</span>
    <SearchForm ref="basicRef" :search-param="formValue" :columns="basicInfoColumn" :searchCol="2" :rules="rules"> </SearchForm>
    <span class="title-before font-bold">单位其他信息</span>
    <SearchForm ref="basicOtherRef" :search-param="formValue" :columns="otherInfoColumn" :searchCol="2"> </SearchForm>
  </div>
</template>
<script lang="ts" setup name="UnitMsgBasicInfo">
import { set } from 'lodash';
import {ref, onMounted, toRaw} from 'vue';
import { basicInfoColumnBasic, otherInfoColumnBasic } from '../data'
const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const emits = defineEmits(['getData'])
const props = defineProps({
  data: {
    type: Object,
    default: () =>{}
  }
})

const formValue = ref<any>({});

const basicInfoColumn = ref<any>(basicInfoColumnBasic);
const otherInfoColumn = ref<any>(otherInfoColumnBasic)

const basicRef = ref()
const basicOtherRef = ref()

watch(()=>props.data,(value) => {
  formValue.value = value
})

onMounted(()=>{
  getListType()
})

const getListType = async () => {
    const unitLevelData:any = await proxy?.useDict('sys_team_level')
    basicInfoColumn.value?.forEach((item:any,index:any) => {
    if(item.label==='单位级别'){
      set(basicInfoColumn.value,`[${index}].enum`,toRaw(unitLevelData)['sys_team_level'])
    }
    if(item.label==='关联上级单位'){
      set(basicInfoColumn.value,`[${index}].enum`,toRaw(unitLevelData)['sys_team_level'])
    }
  })
}

const rules = {
  teamLevel: {required:true,message:'请选择单位级别',trigger:['blur','change']},
  parentId: {required:true,message:'请选择关联上级单位',trigger:['blur','change']},
  teamNo: {required:true,message:'请选择单位编号',trigger:['blur','change']},
  teamName: {required:true,message:'请选择单位名称',trigger:['blur','change']},
  phoneticCode: {required:true,message:'请选择拼音简码',trigger:['blur','change']}
}

const submitData = ()=> {
  basicRef.value?.validate()
  emits('getData',formValue)
}

const clearValidate = () => {
  basicRef.value?.clearValidate()
}

const resetFields = () => {
  basicRef.value?.resetFields()
}
defineExpose({submitData, clearValidate, resetFields})
</script>

<style lang="scss" scoped>
@import '../index.scss';
</style>
