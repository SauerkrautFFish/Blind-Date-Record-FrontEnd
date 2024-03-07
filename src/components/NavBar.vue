<template>
  <el-menu
    :default-active="$route.path"
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

    <el-menu-item index="/">
      介 绍
    </el-menu-item>
    <el-menu-item index="/myProject">
      我的相亲对象们
    </el-menu-item>
    <el-menu-item index="/shareMoments">
      经历分享圈
    </el-menu-item>
    <el-menu-item index="/about">
      关于
    </el-menu-item>
    <div class="flex-grow" />
    <el-menu-item v-if="!rlStore.isLogin" index="5" class="menu-item--with-button">
      <el-button type="primary" @click="rlStore.plzLogin">登录</el-button>
      <el-button type="success" @click="rlStore.registerDialog = true">注册</el-button>
    </el-menu-item>
    <el-sub-menu v-if="rlStore.isLogin" index="5">
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
    v-model="rlStore.registerDialog"
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
        <el-button @click="rlStore.cancelRegisterForm">Cancel</el-button>
        <el-button type="primary" :loading="rlStore.navBarLoading" @click="rlStore.submitRegisterForm(registerRuleFormRef, registerForm)">{{
            rlStore.navBarLoading ? '提交中' : '提交'
          }}
        </el-button>
      </div>
    </div>
  </el-drawer>
  <el-drawer
    v-model="rlStore.loginDialog"
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
        <el-button @click="rlStore.cancelLoginForm">Cancel</el-button>
        <el-button type="primary" :loading="rlStore.navBarLoading" @click="rlStore.submitLoginForm(registerRuleFormRef, loginForm)">{{
            rlStore.navBarLoading ? '登录中' : '登录'
          }}
        </el-button>
      </div>
    </div>
  </el-drawer>
</template>


<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { ElDrawer, type FormInstance, type FormRules } from 'element-plus'
import type { RegisterInter } from '@/types/RegisterInter'
import type { LoginInter } from '@/types/LoginInter'
import router from '@/router'
import { useBdTokenStore } from '@/stores/bdToken'
import { useRegisterAndLoginStore } from '@/stores/RegisterAndLogin'

const bdTokenStore = useBdTokenStore()
const rlStore = useRegisterAndLoginStore()

onMounted(()=>{
  if (bdTokenStore.token) {
    rlStore.setLoginStatus(true)
  }
})

function handleNavSelect(path:any) {
  if (path == "/" || path == "/myProject" || path == "/shareMoments" || path == "/about") {
    router.push(path)
  } else if (path == "5-2") {
    rlStore.resetLoginStatus()
  }
}

const registerForm = reactive<RegisterInter>({
  account: '',
  username: '',
  password1: '',
  password2: ''
})

const loginForm = reactive<LoginInter>({
  account: '',
  password1: ''
})

const registerRuleFormRef = ref<FormInstance>()

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