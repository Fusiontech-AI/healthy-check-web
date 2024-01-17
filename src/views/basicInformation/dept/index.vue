<template>
  <div class="p-2">
    <el-card shadow="hover">
      <ProTable ref="proTable" :columns="columns" :request-api="getTableList" :toolButton="false" rowKey="id">
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
      <el-form ref="deptFormRef" :model="searchParam" :disabled="false" :label-width="100" :rules="formRules">
        <Grid ref="gridRef" :gap="[20, 0]" :cols="1">
          <GridItem v-for="(item, index) in formColumns" :key="item.prop" :index="index">
            <el-form-item :label="item.label" :prop="item.prop">
              <SearchFormItem :column="item" :search-param="searchParam" />
            </el-form-item>
          </GridItem>
        </Grid>
      </el-form>
      <template #footer>
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit" v-if="operateFlag !== '查看'">确定</el-button>
      </template>
    </el-drawer>
  </div>
</template>
<script lang="tsx" setup name="Dept">
import ProTable from '@/components/TableSearchComponent/ProTable/index.vue';
import Grid from '@/components/Grid/index.vue';
import SearchFormItem from '@/components/TableSearchComponent/SearchForm/components/SearchFormItem.vue';
import GridItem from '@/components/Grid/components/GridItem.vue';
import { nextTick } from 'vue';
import { listDept, addDept, editDept, deleteDept } from '@/api/basicInfo/dept/index';
import { columnsBasic, formColumnsBasic, formRulesBasic } from './data';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const deptFormRef = ref();
const proTable = ref();

const initFormData = {
  id: undefined,
  deptCode: '',
  deptName: '',
  deptShortName: '',
  sort: '',
  isEnable: '0',
};

const showDrawer = ref<any>(false);
const drawerTitle = ref('标题');
const searchParam = ref<any>(initFormData);
const formColumns = ref<any>(formColumnsBasic);
const columns = reactive<any>(columnsBasic);
const formRules = formRulesBasic;
const operateFlag = ref();

const getTableList = async (params: any) => {
  const data = await listDept(params);
  return {
    data: { list: data?.rows, total: data?.total, pageNum:data?.pageNum || 1, pageSize: data?.pageSize || 10 },
  };
};

const batchDelete = (row: any) => {
  handleDelete(row);
};

const handleDelete = async (row: any) => {
  const _ids = Array.isArray(row) ? row : [row.id];
  await proxy?.$modal.confirm('是否确认删除该数据?');
  await deleteDept(_ids);
  proxy?.$modal.msgSuccess('删除成功');
  proTable.value?.getTableList();
};

const openDrawer = async (flag: string, row: any) => {
  showDrawer.value = true;
  operateFlag.value = flag;
  switch (flag) {
    case '新增':
      drawerTitle.value = '新增科室';
      Object.assign(searchParam.value, {
        deptCode: '',
        deptName: null,
        deptShortName: null,
        isPrint: null,
        sort: 0,
        isEnable: '',
      });
      break;
    case '查看':
      nextTick(() => {
        drawerTitle.value = '查看详情';
        Object.assign(searchParam.value, row);
      });
      break;
    case '编辑':
      nextTick(() => {
        drawerTitle.value = '编辑科室';
        Object.assign(searchParam.value, row);
      });
      break;
  }
};

const handleSubmit = () => {
  deptFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      (await searchParam.value?.id) ? editDept(searchParam.value) : addDept(searchParam.value);
      deptFormRef.value?.resetFields();
      showDrawer.value = false;
      ElMessage.success(searchParam.value?.id ? '编辑成功' : '新增成功');
      await proTable.value?.getTableList();
      await proTable.value?.getTableList();
    }
  });
};

const handleClose = () => {
  nextTick(() => {
    searchParam.value = initFormData;
    deptFormRef.value?.resetFields();
    showDrawer.value = false;
  });
};
</script>
