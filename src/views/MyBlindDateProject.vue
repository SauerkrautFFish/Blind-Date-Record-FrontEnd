<template>
  <el-button type="primary" round @click="candidateListStore.addCandidateDialog = true">添 加</el-button>
  <el-divider />
  <el-dialog v-model="candidateListStore.addCandidateDialog" title="添加候选人" width="500">
    <el-form :model="addCandidateForm">
      <el-form-item label="名 字">
        <el-input v-model="addCandidateForm.name" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="candidateListStore.addCandidateDialog = false">取消</el-button>
        <el-button type="primary" :loading="candidateListStore.projectLoading" @click="candidateListStore.addCandidate(addCandidateForm)">
          {{
            candidateListStore.projectLoading ? '提交中' : '确认'
          }}
        </el-button>
      </div>
    </template>
  </el-dialog>


  <el-card shadow="hover" v-for="candidate in candidateListStore.candidateList" :key="candidate.id" style="margin-top: 10px">
    {{ '候选人: ' + candidate.name }}
  </el-card>
</template>

<script setup lang="ts">
import { useCandidateListStore } from '@/stores/candidateList'
import { onMounted, reactive } from 'vue'

const candidateListStore = useCandidateListStore()

const addCandidateForm = reactive({
  name: '',
})

onMounted(() => {
  candidateListStore.getCandidatesApi()
})

</script>

<style scoped>

</style>