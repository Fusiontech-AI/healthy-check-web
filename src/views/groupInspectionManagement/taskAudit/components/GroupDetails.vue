<template>
  <div>
    <el-tabs class="demo-tabs" v-model="activeValue">
      <el-tab-pane label="分组信息" name="1" />
      <el-tab-pane label="人员明细" name="2" />
    </el-tabs>
    <div class="h-[400px]">
      <div v-show="activeValue == '1'" >
        <Grid ref="gridRef" :gap="20" :cols="2">
          <template v-for="item in taskGroupingColumns" :key="item.label">
            <div v-if="item.prop !== 'startAge' && item.prop !== 'operation'">
              <GridItem :span="1">
                <div v-if="item.prop == 'endAge'" class="flex text-[14px] text-[#141C28]">
                  <span class="w-[120px] text-[#89919F]">年龄范围</span>
                  <span class="flex-1">
                    {{ grounDetailItem?.startAge || '' }}~{{ grounDetailItem?.endAge || '' }}
                  </span>
                </div>
                <div v-else class="flex text-[14px] text-[#141C28]">
                  <span class="w-[120px] text-[#89919F]">{{ item.label }}</span>
                  <span v-if="!item.enum" class="flex-1">{{ grounDetailItem[item.prop] }}</span>
                  <span class="flex-1" v-else>
                    {{ item.enum.find((val: any) => val.value == grounDetailItem?.[item.prop])?.label }}
                  </span>
                </div>
              </GridItem>
            </div>
          </template>
        </Grid>
      </div>
      <div v-show="activeValue == '2'" class="no-card">
        <ProTable :columns="groupPersonColumns" :toolButton="false" :data="[{ name: 'aaaaaakaskhaskhahadhsa,d' }]">
        </ProTable>
      </div>
    </div>
  </div>
</template>

<script setup lang="tsx">
import { taskGroupingColumn, groupPersonColumn } from '../rowColumns'
const props = defineProps<{
  grounDetailItem: any
}>()
const taskGroupingColumns = ref<any>(taskGroupingColumn) // 任务分组Columns
const groupPersonColumns = ref<any>(groupPersonColumn) // 人员明细配置项
const activeValue = ref('1')

watch(()=>props.grounDetailItem, ()=> {
  activeValue.value = '1'
})
</script>

<style scoped></style>
