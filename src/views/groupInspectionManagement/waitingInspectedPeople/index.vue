<template>
  <div>
    <component :is="tabList[activeTab].component" @goTo="goTo" />
  </div>
</template>
<script setup name="waitingInspectedPeople" lang="tsx">
import { ref, watch } from 'vue'
import { useRoute, useRouter} from 'vue-router';
import List from './components/List.vue'
import Detail from './components/Detail.vue'

const route = useRoute()
const router = useRouter()
const activeTab = ref<any>('List')

const tabList = ref<any>({
  'List':{
    value:'1',
    component:List
  },
  'Detail':{
    value:'2',
    component:Detail
  }
})

watch(()=>route.query,(query) =>{
  if(query.tab){
    activeTab.value = query.tab
  }else{
    activeTab.value = 'List'
  }
},{
  deep:true,
  immediate:true
})

const goTo = (tab,params)=>{
  router.push({
    path:route.path,
    query:{tab,...params}
  })
}
</script>
