import { defineStore } from 'pinia'
import { useBdTokenStore } from '@/stores/bdToken'
import type { FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'
import { bdRequest } from '@/config/bdRequest'
import router from '@/router'

export const useRegisterAndLoginStore = defineStore('registerAndLogin', {

  state: () => ({
    registerDialog: false, // 注册框
    loginDialog: false, // 登录框
    navBarLoading: false, // loading动画
    isLogin: false // 是否登录
  }),

  actions: {
    setLoginStatus(flag:boolean) {
      this.isLogin = flag
    },

    setNavBarLoading(flag:boolean) {
      this.navBarLoading = flag
    },

    setLoginDialog(flag:boolean) {
      this.loginDialog = flag
    },
    setRegisterDialog(flag:boolean) {
      this.registerDialog = flag
    },


    plzLogin() {
      this.resetLoginStatus()
      this.setLoginDialog(true)
    },

    resetLoginStatus() {
      this.setLoginStatus(false)
      const bdTokenStore = useBdTokenStore()
      bdTokenStore.setToken('')
      router.push("/")
    },

    cancelRegisterForm() {
      this.setNavBarLoading(false)
      this.setRegisterDialog(false)
    },

    cancelLoginForm() {
      this.setNavBarLoading(false)
      this.setLoginDialog(false)
    },

    async submitRegisterForm (formEl: FormInstance | undefined, registerForm:any) {
      if (!formEl) return
      const checkPass = await formEl.validate((valid) => {
        return valid;
      })
      if (!checkPass) {
        ElMessage({
          message: '请按照提示输入完整',
          type: 'warning',
          duration: 1400,
        })
        return;
      }

      this.setNavBarLoading(true)
      await bdRequest.post('/api/register', {
          newAccount: registerForm.account,
          newPassword: registerForm.password1,
          userName: registerForm.username
        }, {
          headers : {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        }
      ).then((response) => {
        if(response.data.code == 0) {
          ElMessage({
            message: '注册成功',
            type: 'success',
            duration: 1400,
          })
          this.cancelRegisterForm();
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
      this.setNavBarLoading(false)
    },

    async submitLoginForm(formEl: FormInstance | undefined, loginForm:any) {
      if (!formEl) return
      const checkPass = await formEl.validate((valid) => {
        return valid;
      })
      if (!checkPass) {
        ElMessage({
          message: '请按照提示输入完整',
          type: 'warning',
          duration: 1400,
        })
        return;
      }

      this.setNavBarLoading(true)
      await bdRequest.post('/api/login', {
          account: loginForm.account,
          password: loginForm.password1,
        }, {
          headers : {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        }
      ).then((response) => {
        if(response.data.code == 0) {
          ElMessage({
            message: '登录成功',
            type: 'success',
            duration: 1400,
          })
          // 修改登录状态
          this.setLoginStatus(true)
          // 记录token
          const bdTokenStore = useBdTokenStore()
          bdTokenStore.setToken(response.data.data)
          this.cancelLoginForm();
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
        console.log("登录失败error: ", error)
      });
      this.setNavBarLoading(false)
    },
  },
});