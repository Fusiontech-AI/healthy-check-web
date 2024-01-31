<template>
  <div class="unit-list-wrap" v-loading="loadingForm">
    <span class="font-bold title-before">单位基础信息</span>
    <SearchForm
      ref="basicRef"
      :search-param="formValue"
      :columns="basicInfoColumn"
      :searchCol="2"
      :rules="rules"
      :disabled="disabledForm"
      label-width="135px"
    >
      <template #teamLevel>
        <el-select v-model="formValue.teamLevel" placeholder="请选择" clearable @change="handleChangeTeamLevel">
          <el-option v-for="dict in bus_team_level" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </template>
      <template #parentId>
        <el-select v-model="formValue.parentId" placeholder="请选择" @change="handleChangeParentId" :disabled="parentIdDisabled">
          <el-option v-for="item in parentIdOption" :key="item?.id" :label="item?.teamName" :value="item?.id" />
        </el-select>
      </template>
      <template #teamName>
        <el-input v-model="formValue.teamName" placeholder="请输入" @input="handleChangeTeamName" />
      </template>
    </SearchForm>
    <span class="font-bold title-before">单位其他信息</span>
    <SearchForm ref="basicOtherRef" :search-param="formValue" :columns="otherInfoColumn" :searchCol="2" :disabled="disabledForm" label-width="135px">
      <template #regionCode>
        <el-select
          v-model="formValue.regionCode"
          filterable
          remote
          reserve-keyword
          placeholder="请输入"
          :remote-method="remoteMethodRegionCode"
          :loading="loading"
        >
          <el-option v-for="item in regionOptions" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue" />
        </el-select>
      </template>
    </SearchForm>
  </div>
</template>
<script lang="ts" setup name="UnitMsgBasicInfo">
import { set } from 'lodash';
import {ref, onMounted} from 'vue';
import { basicInfoColumnBasic, otherInfoColumnBasic } from '../data'
import { getTeamNoById ,teamInfoList} from '@/api/groupInspectionManagement/unitMsg/index'
import {getFirstLetter} from '@/utils/pinyin'
import { listData } from "@/api/system/dict/data";
defineEmits(['getData'])
const props = defineProps({
  data: {
    type: Object,
    default: () =>{}
  },
  id:{
    type: String,
    default:''
  },
  editFlag:{
    type: Boolean,
    default: false
  }
})
const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const formValue = ref<any>({teamLevel:null});

const basicInfoColumn = ref<any>(basicInfoColumnBasic);
const otherInfoColumn = ref<any>(otherInfoColumnBasic)

const basicRef = ref()
const basicOtherRef = ref()
const parentIdOption = ref<any>([])//关联上级单位
const parentIdDisabled = ref<boolean>(false)

const { bus_team_level } = toRefs<any>(proxy?.useDict('bus_team_level'));//单位级别

const disabledForm =ref<boolean>(false)
const regionOptions = ref<any>([])
const loading = ref(false)
const loadingForm = ref<any>(false)

onMounted(() => {})

//获取所属地区
const remoteMethodRegionCode = async (query: string) => {
  if (query) {
    loading.value = true
    const param = {dictType:'bus_area',dictLabel:query} as any
    const {rows} = await listData(param)
    regionOptions.value = rows
    loading.value = false
  } else {
    regionOptions.value = []
  }
}

watch(()=>props.editFlag,(flag) =>{
  if(flag){//编辑
    disabledForm.value = true
  }else{
    disabledForm.value = false
  }
},{
  immediate:true
})

watch(()=>[props.id,props.data],async (val:any) =>{
  loadingForm.value = true
  const [id, data] = val || []
  if(data?.id &&id){
    if(data?.teamLevel ==='1'){//根据单位级别回显上级单位
    parentIdOption.value = []
    }
    if(data?.teamLevel ==='2'){
      const {data} = await teamInfoList({teamLevel:1})
      parentIdOption.value = data
    }
    formValue.value = data
  }else{
    console.log('reset')
    formValue.value = {}
  }
  loadingForm.value = false
  // if(id&&data?.regionCode){//所属地区回显
  //   const param = {dictType:'bus_area',dictValue:data?.regionCode} as any
  //   const {rows} = await listData(param)
  //   regionOptions.value = rows
  // }
},{
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
    formValue.value.teamNo= msg
    rules.value.parentId = {required:false}
    formValue.value.parentId = null
    parentIdDisabled.value = true
  }
  if(val==='2'){//二级单位时单位编号根据关联上级单位生成
    const {data} = await teamInfoList({teamLevel:1})
    parentIdOption.value = data
    formValue.value.teamNo = null
    parentIdDisabled.value = false
    rules.value.parentId = {required:true,message:'请选择关联上级单位',trigger:['blur','change']}
    nextTick(() =>{
      clearValidate()
    })
  }

}

// 关联上级单位-change
const handleChangeParentId = async (val:any) => {
  const {msg} = await getTeamNoById(val)
  Object.assign(formValue.value,{teamNo:msg})
}

// 根据单位名称改变获取拼音简码
const handleChangeTeamName= (val:any)=>{
  const pinLetters = getFirstLetter(val)
  formValue.value.phoneticCode = pinLetters
}

const getListType = async () => {
  const {bus_economic_type,bus_industry_category,bus_company_size } = toRefs<any>(proxy?.useDict('bus_economic_type','bus_industry_category','bus_company_size'));
  otherInfoColumn.value?.forEach((item:any,index:any) => {
    if(item.label==='经济类型'){
      set(otherInfoColumn.value,`[${index}].enum`,bus_economic_type)
    }
    if(item.label==='行业类型'){
      set(otherInfoColumn.value,`[${index}].enum`,bus_industry_category)
    }
    if(item.label==='企业规模'){
      set(otherInfoColumn.value,`[${index}].enum`,bus_company_size)
    }
  })
}
var validatePhone = (rule, value, callback) => {
  const pattern = /^1[34578][0-9]{9}$/
  if(!value){ callback()}
  if (!pattern.test(value)) {
    callback(new Error('请输入正确的电话号码'))
  }
  callback()
}

const submitData =async ()=> {
  let validForm = false
  await basicRef.value.validate(async(valid:any) =>{
    validForm = valid
  })
  return validForm?formValue.value:false
}

const clearValidate = () => {
  basicRef.value?.clearValidate()
}

const resetFields = () => {
  basicRef.value?.resetFields()
}

const rules =ref<any>({
  teamLevel: {required:true,message:'请选择单位级别',trigger:['blur','change']},
  parentId: {required:true,message:'请选择关联上级单位',trigger:['blur','change']},
  teamNo: {required:true,message:'请输入单位编号',trigger:['blur','change']},
  teamName: {required:true,message:'请输入单位名称',trigger:['blur','change']},
  phoneticCode: {required:true,message:'请输入拼音简码',trigger:['blur','change']},
  contactPhone: {required:false,trigger:['blur','change'],validator:validatePhone}
})

defineExpose({submitData, clearValidate, resetFields})
</script>

<style lang="scss" scoped>
@import '../index.scss';
</style>
