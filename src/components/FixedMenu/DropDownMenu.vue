<template>
  <div class="drop-down-menu">
    <div v-show="props.type === 0">
      <div
        class="heading-item"
        v-for="(item, index) in props.data"
        @click="clickHeading(index)"
      >
        <div v-if="headingType() === index">
          <img class="selected-heading" src="../../assets/selected.png" />
        </div>
        {{ item }}
      </div>
    </div>

    <div v-show="props.type === 1">
      <div
        class="heading-item"
        v-for="(item, index) in props.data"
        @click="clickColor(rgb[item], index)"
      >
        <div v-if="ifColorSelectShow(item, index)">
          <img class="selected-heading" src="../../assets/selected.png" />
        </div>
        {{ item }}
      </div>
    </div>
    <div v-show="props.type === 2">
      <div class="heading-item">
        <button
          @click="
            props.editor
              .chain()
              .focus()
              .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
              .run()
          "
        >
          insertTable
        </button>
        <button @click="props.editor.chain().focus().addColumnBefore().run()">
          addColumnBefore
        </button>
        <button @click="props.editor.chain().focus().addColumnAfter().run()">
          addColumnAfter
        </button>
        <button @click="props.editor.chain().focus().deleteColumn().run()">
          deleteColumn
        </button>
        <button @click="props.editor.chain().focus().addRowBefore().run()">
          addRowBefore
        </button>
        <button @click="props.editor.chain().focus().addRowAfter().run()">
          addRowAfter
        </button>
        <button @click="props.editor.chain().focus().deleteRow().run()">
          deleteRow
        </button>
        <button @click="props.editor.chain().focus().deleteTable().run()">
          deleteTable
        </button>
        <button @click="props.editor.chain().focus().mergeCells().run()">
          mergeCells
        </button>
        <button @click="props.editor.chain().focus().splitCell().run()">
          splitCell
        </button>
        <button
          @click="props.editor.chain().focus().toggleHeaderColumn().run()"
        >
          toggleHeaderColumn
        </button>
        <button @click="props.editor.chain().focus().toggleHeaderRow().run()">
          toggleHeaderRow
        </button>
        <button @click="props.editor.chain().focus().toggleHeaderCell().run()">
          toggleHeaderCell
        </button>
        <button @click="props.editor.chain().focus().mergeOrSplit().run()">
          mergeOrSplit
        </button>
        <button
          @click="
            props.editor.chain().focus().setCellAttribute('colspan', 2).run()
          "
        >
          setCellAttribute
        </button>
        <button @click="props.editor.chain().focus().fixTables().run()">
          fixTables
        </button>
        <button @click="props.editor.chain().focus().goToNextCell().run()">
          goToNextCell
        </button>
        <button @click="props.editor.chain().focus().goToPreviousCell().run()">
          goToPreviousCell
        </button>
      </div>
    </div>
    <div v-show="props.type === 3">
      <div
        class="heading-item"
        v-for="(item, index) in props.data"
        @click="clickBgcColor(rgb[item], index)"
      >
        <div v-if="ifBgcColorSelectShow(item, index)">
          <img class="selected-heading" src="../../assets/selected.png" />
        </div>
        {{ item }}
      </div>
      <div
        :class="['heading-item', 'active-bgc']"
        @click="props.editor.chain().focus().unsetHighlight().run()"
      >
        unset
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, watch } from "vue";
import calCurrentAttribute from "../../../util/calCurrentAttribute";
const props = defineProps({ type: Number, data: Array, editor: Object }); //0:heading,1:color,2:bgc
const rgb = {
  black: "#000000",
  red: "#FF0000",
  orange: "#FF7D00",
  yellow: "#FFFF00",
  green: "#00FF00",
  purple: "#FF00FF",
};
const menuItem = [
  
]
function headingType() {
  const heading = calCurrentAttribute(props.editor, "heading");
  if (heading === "正文") {
    return 0;
  } else {
    return parseInt(heading[6]);
  }
}
function clickHeading(index) {
  let curIdx = headingType();
  if (curIdx === index) {
    return;
  }
  if (index === 0) {
    props.editor.chain().focus().toggleHeading({ level: curIdx }).run();
    return;
  }
  props.editor.chain().focus().toggleHeading({ level: index }).run();
}
function clickColor(item) {
  props.editor.chain().focus().setColor(item).run();
}
function clickBgcColor(item) {
  props.editor.chain().focus().toggleHighlight({ color: item }).run();
}
function colorType() {
  return calCurrentAttribute(props.editor, "color");
}
function ifColorSelectShow(item, index) {
  if (index === 0 && !colorType()) {
    return true;
  }
  return colorType() === rgb[item];
}
function ifBgcColorSelectShow(item, index) {
  return props.editor.isActive("highlight", { color: rgb[item] });
}
</script>
<style scoped>
.drop-down-menu {
  position: absolute;
  padding: 12px;
  top: 50px;
  left: 0;
  background-color: white;
  box-shadow: 0 0 0 1px rgba(13, 13, 13, 0.06),
    0px 1px 4px rgba(13, 13, 13, 0.1);
  box-sizing: border-box;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  z-index: 1000;
  user-select: none;
}
.heading-item {
  cursor: pointer;
  position: relative;
  font-size: 14px;
  padding: 5px 24px 5px 32px;
  border-radius: 6px;
  margin-top: 4px;
  line-height: 22px;
  box-sizing: border-box;
  user-select: none;
}
.heading-item:hover {
  background-color: rgb(241, 241, 241);
  user-select: none;
}
.selected-heading {
  width: 12px;
  height: 12px;
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translate(0, -50%);
  user-select: none;
}
.active-bgc {
  background-color: rgb(241, 241, 241);
}
</style>
