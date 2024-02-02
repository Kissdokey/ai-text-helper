<template>
    <SumbmitBox
      submitText="登录"
      :type="TYPE"
    >
    </SumbmitBox>
</template>
<script setup>
import { inject } from "vue";
import { login } from "@/fetch/user.js";
import { useUserStore } from "@/store/user.js";
import SumbmitBox from "@/components/SubmitBox.vue";
const TYPE = 'login'
const userStore = useUserStore();
const eventBus = inject("eventBus");
const closeMenu = inject('closeMenu')
const submit = async (data) => {
  let res = await login(data, userStore.initUserInfo);
  if (res) {
    closeMenu()
    return;
  }
};
eventBus.on("login-submit", submit);
</script>
