<template>
  <div class="chat-panel-layout">
    <div class="chat-panel-header">
      <div class="chat-info">
        <div class="chat-title">Chat</div>
        <div class="chat-name">Chat History Name</div>
      </div>

      <div
        class="btn"
        v-tooltip.bottom="{
          content: '退出Chat模式',
          theme: 'delicate',
        }"
      >
        <v-icon>$IconClose</v-icon>
      </div>
    </div>
    <ChatHistory :chatCycles="chatCycles"></ChatHistory>
    <div class="chat-input-wrapper">
      <ChatInput
        @submit="handleSubmit"
        :controlSubmitBtnDisabled="isSubmitBtnDisabled"
      ></ChatInput>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, inject, computed } from "vue";
import ChatInput from "@/components/ChatInput.vue";
import ChatHistory from "@/components/ChatHistory.vue";
import { chat } from "@/fetch/ai.js";
import { useEditorContent } from "@/store/editorContent";
const eventBus = inject("eventBus");
const editorContent = useEditorContent();
const chatCycles = ref([]);
const isSubmitBtnDisabled = ref(false);
const handleSubmit = (msg) => {
  isSubmitBtnDisabled.value = true;
  eventBus.emit("restart-reuqest");
  chatCycles.value.push({
    role: "user",
    content: [{ result: msg }],
    loading: false,
  });
  chat(
    {
      fileId: editorContent.currentFile,
      chatHistory: message.value,
    },
    (res) => {
      if (!res?.done) {
        chatCycles.value.at(-1).content.push(res.value.data);
        eventBus.emit(
          `update-print-task-${chatCycles.value.length - 1}`,
          res.value.data
        );
      } else {
        chatCycles.value.at(-1).loading = false;
        isSubmitBtnDisabled.value = false;
      }
    }
  );
  chatCycles.value.push({ role: "assistant", content: [], loading: true });
};
const message = computed(() => {
  return chatCycles.value.map((item) => {
    return {
      role: item.role,
      content: item.content.map((data) => data.result).join(""),
    };
  });
});
</script>

<style scoped>
.chat-panel-layout {
  flex: 0.8;
  max-width: 500px;
  height: 100%;
  background-color: antiquewhite;
  padding: 12px;
  user-select: none;
  display: flex;
  flex-direction: column;
}
.btn {
  width: 24px;
  height: 24px;
  cursor: pointer;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.btn:hover {
  background-color: var(--ath-btn-hover);
}
.btn:active {
  background-color: var(--ath-btn-active);
}
.chat-panel-header {
  display: flex;
  height: 40px;
  align-items: center;
  justify-content: space-between;
  font-size: 20px;
  position: relative;
}
.chat-panel-header::after {
  position: absolute;
  content: "";
  background-color: var(--ath-divider-color);
  width: 100%;
  height: 2px;
  top: calc(100% + 12px);
}
.chat-info {
  display: flex;
  align-items: center;
}
.chat-panel-header .chat-title {
  position: relative;
}
.chat-panel-header .chat-title::after {
  position: absolute;
  content: "";
  background-color: var(--ath-divider-color);
  width: 2px;
  height: calc(100% - 8px);
  top: 4px;
  right: -12px;
}
.chat-panel-header .chat-name {
  margin-left: 24px;
}
.chat-input-wrapper {
  margin-top: 12px;
  background-color: whitesmoke;
}
</style>
