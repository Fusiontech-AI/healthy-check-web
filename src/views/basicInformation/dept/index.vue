<template>
  <div class="p-2">
    <transition
      :enter-active-class="proxy?.animate.searchAnimate.enter"
      :leave-active-class="proxy?.animate.searchAnimate.leave"
    >
      <div class="mb-[10px]" v-show="showSearch">
        <el-card shadow="hover">
          <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
            <el-form-item label="科室名称" prop="deptName">
              <el-input
                v-model="queryParams.deptName"
                placeholder="请输入科室名称/ID"
                clearable
                style="width: 240px"
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="科室简拼" prop="deptShortName">
              <el-input
                v-model="queryParams.deptShortName"
                placeholder="请输入科室简拼"
                clearable
                style="width: 240px"
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
              <el-button icon="Refresh" @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </transition>

    <el-card shadow="hover">
      <template #header>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" plain icon="Plus" @click="handleAdd">新增科室</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="danger"
              plain
              icon="Delete"
              :disabled="single"
              @click="handleDelete('')"
            >
              批量删除
            </el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" :data="deptList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="id" align="center" prop="id" v-if="false" />
        <el-table-column label="科室代码" align="center" prop="deptCode" />
        <el-table-column label="科室名称" align="center" prop="deptName" />
        <el-table-column label="科室简拼" align="center" prop="deptShortName" />
        <el-table-column label="排序" align="center" prop="sort" />
        <el-table-column label="是否启用" align="center" prop="isEnable">
          <template #default="scope">
            <el-switch v-model="scope.row.isEnable" active-value="1" inactive-value="0" />
          </template>
        </el-table-column>
        <el-table-column
          width="250"
          label="操作"
          align="center"
          fixed="right"
          class-name="small-padding fixed-width"
        >
          <template #default="scope">
            <el-tooltip content="详情" placement="top">
              <el-button type="primary" text @click="handleUpdate(scope.row, 'view')"
                >详情</el-button
              >
            </el-tooltip>
            <el-tooltip content="编辑" placement="top">
              <el-button
                type="primary"
                text
                @click="handleUpdate(scope.row, 'edit')"
                v-hasPermi="['system:tenant:edit']"
                >编辑</el-button
              >
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button text type="danger" @click="handleDelete(scope.row)">删除</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="total > 0"
        :total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
      />
    </el-card>

    <!-- 添加或修改科室对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="40%" append-to-body>
      <el-form ref="deptFormRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="科室编码" prop="deptCode">
          <el-input v-model="form.deptCode" placeholder="请输入科室编码" />
        </el-form-item>
        <el-form-item label="科室名称" prop="deptName">
          <el-input v-model="form.deptName" placeholder="请输入科室名称" />
        </el-form-item>
        <el-form-item label="科室简拼" prop="deptShortName">
          <el-input v-model="form.deptShortName" placeholder="请输入科室简拼" />
        </el-form-item>
        <el-form-item label="是否打印条码" prop="packageId">
          <el-select
            v-model="form.packageId"
            :disabled="!!form.tenantId"
            placeholder="请选择是否打印条码"
            clearable
            style="width: 100%"
          >
            <el-option
              v-for="item in barCodeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number :min="0" v-model="form.sort" placeholder="请输入排序" />
        </el-form-item>
        <el-form-item label="是否启用" prop="isEnable">
          <el-switch v-model="form.isEnable" active-value="1" inactive-value="0" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup name="Dept">
  import { deptV0 } from '@/api/basicInfo/dept/type';

  const { proxy } = getCurrentInstance() as ComponentInternalInstance;
  const deptFormRef = ref<ElFormInstance>();

  const barCodeList = [
    { label: '是', value: '1' },
    { label: '否', value: '0' },
  ];

  const deptList = ref<deptV0[]>([]);
  const showSearch = ref<boolean>(true);
  const queryFormRef = ref<ElFormInstance>();
  const buttonLoading = ref(false);

  const initFormData = {
    id: undefined,
    deptCode: '',
    deptName: '',
    deptShortName: '',
    sort: '',
    isEnable: '0',
  };
  const data = reactive<any>({
    form: { ...initFormData },
    queryParams: {
      pageNum: 1,
      pageSize: 10,
      deptName: '',
      deptShortName: '',
    },
    rules: {
      deptCode: [{ required: true, message: '科室编码不能为空', trigger: ['blur', 'change'] }],
      deptName: [{ required: true, message: '科室名称不能为空', trigger: ['blur', 'change'] }],
      deptShortName: [{ required: true, message: '科室简称不能为空', trigger: ['blur', 'change'] }],
      sort: [{ required: true, message: '排序不能为空', trigger: ['blur', 'change'] }],
    },
  });
  const { queryParams, form, rules } = toRefs(data);
  const loading = ref<boolean>(false);
  const total = ref<any>(0);
  const single = ref(true);
  const ids = ref<Array<string | number>>([]);

  const dialog = reactive<DialogOption>({
    visible: false,
    title: '',
  });

  onMounted(() => {
    handleQuery();
  });

  /** 搜索按钮操作 */
  const handleQuery = () => {
    queryParams.value.pageNum = 1;
    getList();
  };
  const resetQuery = () => {};

  // 表单重置
  const reset = () => {
    form.value = { ...initFormData };
    deptFormRef.value?.resetFields();
  };

  /** 查询科室列表 */
  const getList = async () => {
    loading.value = true;
    // const res = await listTenant(queryParams.value);
    const res = {
      rows: [
        {
          id: '1',
          deptCode: '0001',
          deptName: '彩超室',
          deptShortName: 'cc',
          sort: 1,
          isEnable: '1',
        },
      ],
      total: 1,
    };
    deptList.value = res.rows;
    total.value = res.total;
    loading.value = false;
  };

  // 多选框选中数据
  const handleSelectionChange = (selection: deptV0[]) => {
    ids.value = selection.map((item) => item.deptName);
    single.value = selection.length != 1;
    // multiple.value = !selection.length;
  };

  /** 新增按钮操作 */
  const handleAdd = () => {
    reset();
    // getTenantPackage();
    dialog.visible = true;
    dialog.title = '新增科室';
  };
  const handleUpdate = (row: any, flag: any) => {
    dialog.title = flag === 'view' ? '详情' : '编辑科室';
    dialog.visible = true;
    form.value = row;
  };
  const handleDelete = async (row: any) => {
    const _ids = row?.deptName || ids.value;
    await proxy?.$modal.confirm('是否确认删除科室名称为"' + _ids + '"的数据项？');
    loading.value = true;
    // await delTenant(_ids).finally(() => (loading.value = false));
    await getList();
    proxy?.$modal.msgSuccess('删除成功');
  };
  // 弹框取消
  const cancel = () => {
    dialog.visible = false;
  };
  // 弹框确定
  const submitForm = () => {
    deptFormRef.value?.validate(async (valid: boolean) => {
      if (valid) {
        proxy?.$modal.msgSuccess('操作成功');
        dialog.visible = false;
      }
    });
  };
</script>
