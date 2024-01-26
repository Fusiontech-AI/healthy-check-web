<template>
  <div>
    <el-card shadow="hover">
      <ProTable ref="proTable" :columns="columns" :request-api="getTableList" :toolButton="false" rowKey="id" :data-callback="dataCallback">
        <!-- 表格 header 按钮 -->
        <template #tableHeader="scope">
          <el-button round type="primary" @click="openDrawer('新增', '')">新增科室</el-button>
          <el-button round plain :disabled="!scope.isSelected" @click="batchDelete(scope.selectedListIds)"> 批量删除 </el-button>
        </template>
        <!-- 表格操作 -->
        <template #operation="scope">
          <el-button type="primary" link @click="openDrawer('查看', scope.row)">查看</el-button>
          <el-button type="primary" link @click="openDrawer('编辑', scope.row)">编辑</el-button>
          <el-button type="primary" link @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </ProTable>
    </el-card>

    <!-- 添加或修改科室对话框 -->
    <el-drawer v-model="showDrawer" :title="drawerTitle" direction="rtl" :before-close="handleClose">
      <SearchForm
        ref="deptFormRef"
        :search-param="searchParam"
        :columns="departColumn"
        :searchCol="1"
        :rules="departRules"
        :preview="preview"
        style="background: transparent; padding: 18px 30px;"
      >
      </SearchForm>
      <template #footer>
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit" v-if="operateFlag !== '查看'">确定</el-button>
      </template>
    </el-drawer>
  </div>
</template>
<script lang="tsx" setup name="Dept">
import ProTable from '@/components/TableSearchComponent/ProTable/index.vue';
import { nextTick } from 'vue';
import { listDept, addDept, editDept, deleteDept } from '@/api/basicInfo/dept/index';
import { columnsBasic, formColumnsBasic, formRulesBasic } from './data';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const deptFormRef = ref();
const proTable = ref();
const preview = ref(false)

const initFormData = {
  id: undefined,
  deptCode: '',
  deptName: '',
  deptShortName: '',
  sort: '',
  status:'0'
};

const departColumn = reactive<any>(formColumnsBasic)
const departRules = formRulesBasic

const showDrawer = ref<any>(false);
const drawerTitle = ref('标题');
const searchParam = ref<any>(initFormData);
const columns = reactive<any>(columnsBasic);
const operateFlag = ref();//新增编辑操作标识

// 获取表格数据
const getTableList = async (params: any) => {
  const data = await listDept(params);
  return  {
    data: { list: data?.rows, total: data?.total },
  };
};

// 批量删除
const batchDelete = (row: any) => {
  handleDelete(row);
};

// 表格删除
const handleDelete = async (row: any) => {
  const _ids = Array.isArray(row) ? row : [row.id];
  await proxy?.$modal.confirm('是否确认删除该数据?');
  await deleteDept(_ids);
  proxy?.$modal.msgSuccess('删除成功');
  proTable.value!.clearSelection()
  proTable.value?.getTableList();
};

// 打开弹框
const openDrawer = async (flag: string, row: any) => {
  showDrawer.value = true;
  operateFlag.value = flag;
  switch (flag) {
    case '新增':
      preview.value = false
      drawerTitle.value = '新增科室';
      Object.assign(searchParam.value, initFormData);
      break;
    case '查看':
      nextTick(() => {
        preview.value = true
        drawerTitle.value = '查看详情';
        Object.assign(searchParam.value, row);
      });
      break;
    case '编辑':
      nextTick(() => {
        preview.value = false
        drawerTitle.value = '编辑科室';
        Object.assign(searchParam.value, row);
      });
      break;
  }
};

// 表单提交
const handleSubmit =async () => {
    await deptFormRef.value.validate()
    const service = searchParam.value?.id ? editDept : addDept
    await service(searchParam.value)
    deptFormRef.value?.resetFields();
    showDrawer.value = false;
    ElMessage.success(searchParam.value?.id ? '编辑成功' : '新增成功');
    await proTable.value?.getTableList();
};

// 表单关闭
const handleClose = () => {
  nextTick(() => {
    searchParam.value = initFormData;
    deptFormRef.value?.resetFields();
    showDrawer.value = false;
  });
};
</script>
