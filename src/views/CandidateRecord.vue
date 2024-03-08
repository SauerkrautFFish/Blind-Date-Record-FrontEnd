<template>
  <el-page-header @back="goBack" :icon="ArrowLeft">
    <template #content>
      <span class="text-large font-600 mr-3"> {{ candidateName }} </span>
    </template>

    <div>
      candidate = {{candidateId}}
      record = {{candidateListStore.getCandidateRecordByCandidateId(candidateId)}}
    </div>
  </el-page-header>

</template>

<script setup lang="ts">
import { ArrowLeft } from '@element-plus/icons-vue'
import { onMounted } from 'vue'
import { useCandidateListStore } from '@/stores/candidateList'
import router from '@/router'

const {candidateId} = defineProps(['candidateId'])
console.log("candidateId ts=", candidateId)
const candidateListStore = useCandidateListStore()
const candidateName = candidateListStore.getCandidateNameById(candidateId)

onMounted(() => {
  candidateListStore.getCandidateRecordApi(candidateId)
})

const goBack = () => {
  router.back()
}
</script>

<style scoped>

</style>