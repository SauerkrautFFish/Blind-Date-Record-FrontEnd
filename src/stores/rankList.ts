import { defineStore } from 'pinia';
import { bdRequest } from '@/config/bdRequest'
import { ElMessage } from 'element-plus'
import { useBdTokenStore } from '@/stores/bdToken'
import { useRegisterAndLoginStore } from '@/stores/RegisterAndLogin'

export const useRankListStore = defineStore('rankList', {

  state: () => ({
    projectLoading: false, // 项目loading状态
    youFocusOnRankList: [] as string[],
    focusOnYouRankList: [] as string[]
  }),

  actions: {

    setProjectLoading(flag:boolean) {
      this.projectLoading = flag
    },

    setYouFocusOnRankList(youFocusOnRankList:any) {
      this.youFocusOnRankList = youFocusOnRankList;
    },

    setFocusOnYouRankList(focusOnYouRankList:any) {
      this.focusOnYouRankList = focusOnYouRankList;
    },

    getYouFocusOnRankList() {
      return this.youFocusOnRankList;
    },

    getFocusOnYouRankList() {
      return this.focusOnYouRankList;
    },

    async getCandidateRankList(you:any) {
      this.setProjectLoading(true)
      const bdTokenStore = useBdTokenStore()
      await bdRequest.get('/api/getFocusOnRank?youFlag=' + you, {
          headers : {
            "Content-Type": "application/x-www-form-urlencoded",
            "bd-token": bdTokenStore.token
          }
        }
      ).then((response) => {
        if(response.data.code == 0) {
          const candidateRankList = response.data.data
          if (you == true) {
            this.setYouFocusOnRankList(candidateRankList)
          } else {
            this.setFocusOnYouRankList(candidateRankList)
          }
        } else {
          ElMessage({
            message: response.data.message,
            type: 'warning',
            duration: 1400,
          })
        }
        this.setProjectLoading(false)
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