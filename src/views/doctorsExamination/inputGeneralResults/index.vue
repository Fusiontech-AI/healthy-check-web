<template>
  <div class="bg-#fff content">
    <Grid ref="gridRef" :cols="13">
      <GridItem :span="2">
        <div class="border-r ">
          <div class="p-10px">
            <el-date-picker start-placeholder="开始日期" end-placeholder="结束日期" type="daterange"
              style="width: 100%;"></el-date-picker>
            <el-input class="mt-8px" placeholder="请输入体检号"></el-input>
            <el-collapse-transition>
              <div v-if="showInput">
                <el-input class="mt-8px" placeholder="请输入姓名"></el-input>
              </div>
            </el-collapse-transition>
            <div class="mt-8px">
              <el-button type="primary" round size="small">搜索</el-button>
              <el-button round size="small">重置</el-button>
              <el-button link class="mr-2" @click="showInput = !showInput"
                :icon="showInput ? ArrowUpBold : ArrowDownBold" />
            </div>
            <div class="divider"></div>
            <div class="tabs">
              <span :class="activeName == '1' ? 'active' : ''" @click="activeName = '1'">分检</span>
              <span :class="activeName == '2' ? 'active' : ''" @click="activeName = '2'">分检完成</span>
            </div>
          </div>
          <el-scrollbar class="left_list" height="calc(100vh - 292px)">
            <el-card v-for="item in 20" :key="item" shadow="hover" class="list_item">
              <div class="flex justify-between mb-4px">
                <div><span> 张三 </span><span> 21 </span><span> 身份证 </span><span> 出诊 </span></div>
                <el-button link size="small" @click="showCard = showCard && showCard == item ? null : item"
                  :icon="showCard == item ? ArrowUpBold : ArrowDownBold"></el-button>
              </div>
              <div class="flex justify-between">
                <span>015475</span>
                <span>2024-01-12</span>
              </div>
              <el-collapse-transition>
                <div v-if="showCard && showCard == item" class="mt-6px bg-slate-200 rounded-6px p-4px text-12px">
                  <div>体检日期：2023-09-09</div>
                  <div>单 位：枝江工行</div>
                  <div>电 话：1889920202023</div>
                  <div>体检类型：职业健康体检</div>
                  <div>身份证号：4383939393993933</div>
                  <div>档 案 号：TJ20289393933</div>
                  <div>人员类别：VIP</div>
                  <div>体检次数：1次</div>
                </div>
              </el-collapse-transition>
            </el-card>
          </el-scrollbar>
        </div>
      </GridItem>
      <GridItem :span="8">
        <div class="p-10px relative"
          style="height: calc(100vh - 112px); border-left: 1px solid #E8E8E8; border-right: 1px solid #E8E8E8;">
          <div class="px-20px">
            张三三 男 25岁 共30项 / 已检15项
          </div>
          <div class="mt-8px">
            <el-tabs v-model="activetab" type="card">
              <el-tab-pane label="物理体检" name="1"></el-tab-pane>
              <el-tab-pane label="内科" name="2"></el-tab-pane>
              <el-tab-pane label="外科" name="3"></el-tab-pane>
              <el-tab-pane label="血常规" name="4"></el-tab-pane>
              <el-tab-pane label="幽门螺旋杆菌HP抗体" name="5"></el-tab-pane>
              <el-tab-pane label="尿常规" name="6"></el-tab-pane>
              <el-tab-pane label="胸部正位DR" name="7"></el-tab-pane>
              <el-tab-pane label="腹部彩超（肝胆胰脾双肾）" name="8"></el-tab-pane>
            </el-tabs>
          </div>
          <div class="flex justify-between">
            <div>
              <el-button size="small" type="primary">保存</el-button>
              <el-button size="small">清除</el-button>
              <el-button size="small">弃检</el-button>
              <el-button size="small">使用上次体检结果</el-button>
              <el-button size="small">快速录入</el-button>
            </div>
            <el-button link>查看图片>></el-button>
          </div>
          <div class="no-card mt-16px">
            <ProTable :columns="columns" :data="[{ name: '1' }]" :tool-button="false" :pagination="false"></ProTable>
          </div>
          <div class="absolute bottom-0 ">
            <span class="mr-18px">检查医生：xxx</span>
            <span>检查日期：2023-03-09 13:34:34</span>
          </div>
        </div>
      </GridItem>
      <GridItem :span="3">
        <div class="h-full">
          <div>
            <el-tabs type="card">
              <el-tab-pane label="体检小结" name="1"></el-tab-pane>
              <el-tab-pane label="其他科室小结" name="2"></el-tab-pane>
              <el-tab-pane label="历史本科小结" name="3"></el-tab-pane>
            </el-tabs>
            <div class="no-card">
              <ProTable :columns="columns1" :data="[{ name: '1' }, { name: '1' }, { name: '1' },]" :tool-button="false"
                :pagination="false" :header-cell-style="{ 'font-size': '12px' }" :cell-style="{ 'font-size': '12px' }"
                height="calc((100vh - 220px) / 2)"></ProTable>
            </div>
          </div>
          <el-tabs type="card">
            <el-tab-pane label="阳性结果发现" name="1"></el-tab-pane>
            <el-tab-pane label="医学科普" name="2"></el-tab-pane>
          </el-tabs>
          <div class="no-card">
            <ProTable :columns="columns2"
              :data="[{ name: '1' }, { name: '1' }, { name: '1' }, { name: '1' }, { name: '1' }, { name: '1' }, { name: '1' }, { name: '1' }, { name: '1' }]"
              :tool-button="false" :pagination="false" :header-cell-style="{ 'font-size': '12px' }"
              height="calc((100vh - 230px) / 2)"></ProTable>
          </div>
        </div>
      </GridItem>
    </Grid>
  </div>
</template>

<script setup lang="ts">
import { ArrowUpBold, ArrowDownBold } from "@element-plus/icons-vue";
import { ref } from "vue";
const showInput = ref(false)
const showCard = ref()
const activeName = ref('1')
const activetab = ref('1')
const columns = ref<any>([
  { type: 'selection' },
  { label: '序号', type: 'index', width: 60 },
  { label: '项目名称', prop: 'name' },
  { label: '明细结果', prop: 'name' },
  { label: '单位', prop: 'name' },
  { label: '参考值', prop: 'name' },
  { label: '提示', prop: 'name' },
  { label: '异常', prop: 'name' },
])
const columns1 = ref<any>([
  { type: 'selection' },
  { label: '项目名称', prop: 'name' },
  { label: '项目小结', prop: 'name' },
  { label: '单位', prop: 'name' },
  { label: '参考范围', prop: 'name' },
])
const columns2 = ref<any>([
  { type: 'selection' },
  { label: '建议名称', prop: 'name' },
  { label: '诊断建议', prop: 'name' },
])
</script>

<style scoped lang="scss">
.content {
  height: calc(100vh - 105px);
}

.left_list {
  padding: 0 10px;

  .list_item {
    background: #fff;
    margin-bottom: 8px;
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
</style>