<template>
  <div :class="{'item-wrapper':true,'item-active':activeKey === item.id}" @click="handleClickItem(item)" :key="item.id">
    <div class="flex items-center justify-between text-[14px] leading-5">
      <span>{{ item.taskName }}</span>

      <div class="group-type">
        <span :class="item.physicalType">{{ typeName(item.physicalType) }}</span>
      </div>
    </div>

    <div class="text-[12px] mb-2 leading-5">{{ item.teamName }}</div>

    <div class="text-[12px] flex items-center justify-between">
      <span>{{ item.signDate }}</span>
      <span :style="{ color: reviewResultColor[item.reviewResult] }">
        {{ ReviewResult[item.reviewResult] }}
      </span>
    </div>
  </div>
  <el-divider style="margin: 0;" />
</template>

<script setup lang="ts">
import variables from '@/assets/styles/variables.module.scss'

const ReviewResultEnum = {
  Passed: 1,
  NotPass: 2,
}

const ReviewResult = {
  [ReviewResultEnum.Passed]: '通过',
  [ReviewResultEnum.NotPass]: '驳回'
};

const reviewResultColor = {
  [ReviewResultEnum.Passed]: variables.successColor,
  [ReviewResultEnum.NotPass]: variables.dangerColor,
}

const emits = defineEmits(['click-item'])

 const props = defineProps({
  item: {
    type: Object as PropType<any>,
    default() {
      return {};
    },
  },
  activeKey: {
    type: Number,
    default: null,
  },
  bus_physical_type: {
    type: Array as PropType<any[]>,
    default() {
      return [];
    },
  },
})

function handleClickItem(item: any) {
  emits('click-item', item)
}

const typeName = (physicalType: string) => {
  return props.bus_physical_type.find(i => i.dictValue === physicalType)?.dictLabel?.slice(0, 1)
}
</script>

<style scoped lang="scss">
.item-wrapper {
  cursor: pointer;
  padding: 10px;
  border-radius: 4px;
  background: #fff;

  .box {
    margin-bottom: 10px;
    display: grid;
    grid-template-columns: 80px 1fr;
  }

  .group-type {
    display: flex;

    span {
      width: 20px;
      height: 20px;
      border-radius: 2px;
      display: flex;
      align-items: center;
      margin-right: 4px;
      justify-content: center;
      font-weight: bold;
      font-size: 14px;

      &:last-child {
        margin-right: 0;
      }
    }

    .ZYJKTJ {
      color: #fff;
      background: #FFA81C;
    }

    .JKTJ {
      color: #fff;
      background: #18d5ee;
    }

    .FSTJ,
    .LNRTJ,
    .RZTJ,
    .XSTJ {
      color: #fff;
      background: #2175FF;
    }
  }
}

.item-active {
  background: #F1F5FB;
}
</style>
