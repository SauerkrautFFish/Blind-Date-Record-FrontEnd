import { defineStore } from 'pinia';

export const useBdTokenStore = defineStore('token', {

  persist: {
    storage: localStorage
  },

  state: () => ({
    token: '',
  }),

  actions: {
    setToken(token:string) {
      this.token = token;
    },
  },
});