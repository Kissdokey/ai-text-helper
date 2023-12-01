<template>
  <ColorSelectMenu
    :color-index="colorIndex"
    :title="title"
    :event-emitter="eventBus"
    activator="#heading-level"
    location="bottom"
    offset="6px"
    ref="colorMenu"
  />
  <ColorSelectMenu
    :color-index="colorIndex"
    :title="title"
    :event-emitter="eventBus"
    activator="#text-color"
    location="bottom"
    offset="6px"
    ref="colorMenu"
  />
  <ColorSelectMenu
    :color-index="colorIndex"
    :title="title"
    :event-emitter="eventBus"
    activator="#text-background-color"
    location="bottom"
    offset="6px"
    ref="colorMenu"
  />
  <ColorSelectMenu
    :color-index="colorIndex"
    :title="title"
    :event-emitter="eventBus"
    activator="#table-actions"
    location="bottom"
    offset="6px"
    ref="colorMenu"
  />
  <button
    @click="
      () => {
        isFold = !isFold;
      }
    "
  >
    {{ isFold ? "展开" : "收起" }}
  </button>
  <div
    v-if="props.editor"
    :class="['fixed-menu', isFold ? '' : 'fix-menu-unfold']"
  >
    <template v-for="(item, index) in buttonInfo">
      <DropDownButton
        v-if="item.type === 'drowDown'"
        :id="item.id"
        :info="item.info"
        :type="item.typeIndex"
        :currentType="currentType"
        :editor="props.editor"
        @click.native="item.action"
      ></DropDownButton>
      <Button v-else :type="item.typeDetail" :tooltip="item.tooltip" :editor="props.editor"> </Button>
    </template>
  </div>
</template>
<script setup>
import { computed, defineProps, ref } from "vue";
import DropDownButton from "@/components/DropDownButton.vue";
import ColorSelectMenu from "./ColorSelectMenu.vue";
import calCurrentAttribute from "@/util/calCurrentAttribute.js";
import Button from "./Button.vue";
const props = defineProps({ editor: Object, currentType: Number });
const emits = defineEmits(["onDropDownMenu"]);
let isFold = ref(false);
const calHeadingLevel = computed(() => {
  return calCurrentAttribute(props.editor, "heading");
});
const calCurrentColor = computed(() => {
  return props.editor.getAttributes("textStyle").color;
});
const buttonInfo = [
  {
    type: "drowDown",
    title: "Heading Level",
    typeIndex: 0,
    id: "heading-level",
    action: () => {
      emits("onDropDownMenu", 0);
    },
    info: calHeadingLevel,
  },
  {
    type: "drowDown",
    title: "select text color",
    id: "text-color",
    typeIndex: 1,
    action: () => {
      emits("onDropDownMenu", 1);
    },
    info: calCurrentColor,
  },
  {
    type: "drowDown",
    title: "table actions",
    typeIndex: 2,
    id: "table-actions",
    action: () => {
      emits("onDropDownMenu", 2);
    },
    info: "表格",
  },
  {
    type: "drowDown",
    title: "Heading Level",
    typeIndex: 3,
    id: "text-background-color",
    action: () => {
      emits("onDropDownMenu", 3);
    },
    info: calCurrentColor,
  },
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
  height: 42px;
  width: 100%;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  overflow: hidden;
  box-shadow: 0 0 0 1px rgba(13, 13, 13, 0.06),
    0px 1px 4px rgba(13, 13, 13, 0.1);
  padding: 0 36px;
  box-sizing: border-box;
  border-radius: 8px;
  z-index: 1;
}
.fix-menu-unfold {
  height: auto;
}
.fixed-menu button {
  height: 42px;
}
</style>
