<template>
  <v-menu v-model="isMenuActive" :close-on-content-click="false">
    <div class="login-container">
      <div class="login-header">
        <span
          :class="[isLogin ? 'login-header-active' : 'login-header']"
          @click="changeToLogin"
          >登录</span
        >
        /
        <span
          :class="[isLogin ? 'signup-header' : 'signup-header-active']"
          @click="changeToSignup"
          >注册</span
        >
      </div>
      <div class="login-content">
        <el-input v-model="username" placeholder="请输入账号"></el-input>
        <el-input
          v-model="password"
          placeholder="请输入密码"
          type="password"
        ></el-input>
      </div>
      <div class="login-footer" @click="submit">
        <div>{{ isLogin ? "登录" : "注册" }}</div>
      </div>
    </div>
  </v-menu>
</template>
<script setup>
import { ref } from "vue";
const isMenuActive = ref(false);
const isLogin = ref(true);
const username = ref("");
const password = ref("");
const changeToLogin = () => {
  if (isLogin.value) {
    return;
  }
  isLogin.value = true;
};
const changeToSignup = () => {
  if (!isLogin.value) {
    return;
  }
  isLogin.value = false;
};
const submit = () => {
  if (isLogin.value) {
    postData("http://127.0.0.1:8000/userAccount/login", {
      username: username.value,
      password: password.value,
    }).then((e) => {
      console.log(e);
    });
  }
};
async function postData(url = "", data = {}) {
  const response = await fetch(url, {
    method: "POST",
    mode: "no-cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
    body: JSON.stringify(data),
  });
  return response
}
</script>
<style scoped>
.login-container {
  user-select: none;
  width: 400px;
  height: 400px;
  box-shadow: 3px 4px 5px rgba(13, 13, 13, 0.1);
  background-color: white;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
}
.login-content {
  padding: 48px 24px;
}
.login-content .el-input {
  margin-bottom: 20px;
}
.login-header-active,
.signup-header-active {
  color: pink;
}
</style>
