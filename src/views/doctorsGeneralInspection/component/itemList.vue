<template>
  <div class="border-r ">
    <div class="p-10px">
      <el-date-picker v-model="registerParams.healthyCheckTime" start-placeholder="开始日期" end-placeholder="结束日期"
        value-format="YYYY-MM-DD" format="YYYY-MM-DD" type="daterange" style="width: 100%;"
        @change="getRegisterList"></el-date-picker>
      <div class="flex mt-8px">
        <el-input @input="updateInput" v-model="registerParams.healthyCheckCode" placeholder="请输入体检号"
          clearable></el-input>
        <el-button link class="ml-1" style="padding: 8px;" @click="showInput = !showInput"
          :icon="showInput ? 'ArrowUpBold' : 'ArrowDownBold'" />
      </div>
      <el-collapse-transition>
        <div v-show="showInput" class="flex mt-8px">
          <el-input placeholder="请输入姓名" v-model="registerParams.name" @input="updateInput"></el-input>
          <el-button class="ml-1" icon="RefreshRight" plain style="padding: 8px;" @click="handleRefresh"></el-button>
        </div>
      </el-collapse-transition>
      <div class="divider"></div>
      <div class="tabs">
        <span :class="registerParams.healthyCheckStatus == '2' ? 'active' : ''"
          @click="registerParams.healthyCheckStatus = '2'; getRegisterList()">分检</span>
        <span :class="registerParams.healthyCheckStatus == '3' ? 'active' : ''"
          @click="registerParams.healthyCheckStatus = '3'; getRegisterList()">分检完成</span>
      </div>
    </div>
    <el-scrollbar class="left_list" :height="showInput ? 'calc(100vh - 298px)' : 'calc(100vh - 258px)'"
      v-loading="registerLoading">
      <template v-if="registerList && registerList.length !== 0">
        <div v-for="item in registerList" :key="item" shadow="hover">
          <div v-show="item.id === props.activeRegisterInfo.activeRegisterInfo.id"
            class="flex justify-between text-sm bg-blue-400 rounded-t-4px text-white font-bold py-1 pl-2 pr-2">
            {{ bus_physical_type?.find((val: any) => val.dictValue == item.physicalType)?.label }}
            <span class="mr-1px px-2px border border-white border-solid rounded">{{ item.businessCategory ==
        '1' ? '个' : '团' }}</span>
          </div>
          <el-card class="list_item" :class="{ 'active': item.id === props.activeRegisterInfo.activeRegisterInfo.id }"
            shadow="hover" @click="props.activeRegisterInfo.activeRegisterInfo = item;">
            <div class="flex justify-between items-center mb-4px">
              <div class="flex items-center flex-wrap">
                <div class="text-base font-medium relative" :class="item.checkType == '21' ? 'mr-4' : ''">
                  {{ item.name }}
                  <span v-if="item.checkType == '21'"
                    class="text-xs font-normal absolute inline-block text-#F75252 border border-orange-500 border-solid px-1px rounded-sm right-[-18px] top-[-4px]">复</span>
                </div>
                <div class="mx-2 px-4px flex items-center rounded-lg"
                  :class="item.gender == '0' ? 'bg-#F0F9FF' : 'bg-#FFF0F1'">
                  <el-icon v-if="item.gender == '0'" color="#159DFF">
                    <Male />
                  </el-icon>
                  <el-icon v-if="item.gender == '1'" color="#FE525D">
                    <Female />
                  </el-icon>
                  <span class="ml-1" :class="item.gender == '0' ? 'text-#159DFF' : 'text-#FE525D'">{{ item.age }}</span>
                </div>
                <el-tooltip effect="dark" :content="item.credentialNumber" placement="top">
                  <SvgIcon icon-class="idCard" class="mr-2"></SvgIcon>
                </el-tooltip>
              </div>
              <el-button link size="small" @click.stop="item.showCard = !item.showCard"
                :icon="item.showCard ? ArrowUpBold : ArrowDownBold"></el-button>
            </div>
            <div class="flex justify-between">
              <span class="text-xs text-#1D2129">{{ item.healthyCheckCode }}</span>
              <span class="text-xs text-#C0C4CC">{{ item.healthyCheckTime }}</span>
            </div>
            <el-collapse-transition>
              <div v-show="item.showCard" class="mt-6px bg-#F1F5FB rounded-6px py-4px px-6px text-sm leading-6">
                <div><span class="text-xs w-60px text-#999999 inline-block">体检日期：</span>{{ item.healthyCheckTime }}
                </div>
                <div><span class="text-xs w-60px text-#999999 inline-block">单 位：</span>{{ item.groupName }}</div>
                <div><span class="text-xs w-60px text-#999999 inline-block">电 话：</span>{{ item.phone }}</div>
                <div>
                  <span class="text-xs w-60px text-#999999 inline-block">体检类型：</span>{{ bus_physical_type?.find((val:
        any) => val.dictValue == item.physicalType)?.label }}
                </div>
                <div><span class="text-xs w-60px text-#999999 inline-block">身份证号：</span>{{ item.credentialNumber }}
                </div>
                <div><span class="text-xs w-60px text-#999999 inline-block">档 案 号：</span>{{ item.recordCode }}</div>
                <div>
                  <span class="text-xs w-60px text-#999999 inline-block">人员类别：</span>{{ bus_person_category?.find((val:
        any) => val.dictValue == item.personCategory)?.labe }}
                </div>
                <div><span class="text-xs w-60px text-#999999 inline-block">体检次数：</span>{{ item.peTimes }}</div>
              </div>
            </el-collapse-transition>
          </el-card>
        </div>
      </template>
      <el-empty v-else description="无数据" />
    </el-scrollbar>
  </div>

</template>

<script setup lang="ts">
import _ from 'lodash'
import { getRegisterPage } from "@/api/deskRegistration/deregistration";
import { ArrowUpBold, ArrowDownBold } from "@element-plus/icons-vue";
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { bus_physical_type, bus_person_category } = toRefs<any>(proxy?.useDict('bus_physical_type'))
const showInput = ref(false)

const registerParams = ref<any>({
  healthyCheckTime: [],
  healthyCheckCode: '',
  name: '',
  // 0：预约，1：登记，2：科室分检，3：分检完成，4：待总检，5：已终检
  healthyCheckStatus: ''
})
const registerList = ref<any>([])
const registerLoading = ref<boolean>(false)
const props = defineProps({
  activeRegisterInfo: {
    type: Object,
    default: () => { },
  },
})

// 重置刷新
const handleRefresh = () => {
  registerParams.value = {
    healthyCheckTime: [],
    healthyCheckCode: '',
    name: '',
    // 0：预约，1：登记，2：科室分检，3：分检完成，4：待总检，5：已终检
    healthyCheckStatus: ''
  }
  getRegisterList()
}
// 左侧体检人登记列表
const getRegisterList = async () => {
  try {
    registerLoading.value = true
    const { healthyCheckTime, ...p } = registerParams.value
    const params = {
      status: 0,
      pagesize: -1,
      healthyCheckTimeStart: healthyCheckTime?.[0],
      healthyCheckTimeEnd: healthyCheckTime?.[1],
      ...p
    }
    const { rows } = await getRegisterPage(params)
    if (_.isEmpty(props.activeRegisterInfo.activeRegisterInfo)) props.activeRegisterInfo.activeRegisterInfo = rows?.[0] || {}
    registerLoading.value = false
    registerList.value = _.cloneDeep(rows)
  } catch (error) {
    registerLoading.value = false
  }
}
getRegisterList()
const updateInput = _.debounce(getRegisterList, 200) // 防抖
</script>

<style scoped lang="scss">
.content {
  height: calc(100vh - 105px);
}

.left_list {
  padding: 0 10px;

  .list_item {
    cursor: pointer;
    background: #fff;
    margin-bottom: 8px;
    border-radius: 0px 0px 4px 4px;
    border: 1px solid transparent;
    border-bottom: 1px solid #E6EAEF;
    font-size: 14px;
    box-sizing: border-box;
    transition: all .3s;

    &.el-card.is-hover-shadow:focus,
    &.el-card.is-hover-shadow:hover {
      box-shadow: 0px 2px 6px 0px rgba(155, 171, 203, 0.34) !important;
    }

    &:hover {
      border-left: 1px solid #F1F5FB;
      border-right: 1px solid #F1F5FB;
    }

    &.active {
      border-left: 1px solid #F1F5FB;
      border-right: 1px solid #F1F5FB;
      box-shadow: 0px 2px 6px 0px rgba(155, 171, 203, 0.34) !important;
    }
  }
}

.tabs {
  display: flex;
  margin-top: 10px;
  font-size: 14px;
  color: #3F4755;

  span {
    padding: 4px 10px;
    margin-right: 10px;
    border-radius: 93px;
    cursor: pointer;

    &:hover {
      background: #F1F5FB;
    }

    &.active {
      background: #F1F5FB;
      color: #2879FF;
    }
  }
}

:deep(.el-tabs--card>.el-tabs__header .el-tabs__item.is-active) {
  background: #F1F5FB;
}

:deep(.el-tabs__header) {
  margin-bottom: 10px;
}
</style>
