<template>
  <Tiptap
    v-if="
      currentPath === '/' ||
      exceptionState.exceptionState === exceptionStateMap.SUCCESS
    "
  ></Tiptap>
  <ExceptionPanel v-else></ExceptionPanel>
</template>
<script setup>
//
import ExceptionPanel from "../components/ExceptionPanel.vue";
import Tiptap from "@/components/Tiptap.vue";
import { acquireFile } from "@/fetch/file.js";
import { exceptionStateMap } from "@/util/constantData.js";
import { useExceptionStore } from "@/store/exceptionState.js";
const exceptionState = useExceptionStore();

const shareLinkReg = new RegExp(/^\/ATH\//);
const currentPath = window.location.pathname;
const isShareLinK = shareLinkReg.test(currentPath);
if (isShareLinK) {
  //判断链接是否有效，判断是否有权限
  const index = currentPath.indexOf("ATH/");
  acquireFile({
    fileId: currentPath.slice(index + 4),
  });
} else {
  exceptionState.updateExceptionState(exceptionStateMap.ERROR);
  exceptionState.updateexceptionDescription("无效链接");
}
</script>
