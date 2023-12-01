<template>
  <div class="drop-down-button">
    <div :class="['drop-down-press', `type${props.type}`]">
      {{ props.type === 1 || props.type === 3 ? "" : props.info }}
      <input
        v-if="props.type === 1"
        type="color"
        @input="
          props.editor.chain().focus().setColor($event.target.value).run()
        "
        :value="props.editor.getAttributes('textStyle').color"
      />
      <input
        v-if="props.type === 3"
        type="color"
        @input="
          props.editor
            .chain()
            .focus()
            .toggleHighlight({ color: $event.target.value })
            .run()
        "
      />
      <div
        :class="[
          'drop-down-svg',
          props.currentType === props.type
            ? 'drop-down-svg-trans'
            : 'drop-down-svg-back',
        ]"
      >
      <v-icon size="12">$IconArrow</v-icon>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  info: String,
  type: Number,
  currentType: Number,
  editor: Object,
});
</script>
<style scoped>
.drop-down-button {
  display: inline-block;
  box-sizing: border-box;
  width: 90px;
  height: 42px;
  padding: 6px;
  cursor: pointer;
  user-select: none;
}
.drop-down-press {
  position: relative;
  box-sizing: border-box;
  border-radius: 6px;
  height: 100%;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  user-select: none;
}
.drop-down-press:hover {
  background-color: rgb(241, 241, 241);
}
.drop-down-press:active {
  background-color: rgb(230, 230, 230);
}
.drop-down-menu {
  width: 50px;
  height: 100px;
  background-color: #fff;
  position: absolute;
  top: 50px;
  right: 0;
}
.drop-down-svg {
  pointer-events: none;
  transform: rotate(180deg);
}
.drop-down-svg-back {
  animation: svgBack 0.2s ease-in-out;
  animation-fill-mode: forwards;
}
.drop-down-svg-trans {
  animation: svgTrans 0.2s ease-in-out;
  animation-fill-mode: forwards;
}
@keyframes svgTrans {
  0% {
    transform: rotate(180deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
@keyframes svgBack {
  0% {
    transform: rotate(360deg);
  }
  100% {
    transform: rotate(180deg);
  }
}
</style>
