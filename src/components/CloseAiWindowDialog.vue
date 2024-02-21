<template>
  <el-dialog
    v-model="centerDialogVisible"
    title="是否退出AI模式？"
    width="500"
    align-center
    :close-on-click-modal="false"
  >
    <span>确认退出后，将清空提问并关闭对话</span>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handelCancel">取消</el-button>
        <el-button type="primary" @click="exitAiModel"> 确认退出 </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup>
import { inject, ref } from "vue";

const centerDialogVisible = ref(false);
const eventBus = inject("eventBus");
const confirmCallback = ref(null);
eventBus.on("open-ai-window-dialog", (callback) => {
  centerDialogVisible.value = true;
  confirmCallback.value = callback;
});
const handelCancel = () => {
  centerDialogVisible.value = false;
};
const exitAiModel = () => {
  centerDialogVisible.value = false;
  eventBus.emit("close-ai-window");
  if (confirmCallback.value) {
    confirmCallback.value.call();
  }
};
</script>
