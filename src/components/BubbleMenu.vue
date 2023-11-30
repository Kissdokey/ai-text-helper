<template>
  <bubble-menu
    :editor="editor"
    :tippy-options="{ duration: 100 }"
    v-if="editor"
  >
    <div class="buble-menu-box">
      <button
      @click="editor.chain().focus().toggleBold().run()"
      :class="{ 'is-active': editor.isActive('bold') }"
    >
      bold
    </button>
    <button
      @click="editor.chain().focus().toggleItalic().run()"
      :class="{ 'is-active': editor.isActive('italic') }"
    >
      italic
    </button>
    <button
      @click="editor.chain().focus().toggleStrike().run()"
      :class="{ 'is-active': editor.isActive('strike') }"
    >
      strike
    </button>
    </div> 
  </bubble-menu>
</template>
<script setup>
import { defineProps } from "vue";
import { BubbleMenu } from "@tiptap/vue-3";
const props = defineProps({ editor: Object });
</script>
<style scoped>
.buble-menu-box {
  display: flex;
  cursor: pointer;
  justify-content: space-between;
  height: 44px;
  padding: 8px;
  box-sizing: border-box;
  border: 1px solid rgba(8, 14, 23, 0.1);
  box-shadow: 0 12px 32px rgba(24, 26, 31, 0.08);
  border-radius: 8px;
  background: #fff;
}
</style>
