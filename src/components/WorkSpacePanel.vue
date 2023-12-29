<template>
  <div class="workspace-container" @click="clickbg">
    <div class="workspace-header">
      <span>用户空间</span>
      <div class="btn-container">
        <div
          class="new-file-btn"
          @click.stop="createNewFile"
          v-tooltip.bottom="{
            content: '新建文件',
            theme: 'delicate',
          }"
        >
          <v-icon>$IconCreateFile2</v-icon>
        </div>
        <div
          class="new-folder-btn"
          @click.stop="createNewFolder"
          v-tooltip.bottom="{
            content: '新建文件夹',
            theme: 'delicate',
          }"
        >
          <v-icon>$IconCreateFolder</v-icon>
        </div>
        <div
          class="new-folder-btn"
          @click.stop="createNewFolder"
          v-tooltip.bottom="{
            content: '收起',
            theme: 'delicate',
          }"
        >
          <v-icon>$IconCreateFolder</v-icon>
        </div>
      </div>
    </div>
    <div class="workspace"></div>
  </div>
</template>
<script setup>
import { useFileDependenciesStore } from "@/store/fileDependencies.js";
import { useEditorContent } from "@/store/editorContent.js";
import { computed, inject, nextTick, onMounted, ref } from "vue";
const eventBus = inject("eventBus");
const fileDependenciesStore = useFileDependenciesStore();
const editorContent = useEditorContent();
const createNewFolder = () => {
  fileDependenciesStore.createFolder(fileDependenciesStore.currentFolder);
  updateFolder();
};
const createNewFile = () => {
  eventBus.emit("create-new-file");
  nextTick(() => {
    fileDependenciesStore.createFile(
      editorContent.currentFile,
      '未命名文件'
    );
    updateFolder();
  });
};
onMounted(() => {
  updateFolder();
});
function updateFolder() {
  const workSpace = document.createElement("div");
  walkThrought(fileDependenciesStore.fileDependencies, workSpace);
  document.querySelector(".workspace").innerHTML = "";
  document.querySelector(".workspace").appendChild(workSpace);
}
function walkThrought(data, target) {
  let templateDom = document.createElement("div");
  data.forEach((item) => {
    if (item?.sons?.length > 0) {
      const container = document.createElement("div");
      container.classList.add("container");
      const father = document.createElement("div");
      const text = document.createTextNode(item.name);
      const img = document.createElement("span");
      img.classList.add("folder-img");
      father.appendChild(img);
      father.appendChild(text);
      father.classList.add("folder-father");
      if (item.id === fileDependenciesStore.currentFolder) {
        father.classList.add("folder-active");
      }
      father.addEventListener("click", (e) => {
        e.stopPropagation();
        fileDependenciesStore.changeCurrentFolder(item.id);
        document
          .querySelector(".folder-active")
          ?.classList.remove("folder-active");
        e.target.classList?.add("folder-active");
      });
      container.appendChild(father);
      walkThrought(item.sons, container);
      templateDom.appendChild(container);
    } else {
      templateDom.classList.add("list-item");
      const child = document.createElement("div");
      const text = document.createTextNode(item.name);
      if (item?.sons) {
        const img = document.createElement("span");
        img.classList.add("folder-img");
        child.appendChild(img);
      }
      child.appendChild(text);
      child.classList.add("folder");
      child.addEventListener("click", (e) => {
        e.stopPropagation();
        fileDependenciesStore.changeCurrentFolder(item.id);
        document
          .querySelector(".folder-active")
          ?.classList.remove("folder-active");
        e.target.classList?.add("folder-active");
      });
      if (item.id === fileDependenciesStore.currentFolder) {
        child.classList.add("folder-active");
      }
      templateDom.appendChild(child);
    }
  });
  target.appendChild(templateDom);
}
const clickbg = () => {
  document.querySelector(".folder-active")?.classList.remove("folder-active");
  fileDependenciesStore.changeCurrentFolder("");
};
</script>
<style scoped>
.workspace-container {
  max-width: 250px;
  flex: 1;
  border-right: 1px solid rgba(13, 13, 13, 0.1);
}
.workspace {
  user-select: none;
  height: 100%;
  overflow: auto;
}
.workspace-header {
  user-select: none;
  display: flex;
  justify-content: space-between;
  height: 30px;
  font-size: 14px;
  align-items: center;
  padding: 8px;
  border-bottom: 1px solid rgba(13, 13, 13, 0.1);
}
.btn-container {
  display: flex;
  align-items: center;
}
.new-file-btn,
.new-folder-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  cursor: pointer;
}
.new-file-btn:hover,
.new-folder-btn:hover {
  background-color: rgba(13, 13, 13, 0.06);
}
.new-file-btn:active,
.new-folder-btn:active {
  background-color: rgba(13, 13, 13, 0.1);
}
</style>
<style>
.folder {
  display: flex;
  align-items: center;
  font-size: 12px;
  line-height: 16px;
  padding: 4px;
  border-radius: 1px solid black;
  /* background-color: rgba(235, 245, 240, 0.9); */
  margin: 2px;
}
/* .container .list-item:hover, */
.folder:hover,
.folder-father:hover {
  background-color: #fff !important;
}
.container .container {
  margin-left: 12px;
}
.container .folder {
  margin-left: 12px;
}
.container .folder-father {
  display: flex;
  align-items: center;
  font-size: 12px;
  line-height: 16px;
  padding: 4px;
  border-radius: 1px solid black;
  /* background-color: rgba(235, 245, 240, 0.9); */
  margin: 2px;
  margin-left: 0;
}
.folder-active {
  background-color: rgba(235, 245, 255, 0.5) !important;
}
.folder-img {
  display: inline-block;
  width: 16px;
  height: 16px;
  color: black;
  background-image: url("../assets/folder.png");
}
</style>
