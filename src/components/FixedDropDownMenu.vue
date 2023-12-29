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
  <div v-if="editor" :class="['fixed-menu', isFold ? '' : 'fix-menu-unfold']">
    <template v-for="(item, index) in buttonInfo">
      <DropDownButton
        v-if="item.type === 'drowDown'"
        :id="item.id"
        :info="calMenuName(item.info)"
        :type="item.typeIndex"
        :currentType="currentType"
        :editor="editor"
        @click.native="item.action"
        :tooltip="item.tooltip"
      ></DropDownButton>
      <Button
        v-else
        :type="item.typeDetail"
        :tooltip="item.tooltip"
        :editor="editor"
      >
      </Button>
    </template>
  </div>
</template>
<script setup>
import {
  computed,
  defineProps,
  ref,
  inject,
  onMounted,
  onUnmounted,
} from "vue";
import DropDownButton from "@/components/DropDownButton.vue";
import ColorSelectMenu from "./ColorSelectMenu.vue";
import HeadingLevelMenu from "./HeadingLevelMenu.vue";
import calCurrentAttribute from "@/util/calCurrentAttribute.js";
import Button from "./Button.vue";
const props = defineProps({ isHiddenToolPanel: Boolean });
onMounted(() => {
  window.addEventListener("click", dealClick);
});
onUnmounted(() => {
  window.removeEventListener("click", dealClick);
});
const type = ref(0);
const currentType = ref(-1);
const editor = inject("editor");
const eventBus = inject('eventBus')
let isFold = ref(false);
const calHeadingLevel = computed(() => {
  return calCurrentAttribute(editor.value, "heading");
});
const calCurrentColor = computed(() => {
  return editor.value.getAttributes("textStyle").color;
});
const calMenuName = (info) => {
  if (info === 0) {
    return calHeadingLevel.value;
  }
  if (info === 1) {
    return calCurrentColor.value;
  }
  return info;
};
const append = computed(()=> {
    return props.isHiddenToolPanel
  ? [
      {
        type: "normal",
        tooltip: "Bold",
        typeDetail: "bold",
      },
      {
        type: "normal",
        tooltip: "Strike",
        typeDetail: "strike",
      },
      {
        type: "normal",
        tooltip: "Make a code block",
        typeDetail: "code",
      },
      {
        type: "normal",
        tooltip: "Italic",
        typeDetail: "italic",
      },
      {
        type: "normal",
        tooltip: "Underline",
        typeDetail: "underline",
      },
      {
        type: "normal",
        tooltip: "Make a Link",
        typeDetail: "link",
      },
      {
        type: "normal",
        tooltip: "TextAlign Left",
        typeDetail: { textAlign: "left" },
      },
      {
        type: "normal",
        tooltip: "TextAlign Center",
        typeDetail: { textAlign: "center" },
      },
      {
        type: "normal",
        tooltip: "TextAlign Right",
        typeDetail: { textAlign: "right" },
      },
      {
        type: "normal",
        tooltip: "Blockquote",
        typeDetail: "blockquote",
      },
    ]
  : [];
})
const buttonInfo = computed(()=> {
    return [
  {
    type: "drowDown",
    title: "Heading Level",
    typeIndex: 0,
    id: "heading-level",
    action: () => {
      onDropDownMenu(0);
    },
    info: 0,
    tooltip: "Select Heading Level",
  },
  {
    type: "drowDown",
    title: "select text color",
    id: "text-color",
    typeIndex: 1,
    action: () => {
      onDropDownMenu(1);
    },
    info: 1,
    tooltip: "Select Text Color",
  },
  {
    type: "drowDown",
    title: "table actions",
    typeIndex: 2,
    id: "table-actions",
    action: () => {
      onDropDownMenu(2);
    },
    info: "表格",
    tooltip: "Select Table Operater",
  },
  {
    type: "drowDown",
    title: "Heading Level",
    typeIndex: 3,
    id: "text-background-color",
    action: () => {
      onDropDownMenu(3);
    },
    info: 1,
    tooltip: "Select HighLight Color",
  },
  ...append.value,
]
})
//仅用于菜单的点击，dealCick针对点击菜单外事件，把菜单收起；onDropDownMenu把菜单打开
eventBus.on('close-menu',dealClick)
function dealClick(e) {
  if (e?.target?.classList?.contains("drop-down-press")) {
    return;
  } else {
    currentType.value = -1;
  }
}
function onDropDownMenu(index) {
  type.value = index;
  if (currentType.value === index) {
    currentType.value = -1;
    return;
  }
  currentType.value = index;
}
</script>
<style scoped>
.fixed-menu {
    user-select: none;
  border-bottom: 1px solid rgba(13,13,13,0.1);
  position: relative;
  height: 42px;
  display: flex;
  flex-wrap: wrap;
  overflow: auto;
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
