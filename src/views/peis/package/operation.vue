<template>
  <div class="p-2">
    <el-card shadow="hover">
      <div class="title">
        <div class="title-box"></div>
        基础信息
      </div>
      <SearchForm ref="formRef" :columns="formColumns" :search-param="formValue" :search-col="4" :rules="rules"
        :disabled="!!look" label-position="right">
        <template #bjxm>
          <el-checkbox-group v-model="formValue.bjxm" :disabled="true">
            <el-checkbox label="Option A" value="Value A" />
            <el-checkbox label="Option B" value="Value B" />
            <el-checkbox label="Option C" value="Value C" />
            <el-checkbox label="disabled" value="Value disabled" disabled />
            <el-checkbox label="selected and disabled" value="Value selected and disabled" disabled />
          </el-checkbox-group>
        </template>
      </SearchForm>
    </el-card>
    <el-card shadow="hover">
      <div class="title">
        <div class="title-box"></div>
        套餐项目
      </div>
      <TransferFilterComplex ref="TransferFilterComplexRef" :tableHeader="tableHeader" @itemChange="itemChange"
        :disabled="!!look" :formValue="formValue" :tableColumns="tableColumns" :leftHegiht="450" :rightHeight="385">
        <template #TcWh>
          <div class="mt10px">套餐金额 {{ formValue.standardAmount }}元
            <span class="ml10px">整体折扣：</span>
            <el-input v-model="formValue.discount" placeholder="请输入" style="width:100px;" @blur="handleBlur('1')"
              oninput="value=value.replace(/[^\d.]/g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3').replace(/^\./g, '')"
              :disabled="!!look" />
            <span class="ml10px">折后应收：</span>
            <el-input v-model="formValue.receivableAmount" placeholder="请输入" style="width:100px;"
              @blur="handleBlur('2')"
              oninput="value=value.replace(/[^\d.]/g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3').replace(/^\./g, '')"
              :disabled="!!look" />
          </div>
        </template>
      </TransferFilterComplex>
    </el-card>
    <div class="footer-submit">
      <el-button class="button" round @click="router.go(-1)">取消</el-button>
      <el-button class="button" type="primary" round @click="handleSubmit"
        :disabled="formValue.tjPackageInfoItemBos.length === 0 || !!look">确定</el-button>
    </div>
  </div>
</template>

<script setup name="operation" lang="ts">
import TransferFilterComplex from '@/components/TransferFilterComplex'
import {
  packageList,
  packageAdd,
  packageDetail,
  packageUpload,
  packageInfoList
} from "@/api/peis/package";
const tableHeader = ref([
  {
    prop: 'combinProjectCode',
    label: '项目编码'
  },
  {
    prop: 'combinProjectName',
    label: '项目名称'
  },
  {
    prop: 'standardAmount',
    label: '金额'
  },
])
const tableColumns = [
  {
    label: '项目编码',
    prop: 'combinProjectCode'
  },
  {
    label: '项目名称',
    prop: 'combinProjectName'
  },
  {
    label: '金额',
    prop: 'standardAmount'
  },
  {
    label: '折扣',
    prop: 'discount'
  },
  {
    label: '折后金额',
    prop: 'receivableAmount'
  },
  {
    label: '操作',
    prop: 'cz'
  },
]
const fxtcList = ref([])
//复制套餐change
const handleFztc = (val) => {
  if (!val) {
    formValue.defaultItemList = []
    TransferFilterComplexRef.value.defaultItems()
    return
  }
  getXm(val)
}
const { proxy } = getCurrentInstance() as ComponentInternalInstance
const { bus_physical_type, bus_gender, bus_hazardous_factors, bus_duty_status, bus_shine_source, bus_job_illumination_source } = toRefs<any>(proxy?.useDict('bus_physical_type', 'bus_gender', 'bus_hazardous_factors', 'bus_duty_status', 'bus_shine_source', 'bus_job_illumination_source'))
const formColumns = ref([
  {
    label: '体检类型',
    prop: 'tjType',
    enum: bus_physical_type,
    search: { el: 'select' }
  },
  {
    label: '适用性别',
    prop: 'suitSex',
    enum: bus_gender,
    search: { el: 'select' }
  },
  {
    label: '套餐名称',
    prop: 'packageName',
    search: { el: 'input', }
  },
  {
    label: '套餐简称',
    prop: 'packageSimpleName',
    search: { el: 'input', }
  },
  {
    label: '套餐简拼',
    prop: 'pySimpleCode	',
    search: { el: 'input', }
  },
  {
    label: '排序',
    prop: 'packageSort',
    search: { el: 'input', },
  },
  {
    label: '复制套餐',
    prop: 'fztc',
    search: { el: 'select' },
    fieldNames: { label: 'packageName', value: 'id' },
    enum: fxtcList,
    change: handleFztc
  },
  {
    label: '在岗状态',
    prop: 'dutyStatus',
    search: { el: 'select', },
    enum: bus_duty_status,
    isShowSearch: false
  },
  {
    label: '危害因素',
    prop: 'hazardsBoList',
    enum: bus_hazardous_factors,
    search: { el: 'select', props: { multiple: true }, span: 2 },
    isShowSearch: false
  },
  {
    label: '照射源',
    prop: 'shineSource',
    enum: bus_shine_source,
    search: { el: 'select', },
    isShowSearch: false
  },
  {
    label: '职业照射种类',
    prop: 'shineType',
    enum: bus_job_illumination_source,
    search: { el: 'select', },
    isShowSearch: false
  },
  {
    label: '其他粉尘因素',
    prop: 'fc',
    search: { el: 'input', },
    isShowSearch: false
  },
  {
    label: '其他生物因素',
    prop: 'sw',
    search: { el: 'input', },
    isShowSearch: false
  },
  {
    label: '其他物理因素',
    prop: 'wl',
    search: { el: 'input', },
    isShowSearch: false
  },
  {
    label: '其他化学因素',
    prop: 'hx',
    search: { el: 'input', },
    isShowSearch: false
  },
  {
    label: '状态',
    prop: 'status',
    search: { el: 'select' },
    enum: [
      {
        value: '0',
        label: '正常'
      },
      {
        value: '1',
        label: '停用'
      },
    ]
  },
  {
    label: '必检项目',
    prop: 'bjxm',
    search: { el: 'checkbox', span: 24 },
    slot: 'bjxm', isShowSearch: false
  },
])
const formValue = reactive({
  hazardsBoList: [],
  packageName: '',
  tjPackageInfoItemBos: [],
  defaultItemList: []
})
const TransferFilterComplexRef = ref(null)
const router = useRouter();
const route = useRoute();
const formRef = ref(null)
const rules = ref({
  tjType: [
    { required: true, message: '请选择体检类型', trigger: 'change' },
  ],
  suitSex: [
    { required: true, message: '请选择适用性别', trigger: 'change' },
  ],
  packageName: [
    { required: true, message: '请输入套餐名称', trigger: 'blur' },
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'change' },
  ],
  hazardsBoList: [
    { required: true, message: '请选择危害因素', trigger: 'change' },
  ],
  dutyStatus: [
    { required: true, message: '请选择在岗状态', trigger: 'change' },
  ],
  shineSource: [
    { required: true, message: '请选择照射源', trigger: 'change' },
  ],
  shineType: [
    { required: true, message: '请选择职业照射种类', trigger: 'change' },
  ],
  fc: [
    { required: true, message: '请输入其他粉尘因素', trigger: 'blur' },
  ],
  sw: [
    { required: true, message: '请输入其他生物因素', trigger: 'blur' },
  ],
  wl: [
    { required: true, message: '请输入其他物理因素', trigger: 'blur' },
  ],
  hx: [
    { required: true, message: '请输入其他化学因素', trigger: 'blur' },
  ],
  bjxm: [
    { required: true, message: '请选择必检项目', trigger: 'change' },
  ],
})
const { id, look } = route.query
//获得详情
const getDetail = async () => {
  const { data } = await packageDetail({ id })
  for (const key in data) {
    formValue[key] = data[key]
  }
  getXm()
}
//获得需要回显的项目
const getXm = async (val) => {
  const { rows } = await packageInfoList({ packageId: val || id })
  formValue.defaultItemList = rows.map((item, i) => {
    return {
      sort: i + 1,
      payType: '1',//变更类型(0个人 1单位 2混合支付)
      payStatus: '0',//缴费状态（0：未缴费，1：已缴费，2：申请退费中，3：已退费，）
      tcFlag: '1',//是否套餐'0'是'1'否
      teamAmount: 0,//单位应收金额
      personAmount: item.standardAmount,//个人应收金额
      ...item,
      id: item.combinProjectId
    }
  })
  TransferFilterComplexRef.value.defaultItems()
}
id && getDetail()

//获得已存在套餐list
const hasTcList = async () => {
  const { rows } = await packageList({ pageSize: -1 })
  fxtcList.value = rows
}
!look && hasTcList()
//确定
const handleSubmit = () => {
  formRef.value.validate(async (valid, fields) => {
    if (valid) {
      if (id) {
        await packageUpload({
          ...formValue
        })
      } else {
        await packageAdd({
          ...formValue
        })
      }
      router.go(-1)
      ElMessage({
        type: "success",
        message: `操作成功!`
      });
    }
  })
}
const itemChange = (val) => {
  const { rightTableData } = val
  formValue.tjPackageInfoItemBos = rightTableData.map(item => {
    return {
      packageId: id,
      combinProjectId: item.combinProjectId || item.id,
      standardAmount: item.standardAmount,
      discount: item.discount,
      receivableAmount: item.receivableAmount,
    }
  })
}
//整体折扣和折后应收失焦
const handleBlur = (type) => {
  TransferFilterComplexRef.value.handleSelected({}, '', '2', type)
}
//健康和职业病的类型切换
watch(() => formValue.tjType, (newV) => {
  const arr = ['危害因素', '在岗状态', '必检项目']
  formColumns.value.forEach(item => {
    if (item.isShowSearch != undefined) {
      if (newV == 'ZYJKTJ' && arr.includes(item.label)) {
        item.isShowSearch = true
      } else if (arr.includes(item.label)) {
        item.isShowSearch = false
      }
    }
  })
})
//健康和职业病的类型切换
watch(() => formValue.hazardsBoList, (newV) => {
  // 其他放射14999
  // 其他生物15999
  // 其他物理13999
  // 其他粉尘11999
  // 其他化学12999
  formColumns.value.forEach(item => {
    if (item.isShowSearch != undefined) {
      if (item.label == '照射源' || item.label == '职业照射种类') {
        if (newV.includes('14999')) {
          item.isShowSearch = true
        } else {
          item.isShowSearch = false
        }
      }
      if (item.label == '其他生物因素') {
        if (newV.includes('15999')) {
          item.isShowSearch = true
        } else {
          item.isShowSearch = false
        }
      }
      if (item.label == '其他物理因素') {
        if (newV.includes('13999')) {
          item.isShowSearch = true
        } else {
          item.isShowSearch = false
        }
      }
      if (item.label == '其他粉尘因素') {
        if (newV.includes('11999')) {
          item.isShowSearch = true
        } else {
          item.isShowSearch = false
        }
      }
      if (item.label == '其他化学因素') {
        if (newV.includes('12999')) {
          item.isShowSearch = true
        } else {
          item.isShowSearch = false
        }
      }

    }
  })
})

</script>
<style scoped lang="scss">
.title {
  display: flex;
  align-items: center;
  font-weight: bold;
  margin-bottom: 5px;

  .title-box {
    width: 4px;
    height: 16px;
    border-radius: 2px;
    opacity: 1;
    background: #FF8F33;
    margin-right: 4px;
  }
}

.footer-submit {
  height: 64px;
  border-radius: 4px 4px 0px 0px;
  opacity: 1;
  background: #FFFFFF;
  box-shadow: 0px -2px 16px 0px rgba(128, 146, 181, 0.1);
  display: flex;
  align-items: center;
}
</style>
