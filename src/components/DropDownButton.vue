<template>
  <div
    class="drop-down-button"
    v-tooltip.bottom="{
      content: props.tooltip,
      theme: 'delicate',
    }"
  >
    <div :class="['drop-down-press', `type${props.type}`]">
      {{ props.type === 1 || props.type === 3 ? "" : props.info }}
      <div
        class="color-box"
        :style="calColorStyle"
        v-if="props.type === 1"
        @click.stop="clickColorBox"
      ></div>
      <div
        class="color-box"
        :style="calColorStyle"
        v-if="props.type === 3"
        @click.stop="clickColorBox"
      ></div>
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
import { computed, inject, ref, watch } from "vue";
import { useColorStore } from "@/store/color";
import { mapState } from "pinia";
import { colorItems } from "@/util/constantData";

const colorStates = mapState(useColorStore, [
  "wordColorIndex",
  "highlightColorIndex",
]);
const props = defineProps({
  info: String,
  type: Number,
  currentType: Number,
  editor: Object,
  tooltip: String,
});
const eventBus = inject('eventBus')
const calColorStyle = computed(() => {
  if (props.type === 1) {
    return { backgroundColor: colorItems[colorStates.wordColorIndex()].rgb };
  } else if (props.type === 3) {
    return {
      backgroundColor: colorItems[colorStates.highlightColorIndex()].rgb,
    };
  }
});
const clickColorBox = ()=> {
  if(props.type===1) {
    eventBus.emit('color-index',(colorStates.wordColorIndex(),{name:111}))
  }
  else if(props.type === 3) {
    eventBus.emit('highLight-index',colorStates.highlightColorIndex())
  }
}
</script>
<style scoped>
.drop-down-button {
  display: inline-block;
  box-sizing: border-box;
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
  padding: 4px 10px 4px 10px;
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
  margin-left: 10px;
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
.color-box {
  width: 20px;
  height: 20px;
  border: 1px solid rgba(13, 13, 13, 0.1);
  border-radius: 10px;
}
</style>
