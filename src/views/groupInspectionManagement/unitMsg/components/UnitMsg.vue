<template>
  <div>
    <span class="title-before font-bold">单位基础信息</span>
    <SearchForm ref="basicRef" :search-param="formValue" :columns="basicInfoColumn" :searchCol="2" :rules="rules">
      <template #teamLevel>
        <el-select v-model="formValue.teamLevel" placeholder="请选择" @change="handleChangeTeamLevel">
          <el-option v-for="item in sysTeamLevelOption" :key="item?.value" :label="item?.label" :value="item?.value" />
        </el-select>
      </template>
      <template #parentId>
        <el-select v-model="formValue.parentId" placeholder="请选择" @change="handleChangeParentId">
          <el-option v-for="item in parentIdOption" :key="item?.id" :label="item?.teamName" :value="item?.id" />
        </el-select>
      </template>
    </SearchForm>
    <span class="title-before font-bold">单位其他信息</span>
    <SearchForm ref="basicOtherRef" :search-param="formValue" :columns="otherInfoColumn" :searchCol="2"> </SearchForm>
  </div>
</template>
<script lang="ts" setup name="UnitMsgBasicInfo">
import { set } from 'lodash';
import {ref, onMounted} from 'vue';
import { basicInfoColumnBasic, otherInfoColumnBasic } from '../data'
import { occupationalDictList, getTeamNoById } from '@/api/groupInspectionManagement/unitMsg/index'
import { teamInfoList } from '@/api/groupInspectionManagement/unitMsg/index'

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const emits = defineEmits(['getData'])
const props = defineProps({
  data: {
    type: Object,
    default: () =>{}
  }
})

const formValue = ref<any>({teamLevel:null});

const basicInfoColumn = ref<any>(basicInfoColumnBasic);
const otherInfoColumn = ref<any>(otherInfoColumnBasic)

const basicRef = ref()
const basicOtherRef = ref()

const sysTeamLevelOption = ref<any>([]) //单位级别
const parentIdOption = ref<any>([])//关联上级单位

watch(()=>props.data,(data) => {
  formValue.value ={...formValue.value, ...data}
},
{
  immediate:true
})

onMounted(()=>{
  getListType()
})

//单位级别change
const handleChangeTeamLevel = async (val:any) => {
  if(val==='1'){ //一级单位时单位编号根据单位级别生成
    parentIdOption.value = []
    const {msg} = await getTeamNoById(0)
    formValue.value.parentId = null
    formValue.value.teamNo= msg
  }
  if(val==='2'){//二级单位时单位编号根据关联上级单位生成
    const {data} = await teamInfoList({teamLevel:2})
    parentIdOption.value = data
    formValue.value.teamNo = null
  }
}

// 关联上级单位-change
const handleChangeParentId = async (val:any) => {
  const {msg} = await getTeamNoById(val)
  Object.assign(formValue.value,{teamNo:msg})
}

const getListType = async () => {
    const { sys_team_level } = toRefs<any>(proxy?.useDict("sys_team_level"));
    const economicTypeOption = await occupationalDictList({type:'17'}) //经济类型
    const industryTypeOption = await occupationalDictList({type:'16'}) //行业类型
    const enterpriseSizeOption = await occupationalDictList({type:'18'}) //企业规模
    sysTeamLevelOption.value = sys_team_level.value
    basicInfoColumn.value?.forEach((item:any,index:any) => {
    if(item.label==='单位级别'){
      set(basicInfoColumn.value,`[${index}].enum`,sys_team_level)
    }
    if(item.label==='关联上级单位'){
      set(basicInfoColumn.value,`[${index}].enum`,sys_team_level)
    }
  })
  otherInfoColumn.value?.forEach((item:any,index:any) => {
    if(item.label==='经济类型'){
      set(otherInfoColumn.value,`[${index}].enum`,economicTypeOption)
    }
    if(item.label==='行业类型'){
      set(otherInfoColumn.value,`[${index}].enum`,industryTypeOption)
    }
    if(item.label==='企业规模'){
      set(otherInfoColumn.value,`[${index}].enum`,enterpriseSizeOption)
    }
  })
}

const rules = {
  teamLevel: {required:true,message:'请选择单位级别',trigger:['blur','change']},
  parentId: {required:true,message:'请选择关联上级单位',trigger:['blur','change']},
  teamNo: {required:true,message:'请输入单位编号',trigger:['blur','change']},
  teamName: {required:true,message:'请选择单位名称',trigger:['blur','change']},
  phoneticCode: {required:true,message:'请选择拼音简码',trigger:['blur','change']}
}

const submitData =async ()=> {
  await basicRef.value?.validate()
  return formValue.value
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
