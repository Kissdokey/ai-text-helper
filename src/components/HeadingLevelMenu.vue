<template>
  <v-menu v-model="visible" :close-on-content-click="false">
    <div class="drop-down-menu" @click.stop>
      <div
        class="heading-item"
        v-for="(item, index) in HEADINGARRAY"
        @click="clickHeading(index)"
      >
        <div v-if="headingType() === index">
          <img class="selected-heading" src="@/assets/selected.png" />
        </div>
        {{ item }}
      </div>
    </div>
  </v-menu>
</template>
<script setup>
import { ref, inject } from "vue";
import calCurrentAttribute from "@/util/calCurrentAttribute";
import { headTitles } from "@/util/constantData";
const editor = inject("editor");
const eventBus = inject('eventBus')
const HEADINGARRAY = headTitles;
const visible = ref(false);
function clickHeading(index) {
  visible.value = false;
  let curIdx = headingType();
  if (curIdx === index) {
    return;
  }
  if (index === 0) {
    editor.value.chain().focus().toggleHeading({ level: curIdx }).run();
    return;
  }
  editor.value.chain().focus().toggleHeading({ level: index }).run();
  eventBus.emit('close-menu')
}
function headingType() {
  const heading = calCurrentAttribute(editor.value, "heading");
  if (heading === "level 0") {
    return 0;
  } else {
    return parseInt(heading[6]);
  }
}
</script>

<style scoped>
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
.drop-down-menu {
  position: absolute;
  box-sizing: border-box;
  padding: 12px;
  width: 130px;
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
</style>
