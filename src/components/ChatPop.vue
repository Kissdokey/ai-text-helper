<template>
  <div class="chat-pop-wrapper">
    <div :class="['chat-pop', popClass]">
      <div class="pop-role">{{ role }}</div>
      <div class="pop-content">{{ content }}</div>
      <div>{{ isLoading }}</div>
    </div>
  </div>
</template>
<script setup>
import { computed } from "vue";
const props = defineProps({
  role: {
    type: String,
    default: "",
  },
  content: {
    type: String,
    default: "",
  },
  isLoading: {
    type: Boolean,
    default: false
  }
});
const popClass = computed(() => {
  return props.role === "user" ? "chat-pop-user" : "chat-pop-assistant";
});
</script>
<style scoped>
.chat-pop-user {
    width:fit-content;
  margin-left: auto;
}
</style>
