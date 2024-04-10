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
      <ChatInput @submit="handleSubmit"></ChatInput>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import ChatInput from "@/components/ChatInput.vue";
import ChatHistory from "@/components/ChatHistory.vue";
import {chat} from "@/fetch/ai.js";
import { useEditorContent } from "@/store/editorContent";
const editorContent = useEditorContent();
const chatCycles = ref([]);
const handleSubmit = (msg) => {
  chatCycles.value.push({role: 'user',content: msg,loading:false});
  chat({
    fileId: editorContent.currentFile,
    chatHistory: chatCycles.value,
  },(res)=> {
    if(!res?.done) {
        chatCycles.value.at(-1).content += res.value.data.result
    }else{
        chatCycles.value.at(-1).loading = true;
    }
  })
  chatCycles.value.push({role: 'assistant',content: '',loading:false})
};
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
