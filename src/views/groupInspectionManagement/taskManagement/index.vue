<template>
  <div class="container">
    <div class="left">
      <el-card shadow="hover">
        <template #header>
          <div class="card-header">
            <span>任务列表</span>
            <el-button class="button" type="primary">新增任务</el-button>
          </div>
        </template>
        <el-select v-model="form.value" placeholder="请选择单位" class="left-select">
          <el-option v-for="item in form.options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-date-picker v-model="form.value1" type="daterange" range-separator="至" start-placeholder="开始时间"
          end-placeholder="结束时间" style="width: 100%;margin-top: 10px;" />
        <div class="left-input">
          <el-input v-model="form.value" placeholder="请输入任务名称" suffix-icon="Search" />
          <el-button class="button">重置</el-button>
        </div>
        <div class="left-box">
          <div class="box">
            <span>体检任务:</span> 测试
          </div>
          <div class="box">
            <span>单位:</span> 测试
          </div>
          <div class="box">
            <span>签订日期:</span> 测试
          </div>
          <div class="group-type">
            <span class="zhi">职</span>
            <!-- <span class="jian" v-else-if="item.zyb === '0'">健</span>
                <span class="fang" v-else>放</span> -->
          </div>
        </div>
      </el-card>
    </div>

    <el-card shadow="hover" class="right">
      <div class="rwtitle"><span>任务详情</span>
        <div><el-button class="button" type="primary">编辑任务</el-button><el-button class="button"
            type="primary">删除任务</el-button>
        </div>
      </div>
      <div><span>基本信息</span></div>

    </el-card>
  </div>
</template>

<script setup lang="tsx" name="taskManagement">
const form = reactive({
  value: '',
  options: [],
  value1: '',
})
</script>

<style scoped lang="scss">
.container {
  margin: 16px;
  display: flex;
  justify-content: space-between;
}

.right {
  flex: 1;
  margin-left: 10px;

  .rwtitle {
    display: flex;
    justify-content: space-between;
  }
}

.left {
  width: 350px;

  .card-header {
    display: flex;
    justify-content: space-between;
  }

  .left-box {
    margin-top: 10px;
    padding: 10px;
    border: 1px solid blue;
    border-radius: 8px;

    .box {
      margin-bottom: 10px;

      span {
        display: inline-block;
        width: 80px;
      }
    }

    .group-type {
      span {
        display: inline-block;
        width: 24px;
        height: 24px;
        border-radius: 2px;
        text-align: center;
        line-height: 24px;
        margin-right: 10px;
        font-size: 12px;
      }

      .zhi {
        background: rgba(11, 191, 191, 0.07);
        border: 1px solid rgba(11, 191, 191, 0.5);
        color: #0bbfbf;
      }

      .fang {
        background: rgba(241, 143, 45, 0.06);
        border: 1px solid rgba(241, 143, 45, 0.5);
        color: #f18f2d;
      }

      .jian {
        background: rgba(24, 149, 238, 0.07);
        border: 1px solid rgba(24, 149, 238, 0.5);
        color: #1895ee;
      }
    }
  }

  .left-select {
    width: 100%;
  }

  .left-picker {
    width: 100%;
    margin-top: 10px;
  }

  .left-input {
    display: flex;
    margin-top: 10px;

    .button {
      margin-left: 15px;
    }
  }
}
</style>
