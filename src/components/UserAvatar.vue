<template>
  <div class="user-avatar">{{  userStore.username[0].toUpperCase() }}</div>
  <UserAuthentication
    v-if="!userStore.isLogin"
    activator=".user-avatar"
    location="end center"
    offset="20px"
  ></UserAuthentication>
  <UserInfoPanel
    v-if="userStore.isLogin"
    activator=".user-avatar"
    location="end center"
    offset="20px"
  ></UserInfoPanel>
</template>
<script setup>
import UserAuthentication from "@/components/UserAuthentication.vue";
import UserInfoPanel from "@/components/UserInfoPanel.vue";
import { useUserStore } from "@/store/user.js";
const userStore = useUserStore();
</script>

<style scoped>
.user-avatar {
  user-select: none;
  width: 32px;
  height: 32px;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: yellow;
  border-radius: 16px;
  margin: 8px;
  color: green;
}
</style>
