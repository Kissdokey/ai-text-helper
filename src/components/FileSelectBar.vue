<template>
  <div class="file-select-bar" ref="scrollRef">
    <span
      :class="[
        'file-item',
        item.id === editorContent.currentFile ? 'active' : '',
      ]"
      v-for="(item, index) in fileItems"
      :key="item.id"
      @click="() => fileClick(item, index)"
    >
      {{ item.name }}
      <div
        class="icon-close-container"
        @click.stop="() => fileClose(item, index)"
      >
        <v-icon size="16">$IconClose</v-icon>
      </div>
    </span>
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
const fileClose = async (item, index) => {
  editorContent.spliceOpenedFile(index);
  if (item.id !== editorContent.currentFile) {
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
  const selectFileDomInfo =
    scrollRef.value?.children[index]?.getBoundingClientRect();
  const scrollRefInfo = scrollRef.value?.getBoundingClientRect();
  scrollRef.value.scrollTo({
    left:
      selectFileDomInfo.left -
      scrollRefInfo.left +
      scrollRef.value.scrollLeft -
      scrollRefInfo.width / 2 +
      selectFileDomInfo.width / 2,
    behavior: "smooth",
  });
};
const fileClick = async (item, index) => {
  await eventBus.emit("change-file", item.id);
  autoScroll(index);
};
eventBus.on("file-bar-auto-scroll", () =>
  autoScroll(fileItems.value.length - 1)
);
eventBus.on("history-file-open", (file) => {
  let index = fileItems.value.findIndex((item) => item.id === file.id);
  //没有的话，推入队列
  if (index < 0) {
    editorContent.appendOpenedFile(file.id, {
      name: file.name,
      content: file.content,
    });
    index = fileItems.value.length - 1;
  }
  fileClick(file, index);
});
</script>

<style scoped>
.file-select-bar {
  user-select: none;
  white-space: nowrap;
  width: 100%;
  height: 42px;
  padding: 6px;
  overflow-x: hidden;
  overflow-y: hidden;
  background-color: rgba(13, 13, 13, 0.1);
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
  background-color: rgba(13, 13, 13, 0.06);
}
.icon-close-container:active {
  background-color: rgba(13, 13, 13, 0.1);
}
.file-item {
  position: relative;
  display: inline-block;
  padding: 0px 44px 0 12px;
  min-width: 40px;
  max-width: 300px;
  background-color: #fff;
  line-height: 30px;
  font-size: 14px;
  margin: 0 2px 0 2px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.file-item:hover {
  background-color: rgba(13, 13, 13, 0.1);
  cursor: pointer;
}
.active {
  background-color: rgba(13, 13, 13, 0.2);
}
::-webkit-scrollbar {
  color: transparent;
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-thumb {
  background: rgba(13, 13, 13, 0.2);
  opacity: 0.2;
  border-radius: 10px;
  height: 6px;
  margin-top: 10px;
}
</style>
