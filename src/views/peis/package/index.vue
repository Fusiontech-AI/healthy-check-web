<template>
  <div class="p-2">
    <ProTable :columns="tableColumns" :toolButton="false" :data="[{ name: 'aaaaaakaskhaskhahadhsa,d' }]">
      <template #tableHeader="scope">
        <el-button type="primary" round @click="handleAdd">新增</el-button>
        <el-button round>批量删除</el-button>
      </template>
      <template #operation="scope">
        <el-button type="primary" link>详情</el-button>
        <el-popover placement="bottom" trigger="click">
          <template #reference>
            <el-button type="primary" link>更多操作</el-button>
          </template>
          <div><el-button type="primary" link>编辑</el-button></div>
          <el-button type="danger" link>删除</el-button>
        </el-popover>
      </template>
    </ProTable>
  </div>
</template>

<script setup name="package" lang="ts">
const tableColumns=ref([
  {
    type:'selection',
    prop: 'name',
    label: '姓名',
  },
  { prop: 'name', label: '编码', fixed: 'left' },
  { prop: 'name', label: '套餐名称',search: { el: 'input' },isShow:false },
  { prop: 'name', label: '体检类型', search: { el: 'select' }},
  { prop: 'name', label: '适用性别', search: { el: 'select' }},
  { prop: 'name', label: '标准金额' },
  { prop: 'name', label: '折后金额' },
  { prop: 'name', label: '折扣' },
  { prop: 'name', label: '创建人' },
  { prop: 'name', label: '创建时间' },
  { prop: 'name', label: '修改人' },
  { prop: 'name', label: '修改时间' },
  { prop: 'name', label: '是否启用' ,search: { el: 'select' }},
  { prop: 'operation', label: '操作', width: 140, fixed: 'right' }
  ])
  const router = useRouter();
  const handleAdd=()=>{
    router.push("/basicInfo/package-data/operation");
  }
</script>
