<template>
  <div :class="classObj" class="app-wrapper" :style="{ '--current-color': theme }">
    <PageHeader />
    <div class="app-container">
      <!-- <div v-if="device === 'mobile' && sidebar.opened" class="drawer-bg" @click="handleClickOutside" /> -->
      <Menus />

      <div :class="{ hasTagsView: needTagsView, sidebarHide: sidebar.hide }" class="main-container flex-1"
        :style="{ width: ConteinerWidth }">
        <tags-view v-if="needTagsView" />
        <app-main />
      </div>
      <!-- <side-bar v-if="!sidebar.hide" class="sidebar-container" /> -->
      <!-- <div :class="{ hasTagsView: needTagsView, sidebarHide: sidebar.hide }" class="main-container">
        <el-scrollbar>
          <div :class="{ 'fixed-header': fixedHeader }">
            <navbar ref="navbarRef" @setLayout="setLayout" />
            <tags-view v-if="needTagsView" />
          </div>
          <app-main />
          <settings ref="settingRef" />
        </el-scrollbar>
        <div :class="{ 'fixed-header': fixedHeader }">
          <navbar ref="navbarRef" @setLayout="setLayout" />
          <tags-view v-if="needTagsView" />
        </div>
        <app-main />
        <settings ref="settingRef" />
      </div> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import PageHeader from './components/PageHeader/index.vue';
import Menus from './components/Menus/index.vue';
import useAppStore from '@/store/modules/app'
// import SideBar from './components/Sidebar/index.vue'
import variables from '@/assets/styles/variables.module.scss'
import { AppMain, Navbar, Settings, TagsView } from './components'
import useSettingsStore from '@/store/modules/settings'

const settingsStore = useSettingsStore()
const theme = computed(() => settingsStore.theme);
const sidebar = computed(() => useAppStore().sidebar);
const device = computed(() => useAppStore().device);
const needTagsView = computed(() => settingsStore.tagsView);
const fixedHeader = computed(() => settingsStore.fixedHeader);

const classObj = computed(() => ({
  hideSidebar: !sidebar.value.opened,
  openSidebar: sidebar.value.opened,
  withoutAnimation: sidebar.value.withoutAnimation,
  mobile: device.value === 'mobile'
}))

const { width } = useWindowSize();
const WIDTH = 992; // refer to Bootstrap's responsive design

watchEffect(() => {
  if (device.value === 'mobile' && sidebar.value.opened) {
    useAppStore().closeSideBar({ withoutAnimation: false })
  }
  if (width.value - 1 < WIDTH) {
    useAppStore().toggleDevice('mobile')
    useAppStore().closeSideBar({ withoutAnimation: true })
  } else {
    useAppStore().toggleDevice('desktop')
  }
})

const navbarRef = ref(Navbar);
const settingRef = ref(Settings);

const ConteinerWidth = computed(() => {
  if (sidebar.value.opened) {
    const width = variables.sideBarWidth + variables.menuWidth
    return `calc(100vh - ${width})`
  } else {
    return `calc(100vh - ${variables.menuWidth})`
  }

});

// onMounted(() => {
//   nextTick(() => {
//     navbarRef.value.initTenantList();
//   })
// })

const handleClickOutside = () => {
  useAppStore().closeSideBar({ withoutAnimation: false })
}

const setLayout = () => {
  settingRef.value.openSetting();
}
</script>

<style lang="scss" scoped>
@import "@/assets/styles/mixin.scss";
@import "@/assets/styles/variables.module.scss";

.app-wrapper {

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.app-container {
  // @include clearfix;
  // position: relative;
  // height: 100%;
  width: 100%;
  display: flex;
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$base-sidebar-width});
  transition: width 0.28s;
  background: $fixed-header-bg;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.sidebarHide .fixed-header {
  width: 100%;
}

.mobile .fixed-header {
  width: 100%;
}
</style>
