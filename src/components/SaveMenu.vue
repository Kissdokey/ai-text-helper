<template>
  <v-menu v-model="showHistory" :close-on-content-click="false" max-width="600">
    <v-btn @click="saveAsDocx">保存为Docx</v-btn>
    <v-btn @click="saveAsImg">保存为图片</v-btn>
    <v-btn @click="saveAsPdf">保存为PDF</v-btn>
    <v-btn @click="saveAsMd">保存为makedown</v-btn>
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
