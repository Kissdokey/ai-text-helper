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
  const items = [];
  for (const item in editorContent.fileInfo) {
    const newItem = Object.assign({ id: item }, editorContent.fileInfo[item]);
    items.push(newItem);
  }
  return items;
});
const autoScroll = (index) => {
  const selectFileDomInfo = scrollRef.value?.children[index]?.getBoundingClientRect();
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
eventBus.on("file-bar-auto-scroll", () => autoScroll(fileItems.value.length - 1));
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
  background-color: rgba(13,13,13,0.1);
}
.file-select-bar:hover {
  overflow-x: auto;
}
.file-item {
  display: inline-block;
  padding: 0px 12px;
  min-width: 40px;
  max-width: 200px;
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
