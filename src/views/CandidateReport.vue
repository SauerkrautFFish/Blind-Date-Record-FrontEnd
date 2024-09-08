<template>
  <el-page-header @back="goBack" :icon="ArrowLeft">
    <template #content>
      <span class="text-large font-600 mr-3"> {{ candidateReportStore.getCandidateReport().candidateName }} </span>
    </template>
  </el-page-header>
  <el-divider />
  <el-steps style="max-width: 100%" :active="candidateReportStore.getCandidateReport().status" align-center finish-status="success">
    <el-step title="第一步: 提交" description="已提交" />
    <el-step title="第二步: 生成" description="正在生成报告中, 请耐心等待..." />
    <el-step title="第三步: 输出报告" description="已完成" />
  </el-steps>
  <el-divider />
  {{ candidateReportStore.getCandidateReport().updateTime }}
  <br>
  {{ candidateReportStore.getCandidateReport().report }}
</template>

<script setup lang="ts">
import { ArrowLeft } from '@element-plus/icons-vue'
import { markRaw, onMounted, reactive, ref, toRefs, watch } from 'vue'
import { useCandidateStore } from '@/stores/candidateList'
import router from '@/router'
import * as echarts from 'echarts';
import { storeToRefs } from 'pinia'
import { useCandidateReportStore } from '@/stores/candidateReport'

const candidateStore = useCandidateStore()
const candidateReportStore = useCandidateReportStore()

const { candidateId } = defineProps(['candidateId'])
const candidateName = ref('')


onMounted(() => {
  candidateReportStore.getReportApi(candidateId)

})


const goBack = () => {
  router.back()
}


</script>

<style scoped>

</style>