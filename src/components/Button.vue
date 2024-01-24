<template>
  <div class="button">
    <div class="button-press" 
      :class="['button-press', isActive ? 'active' : '']" 
      @click="clickButton" 
      v-tooltip.bottom="{
        content: props.tooltip,
        theme: 'delicate',
    }">
      <img v-if="props.type === 'bold'" class="icon" src="@/assets/bold.png" />
      <img v-if="props.type === 'italic'" class="icon" src="@/assets/italic.png" />
      <img v-if="props.type === 'strike'" class="icon" src="@/assets/strikethrough.png" />
      <img v-if="props.type === 'code'" class="icon" src="@/assets/code.png" />
      <img v-if="props.type === 'underline'" class="icon" src="@/assets/underline.png" />
      <img v-if="props.type === 'link'" class="icon" src="@/assets/link.png" />
      <img v-if="props.type?.textAlign === 'left'" class="icon" src="@/assets/left.png" />
      <img v-if="props.type?.textAlign === 'center'" class="icon" src="@/assets/center.png" />
      <img v-if="props.type?.textAlign === 'right'" class="icon" src="@/assets/right.png" />
      <img v-if="props.type === 'blockquote'" class="icon" src="@/assets/blockquote.png" />
    </div>
  </div>
</template>
<script setup>
import { computed, inject } from "vue";
const props = defineProps({ type: Object | String, tooltip: String });
const eventBus = inject('eventBus')
const editor = inject('editor')
const isActive = computed(()=> {
  if (editor.value.isActive(props.type)) {
    return true;
  }
  return false;
}) 
const clickButton = ()=> {
  eventBus.emit('simple-button-click',props.type)
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
  box-shadow: 2px 2px 6px #c5c5c5, -6px -6px 12px transparent;
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
  /* background-color: rgb(241, 241, 241); */
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
