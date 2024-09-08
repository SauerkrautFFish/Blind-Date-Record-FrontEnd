import { defineStore } from 'pinia';
import { bdRequest } from '@/config/bdRequest'
import { ElMessage } from 'element-plus'
import { useBdTokenStore } from '@/stores/bdToken'
import { useRegisterAndLoginStore } from '@/stores/RegisterAndLogin'
import router from '@/router'

import type { CandidateReportInter } from '@/types/CandidateReportInter'

export const useCandidateReportStore = defineStore('candidateReport', {

  state: () => ({
    generateReportDialog: false,
    projectLoading: false,
    generateReportTipBox: false,
    candidateReport: {} as CandidateReportInter
  }),

  actions: {

    setProjectLoading(flag:boolean) {
      this.projectLoading = flag
    },

    setGenerateReportDialog(flag:boolean) {
      this.generateReportDialog = flag;
    },

    setCandidateReport(data:any) {
      this.candidateReport = data
    },

    getCandidateReport() {
      return this.candidateReport
    },
    //
    // setFocusOnYouRankList(focusOnYouRankList:any) {
    //   this.focusOnYouRankList = focusOnYouRankList;
    // },
    //
    // getYouFocusOnRankList() {
    //   return this.youFocusOnRankList;
    // },
    //
    // getFocusOnYouRankList() {
    //   return this.focusOnYouRankList;
    // },

    async generateReportApi(candidateId:number) {
      this.setProjectLoading(true)
      const bdTokenStore = useBdTokenStore()
      await bdRequest.get('/api/analyzeCandidate?candidateId='+candidateId, {
          headers : {
            "Content-Type": "application/x-www-form-urlencoded",
            "bd-token": bdTokenStore.token
          }
        }
      ).then((response) => {
        if(response.data.code == 0) {
          ElMessage({
            message: '请求成功',
            type: 'success',
            duration: 1400,
          })
        } else {
          ElMessage({
            message: response.data.message,
            type: 'warning',
            duration: 1400,
          })
        }
        this.setProjectLoading(false)
        this.setGenerateReportDialog(false)
      }).catch((error) => {
        if(error.response.status == 401) {
          const rlStore = useRegisterAndLoginStore()
          rlStore.plzLogin()
          return;
        }
        this.setProjectLoading(false)
        ElMessage({
          message: '服务器开小差~',
          type: 'error',
          duration: 1400,
        })
        console.log("获取候选人列表error: ", error)
      });
    },


    async getReportApi(candidateId:number) {
      this.setProjectLoading(true)
      const bdTokenStore = useBdTokenStore()
      await bdRequest.get('/api/getCandidateReport?candidateId='+candidateId, {
          headers : {
            "Content-Type": "application/x-www-form-urlencoded",
            "bd-token": bdTokenStore.token
          }
        }
      ).then((response) => {
        if(response.data.code == 0) {
          console.log(response.data.data)
          this.setCandidateReport(response.data.data)
        } else {
          ElMessage({
            message: response.data.message,
            type: 'warning',
            duration: 1400,
          })
        }
        this.setProjectLoading(false)
        this.setGenerateReportDialog(false)
      }).catch((error) => {
        if(error.response.status == 401) {
          const rlStore = useRegisterAndLoginStore()
          rlStore.plzLogin()
          return;
        }
        this.setProjectLoading(false)
        ElMessage({
          message: '服务器开小差~',
          type: 'error',
          duration: 1400,
        })
        console.log("获取候选人列表error: ", error)
      });
    }
  }

});