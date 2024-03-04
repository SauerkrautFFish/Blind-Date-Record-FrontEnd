<template>
  <el-menu
    :default-active="'1'.toString()"
    class="el-menu-demo"
    mode="horizontal"
    :ellipsis="false"
    @select="handleNavSelect"
  >
    <el-menu-item index="0">
      <img
        style="width: 100px"
        src="https://element-plus.org/images/element-plus-logo.svg"
        alt="Element logo"
      />
    </el-menu-item>

    <el-menu-item index="1">
      介 绍
    </el-menu-item>
    <el-menu-item index="2">
      我的相亲对象们
    </el-menu-item>
    <el-menu-item index="3">
      经历分享圈
    </el-menu-item>
    <el-menu-item index="4">
      关于
    </el-menu-item>
    <div class="flex-grow" />
    <el-menu-item v-if="!isLogin" index="5" class="menu-item--with-button">
      <el-button type="primary" @click="plzLogin">登录</el-button>
      <el-button type="success" @click="registerDialog = true">注册</el-button>
    </el-menu-item>
    <el-sub-menu v-if="isLogin" index="5">
      <template #title>
        <el-tag>用户</el-tag>
        <el-avatar style="margin-left: 5px"
                   class="mr-3"
                   :size="32"
                   src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
        />
      </template>
      <el-menu-item index="5-2">登出</el-menu-item>
    </el-sub-menu>
  </el-menu>

  <el-drawer
    v-model="registerDialog"
    title="注 册"
    direction="ltr"
    class="demo-drawer"
  >
    <div class="demo-drawer__content">
      <el-form :model="registerForm" ref="registerRuleFormRef" :rules="registerFormRule">
        <el-form-item label="账 号" prop="account">
          <el-input v-model="registerForm.account" placeholder="请输入账号..." clearable />
        </el-form-item>
        <el-form-item label="昵 称" prop="username">
          <el-input v-model="registerForm.username" placeholder="请输入昵称..." clearable />
        </el-form-item>
        <el-form-item label="输入密码" prop="password1">
          <el-input v-model="registerForm.password1" type="password" placeholder="请输入密码..." show-password clearable />
        </el-form-item>
        <el-form-item label="确认密码" prop="password2">
          <el-input v-model="registerForm.password2" type="password" placeholder="请再次输入密码..." show-password clearable />
        </el-form-item>
      </el-form>
      <div class="demo-drawer__footer">
        <el-button @click="cancelRegisterForm">Cancel</el-button>
        <el-button type="primary" :loading="loading" @click="submitRegisterForm(registerRuleFormRef)">{{
            loading ? '提交中' : '提交'
          }}
        </el-button>
      </div>
    </div>
  </el-drawer>
  <el-drawer
    v-model="loginDialog"
    title="登 录"
    direction="ltr"
    class="demo-drawer"
  >
    <div class="demo-drawer__content">
      <el-form :model="loginForm" ref="registerRuleFormRef" :rules="registerFormRule">
        <el-form-item label="账 号" prop="account">
          <el-input v-model="loginForm.account" placeholder="请输入账号..." clearable />
        </el-form-item>
        <el-form-item label="输入密码" prop="password1">
          <el-input v-model="loginForm.password1" type="password" placeholder="请输入密码..." show-password clearable />
        </el-form-item>
      </el-form>
      <div class="demo-drawer__footer">
        <el-button @click="cancelLoginForm">Cancel</el-button>
        <el-button type="primary" :loading="loading" @click="submitLoginForm(registerRuleFormRef)">{{
            loading ? '登录中' : '登录'
          }}
        </el-button>
      </div>
    </div>
  </el-drawer>
</template>


<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { ElDrawer, ElMessage, type FormInstance, type FormRules } from 'element-plus'
import type { RegisterInter } from '@/types/RegisterInter'
import { bdRequest } from '@/config/bdRequest'
import type { LoginInter } from '@/types/LoginInter'
import { useBdTokenStore } from '@/types/bdToken'
import router from '@/router'

let isLogin = ref(false)
const bdTokenStore = useBdTokenStore()
const loginDialog = ref(false)

onMounted(()=>{
  if (bdTokenStore.getToken()) {
    isLogin.value = true
  }
})

function plzLogin() {
  loginDialog.value = true
}

function handleNavSelect(index:any) {
  if (index == "1") {
    router.push("/")
  } else if (index == "2") {
    router.push("/myProject")
    getCandidates()
  }  else if (index == "3") {
    router.push("/shareMoments")
  } else if (index == "4") {
    router.push("/about")
  } else if (index == "5-2") {
    router.push("/")
    isLogin.value = false
    bdTokenStore.setToken('')
  }
}

async function getCandidates() {
  await bdRequest.get('/api/getCandidateList', {
      headers : {
        "Content-Type": "application/x-www-form-urlencoded",
        "bd-token": bdTokenStore.getToken()
      }
    }
  ).then((response) => {
    if(response.data.code == 0) {
      console.log(response.data.data)
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
    console.log("获取候选人列表error: ", error)
  });
}


const loading = ref(false)


const registerDialog = ref(false)
const registerRuleFormRef = ref<FormInstance>()
const registerForm = reactive<RegisterInter>({
  account: '',
  username: '',
  password1: '',
  password2: ''
})

const submitRegisterForm = async (formEl: FormInstance | undefined) => {
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

  loading.value = true
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
      cancelRegisterForm();
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
  loading.value = false
}


const cancelRegisterForm = () => {
  loading.value = false
  registerDialog.value = false
}

const registerFormRule = reactive<FormRules<RegisterInter>>({
  account: [
    { required: true, message: '请输入账号', trigger: 'blur' },
    { min: 6, max: 20, message: '长度限制为6-20', trigger: 'blur' },
  ],
  username: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 6, max: 20, message: '长度限制为6-20', trigger: 'blur' },
  ],
  password1: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度限制为6-20', trigger: 'blur' },
  ],
  password2: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度限制为6-20', trigger: 'blur' },
  ],
})


const loginForm = reactive<LoginInter>({
  account: '',
  password1: ''
})

const submitLoginForm = async (formEl: FormInstance | undefined) => {
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

  loading.value = true
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
      isLogin.value = true
      // 记录token
      bdTokenStore.setToken(response.data.data)
      cancelLoginForm();
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
  loading.value = false
}


const cancelLoginForm = () => {
  loading.value = false
  loginDialog.value = false
}

</script>

<style scoped>
.flex-grow {
  flex-grow: 1;
}

.menu-item--with-button {
  background-color: transparent !important;
}

a {
  text-decoration: none;
}
</style>