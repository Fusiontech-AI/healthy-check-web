<template>
  <div class="p-2">
    <ProTable :columns="tableColumns" :toolButton="false" :request-api="packageList" :init-param="initParam">
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
import {
  packageList,
  packageDel
} from "@/api/peis/package";

// ProTable 实例
const proTable = ref<ProTableInstance>();
// 如果表格需要初始化请求参数，直接定义传给 ProTable (之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({});

const { proxy } = getCurrentInstance() as ComponentInternalInstance
const { bus_physical_type, bus_gender } = toRefs<any>(proxy?.useDict('bus_physical_type', 'bus_gender'))
const tableColumns = ref([
  {
    type: 'selection',
    prop: 'name',
    label: '姓名',
  },
  { prop: 'pySimpleCode', label: '编码' },
  { prop: 'packageName', label: '套餐名称', search: { el: 'input' }, isShow: false },
  { prop: 'tjType', label: '体检类型', search: { el: 'select' }, enum: bus_physical_type },
  { prop: 'suitSex', label: '适用性别', search: { el: 'select' }, enum: bus_gender },
  { prop: 'standardAmount', label: '标准金额' },
  { prop: 'receivableAmount', label: '折后金额' },
  { prop: 'discount', label: '折扣' },
  { prop: 'createBy', label: '创建人' },
  { prop: 'createTime', label: '创建时间' },
  { prop: 'updateBy', label: '修改人' },
  { prop: 'updateTime', label: '修改时间' },
  { prop: 'status', label: '是否启用', search: { el: 'select' }, enum: [{ label: '是', value: '0' }, { label: '否', value: '1' }] },
  { prop: 'operation', label: '操作', width: 140, fixed: 'right' }
])
const router = useRouter();
const handleAdd = () => {
  router.push("/basicInfo/package-data/operation");
}
</script>
