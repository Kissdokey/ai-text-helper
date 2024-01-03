<template>
  <div class="dialog-container" v-if="isDialogShow">
    <div class="save-name-dialog">
      <el-input v-model="inputName" placeholder="请输入文件名"></el-input>
      <div class="btn-wrapper">
        <v-btn
          class="v-btn"
          :disabled="isConfirmBtnEnable"
          @click="confirmBtnClick"
          >确认</v-btn
        >
        <v-btn class="v-btn" @click="cancelBtnClick">取消</v-btn>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ElNotification } from "element-plus";
import { inject, h, ref, computed, nextTick } from "vue";
import { useEditorContent } from "@/store/editorContent";
const editorContent = useEditorContent();
const eventBus = inject("eventBus");
const editor = inject("editor");
const isDialogShow = ref(false);
const inputName = ref("");
const currentType = ref('file')
const isConfirmBtnEnable = computed(() => {
  return !inputName.value.trim();
});
const confirmBtnClick = () => {
  // editorContent.changeCurrentName(inputName.value);
  isDialogShow.value = false;
  if(currentType.value === 'file') {
    eventBus.emit('create-new-file',inputName.value)
    ElNotification({
      title: "成功",
      message: `成功创建文件${inputName.value}`,
      type: "success",
    });
    inputName.value = ''
  }else {
    eventBus.emit('create-new-folder',inputName.value)
    ElNotification({
      title: "成功",
      message: `成功创建文件夹${inputName.value}`,
      type: "success",
    });
    inputName.value = ''
  }
};
const cancelBtnClick = () => {
  isDialogShow.value = false;
};
function saveFile() {
  try {
    editorContent.saveContent(
      editorContent.currentFile,
      editor.value.getHTML()
    );
    ElNotification({
      title: "成功",
      message: "成功保存文件",
      type: "success",
    });
  } catch (error) {
    ElNotification({
      title: "失败",
      message: `保存文件失败：${error}`,
      type: "error",
    });
  }
}
eventBus.on("ctrl-s", () => {
  // if (!editorContent.currentName) {
  //   isDialogShow.value = true;
  // } else {
    saveFile();
  // }
});
eventBus.on("create-new-item",(type)=> {
  currentType.value = type
  isDialogShow.value = true
})
</script>
<style>
.dialog-container {
  user-select: none;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  background-color: rgba(13, 13, 13, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}
.save-name-dialog {
  background-color: #fff;
  padding: 24px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  flex-direction: column;
}
.btn-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 18px;
  margin-top: 12px;
}
.v-btn {
  height: 24px !important;
}
</style>
