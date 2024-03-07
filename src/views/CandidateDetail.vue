<template>
  <el-page-header :icon="ArrowLeft">
    <template #content>
      <span class="text-large font-600 mr-3"> Title </span>
    </template>

    <div>
      candidateId = {{candidateId}}
    </div>
  </el-page-header>

</template>

<script setup lang="ts">
import { ArrowLeft } from '@element-plus/icons-vue'

defineProps(['candidateId'])
</script>

<style scoped>

</style>