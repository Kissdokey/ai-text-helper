<template>
  <div class="submit-content">
    <el-input v-model="username" placeholder="请输入账号"></el-input>
    <div class="password-box">
      <el-input
        v-model="password"
        placeholder="请输入密码"
        :type="!isPasswordShow ? 'password' : 'text'"
      ></el-input>
      <div class="password-icon" @click="changePassWordInputType">
        <v-icon>{{
          isPasswordShow ? "$IconEyesHidden" : "$IconEyesShow"
        }}</v-icon>
      </div>
    </div>
    <div class="login-footer" @click="submit">
      <div>{{ submitText }}</div>
    </div>
  </div>
</template>
<script setup>
import { computed, inject, ref } from "vue";
import { isStrongEnough, NOTEMSG } from "@/util/vertify.js";
import _ from "lodash";
const props = defineProps({ submitText: String, type: String });
const eventBus = inject("eventBus");
const isPasswordShow = ref(false);
const isLogin = ref(true);
const username = ref("");
const password = ref("");
const submit = _.throttle(() => {
  console.log(props.type, "submit");
  eventBus.emit(`${props.type}-submit`, {
    password: password.value,
    username: username.value,
  });
}, 1000);
const changePassWordInputType = () => {
  isPasswordShow.value = !isPasswordShow.value;
};
</script>
<style scoped>
.submit-container {
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
.submit-content {
  padding: 48px 24px;
}
.submit-content .el-input {
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
