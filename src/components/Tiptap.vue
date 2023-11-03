<template>
  <DropDownMenu
    v-show="isMenuShow"
    :type="0"
    :data="getData()"
    :editor="editor"
    >
  </DropDownMenu>
  <FixedMenu :editor="editor" :currentType="currentType"></FixedMenu>
  <BubbleMenu :editor="editor"></BubbleMenu>
  <editor-content :editor="editor" />
</template>

<script setup>
import FixedMenu from "./FixedMenu/FixedMenu.vue";
import BubbleMenu from "./BubbleMenu.vue";
import { useEditor, EditorContent } from "@tiptap/vue-3";
import extensions from "../../util/extensions.js";
import DropDownMenu from "./FixedMenu/DropDownMenu.vue";
import { ref, onMounted } from "vue";
const HEADINGARRAY = ['正文','标题一','标题二','标题三','标题四','标题五']
let isMenuShow = ref(false);
let currentType = ref(-1);
let type = 0;
const TYPENUM = 4;
const editor = useEditor({
  content: "",
  extensions: extensions,
  autofocus: true,
  editable: true,
  injectCSS: false,
});
function dealClick(e) {
  if (e?.target?.classList?.contains("drop-down-press")) {
    for (let i = 0; i < TYPENUM; i++) {
      if (e.target.classList.contains(`type${i}`)) {
        if (currentType.value === i) {
          //关闭
          isMenuShow.value = false;
          currentType.value = -1;
          return;
        }
        currentType.value = i;
        const { top, left, width, height } = e.target.getBoundingClientRect();
        isMenuShow.value = true;
        document
          .querySelector(".drop-down-menu")
          .setAttribute("style", `left:${left}px;top:${top + height + 3}px `);

        console.log(i, currentType.value);
      }
    }
  }
}
function getData() {
  if(currentType.value===0) {
    return HEADINGARRAY
  }
}
onMounted(() => {
  window.addEventListener("click", dealClick);
});
</script>
<style>
.is-active {
  color: red;
  background-color: black;
}

.ProseMirror {
  max-width: 90vw;
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
</style>
