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
    v-show="isOpen"
    @click="clickbg"
    v-workspace-right-click
  >
    <WorkSpaceContextMenu></WorkSpaceContextMenu>
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
          <v-icon color="red">$IconCreateFile2</v-icon>
        </div>
        <div
          class="new-folder-btn"
          @click.stop="createNewFolderWithoutName"
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
import WorkSpaceContextMenu from "@/components/WorkSpaceContextMenu.vue";
import { useCustomerSetting } from '@/store/customerSetting.js'
const customerSetting = useCustomerSetting()
const props = defineProps({ isHiddenFilePanel: Boolean });
const eventBus = inject("eventBus");
const isOpen = ref(customerSetting.ifWorkspaceOpen);
const workspaceRef = ref(null);
const isFolderActive = ref(false);
const fileDependenciesStore = useFileDependenciesStore();
const editorContent = useEditorContent();
const createNewFolder = (name) => {
  fileDependenciesStore.createFolder(fileDependenciesStore.currentFolder, name);
  isFolderActive.value = true;
  updateFolder();
};
const createNewFolderWithoutName = () => {
  eventBus.emit("create-new-item", "folder");
};
const createNewFile = () => {
  eventBus.emit("create-new-item", "file");
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
  customerSetting.updateWorkspacePosition({x:e.pageX - mouseOffset.left,y:e.pageY - mouseOffset.top})
}, 500);

onMounted(() => {
  updateFolder();
  eventBus.on("update-folder", updateFolder);
  eventBus.on("create-new-file", () => (isFolderActive.value = false));
  eventBus.on("change-file", () => (isFolderActive.value = false));
  eventBus.on("create-new-folder", (name) => createNewFolder(name));
  eventBus.on("change-workSpace", () => {
    isOpen.value = !isOpen.value;
    customerSetting.updateFfWorkspaceOpen(isOpen.value)
  });
  workspaceRef.value.style.left = customerSetting.workspacePosition.x + 'px'
  workspaceRef.value.style.top = customerSetting.workspacePosition.y + 'px'
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
      father.setAttribute("id", item.id);
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
        if (
          item.id === fileDependenciesStore.currentFolder &&
          isFolderActive.value
        ) {
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
          eventBus.emit("change-file", item.id);
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
      child.setAttribute("id", item.id);
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
  padding: 4px;
  /* position: relative; */
  width: 200px;
  min-width: 150px;
  background: var(--ath-workspace-background);
  color:var(--ath-workspace-text-color);
  border-right: 1px solid var(--ath-divider-color);
}

.workspace-container-absolute {
  position: absolute;
  top: 10px;
  left: 100px;
  background-color: var(--ath-workspace-absolute-background);
  z-index: 99;
  border-radius: 12px;
  border: 1px solid  var(--ath-divider-color);
}
.workspace-container-absolute .workspace {
  padding-top: 4px;
  max-height: 500px;
  overflow:auto;
}
.workspace-container .workspace {
  padding: 4px;
  user-select: none;
  height: calc(100% - 30px);
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
  border-bottom: 1px solid var(--ath-divider-color);
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
  background-color: var(--ath-btn-hover);
}

.new-file-btn:active,
.new-folder-btn:active {
  background-color: var(--ath-btn-active);
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
  border-radius: 4px;
}

/* .container .list-item:hover, */
.folder:hover,
.folder-father:hover {
  background-color: var(--ath-workspace-item-hover) !important;
}
.folder:active,
.folder-father:active {
  background-color: var(--ath-workspace-item-active) !important;
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
  border-radius: 4px;
  /* background-color: rgba(235, 245, 240, 0.9); */
  margin: 2px;
  margin-left: 0;
}

.folder-active {
  background-color: var(--ath-workspace-item-active) !important;
}

.folder-img {
  display: inline-block;
  width: 16px;
  height: 16px;
  background-image: var(--ath-workspace-folder-url);
}
</style>
