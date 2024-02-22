<template>
  <div class="flex p-10px">
    <div class="w-500px">
      <el-card shadow="hover">
        <template #header>
          <div class="flex justify-between items-center">
            <div>
              体检人员信息（第n次）
            </div>
            <el-button round @click="formValue = {}" v-if="!id">清空</el-button>
            <el-button round @click="formValue = {}" v-if="id" type="primary">编辑</el-button>
          </div>
        </template>
        <SearchForm ref="formRef" :columns="formColumns" :search-param="formValue" :search-col="2" :rules="rules"
          :disabled="false" label-position="right">
          <template #searchcredentialImage>
            <div class="flex justify-around mb-10px">
              <ImageUpload :isShowTip="false" v-model="formValue.credentialImage" :limit="1">
                <template #txt>
                  <div class="absolute top-60%">身份证识别</div>
                </template>
              </ImageUpload>
              <ImageUpload :isShowTip="false" v-model="formValue.credentialImage" :limit="1">
                <template #txt>
                  <div class="absolute top-60%">人脸采集</div>
                </template>
              </ImageUpload>
              <div class="mt30px z-999 w-50px">
                <div class="mb30px">
                  <el-button type="primary" round>拍照</el-button>
                </div>
                <el-button type="primary" round @click="formValue.credentialImage = ''">删除</el-button>
              </div>
            </div>
          </template>
          <template #teamId>
            <el-tree-select v-model="formValue.teamId" :data="teamIdList" check-strictly
              :props="{ label: 'teamName', value: 'id' }" filterable clearable />
          </template>
        </SearchForm>
      </el-card>
    </div>
    <div class="flex-1 ml10px">
      <el-card shadow="hover">
        <div class="flex justify-between items-center">
          <div>
            个检详情
            缴费状态：{{ filterPayStatus() }}
          </div>
          <div>
            <el-select v-model="value" placeholder="请选择" class="w-240px mr10px" v-if="!id">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <el-button round type="primary" @click="handleDJ" :disabled="detailInfo.dataSource.length == 0"
              v-if="!id">登记</el-button>
            <el-button round type="primary" @click="handleDJ" v-if="id">打印条形码</el-button>
            <el-button round type="primary" @click="handleDJ" v-if="id">打印导检单</el-button>
            <el-button round type="primary" @click="handleDJ" v-if="id">继续登记</el-button>
            <el-button round type="primary" @click="handleUpdate" v-if="id">保存</el-button>
            <el-button round @click="router.go(-1)">返回</el-button>
          </div>
        </div>
      </el-card>
      <el-card shadow="hover" class="mt10px">
        <template #header>
          <div class="flex justify-between items-center">
            <div>
              <span>已选项目</span>
              <span class="m10px"> 检验{{ JYXMSL }}项/共{{ detailInfo.dataSource.length }}项</span>
              <span>原金额 ：{{ detailInfo.totalStandardAmount }}</span>
              <span class="m10px">应收金额 ：{{ detailInfo.totalAmount }}</span>
              <span>已缴金额 ：{{ detailInfo.paidTotalAmount }}</span>
              <span class="m10px">未缴金额 ：{{ amountWJ }}</span>
            </div>
            <div>
              <el-button round type="danger">删除</el-button>
              <el-button round type="primary" @click="handleJx">
                <el-icon class="avatar-uploader-icon">
                  <plus />
                </el-icon>个人加项
              </el-button>
            </div>
          </div>
        </template>
        <ProTable :columns="tableColumns" :toolButton="false" :data="detailInfo.dataSource" :pagination="false">
          <template #operation="{ $index }">
            <el-button type="danger" round @click="handleSC">删除</el-button>
          </template>
        </ProTable>
      </el-card>
    </div>
    <SelectXmItem ref="selectXmItem" :detailInfo="detailInfo" />
  </div>
</template>
<script setup name="register" lang="ts">
import SelectXmItem from '@/views/deskRegistration/medicalRegistration/components/selectXmItem.vue'
import ImageUpload from '@/components/ImageUpload'
import { formInfoColumns, formRules, tableColumns } from '@/views/deskRegistration/medicalRegistration/checkRegistration/rowColumns.tsx'
import { teamInfoList } from "@/api/groupInspection/inspectionclosing";
import { registerAdd, registerChangeRegCombin, registerInfo, queryRegCombinProjectList } from '@/api/deskRegistration/medicalRegistration'
import { accSub } from '@/utils'
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const formColumns = ref<any>(formInfoColumns)
import type { TabsPaneContext } from 'element-plus'
const formValue = ref<any>({
  credentialNumber: '420117199507186555',
  phone: '18571714455',
  credentialType: '0',
  name: '123',
  birthday: '2000-07-15',
  checkType: '11'
}) // 基本信息绑定的值
const teamIdList = ref<any>([]) //单位列表
const value = ref('')
const options = reactive([])
const rules = reactive(formRules)
const selectXmItem = ref(null)
const formRef = ref(null)
const router = useRouter();
const route = useRoute();
const detailInfo = reactive({
  dataSource: [],
  paidTotalAmount: 0,
  totalAmount: 0,
  totalStandardAmount: 0,
  discount: 0
})
const {
  bus_pay_status,
} = toRefs<any>(proxy?.
  useDict(
    'bus_pay_status',
  )
);

const id = ref(route.query.id)

// 获取单位-任务接口
const getTeamIdList = async () => {
  const { data } = await teamInfoList({})
  teamIdList.value = proxy?.handleTree<any>(data)
}
getTeamIdList()

//获得详情
const getDetail = async () => {
  const { data } = await registerInfo({ id: id.value })
  formValue.value = data
  detailInfo.paidTotalAmount = data.paidTotalAmount
  detailInfo.totalStandardAmount = data.totalStandardAmount
  detailInfo.totalAmount = data.totalAmount
  detailInfo.discount = data.discount
  getXm()
}
//获得需要回显的项目
const getXm = async () => {
  const { data } = await queryRegCombinProjectList({ id: id.value })
  detailInfo.dataSource = data
}
id.value && getDetail()

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}

//计算未缴金额
const amountWJ = computed(() => {
  return accSub(detailInfo.paidTotalAmount, detailInfo.totalAmount)
})
//检验项目数量
const JYXMSL = computed(() => {
  return detailInfo.dataSource.filter(item => item.checkType == 1).length
})

//个人加项
const handleJx = () => {
  selectXmItem.value.handleDrawerChange()
}

//登记
const handleDJ = () => {
  formRef.value.validate(async (valid, fields) => {
    if (valid) {
      //登记信息的接口
      formValue.value.businessCategory = '1'
      formValue.value.occupationalType = '1'
      formValue.value.healthyCheckTime = proxy?.$moment().format('YYYY-MM-DD HH:mm:ss')
      const { data } = await registerAdd(formValue.value)
      id.value = data
      data && await handleUpdate()
      proxy?.$modal.msgSuccess("登记成功");
      router.push(`/deskRegistration/medicalRegistration-childPage/checkRegistration?id=${data}`);
      data && getDetail()
    }
  })

}

//删除
const handleSC = async (i) => {
  await proxy?.$modal.confirm('<span style="font-weight:bold">是否确定删除选中的x个项目？</span><br/> 删除项目后，该记录将不可恢复')
  detailInfo.dataSource.splice(i, 1)
}

//缴费状态过滤
const filterPayStatus = () => {
  let txt = '未缴费'
  bus_pay_status.value.forEach(item => {
    if (item.value == formValue.value.chargeStatus) {
      txt = item.label
    }
  })
  return txt
}

//编辑项目
const handleUpdate = async () => {
  const tjRegCombinItemBos = detailInfo.dataSource.map(item => {
    const {
      id,
      standardAmount,
      discount,
      receivableAmount,
      tcFlag,
      projectType
    } = item
    return {
      combinationProjectId: id,
      projectType: projectType || tcFlag,//编辑是projectType,新增是tcFlag
      standardAmount,
      discount,
      receivableAmount,
      personAmount: receivableAmount,
      teamAmount: 0,
      payStatus: "0",
      payMode: "0",
      checkStatus: "0",
      addFlag: "1"
    }
  })
  const p = {
    registerId: id.value,
    standardAmount: detailInfo.totalStandardAmount,
    discount: detailInfo.discount,
    receivableAmount: detailInfo.totalAmount,
    personAmount: detailInfo.totalAmount,
    teamAmount: 0,
    paidTotalAmount: formValue.paidTotalAmount,
    paidPersonAmount: formValue.paidTotalAmount,
    paidTeamAmount: 0,
    tjRegCombinItemBos
  }
  await registerChangeRegCombin(p)
  id.value && proxy?.$modal.msgSuccess("保存成功");
}
</script>
<style scoped lang="scss">
:deep(.el-upload--picture-card) {
  width: 120px
}
</style>


