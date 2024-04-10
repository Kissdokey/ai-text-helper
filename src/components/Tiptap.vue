<template>
  <Notification></Notification>
  <BubbleMenu :editor="editor"></BubbleMenu>
  <CloseAiWindowDialog></CloseAiWindowDialog>
  <div class="app-container">
    <AppTitle></AppTitle>
    <div class="editor-wrapper">
      <ToolPanel v-show="!isChatModel"></ToolPanel>
      <WorkSpacePanel
        v-show="!isChatModel"
        :isHiddenFilePanel="isHiddenFilePanel"
      ></WorkSpacePanel>
      <ChatSessionPanel v-show="isChatModel"></ChatSessionPanel>
      <div class="editor-area">
        <FileSelectBar v-show="!isChatModel"></FileSelectBar>
        <FixedMenu v-show="!isChatModel" :isHiddenToolPanel="true"></FixedMenu>
        <div class="preview-setting-btn" @click="handlePreviewBtnClick">
          <v-icon v-show="isPreview">$IconPreviewOff</v-icon>
          <v-icon v-show="!isPreview">$IconPreviewOn</v-icon>
        </div>
        <div class="editor-container" v-show="editorContent2.currentFile">
          <AiWindow></AiWindow>
          <editor-content
            v-show="true"
            :editor="editor"
            class="editor"
            id="editorRef"
            spellcheck="false"
          />
          <RightSidePanel v-show="isPreview"></RightSidePanel>
        </div>
        <div class="no-flie-notice" v-show="!editorContent2.currentFile">
          请选择文件或者新建文件
        </div>
      </div>
      <ChatPanel v-show="isChatModel"></ChatPanel>
    </div>
  </div>
</template>

<script setup>
import { useFileDependenciesStore } from "@/store/fileDependencies.js";
import _ from "lodash";
import "highlight.js/styles/github.css";
import ToolPanel from "@/components/ToolPanel.vue";
import FileSelectBar from "@/components/FileSelectBar.vue";
import RightSidePanel from "@/components/RightSidePanel.vue";
import WorkSpacePanel from "@/components/WorkSpacePanel.vue";
import ChatPanel from "@/components/ChatPanel.vue";
import ChatSessionPanel from "@/components/ChatSessionPanel.vue";
import Notification from "@/components/Notification.vue";
import AppTitle from "./AppTitle.vue";
import CloseAiWindowDialog from "./CloseAiWindowDialog.vue";
import FixedMenu from "@/components/FixedMenu.vue";
import BubbleMenu from "@/components/BubbleMenu.vue";
import AiWindow from "./AiWindow.vue";
import { useEditor, EditorContent } from "@tiptap/vue-3";
import extensions from "@/util/extensions.js";
import { saveDocx } from "@/util/html2docx.js";
import { exportAsImg } from "@/util/html2canvas.ts";
import { exportAsPdf } from "@/util/html2pdf.ts";
import { html2md } from "@/util/html2md.js";
import { marked } from "marked";
import {
  ref,
  onMounted,
  onUpdated,
  onUnmounted,
  provide,
  inject,
  nextTick,
} from "vue";
import mammoth from "mammoth";
import { colorItems, INITHTML, paragraphTags } from "@/util/constantData.js";
import { useEditorContent } from "@/store/editorContent";
import { authentication, updateUserFile } from "@/fetch/user.js";
import { createFile, updateFile } from "@/fetch/file.js";
import { useUserStore } from "@/store/user.js";
import hljs from "highlight.js";
const editorContent2 = useEditorContent();
const userStore = useUserStore();
const fileDependenciesStore = useFileDependenciesStore();
let operateItemRef = null;
let editorAreaDom = null;
const PARAGRAPHDOM = paragraphTags;
const isChatModel = ref(false);
const initialValue = ref(INITHTML);
const fileWithoutNameIndex = ref(1);
const editorAreaPaddingTop = ref(43);
const eventBus = inject("eventBus");

const editor = useEditor({
  content: "",
  extensions: extensions,
  autofocus: true,
  editable: true,
  injectCSS: true,
  onUpdate() {
    updatePreviewPanel();
    editorContent2.saveContent(editorContent2.currentFile, getHtml());
  },
});

const isHiddenToolPanel = ref(false);
const isHiddenFilePanel = ref(false);
const isPreview = ref(false);
provide("editor", editor);

function getdefaultName() {
  return `未命名文档(${fileWithoutNameIndex.value++})`;
}
function initFile() {
  if (!editorContent2.currentFile) {
    return;
  }
  onChangeFile(editorContent2.currentFile);
}
function handlePreviewBtnClick() {
  isPreview.value = !isPreview.value;
}
function createNewFile(fileName) {
  editorContent2.initFile();
  let name = fileName || getdefaultName();
  editorContent2.createFile(name, initialValue.value);
  editor.value.commands.setContent(initialValue.value);
  let updateFunc = editor.value.callbacks.update[0];
  updateFunc();
  //完成更新之后将执行自动scroll
  nextTick(() => {
    eventBus.emit("file-bar-auto-scroll");
    fileDependenciesStore.createFile(editorContent2.currentFile, name);
    updateUserFile({ fileId: editorContent2.currentFile, isDelete: false });
    createFile(getFileInfo());
    eventBus.emit("update-folder");
  });
}
function onChangeFile(id) {
  //修改当前活跃文件id，读取内容并修改
  id && editorContent2.changeFile(id);
  editor.value.commands.setContent(
    editorContent2.fileInfo[editorContent2.currentFile].content
  );
  let updateFunc = editor.value.callbacks.update[0];
  updateFunc();
  //工作区workspace的选中
  eventBus.emit("update-folder");
  //在数据更新好打开文件列表选中和滚动
  nextTick(() => {
    //找到当前id的index
    let index = editorContent2.openedFiles.findIndex((item) => item === id);
    //没有的话，推入已打开文件队列
    if (index < 0) {
      editorContent2.appendOpenedFile(id);
      index = editorContent2.openedFiles.length - 1;
    }
    eventBus.emit("file-bar-auto-scroll", index);
  });
}
function onDeleteFile(id) {
  editorContent2.deleteFile(id);
  updateUserFile({ fileId: id, isDelete: true });
}
function getFileInfo() {
  const info = {
    fileId: editorContent2.currentFile,
    fileName: editorContent2.fileInfo[editorContent2.currentFile]?.name,
    author: userStore.username,
    content: JSON.stringify(getHtml()),
    comments: "",
    lastModifiedTime: `${Date.now()}`,
    createTime: `${
      editorContent2.fileInfo[editorContent2.currentFile]?.createTime
    }`,
    permissions:
      editorContent2.fileInfo[editorContent2.currentFile]?.permissions,
  };
  return info;
}
function saveAsDocx() {
  saveDocx(getHtml());
}
function saveAsImg() {
  exportAsImg(document.querySelector("#editorRef"), "未命名图片", true);
}
function saveAsPdf() {
  exportAsPdf(document.querySelector("#editorRef"), "未命名pdf");
}
function saveAsMd() {
  html2md(getHtml());
}
function saveInCloud() {
  if (!editorContent2.currentFile) {
    eventBus.emit("save-in-cloud-error", "当前未选中文件，无法上传云端");
    return;
  }
  updateFile(getFileInfo());
}
function getHtml() {
  const html = editor.value.getHTML();
  return html;
}
function getWordFile(e) {
  if (e.target.files.length == 0) return;
  const file = e.target.files[0];
  let reader = new FileReader();
  if (file.name.endsWith(".docx")) {
    reader.readAsArrayBuffer(file);
    reader.onload = (evt) => {
      let arrayBuffer = evt.target.result;
      mammoth
        .convertToHtml({ arrayBuffer: arrayBuffer })
        .then((res) => {
          editor.value.commands.setContent(res.value);
          let updateFunc = editor.value.callbacks.update[0];
          updateFunc();
          //res.value 就是生成的HTML文件，可以直接赋值给富文本编辑器
        })
        .done();
    };
    return;
  }
  if (file.name.endsWith(".txt")) {
    reader.readAsText(file);
    reader.onload = (evt) => {
      let text = evt.target.result;
      editor.value.commands.setContent(
        text
          .split("\n")
          .map((s) => "<p>" + s + "</p>")
          .join(" ")
      );
      let updateFunc = editor.value.callbacks.update[0];
      updateFunc();
    };
    return;
  }
  if (file.name.endsWith(".md")) {
    reader.readAsText(file);
    reader.onload = (evt) => {
      let text = evt.target.result;
      editor.value.commands.setContent(marked(text));
      let updateFunc = editor.value.callbacks.update[0];
      updateFunc();
    };
    return;
  }
  console.log("文件类型暂不支持");
}

function onChangeColor(index) {
  editor.value.commands.setColor(colorItems[index].rgb);
}
function onChangeHighLightColor(index) {
  editor.value.commands.toggleHighlight({ color: colorItems[index].rgb });
}
function simpleButtonClick(type) {
  if (type === "bold") {
    editor.value.chain().focus().toggleBold().run();
  }
  if (type === "italic") {
    editor.value.chain().focus().toggleItalic().run();
  }
  if (type === "strike") {
    editor.value.chain().focus().toggleStrike().run();
  }
  if (type === "code") {
    editor.value.chain().focus().toggleCode().run();
  }
  if (type === "underline") {
    editor.value.chain().focus().toggleUnderline().run();
  }
  if (type.textAlign === "left") {
    editor.value.chain().focus().setTextAlign("left").run();
  }
  if (type.textAlign === "center") {
    editor.value.chain().focus().setTextAlign("center").run();
  }
  if (type.textAlign === "right") {
    editor.value.chain().focus().setTextAlign("right").run();
  }
  if (type === "blockquote") {
    editor.value.chain().focus().toggleBlockquote().run();
  }
  if (type === "codeBlock") {
    editor.value.chain().focus().toggleCodeBlock().run();
  }
}
// function mouseOver(e) {
//   operateItemRef.style.left = e.relatedTarget.offsetLeft + 'px';
//   operateItemRef.style.top = e.relatedTarget.offsetTop + 'px';
//   console.log(e.fromElement.offsetTop)
// }
// function mouseOut(e) {
//   console.log(e)
// }
const autoResize = _.throttle(() => {
  if (window.innerWidth >= 988) {
    isHiddenFilePanel.value = false;
    isHiddenToolPanel.value = false;
    return;
  }
  if (window.innerWidth < 988 && window.innerWidth >= 800) {
    isHiddenFilePanel.value = true;
    isHiddenToolPanel.value = false;
    return;
  }
  if (window.innerWidth < 800) {
    isHiddenFilePanel.value = true;
    isHiddenToolPanel.value = true;
    return;
  }
}, 100);
const updatePreviewPanel = () => {
  const html = getHtml();
  console.log(html);
  var tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;
  var codeTags = tempDiv.getElementsByTagName("code");
  console.log(codeTags);
  for (var i = 0; i < codeTags.length; i++) {
    var codeTag = codeTags[i];

    // 创建一个子元素div
    var childHtml = codeTag.innerHTML;
    const highlightedCode = hljs.highlight(childHtml, {
      language: "javascript",
    }).value;
    codeTag.innerHTML = highlightedCode;
    console.log(highlightedCode);
  }
  console.log(tempDiv.innerHTML);
  document.querySelector(".preview-panel").innerHTML = tempDiv.innerHTML;
};
const changeAiChatModel = () => {
  isChatModel.value = !isChatModel.value;
  nextTick(() => {
    let fixedMenu = document.querySelector("#fixedMenu");
    console.log(fixedMenu.offsetHeight);
    editorAreaPaddingTop.value = fixedMenu ? fixedMenu?.offsetHeight : 43;
  });
  document.querySelector('.tiptap').contentEditable  = `${!isChatModel.value}`;
};
onMounted(async () => {
  authentication(userStore.initUserInfo);
  await editorContent2.init();
  initFile();
  autoResize();
  operateItemRef = document.querySelector(".operate-item");
  eventBus.on("change-file", onChangeFile);
  eventBus.on("delete-file", onDeleteFile);
  eventBus.on("color-index", (index) => onChangeColor(index));
  eventBus.on("highLight-index", (index) => onChangeHighLightColor(index));
  eventBus.on("simple-button-click", (type) => simpleButtonClick(type));
  eventBus.on("get-html", getHtml);
  eventBus.on("get-word-file", getWordFile);
  eventBus.on("create-new-file", createNewFile);
  eventBus.on("save-as-docx", saveAsDocx);
  eventBus.on("save-as-img", saveAsImg);
  eventBus.on("save-as-pdf", saveAsPdf);
  eventBus.on("save-as-md", saveAsMd);
  eventBus.on("save-in-cloud", () => {
    saveInCloud();
  });
  eventBus.on("change-ai-chat-model", changeAiChatModel);
  window.addEventListener("resize", autoResize);
});
onUnmounted(() => {
  editor.destroy();
  window.removeEventListener("resize", autoResize);
});
</script>
<style>
.app-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.editor-wrapper {
  width: 100%;
  border-top: 1px solid var(--ath-divider-color);
  flex: 1;
  display: flex;
  overflow-y: hidden;
}
.ProseMirror,
.preview-panel {
  width: 100%;
  border-radius: 8px;
  background-color: var(--ath-editorcontainer-editor-background);
  line-height: 16px;
  font-size: 12px;
  padding: 12px;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
}
.preview-panel {
  user-select: none;
  pointer-events: none;
  max-width: 692px;
  margin: 24px 24px 24px 24px;
  min-height: 85vh;
}
.editor-area {
  position: relative;
  flex: 1;
  padding-top: calc(v-bind(editorAreaPaddingTop) * 1px);
  display: flex;
  flex-direction: column;
}
.editor-container {
  background: var(--ath-editorcontainer-background);
  color: var(--ath-editorcontainer-text-color);
  position: relative;
  overflow: auto;
  width: 100%;
  display: flex;
  flex: 1;
}
.preview-setting-btn {
  position: absolute;
  top: 80px;
  left: -4px;
  z-index: 999;
  cursor: pointer;
}
.editor {
  box-sizing: border-box;
  width: fit-content;
  height: fit-content;
  min-height: 100%;
  width: 100%;
  max-width: 740px;
  display: flex;
  padding: 24px 24px 24px 24px;
}
.is-active {
  color: red;
  background-color: black;
}

.ProseMirror {
  max-width: 90vw;
}
.no-flie-notice {
  text-align: center;
  margin: auto;
  user-select: none;
}
.ProseMirror:focus-visible {
  outline: none;
}

.code-style {
  position: relative;
  display: inline;
  border: 1px solid var(--ath-code-color);
  border-radius: 4px;
  background-color: var(--ath-code-color);
  margin: 12px 0;
}

.height-line-style {
  border-radius: 10px;
}

.under-line-style {
}

.tiptap p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: #adb5bd;
  pointer-events: none;
  height: 0;
}

.code-block-style {
  background-color: var(--ath-code-block-color);
  border-radius: 8px;
  padding: 12px;
  margin: 12px 0;
}

blockquote {
  position: relative;
  margin-left: 25px;
  background-color: var(--ath-code-block-color);
  border-radius: 8px;
  margin: 12px 0 12px 25px;
  padding: 12px;
}
blockquote::after {
  content: "";
  position: absolute;
  left: -20px;
  top: 6px;
  width: 2px;
  height: calc(100% - 12px);
  background-color: var(--ath-code-block-color);
}

.bullet-list-style {
}

.image-style {
}

.ProseMirror-selectednode {
  outline: 3px solid #68cef8;
}

.mention {
  border: 1px solid #000;
  border-radius: 0.4rem;
  padding: 0.1rem 0.3rem;
  box-decoration-break: clone;
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
<style lang="scss">
.tiptap {
  table {
    border-collapse: collapse;
    table-layout: fixed;
    width: 100%;
    margin: 0;
    overflow: hidden;

    td,
    th {
      min-width: 1em;
      border: 2px solid #ced4da;
      padding: 3px 5px;
      vertical-align: top;
      box-sizing: border-box;
      position: relative;

      > * {
        margin-bottom: 0;
      }
    }

    th {
      font-weight: bold;
      text-align: left;
      background-color: #f1f3f5;
    }

    .selectedCell:after {
      z-index: 2;
      position: absolute;
      content: "";
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      background: rgba(200, 200, 255, 0.4);
      pointer-events: none;
    }

    .column-resize-handle {
      position: absolute;
      right: -2px;
      top: 0;
      bottom: -2px;
      width: 4px;
      background-color: #adf;
      pointer-events: none;
    }

    p {
      margin: 0;
    }
  }
}

.tableWrapper {
  padding: 1rem 0;
  overflow-x: auto;
}

.resize-cursor {
  cursor: ew-resize;
  cursor: col-resize;
}
.operate-item {
  width: 30px;
  height: 30px;
  position: absolute;
  background-color: red;
  z-index: 99;
}
</style>
