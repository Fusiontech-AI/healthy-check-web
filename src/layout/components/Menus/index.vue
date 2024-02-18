<template>
  <div class="menus-container">
    <div class="menus-list" :style="{ backgroundColor: bgColor }">
      <el-scrollbar wrap-class="scrollbar-wrapper">
        <div class="menus-list_wrapper">
          <menu-item
            v-for="(route, index) in sidebarRouters.filter(i => !i.hidden)"
            :key="route.path + index"
            :item="route"
            :index="index"
            :base-path="route.path"
            @click-menu-item="clickMenuItem"
            @enter-menu-item="enterMenuItem"
          />
        </div>
      </el-scrollbar>
    </div>

    <el-scrollbar wrap-class="scrollbar-sub-wrapper" v-if="appStore.sidebar.opened">
      <!-- <transition :enter-active-class="proxy?.animate.menuSearchAnimate.enter" mode="out-in"> -->
      <div class="menus-sub-wrapper" :style="{ width: MenuWidth }">
        <template v-for="(item, index) in menuChildrens?.children" :key="index">
          <router-link class="menus-sub_item" :to="resolvePath(item, menuChildrens)" exact-active-class="router-link-active">
            {{ item.meta?.title }}
          </router-link>
        </template>
      </div>
      <!-- </transition> -->
    </el-scrollbar>

    <teleport to="body">
      <div id="menu-hover_wrapper" class="px-2 bg-transparent" v-if="!appStore.sidebar.opened && showMenuChild" @mouseleave="showMenuChild = false">
        <div class="menu-hover_wrapper">
          <template v-for="(childItem, index) in menuChildrens?.children" :key="index">
            <router-link class="menus-sub_item" :to="resolvePath(childItem, menuChildrens)" exact-active-class="router-link-active">
              {{ childItem.meta?.title }}
            </router-link>
          </template>
        </div>
      </div>
    </teleport>

    <!-- 折叠、收起 -->
    <hamburger :is-active="appStore.sidebar.opened" @toggleClick="toggleSideBar" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import MenuItem from './MenuItem.vue';
import { RouterLink, RouteOption } from "vue-router";
import useAppStore from '@/store/modules/app';
import useSettingsStore from '@/store/modules/settings'
import variables from '@/assets/styles/variables.module.scss'
import usePermissionStore from '@/store/modules/permission'
import { isExternal } from '@/utils/validate';
import { getNormalPath } from '@/utils/ruoyi'


const appStore = useAppStore();
const permissionStore = usePermissionStore()
const settingsStore = useSettingsStore()
const menuChildrens = ref<RouteOption | null>(null)
const showMenuChild = ref<boolean>(false);

// const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const sidebarRouters = computed<RouteOption[]>(() => permissionStore.sidebarRouters);

const sideTheme = computed(() => settingsStore.sideTheme);

const bgColor = computed(() => sideTheme.value === 'theme-dark' ? variables.menuBackground : variables.menuLightBackground);

const MenuWidth = computed(() => appStore.sidebar.opened ? variables.sideBarWidth : variables.menuWidth);

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

const toggleSideBar = () => {
  appStore.toggleSideBar(false);
  if(!appStore.sidebar.opened){
    menuChildrens.value = null
    showMenuChild.value = false
  } else {
    menuChildrens.value = sidebarRouters.value.filter(i => !i.hidden)[0]
  }
}

const clickMenuItem = (menuItem: RouteOption) => {
  // appStore.openSlidebar(false);
  menuChildrens.value = menuItem
}

const enterMenuItem = (menuItem: RouteOption, index: number) => {
  menuChildrens.value = menuItem
  showMenuChild.value = true
  nextTick(()=>{
  const menulist = document.getElementsByClassName('menu-item')
  const rect = menulist[index]?.getBoundingClientRect()
    const wrapperHtml = document.getElementById('menu-hover_wrapper')
    const clientHeight = wrapperHtml?.clientHeight || 0
    const winHeight = document.documentElement.clientHeight


    if(wrapperHtml) {
      if(winHeight - rect.top < clientHeight){
        wrapperHtml.style.top = ''
        wrapperHtml.style.bottom = '5px'
      } else {
        wrapperHtml.style.top = rect.top + 'px'
        wrapperHtml.style.bottom = ''
      }
    }
  })
}

watch(
  ()=> appStore.sidebar.opened,
  ()=> {
    if(appStore.sidebar.opened && !menuChildrens.value) {
      menuChildrens.value = sidebarRouters.value.filter(i => !i.hidden)[0]
    }
  },
  { immediate:true }
)
</script>
