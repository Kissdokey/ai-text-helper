<template>
  <div class="chat-history-container" ref="scrollContainer">
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
import { watch, ref, nextTick, onMounted, inject } from "vue";
const eventBus = inject("eventBus");
const props = defineProps({
  chatCycles: {
    type: Array,
    default: () => [],
  },
});
const scrollContainer = ref(null);
const isAutoScroll = ref(true);
onMounted(() => {
  eventBus.on("restart-reuqest", () => {
    isAutoScroll.value = true;
  });
  scrollContainer.value?.addEventListener("mousewheel", (e) => {
    isAutoScroll.value = false;
  });
});
watch(props.chatCycles, () => {
  console.log(111);
  if (!scrollContainer.value || !isAutoScroll.value) {
    return;
  }
  nextTick(() => {
    scrollContainer.value.scroll({
      top: scrollContainer.value.scrollHeight,
    });
  });
});
</script>

<style scoped>
.chat-history-container {
  padding: 24px;
  flex: 1;
  background-color: white;
  margin-top: 24px;
  overflow: auto;
}
</style>
