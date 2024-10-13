<template>
  <el-page-header @back="goBack" :icon="ArrowLeft">
    <template #content>
      <span class="text-large font-600 mr-3"> {{ candidateReportStore.getCandidateReport().candidateName }} </span>
    </template>
  </el-page-header>
  <el-divider />
  <el-steps style="max-width: 100%" :active="candidateReportStore.getCandidateReport().status || 1" align-center finish-status="success">
    <el-step title="流程: 未提交" description="请提交生成报告请求" />
    <el-step title="流程: 已提交" description="正在生成报告中, 请耐心等待..." />
    <el-step title="流程: 报告完成" description="报告已生成" />
  </el-steps>
  <el-divider />
  报告生成日期：{{ candidateReportStore.getCandidateReport().updateTime }}
  <el-divider />
  {{ candidateReportStore.getCandidateReport().report }}
  <el-divider />
  更多功能待解锁...
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
  console.log()
})


const goBack = () => {
  router.back()
}


</script>

<style scoped>

</style>