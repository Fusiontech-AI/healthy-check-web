<template>
  <div v-if="!item.hidden">
    <template v-if="hasOneShowingChild(item, item.children) && (!onlyOneChild.children || onlyOneChild.noShowingChildren) && !item.alwaysShow">
      <div
        class="menu-item"
        :class="{ 'menu-item_active': isActiveRouter(onlyOneChild) }"
        @click="clickMenuItem(item)"
        @mouseenter="mouseenterMenuItem(item)"
      >
        <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path, onlyOneChild.query)">
          <div class="menu-item_icon">
            <svg-icon :icon-class="onlyOneChild.meta.icon || (item.meta && item.meta.icon)" />
          </div>
          <span class="menu-title" v-if="appStore.sidebar.opened" :title="hasTitle(onlyOneChild.meta.title)">{{ onlyOneChild.meta.title }}</span>
        </app-link>
      </div>
    </template>

    <div
      v-else
      class="menu-item"
      :class="{ 'menu-item_active': isActiveRouter(item), 'menu-item-closed': !appStore.sidebar.opened  }"
      @click="clickMenuItem(item)"
      @mouseenter="mouseenterMenuItem(item)"
    >
      <!-- @mouseleave="showMenuChild = false" -->
      <div class="menu-item_icon">
        <svg-icon :icon-class="item.meta ? item.meta.icon : ''" />
      </div>
      <span class="menu-title" v-if="appStore.sidebar.opened" :title="hasTitle(item.meta?.title)">{{ item.meta?.title }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
// import AppLink from './Link.vue'
import useAppStore from '@/store/modules/app';
import { getNormalPath } from '@/utils/ruoyi'
import { isExternal } from '@/utils/validate'
import { RouteOption, useRoute } from "vue-router";

const appStore = useAppStore();

const props = defineProps({
  // route object
  item: {
    type: Object as PropType<RouteOption>,
    required: true
  },
  index: {
    type: Number,
    default: null,
  },
  isNest: {
    type: Boolean,
    default: false
  },
  basePath: {
    type: String,
    default: ''
  }
})
const emits = defineEmits(['click-menu-item', 'enter-menu-item'])

const onlyOneChild = ref<any>({});

const hasOneShowingChild = (parent: RouteOption, children?: RouteOption[]) => {
  if (!children) {
    children = [];
  }
  const showingChildren = children.filter(item => {

    if (item.hidden) {
      return false
    } else {
      // Temp set(will be used if only has one showing child)
      onlyOneChild.value = item
      return true
    }
  })

  // When there is only one child router, the child router is displayed by default
  if (showingChildren.length === 1) {
    return true
  }

  // Show parent if there are no child router to display
  if (showingChildren.length === 0) {
    onlyOneChild.value = { ...parent, path: '', noShowingChildren: true, meta: { ...parent.meta, icon: parent.meta?.icon ? parent.meta.icon : '#' } }
    return true
  }


  return false
};

const resolvePath = (routePath: string, routeQuery?: string): any => {
  if (isExternal(routePath)) {
    return routePath
  }
  if (isExternal(props.basePath)) {
    return props.basePath
  }
  if (routeQuery) {
    let query = JSON.parse(routeQuery);
    return { path: getNormalPath(props.basePath + '/' + routePath), query: query }
  }
  return getNormalPath(props.basePath + '/' + routePath)
}

const hasTitle = (title: string | undefined): string => {
  if (!title || title.length <= 5) {
    return "";
  }
  return title;
}

const isActiveRouter = (item: any) => {
  const route = useRoute()
  const { path } = item
  if (path === route.path) {
    return true
  }
  return false
}

const clickMenuItem = (item: RouteOption) => {
  emits('click-menu-item', item)
}

const mouseenterMenuItem = (item: RouteOption) => {
  emits('enter-menu-item',item, props.index)
}
</script>

<style scoped lang="scss">
@import '@/assets/styles/variables.module';

.menu-item {
  text-align: center;
  padding: 8px;
  border-radius: 8px;
  background: #FFFFFF;
  color: #89919F;
  cursor: pointer;
  // box-shadow: 0px 4px 8px 0px rgba(40, 121, 255, 0.2);

  &:hover {
    background: #F1F5FB;

    .menu-title {
      color: $--color-primary;
    }

    .svg-icon {
      color: $--color-primary;
    }
  }

  .menu-item_icon {
    width: 36px;
    height: 36px;
    border-radius: 100%;
    margin: 0 auto;
    box-shadow: 0px 0px 16px 0px rgba(128, 146, 181, 0.1);
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;

    .svg-icon {
      color: #B1DAFC;
    }
  }
}

.menu-item-closed {
  .menu-item_icon {
    padding: 8px;
    border-radius: 50%;
    box-shadow: 0px 4px 8px 0px rgba(40, 121, 255, 0.2);
  }
}


.menu-title {
  margin-top: 6px;
}

.menu-item_active {
  background: #F1F5FB;

  .svg-icon {
    color: $--color-primary;
  }

  .menu-title {
    color: $--color-primary;
  }
}
</style>
