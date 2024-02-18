<template>
  <div class="header-top_wrapper">
    <div>
      <a key="collapse" class="header-logo-link" href="/">
        <img v-if="websiteConfig.logo" :src="websiteConfig.logo" class="header-logo" />
        <h1 class="header-top-title" :style="{ color: sideTheme === 'theme-dark' ? variables.logoTitleColor : variables.logoLightTitleColor }">
          {{ websiteConfig.title }}
        </h1>
      </a>
    </div>

    <div class="flex gap-6 items-center">
      <template v-if="appStore.device !== 'mobile'">
        <!-- 搜索 -->
        <search-menu ref="searchMenuRef" />
        <el-tooltip content="搜索" effect="dark" placement="bottom">
          <div class="right-menu-item hover-effect" @click="openSearchMenu">
            <svg-icon class-name="search-icon" icon-class="search" class="text-white opacity-55" />
          </div>
        </el-tooltip>

        <!-- 消息 -->
        <el-tooltip :content="$t('navbar.message')" effect="dark" placement="bottom">
          <div>
            <el-popover placement="bottom" trigger="click" transition="el-zoom-in-top" :width="300" :persistent="false">
              <template #reference>
                <el-badge :value="newNotice > 0 ? newNotice : ''" :max="99">
                  <svg-icon icon-class="notifications" />
                </el-badge>
              </template>
              <template #default>
                <notice></notice>
              </template>
            </el-popover>
          </div>
        </el-tooltip>
      </template>

      <div class="avatar-container">
        <el-dropdown @command="handleCommand" class="right-menu-item hover-effect" trigger="click">
          <!-- <div class="avatar-wrapper">
            <img :src="userStore.avatar" class="user-avatar" />
            <el-icon><caret-bottom /></el-icon>
          </div> -->

          <div class="flex gap-2 items-center">
            <div class="w-9 h-9 flex items-center justify-center rounded-full bg-white">
              <el-avatar :size="30" :src="userStore.avatar" />
            </div>
            <span class="avatar-nickname">{{ userStore.nickname }}</span>
            <svg-icon icon-class="arrow" />
          </div>

          <template #dropdown>
            <el-dropdown-menu>
              <router-link to="/user/profile" v-if="!dynamic">
                <el-dropdown-item>{{ $t('navbar.personalCenter') }}</el-dropdown-item>
              </router-link>
              <el-dropdown-item command="setLayout" v-if="settingsStore.showSettings">
                <span>{{ $t('navbar.layoutSetting') }}</span>
              </el-dropdown-item>
              <el-dropdown-item divided command="logout">
                <span>{{ $t('navbar.logout') }}</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import notice from '../notice/index.vue';
import useAppStore from '@/store/modules/app';
import SearchMenu from '../TopBar/search.vue';
import useUserStore from '@/store/modules/user';
import {websiteConfig} from '@/config/websiteConfig';
import useSettingsStore from '@/store/modules/settings'
import useNoticeStore from '@/store/modules/notice';
import variables from '@/assets/styles/variables.module.scss'

const appStore = useAppStore();
const userStore = useUserStore();
const noticeStore = storeToRefs(useNoticeStore());
const settingsStore = useSettingsStore();
const sideTheme = computed(() => settingsStore.sideTheme);
const newNotice = ref<number>(0);
// 是否切换了租户
const dynamic = ref(false);

// 搜索菜单
const searchMenuRef = ref<InstanceType<typeof SearchMenu>>();

const openSearchMenu = () => {
  searchMenuRef.value?.openSearch();
}

const logout = async () => {
    await ElMessageBox.confirm('确定注销并退出系统吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await userStore.logout()
    location.href = import.meta.env.VITE_APP_CONTEXT_PATH + 'index';
}

const emits = defineEmits(['setLayout'])
const setLayout = () => {
    emits('setLayout');
}

// 定义Command方法对象 通过key直接调用方法
const commandMap: {[key: string]: any} = {
    setLayout,
    logout
};

const handleCommand = (command: string) => {
    // 判断是否存在该方法
    if (commandMap[command]) {
        commandMap[command]();
    }
}

//用深度监听 消息
watch(() => noticeStore.state.value.notices, (newVal, oldVal) => {
  newNotice.value = newVal.filter((item: any) => !item.read).length;
}, { deep: true });
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.module';

.header-top_wrapper {
  height: $base-header-height;
  display:flex;
  padding:4px 10px;
  align-items: center;
  justify-content: space-between;
  background-color: #2879FF;
}

.header-logo-link {
  display: flex;
  gap: 8px;
  align-items: center;
}
.header-top-title {
  font-size: 16px;
  line-height: 20px;
}

.avatar-nickname {
  color: #fff;
  // color: var(--defaultTextColor);
}
</style>
