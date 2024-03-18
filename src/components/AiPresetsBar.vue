<template>
  <div class="ai-window-header-box">
    <el-dialog v-model="isEditorMenuShow" title="编辑你的ai预设" width="500">
    <div class="selected-choices-container">
      <div v-for="item in requestChoice">
      {{ item?.name }}</div>
    </div>
    <div class="divider"></div>
    <div class="unselected-choices-container">111</div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="centerDialogVisible = false">重置</el-button>
        <el-button>添加新的ai预设</el-button>
        <el-button type="primary" @click="centerDialogVisible = false">
          保存
        </el-button>
      </div>
    </template>
  </el-dialog>
    <div class="choice-item-container">
      <div v-for="choice in requestChoice" :key="choice">
        <div
          class="choice-item"
          @click="handleSubmit(choice?.type, choice?.id)"
        >
          {{ choice?.name }}
        </div>
      </div>
    </div>

    <div
      :class="['edit-choice-item-btn',isEditorMenuShow?'btn-active':'']"
      v-tooltip.bottom="{
        content: '编辑预设列表',
        theme: 'delicate',
      }"
      @click="isEditorMenuShow = true"
    >
      <v-icon>$IconEditor</v-icon>
    </div>
  </div>
</template>
<script setup>
import { inject, ref } from "vue";
const requestChoice = ref([
  { name: "翻译", type: "translate" },
  { name: "续写", type: "completion" },
]);
const isEditorMenuShow = ref(false);
const props = defineProps({ handleSubmit: Function });

</script>
<style scoped>
.ai-window-header-box {
  position: relative;
  background-color: var(--ath-aiwindow-header-background);
  border: 1px solid var(--ath-divider-color);
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  border-radius: 4px;
}
.choice-item-container {
  width: calc(100% - 40px);
  height: 36px;
  display: flex;
  overflow: auto;
}
.choice-item {
  height: 24px;
  width: 48px;
  border-radius: 8px;
  border: 1px solid var(--ath-divider-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  margin: 4px;
}
.edit-choice-item-btn::after {
  content: "";
  width: 1.5px;
  height: calc(100% - 8px);
  position: absolute;
  left: -8px;
  top: 4px;
  background-color: var(--ath-divider-color);
}
.edit-choice-item-btn {
  position: absolute;
  right: 8px;
  width: 24px;
  cursor: pointer;
  height: 24px;
  border: 1px solid var(--ath-divider-color);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
}
.edit-choice-item-btn:hover {
  background-color: var(--ath-btn-hover);
}
.edit-choice-item-btn:active {
  background-color: var(--ath-btn-active);
}
.btn-active {
  background-color: var(--ath-btn-active);
}
.choice-item:hover {
  background-color: var(--ath-btn-hover);
}
.choice-item:active {
  background-color: var(--ath-btn-active);
}
.edit-menu {
  background-color: red;
  z-index: 9999;
  width: 100vw;
  height: 100vh;
}
.selected-choices-container {
  display: flex;
}
.divider {
  width: calc(100%);
  height: 1px;
  background-color: var(--ath-divider-color);
  margin: 0 auto;
}
</style>
