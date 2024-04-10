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
    <div class="create-new-chat-btn">
      <v-icon>$IconCreateFile</v-icon>
      New Chat
    </div>
    <div class="chat-list">
        <div v-for="i in 99">{{ i }}</div>
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
.chat-session-layout {
  user-select: none;
  padding: 12px;
  flex: 0.5;
  max-width: 300px;
  height: 100%;
  background-color: antiquewhite;
  display: flex;
  flex-direction: column;
}
.chat-session-header {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 22px;
}
.create-new-chat-btn {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
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
    flex:1;
    background-color: #fff;
    overflow: scroll;
}
</style>
