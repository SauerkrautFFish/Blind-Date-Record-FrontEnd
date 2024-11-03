

<template>
  <div style="display: flex;
      flex-wrap: wrap;
      gap: 16px;">
    <p v-for="o in shareMomentStore.getShareMomentList()" :key="o.candidateId" class="text item">
      <el-card style="width: 300px" shadow="hover">

          {{ o.userName + "->" + o.candidateName + "的记录" }}

        <template #footer>点击查看</template>
      </el-card>
    </p>
  </div>
</template>

<script setup lang="ts">
import { useCandidateStore } from '@/stores/candidateList'
import { useRankListStore } from '@/stores/rankList'
import { useCandidateReportStore } from '@/stores/candidateReport'
import { onMounted, reactive, ref } from 'vue'
import { useShareMomentStore } from '@/stores/shareMoment'

const shareMomentStore = useShareMomentStore()


onMounted(() => {
  shareMomentStore.getShareMomentListApi()
})
</script>

<style scoped>

</style>