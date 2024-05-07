<template>
  <div class="p-10px ">
    <div class="card_title  ">
      {{ registerInfo.name }}
      {{ sys_user_sex?.find((val: any) => val.dictValue == registerInfo.gender)?.label }}
      {{ registerInfo.age }}岁 共
      <span class="text-red-500"> {{ combinProjectList.length }} </span>
      项 / 已检 <span class="text-red-500">{{ combinProjectList.filter((item: any) => item.checkStatus ==
        '1')?.length }}</span> 项
    </div>
    <el-divider class="el-divider" />
    <Grid ref="gridRef" :cols="4">
      <GridItem :span="2" style="border-right: 1px solid #E8E8E8;">
        111
      </GridItem>
      <GridItem :span="2">
        222
      </GridItem>
    </Grid>
  </div>
</template>

<script setup lang="tsx">
const registerInfo = inject<any>('registerInfo', reactive({}))
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { sys_user_sex } = toRefs<any>(proxy?.useDict('sys_user_sex', 'bus_check_result'))
const combinProjectList = ref<any>([]) // 组合项目
</script>

<style scoped lang="scss">
.card_title {
  display: flex;
  align-items: center;
  font-weight: 700;

  &::before {
    content: '';
    width: 4px;
    height: 16px;
    margin-right: 4px;
    border-radius: 2px;
    font-weight: bold;
    background: #FF8F33;
  }
}

.el-divider {
  margin: 15px;
  margin-left: 0px;
  margin-bottom: 0;
}
</style>
