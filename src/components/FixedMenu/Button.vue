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
    >
      <img
        v-if="props.type === 'bold'"
        class="icon"
        src="../../assets/bold.png"
      />
      <img
        v-if="props.type === 'italic'"
        class="icon"
        src="../../assets/italic.png"
      />
      <img
        v-if="props.type === 'strike'"
        class="icon"
        src="../../assets/strikethrough.png"
      />
      <img
        v-if="props.type === 'code'"
        class="icon"
        src="../../assets/code.png"
      />
      <img
        v-if="props.type === 'Underline'"
        class="icon"
        src="../../assets/underline.png"
      />
      <img
        v-if="props.type === 'link'"
        class="icon"
        src="../../assets/link.png"
      />
      <img
        v-if="props.type.textAlign === 'left'"
        class="icon"
        src="../../assets/left.png"
      />
      <img
        v-if="props.type.textAlign === 'center'"
        class="icon"
        src="../../assets/center.png"
      />
      <img
        v-if="props.type.textAlign === 'right'"
        class="icon"
        src="../../assets/right.png"
      />

      <img
        v-if="props.type === 'blockquote'"
        class="icon"
        src="../../assets/blockquote.png"
      />
    </div>
  </div>
</template>
<script setup>
const props = defineProps({ type: String, editor: Object });
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
  if (props.type === "Underline") {
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
}
.button-press:hover {
  background-color: rgb(241, 241, 241);
}
.active {
  background-color: rgb(241, 241, 241);
}
.button-press:active {
  background-color: rgb(230, 230, 230);
}
.icon {
  width: 15px;
  height: 15px;
}
</style>
