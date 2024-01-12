<template>
  <div class="user-avatar">111</div>
  <LoginPanel
    activator=".user-avatar"
    location="end center"
    offset="20px"
  ></LoginPanel>
</template>
<script setup>
import LoginPanel from "@/components/LoginPanel.vue";
</script>

<style scoped>
.user-avatar {
  width: 32px;
  height: 32px;
  background-color: yellow;
  border-radius: 16px;
  margin: 8px;
  color: green;
}
</style>
