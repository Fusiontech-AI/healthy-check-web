<template>
  <section class="app-main">
    <router-view v-slot="{ Component, route }">
      <transition :enter-active-class="animante" mode="out-in">
        <keep-alive :include="tagsViewStore.cachedViews">
          <component v-if="!route.meta.link" :is="Component" :key="route.path" />
        </keep-alive>
      </transition>
    </router-view>
    <iframe-toggle />
  </section>
</template>

<script setup name="AppMain" lang="ts">
import useTagsViewStore from '@/store/modules/tagsView';
import useSettingsStore from '@/store/modules/settings';
import IframeToggle  from './IframeToggle/index.vue'
import { ComponentInternalInstance } from "vue";
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const tagsViewStore = useTagsViewStore();

// 随机动画集合
const animante = ref<string>('');
const animationEnable = ref(useSettingsStore().animationEnable);
watch(()=> useSettingsStore().animationEnable, (val) => {
    animationEnable.value = val;
    if (val) {
        animante.value = proxy?.animate.animateList[Math.round(Math.random() * proxy?.animate.animateList.length)] as string;
    } else {
        animante.value = proxy?.animate.defaultAnimate as string;
    }
}, { immediate: true });
</script>

<style lang="scss" scoped>
.app-main {
  /* 50= navbar  50  */
  // min-height: calc(100vh - 50px);
  height: 100%;
  width: 100%;
  padding: 14px;
  position: relative;
  overflow: auto;
  background: #F3F6FB;
}

.fixed-header+.app-main {
  padding-top: 72px;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh - 84px);
  }

  .fixed-header+.app-main {
    padding-top: 104px;
  }
}

::-webkit-scrollbar {
  width: 6px;  /* 对于垂直滚动条，设置宽度 */
  height: 12px; /* 对于水平滚动条，设置高度 */
}
</style>
<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 6px;
  }
}

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background-color: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background-color: #c0c0c0;
  border-radius: 3px;
}
</style>
