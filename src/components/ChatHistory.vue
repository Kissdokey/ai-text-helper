<template>
  <div class="chat-history-container">
    <ChatPop
      v-for="(item, index) in chatCycles"
      :key="index"
      :role="item.role"
      :content="item.content"
      :isLoading="item.loading"
    ></ChatPop>
  </div>
</template>
<script setup>
import ChatPop from "@/components/ChatPop.vue";
const props = defineProps({
  chatCycles: {
    type: Array,
    default: () => [],
  },
});
</script>

<style scoped>
.chat-history-container {
  padding: 24px;
  flex: 1;
  background-color: white;
  margin-top: 24px;
}
</style>
