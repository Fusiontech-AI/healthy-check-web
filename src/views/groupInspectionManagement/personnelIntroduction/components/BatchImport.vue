<template>
  <div>
    <div class="h-full flex flex-col justify-between">
      <div class="px-8">
        <el-steps :active="steps" process-status="wait">
          <el-step title="上传文件" description="根据模版修改后上传" />
          <el-step title="预览数据" description="预览并检查数据" />
          <el-step title="执行导入" description="数据导入至服务器" />
          <el-step title="导入成功" description="完成数据批量导入" />
        </el-steps>
      </div>
      <el-scrollbar height="calc(100vh - 290px)" class="p-10px">
        <div v-if="steps == 1">
          <div class="mt-4" v-if="errorList.length==0">
            <div class="box mb-4">
              <div class="text-#141C28 text-[16px] font-medium">填写导入团检人员信息</div>
              <div class="my-3">请按照数据模板的格式准备导入数据，模板中的表头名称不可更改，表头行不能删除，单次导入的数据不超过1000条。</div>
              <div>
                <el-button class="mr-5" plain @click="importTemplate('JKTJ')">下载健康体检模板</el-button>
                <el-button class="mr-5" plain @click="importTemplate('ZYJKTJ')">下载职业病体检模板</el-button>
                <el-button class="mr-5" plain @click="importTemplate('FSTJ')">下载放射体检模板</el-button>
              </div>
            </div>
            <div class="box h-[300px] overflow-auto">
              <div class="text-#141C28 text-[16px] font-medium">上传填好的员工信息表</div>
              <div class="my-3">文件后缀名必须为xls 或xlsx （即Excel格式），文件大小不得大于10M</div>
              <el-upload
                ref="uploadRef"
                class="upload_card"
                accept=".xlsx, .xls"
                :limit="1"
                :disabled="upload.isUploading"
                :headers="upload.headers"
                :action="upload.url"
                :on-progress="handleFileUploadProgress"
                :on-success="handleFileSuccess"
                :on-remove="handleFileRemove"
                :data="upload.uploadParams"
                multiple
                drag
              >
                <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                <div class="el-upload__text">上传文件</div>
                <template #tip>
                  <div class="ml-2">
                    <el-checkbox v-model="upload.uploadParams.autoGroup" label="自动入组" size="large" />
                  </div>
                </template>
              </el-upload>
              <!-- <div class="flex flex-wrap">
                <div class="mr-4 p-2 text-[#141C28] rounded-[4px] hover:bg-[#DDEBFB] cursor-pointer	">人员名单.xls</div>
                <div class="mr-4 p-2 text-[#141C28] rounded-[4px] hover:bg-[#DDEBFB] cursor-pointer	">人员名单.xls</div>
                <div class="mr-4 p-2 text-[#141C28] rounded-[4px] hover:bg-[#DDEBFB] cursor-pointer	">人员名单.xls</div>
                <div class="mr-4 p-2 text-[#141C28] rounded-[4px] hover:bg-[#DDEBFB] cursor-pointer	">人员名单.xls</div>
                <div class="mr-4 p-2 text-[#141C28] rounded-[4px] hover:bg-[#DDEBFB] cursor-pointer	">人员名单.xls</div>
                <div class="mr-4 p-2 text-[#141C28] rounded-[4px] hover:bg-[#DDEBFB] cursor-pointer	">人员名单.xls</div>
              </div> -->
            </div>
          </div>
          <div class="mt-4" v-if="errorList.length!==0">
            <Grid :cols="2" :gap="16">
              <grid-item>
                <div class="box h-[108px] flex flex-col justify-center items-center">
                  <div class="text-[#141C28] text-[20px] mb-2">{{successList.length}}<span class="text-[#89919F] text-[14px] ml-1">条</span></div>
                  <div class="flex items-center">
                    <el-icon color="#67c23a"><SuccessFilled /></el-icon>
                    <span class="ml-1 text-[#89919F]">正常数据条数</span>
                  </div>
                </div>
              </grid-item>
              <grid-item>
                <div class="box h-[108px] flex flex-col justify-center items-center">
                  <div class="text-[#FF8400] text-[20px] mb-2">{{ errorList.length }}<span class="text-[#89919F] text-[14px] ml-1">条</span></div>
                  <div class="flex items-center">
                    <el-icon color="#FF8400"><WarningFilled /></el-icon>
                    <span class="ml-1 text-[#89919F]">异常数据条数</span>
                  </div>
                </div>
              </grid-item>
            </Grid>
            <div class="box h-[337px] mt-4 overflow-auto">
              <div class="text-#141C28 text-[16px] mb-1">异常提示：</div>
              <div v-for="item in errorList" :key="item" class="mb-1">{{ item }}</div>
            </div>
          </div>
        </div>

        <div class="mt-4 no-card" v-if="steps == 2">
          <ProTable :columns="importColumns" :toolButton="false" :data="successList" :pagination="false" :height="450">
            <template #teamGroupId="{row}">
              <el-select v-model="row.teamGroupId" placeholder="请选择">
                <el-option v-for="item in groupList" :key="item.id" :label="item.groupName" :value="item.id"></el-option>
              </el-select>
            </template>
          </ProTable>
        </div>
        <div class="mt-[130px] flex flex-col justify-center items-center" v-if="steps == 3">
          <img src="/src/assets/icons/svg/file.svg" width="50" />
          <div class="w-full text-center mt-4">正在导入数据，请勿关闭或刷新页面</div>
          <el-progress class="my-8 w-[70%] m-auto" :percentage="percentage" />
        </div>
        <div class="mt-[100px] flex flex-col justify-center items-center" v-if="steps == 4">
          <img src="/src/assets/icons/svg/import.svg" width="100" />
          <div class="w-full text-center text-[18px] text-[#141C28] font-medium">数据导入完成</div>
          <div class="mt-1 w-full text-center text-[#89919F]">成功导入人员数量{{successList.length}}条</div>
        </div>
      </el-scrollbar>
      <div class="flex justify-end">
        <template v-if="steps < 3">
          <el-button round @click="handleCancelReupload(1)" v-if="steps == 1 && errorList.length == 0 ">取消</el-button>
          <el-button round @click="handleCancelReupload(2)" v-else>重新上传</el-button>
        </template>
        <el-button round type="primary" v-if="steps == 1 || steps == 2" :disabled="successList.length == 0" @click="handleNextStep">
          下一步
        </el-button>
        <el-button round type="primary" v-if="steps == 3" @click="steps++">完成</el-button>
        <el-button round type="primary" v-if="steps == 4" @click="handleCancelReupload(1)">关闭</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { importColumn } from '../rowColumns'
import { globalHeaders } from "@/utils/request";
import { insertRegisterData } from '@/api/groupInspection/taskAudit';
import { genFileId } from 'element-plus'
import type { UploadInstance, UploadProps, UploadRawFile } from 'element-plus'
import { teamGroupList } from '@/api/leadershipCockpit/overviewMedicalExaminers';
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const props = defineProps<{
  isShowDialog: boolean,
  teamTaskInfo: any
}>()

const importColumns = ref<any>(importColumn)
const steps = ref(1)
const uploadRef = ref()
const successList = ref<any>([]) // 上传成功的数据
const errorList = ref<any>([]) // 上传失败的数据
const percentage = ref<any>(0) // 保存导入文件时的进度条
const groupList = ref<any>([]) // 任务分组下拉数据

watch(()=>props.teamTaskInfo.id, async(newV)=> {
  const {rows} = await teamGroupList({taskId: props.teamTaskInfo.id, pagesize: -1, filterProject: 0}) // 根据任务带出分组列表
  console.log(rows, 'rowsrows');
  groupList.value = rows
}, {immediate: true})

// 点击下一步
const handleNextStep = async() => {
  steps.value++
  emits('get-steps', steps.value)
   if(steps.value === 3) {
    try {
      percentage.value = 50
      percentage.value = 100
      const params = {
        taskId: props.teamTaskInfo.id,
        physicalType: props.teamTaskInfo.physicalType,
        registerList: successList.value
      }
    await insertRegisterData(params)
    } catch (error) {}
   }
}
/*** 用户导入参数 */
const upload = reactive<any>({
  // 是否禁用上传
  isUploading: false,
  // 设置上传的请求头部
  headers: globalHeaders(),
  // 上传时附带的额外参数
  uploadParams: {
    templateType: props.teamTaskInfo.physicalType,
    taskId: props.teamTaskInfo.id,
    autoGroup: false
  },
  // 上传的地址
  url: import.meta.env.VITE_APP_BASE_API + "/peis/teamTask/importRegisterData"
})

/**移除文件时的钩子 */
const handleFileRemove = () => {
  successList.value = []
  errorList.value = []
}

/**文件上传中处理 */
const handleFileUploadProgress = () => {
  upload.isUploading = true;
}

/** 文件上传成功处理 */
const handleFileSuccess = ({data}: any, file: UploadFile) => {
  if(file.response.code !== 200) {
    ElMessage.error('上传失败, 请联系管理员')
    uploadRef.value?.clearFiles()
  }
  upload.isUploading = false;
  successList.value = data?.list || []
  errorList.value = data?.errorList || []
}

/** 下载模板操作 */
const importTemplate = (templateType: any) => {
  proxy?.download("/peis/teamTask/exportRegisterTemplate", {
    taskId: props.teamTaskInfo.id,
    templateType
  }, `人员导入模版.xlsx`);
}

const emits = defineEmits(['close-dialog', 'get-steps'])

const handleCancelReupload = (type:any) => {
  // type == 1 取消；type == 2 重新上传
  if(type == 1) {
    emits('close-dialog')
    steps.value == 4 && ElMessage.success('导入成功！')
  }else {
    uploadRef.value?.clearFiles()
    steps.value = 1
    successList.value = []
    errorList.value = []
  }
}
watch(() => props.isShowDialog, (newVal) => {
  // 打开弹框时
  if (newVal) {
    steps.value = 1
    emits('get-steps', steps.value)
    upload.uploadParams = {
      templateType: props.teamTaskInfo.physicalType,
      taskId: props.teamTaskInfo.id,
      autoGroup: false
    }
    uploadRef.value?.clearFiles()
    successList.value = []
    errorList.value = []
  }
}, { immediate: true })
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
