import { defineStore } from 'pinia';
import { bdRequest } from '@/config/bdRequest'
import { ElMessage } from 'element-plus'
import { useBdTokenStore } from '@/stores/bdToken'
import { useRegisterAndLoginStore } from '@/stores/RegisterAndLogin'
import type { CandidateInter, CandidateRecordInter } from '@/types/CandidateInter'
import { useUtilsStore } from '@/stores/commonUtils'

export const useCandidateStore = defineStore('candidate', {

  state: () => ({
    projectLoading: false, // 项目loading状态
    addCandidateDialog: false, // 添加候选人dialog
    candidateList: [] as CandidateInter[], // 候选人列表
    candidateRecords: {} as {[key:number] : CandidateRecordInter},
    addCandidateRecordDialog: false, // 添加候选人dialog
  }),

  actions: {

    setProjectLoading(flag:boolean) {
      this.projectLoading = flag
    },

    setAddCandidateDialog(flag:boolean) {
      this.addCandidateDialog = flag
    },

    setAddCandidateRecordDialog(flag:boolean) {
      this.addCandidateRecordDialog = flag
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

    async addCandidateApi(addCandidateForm:any) {
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

    setCandidateRecord(candidateRecord:any, candidateId:any) {
      const utils = useUtilsStore()
      candidateRecord.date = utils.getFormatTime(candidateRecord.date)

      const record = this.getCandidateRecordByCandidateId(candidateId)
      record.candidateRecord.push({date: candidateRecord.date, totalCnt: candidateRecord.totalCnt,
        successCnt: candidateRecord.successCnt, explanation: candidateRecord.explanation})

      this.setCandidateRecordApi(record)

    },

    setUserRecord(userRecord:any, candidateId:any) {
      const utils = useUtilsStore()
      userRecord.date = utils.getFormatTime(userRecord.date)

      const record = this.getCandidateRecordByCandidateId(candidateId)
      if(userRecord.recordIndex == -1)
        record.userRecord.push({date: userRecord.date, totalCnt: userRecord.totalCnt,
          successCnt: userRecord.successCnt, explanation: userRecord.explanation})
      else
        record.userRecord[userRecord.recordIndex] = userRecord

      this.setCandidateRecordApi(record)
    },

    async setCandidateRecordApi(record:any) {
      this.setProjectLoading(true)

      const bdTokenStore = useBdTokenStore()
      const {id, candidateId, userRecord, candidateRecord} = record
      await bdRequest.post('/api/setCandidateBlindRecord', {
          id, candidateId, userRecord, candidateRecord
        }, {
          headers : {
            "Content-Type": "application/json",
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
          this.setAddCandidateRecordDialog(false)
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
        console.log("添加候选人记录error: ", error)
      });

      this.setProjectLoading(false)
    },
  },

});