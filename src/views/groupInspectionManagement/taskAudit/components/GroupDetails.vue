<template>
  <div>
    <el-tabs class="demo-tabs" v-model="activeValue">
      <el-tab-pane label="分组信息" name="1" />
      <el-tab-pane label="人员明细" name="2" />
    </el-tabs>
    <div class="h-[400px]">
      <Grid v-show="activeValue == '1'" ref="gridRef" :gap="20" :cols="2">
        <GridItem :span="1" v-for="item in groupInfo" :key="item.label">
          <div class="flex text-[14px] text-[#141C28]">
            <span class="w-[120px] text-[#89919F]">{{ item.label }}</span>
            <span class="flex-1">{{ item.value }}</span>
          </div>
        </GridItem>
      </Grid>
      <div v-show="activeValue == '2'">
        <ProTable :columns="groupPersonColumns" :toolButton="false" :data="[{ name: 'aaaaaakaskhaskhahadhsa,d' }]">
        </ProTable>
      </div>
    </div>
  </div>
</template>

<script setup lang="tsx">
import { groupPersonColumn } from '../rowColumns'
const activeValue = ref('1')
const groupInfo = ref<any>([
  {
    label: '分组名称：',
    value: '18100000000'
  },
  {
    label: '性别：',
    value: '18100000000'
  },
  {
    label: '婚否：',
    value: '18100000000'
  },
  {
    label: '在岗类型：',
    value: '健康体检健康体检健康体检健康体检健康体检健康体检健康体检健康体检健康体检健康体检健康体检健康体检健康体检'
  },
  {
    label: '分组类型：',
    value: '哈哈'
  },
  {
    label: '年龄范围：',
    value: '哈哈'
  },
  {
    label: '总人数：',
    value: '哈哈'
  },
  {
    label: '预约人数：',
    value: '哈哈'
  },
  {
    label: '报到人数：',
    value: '138'
  },
  {
    label: '金额（元）：',
    value: '599'
  },
  {
    label: '分组支付方式：',
    value: '单位支付'
  },
  {
    label: '分组折扣',
    value: '90'
  },
  {
    label: '加项支付方式：',
    value: '个人支付'
  },
  {
    label: '加项折扣：',
    value: '80'
  },
])
const groupPersonColumns = ref<any>(groupPersonColumn) // 人员明细配置项
</script>

<style scoped></style>
