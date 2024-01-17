<template>
  <div>
    <el-form ref="addInfoRef" :model="addInfo" :rules="addRules" label-width="120px" class="demo-ruleForm">
      <el-row>
        <el-col :span="12">
          <el-form-item label="样本编码:" prop="sampleCode">
            <el-input v-model="addInfo.sampleCode" v-if="!isPreview"/>
            <span v-else> {{ addInfo.sampleCode }}</span>
          </el-form-item>

        </el-col>
        <el-col :span="12">
          <el-form-item label="样本名称:" prop="sampleName">
            <el-input v-model="addInfo.sampleName" v-if="!isPreview"/>
            <span v-else> {{ addInfo.sampleName }}</span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="所属类别:" prop="sampleCategory">
            <el-select v-model="addInfo.sampleCategory" v-if="!isPreview">
              <el-option v-for="item in optionsType" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <span v-else> {{ optionsTypeName }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="标本类型:" prop="sampleType">
            <el-select v-model="addInfo.sampleType" v-if="!isPreview">
              <el-option v-for="item in optionsSample" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <span v-else> {{ optionsSampleName }}</span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="条码类型:" prop="barCodeType">
            <el-select v-model="addInfo.barCodeType" v-if="!isPreview">
              <el-option v-for="item in optionsCode" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <span v-else> {{ optionsCodeName }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="打印顺序:" prop="printSort">
            <el-input v-model="addInfo.printSort" v-if="!isPreview"/>
            <span v-else> {{ addInfo.printSort }}</span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="打印份数:" prop="printNumber">
            <el-input v-model="addInfo.printNumber" v-if="!isPreview"/>
            <span v-else> {{ addInfo.printNumber }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否打印:" prop="printFlag">
            <el-select v-model="addInfo.printFlag" v-if="!isPreview">
              <el-option v-for="item in optionsPrint" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <span v-else> {{optionsPrintName }}</span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="打印申请单:" prop="printApplyFlag">
            <el-select v-model="addInfo.printApplyFlag" v-if="!isPreview">
              <el-option v-for="item in optionsApply" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <span v-else> {{ optionsApplyName }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="申请单份数:" prop="printApplyNumber">
            <el-input v-model="addInfo.printApplyNumber" v-if="!isPreview"/>
            <span v-else> {{ addInfo.printApplyNumber }}</span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="备注:" prop="remark">
            <el-input v-model="addInfo.remark" v-if="!isPreview"/>
            <span v-else> {{ addInfo.remark }}</span>
          </el-form-item>
        </el-col>

      </el-row>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { systemList} from '@/api/basicInfo/basicProjectManagement'
import { optionsType,optionsSample,optionsCode,optionsPrint,optionsApply,getOption,getList } from "../hooks/useOptions";
const props = defineProps({
  addInfo: {
    type: Object,
    default: {}
  },
  isPreview:{
    type: Boolean,
    default: false
  }
})

const addInfoRef=ref(null)
defineExpose({addInfoRef})

onMounted(()=>{
  getList()
})
const addRules = {
  sampleCode: [{ required: true, message: '请输入样本编码', trigger: 'blur' }],
  sampleName: [{ required: true, message: '请输入样本名称', trigger: 'blur' }],
  sampleCategory: [{ required: true, message: '请输入所属类别', trigger: 'blur' }],
  sampleType: [{ required: true, message: '请输入标本类型', trigger: 'blur' }],
  barCodeType: [{ required: true, message: '请输入条码类型', trigger: 'blur' }],
}

//计算属性
const optionsTypeName=computed(()=>{
  let TypeName=''
  optionsType.value.forEach(item=>{
    if(item.value == props.addInfo.sampleCategory){
      // console.log('item.label',item.label);
      TypeName = item.label
    }
  })
  return TypeName
})
const optionsSampleName=computed(()=>{
  let TypeName=''
  optionsSample.value.forEach(item=>{
    if(item.value == props.addInfo.sampleType){
      // console.log('item.label',item.label);
      TypeName = item.label
    }
  })
  return TypeName
})
const optionsCodeName=computed(()=>{
  let TypeName=''
  optionsCode.value.forEach(item=>{
    if(item.value == props.addInfo.barCodeType){
      console.log('item.label',item.label);
      TypeName = item.label
    }
  })
  return TypeName
})
const optionsPrintName=computed(()=>{
  let TypeName=''
  optionsPrint.value.forEach(item=>{
    if(item.value == props.addInfo.printFlag){
      // console.log('item.label',item.label);
      TypeName = item.label
    }
  })
  return TypeName
})
const optionsApplyName=computed(()=>{
  let TypeName=''
  optionsApply.value.forEach(item=>{
    if(item.value == props.addInfo.printApplyFlag){
      // console.log('item.label',item.label);
      TypeName = item.label
    }
  })
  return TypeName
})


</script>

<style scoped></style>