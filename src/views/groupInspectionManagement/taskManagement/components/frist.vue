<template>
  <div>
    <div>* 分组类型按项目时，金额将根据所选套餐/项目计算得出，无需编辑。</div>
    <el-table :data="props.form.groupList" style="width: 100%">
      <el-table-column prop="groupName" label="分组名称" min-width="180">
        <template #default="{ row }">
          <el-input v-model="row.groupName" clearable :placeholder="`请填写`" :disabled="preview"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="dutyStatus" label="在岗类型" width="100"
        v-if="props.form.physicalType == 'ZYJKTJ' || props.form.physicalType == 'FSTJ'">

        <template #default="{ row }">
          <el-select v-model="row.dutyStatus" placeholder="请选择" class="left-select" clearable :disabled="preview">
            <el-option v-for="item in bus_duty_status" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="groupType" label="分组类型" width="130">

        <template #default="{ row }">
          <el-select v-model="row.groupType" placeholder="请选择" class="left-select" clearable
            :disabled="preview || props.form.physicalType == 'ZYJKTJ' || props.form.physicalType == 'FSTJ'">
            <el-option v-for="item in bus_group_type" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="gender" label="性别" width="100">

        <template #default="{ row }">
          <el-select v-model="row.gender" placeholder="请选择" class="left-select" clearable :disabled="preview">
            <el-option v-for="item in bus_gender" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="startAge" label="年龄区间" width="180">

        <template #default="{ row }">
          <div style="display:flex;align-items:center">
            <el-input v-model="row.startAge" clearable :placeholder="`请填写`" :disabled="preview"
              oninput="value=value.replace(/[^\d.]/g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3').replace(/^\./g, '')"></el-input>
            —
            <el-input v-model="row.endAge" clearable :placeholder="`请填写`" :disabled="preview"
              oninput="value=value.replace(/[^\d.]/g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3').replace(/^\./g, '')"></el-input>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="marriage" label="婚姻状态" width="120">

        <template #default="{ row }">
          <el-select v-model="row.marriage" placeholder="请选择" class="left-select" clearable :disabled="preview">
            <el-option v-for="item in bus_marriage_status" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="price" label="金额（元）" width="100">

        <template #default="{ row }">
          <el-input v-model="row.price" clearable :placeholder="`请填写`" :disabled="preview"
            oninput="value=value.replace(/[^\d.]/g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3').replace(/^\./g, '')"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="groupPayType" label="分组支付方式" width="120">

        <template #default="{ row }">
          <el-select v-model="row.groupPayType" placeholder="请选择" class="left-select" clearable :disabled="preview">
            <el-option v-for="item in bus_group_pay_type" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="itemDiscount" label="分组折扣" width="100">

        <template #default="{ row }">
          <el-input v-model="row.itemDiscount" clearable :placeholder="`请填写`" :disabled="preview"
            oninput="value=value.replace(/[^\d.]/g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3').replace(/^\./g, '')"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="addPayType" label="加项支付方式" width="120">

        <template #default="{ row }">
          <el-select v-model="row.addPayType" placeholder="请选择" class="left-select" clearable :disabled="preview">
            <el-option v-for="item in bus_group_pay_type" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="addDiscount" label="加项折扣" width="100">

        <template #default="{ row }">
          <el-input v-model="row.addDiscount" clearable :placeholder="`请填写`" :disabled="preview"
            oninput="value=value.replace(/[^\d.]/g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3').replace(/^\./g, '')"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="isSyncProject" label="分组同步" width="80">

        <template #default="{ row }">
          <el-checkbox v-model="row.isSyncProject1" label="" size="large" :disabled="preview" />
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作" width="100">

        <template #default="{ row, $index }">
          <el-button type="danger" @click="handleDel(row, $index)" :disabled="preview" link>删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button type="primary" plain @click="handleAdd" :disabled="preview" class="mt10px">新增一行</el-button>
  </div>
</template>

<script setup lang="tsx" name="first">
import { teamGroupDel } from '@/api/groupInspectionManagement/taskManagement'
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { bus_duty_status, bus_group_type, bus_marriage_status, bus_gender, bus_group_pay_type } = toRefs<any>(proxy?.useDict("bus_duty_status", 'bus_group_type', 'bus_marriage_status', 'bus_gender', 'bus_group_pay_type'));
const props = defineProps(['form', 'preview'])
//新增一行
const handleAdd = () => {
  if (!props.form.groupList) {
    props.form.groupList = [{
      groupPayType: '1',
      groupType: '1',
      gender: '2',
      marriage: '2',
      addPayType: '0',
      itemDiscount: 100,
      addDiscount: 100,
    }]
    return
  }
  props.form.groupList.push({
    groupPayType: '1',
    groupType: '1',
    gender: '2',
    marriage: '2',
    addPayType: '0',
    itemDiscount: 100,
    addDiscount: 100,
  })
}
//删除一行
const handleDel = async (row, i) => {
  await proxy?.$modal.confirm('是否删除此条信息？')
  if (row.id) {
    await teamGroupDel({ ids: row.id })
    proxy?.$modal.msgSuccess("操作成功");
  }
  props.form.groupList.splice(i, 1)
}
</script>
