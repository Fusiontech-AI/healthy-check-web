<template>
  <div>
    <el-row>
      <el-col :span="5">
        <el-card>
          <el-date-picker v-model="dateValue" type="daterange" start-placeholder="开始时间" end-placeholder="结束时间" style="width: 100%;" />
          <el-input class="mt-2" placeholder="请输入关键字"></el-input>
          <div class="tabs">
            <span :class="activeName == '1' ? 'active':''" @click="activeName = '1'">待审批</span>
            <span :class="activeName == '2' ? 'active':''" @click="activeName = '2'">已审批</span>
          </div>
          <div class="left_list">
            <el-card shadow="hover" v-for="item in 20" :key="item" class="list_card" :class="isActive == item ?'active':''">
              <div class="flex items-center">
                <el-checkbox v-model="checked" size="large" />
                <span class="ml-2 text-[#141C28]">2023-06-13</span>
                <span class="ml-auto px-[3px] rounded-[2px] font-bold text-[#fff] bg-[#FFA81C]">职</span>
              </div>
              <div class="flex justify-between items-center text-[12px] mt-[8px]">
                <span class="text-[#89919F] flex-1">宜宾市翠屏区金秋湖镇人民政府1111111宾市翠屏区金秋湖镇人民宾市翠屏区金秋湖镇人民</span>
                <span class="text-[#FF8400] ml-1">待审</span>
              </div>
            </el-card>
          </div>
        </el-card>
      </el-col>
      <el-col :span="19">
        <el-card class="content">
          <div class="flex justify-end">
            <el-button>委托协议预览</el-button>
            <el-button type="primary" @click="showDialog = true">任务审核</el-button>
          </div>
          <div class="divider"></div>
          <div>
            <div class="my-2 flex justify-between items-center">
              <div class="card_title"><span></span>任务基础信息</div>
              <el-button link class="mr-2" @click="basicTaskInforShow = !basicTaskInforShow" :icon="basicTaskInforShow?ArrowUpBold:ArrowDownBold" />
            </div>
            <el-collapse-transition>
              <Grid ref="gridRef" v-show="basicTaskInforShow" :gap="20" :cols="2">
                <GridItem :span="1" v-for="item in basicInforList" :key="item.label">
                  <div class="flex text-[14px] text-[#141C28]">
                    <span class="w-[120px] text-[#89919F] ml-[30px]">{{ item.label }}</span>
                    <span class="flex-1">{{item.value}}</span>
                  </div>
                </GridItem>
              </Grid>
            </el-collapse-transition>
          </div>
          <div class="divider"></div>
          <div>
            <div class="my-2 flex justify-between items-center">
              <div class="card_title"><span></span>任务分组</div>
              <el-button link class="mr-2" @click="taskGroupShow = !taskGroupShow" :icon="taskGroupShow?ArrowUpBold:ArrowDownBold" />
            </div>
            <el-collapse-transition>
              <div v-show="taskGroupShow" class="no-card">
                <ProTable :columns="taskGroupingColumns" :toolButton="false" :data="[{name: 'aaaaaakaskhaskhahadhsa,d'}]">
                  <template #operation="scope">
                    <el-button type="primary" link>查看</el-button>
                  </template>
                </ProTable>
              </div>
            </el-collapse-transition>
          </div>
          <div class="divider"></div>
          <div>
            <div class="my-2 flex justify-between items-center">
              <div class="card_title"><span></span>人员列表</div>
              <el-button link class="mr-2" @click="personListShow = !personListShow" :icon="personListShow?ArrowUpBold:ArrowDownBold" />
            </div>
            <el-collapse-transition>
              <div v-show="personListShow" class="no-card">
                <ProTable :columns="personnelListColumns" :toolButton="false" :data="[{name: 11}]">
                  <template #operation="scope">
                    <el-button type="primary" link>查看</el-button>
                  </template>
                </ProTable>
              </div>
            </el-collapse-transition>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-drawer v-model="showDialog" title="任务审核" size="50%">
      <audit-dialog @closeDialog="showDialog = false"></audit-dialog>
    </el-drawer>
  </div>
</template>

<script setup lang="tsx">
import {ArrowUpBold, ArrowDownBold } from "@element-plus/icons-vue";
import AuditDialog from './components/AuditDialog.vue'
import Grid from "@/components/Grid/index.vue";
import GridItem from "@/components/Grid/components/GridItem.vue";

const dateValue = ref('')
const activeName = ref('1')
const checked = ref()
const isActive = ref(1)
const showDialog = ref(false)
const basicTaskInforShow = ref(true) // 基础任务信息折叠展示
const taskGroupShow = ref(true) // 任务分组折叠展示
const personListShow = ref(true) // 人员列表折叠展示
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
// 任务分组Columns
const taskGroupingColumns = ref<any>([
  { prop: 'name', label: "分组名称",width: 120, fixed: 'left'},
  { prop: 'name', label: "性别", },
  { prop: 'name', label: "婚否", },
  { prop: 'name', label: "在岗类型", width: 120},
  { prop: 'name', label: "分组类型", width: 120},
  { prop: 'name', label: "最大年龄", },
  { prop: 'name', label: "最小年龄", },
  { prop: 'name', label: "总人数", },
  { prop: 'name', label: "预约人数", },
  { prop: 'name', label: "报到人数", },
  { prop: 'name', label: "金额（元）", },
  { prop: 'name', label: "分组支付方式", },
  { prop: 'name', label: "分组折扣", },
  { prop: 'name', label: "加项支付方式", },
  { prop: 'name', label: "加项折扣", },
  { prop: 'operation', label: "操作", width: 80, fixed: "right" },
])
// 人员列表Columns
const personnelListColumns = ref<any>([
  { prop: 'name', label: "档案号",width: 120, fixed: 'left'},
  { prop: 'name', label: "体检号", fixed: 'left'},
  { prop: 'name', label: "身份证号",width: 180, fixed: 'left'},
  { prop: 'name', label: "姓名", width: 120, fixed: 'left'},
  { prop: 'name', label: "性别", width: 120},
  { prop: 'name', label: "婚否", },
  { prop: 'name', label: "年龄", },
  { prop: 'name', label: "电话", },
  { prop: 'name', label: "分组名称", },
  { prop: 'name', label: "预约日期", },
  { prop: 'name', label: "是否总检", },
  { prop: 'name', label: "体检状态", },
  { prop: 'name', label: "部门", },
  { prop: 'name', label: "开票部门", },
  { prop: 'name', label: "其他", },
  { prop: 'name', label: "职务", },
  { prop: 'name', label: "体检类别", },
  { prop: 'name', label: "人员类别", },
  { prop: 'operation', label: "操作", width: 80, fixed: "right" },
])
</script>

<style scoped lang="scss">
.el-card {
  // border-radius: 0px;
  &.is-always-shadow {
    box-shadow: none
  }
}
.tabs {
  display: flex;
  margin: 10px 0;
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
.left_list {
  height: calc(100vh - 232px);
  overflow: auto;
  .list_card {
    width: 100%;
    padding: 10px;
    margin-bottom: 8px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border-style: solid;
    border-color: #E6EAEF;
    border-radius: 4px;
    border-width: 0px 0px 1px 0px;
    font-size: 14px;
    cursor: pointer;
    &:hover {
      border-color: #F1F5FB;
      background: #F1F5FB;
    }
    &.active {
      border-color: #F1F5FB;
      background: #F1F5FB;
    }
    .el-checkbox.el-checkbox--large {
      height: auto;
    }
  }
}
.content {
  height: calc(100vh - 90px);
  overflow: auto;
  font-size: 14px;
  .card_title {
    display: flex;
    align-items: center;
    span {
      width: 4px;
      height: 16px;
      margin-right: 4px;
      border-radius: 2px;
      font-weight: bold;
      background: #FF8F33;
    }
  }
}
.divider {
  width: 100%;
  height: 1px;
  margin: 8px 0;
  background: #E8E8E8;
}
</style>
