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
        @click="handleClose"
      >
        <v-icon size="20">$IconClose</v-icon>
      </div>
    </div>
    <ChatHistory
      :chatCycles="
        chatSession.chatSession[chatSession.currentSessionId]?.content || []
      "
    ></ChatHistory>
    <div class="chat-input-wrapper">
      <ChatInput
        @submit="handleSubmit"
        :controlSubmitBtnDisabled="isSubmitBtnDisabled"
      ></ChatInput>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, inject, computed, watch } from "vue";
import ChatInput from "@/components/ChatInput.vue";
import ChatHistory from "@/components/ChatHistory.vue";
import { chat } from "@/fetch/ai.js";
import { useEditorContent } from "@/store/editorContent";
import { useChatSession } from "@/store/chat";
import { deepCopy } from "@/util/deepCopy.js";
const eventBus = inject("eventBus");
const editorContent = useEditorContent();
const chatSession = useChatSession();
const chatCycles = ref(
  chatSession.chatSession[chatSession.currentSessionId]?.content || []
);
const isSubmitBtnDisabled = ref(false);
const handleClose = () => {
  eventBus.emit("change-ai-chat-model");
};
const handleSubmit = (msg) => {
  chatCycles.value =
    chatSession.chatSession[chatSession.currentSessionId]?.content || [];
  isSubmitBtnDisabled.value = true;
  eventBus.emit("restart-reuqest");
  chatCycles.value.push({
    role: "user",
    content: [{ result: msg ,created: Date.now()}],
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
const clonedChatCycles = computed(() => {
  return chatCycles.value.map((item) => {
    return {
      role: item.role,
      content: deepCopy(item.content),
      loading: item.loading,
    };
  });
});
watch(
  chatCycles,
  (newV, oldV) => {
    chatSession.updateSession(
      editorContent.currentFile,
      chatSession.currentSessionId,
      "test",
      clonedChatCycles.value
    );
  },
  { deep: true }
);
</script>

<style scoped>
.chat-panel-layout {
  flex: 0.8;
  max-width: 400px;
  height: 100%;
  padding: 12px;
  user-select: none;
  display: flex;
  flex-direction: column;
  border-left: 1px solid var(--ath-divider-color);
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
  font-size: 16px;
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
  border-radius: 12px;
}
</style>
