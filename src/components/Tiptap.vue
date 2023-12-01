<template>
  <button @click="getHtml">html</button>
  <button class="yellow-text ml10" @click="$refs.doc.click()">導入文件</button>
  <input ref="doc" accept=".docx" style="position:absolute;left:9px;z-index: -999;" type="file" @change="getWordFile">
  <FixedMenu
    :editor="editor"
    :currentType="currentType"
    @onDropDownMenu="onDropDownMenu"
  ></FixedMenu>
  <BubbleMenu :editor="editor"></BubbleMenu>
  <editor-content :editor="editor"  />
</template>

<script setup>
import FixedMenu from "@/components/FixedMenu.vue";
import BubbleMenu from "@/components/BubbleMenu.vue";
import { useEditor, EditorContent } from "@tiptap/vue-3";
import extensions from "@/util/extensions.js";
import { ref, onMounted, onUpdated } from "vue";
import mammoth from "mammoth";
const HEADINGARRAY = ["正文", "标题一", "标题二", "标题三", "标题四", "标题五"];
const COLORARRAY = ["black", "red", "orange", "yellow", "green", "purple"];
let currentType = ref(-1);
let type = ref(0);
const editor = useEditor({
  content: "",
  extensions: extensions,
  autofocus: true,
  editable: true,
  injectCSS: false,
  onUpdate({ editor }) {
  },
});
function onDropDownMenu(index) {
  type.value = index;
  if(currentType.value === index) {
    currentType.value = -1
    return 
  }
  currentType.value = index
}
function getHtml() {
  const html = editor.value.getHTML()
  console.log(html)
}
function getWordFile(e) {
  if (e.target.files.length == 0) return
  const file = e.target.files[0]
  let reader = new FileReader()
  reader.readAsArrayBuffer(file)
  reader.onload = (evt) => {
    let arrayBuffer = evt.target.result
    mammoth
      .convertToHtml({arrayBuffer: arrayBuffer})
      .then(res => {
        console.log(res.value)
        editor.value.commands.setContent(res.value)
         //res.value 就是生成的HTML文件，可以直接赋值给富文本编辑器
      })
      .done()
  }
}
function dealClick(e) {
  if (e?.target?.classList?.contains("drop-down-press")) {
   return
  }
  else {
    currentType.value = -1;
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
// h1,h2,h3,h4,h5,h6,p {
//   position: relative;


// }
// h1:hover::before,h2:hover::before,h3:hover::before,h4:hover::before,h5:hover::before,h6:hover::before,p:hover::before {
//   content: '';
//   width: 30px;
//   height: 30px;
//   background-color: red;
//   position: absolute;
//   left:-30px;
//   z-index: 1000;
//   cursor: pointer;
// }
</style>
