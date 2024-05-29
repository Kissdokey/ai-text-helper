<template>
  <div class="chat-session-layout">
    <div class="chat-session-header">
      <div class="chat-session-header-title">chat 管理</div>
      <div
        class="btn"
        v-tooltip.bottom="{
          content: '收起会话管理',
          theme: 'delicate',
        }"
      >
        <v-icon>$IconCloseWorkSpace</v-icon>
      </div>
    </div>
    <AddChatSessionMenu
      activator=".create-new-chat-btn"
      location="bottom"
      offset="6px"
    ></AddChatSessionMenu>
    <div class="create-new-chat-btn">
      <v-icon size="12">$IconCreateFile</v-icon>
      New Chat
    </div>
    <div class="chat-list">
      <div
        v-for="(item, key) in chatSession.currentSession"
        :key="key"
        :class="[
          'session-item',
          chatSession.currentSessionId === item.id ? 'session-active' : '',
        ]"
        @click="()=>handleChageSession(item.id)"
      >
        {{ item.name + item.id }}
      </div>
    </div>
  </div>
</template>

<script setup>
import AddChatSessionMenu from "@/components/AddChatSessionMenu.vue";
import { computed, inject, onMounted, ref } from "vue";
import { useChatSession } from "@/store/chat.js";
import { useEditorContent } from "@/store/editorContent.js";
const eventBus = inject("eventBus");
const chatSession = useChatSession();
const editorContent = useEditorContent();
eventBus?.on("add-chat-session", (sessionName) => addChatSession(sessionName));
eventBus.on("change-ai-chat-model", () => initChatSession());
const addChatSession = (value) => {
  chatSession.createSession(editorContent.currentFile, value, []);
};
const handleChageSession = (id)=> {
  chatSession.updateCurrentSessionId(id);
}
const initChatSession = () => {
  if (chatSession.getSessionByFileId(editorContent.currentFile).length === 0) {
    chatSession.createSession(editorContent.currentFile, "default", []);
  }else {
    chatSession.updateCurrentSession(editorContent.currentFile);
  }
};
</script>

<style scoped>
.chat-session-layout {
  border-right: 1px solid var(--ath-divider-color);
  user-select: none;
  padding: 12px;
  flex: 0.5;
  max-width: 250px;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.chat-session-header {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 16px;
}
.create-new-chat-btn {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  height: 32px;
  border: 1px solid var(--ath-divider-color);
  border-radius: 8px;
  margin-top: 12px;
}
.create-new-chat-btn:hover {
  background-color: var(--ath-btn-hover);
}
.create-new-chat-btn:active {
  background-color: var(--ath-btn-active);
}
.btn {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 4px;
}
.btn:hover {
  background-color: var(--ath-btn-hover);
}
.btn:active {
  background-color: var(--ath-btn-active);
}
.chat-list {
  margin-top: 12px;
  flex: 1;
  overflow: auto;
}
.session-item {
  cursor: pointer;
  box-sizing: border-box;
  padding: 12px;
  border: 1px solid var(--ath-divider-color);
  border-radius: 8px;
  font-size: 12px;
  margin: 8px;
}
.session-item:hover {
  background-color: var(--ath-btn-hover);
}
.session-item:active {
  background-color: var(--ath-btn-active);
}
.session-active {
  background-color: var(--ath-btn-active);
}
</style>
