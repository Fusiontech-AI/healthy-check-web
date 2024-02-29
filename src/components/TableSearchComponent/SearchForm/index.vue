<template>
  <div v-if="columns.length" class="card form-search">
    <el-form ref="formRef" :model="searchParam" label-position="left" labelWidth="auto" v-bind="$attrs">
      <Grid ref="gridRef" :collapsed="collapsed" :gap="[20, 0]" :cols="searchCol">
        <GridItem v-for="(item, index) in columnsFunc" :key="item.prop" v-bind="getResponsive(item)" :index="index"
          :class="{ 'notLabel': !item.label }">
          <slot :name="item.prop + 'Component'">
            <slot :name="'search' + item.slot">
              <el-form-item :prop="item.prop" v-bind="item.search">
                <template #label>
                  <el-space :size="4">
                    <span>{{ `${item.search?.label ?? item.label}` }}</span>
                    <el-tooltip v-if="item.search?.tooltip" effect="dark" :content="item.search?.tooltip" placement="top">
                      <i :class="'iconfont icon-yiwen'"></i>
                    </el-tooltip>
                  </el-space>
                  <span>:</span>
                </template>
                <slot :name="item.prop + 'Slot'">
                  <template v-if="item.slot">
                    <slot :name="item.slot" :field="item.prop" :model="searchParam" :value="searchParam[item.prop]">
                    </slot>
                  </template>
                  <RenderFormValue v-else-if="preview" v-bind="item"></RenderFormValue>
                  <SearchFormItem v-else :column="item" :search-param="searchParam" v-on="{ ...item }" />
                </slot>
              </el-form-item>
            </slot>
          </slot>
        </GridItem>
        <GridItem suffix>
          <div class="operation" v-if="showActionGroup">
            <slot name="formAction">
              <FormAction :actionOption="actionOption" @search="search" @reset="reset" class="mr-2"></FormAction>
              <el-button v-if="showCollapse" type="primary" link class="search-isOpen" @click="collapsed = !collapsed">
                {{ collapsed ? "展开" : "合并" }}
                <el-icon class="el-icon--right">
                  <component :is="collapsed ? ArrowDown : ArrowUp"></component>
                </el-icon>
              </el-button>
            </slot>
          </div>
        </GridItem>
      </Grid>
    </el-form>
  </div>
</template>
<script setup lang="tsx" name="SearchForm">
import { computed, ref } from "vue";
import { ColumnProps } from "@/components/TableSearchComponent/ProTable/interface";
import { BreakPoint } from "@/components/Grid/interface";
import { Delete, Search, ArrowDown, ArrowUp } from "@element-plus/icons-vue";
import SearchFormItem from "./components/SearchFormItem.vue";
import Grid from "@/components/Grid/index.vue";
import GridItem from "@/components/Grid/components/GridItem.vue";
import FormAction from '@/components/TableSearchComponent/SearchForm/components/FormAction.vue'
import { useTable } from "@/hooks/useTable";
import { array } from "vue-types";

interface ProTableProps {
  columns?: ColumnProps[]; // 搜索配置列
  searchParam?: { [key: string]: any }; // 搜索参数
  searchCol?: number | Record<BreakPoint, number>;
  search?: (params: any) => void; // 搜索方法
  reset?: (params: any) => void; // 重置方法
  showActionGroup?: boolean; //是否显示操作按钮
  actionOption?: any; // 表单操作项目 ==> 重置查询按钮配置项
  preview?: boolean; // 是否是预览模式 ==> true时显示字段 false时显示输入框等
}

// 默认值
const props = withDefaults(defineProps<ProTableProps>(), {
  columns: () => [],
  searchParam: () => ({}),
  searchCol: 3,
  showActionGroup: false,
  actionOption: {},
  preview: false
});

const RenderFormValue = (item: any) => {
  return <div>{{
    default: () => {
      if (props.searchParam[item.prop] && item.enum && item?.search?.el == 'select') {
        return item.enum?.find((val: { value: any; }) => val?.value == props.searchParam[item.prop])?.label || props.searchParam[item.prop]
      }
      if (props.searchParam[item.prop] && item.enum && item?.search?.el == 'switch') {
        return item.enum?.find((val: { value: any; }) => val?.value == props.searchParam[item.prop])?.label || props.searchParam[item.prop]
      }
      if (props.searchParam[item.prop] && item.enum && item?.search?.el == 'tree-select') {
        return recursion(item.enum, props.searchParam[item.prop])
      }
      return props.searchParam[item.prop]
    }
  }}</div>
}

let txt = ''
//递归找出单位需要回显的值
const recursion = (arr, val) => {
  arr.forEach(item => {
    if (item.id == val) {
      txt = item.teamName
    } else {
      item.children && recursion(item.children, val)
    }
  })
  return txt
}

const formRef = ref<any>(null)
// 表单校验
const validate = async (cb: any) => {
  await unref(formRef)?.validate((valid: any, fields: any) => {
    cb(valid, fields)
  })
}

//清空校验
async function clearValidate() {
  await unref(formRef)?.clearValidate();
}

// 重置表单内容
async function resetFields() {
  await unref(formRef)?.resetFields();
}

// 控制表单列显示与隐藏
const columnsFunc = computed(() => {
  return props.columns.filter(item => item.isShowSearch ?? true)
})

// 输出组件的方法，让外部组件可以调用
defineExpose({
  validate,
  clearValidate,
  resetFields,
  formRef
})

// 获取响应式设置
const getResponsive = (item: ColumnProps) => {
  return {
    span: item.search?.span,
    offset: item.search?.offset ?? 0,
    xs: item.search?.xs,
    sm: item.search?.sm,
    md: item.search?.md,
    lg: item.search?.lg,
    xl: item.search?.xl
  };
};

// 是否默认折叠搜索项
const collapsed = ref(false);

// 获取响应式断点
const gridRef = ref();
const breakPoint = computed<BreakPoint>(() => gridRef.value?.breakPoint);

// 判断是否显示 展开/合并 按钮
const showCollapse = computed(() => {
  let show = false;
  props.columns.reduce((prev, current) => {
    prev +=
      (current.search![breakPoint.value]?.span ?? current.search?.span ?? 1) +
      (current.search![breakPoint.value]?.offset ?? current.search?.offset ?? 0);
    if (typeof props.searchCol !== "number") {
      if (prev >= props.searchCol[breakPoint.value]) show = true;
    } else {
      if (prev >= props.searchCol) show = true;
    }
    return prev;
  }, 0);
  return show;
});
</script>
<style scoped lang="scss">
.notLabel {
  :deep(.el-form-item__label-wrap) {
    width: 0;
  }

  :deep(.el-form-item--default) {
    margin-bottom: 10px;
  }

}
</style>

