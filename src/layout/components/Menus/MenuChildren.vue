<template>
  <div class="menus-sub-wrapper" :style="{ width: MenuWidth }">
    <template v-for="(item, index) in menus" :key="index">
      <router-link class="menus-sub_item" :class="{ 'router-link-active': getSubActive(item) }" :to="resolvePath(item, menuChildrens)">
        {{ item.meta?.title }}
      </router-link>
    </template>
  </div>
</template>

<script setup lang="ts">
import { PropType, computed } from 'vue'
import { isExternal } from '@/utils/validate';
import { getNormalPath } from '@/utils/ruoyi'
import {RouteOption, useRoute} from 'vue-router';
import useAppStore from '@/store/modules/app';
import variables from '@/assets/styles/variables.module.scss'

const appStore = useAppStore();
const route = useRoute()
const {fullPath} = route

const props = defineProps({
  menus: {
    type: Array as PropType<any[]>,
    default() {
      return [];
    },
  },
  path: {
    type: String,
    default: '',
  },
})

const resolvePath = (item: RouteOption, parentMenu: any): any => {
  const { path, query } = parentMenu
  if (isExternal(path)) {
    return path
  }
  if (query) {
    return { path: getNormalPath(path + '/' + item.path), query: JSON.parse(query) }
  }
  return getNormalPath(path + '/' + item.path)
}

const getSubActive = computed(() => (item: RouteOption) => props.path ? fullPath === `${props.path}/${item.path}` : fullPath === item.path)

const MenuWidth = computed(() => appStore.sidebar.opened ? variables.sideBarWidth : variables.menuWidth);
</script>

<style scoped></style>
