<template>
  <div class="table-box">
    <ProTable ref="proTableRef" :toolButton="false" :columns="tableColumns" :request-api="getTableList" default-expand-all>
      <template #tableHeader>
        <el-button type="primary" @click="handleAddOrEdit(1)">新增大类</el-button>
        <el-button type="primary" @click="handleAddOrEdit(2)">新增小类</el-button>
      </template>
      <template #operation="{row}">
        <el-button link type="primary" @click="handleAddOrEdit(row.parentId == 1 ? 1 : 2, row)">编辑</el-button>
        <el-button link type="primary" @click="handleDelete(row)">删除</el-button>
      </template>
    </ProTable>
    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="30%">
      <SearchForm ref="searchFormRef" :columns="filedColumns" :search-col="1" :search-param="searchParams"></SearchForm>
      <el-row type="flex" justify="end">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确认</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash'
import { getYxTypeList, getTjYxTypedList, addOrEditTjYxType, delYxType } from '@/api/basicInfo/diagnosticKnowledge/masculineClassification'
const tableColumns = ref<any>([
  {
    prop: 'name',
    label: '类别名称',
    search: {
      el: 'input'
    },
    align: 'left'
  },
  {
    prop: 'sort',
    label: '排序',
  },
  {
    prop: 'operation',
    label: '操作',
    width: 180
  }
])
const bigFiledColumns = ref([
  {
    prop: 'name',
    label: '大类名称',
    search: {
      el: 'input',
      rules: [{ required: true, message: '请输入大类名称', trigger: 'blur' }]
    },
  },
  {
    prop: 'sort',
    label: '大类排序',
    search: {
      el: 'input',
      rules: [
            { required: true, message: '请输入大类排序', trigger: 'blur' },
            {
              validator: (rule:any, value:any, callback:any) => {
                if (!/^\d+$/.test(value)) {
                  callback(new Error('请输入正整数数字'))
                } else {
                  callback()
                }
              },
              trigger: 'blur'
            }
          ]
    }
  },
])
const smallFiledColumns = ref([
  {
    prop: 'parentId',
    label: '大类名称',
    search: {
      el: 'select',
      rules: [{ required: true, message: '请选择大类名称', trigger: 'change' }]
    },
    enum: [],
    fieldNames: { label: 'name', value: 'id' }
  },
  {
    prop: 'name',
    label: '小类名称',
    search: {
      el: 'input',
      rules: [{ required: true, message: '请输入小类名称', trigger: 'change' }]
    },
  },
  {
    prop: 'sort',
    label: '小类排序',
    search: {
      el: 'input',
      rules: [
        { required: true, message: '请输入小类排序', trigger: 'blur' },
        {
          validator: (rule:any, value:any, callback:any) => {
            if (!/^\d+$/.test(value)) {
              callback(new Error('请输入正整数数字'))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }
      ]
    }
  },
] )
const proTableRef:any = ref('')
const searchFormRef:any = ref('')
const filedColumns = ref<any>([])
const dialogTitle = ref('')
const dialogVisible = ref(false)
const rowItem = ref<any>({})
const searchParams = ref<any>({})

const handleDelete = (row:any) => {
  ElMessageBox.confirm('请确认是否删除？', '警告', {
    cancelButtonText: '取消',
    confirmButtonText: '确定',
    type: 'warning',
  }).then(async()=> {
    await delYxType([row.id])
    proTableRef.value.getTableList()
    ElMessage.success('删除成功')
  }).catch(() => {
    ElMessage({
      type: 'info',
      message: '已取消',
    })
  })
}

const handleAddOrEdit = async(type:any, row:any = null)=> {
  dialogVisible.value = true
  searchFormRef.value && searchFormRef.value.resetFields()
  rowItem.value = _.cloneDeep(row)
  if(type === 1) {
    filedColumns.value = bigFiledColumns.value
    dialogTitle.value = row ? '编辑大类' : '新增大类'
  }else {
    filedColumns.value = smallFiledColumns.value
    dialogTitle.value = row ? '编辑小类' : '新增小类'
  }
  if(row) {
    const { name, sort, parentId } = row
    searchParams.value = { name, sort, parentId }
  }else {
    searchParams.value = {}
  }
}

const handleSubmit = async()=> {
  searchFormRef.value.validate(async(valid:any)=> {
    if(valid) {
      await addOrEditTjYxType({id: rowItem.value?.id, ...searchParams.value, parentId: searchParams.value.parentId??1})
      dialogVisible.value = false
      proTableRef.value.getTableList()
      ElMessage.success(rowItem.value?.id?'编辑成功':'新增成功')
    }
  })
}

const getTableList = async(params:any)=> {
  const res = await getYxTypeList(params)
  const {data} = await getTjYxTypedList({level: 1})
  smallFiledColumns.value.forEach((item:any)=> {
    if(item.prop === 'parentId') {
      item.enum = data
    }
  })
  return res
}
</script>

<style scoped>

</style>