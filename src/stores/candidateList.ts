import { defineStore } from 'pinia';
import { bdRequest } from '@/config/bdRequest'
import { ElMessage } from 'element-plus'
import { useBdTokenStore } from '@/stores/bdToken'
import { useRegisterAndLoginStore } from '@/stores/RegisterAndLogin'
import type { CandidateInter, CandidateRecordInter } from '@/types/CandidateInter'

export const useCandidateListStore = defineStore('candidateList', {

  state: () => ({
    projectLoading: false, // 项目loading状态
    addCandidateDialog: false, // 添加候选人dialog
    candidateList: [] as CandidateInter[], // 候选人列表
    candidateRecords: {} as {[key:number] : CandidateRecordInter}
  }),

  actions: {

    setProjectLoading(flag:boolean) {
      this.projectLoading = flag
    },

    setAddCandidateDialog(flag:boolean) {
      this.addCandidateDialog = flag
    },

    setCandidateList(candidateList:any) {
      this.candidateList = candidateList;
    },

    setCandidateRecordsByOne(record:CandidateRecordInter) {
      this.candidateRecords[record.candidateId] = record
    },

    getCandidateRecordByCandidateId(candidateId:any) {
      return this.candidateRecords[candidateId] || {}
    },

    getCandidateNameById(id:any):string {
      for(let i = 0; i < this.candidateList.length; i++) {
        if(this.candidateList[i].id == id) {
          return this.candidateList[i].name
        }
      }

      return ""
    },

    async getCandidatesApi() {
      const bdTokenStore = useBdTokenStore()
      await bdRequest.get('/api/getCandidateList', {
          headers : {
            "Content-Type": "application/x-www-form-urlencoded",
            "bd-token": bdTokenStore.token
          }
        }
      ).then((response) => {
        if(response.data.code == 0) {
          const candidateList = response.data.data
          this.setCandidateList(candidateList)
        } else {
          ElMessage({
            message: response.data.message,
            type: 'warning',
            duration: 1400,
          })
        }
      }).catch((error) => {
        if(error.response.status == 401) {
          const rlStore = useRegisterAndLoginStore()
          rlStore.plzLogin()
          return;
        }

        ElMessage({
          message: '服务器开小差~',
          type: 'error',
          duration: 1400,
        })
        console.log("获取候选人列表error: ", error)
      });
    },

    async addCandidate(addCandidateForm:any) {
      this.setProjectLoading(true)

      const bdTokenStore = useBdTokenStore()
      await bdRequest.post('/api/addCandidate', {
          candidateName: addCandidateForm.name
        }, {
          headers : {
            "Content-Type": "application/x-www-form-urlencoded",
            "bd-token": bdTokenStore.token
          }
        }
      ).then((response) => {
        if(response.data.code == 0) {
          ElMessage({
            message: '添加成功',
            type: 'success',
            duration: 1400,
          })
          this.setAddCandidateDialog(false)
          this.getCandidatesApi()
        } else {
          ElMessage({
            message: response.data.message,
            type: 'warning',
            duration: 1400,
          })
        }
      }).catch((error) => {
        ElMessage({
          message: '服务器开小差~',
          type: 'error',
          duration: 1400,
        })
        console.log("注册失败error: ", error)
      });

      this.setProjectLoading(false)
    },

    async getCandidateRecordApi(candidateId:any) {
      const bdTokenStore = useBdTokenStore()
      await bdRequest.get(`/api/getCandidateBlindRecord?candidateId=${candidateId}`, {
          headers : {
            "Content-Type": "application/x-www-form-urlencoded",
            "bd-token": bdTokenStore.token
          }
        }
      ).then((response) => {
        if(response.data.code == 0) {
          const candidateRecord = response.data.data
          this.setCandidateRecordsByOne(candidateRecord)
        } else {
          ElMessage({
            message: response.data.message,
            type: 'warning',
            duration: 1400,
          })
        }
      }).catch((error) => {
        if(error.response.status == 401) {
          const rlStore = useRegisterAndLoginStore()
          rlStore.plzLogin()
          return;
        }

        ElMessage({
          message: '服务器开小差~',
          type: 'error',
          duration: 1400,
        })
        console.log("获取候选人详情error: ", error)
      });
    },
  },

});