<template>
  <div>
    <el-row :gutter="8">
      <el-col :span="5">
        <el-card>
          <el-date-picker v-model="dateValue" type="daterange" start-placeholder="开始时间" end-placeholder="结束时间" style="width: 100%;" />
          <el-input class="mt-2" placeholder="请输入关键字"></el-input>
          <el-radio-group v-model="activeName" class="my-2">
            <el-radio-button label="1" class="w-[50%]">待审批</el-radio-button>
            <el-radio-button label="2">已审批</el-radio-button>
          </el-radio-group>
          <div class="h-screen h-svh overflow-auto">
            <div v-for="item in 20" :key="item" class="h-[80px] w-full bg-red p-2 flex flex-col justify-between mb-2">
              <div class="flex justify-between items-center"><span>2023-06-13</span><span>健</span></div>
              <div class="flex justify-between items-center"><span>宜宾市翠屏区金秋湖镇人民政府</span><span>待审</span></div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="19">
        <el-card>
          <div class="flex justify-end">
            <el-button>委托协议预览</el-button>
            <el-button>任务审核</el-button>
          </div>
          <div>
            <div class="font-bold mb-2"><span></span>任务基础信息</div>
            <el-descriptions :column="3">
              <el-descriptions-item label="任务名称：">1111111111111111111</el-descriptions-item>
              <el-descriptions-item label="任务编号：">18100000000</el-descriptions-item>
              <el-descriptions-item label="单位名称：">Suzhou</el-descriptions-item>
              <el-descriptions-item label="体检类型：">健康体检 </el-descriptions-item>
              <el-descriptions-item label="联系人姓名：">哈哈</el-descriptions-item>
              <el-descriptions-item label="体检人联系电话：">哈哈</el-descriptions-item>
              <el-descriptions-item label="销售负责人：">哈哈</el-descriptions-item>
              <el-descriptions-item label="编制人：">哈哈</el-descriptions-item>
              <el-descriptions-item label="审核状态：">哈哈</el-descriptions-item>
            </el-descriptions>
          </div>
          <div>
            <div class="font-bold mb-2"><span></span>任务分组</div>
            <ProTable :columns="taskGroupingColumns" :toolButton="false" :data="[{name: 'aaaaaakaskhaskhahadhsa,d'}]">
              <template #operation="scope">
                <el-button type="primary" link>查看</el-button>
              </template>
            </ProTable>
          </div>
          <div>
            <div class="font-bold mb-2"><span></span>人员列表</div>
            <ProTable :columns="personnelListColumns" :toolButton="false" :data="[{name: 11}]" >
              <template #operation="scope">
                <el-button type="primary" link>查看</el-button>
              </template>
            </ProTable>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="tsx">
import ProTable from "@/components/ProTable/index.vue";

const dateValue = ref('')
const activeName = ref('1')
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

<style scoped></style>
