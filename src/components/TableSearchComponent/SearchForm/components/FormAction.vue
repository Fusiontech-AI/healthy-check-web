<template>
  <div>
    <el-button
      v-if="!(actionOption.hasOwnProperty('showResetButton') && !actionOption.showResetButton)"
      v-bind="actionOption?.resetOption"
      @click="handleReset"
      style="padding: 5px 26px;"
    >
      {{actionOption?.resetOption?.btnText || '重置'}}
    </el-button>
    <el-button
      v-if="!(actionOption.hasOwnProperty('showSubmitButton') && !actionOption.showSubmitButton)"
      :type="actionOption?.submitOption?.type || 'primary'"
      v-bind="actionOption?.submitOption"
      @click="handleSearch"
      style="padding: 5px 26px;"
    >
      {{actionOption?.submitOption?.btnText || '查询'}}
    </el-button>
  </div>
</template>
<script lang="ts" setup>
import { Delete, Search, ArrowDown, ArrowUp } from "@element-plus/icons-vue";

interface ActionOption {
  showSubmitButton?: boolean; // 是否显示搜索提交按钮
  showResetButton?: boolean; // 是否显示重置按钮
  submitOption?: { // 搜索提交配置项
    type?: "" | "text" | "default" | "primary" | "success" | "warning" | "info" | "danger",
    btnText?: any
  };
  resetOption?:  { // 重置提交配置项
    type?: "" | "text" | "default" | "primary" | "success" | "warning" | "info" | "danger" ,
    btnText?: any
  }
}

// 接受父组件参数，配置默认值
withDefaults(defineProps<{ actionOption: ActionOption}>(), {
  actionOption:  () => ({
    showSubmitButton: true, 
    showResetButton: true,
    submitOption: {
      btnText: '搜索'
    },
    resetOption: {
      btnText: '重置'
    }
  })
});

const emit = defineEmits<{
  (e: 'search'): void;
  (e: 'reset'): void;
}>();

async function handleSearch() {
  emit('search');
}
async function handleReset() {
  emit('reset');
}
</script>
