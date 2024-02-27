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

    <el-scrollbar wrap-class="scrollbar-sub-wrapper">
      <transition :enter-active-class="proxy?.animate.menuSearchAnimate.enter" mode="out-in">
        <div class="menus-sub-wrapper" :style="{ width: MenuWidth }" v-if="appStore.sidebar.opened">
          <el-menu :default-active="activeMenu" :collapse="false" :unique-opened="true" :collapse-transition="true" mode="vertical">
            <sub-menu-item
              v-for="(route, index) in menuChildrens?.children"
              :key="route.path + index"
              :item="route"
              :base-path="menuChildrens?.path + '/'+route.path"
            />
          </el-menu>
        </div>
      </transition>
    </el-scrollbar>

    <teleport to="body">
      <transition name="el-zoom-in-left">
        <div id="menu-hover_wrapper" class="px-2 bg-transparent" v-if="!appStore.sidebar.opened && showMenuChild" @mouseleave="showMenuChild = false">
          <div class="menu-hover_wrapper">
            <el-menu
              @select="showMenuChild = false"
              :default-active="activeMenu"
              :collapse="false"
              :unique-opened="true"
              :collapse-transition="true"
              mode="vertical"
            >
              <sub-menu-item
                v-for="(route, index) in menuChildrens?.children"
                :key="route.path + index"
                :item="route"
                :base-path="menuChildrens?.path + '/'+route.path"
              />
            </el-menu>
          </div>
        </div>
      </transition>
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
import SubMenuItem from './SubMenuItem.vue';

const appStore = useAppStore();
const permissionStore = usePermissionStore()
const settingsStore = useSettingsStore()
const menuChildrens = ref<RouteOption | null>(null)
const showMenuChild = ref<boolean>(false);

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const sidebarRouters = computed<RouteOption[]>(() => permissionStore.sidebarRouters);

const sideTheme = computed(() => settingsStore.sideTheme);

const bgColor = computed(() => sideTheme.value === 'theme-dark' ? variables.menuBackground : variables.menuLightBackground);

const MenuWidth = computed(() => appStore.sidebar.opened ? variables.sideBarWidth : variables.menuWidth);

const route = useRoute();
const activeMenu = computed(():string => {
    const { meta, path }:any = route;
    // if set path, the sidebar will highlight the path you set
    if (meta.activeMenu) {
        return meta.activeMenu;
    }
    return path;
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

const toggleSideBar = () => {
  appStore.toggleSideBar(!appStore.sidebar.opened);
  // if(!appStore.sidebar.opened){
  //   // menuChildrens.value = null
  //   showMenuChild.value = false
  // } else {
  //   menuChildrens.value = sidebarRouters.value.filter(i => !i.hidden)[0]
  // }
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
    // if(appStore.sidebar.opened && !menuChildrens.value) {
    //   menuChildrens.value = sidebarRouters.value.filter(i => !i.hidden)[0]
    // }

    menuChildrens.value = sidebarRouters.value.filter((item)=> !item.hidden && item.path == '/' + route.path.split('/')[1])[0]
    if(!menuChildrens.value) {
      menuChildrens.value = sidebarRouters.value.filter(i => !i.hidden)[0]
    }
  },
  { immediate:true }
)
</script>
