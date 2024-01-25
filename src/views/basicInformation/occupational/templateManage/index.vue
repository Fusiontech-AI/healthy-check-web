<template>
  <div class="bg-#fff">
    <Grid ref="gridRef" :cols="7">
      <GridItem :span="1">
        <div class="left_box">
          <div class="menu_item" :class="activeName == '1' && 'active'" @click="activeName = '1'">文书模板管理</div>
          <div class="menu_item" :class="activeName == '2' && 'active'" @click="activeName = '2'">内容模板管理</div>
        </div>
      </GridItem>
      <GridItem :span="6">
        <div>
          <pro-table class="search-table" ref="proTable" :columns="columns" :toolButton="false" :data="[{ ksName: '11' }]">
            <template #tableHeader="scope">
              <el-button type="primary" style="padding: 5px 30px;" @click="showDrawer = true">新增</el-button>
            </template>
            <template #operation>
              <el-button type="primary" link @click="showDrawer = true">查看</el-button>
            </template>
          </pro-table>
        </div>
      </GridItem>
    </Grid>
    <el-drawer v-model="showDrawer" title="新增">
      <SearchForm
        style="background: transparent; padding: 18px 30px;"
        ref="formRef"
        :columns="formColumns"
        :search-param="formValue"
        :rules="rules"
        :searchCol="1"
        :preview="false"
      ></SearchForm>
    </el-drawer>
  </div>
</template>

<script setup lang="tsx">
import { ref } from 'vue';
const showDrawer = ref<boolean>(false)
const formValue = ref({aa: '1'})
const activeName = ref('1')
const rules = reactive({
  ksSimplePy: [{required: true, message: '请输入模板名称', trigger: 'blur' }]
})
const columns = ref<any>([
  {
    type: 'index',
    label: '序号',
    width: 80
  },
  {
    prop: 'ksSimplePy',
    label: '模板名称',
    search: { el: 'input', order: 3 },
  },
  {
    prop: 'ksSort',
    label: '模版描述'
  },
  {
    prop: 'ksName',
    label: '体检类型',
    search: { el: 'select', order: 1 },

  },
  {
    prop: 'ksSimplePy',
    label: '文书类型',
    isShow: false,
    search: { el: 'select', order: 2},
  },
  {
    prop: 'status',
    label: '内容类型',
  },
  {
    prop: 'status',
    label: '添加人',
  },
  {
    prop: 'status',
    label: '添加时间',
  },
  {
    prop: 'status',
    label: '是否启用',
  },
  {
    prop: 'operation',
    label: '操作',
    fixed: 'right'
  }
])
const formColumns = ref<any>([
  {
    prop: 'aa',
    label: '模板名称',
    search: { el: 'input', },
  },
  {
    prop: 'nn',
    label: '模版编号',
    search: { el: 'input', props: {disabled: true}},
  },
  {
    prop: 'dd',
    label: '文书类型',
    enum: [ {label: '哈哈哈', value: '1'} ],
    search: { el: 'select', },
  },
  {
    prop: 'cc',
    label: '模版描述',
    search: { el: 'input',props: {type: 'textarea'} },
  },
  {
    prop: 'name',
    label: '是否启用',
    search: { el: 'switch'},
  },
])
</script>

<style scoped lang="scss">
.left_box {
  height: calc(100vh - 105px);
  padding: 10px;
  background: #fff;
  border-right: 1px solid #E8E8E8;

  .menu_item {
    cursor: pointer;
    margin-bottom: 4px;
    padding: 7px 14px;
    border-radius: 4px;
    font-size: 14px;
    color: #3F4755;
    transition: .7s all;

    &.active,
    &:hover {
      background: #DDEBFB;
      color: #2879FF;
    }
  }
}
</style>
