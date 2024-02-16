<template>
  <SumbmitBox submitText="注册" :type="TYPE"> </SumbmitBox>
</template>
<script setup>
import { inject } from "vue";
import { register } from "@/fetch/user.js";
import SumbmitBox from "@/components/SubmitBox.vue";
const closeMenu = inject("closeMenu");
const TYPE = "register";
const eventBus = inject("eventBus");
const submit = async (data) => {
  let res = await register(data);
  if (res) {
    closeMenu();
    return;
  }
};
defineExpose({
  submit,
});
</script>
