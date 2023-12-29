<template>
  <HeadingLevelMenu
    activator="#heading-level"
    location="bottom"
    offset="6px"
    ref="colorMenu"
  />
  <ColorSelectMenu
  type="color"
    title="Choose Text Color"
    activator="#text-color"
    location="bottom"
    offset="6px"
    ref="colorMenu"
  />
  <ColorSelectMenu
  type="highLight"
    title="Choose HighLight Color"
    activator="#text-background-color"
    location="bottom"
    offset="6px"
    ref="colorMenu"
  />
  <ColorSelectMenu
    :title="title"
    activator="#table-actions"
    location="bottom"
    offset="6px"
    ref="colorMenu"
  />
  <div
    v-if="editor"
    :class="['fixed-menu', isFold ? '' : 'fix-menu-unfold']"
  >
    <template v-for="(item, index) in buttonInfo">
      <Button  :type="item.typeDetail" :tooltip="item.tooltip" :editor="editor"> </Button>
    </template>
  </div>
</template>
<script setup>
import {  ref,inject } from "vue";
import ColorSelectMenu from "./ColorSelectMenu.vue";
import HeadingLevelMenu from "./HeadingLevelMenu.vue";
import Button from "@/components/Button.vue";
const editor = inject('editor')
let isFold = ref(false);
const buttonInfo = [
  {
    type: "normal",
    tooltip:"Bold",
    typeDetail: "bold",
  },
  {
    type: "normal",
    tooltip:"Strike",
    typeDetail: "strike",
  },
  {
    type: "normal",
    tooltip:"Make a code block",
    typeDetail: "code",
  },
  {
    type: "normal",
    tooltip:"Italic",
    typeDetail: "italic",
  },
  {
    type: "normal",
    tooltip:"Underline",
    typeDetail: "underline",
  },
  {
    type: "normal",
    tooltip:"Make a Link",
    typeDetail: "link",
  },
  {
    type: "normal",
    tooltip:"TextAlign Left",
    typeDetail: { textAlign: "left" },
  },
  {
    type: "normal",
    tooltip:"TextAlign Center",
    typeDetail: { textAlign: "center" },
  },
  {
    type: "normal",
    tooltip:"TextAlign Right",
    typeDetail: { textAlign: "right" },
  },
  {
    type: "normal",
    tooltip:"Blockquote",
    typeDetail: "blockquote",
  },
];
</script>
<style scoped>
.fixed-menu {
  position: relative;
  background-color: rgb(255, 255, 255);
  width: 70px;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-wrap: wrap;
  overflow: hidden;
  box-shadow: 0 0 0 1px rgba(13, 13, 13, 0.06),
    0px 1px 4px rgba(13, 13, 13, 0.1);
  box-sizing: border-box;
  z-index: 1;
}
.fix-menu-unfold {
  height: auto;
}
.fixed-menu button {
  height: 42px;
}
</style>
