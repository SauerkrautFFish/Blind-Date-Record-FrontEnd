

<template>
  <div style="display: flex;
      flex-wrap: wrap;
      gap: 16px;">
    <el-card style="width: 300px" shadow="hover">
      <p v-for="o in 4" :key="o" class="text item">{{ 'List item ' + o }}</p>
      <template #footer>点击查看</template>
    </el-card>

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