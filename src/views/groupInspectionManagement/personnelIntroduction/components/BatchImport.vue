<template>
  <div class="h-[600px]">
    <div class="h-full flex flex-col justify-between">
      <div class="px-8">
        <el-steps :active="steps">
          <el-step title="上传文件" description="根据模版修改后上传" />
          <el-step title="预览数据" description="预览并检查数据" />
          <el-step title="执行导入" description="数据导入至服务器" />
          <el-step title="导入成功" description="完成数据批量导入" />
        </el-steps>
        <div class="mt-4" v-if="steps == 0">
          <div class="box mb-4">
            <div class="text-#141C28 text-[16px] font-medium	">填写导入团检人员信息</div>
            <div class="my-3">请按照数据模板的格式准备导入数据，模板中的表头名称不可更改，表头行不能删除，单次导入的数据不超过1000条。</div>
            <div>
              <el-button class="mr-5" type="primary" link>下载健康体检模板</el-button>
              <el-button class="mr-5" link>下载职业病体检模板</el-button>
              <el-button class="mr-5" link>下载放射体检模板</el-button>
            </div>
          </div>
          <div class="box h-[306px] overflow-auto">
            <div class="text-#141C28 text-[16px] font-medium">填写导入团检人员信息</div>
            <div class="my-3">文件后缀名必须为xls 或xlsx （即Excel格式），文件大小不得大于10M</div>
            <el-upload class="upload_card" drag action="" multiple>
              <el-icon class="el-icon--upload"><upload-filled /></el-icon>
              <div class="el-upload__text">上传文件</div>
            </el-upload>
            <div><el-checkbox v-model="checked" label="自动入组" size="large" /></div>
            <div class="flex flex-wrap">
              <div class="mr-4 p-2 text-[#141C28] rounded-[4px] hover:bg-[#DDEBFB] cursor-pointer	">人员名单.xls</div>
              <div class="mr-4 p-2 text-[#141C28] rounded-[4px] hover:bg-[#DDEBFB] cursor-pointer	">人员名单.xls</div>
              <div class="mr-4 p-2 text-[#141C28] rounded-[4px] hover:bg-[#DDEBFB] cursor-pointer	">人员名单.xls</div>
              <div class="mr-4 p-2 text-[#141C28] rounded-[4px] hover:bg-[#DDEBFB] cursor-pointer	">人员名单.xls</div>
              <div class="mr-4 p-2 text-[#141C28] rounded-[4px] hover:bg-[#DDEBFB] cursor-pointer	">人员名单.xls</div>
              <div class="mr-4 p-2 text-[#141C28] rounded-[4px] hover:bg-[#DDEBFB] cursor-pointer	">人员名单.xls</div>
            </div>
          </div>
        </div>
        <div class="mt-4" v-if="steps == 1">
          <Grid :cols="2" :gap="16">
            <grid-item>
              <div class="box h-[108px]">
                <div class="text-[#141C28] text-[20px] mb-2">100<span class="text-[#89919F] text-[14px] ml-1">条</span></div>
                <div class="flex items-center">
                  <el-icon color="#67c23a"><SuccessFilled /></el-icon>
                  <span class="ml-1 text-[#89919F]">正常数据条数</span>
                </div>
              </div>
            </grid-item>
            <grid-item>
              <div class="box h-[108px] flex flex-col justifu-center items-center">
                <div class="text-[#FF8400] text-[20px] mb-2">100<span class="text-[#89919F] text-[14px] ml-1">条</span></div>
                <div class="flex items-center">
                  <el-icon color="#FF8400"><SuccessFilled /></el-icon>
                  <span class="ml-1 text-[#89919F]">异常数据条数</span>
                </div>
              </div>
            </grid-item>
          </Grid>
          <div class="box h-[337px] mt-4 overflow-auto">
            <div class="text-#141C28 text-[16px] mb-1">异常提示：</div>
            <div v-for="item in 10" :key="item" class="mb-1">第1行： 【姓名】该姓名在分组已存在；</div>
          </div>
        </div>
        <div class="mt-4" v-if="steps == 2">
          <ProTable :columns="importColumns" :toolButton="false" :data="data"></ProTable>
        </div>
        <div class="mt-4" v-if="steps == 3">
          <ProTable :columns="importColumns" :toolButton="false"></ProTable>
        </div>
      </div>
      <div class="flex justify-end">
        <el-button @click="steps--">取消</el-button>
        <el-button type="primary" @click="steps++">下一步</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SuccessFilled } from '@element-plus/icons-vue';
import { importColumn } from '../rowColumns'

const importColumns = ref<any>(importColumn)
const steps = ref(0)
const checked = ref()
const data = [
  {name: 1},
  {name: 1},
  {name: 1},
  {name: 1},
  {name: 1},
  {name: 1},
  {name: 1},
  {name: 1},
  {name: 1},
  {name: 2},
]
</script>

<style scoped lang="scss">
.box {
  padding: 16px;
  border: 1px solid #E6EAEF;
  background: #FBFCFF;
  border-radius: 4px;
  :deep(.upload_card .el-upload-dragger) {
    padding: 8px;
  }
}
</style>
