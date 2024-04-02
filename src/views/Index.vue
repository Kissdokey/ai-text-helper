<template>
  <Tiptap v-if="!isShareLinK"></Tiptap>
  <ExceptionPanel v-else></ExceptionPanel>
</template>
<script setup>
import ExceptionPanel from "../components/ExceptionPanel.vue";
import Tiptap from "@/components/Tiptap.vue";
import { acquireFile } from '@/fetch/file.js'
const shareLinkReg = new RegExp(/^\/ATH\//);
const currentPath = window.location.pathname;
const isShareLinK = shareLinkReg.test(currentPath);

if (isShareLinK) {
    //判断链接是否有效，判断是否有权限
    const index = currentPath.indexOf('ATH/')
    acquireFile({
      fileId: currentPath.slice(index + 4)
    })
}else {
    //直接就是自己的界面
}
</script>
