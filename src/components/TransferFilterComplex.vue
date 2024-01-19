<template>
  <div class="tc">
    <el-row>
      <el-col :span="10">
        <el-card shadow="hover">
          <div style="display: flex;align-items: center;justify-content: space-between;margin-bottom:6px ; ">
            <div>套餐/项目检索</div>
            <el-input v-model="form.value" placeholder="请输入" suffix-icon="Search" style="width:50%;" />
          </div>
          <div>
            <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
              <el-tab-pane label="推荐套餐" name="first">
                <el-table :data="tableData" style="width: 100%" height="360">
                  <el-table-column prop="date" label="项目名称" />
                  <el-table-column prop="date" label="金额" />
                  <el-table-column prop="date" label="折后金额" />
                  <el-table-column prop="date" label="操作" width="80">
                    <template #default="scope">
                      <el-button class="button" @click="handleSelected(scope.$index)" type="primary" link>选中</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane label="职业项目" name="second">
                <el-table :data="tableData" style="width: 100%" height="360">
                  <el-table-column prop="date" label="项目名称" />
                  <el-table-column prop="date" label="金额" />
                  <el-table-column prop="date" label="折后金额" />
                  <el-table-column prop="date" label="操作" width="80">
                    <template #default="scope">
                      <el-button class="button" @click="handleSelected(scope.$index)" type="primary" link>选中</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane label="健康项目" name="third">
                <el-table :data="tableData" style="width: 100%" height="360">
                  <el-table-column prop="date" label="项目名称" />
                  <el-table-column prop="date" label="金额" />
                  <el-table-column prop="date" label="折后金额" />
                  <el-table-column prop="date" label="操作" width="80">
                    <template #default="scope">
                      <el-button class="button" @click="handleSelected(scope.$index)" type="primary" link>选中</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
            </el-tabs>
          </div>
        </el-card>
      </el-col>
      <el-col :span="14">
        <el-card shadow="hover" style="margin-left: 10px;">
          <div style="display: flex;align-items: center;justify-content: space-between;margin-bottom:6px ; ">
            <div>已选项目（共13项）</div>
            <div><el-button round>清空</el-button> <el-button round>还原</el-button></div>
          </div>
          <div>
            <el-table :data="tableData" style="width: 100%" height="414">
              <el-table-column prop="date" label="项目类型" />
              <el-table-column prop="date" label="项目名称" />
              <el-table-column prop="date" label="金额" />
              <el-table-column prop="date" label="折扣">
                <template #default="scope">
                  <el-input v-model="form.value" placeholder="请输入" />
                </template>
              </el-table-column>
              <el-table-column prop="date" label="折后金额">
                <template #default="scope">
                  <el-input v-model="form.value" placeholder="请输入" />
                </template>
              </el-table-column>
              <el-table-column prop="date" label="操作" width="80">
                <template #default="scope">
                  <el-button class="button" @click="handleSelected(scope.$index)" type="primary" link>删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
        <div style="margin-left: 10px;margin-top: 10px;">
          <el-button :icon="QuestionFilled" circle />必检项目：
          <el-checkbox v-model="form.value" label="项目一" size="large" />
          <el-checkbox v-model="form.value" label="项目一" size="large" />
          <el-checkbox v-model="form.value" label="项目一" size="large" />
          <el-checkbox v-model="form.value" label="项目一" size="large" />
          <el-checkbox v-model="form.value" label="项目一" size="large" />
          <el-checkbox v-model="form.value" label="项目一" size="large" />
          <el-checkbox v-model="form.value" label="项目一" size="large" />
          <el-checkbox v-model="form.value" label="项目一" size="large" />
          <el-checkbox v-model="form.value" label="项目一" size="large" />
          <el-checkbox v-model="form.value" label="项目一" size="large" />
          <el-checkbox v-model="form.value" label="项目一" size="large" />
          <el-checkbox v-model="form.value" label="项目一" size="large" />
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script setup lang="tsx" name="TransferFilterComplex">
import type { TabsPaneContext } from 'element-plus'
import {
  QuestionFilled
} from '@element-plus/icons-vue'
const activeName = ref('first')

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}
const tableData=ref([{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}])
const form=reactive({
  value:''
})
//选中
const handleSelected=()=>{

}
</script>
<style scoped lang="scss">
:deep(.el-tabs__nav-wrap::after ){
height: 0;
}
:deep(.el-tabs__item){
  padding: 0 10px;
}
</style>
