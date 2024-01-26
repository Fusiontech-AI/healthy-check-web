<template>
  <div class="text-[14px] h-full flex flex-col justify-between">
    <div>
      <div class="font-bold card_title "><span></span>任务基础信息</div>
      <Grid ref="gridRef" :gap="20" :cols="2">
        <GridItem :span="1" v-for="item in basicInforList" :key="item.label">
          <div class="flex text-[14px] text-[#141C28]">
            <span class="w-[120px] text-[#89919F] ml-[30px]">{{ item.label }}</span>
            <span class="flex-1">{{item.value}}</span>
          </div>
        </GridItem>
      </Grid>
      <div class="font-bold mt-6 card_title"><span></span>审核</div>
      <div class="ml-[30px]">
        审核结论：<el-radio-group v-model="auditValue" class="ml-4">
          <el-radio label="1" size="large">通过</el-radio>
          <el-radio label="2" size="large">不通过</el-radio>
        </el-radio-group>
      </div>
    </div>
    <div class="flex justify-end mt-4">
      <el-button round @click="hanldeClose">取消</el-button>
      <el-button round type="primary" @click="hanldeClose">确定</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
const auditValue = ref('1')
const basicInforList = ref([
  {
    label: '任务名称：',
    value: '18100000000'
  },
  {
    label: '任务编号：',
    value: '18100000000'
  },
  {
    label: '单位名称：',
    value: '18100000000'
  },
  {
    label: '体检类型：',
    value: '健康体检健康体检健康体检健康体检健康体检健康体检健康体检健康体检健康体检健康体检健康体检健康体检健康体检'
  },
  {
    label: '联系人姓名：',
    value: '哈哈'
  },
  {
    label: '体检人联系电话：',
    value: '哈哈'
  },
  {
    label: '销售负责人：',
    value: '哈哈'
  },
  {
    label: '编制人：',
    value: '哈哈'
  },
  {
    label: '审核状态：',
    value: '哈哈'
  },
])
const emit = defineEmits<{
  (e: 'closeDialog'): void;
}>()
const hanldeClose = () => {
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
