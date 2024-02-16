<template>
  <Notification></Notification>
  <BubbleMenu :editor="editor"></BubbleMenu>
  <div class="app-container">
    <AppTitle></AppTitle>
    <div class="editor-wrapper">
      <ToolPanel></ToolPanel>
      <WorkSpacePanel :isHiddenFilePanel="isHiddenFilePanel"></WorkSpacePanel>
      <div class="editor-area">
        <FileSelectBar></FileSelectBar>
        <FixedMenu :isHiddenToolPanel="true"></FixedMenu>
        <div class="editor-container" v-show="editorContent2.currentFile">
          <editor-content :editor="editor" class="editor" id="editorRef" />
          <RightSidePanel></RightSidePanel>
        </div>
        <div class="no-flie-notice" v-show="!editorContent2.currentFile">
          请选择文件或者新建文件
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useFileDependenciesStore } from "@/store/fileDependencies.js";
import _ from "lodash";
import ToolPanel from "@/components/ToolPanel.vue";
import FileSelectBar from "@/components/FileSelectBar.vue";
import RightSidePanel from "@/components/RightSidePanel.vue";
import WorkSpacePanel from "@/components/WorkSpacePanel.vue";
import Notification from "@/components/Notification.vue";
import AppTitle from "./AppTitle.vue";
import FixedMenu from "@/components/FixedMenu.vue";
import BubbleMenu from "@/components/BubbleMenu.vue";
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
import { authentication } from '@/fetch/user.js'
import { useUserStore } from '@/store/user.js'
const editorContent2 = useEditorContent();
const userStore = useUserStore()
const fileDependenciesStore = useFileDependenciesStore();
let operateItemRef = null;
let editorAreaDom = null;
const PARAGRAPHDOM = paragraphTags;

const initialValue = ref(INITHTML);
const fileWithoutNameIndex = ref(1);
const eventBus = inject("eventBus");

const editor = useEditor({
  content: "",
  extensions: extensions,
  autofocus: true,
  editable: true,
  injectCSS: false,
  onUpdate() {
    // if (!editorAreaDom) {
    //   editorAreaDom = document.querySelector(".ProseMirror");
    // }
    // PARAGRAPHDOM.forEach((item) => {
    //   let collectDom = editorAreaDom?.getElementsByTagName(item) || [];
    //   for (let i = 0; i < collectDom.length; i++) {
    //     collectDom[i].onmouseover = mouseOver;
    //     collectDom[i].onmouseout = mouseOut;
    //   }
    // });
    editorContent2.saveContent(editorContent2.currentFile, getHtml());
  },
});

const isHiddenToolPanel = ref(false);
const isHiddenFilePanel = ref(false);
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
    editorContent2.deleteFile(id)
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
onMounted(async () => {
  authentication(userStore.initUserInfo)
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
  border-top: 1px solid rgba(13, 13, 13, 0.1);
  flex: 1;
  display: flex;
  overflow-y: hidden;
}
.ProseMirror {
  width: 740px;
  background-color: #fff;
  line-height: 16px;
  font-size: 12px;
  padding: 12px;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
}
.editor-area {
  position: relative;
  flex: 1;
  padding-top: 50px;
  display: flex;
  flex-direction: column;
}
.editor-container {
  position: relative;
  overflow: auto;
  width: 100%;
  display: flex;
  flex: 1;
}
.editor {
  box-sizing: border-box;
  width: fit-content;
  height: fit-content;
  min-height: 100%;
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
  background-color: red;
  border-radius: 4px;
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
  background-color: greenyellow;
}

blockquote {
  padding-left: 1rem;
  border-left: 3px solid rgba(#0d0d0d, 0.1);
  background-color: pink;
  border-radius: 4px;
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
