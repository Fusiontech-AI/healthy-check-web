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
      class="ml-[16px]"
    >
      <template #teamLevel>
        <el-select v-model="formValue.teamLevel" placeholder="请选择单位级别" clearable @change="handleChangeTeamLevel">
          <el-option v-for="dict in bus_team_level" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </template>
      <template #parentId>
        <el-select v-model="formValue.parentId" placeholder="请选择关联上级单位" @change="handleChangeParentId" :disabled="parentIdDisabled">
          <el-option v-for="item in parentIdOption" :key="item?.id" :label="item?.teamName" :value="item?.id" />
        </el-select>
      </template>
      <template #teamName>
        <el-input v-model="formValue.teamName" placeholder="请输入单位名称" @input="handleChangeTeamName" />
      </template>
    </SearchForm>
    <span class="font-bold title-before">单位其他信息</span>
    <SearchForm
      ref="basicOtherRef"
      :search-param="formValue"
      :columns="otherInfoColumn"
      :searchCol="2"
      :disabled="disabledForm"
      label-width="135px"
      :rules="otherInfoRules"
      class="ml-[16px]"
    >
      <template #regionCode>
        <el-select
          v-model="formValue.regionCode"
          filterable
          remote
          reserve-keyword
          placeholder="请输入所属地区进行检索"
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
import { ref, onMounted } from 'vue';
import { basicInfoColumnBasic, otherInfoColumnBasic } from '../data';
import {
  getTeamNoById,
  teamInfoList,
  selectDictByTypeAndValue,
  queryTeamInfoById
} from '@/api/groupInspectionManagement/unitMsg/index';
import { getFirstLetter } from '@/utils/pinyin';
import { listData } from '@/api/system/dict/data';
import { basciInfoRules } from './data';

defineEmits(['getData']);
const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
  id: {
    type: String,
    default: '',
  },
  editFlag: {
    type: Boolean,
    default: false,
  },
});
const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const formValue = ref<any>({ teamLevel: null });

const basicInfoColumn = ref<any>(basicInfoColumnBasic(false));
const otherInfoColumn = ref<any>(otherInfoColumnBasic);

const basicRef = ref();
const basicOtherRef = ref();
const parentIdOption = ref<any>([]); //关联上级单位
const parentIdDisabled = ref<boolean>(false);

const { bus_team_level } = toRefs<any>(proxy?.useDict('bus_team_level')); //单位级别

const disabledForm = ref<boolean>(false);
const regionOptions = ref<any>([]);
const loading = ref(false);
const loadingForm = ref<any>(false);

onMounted(() => {});

//获取所属地区
const remoteMethodRegionCode = async (query: string) => {
  if (query) {
    loading.value = true;
    const param = { dictType: 'bus_area', dictLabel: query } as any;
    const { rows } = await listData(param);
    regionOptions.value = rows;
    loading.value = false;
  } else {
    regionOptions.value = [];
  }
};

watch(
  () => props.editFlag,
  (flag) => {
    if (flag) {
      //编辑
      disabledForm.value = true;
    } else {
      disabledForm.value = false;
    }
  },
  {
    immediate: true,
  }
);
watch(()=>props.id, async (id) =>{
  if(id){
    loadingForm.value = true;
    const { data } = await queryTeamInfoById(id);
     //根据单位级别回显上级单位
    if (data?.teamLevel === 1) {
      parentIdOption.value = [];
      basicInfoColumn.value = basicInfoColumnBasic(false)
    }
    if (data?.teamLevel === 2) {
      const { data } = await teamInfoList({ teamLevel: 1 });
      parentIdOption.value = data;
      basicInfoColumn.value = basicInfoColumnBasic(true)
    }
    formValue.value = {
      ...data,
      teamLevel: String(data?.teamLevel),
      parentId: String(data?.parentId),
      industryType: data?.industryType ? String(data?.industryType) : '',
      regionCode: data?.regionCode ? String(data?.regionCode) : '',
      economicType: data?.economicType ? String(data?.economicType) : '',
      enterpriseSize: data?.enterpriseSize ? String(data?.enterpriseSize) : '',
    }
    if(data?.regionCode) {
      //所属地区回显
      const param = { dictType: 'bus_area', dictValue: data?.regionCode } as any;
      const { data: res } = await selectDictByTypeAndValue(param);
      regionOptions.value = [res];
    }else{
      regionOptions.value = []
    }
    loadingForm.value = false;
  }else{
    console.log('reset');
    basicRef.value?.resetFields();
    formValue.value = {};
    basicOtherRef.value?.resetFields();
    regionOptions.value = []
  }
},{
    immediate: true,
})

onMounted(() => {
  getListType();
});

//单位级别change
const handleChangeTeamLevel = async (val: any) => {
  if (val === '1') {
    //一级单位时单位编号根据单位级别生成
    parentIdOption.value = [];
    const { msg } = await getTeamNoById(0);
    formValue.value.teamNo = msg;
    rules.value.parentId = { required: false };
    formValue.value.parentId = null;
    parentIdDisabled.value = true;
    basicInfoColumn.value = basicInfoColumnBasic(false)
  }
  if (val === '2') {
    //二级单位时单位编号根据关联上级单位生成
    const { data } = await teamInfoList({ teamLevel: 1 });
    parentIdOption.value = data;
    formValue.value.teamNo = null;
    parentIdDisabled.value = false;
    rules.value.parentId = {
      required: true,
      message: '请选择关联上级单位',
      trigger: ['blur', 'change'],
    };
    basicInfoColumn.value = basicInfoColumnBasic(true)
    nextTick(() => {
      clearValidate();
    });
  }
};

// 关联上级单位-change
const handleChangeParentId = async (val: any) => {
  const { msg } = await getTeamNoById(val);
  Object.assign(formValue.value, { teamNo: msg });
};

// 根据单位名称改变获取拼音简码
const handleChangeTeamName = (val: any) => {
  const pinLetters = getFirstLetter(val);
  formValue.value.phoneticCode = pinLetters;
};

const getListType = async () => {
  const { bus_economic_type, bus_industry_category, bus_company_size } = toRefs<any>(
    proxy?.useDict('bus_economic_type', 'bus_industry_category', 'bus_company_size')
  );
  otherInfoColumn.value?.forEach((item: any, index: any) => {
    if (item.label === '经济类型') {
      set(otherInfoColumn.value, `[${index}].enum`, bus_economic_type);
    }
    if (item.label === '行业类型') {
      set(otherInfoColumn.value, `[${index}].enum`, bus_industry_category);
    }
    if (item.label === '企业规模') {
      set(otherInfoColumn.value, `[${index}].enum`, bus_company_size);
    }
  });
};

const submitData = async () => {
  let p1 = new Promise((resolve) => {
    basicRef.value.validate(async (valid: any) => {
    resolve(valid)
   });
  })
  let p2 = new Promise((resolve) => {
    basicOtherRef.value.validate(async (valid: any) => {
    resolve(valid)
   });
  })
 const [v1,v2] = await Promise.all([p1, p2])
 return v1&&v2 ? formValue.value : false;
};

const clearValidate = () => {
  basicRef.value?.clearValidate();
};

const resetFields = () => {
  nextTick(() => {
    formValue.value = {};
    basicRef.value?.resetFields();
    basicOtherRef.value?.resetFields();
  });
};

const rules = ref<any>(basciInfoRules) //单位基础信息

// 职工总人数校验
var validateEmployeeTotalNum = (_:any, value:any, callback:any) => {
  if (!value) {
    callback();
  }
  const {femaleEmployeeNum = 0, productTotalNum = 0, affectedTotalNum = 0} = formValue.value
  const sum = femaleEmployeeNum + productTotalNum + affectedTotalNum
  if(formValue.value.employeeTotalNum && sum > value){
    callback(new Error('其他人数总和不得大于职工总人数'))
  }
  callback();
};

// 女职工总人数校验
var validateFemaleEmployeeNum = (_:any, value:any, callback:any) => {
  if (!value) {
    callback();
  }
  if(formValue.value.employeeTotalNum && value > formValue.value.employeeTotalNum){
    callback(new Error('女职工总人数不能大于职工总人数'))
  }
  callback();
};

// 生产工人数校验
var validatProductTotalNum = (_:any, value:any, callback:any) => {
  if (!value) {
    callback();
  }
  if(formValue.value.employeeTotalNum && value > formValue.value.employeeTotalNum){
    callback(new Error('生产工人数不能大于职工总人数'))
  }
  callback();
};

// 接害工人数校验
var validateAffectedTotalNum = (_:any, value:any, callback:any) => {
  if (!value) {
    callback();
  }
  if(formValue.value.employeeTotalNum && value > formValue.value.employeeTotalNum){
    callback(new Error('接害工人数不能大于职工总人数'))
  }
  callback();
};

// 接害女职工人数校验
var validateFemaleAffectedNum = (_:any, value:any, callback:any) => {
  if (!value) {
    callback();
  }
  if(formValue.value.employeeTotalNum && value > formValue.value.employeeTotalNum){
    callback(new Error('接害女职工人数不能大于职工总人数'))
  }
  if(formValue.value.affectedTotalNum && value > formValue.value.affectedTotalNum){
    callback(new Error('接害女职工人数不能大于接害工人数'))
  }
  if(formValue.value.femaleEmployeeNum && value > formValue.value.femaleEmployeeNum){
    callback(new Error('接害女职工人数不能大于女职工总人数'))
  }
  callback();
};

// 生产女职工人数校验
var validateFemaleProductNum = (_:any, value:any, callback:any) => {
  if (!value) {
    callback();
  }
  if(formValue.value.employeeTotalNum && value > formValue.value.employeeTotalNum){
    callback(new Error('生产女职工人数不能大于职工总人数'))
  }
  if(formValue.value.productTotalNum && value > formValue.value.productTotalNum){
    callback(new Error('生产女职工人数不能大于生产工人数'))
  }
  if(formValue.value.femaleEmployeeNum && value > formValue.value.femaleEmployeeNum){
    callback(new Error('生产女职工人数不能大于女职工总人数'))
  }
  callback();
};

const otherInfoRules = ref<any>({
  employeeTotalNum:  { validator: validateEmployeeTotalNum,trigger: ['blur', 'change']},//职工总人数
  femaleEmployeeNum: { validator: validateFemaleEmployeeNum,trigger: ['blur', 'change']},//女职工总人数
  productTotalNum: { validator: validatProductTotalNum,trigger: ['blur', 'change'] },//生产工人数
  femaleProductNum: { validator: validateFemaleProductNum,trigger: ['blur', 'change'] },//生产女职工人数
  affectedTotalNum: { validator: validateAffectedTotalNum,trigger: ['blur', 'change'] },//接害工人数
  femaleAffectedNum: { validator: validateFemaleAffectedNum,trigger: ['blur', 'change'] },//接害女职工人数
});


defineExpose({ submitData, clearValidate, resetFields });
</script>

<style lang="scss" scoped>
@import '../index.scss';
</style>
