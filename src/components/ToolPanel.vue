<template>
  <div class="tool-panel">
    <HistoryPanel
      activator="#history-menu-btn"
      location="bottom"
      offset="8px"
    ></HistoryPanel>
    <SaveMenu activator="#save-as-menu-btn" location="bottom" offset="8px">
    </SaveMenu>

    <div class="tool-panel-container">
      <div
      class="tool-item"
        v-tooltip.bottom="{
          content: isOpen ? '收起工作区' : '展开工作区',
          theme: 'delicate',
        }"
        @click.stop="changeWorkSpace"
      >
        <v-icon>{{
          isOpen ? "$IconCloseWorkSpace" : "$IconOpenWorkSpace"
        }}</v-icon>
      </div>
      <input
        ref="doc"
        accept=".docx,.txt,.md"
        style="position: absolute; left: 9px; z-index: -999"
        type="file"
        @change="getWordFile"
      />
      <div
        v-for="(item, index) in navTools"
        :key="index"
        class="tool-item"
        @click.stop="item.action"
        :id="item?.id"
        v-tooltip.bottom="{
          content: item.toolTip,
          theme: 'delicate',
        }"
      >
        <v-icon>{{ item.icon }}</v-icon>
      </div>
    </div>
    <div class="tool-panel-footer">
      <UserAvatar />
    </div>
  </div>
</template>
<script setup>
import HistoryPanel from "@/components/HistoryPanel.vue";
import SaveMenu from "@/components/SaveMenu.vue";
import UserAvatar from "@/components/UserAvatar.vue";
import { inject, ref } from "vue";
const eventBus = inject("eventBus");
const doc = ref(null);
const getWordFile = (e) => {
  eventBus.emit("get-word-file", e);
};
const createNewFile = () => {
  eventBus.emit("create-new-file");
};
const isOpen = ref(true);
const changeWorkSpace = () => {
  eventBus.emit("change-workSpace");
  isOpen.value = !isOpen.value;
};
const navTools = [
  {
    icon: "$IconImport",
    toolTip: "导入文件",
    action: () => doc.value.click(),
  },
  {
    icon: "$IconCreateFile",
    toolTip: "新建文件",
    action: () => createNewFile(),
  },
  {
    icon: "$IconHistory",
    toolTip: "历史记录",
    action: () => {},
    id: "history-menu-btn",
  },
  {
    icon: "$IconSaveAs",
    toolTip: "另存为",
    action: () => {},
    id: "save-as-menu-btn",
  },
];
</script>
<style scoped>
.tool-panel {
  width: 50px;
  border-right: 1px solid rgba(13, 13, 13, 0.1);
}
.tool-panel-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  padding: 12px;

  height: fit-content;
}
.tool-item {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 8px;
  cursor: pointer;
}
.tool-item:hover {
  background-color: rgba(13, 13, 13, 0.2);
}
.tool-item:active {
  background-color: rgba(13, 13, 13, 0.3);
}
</style>
