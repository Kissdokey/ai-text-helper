<template>
  <v-menu v-model="showHistory" :close-on-content-click="false" max-width="600">
    <div class="save-menu">
      <div @click="saveAsDocx">保存为Docx</div>
      <div @click="saveAsImg">保存为图片</div>
      <div @click="saveAsPdf">保存为PDF</div>
      <div @click="saveAsMd">保存为markedown</div>
    </div>
  </v-menu>
</template>
<script setup>
import { ref, inject } from "vue";
const eventBus = inject("eventBus");
const showHistory = ref(false);
const saveAsDocx = () => {
  eventBus.emit("save-as-docx");
};
const saveAsImg = () => {
  eventBus.emit("save-as-img");
};
const saveAsPdf = () => {
  eventBus.emit("save-as-pdf");
};
const saveAsMd = () => {
  eventBus.emit("save-as-md");
};
</script>
<style scoped>
.save-menu {
  user-select: none;
  background: var(--ath-menu-background);
  color: var(--ath-menu-color);
  border-radius: 12px;
  padding: 12px;
  font-size: 16px;
  box-shadow: var(--ath-menu-box-shadow);
}
.save-menu div:hover {
  background-color: var(--ath-menu-item-hover);
}
.save-menu div:active {
  background-color: var(--ath-menu-item-active);
}
.save-menu div {
  border-radius: 4px;
  padding: 2px;
  margin: 4px;
  cursor: pointer;
}
</style>
