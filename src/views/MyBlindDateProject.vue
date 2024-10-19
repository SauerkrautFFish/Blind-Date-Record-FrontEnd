<template>

  <el-tabs type="card" v-model="defaultTab" @tab-click="handleTabClick">
    <el-tab-pane label="候选人列表" name="candidateTab">
      <el-button type="primary" round @click="candidateStore.addCandidateDialog = true">添 加</el-button>
      <el-divider />
      <el-dialog v-model="candidateStore.addCandidateDialog" title="添加候选人" width="500">
        <el-form :model="addCandidateForm">
          <el-form-item label="名 字">
            <el-input v-model="addCandidateForm.name" autocomplete="off" />
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="candidateStore.addCandidateDialog = false">取消</el-button>
            <el-button type="primary" :loading="candidateStore.projectLoading" @click="candidateStore.addCandidateApi(addCandidateForm)">
              {{
                candidateStore.projectLoading ? '提交中' : '确认'
              }}
            </el-button>
          </div>
        </template>
      </el-dialog>

      <el-table :data="filterCandidateList" style="width: 100%">
        <el-table-column label="候选人" prop="name" />
        <el-table-column label="创建时间" prop="createTime" />
        <el-table-column label="公开/隐藏" prop="status">

          <template #default="scope">
            <el-switch
              v-model="scope.row.status"
              inline-prompt
              active-text="公开"
              inactive-text="隐藏"
              :active-value="1"
              :inactive-value="0"
              @change="handleCandidateStatusSwitchChange(scope.row, $event)"
            />

          </template>
        </el-table-column>

        <el-table-column align="right">
          <template #header>
            <el-input v-model="candidateSearch" size="small" placeholder="search" />
          </template>
          <template #default="scope">

            <el-button type="primary" @click="handleEnter(scope.row.id)">进入</el-button>
            <el-button @click="handlePreEdit(scope.row)">编辑</el-button>
            <el-button type="danger" @click="handlePreDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog
        v-model="candidateStore.deleteCandidateDialog"
        title="Warning"
        width="500"
        align-center
      >
        <span>删除后不可恢复, 确认要继续吗?</span>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="candidateStore.setDeleteCandidateDialog(false)">取消</el-button>
            <el-button type="danger" @click="handleDelete()">
              确认
            </el-button>
          </div>
        </template>
      </el-dialog>

      <el-dialog v-model="candidateStore.modifyCandidateDialog" title="编辑候选人" width="500">
        <el-form :model="modifyCandidateForm">
          <el-form-item label="名 字">
            <el-input v-model="modifyCandidateForm.name" autocomplete="off" />
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="candidateStore.setModifyCandidateDialog(false)">取消</el-button>
            <el-button type="primary" :loading="candidateStore.projectLoading" @click="candidateStore.modifyCandidateApi(modifyCandidateForm)">
              {{
                candidateStore.projectLoading ? '提交中' : '确认'
              }}
            </el-button>
          </div>
        </template>
      </el-dialog>

    </el-tab-pane>
    <el-tab-pane label="心动排行榜" name="rankTab">
      <el-scrollbar height="100%">
        <p v-for="(item, index) in youFocusOnCandidateList" :key="item" class="scrollbar-demo-item">{{ index + 1 }}, {{ item }}</p>
      </el-scrollbar>


    </el-tab-pane>
    <el-tab-pane label="情感分析" name="analysisTab">

      <el-table :data="filterCandidateList" style="width: 100%">
        <el-table-column label="候选人" prop="name" />
        <el-table-column label="创建时间" prop="createTime" />
        <el-table-column align="right">
          <template #header>
            <el-input v-model="candidateSearch" size="small" placeholder="search" />
          </template>
          <template #default="scope">
            <el-button type="success" @click="handleOpenReportDialog(scope.row.id)">生成报告</el-button>
            <el-dialog v-model="candidateReportStore.generateReportDialog" title="生成候选人情感分析报告" width="500">

              <template #footer>
                <div class="dialog-footer">
                  <el-button @click="candidateReportStore.generateReportDialog = false">取消</el-button>
                  <el-button type="primary" :loading="candidateReportStore.projectLoading" @click="candidateReportStore.generateReportApi(generateReportCandidateId)">
                    {{
                      candidateReportStore.projectLoading ? '提交中' : '确认'
                    }}
                  </el-button>
                </div>
              </template>
            </el-dialog>

            <el-button type="primary" @click="handleSeeReport(scope.row.id)">查看</el-button>
          </template>

        </el-table-column>
      </el-table>
    </el-tab-pane>
  </el-tabs>
  <router-view/>
</template>

<script setup lang="ts">
import { useCandidateStore } from '@/stores/candidateList'
import { computed, onMounted, reactive, ref } from 'vue'
import router from '@/router'
import { useRankListStore } from '@/stores/rankList'
import { useCandidateReportStore } from '@/stores/candidateReport'
import { Hide, View } from '@element-plus/icons-vue'
const candidateStore = useCandidateStore()

const rankListStore = useRankListStore()

const candidateReportStore = useCandidateReportStore()

const addCandidateForm = reactive({
  name: '',
})

const modifyCandidateForm = reactive({
  id: -1,
  name: '',
  status: 0
})

const publicCandidate = ref(true)

onMounted(() => {
  candidateStore.getCandidatesApi()
  rankListStore.getCandidateRankList(true)
})

const candidateSearch = ref('')
const defaultTab = ref('candidateTab')
const filterCandidateList = computed(() =>
  candidateStore.candidateList.filter(
    (data) =>
      !candidateSearch.value ||
      data.name.toLowerCase().includes(candidateSearch.value.toLowerCase())
  )
)
const handleEnter = (candidateId:number) => {
  router.push(`/myProject/candidateRecord/${candidateId}`)
}
const handlePreEdit = (candidate:any) => {
  // 填充输入框 点击确定提交
  modifyCandidateForm.id = candidate.id
  modifyCandidateForm.name = candidate.name
  modifyCandidateForm.status = candidate.status
  candidateStore.setModifyCandidateDialog(true)
}

let deleteCandidateId = -1
const handlePreDelete = (candidateId:number) => {
  // 弹出提示 说不可恢复 点击确认继续
  deleteCandidateId = candidateId
  candidateStore.setDeleteCandidateDialog(true)
}

const handleDelete = () => {
  // 弹出提示 说不可恢复 点击确认继续
  candidateStore.deleteCandidateApi(deleteCandidateId)
}

let generateReportCandidateId = -1
const handleOpenReportDialog = (candidateId:number) => {
  generateReportCandidateId = candidateId
  console.log(generateReportCandidateId)
  candidateReportStore.generateReportDialog = true
}
const handleSeeReport = (candidateId:number) => {
  router.push(`/myProject/candidateReport/${candidateId}`)
}
const youFocusOnCandidateList = computed(() =>
  rankListStore.youFocusOnRankList
)

const handleCandidateStatusSwitchChange = (candidate:any, newValue:any) => {
  console.log(candidate, newValue)
  // 更新候选人公开状态
  modifyCandidateForm.id = candidate.id
  modifyCandidateForm.name = candidate.name
  modifyCandidateForm.status = newValue
  candidateStore.modifyCandidateApi(modifyCandidateForm)
}

const handleTabClick = (tab:any) => {
  console.log("click")
  console.log(tab.paneName)
  switch (tab.paneName) {
    case 'candidateTab':
      candidateStore.getCandidatesApi();
      break;
    case 'rankTab':
      rankListStore.getCandidateRankList(true);
      break;
    case 'analysisTab':
      break;
    default:
      break;
  }
}

</script>

<style scoped>
.scrollbar-demo-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100px;
  margin: 30px;
  text-align: center;
  border-radius: 4px;
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}
</style>