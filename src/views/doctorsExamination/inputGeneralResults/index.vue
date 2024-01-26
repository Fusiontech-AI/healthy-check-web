<template>
  <div class="bg-#fff content">
    <Grid ref="gridRef" :cols="5">
      <GridItem :span="1">
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
          <el-scrollbar class="left_list" height="calc(100vh - 282px)">
            <el-card v-for="item in 20" :key="item" shadow="hover" class="list_item">
              <div class="flex justify-between mb-4px">
                <div><span>张三</span><span>21</span><span>身份证</span><span>出诊</span></div>
                <el-button link size="small" @click="showCard = !showCard"
                  :icon="showCard ? ArrowUpBold : ArrowDownBold"></el-button>
              </div>
              <div class="flex justify-between">
                <span>015475</span>
                <span>2024-01-12</span>
              </div>
              <el-collapse-transition>
                <div v-if="showCard" class="mt-6px bg-slate-200 rounded-6px p-4px">
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
      <GridItem :span="3">
        <div style="height: calc(100vh - 112px); border-left: 1px solid #E8E8E8;border-right: 1px solid #E8E8E8;">

        </div>
      </GridItem>
      <GridItem :span="1">33</GridItem>
    </Grid>
  </div>
</template>

<script setup lang="ts">
import { ArrowUpBold, ArrowDownBold } from "@element-plus/icons-vue";
import { ref } from "vue";
const showInput = ref(false)
const showCard = ref(false)
const activeName = ref('1')
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