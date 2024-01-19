<template>
  <el-form :model="model" label-width="120px" :rules="rules">
    <el-row v-for="res in arr">
      <el-col :span="24/(item.colCount?? colCount)" v-for="item in res">
        <el-form-item :label="item.label+':'">
          <slot v-if="item.component === 'Custom'" :name="item.name" />
          <el-select
            v-else-if="item.component === 'Select'"
            v-model="model[item.name]"
            :filterable="!!item.filterable"
            :multiple="!!item.multiple"
            clearable
            :placeholder="`请选择${item.label}`"
            style="width: 100%;"
          >
            <el-option v-for="option of item.dict" :key="option.value" :label="option.name" :value="option.value"></el-option>
          </el-select>
          <el-radio-group v-model="model[item.name]" v-else-if="item.component === 'Radio'">
            <el-radio v-for="option of item.dict" :key="option.value" :label="option.value">{{ option.name }}</el-radio>
          </el-radio-group>
          <el-radio-group v-model="model[item.name]" v-else-if="item.component === 'Radio-button'">
            <el-radio-button v-for="option of item.dict" :key="option.value" :label="option.value">{{ option.name }}</el-radio-button>
          </el-radio-group>
          <el-checkbox-group v-model="model[item.name]" v-else-if="item.component === 'Checkbox'">
            <el-checkbox v-for="option of item.dict" :key="option.value" :label="option.value">{{ option.name }}</el-checkbox>
          </el-checkbox-group>
          <el-checkbox-group v-model="model[item.name]" v-else-if="item.component === 'Checkbox-button'">
            <el-checkbox-button v-for="option of item.dict" :key="option.value" :label="option.value">{{ option.name }}</el-checkbox-button>
          </el-checkbox-group>
          <el-date-picker
            v-else-if="item.component === 'Datepicker'"
            v-model="model[item.name]"
            type="date"
            format="YYYY-MM-DD"
            clearable
            :placeholder="`请选择${item.label}`"
          ></el-date-picker>
          <el-date-picker
            v-else-if="item.component === 'Datetime'"
            v-model="model[item.name]"
            type="datetime"
            clearable
            format="YYYY-MM-DD HH:mm:ss"
            :placeholder="`请选择${item.label}`"
          ></el-date-picker>
          <el-date-picker
            v-else-if="item.component === 'Daterange'"
            v-model="model[item.name]"
            type="daterange"
            format="YYYY-MM-DD"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            clearable
          ></el-date-picker>
          <el-date-picker
            v-else-if="item.component === 'Datetimerange'"
            v-model="model[item.name]"
            type="datetimerange"
            format="YYYY-MM-DD HH:mm:ss"
            range-separator="-"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            clearable
          ></el-date-picker>
          <el-input-number
            v-else-if="item.component === 'Number'"
            v-model="model[item.name]"
            :placeholder="`请输入${item.label}`"
            controls-position="right"
            :min="item.min"
            :max="item.max"
          />
          <el-input
            v-else-if="item.component === 'Textarea'"
            type="textarea"
            clearable
            v-model="model[item.name]"
            :placeholder="`请输入${item.label}`"
          ></el-input>
          <el-input v-else v-model="model[item.name]" clearable :placeholder="`请输入${item.label}`"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
<script setup>
//根据isNewLine就开始单独分一个头
const {fields,rules,colCount,preview,model}=defineProps(['fields','rules','col-count','preview','model'])
const arr=ref([])
//数据重新组装
const toFieldsRow=()=> {
      var list = []
      var subList = []
      var tempIdx = 0 // 添加缓存下标，在另起一行时需要重新计算下一行的下标值
      fields.forEach(function (item, idx) {
        if (item.isNewLine) tempIdx = idx
        if (item.isNewLine || (idx - tempIdx) % colCount === 0) {
          subList = []
          list.push(subList)
        }
        subList.push(item)
      })
       arr.value=list
    }
    toFieldsRow()
</script>
