import { defineStore } from 'pinia';
import { bdRequest } from '@/config/bdRequest'
import { ElMessage } from 'element-plus'
import { useBdTokenStore } from '@/stores/bdToken'
import { useRegisterAndLoginStore } from '@/stores/RegisterAndLogin'
import type { CandidateInter, CandidateRecordInter, OneRecordInter } from '@/types/CandidateInter'
import { useUtilsStore } from '@/stores/commonUtils'

export const useCandidateStore = defineStore('candidate', {

  state: () => ({
    projectLoading: false, // 项目loading状态
    addCandidateDialog: false, // 添加候选人dialog
    candidateList: [] as CandidateInter[], // 候选人列表
    candidateRecords: {} as {[key:number] : CandidateRecordInter},
    addCandidateRecordDialog: false, // 添加候选人记录dialog
    deleteCandidateDialog: false, // 删除候选人dialog
    modifyCandidateDialog: false, // 修改候选人dialog
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

    setDeleteCandidateDialog(flag:boolean) {
      this.deleteCandidateDialog = flag
    },

    setModifyCandidateDialog(flag:boolean) {
      this.modifyCandidateDialog = flag
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

      });

      this.setProjectLoading(false)
    },


    async deleteCandidateApi(candidateId:any) {
      this.setProjectLoading(true)

      const bdTokenStore = useBdTokenStore()
      await bdRequest.delete('/api/removeCandidate?candidateId=' + candidateId, {
          headers : {
            "Content-Type": "application/x-www-form-urlencoded",
            "bd-token": bdTokenStore.token
          }
        }
      ).then((response) => {
        if(response.data.code == 0) {
          ElMessage({
            message: '删除成功',
            type: 'success',
            duration: 1400,
          })
          this.setDeleteCandidateDialog(false)
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

      });

      this.setProjectLoading(false)
    },

    async modifyCandidateApi(modifyCandidateForm:any) {
      this.setProjectLoading(true)

      const bdTokenStore = useBdTokenStore()
      await bdRequest.post('/api/modifyCandidate', {
          candidateId: modifyCandidateForm.id,
          candidateName: modifyCandidateForm.name,
          status: modifyCandidateForm.status
        }, {
          headers : {
            "Content-Type": "application/x-www-form-urlencoded",
            "bd-token": bdTokenStore.token
          }
        }
      ).then((response) => {
        if(response.data.code == 0) {
          ElMessage({
            message: '修改成功',
            type: 'success',
            duration: 1400,
          })
          this.setModifyCandidateDialog(false)
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

      const candidateRecordDate = new Date(candidateRecord.date)
      candidateRecord.date = utils.getFormatTime(candidateRecordDate)

      const record = this.getCandidateRecordByCandidateId(candidateId)
      record.candidateRecord.push({date: candidateRecord.date, totalCnt: candidateRecord.totalCnt,
        successCnt: candidateRecord.successCnt, explanation: candidateRecord.explanation})

      this.setCandidateRecordApi(record)

    },

    setRecord(record:any, candidateId:any) {
      if (record.isUserRecord) {
        this.setUserRecord(record, candidateId)
      } else {
        this.setCandidateRecord(record, candidateId)
      }
    },

    setUserRecord(userRecord:any, candidateId:any) {
      const utils = useUtilsStore()

      const userRecordDate = new Date(userRecord.date)
      userRecord.date = utils.getFormatTime(userRecordDate)

      const record = this.getCandidateRecordByCandidateId(candidateId)
      if(userRecord.recordIndex == -1)
        record.userRecord.push({date: userRecord.date, totalCnt: userRecord.totalCnt,
          successCnt: userRecord.successCnt, explanation: userRecord.explanation})
      else
        record.userRecord[userRecord.recordIndex] = userRecord

      this.setCandidateRecordApi(record)
    },

    deleteOneRecord(candidateId:any, index:any, isUserRecord:any) {
      const record = this.getCandidateRecordByCandidateId(candidateId)
      if (isUserRecord) {
        record.userRecord.splice(index, 1)
      } else {
        record.candidateRecord.splice(index, 1)
      }

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
            message: '操作成功',
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
        this.getCandidateRecordApi(candidateId)
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