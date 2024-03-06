<template>
  <div>
    <SearchForm ref="formRefY" :columns="formColumnsY" :search-param="formY" :search-col="4" :disabled="false"
      label-position="right" :preview="true">
    </SearchForm>
    <SearchForm ref="formRef" :columns="formColumns" :search-param="form" :search-col="4" :rules="rules"
      :disabled="false" label-position="right">
      <template #zjh>
        <el-form-item label="" prop="replaceCredentialNumber">
          <div class="flex">
            <el-input v-model="form.replaceCredentialNumber" placeholder="请输入" @input="zjhInput" />
            <el-button round type="primary" class="ml10px">读取</el-button>
          </div>
        </el-form-item>
      </template>
    </SearchForm>
    <el-button round type="primary" class="float-right" @click="handleBc">保存</el-button>
  </div>
</template>

<script setup name="groupRegistrationCheckRegistration" lang="ts">
import { cloneDeep } from 'lodash'
import { tijianColumns, tijianRules, tijianColumnsY } from './rowColumns'
import { changeRegReplaceInfo } from '@/api/deskRegistration/medicalRegistration'
import { getBirthday, getCurrentAgeByBirthDate, getSex } from '@/utils'
const props = defineProps({
  formValue: {
    type: Object,
    default: () => { },
  },
  getDetail: {
    type: Function,
    default: () => null,
  },
})
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
//证件类型change事件
const zjlxChange = (val) => {
  form.value.replaceBirthday = ''
  form.value.replaceAge = ''
  form.value.replaceGender = ''
  form.value.replaceCredentialNumber = ''
  formColumns.value.forEach(item => {
    if (item.label == '替检人生日' || item.label == '替检人年龄' || item.label == '替检人性别') {
      if (val == '0') {
        item.search.disabled = true
      } else {
        item.search.disabled = false
      }
    }
  })
}
//证件号型zjhInput事件
const zjhInput = async (val) => {
  form.value.replaceBirthday = ''
  form.value.replaceAge = ''
  form.value.replaceGender = ''
  if (form.value.replaceCredentialType == '0') {
    form.value.replaceBirthday = getBirthday(val) + ' ' + '00:00:00'
    if (getBirthday(val).length === 10) {
      form.value.replaceAge = getCurrentAgeByBirthDate(form.value.replaceBirthday)
      form.value.replaceGender = getSex(val, 'num')
    }
  }
}
const formColumns = ref(tijianColumns(zjlxChange))
const formColumnsY = ref(tijianColumnsY)
const form = ref<any>({
  replaceCredentialType: '0',
}) // 基本信息绑定的值
const formY = ref<any>({
  replaceCredentialType: '0',
}) // 基本信息绑定的值
const rules = reactive(tijianRules)
const formRef = ref()
const formRefY = ref()
const handleBc = () => {
  formRef.value.validate(async (valid, fields) => {
    if (valid) {
      const { replaceName,
        replaceCredentialType,
        replaceCredentialNumber,
        replaceBirthday,
        replaceGender,
        replaceAge, replacePhone } = form.value
      const p = {
        registerId: props.formValue.id,
        replaceName,
        replaceCredentialType,
        replaceCredentialNumber,
        replaceBirthday: replaceBirthday + ' ' + '00:00:00',
        replaceGender,
        replaceAge, replacePhone
      }
      await changeRegReplaceInfo(p)
      proxy?.$modal.msgSuccess("操作成功");
      //查详情更新数据
      props?.getDetail(props.formValue.id)
    }
  })
}
watch(() => props.formValue.replaceFlag, (newV) => {
  //替检标志 0是 1否
  const formValue = cloneDeep(props.formValue)
  if (newV == '0') {
    const arr = [
      {
        value1: 'replaceName',
        value2: 'name',
      },
      {
        value1: 'replaceCredentialType',
        value2: 'credentialType',
      },
      {
        value1: 'replaceCredentialNumber',
        value2: 'credentialNumber',
      },
      {
        value1: 'replaceBirthday',
        value2: 'birthday',
      },
      {
        value1: 'replaceGender',
        value2: 'gender',
      },
      {
        value1: 'replaceAge',
        value2: 'age',
      },
      {
        value1: 'replacePhone',
        value2: 'phone',
      },
    ]
    for (const iterator of arr) {
      form.value[iterator.value1] = formValue[iterator.value2]
      formY.value[iterator.value2] = formValue[iterator.value1]
    }
  } else {
    form.value = formValue
    formY.value = formValue
  }
}, { immediate: true })
</script>
