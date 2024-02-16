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
      <LoginPanel v-show="isLogin" ref="loginPanel"></LoginPanel>
      <RegisterPanel v-show="!isLogin" ref="registerPanel"></RegisterPanel>
    </div>
  </v-menu>
</template>
<script setup>
import { inject, nextTick, onMounted, provide, ref, watch } from "vue";
import LoginPanel from "@/components/LoginPanel.vue";
import RegisterPanel from "@/components/RegisterPanel.vue";
const eventBus = inject("eventBus");
const isMenuActive = ref(false);
const loginPanel = ref(null);
const registerPanel = ref(null);
const isLogin = ref(true);
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
const closeMenu = () => {
  isMenuActive.value = false;
};
provide("closeMenu", closeMenu);
//md这个v-menu太傻逼了，初始化的时候内部的子组件全部不加载，每次打开关闭菜单都会重新创建和销毁，如果把
//event事件放在内部会因为多次创建设置多次监听执行多次。放在外面因为子组件一开始没有加载，获取不到,而且还有一个动画会导致延迟才可以获取子组件
let setFlag = false;
watch(isMenuActive, (value) => {
  if (value && !setFlag) {
    nextTick(() => {
      console.log(loginPanel.value);
      eventBus.on("login-submit", loginPanel.value.submit);
      eventBus.on("register-submit", registerPanel.value.submit);
      setFlag = true;
    });
  }
});
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
.password-box {
  position: relative;
}
.password-icon {
  width: 16px;
  height: 16px;
  position: absolute;
  right: 8px;
  top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
</style>
<style>
.el-input__wrapper {
  padding-right: 26px !important;
}
</style>
