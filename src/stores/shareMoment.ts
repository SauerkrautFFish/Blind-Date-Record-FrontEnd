import { defineStore } from 'pinia';
import { bdRequest } from '@/config/bdRequest'
import { ElMessage } from 'element-plus'
import { useBdTokenStore } from '@/stores/bdToken'
import { useRegisterAndLoginStore } from '@/stores/RegisterAndLogin'
import router from '@/router'

import type { ShareMomentInter } from '@/types/ShareMomentInter'
import type { ShareMomentDetailInter } from '@/types/ShareMomentDetailInter'

export const useShareMomentStore = defineStore('shareMoment', {

  state: () => ({
    shareMomentList: [] as ShareMomentInter[],
    shareDetail: {} as ShareMomentDetailInter
  }),

  actions: {



    setShareMomentList(data:any) {
      this.shareMomentList = data
    },

    getShareMomentList() {
      return this.shareMomentList
    },

    setShareDetail(data:any) {
      this.shareDetail = data
    },

    getShareDetail() {
      return this.shareDetail
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

    async getShareMomentListApi() {

      const bdTokenStore = useBdTokenStore()
      await bdRequest.get('/api/getShareList', {
          headers : {
            "Content-Type": "application/x-www-form-urlencoded",
            "bd-token": bdTokenStore.token
          }
        }
      ).then((response) => {
        if(response.data.code == 0) {
          this.setShareMomentList(response.data.data)
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

      });
    },

    async getShareMomentDetailApi(shareUserId:number, shareCandidateId:number) {

      const bdTokenStore = useBdTokenStore()
      await bdRequest.get('/api/getShareDetail?shareUserId=' + shareUserId + '&shareCandidateId=' + shareCandidateId, {
          headers : {
            "Content-Type": "application/x-www-form-urlencoded",
            "bd-token": bdTokenStore.token
          }
        }
      ).then((response) => {
        if(response.data.code == 0) {
          this.setShareDetail(response.data.data)
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

      });
    },

  }

});