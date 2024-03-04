<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavBar from '@/components/NavBar.vue'

</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <NavBar/>
      </el-header>
      <el-main>
        <RouterView />
      </el-main>
    </el-container>
  </div>
</template>

<style scoped>

</style>
