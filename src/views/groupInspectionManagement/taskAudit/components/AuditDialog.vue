<template>
  <div class="text-[14px] h-full flex flex-col justify-between">
    <div>
      <div class="font-bold card_title "><span></span>任务基础信息</div>
      <Grid ref="gridRef" :gap="20" :cols="2">
        <GridItem :span="1" v-for="item in basicInforColumn" :key="item.prop">
          <div class="flex text-[14px] text-[#141C28]">
            <span class="w-[120px] text-[#89919F] ml-[30px]">{{ item.label }}</span>

            <span v-if="item.prop === 'reviewResult'" class="flex-1"
            :class="basicInfoData?.[item.prop] == '0' ? 'text-#FF8400' : basicInfoData?.[item.prop] == '1'?'text-#09C268':'text-#F75252'">
              {{ item.enum.find((val: any) => val.value == basicInfoData?.[item.prop])?.label }}
            </span>

            <div v-else>
              <span v-if="!item.enum" class="flex-1">
                {{ basicInfoData?.[item.prop] }}
              </span>
              <span v-else class="flex-1">
                {{ item.enum.find((val: any) => val.value == basicInfoData?.[item.prop])?.label }}
              </span>
            </div>
          </div>
        </GridItem>
      </Grid>
      <div class="font-bold mt-6 card_title"><span></span>审核</div>
      <div class="ml-[30px]">
        <span class="mr-6">审核结论：</span>
        <el-radio-group v-model="auditValue" class="ml-4">
          <el-radio label="1" size="large">通过</el-radio>
          <el-radio label="2" size="large">驳回</el-radio>
        </el-radio-group>
      </div>
    </div>
    <div class="flex justify-end mt-4">
      <el-button @click="hanldeClose">取消</el-button>
      <el-button type="primary" @click="hanldeSubmit">确定</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { basicInforColumns } from '../rowColumns'
import { reviewTask } from '@/api/groupInspection/taskAudit'
const basicInforColumn = ref(basicInforColumns)
const props = defineProps<{
  basicInfoData: any
}>()
const auditValue = ref('1')

const emit = defineEmits<{
  (e: 'closeDialog'): void;
}>()

const hanldeSubmit = async () => {
  try {
    await reviewTask({ id: props.basicInfoData.id, reviewResult: auditValue.value })
    ElMessage.success('审核成功！')
    auditValue.value = '1'
    emit('closeDialog')
  } catch (error) {
  }
}

const hanldeClose = () => {
  auditValue.value = '1'
  emit('closeDialog')
}
</script>

<style scoped lang="scss">
.card_title {
  display: flex;
  align-items: center;
  margin-bottom: 10px;

  span {
    width: 4px;
    height: 16px;
    margin-right: 4px;
    border-radius: 2px;
    font-weight: bold;
    background: #FF8F33;
  }
}
</style>
