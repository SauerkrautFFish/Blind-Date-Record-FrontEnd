<template>

  <el-tabs type="card" v-model="defaultTab">
    <el-tab-pane label="候选人列表" name="candidateTab">
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

      <el-table :data="filterCandidateList" style="width: 100%">
        <el-table-column label="候选人" prop="name" />
        <el-table-column label="创建时间" prop="createTime" />
        <el-table-column align="right">
          <template #header>
            <el-input v-model="candidateSearch" size="small" placeholder="search" />
          </template>
          <template #default="scope">
            <el-button type="primary" @click="handleEnter(scope.row.id)">进入</el-button>
            <el-button @click="handleEdit(scope.row.id)">编辑</el-button>
            <el-button type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
    <el-tab-pane label="排行榜" name="rankTab">Config</el-tab-pane>
    <el-tab-pane label="情感分析" name="analysisTab">Role</el-tab-pane>
  </el-tabs>
  <router-view/>
</template>

<script setup lang="ts">
import { useCandidateListStore } from '@/stores/candidateList'
import { computed, onMounted, reactive, ref } from 'vue'
import router from '@/router'

const candidateListStore = useCandidateListStore()

const addCandidateForm = reactive({
  name: '',
})

onMounted(() => {
  candidateListStore.getCandidatesApi()
})

const candidateSearch = ref('')
const defaultTab = ref('candidateTab')
const filterCandidateList = computed(() =>
  candidateListStore.candidateList.filter(
    (data) =>
      !candidateSearch.value ||
      data.name.toLowerCase().includes(candidateSearch.value.toLowerCase())
  )
)
const handleEnter = (candidateId:number) => {
  router.push(`/myProject/candidateRecord/${candidateId}`)
}
const handleEdit = (candidateId:number) => {

}
const handleDelete = (candidateId:number) => {

}
</script>

<style scoped>

</style>