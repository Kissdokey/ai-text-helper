<template>
  <div
    class="drop-down-button"
    v-tooltip.bottom="{
      content: props.tooltip,
      theme: 'delicate',
    }"
  >
    <div
      :class="[
        `type${props.type}`,
        props.currentType === props.type ? 'drop-down-press-active' : 'drop-down-press',
      ]"
    >
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
const eventBus = inject("eventBus");
const calColorStyle = computed(() => {
  if (props.type === 1) {
    return { backgroundColor: colorItems[colorStates.wordColorIndex()].rgb };
  } else if (props.type === 3) {
    return {
      backgroundColor: colorItems[colorStates.highlightColorIndex()].rgb,
    };
  }
});
const clickColorBox = () => {
  if (props.type === 1) {
    eventBus.emit("color-index", colorStates.wordColorIndex());
  } else if (props.type === 3) {
    eventBus.emit("highLight-index", colorStates.highlightColorIndex());
  }
};
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

  font-size: 15px;
  font-family: inherit;
  border: none;
  position: relative;
  overflow: hidden;
  z-index: 1;
  box-shadow: 6px 6px 12px #c5c5c5, -6px -6px 12px #ffffff;
}

.drop-down-press::before {
  content: "";
  width: 0;
  height: 3em;
  position: absolute;
  top: 0;
  left: 0;
  background-image: linear-gradient(to right, #fbd786 0%, #f7797d 100%);
  transition: 0.5s ease;
  display: block;
  z-index: -1;
}
.drop-down-press:hover::before {
  width: 100%;
}
.drop-down-press:hover {
  color: white;
  background-color: rgb(241, 241, 241);
}
.drop-down-press-active {
  position: relative;
  box-sizing: border-box;
  border-radius: 6px;
  height: 100%;
  padding: 4px 10px 4px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  user-select: none;
  color: white;
  font-size: 15px;
  font-family: inherit;
  border: none;
  position: relative;
  overflow: hidden;
  z-index: 1;
  box-shadow: 6px 6px 12px #c5c5c5, -6px -6px 12px #ffffff;
  background-image: linear-gradient(to right, #fbd786 0%, #f7797d 100%);
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
