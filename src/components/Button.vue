<template>
  <div class="button">
    <div
      class="button-press"
      :class="['button-press', isActive() ? 'active' : '']"
      @click="
        () => {
          clickButton();
        }
      "
      v-tooltip.bottom="{
        content: props.tooltip,
        theme: 'delicate',
      }"
    >
      <img v-if="props.type === 'bold'" class="icon" src="@/assets/bold.png" />
      <img
        v-if="props.type === 'italic'"
        class="icon"
        src="@/assets/italic.png"
      />
      <img
        v-if="props.type === 'strike'"
        class="icon"
        src="@/assets/strikethrough.png"
      />
      <img v-if="props.type === 'code'" class="icon" src="@/assets/code.png" />
      <img
        v-if="props.type === 'underline'"
        class="icon"
        src="@/assets/underline.png"
      />
      <img v-if="props.type === 'link'" class="icon" src="@/assets/link.png" />
      <img
        v-if="props.type.textAlign === 'left'"
        class="icon"
        src="@/assets/left.png"
      />
      <img
        v-if="props.type.textAlign === 'center'"
        class="icon"
        src="@/assets/center.png"
      />
      <img
        v-if="props.type.textAlign === 'right'"
        class="icon"
        src="@/assets/right.png"
      />
      <img
        v-if="props.type === 'blockquote'"
        class="icon"
        src="@/assets/blockquote.png"
      />
    </div>
  </div>
</template>
<script setup>
import { inject } from "vue";
const eventBus = inject("eventBus");
const props = defineProps({ type: String, editor: Object, tooltip: String });
function isActive() {
  if (props.editor.isActive(props.type)) {
    return true;
  }
  return false;
}
function clickButton() {
  if (props.type === "bold") {
    props.editor.chain().focus().toggleBold().run();
  }
  if (props.type === "italic") {
    props.editor.chain().focus().toggleItalic().run();
  }
  if (props.type === "strike") {
    props.editor.chain().focus().toggleStrike().run();
  }
  if (props.type === "code") {
    props.editor.chain().focus().toggleCode().run();
  }
  if (props.type === "underline") {
    props.editor.chain().focus().toggleUnderline().run();
  }
  if (props.type.textAlign === "left") {
    props.editor.chain().focus().setTextAlign("left").run();
  }
  if (props.type.textAlign === "center") {
    props.editor.chain().focus().setTextAlign("center").run();
  }
  if (props.type.textAlign === "right") {
    props.editor.chain().focus().setTextAlign("right").run();
  }
  if (props.type === "blockquote") {
    props.editor.chain().focus().toggleBlockquote().run();
  }
}
</script>
<style scoped>
.button {
  display: inline-block;
  box-sizing: border-box;
  width: 45px;
  height: 42px;
  padding: 6px;
  cursor: pointer;
  user-select: none;
}

.button-press {
  position: relative;
  box-sizing: border-box;
  border-radius: 6px;
  height: 100%;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;

  font-size: 15px;
  font-family: inherit;
  border: none;
  position: relative;
  overflow: hidden;
  z-index: 1;
  box-shadow: 6px 6px 12px #c5c5c5, -6px -6px 12px #ffffff;
}
.button-press::before {
  content: "";
  width: 0;
  height: 3em;
  position: absolute;
  top: 0;
  left: 0;
  background-image: linear-gradient(to right, #0fd850 0%, #f9f047 100%);
  transition: 0.5s ease;
  display: block;
  z-index: -1;
}

.button-press:hover::before {
  width: 100%;
}
.button-press:hover {
  background-color: rgb(241, 241, 241);
}

.active {
  background-color: rgb(220, 220, 220);
}

.button-press:active {
  background-color: rgb(230, 230, 230);
}

.icon {
  width: 15px;
  height: 15px;
}
</style>
