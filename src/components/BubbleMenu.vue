<template>
  <bubble-menu
    :editor="editor"
    :tippy-options="{
      duration: 0,
      delay: 0,
      appendTo: 'parent',
      hideOnClick: true,
    }"
    v-if="editor"
    v-show="isBubbleShow"
  >
    <div class="buble-menu-box">
      <v-icon
        @click="openAiWindow"
        v-tooltip.bottom="{
          content: 'AI',
          theme: 'delicate',
        }"
      >
        $IconLogo
      </v-icon>
      <Button type="bold" tooltip="Bold"></Button>
      <Button type="italic" tooltip="Italic"></Button>
      <Button type="strike" tooltip="Strike"></Button>
    </div>
  </bubble-menu>
</template>
<script setup>
import { defineProps, inject, ref, onMounted, onBeforeUnmount } from "vue";
import { BubbleMenu } from "@tiptap/vue-3";
import Button from "@/components/Button.vue";
import { useAiTextAreaStore } from "@/store/aiTextArea";
const props = defineProps({ editor: Object });
const AIWINDOWCLASS = ".ai-window-container";
const SCROLLCLASS = ".editor-container";
const SELECTMASKCLASS = ".select-text-mask";
const selectNode = ref(null);
const startNode = ref(null);
const aiWindowNode = ref(null);
const selectTextMaskNode = ref(null);
const isBubbleShow = ref(true);
const eventBus = inject("eventBus");
const aiTextAreaStore = useAiTextAreaStore();
onMounted(() => {
  window.addEventListener("mousedown", closeAiWindow);
  window.addEventListener("resize", updateAiWindowPosition);
});
onBeforeUnmount(() => {
  window.removeEventListener("mousedown", closeAiWindow);
  window.removeEventListener("resize", updateAiWindowPosition);
});
const openAIWindowSignal = () => {
  eventBus.emit("open-ai-window");
};
const openAiWindow = () => {
  isBubbleShow.value = false;
  const selectedText = getSelectedText();
  aiTextAreaStore.updateSelectedText(selectedText);
  const range = window.getSelection();
  const anchor = initNode(range.anchorNode);
  const focus = initNode(range.focusNode);
  let lowerNode = getLowerNode(anchor, focus);
  let outerNode = getOuterNode(lowerNode);
  let higherNode = getLowerNode(anchor, focus, true);
  let higherOuterNode = getOuterNode(higherNode);
  selectNode.value = outerNode;
  startNode.value = higherOuterNode;
  updateAiWindowPosition();
  openAIWindowSignal();
};
const hiddenNode = () => {
  if (!aiWindowNode.value) {
    aiWindowNode.value = document.querySelector(AIWINDOWCLASS);
  }
  if (!selectTextMaskNode.value) {
    selectTextMaskNode.value = document.querySelector(SELECTMASKCLASS);
  }
  aiWindowNode.value.style.display = "none";
  selectTextMaskNode.value.style.display = "none";
};
const closeAiWindow = (e) => {
  isBubbleShow.value = true;
  if (aiWindowNode.value?.contains(e.target)) {
    return;
  }
  if (aiTextAreaStore.isAiModel) {
    eventBus.emit("open-ai-window-dialog", hiddenNode);
    return;
  }
  hiddenNode();
};
//获取当前选中文本的focus元素，由于可能是TEXT节点，获取父元素
const initNode = (node) => {
  return !node?.tagName ? node?.parentNode : node;
};
//判断选中的文本两端节点相对位置,返回相对位置靠下方的
const getLowerNode = (anchorEl, focusEl, opposite = false) => {
  let isAnchorLower = anchorEl?.offsetTop > focusEl?.offsetTop;
  let returnAnchor = opposite ? !isAnchorLower : isAnchorLower;
  return returnAnchor ? anchorEl : focusEl;
};
//得到靠下的元素之后，还需要向外层遍历找到最靠近根节点的元素，譬如表格中选中调用ai，打开的窗口应该在整个表格下方
const getOuterNode = (lowerNode) => {
  if (lowerNode?.parentNode?.classList?.contains("ProseMirror")) {
    return lowerNode;
  }
  if (lowerNode?.parentNode) {
    return getOuterNode(lowerNode.parentNode);
  }
  return undefined;
};
// 获取当前选中的文本
const getSelectedText = () => {
  let selectedText = "";

  if (window.getSelection) {
    // 非IE浏览器
    selectedText = window.getSelection().toString();
  } else if (document.selection && document.selection.type !== "Control") {
    // IE浏览器
    selectedText = document.selection.createRange().text;
  }

  return selectedText;
};
//更新ai-window和mask的位置等样式
const updateAiWindowPosition = () => {
  if (!selectNode.value) {
    return;
  }
  if (isBubbleShow.value) {
    return;
  }
  const scrollContainer = document.querySelector(SCROLLCLASS);
  let rect = selectNode.value?.getBoundingClientRect();
  let scrollRect = scrollContainer?.getBoundingClientRect();
  let startRect = startNode.value?.getBoundingClientRect();
  if (!scrollRect || !rect || !startRect) {
    return;
  }
  const top =
    rect.top - scrollRect.top + rect.height + scrollContainer.scrollTop;
  const left = rect.left - scrollRect.left;
  const maskHight = rect.top - startRect.top + rect.height;
  const maskTop = startRect.top - scrollRect.top + scrollContainer.scrollTop;
  if (!aiWindowNode.value) {
    aiWindowNode.value = document.querySelector(AIWINDOWCLASS);
  }
  if (!selectTextMaskNode.value) {
    selectTextMaskNode.value = document.querySelector(SELECTMASKCLASS);
  }
  //这里不要分别操作行内样式会导致多次回流重新布局。直接用ObjectAssign会高效很多
  Object.assign(aiWindowNode.value.style, {
    display: "block",
    left: left + "px",
    width: rect.width + "px",
    top: top + 30 + "px",
  });
  Object.assign(selectTextMaskNode.value.style, {
    display: "block",
    width: rect.width + 8 + "px",
    left: left - 4 + "px",
    height: maskHight + 8 + "px",
    top: maskTop - 4 + "px",
  });
};
</script>
<style scoped>
.buble-menu-box {
  display: flex;
  cursor: pointer;
  align-items: center;
  justify-content: space-between;
  height: 44px;
  padding: 8px;
  box-sizing: border-box;
  box-shadow: var(--ath-menu-box-shadow);
  border-radius: 8px;
  background: var(--ath-menu-background);
  color: var(--ath-menu-color);
}
.modal {
  position: fixed;
  z-index: 999;
  top: 20%;
  left: 50%;
  width: 300px;
  margin-left: -150px;
}
</style>
