<template>
  <div class="header-container">
    <div
      v-show="editorContent.openedFiles.length > 0"
      class="clear-btn"
      v-tooltip.bottom="{
        content: '一键清空',
        theme: 'delicate',
      }"
      @click="clearAll"
    >
      <v-icon size="16">$IconClose</v-icon>
    </div>
    <div
      v-show="editorContent.openedFiles.length > 0"
      class="file-select-bar"
      ref="scrollRef"
    >
      <span
        :class="[
          'file-item',
          item === editorContent.currentFile ? 'active' : '',
        ]"
        v-for="(item, index) in fileItems"
        :key="item"
        @click="() => fileClick(item, index)"
      >
        {{ editorContent.fileInfo[item]?.name }}
        <div
          class="icon-close-container"
          @click.stop="() => fileClose(item, index)"
        >
          <v-icon size="16">$IconClose</v-icon>
        </div>
      </span>
    </div>
    <div class="file-select-bar" v-show="editorContent.openedFiles.length <= 0">
      选择文件来进行编辑
    </div>
  </div>
</template>
<script setup>
import { useEditorContent } from "@/store/editorContent";
import { computed, inject, ref } from "vue";
const eventBus = inject("eventBus");
const editorContent = useEditorContent();
const scrollRef = ref(null);
const fileItems = computed(() => {
  return editorContent.openedFiles;
});
const clearAll = () => {
  editorContent.clearOpenedFiles();
};
const fileClose = async (item, index) => {
  editorContent.spliceOpenedFile(index);
  if (item !== editorContent.currentFile) {
    return;
  }
  if (fileItems.value.length === 0) {
    //Todo:无文件提示
    editorContent.initFile();
    return;
  }
  if (fileItems.value.length === index) {
    fileClick(fileItems.value[index - 1], index - 1);
  } else {
    fileClick(fileItems.value[index], index);
  }
};
const autoScroll = (index) => {
  let idx = index;
  if (index !== 0 && (index < 0 || !index)) {
    idx = fileItems.value.length - 1;
  }
  const selectFileDomInfo =
    scrollRef.value?.children[idx]?.getBoundingClientRect();
  if (!selectFileDomInfo) {
    return;
  }
  const scrollRefInfo = scrollRef.value?.getBoundingClientRect();
  scrollRef.value?.scrollTo({
    left:
      selectFileDomInfo.left -
      scrollRefInfo.left +
      scrollRef.value.scrollLeft -
      scrollRefInfo.width / 2 +
      selectFileDomInfo.width / 2,
    behavior: "smooth",
  });
};
const fileClick = async (id) => {
  eventBus.emit("change-file", id); //抛出事件，在tiptap中集中处理改变逻辑，这里直接传递id
};
eventBus.on("file-bar-auto-scroll", (index) => autoScroll(index)); //在其他地方改变当前选中文件需要调用自动滚动函数
</script>

<style scoped>
.header-container {
  user-select: none;
  position: absolute;
  top:0;
  width: 100%;
  border-bottom: 1px solid var(--ath-divider-color);
  display: flex;
  background-color: var(--ath-latestfilebar-background);
  color: var(--ath-latestfilebar-text-color);
}
.file-select-bar {
  border-radius: 4px;
  position: relative;
  box-sizing: border-box;
  user-select: none;
  white-space: nowrap;
  width: calc(100% - 60px);
  padding-top: 6px;
  height: 42px;
  overflow-x: hidden;
  overflow-y: hidden;
}
.file-select-bar:hover {
  overflow-x: auto;
}
.icon-close-container {
  width: 0;
  height: 0;
}
.file-item:hover .icon-close-container,
.active .icon-close-container {
  position: absolute;
  height: 20px;
  width: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  right: 12px;
  top: 5px;
  border-radius: 4px;
}
.icon-close-container:hover {
  background-color: var(--ath-btn-hover);
}
.icon-close-container:active {
  background-color: var(--ath-btn-active);
}
.file-item {
  border-radius: 4px;
  position: relative;
  display: inline-block;
  padding: 0px 44px 0 12px;
  min-width: 40px;
  max-width: 300px;
  background-color: var(--ath-latestfilebar-item-background);
  line-height: 30px;
  font-size: 14px;
  margin: 0 2px 0 2px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.file-item:hover {
  background-color: var(--ath-latestfilebar-item-hover);
  cursor: pointer;
}
.file-item:active {
  background-color: var(--ath-latestfilebar-item-active);
  cursor: pointer;
}
.active {
  background-color: var(--ath-latestfilebar-item-active);
}
.clear-btn {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: 12px;
  top: 6px;
  cursor: pointer;
  border-radius: 6px;
  background-color: var(--ath-latestfilebar-item-background);
}
.clear-btn::before {
  content: "";
  position: absolute;
  left: -6px;
  width: 2px;
  height: calc(100% - 4px);
  top: 2px;
  background-color: var(--ath-divider-color)
}
.clear-btn:hover {
  background-color: var(--ath-btn-hover);
}
.clear-btn:active {
  background-color: var(--ath-btn-active);
}
::-webkit-scrollbar {
  color: transparent;
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-thumb {
  background: var(--ath-thumb-color);
  opacity: 0.2;
  border-radius: 10px;
  height: 6px;
  margin-top: 10px;
}
</style>
