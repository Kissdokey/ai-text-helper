<template>
  <v-menu
    v-model="isMenuShow"
    :activator="`#${WORKSPACEANCHOR}`"
    :close-on-content-click="false"
  >
    <div class="workspace-menu" v-if="!isRename && !isDelete">
      <div class="item" @click="reName">重命名</div>
      <div class="item" @click="deleteItem">删除</div>
    </div>
    <div class="workspace-menu" v-else>
      <div v-if="isRename">
        <input
          class="input"
          v-model="inputValue"
          placeholder="请输入新名字"
          ref="reNameInput"
        />
        <div class="confirm-btn">
          <div class="yes" @click="changeName">确定</div>
          <div class="no" @click="closeMenu">取消</div>
        </div>
      </div>
      <div class="delete-confirm-box" v-else>
        <div class="delete-info">确定要删除吗？</div>
        <div class="confirm-btn">
          <div class="yes" @click="deleteBtnClick">确定</div>
          <div class="no" @click="closeMenu">取消</div>
        </div>
      </div>
    </div>
  </v-menu>
</template>
<script setup>
import { last } from "lodash";
import { inject, nextTick, onMounted, ref, watch } from "vue";
import { useEditorContent } from "@/store/editorContent.js";
import { useFileDependenciesStore } from "@/store/fileDependencies.js";
const fileDependenciesStore = useFileDependenciesStore();
const editorContent = useEditorContent()
const isMenuShow = ref(false);
const eventBus = inject("eventBus");
const WORKSPACEANCHOR = "work-space-anchor";
const lastSelectDom = ref(null);
const reNameInput = ref(null);
const isRename = ref(false);
const isDelete = ref(false);
const currentId = ref('')
const inputValue = ref("");
onMounted(() => {
  eventBus.on("workspace-setting", (e) => updateContextMenu(e));
});
const reName = () => {
  isRename.value = true;
  nextTick(() => {
    reNameInput.value?.focus();
  });
};
const deleteItem = () => {
  isDelete.value = true;
};
const closeMenu = () => {
  isMenuShow.value = false;
};
const changeName = ()=> {
    editorContent.saveName(currentId.value,inputValue.value)
    fileDependenciesStore.saveName(currentId.value,inputValue.value)
    eventBus.emit('update-folder')
    isMenuShow.value = false
    inputValue.value = ''
}
const deleteBtnClick = ()=> {
    editorContent.deleteFile(currentId.value)
    fileDependenciesStore.deleteItem(currentId.value)
    eventBus.emit('update-folder')
    isMenuShow.value = false
}
const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
async function updateContextMenu(event) {
  if (
    event.target.classList.contains("folder") ||
    event.target.classList.contains("folder-father")
  ) {
    console.log(event.target);
    currentId.value = event.target.id
    inputValue.value = event.target.innerText
    updateAnchor({ clientX: event?.clientX, clientY: event?.clientY });
    //菜单关闭有一个关闭动效，不等待动效结束就打开会闪动
    if (isMenuShow.value) {
      isMenuShow.value = false;
      await sleep(100);
    }
    isMenuShow.value = true;
    if (lastSelectDom.value) {
      lastSelectDom.value.style.border = "unset";
    }
    event.target.style.border = "1px solid rgba(13,13,13,0.1)";
    lastSelectDom.value = event.target;
  } else {
    if(lastSelectDom.value)
    lastSelectDom.value.style.border = "unset";
    lastSelectDom.value = null;
  }
}
const updateAnchor = (position) => {
  let anthor = document.querySelector(`#${WORKSPACEANCHOR}`);
  if (!anthor) {
    anthor = document.createElement("div");
    anthor.setAttribute("id", WORKSPACEANCHOR);
    anthor.style.position = "absolute";
    anthor.style.zIndex = 999;
    document?.querySelector("#app")?.appendChild(anthor);
  }
  anthor.style.left = position.clientX + "px";
  anthor.style.top = position.clientY + "px";
  anthor.style.zIndex = 999;
};
watch(isMenuShow, () => {
  if (isMenuShow.value) {
    return;
  }
  isDelete.value = false;
  isRename.value = false;
  if (lastSelectDom.value) lastSelectDom.value.style.border = "unset";
  lastSelectDom.value = null;
});
</script>
<style scoped>
.workspace-menu {
  background-color: #fff;
  border-radius: 12px;
  padding: 12px;
  box-shadow: 1px 2px 3px rgba(12, 12, 12, 0.1);
  user-select: none;
  font-size: 14px;
}
.item {
  cursor: pointer;
  min-width: 70px;
}
.item:hover {
  background-color: rgba(13, 13, 13, 0.06);
}
.item:active {
  background-color: rgba(13, 13, 13, 0.1);
}
.delete-confirm-box {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.confirm-btn {
  margin-top: 12px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.input {
  width: 100px;
}
</style>
