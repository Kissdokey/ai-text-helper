<template>
  <div
    :class="[
      'workspace-container',
      isHiddenFilePanel ? 'workspace-container-absolute' : '',
    ]"
    :draggable="isHiddenFilePanel"
    ref="workspaceRef"
    @dragstart="workSpaceDragUp"
    @dragend="workSpaceDragDown"
    v-show="!isClose"
    @click="clickbg"
    v-workspace-right-click
  >
  <ContextMenu ></ContextMenu>
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
      </div>
    </div>
    <div class="workspace"></div>
  </div>
</template>
<script setup>
import _ from "lodash";
import { useFileDependenciesStore } from "@/store/fileDependencies.js";
import { useEditorContent } from "@/store/editorContent.js";
import { computed, inject, nextTick, onMounted, ref } from "vue";
import ContextMenu from '@/components/ContextMenu.vue'
const props = defineProps({ isHiddenFilePanel: Boolean });
const eventBus = inject("eventBus");
const isClose = ref(false);
const workspaceRef = ref(null);
const isFolderActive = ref(false);
const fileDependenciesStore = useFileDependenciesStore();
const editorContent = useEditorContent();
const createNewFolder = () => {
  fileDependenciesStore.createFolder(fileDependenciesStore.currentFolder);
  isFolderActive.value = true;
  updateFolder();
};
const createNewFile = () => {
  eventBus.emit("create-new-file");
};
// eventBus.on('workspace-setting',()=> isContextShow.value = true)
const mouseOffset = { left: 0, top: 0 };
const workSpaceDragUp = _.throttle((e) => {
  const info = workspaceRef.value.getBoundingClientRect();
  mouseOffset.left = e.pageX - info.left;
  mouseOffset.top = e.pageY - info.top;
}, 500);
const workSpaceDragDown = _.throttle((e) => {
  workspaceRef.value.style.left = e.pageX - mouseOffset.left + "px";
  workspaceRef.value.style.top = e.pageY - mouseOffset.top + "px";
}, 500);
eventBus.on("change-workSpace", () => {
  isClose.value = !isClose.value;
});
onMounted(() => {
  updateFolder();
  eventBus.on("update-folder", updateFolder);
  eventBus.on("create-new-file", () => (isFolderActive.value = false));
  eventBus.on("change-file", () => (isFolderActive.value = false));
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
      father.setAttribute('id',item.id)
      if (
        item.id === fileDependenciesStore.currentFolder &&
        isFolderActive.value
      ) {
        document
          .querySelector("folder-active")
          ?.classList?.remove("folder-active");
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
        if (item.id === fileDependenciesStore.currentFolder && isFolderActive.value) {
          document
            .querySelector("folder-active")
            ?.classList?.remove("folder-active");
          child.classList.add("folder-active");
        }
        const img = document.createElement("span");
        img.classList.add("folder-img");
        child.appendChild(img);
        child.addEventListener("click", (e) => {
          e.stopPropagation();
          fileDependenciesStore.changeCurrentFolder(item.id);
          document
            .querySelector(".folder-active")
            ?.classList.remove("folder-active");
          e.target.classList?.add("folder-active");
        });
      } else {
        child.addEventListener("click", (e) => {
          //转为选中状态，切换文件，将当前活跃folder置为当前文件父亲,这里类名和folder一样了，懒得改了，
          e.stopPropagation();
          document
            .querySelector(".folder-active")
            ?.classList.remove("folder-active");
          e.target.classList?.add("folder-active");
          fileDependenciesStore.changeCurrentFolder(item?.parentId);
          eventBus.emit("history-file-open", item);
        });
        if (item.id === editorContent.currentFile && !isFolderActive.value) {
          document
            .querySelector("folder-active")
            ?.classList?.remove("folder-active");
          child.classList.add("folder-active");
        }

      }
      child.appendChild(text);
      child.classList.add("folder");
      child.setAttribute('id',item.id)
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
  /* position: relative; */
  max-width: 250px;
  flex: 1;
  border-right: 1px solid rgba(13, 13, 13, 0.1);
}

.workspace-container-absolute {
  position: absolute;
  top: 10px;
  left: 100px;
  background-color: rgb(248, 235, 235);
  max-height: 500px;
  overflow: auto;
  z-index: 99;
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

/* .container-close {
  animation-name: custom-scale;
  animation-duration: 3s;
  animation-fill-mode: forwards;
} */

/* @keyframes custom-scale {
  0% {
    width: 100%;
  }
  50% {
   width: 50%;
  }
  100% {
   width: 0;
  }
}
@keyframes widthShorten {
  from {
    width: 100%;
  }
  to {
    width: 0;
  }
} */
</style>
<style>
.folder {
  height: 24px;
  display: flex;
  align-items: center;
  font-size: 12px;
  line-height: 16px;
  padding: 4px;
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
  height: 24px;
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
