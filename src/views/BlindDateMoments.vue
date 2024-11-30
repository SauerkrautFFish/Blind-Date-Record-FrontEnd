

<template>
  <div style="display: flex;
      flex-wrap: wrap;
      gap: 16px;">
    <p v-for="o in shareMomentStore.getShareMomentList()" :key="o.candidateId" class="text item">
      <el-card style="width: 300px" shadow="hover">

          {{ o.userName + "与" + o.candidateName + "的记录" }}

        <template #footer>

          <div>
            <el-link :underline="false" @click="handlerEnterMomentDetailPage(o.userId, o.userName, o.candidateId)">点击查看</el-link>
          </div>

        </template>
      </el-card>
    </p>
  </div>
</template>

<script setup lang="ts">

import { onMounted } from 'vue'
import { useShareMomentStore } from '@/stores/shareMoment'
import router from '@/router'

const shareMomentStore = useShareMomentStore()


onMounted(() => {
  shareMomentStore.getShareMomentListApi()
})

const handlerEnterMomentDetailPage = (shareUserId:number, shareUserName:any, shareCandidateId:number) => {
  router.push(`/shareMoments/detail/${shareUserId}/${shareUserName}/${shareCandidateId}`)
  return
}

</script>

<style scoped>

</style>