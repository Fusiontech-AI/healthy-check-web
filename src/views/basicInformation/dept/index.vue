<template>
  <div class="table-box">
    <div class="table-main">
      <ProTable ref="proTable" :columns="columns" :request-api="getTableList" :toolButton="false" rowKey="id" :searchCol="4" label-position="right">
        <!-- 表格 header 按钮 -->
        <template #tableHeader="scope">
          <el-button type="primary" @click="openDrawer('新增', '')">新增科室</el-button>
          <el-button plain :disabled="!scope.isSelected" @click="batchDelete(scope.selectedListIds)"> 批量删除 </el-button>
        </template>
        <!-- 表格操作 -->
        <template #operation="scope">
          <el-button type="primary" link @click="openDrawer('详情', scope.row)">详情</el-button>
          <el-button type="primary" link @click="openDrawer('编辑', scope.row)">编辑</el-button>
          <el-button type="primary" link @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </ProTable>

      <!-- 添加或修改科室对话框 -->
      <el-drawer v-model="showDrawer" :title="drawerTitle" direction="rtl" :before-close="handleClose" size="600">
        <SearchForm
          ref="deptFormRef"
          :search-param="searchParam"
          :columns="departColumn"
          :searchCol="1"
          :rules="departRules"
          :preview="preview"
          style="background: transparent; padding: 18px 30px;"
        >
          <template #ksName>
            <el-input v-if="!preview" v-model="searchParam.ksName" placeholder="请输入科室名称" @input="handleChangeDeptName" />
            <span v-else>{{ searchParam.ksName }}</span>
          </template>
        </SearchForm>
        <template #footer>
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="handleSubmit" v-if="operateFlag !== '详情'">确定</el-button>
        </template>
      </el-drawer>
    </div>
  </div>
</template>
<script lang="tsx" setup name="Dept">
import ProTable from '@/components/TableSearchComponent/ProTable/index.vue';
import { nextTick } from 'vue';
import { listDept, addDept, editDept, deleteDept, getKsCode } from '@/api/basicInfo/dept/index';
import { columnsBasic, formColumnsBasic, formRulesBasic } from './data';
import { getFirstLetter } from '@/utils/pinyin';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const deptFormRef = ref();
const proTable = ref();
const preview = ref(false);

const initFormData = {
  id: undefined,
  ksCode: null,
  ksName: null,
  ksSimplePy: null,
  printFlag: null,
  ksSort: null,
  status: '0',
};

const departColumn = reactive<any>(formColumnsBasic);
const departRules = formRulesBasic;

const showDrawer = ref<any>(false);
const drawerTitle = ref('标题');
const searchParam = ref<any>(initFormData);
const columns = reactive<any>(columnsBasic);
const operateFlag = ref(); //新增编辑操作标识

// 获取表格数据
const getTableList = async (params: any) => {
  const data = await listDept(params);
  return {
    data: { list: data?.rows, total: data?.total },
  };
};

// 根据科室名称改变获取拼音简码
const handleChangeDeptName = (val: any) => {
  const pinLetters = getFirstLetter(val);
  searchParam.value.ksSimplePy = pinLetters;
};

// 批量删除
const batchDelete = (row: any) => {
  handleDelete(row);
};

// 表格删除
const handleDelete = async (row: any) => {
  const _ids = Array.isArray(row) ? row : [row.id];
  await proxy?.$modal.confirm('删除后该科室不支持维护项目','是否确认删除该科室','error');
  await deleteDept(_ids);
  proxy?.$modal.msgSuccess('删除成功');
  proTable.value!.clearSelection();
  proTable.value?.getTableList();
};

// 打开弹框
const openDrawer = async (flag: string, row: any) => {
  const { data } = await getKsCode();
  showDrawer.value = true;
  operateFlag.value = flag;
  switch (flag) {
    case '新增':
      preview.value = false;
      drawerTitle.value = '新增科室';
      Object.assign(searchParam.value, { ...initFormData, ksCode: data });
      searchParam.value.id = undefined;
      break;
    case '详情':
      nextTick(() => {
        preview.value = true;
        drawerTitle.value = '详情';
        Object.assign(searchParam.value, row);
      });
      break;
    case '编辑':
      nextTick(() => {
        preview.value = false;
        drawerTitle.value = '编辑科室';
        Object.assign(searchParam.value, row);
      });
      break;
  }
};

// 表单提交
const handleSubmit = async () => {
  deptFormRef.value.validate(async (valid: any) => {
    if (valid) {
      const service = searchParam.value.id ? editDept : addDept;
      await service(searchParam.value);
      deptFormRef.value?.resetFields();
      showDrawer.value = false;
      ElMessage.success(searchParam.value?.id ? '编辑成功' : '新增成功');
      await proTable.value?.getTableList();
    }
  });
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
