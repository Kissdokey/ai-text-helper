<template>
  <v-menu v-model="visible" :close-on-content-click="false" max-width="600">
    <div class="add-chat-session-menu-wapper">
      <el-input
        v-model="input"
        type="text"
        placeholder="请输入chat名称"
        @keydown.enter.prevent="handleSubmit"
      />
      <div class="btn-group">
        <div class="cancle-btn" @click="handleCancel"><el-button>取消 </el-button></div>
        <div
          :class="['confirm-btn', input.trim() ? '' : 'btn-disabled']"
          @click="handleSubmit"
          @keydown.enter.prevent="handleSubmit"
        >
          <el-button type="primary">确定</el-button>
        </div>
      </div>
    </div>
  </v-menu>
</template>
<script setup>
import { inject, ref } from "vue";
const eventBus = inject("eventBus");
const visible = ref(false);
const input = ref("");
const handleSubmit = () => {
  if (!input.value.trim()) {
    return;
  }
  eventBus.emit('add-chat-session',input.value)
  input.value = "";
  visible.value = false;
};
const handleCancel = () => {
  input.value = "";
  visible.value = false;
}
</script>
<style>
.add-chat-session-menu-wapper {
  padding: 24px;
  user-select: none;
  width: 100%;
  border-radius: 12px;
  background-color: var(--ath-menu-background);
  box-shadow: 0px 12px 32px 0px var(--ath-menu-box-shadow);
}
.btn-group {
  margin-top: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.btn-disabled {
  opacity: 0.5;
  pointer-events: none;
}
</style>
