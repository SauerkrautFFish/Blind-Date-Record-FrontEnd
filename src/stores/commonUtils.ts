import { defineStore } from 'pinia'

export const useUtilsStore = defineStore('commonUtils', {

  state: () => ({

  }),

  actions: {
    getFormatTime(dateStr:any):string {

      const year = dateStr.getFullYear();
      const month = String(dateStr.getMonth() + 1).padStart(2, '0'); // 月份从0开始，需要加1
      const day = String(dateStr.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  },
});