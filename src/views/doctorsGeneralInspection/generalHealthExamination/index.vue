<template>
  <div class="bg-#fff content">
    <Grid ref="gridRef" :cols="11">
      <GridItem :span="2">
        <ItemList :activeRegisterInfo="activeRegisterInfo" />
      </GridItem>
      <GridItem :span="9">
        <ReviewItem />
      </GridItem>
    </Grid>
  </div>
</template>

<script setup lang="ts">

import ItemList from '@/views/doctorsGeneralInspection/component/itemList.vue';
import ReviewItem from '@/views/doctorsGeneralInspection/component/reviewItem.vue';

const activeRegisterInfo = reactive<any>({
  activeRegisterInfo: {} // 当前选中的人员信息
})
const activeRegister = ref({})
provide('registerInfo', activeRegister);

watch(activeRegisterInfo, (newV) => {
  activeRegister.value = newV.activeRegisterInfo
})
</script>

<style scoped lang="scss">
.content {
  height: calc(100vh - 105px);
}
</style>
