<template>
  <div
    v-if="props.editor"
    :class="['fixed-menu', isFold ? '' : 'fix-menu-unfold']"
  >
    <DropDownButton
      :info="calHeadingLevel"
      :type="0"
      :currentType="currentType"
    ></DropDownButton>
    <DropDownButton
      :info="calHeadingLevel"
      :type="1"
      :currentType="currentType"
    ></DropDownButton>
    <DropDownButton
      :info="calHeadingLevel"
      :type="2"
      :currentType="currentType"
    ></DropDownButton>
    <DropDownButton
      :info="calHeadingLevel"
      :type="3"
      :currentType="currentType"
    ></DropDownButton>
    <button
      @click="
        () => {
          isFold = !isFold;
        }
      "
    >
      {{ isFold ? "展开" : "收起" }}
    </button>
    <button
      :class="{ 'is-active': props.editor.isActive('bold') }"
      @click="props.editor.chain().focus().toggleBold().run()"
    >
      Bold
    </button>
    <button
      @click="props.editor.chain().focus().toggleItalic().run()"
      :class="{ 'is-active': props.editor.isActive('italic') }"
    >
      italic
    </button>
    <button
      @click="props.editor.chain().focus().toggleStrike().run()"
      :class="{ 'is-active': props.editor.isActive('strike') }"
    >
      strike
    </button>
    <button
      @click="props.editor.chain().focus().toggleCode().run()"
      :class="{ 'is-active': props.editor.isActive('Code') }"
    >
      Code
    </button>
    <button
      @click="
        props.editor.chain().focus().toggleHighlight({ color: '#ffcc00' }).run()
      "
      :class="{ 'is-active': props.editor.isActive('Highlight') }"
    >
      Highlight
    </button>
    <button
      @click="props.editor.chain().focus().toggleUnderline().run()"
      :class="{ 'is-active': props.editor.isActive('Underline') }"
    >
      Underline
    </button>
    <button
      @click="setLink"
      :class="{ 'is-active': props.editor.isActive('link') }"
    >
      setLink
    </button>
    <input
      type="color"
      @input="props.editor.chain().focus().setColor($event.target.value).run()"
      :value="props.editor.getAttributes('textStyle').color"
    />
    <button
      @click="props.editor.chain().focus().setColor('#958DF1').run()"
      :class="{
        'is-active': props.editor.isActive('textStyle', { color: '#958DF1' }),
      }"
    >
      purple
    </button>
    <button
      @click="props.editor.chain().focus().setColor('#F98181').run()"
      :class="{
        'is-active': props.editor.isActive('textStyle', { color: '#F98181' }),
      }"
    >
      red
    </button>
    <button
      @click="props.editor.chain().focus().setColor('#FBBC88').run()"
      :class="{
        'is-active': props.editor.isActive('textStyle', { color: '#FBBC88' }),
      }"
    >
      orange
    </button>
    <button
      @click="props.editor.chain().focus().setColor('#FAF594').run()"
      :class="{
        'is-active': props.editor.isActive('textStyle', { color: '#FAF594' }),
      }"
    >
      yellow
    </button>
    <button
      @click="props.editor.chain().focus().setColor('#70CFF8').run()"
      :class="{
        'is-active': props.editor.isActive('textStyle', { color: '#70CFF8' }),
      }"
    >
      blue
    </button>
    <button
      @click="props.editor.chain().focus().setColor('#94FADB').run()"
      :class="{
        'is-active': props.editor.isActive('textStyle', { color: '#94FADB' }),
      }"
    >
      teal
    </button>
    <button
      @click="props.editor.chain().focus().setColor('#B9F18D').run()"
      :class="{
        'is-active': props.editor.isActive('textStyle', { color: '#B9F18D' }),
      }"
    >
      green
    </button>
    <button @click="props.editor.chain().focus().unsetColor().run()">
      unsetColor
    </button>
    <button
      @click="props.editor.chain().focus().setTextAlign('left').run()"
      :class="{ 'is-active': props.editor.isActive({ textAlign: 'left' }) }"
    >
      left
    </button>
    <button
      @click="props.editor.chain().focus().setTextAlign('center').run()"
      :class="{ 'is-active': props.editor.isActive({ textAlign: 'center' }) }"
    >
      center
    </button>
    <button
      @click="props.editor.chain().focus().setTextAlign('right').run()"
      :class="{ 'is-active': props.editor.isActive({ textAlign: 'right' }) }"
    >
      right
    </button>
    <button
      @click="props.editor.chain().focus().setTextAlign('justify').run()"
      :class="{ 'is-active': props.editor.isActive({ textAlign: 'justify' }) }"
    >
      justify
    </button>
    <button
      @click="props.editor.chain().focus().toggleBlockquote().run()"
      :class="{ 'is-active': props.editor.isActive('blockquote') }"
    >
      toggleBlockquote
    </button>
    <button
      @click="props.editor.chain().focus().toggleHeading({ level: 1 }).run()"
      :class="{ 'is-active': props.editor.isActive('heading', { level: 1 }) }"
    >
      H1
    </button>
    <button
      @click="props.editor.chain().focus().toggleHeading({ level: 2 }).run()"
      :class="{ 'is-active': props.editor.isActive('heading', { level: 2 }) }"
    >
      H2
    </button>
    <button
      @click="props.editor.chain().focus().toggleHeading({ level: 3 }).run()"
      :class="{ 'is-active': props.editor.isActive('heading', { level: 3 }) }"
    >
      H3
    </button>
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
    <button @click="props.editor.chain().focus().toggleHeaderColumn().run()">
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
      @click="props.editor.chain().focus().setCellAttribute('colspan', 2).run()"
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
</template>
<script setup>
import { computed, defineProps, ref } from "vue";
import DropDownButton from "./DropDownButton.vue";
import calCurrentAttribute from '../../../util/calCurrentAttribute.js'
const props = defineProps({ editor: Object, currentType: Number });
let isFold = ref(false);
const calHeadingLevel = computed(() => {
  return calCurrentAttribute(props.editor,'heading')
});
</script>
<style scoped>
.fixed-menu {
  position: relative;
  background-color: rgb(255, 255, 255);
  height: 42px;
  width: 100%;
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
