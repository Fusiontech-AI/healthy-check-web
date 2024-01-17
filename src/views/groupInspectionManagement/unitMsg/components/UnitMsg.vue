<template>
  <div>
    <span class="title-before font-bold">单位基础信息</span>
    <SearchForm ref="basicRef" :search-param="formValue" :columns="basicInfoColumn" :searchCol="2" :rules="rules"> </SearchForm>
    <span class="title-before font-bold">单位其他信息</span>
    <SearchForm :search-param="formValue" :columns="otherInfoColumn" :searchCol="2"> </SearchForm>
  </div>
</template>
<script lang="ts" setup name="UnitMsgBasicInfo">
import { set } from 'lodash';
import {ref, onMounted, toRaw} from 'vue';
import { basicInfoColumnBasic, otherInfoColumnBasic } from '../data'
import {useDict} from '@/utils/dict'

const formValue = ref<any>({});

const basicInfoColumn = ref<any>(basicInfoColumnBasic);
const otherInfoColumn = ref<any>(otherInfoColumnBasic)

const basicRef = ref()

onMounted(()=>{
  getListType()
})

const getListType = async () => {
    const unitLevelData = await useDict('sys_team_level')
    basicInfoColumn.value?.forEach((item:any,index:any) => {
    if(item.label==='单位级别'){
      set(basicInfoColumn.value,`[${index}].enum`,toRaw(unitLevelData)['sys_team_level'])
    }
  })
}

const rules = {
  name1: {required:true,message:'请选择单位级别',trigger:['blur','input']}
}
</script>

<style lang="scss" scoped>
.title-before{
  position: relative;
  display: inline-block;
  margin-left: 10px;
  &::after{
    content: '';
    position: absolute;
    width: 4px;
    height: 16px;
    background: #FF8F33;
    left: -10px;
    border-radius: 2px;
    top:3px
  }
}
</style>
