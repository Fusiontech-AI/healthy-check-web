<template>
  <div class="p-2">
    <transition
      :enter-active-class="proxy?.animate.searchAnimate.enter"
      :leave-active-class="proxy?.animate.searchAnimate.leave"
    >
      <div class="mb-[10px]" v-show="showSearch">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :inline="true" label-width="68px">
            <el-row :gutter="20">
              <template v-for="(item, _index) in searchFields" :key="_index">
                <el-col :span="6">
                  <el-form-item :label="item.label" :prop="item.name" style="width: 100%">
                    <component
                      v-if="item.component !== 'el-select'"
                      v-bind="item?.prop"
                      :is="item.component"
                      v-model="queryParams[item.name]"
                      :placeholder="item?.placeholder"
                      @keyup.enter="handleQuery"
                    >
                    </component>
                    <el-select v-else v-model="queryParams[item.name]" style="width: 100%">
                      <el-option
                        v-for="iOption in item.dict"
                        :key="iOption.value"
                        :label="iOption.label"
                        :value="iOption.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </template>
              <el-col :span="24" style="display: flex" class="w-full justify-end">
                <el-button type="primary" @click="handleQuery">搜索</el-button>
                <el-button @click="resetQuery">重置</el-button>
              </el-col>
            </el-row>
          </el-form>
        </el-card>
      </div>
    </transition>
    <el-card shadow="hover">
      <el-tabs type="card" v-model="activeTabName">
        <el-tab-pane label="未冻结" name="freeze">
          <el-button class="mb-[10px]" type="primary">冻结</el-button>
          <el-table v-loading="loading" :data="deptList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="id" align="center" prop="id" v-if="false" />
            <el-table-column fixed label="体检号" align="center" prop="f1">
              <template #default="scope">
                <span class="text-[#5a9cf8]">{{ scope.row.f1 }}</span>
              </template>
            </el-table-column>
            <el-table-column label="档案号" align="center" prop="f2" />
            <el-table-column label="证件号" width="150" align="center" prop="f3" />
            <el-table-column label="业务类别" align="center" prop="f4" />
            <el-table-column label="体检类型" width="100" align="center" prop="f5" />
            <el-table-column label="姓名" align="center" prop="f6" />
            <el-table-column label="婚否" align="center" prop="f7" />
            <el-table-column label="年龄" align="center" prop="f8" />
            <el-table-column label="电话" width="120" align="center" prop="f9" />
            <el-table-column label="体检日期" align="center" prop="f10" />
            <el-table-column label="回收" align="center" prop="f11" />
            <el-table-column label="冻结" align="center" prop="f12" />
            <el-table-column label="体检状态" align="center" prop="f13" />
            <el-table-column label="需要总检" align="center" prop="f14" />
            <el-table-column label="人员费别" align="center" prop="f15" />
            <el-table-column label="团费" align="center" prop="f16" />
            <el-table-column label="个费" align="center" prop="f17" />
            <el-table-column label="单位" align="center" prop="f18" />
            <el-table-column label="分组" align="center" prop="f19" />
            <el-table-column label="部门" align="center" prop="f20" />
            <el-table-column label="介绍人" align="center" prop="f21" />
            <el-table-column label="创建人" align="center" prop="f22" />
            <el-table-column label="报到人" align="center" prop="f23" />
            <el-table-column label="总检医生" align="center" prop="f24" />
            <el-table-column label="总检时间" align="center" prop="f25" />
            <el-table-column label="审核医生" align="center" prop="f26" />
            <el-table-column label="审核时间" align="center" prop="f27" />
            <el-table-column label="完成时间" align="center" prop="f28" />
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="冻结" name="noFreeze">
          <el-button class="mb-[10px]" type="primary">解冻</el-button>
          <el-table v-loading="loading" :data="deptList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="id" align="center" prop="id" v-if="false" />
            <el-table-column fixed label="体检号" align="center" prop="f1" />
            <el-table-column label="档案号" align="center" prop="f2" />
            <el-table-column label="证件号" width="150" align="center" prop="f3" />
            <el-table-column label="业务类别" align="center" prop="f4" />
            <el-table-column label="体检类型" width="100" align="center" prop="f5" />
            <el-table-column label="姓名" align="center" prop="f6" />
            <el-table-column label="婚否" align="center" prop="f7" />
            <el-table-column label="年龄" align="center" prop="f8" />
            <el-table-column label="电话" width="120" align="center" prop="f9" />
            <el-table-column label="体检日期" align="center" prop="f10" />
            <el-table-column label="回收" align="center" prop="f11" />
            <el-table-column label="冻结" align="center" prop="f12" />
            <el-table-column label="体检状态" align="center" prop="f13" />
            <el-table-column label="需要总检" align="center" prop="f14" />
            <el-table-column label="人员费别" align="center" prop="f15" />
            <el-table-column label="团费" align="center" prop="f16" />
            <el-table-column label="个费" align="center" prop="f17" />
            <el-table-column label="单位" align="center" prop="f18" />
            <el-table-column label="分组" align="center" prop="f19" />
            <el-table-column label="部门" align="center" prop="f20" />
            <el-table-column label="介绍人" align="center" prop="f21" />
            <el-table-column label="创建人" align="center" prop="f22" />
            <el-table-column label="报到人" align="center" prop="f23" />
            <el-table-column label="总检医生" align="center" prop="f24" />
            <el-table-column label="总检时间" align="center" prop="f25" />
            <el-table-column label="审核医生" align="center" prop="f26" />
            <el-table-column label="审核时间" align="center" prop="f27" />
            <el-table-column label="完成时间" align="center" prop="f28" />
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>
<script lang="ts" setup name="freezeAndThaw">
  import { getCurrentInstance, ComponentInternalInstance, ref, onMounted } from 'vue';
  import { basciSearchFields } from './data';

  const { proxy } = getCurrentInstance() as ComponentInternalInstance;

  const searchFields = basciSearchFields;
  const showSearch = ref<boolean>(true);

  const initFormData = {
    pageNum: 1,
    pageSize: 10,
    unit: '',
    task: '',
    peCode: '',
    reportDate: '',
    peStatus: '',
    name: '',
    gender: '',
    idCard: '',
  };
  const queryParams = ref<any>(initFormData);
  const loading = ref<boolean>(false);
  const deptList = ref<any>([]);
  const total = ref<number>(0);
  const activeTabName = ref<any>('freeze');

  onMounted(() => {
    handleQuery();
  });

  /** 搜索按钮操作 */
  const handleQuery = () => {
    queryParams.value.pageNum = 1;
    getList();
  };

  const getList = () => {
    loading.value = true;
    const res = {
      rows: [
        {
          id: '1',
          f1: '5501',
          f2: 'F90989',
          f3: '42090902002020',
          f4: '团检',
          f5: '职业病体检',
          f6: '张小刚',
          f7: '已婚',
          f8: '24',
          f9: '18986805978',
        },
      ],
      total: 1,
    };
    deptList.value = res.rows;
    total.value = res.total;
    loading.value = false;
  };

  //   重置
  const resetQuery = () => {
    queryParams.value = initFormData;
  };

  // 多选框选中数据
  const handleSelectionChange = (selection: any) => {};
</script>
