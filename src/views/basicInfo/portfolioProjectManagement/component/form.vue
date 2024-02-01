<template>
  <el-form ref="fromRef" :model="model" :rules="rules" class="demo-ruleForm" :label-width="140">
    <el-row :gutter="20">
      <el-col :span="24 / (item.colCount ?? colCount)" v-for="item in fields" :key="item">
        <el-form-item :label="item.label + ':'" :prop="item.name">
          <el-input v-model="model[item.name]" clearable :placeholder="'请输入' + item.label" :disabled="item.disabled"
            v-if="item.component == 'Input' && !isPreview" />
          <el-input v-model="model[item.name]" type="textarea" :show-word-limit="item['show-word-limit']"
            :maxlength="item.maxlength" :placeholder="'请输入' + item.label" :disabled="item.disabled"
            v-if="item.component == 'Textarea' && !isPreview" />
          <span v-if="(item.component == 'Input' || item.component == 'Textarea') && isPreview"> {{ model[item.name]
          }}</span>

          <el-select v-model="model[item.name]" :multiple="item.multiple" :filterable="item.filterable" clearable
            :disabled="item.disabled" :placeholder="'请选择' + item.label" v-if="item.component == 'Select' && !isPreview">
            <el-option v-for="dictitem in item.dict" :key="dictitem.value" :label="dictitem.label"
              :value="dictitem.value">
            </el-option>
          </el-select>
          <span v-if="item.component == 'Select' && isPreview"> {{ optionsName(item.dict, model[item.name]) }}</span>

          <el-radio-group v-model="model[item.name]" :placeholder="'请选择' + item.label"
            v-if="item.component == 'Radio' && !isPreview">
            <el-radio :label="radioItem.value" v-for="radioItem in item.dict" :key="radioItem">{{ radioItem.label
            }}</el-radio>
          </el-radio-group>
          <span v-if="item.component == 'Radio' && isPreview"> {{ optionsName(item.dict, model[item.name]) }}</span>

          <el-switch v-model="model[item.name]" v-if="item.component == 'Switch' && !isPreview" active-color="#13ce66"
            inactive-color="#ff4949" :active-value="item['active-value']" :inactive-value="item['inactive-value']">
          </el-switch>
          <span v-if="item.component == 'Switch' && isPreview"> {{
            item['active-value'] ? item['active-label'] : item['inactive-label'] }}</span>

        </el-form-item>

      </el-col>

      <el-collapse-transition v-if="collapse.length > 0">
        <div v-show="show">
          <el-row :gutter="20">
            <el-col :span="24 / (item.colCount ?? colCount)" v-for="item in collapse" :key="item">
              <el-form-item :label="item.label + ':'" :prop="item.name">
                <el-input v-model="model[item.name]" :type="item.type" clearable
                  :show-word-limit="item['show-word-limit']" :placeholder="'请输入' + item.label" :disabled="item.disabled"
                  v-if="item.component == 'Input' && !isPreview" />
                <el-input v-model="model[item.name]" type="textarea" :show-word-limit="item['show-word-limit']"
                  :maxlength="item.maxlength" :placeholder="'请输入' + item.label" :disabled="item.disabled"
                  v-if="item.component == 'Textarea' && !isPreview" />
                <span v-if="(item.component == 'Input' || item.component == 'Textarea') && isPreview"> {{ model[item.name]
                }}</span>

                <el-select v-model="model[item.name]" :multiple="item.multiple" :filterable="item.filterable" clearable
                  :placeholder="'请选择' + item.label" v-if="item.component == 'Select' && !isPreview">
                  <el-option v-for="dictitem in item.dict" :key="dictitem.value" :label="dictitem.label"
                    :value="dictitem.value">
                  </el-option>
                </el-select>
                <span v-if="item.component == 'Select' && isPreview"> {{ optionsName(item.dict, model[item.name])
                }}</span>

                <el-radio-group v-model="model[item.name]" :placeholder="'请选择' + item.label"
                  v-if="item.component == 'Radio' && !isPreview">
                  <el-radio :label="radioItem.value" v-for="radioItem in item.dict" :key="radioItem">{{ radioItem.label
                  }}</el-radio>
                </el-radio-group>
                <span v-if="item.component == 'Radio' && isPreview"> {{ optionsName(item.dict, model[item.name])
                }}</span>

                <el-switch v-model="model[item.name]" v-if="item.component == 'Switch' && !isPreview"
                  active-color="#13ce66" inactive-color="#ff4949" :active-value="item['active-value']"
                  :inactive-value="item['inactive-value']">
                </el-switch>
                <span v-if="item.component == 'Switch' && isPreview"> {{
                  item['active-value'] ? item['active-label'] : item['inactive-label'] }}</span>

              </el-form-item>

            </el-col>
          </el-row>
        </div>
      </el-collapse-transition>

      <div class="btn">
        <el-button @click="show = !show" v-if="collapse.length > 0" text type="primary">
          <span>{{ show ? '折叠' : '展开' }}</span>
          <el-icon :size="20" style="margin-left:10px ;" color="#409EFC">
            <ArrowUp v-if="show" />
            <ArrowDown v-else />
          </el-icon>
        </el-button>

      </div>

    </el-row>
  </el-form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { optionsKS, optionsSuitSex, getOption, getList, getTypeList, optionsCheckType, optionsSpecimenNeedFlag, optionsSampleType, optionsSpecimenType, optionsProjectType, optionsFinancialType, optionsOutFlag } from "../hooks/useOptions";
import configuration from "./configuration.vue";
const props = defineProps({
  model: {
    type: Object,
    default: {}
  },
  fields: {
    type: Array,
    default: []
  },
  collapse: {
    type: Array,
    default: []
  },
  rules: {
    type: Object,
    default: {}
  },
  isPreview: {
    type: Boolean,
    default: false
  },
  colCount: {
    type: Number,
    default: 1
  }
})


onMounted(() => {

})

const show = ref(false)
const fromRef = ref(null)

const validate = async () => {
  let flag = false
  await fromRef.value.validate((valid, fields) => {
    if (valid) {
      flag = true
    } else {
      flag = false
    }
  })
  return flag
}

const clearValidate = () => fromRef.value.clearValidate()

//计算属性
const optionsName = (arr, value) => {
  let TypeName = ''
  arr.forEach(item => {
    if (item.value == value) {
      TypeName = item.label
    }
  })
  return TypeName
}

defineExpose({
  element: fromRef,
  fromRef,
  validate,
  clearValidate
})


</script>

<style scoped>
.btn {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
}
</style>