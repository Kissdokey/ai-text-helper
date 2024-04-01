<template>
  <v-menu v-model="visible" :close-on-content-click="false">
    <div class="sare-menu-container">
      <div class="link-container">
        <v-icon>$IconLink</v-icon>
        <div class="link-wrapper">
          <span v-if="shareLink">{{ shareLink }}</span>
          <img v-else width="16" src="../assets/gifs/loading.gif" />
        </div>

        <div
          :class="['copy-btn', shareLink ? '' : 'btn-disbale']"
          @click="copyLinK"
        >
          复制
        </div>
      </div>
    </div>
  </v-menu>
</template>
<script setup>
import { onMounted, ref, watch, inject } from "vue";
import { LOCAL } from "@/fetch/api.js";
import { useEditorContent } from "@/store/editorContent.js";
const editorContent = useEditorContent();
const eventBus = inject("eventBus");
const TIME = 1000;
let hasFetchUrl = false;
const visible = ref(false);
const shareLink = ref("");
const mockFechLink = () => {
  const timmer = setTimeout(() => {
    shareLink.value = `${LOCAL}/ATH/${editorContent.currentFile}`;
    clearTimeout(timmer);
  }, TIME);
};
const copyLinK = () => {
  const textarea = document.createElement("textarea");
  textarea.value = shareLink.value;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
  eventBus.emit("copy-success", "成功复制链接到剪贴板");
};
watch(visible, (newV) => {
  if (newV && !hasFetchUrl) {
    hasFetchUrl = true;
    //mock fetch
    mockFechLink();
  }
});
</script>
<style scoped>
.sare-menu-container {
  height: 200px;
  background-color: white;
  border-radius: 12px;
  padding: 24px;
}
.link-container {
  height: 64px;
  display: flex;
  align-items: center;
  border-top: 1px solid rgba(13, 13, 13, 0.1);
  border-bottom: 1px solid rgba(13, 13, 13, 0.1);
  font-size: 16px;
}
.link-container .link-wrapper {
  margin-left: 12px;
  margin-right: 24px;
  min-width: 100px;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.link-container .copy-btn {
  font-size: 12px;
  color: white;
  background-color: rgb(122, 122, 241);
  cursor: pointer;
  user-select: none;
  border-radius: 8px;
  padding: 8px;
}
.link-container .btn-disbale {
  opacity: 0.7;
  pointer-events: none;
}
.link-container .copy-btn:hover {
  opacity: 0.7;
}
.link-container .copy-btn:active {
  opacity: 0.9;
}
</style>
