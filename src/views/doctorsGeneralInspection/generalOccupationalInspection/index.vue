<template>
  <div class="bg-#fff content">

  </div>
</template>

<script setup lang="ts">
import _ from 'lodash'
import { getRegisterPage } from "@/api/deskRegistration/deregistration";
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { bus_physical_type, bus_person_category } = toRefs<any>(proxy?.useDict('bus_physical_type'))

</script>

<style scoped lang="scss">
.content {
  height: calc(100vh - 105px);
}
</style>
