<template>
  <div class="button">
    <div class="button-press" 
      :class="['button-press', isActive ? 'active' : '']" 
      @click="clickButton" 
      v-tooltip.bottom="{
        content: props.tooltip,
        theme: 'delicate',
    }">
      <v-icon v-if="props.type === 'bold'" class="icon" >$IconBold</v-icon>
      <v-icon v-if="props.type === 'italic'" class="icon" >$IconItalic</v-icon>
      <v-icon v-if="props.type === 'strike'" class="icon" >$IconStrikethrough</v-icon>
      <v-icon v-if="props.type === 'code'" class="icon" >$IconCode</v-icon>
      <v-icon v-if="props.type === 'underline'" class="icon" >$IconUnderline</v-icon>
      <v-icon v-if="props.type === 'link'" class="icon" >$IconLink</v-icon>
      <v-icon v-if="props.type?.textAlign === 'left'" class="icon" >$IconLeft</v-icon>
      <v-icon v-if="props.type?.textAlign === 'center'" class="icon" >$IconCenter</v-icon>
      <v-icon v-if="props.type?.textAlign === 'right'" class="icon" >$IconRight</v-icon>
      <v-icon v-if="props.type === 'blockquote'" class="icon" >$IconBlockquote</v-icon>
      <v-icon v-if="props.type === 'codeBlock'" class="icon" >$IconCodeBlock</v-icon>
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
  box-shadow: 4px 4px 6px var(--ath-btn-shadow), -6px -6px 12px rgba(13,13,13,0.06);
}

.button-press::before {
  content: "";
  width: 0;
  height: 3em;
  position: absolute;
  top: 0;
  left: 0;
  /* background-image: linear-gradient(to right, #0fd850 0%, #f9f047 100%); */
  transition: 0.5s ease;
  display: block;
  z-index: -1;
}

.button-press:hover::before {
  width: 100%;
}

.button-press:hover {
  background-color: var(--ath-btn-hover);
}

.active {
  background-color: var(--ath-btn-active);
}

.button-press:active {
  background-color: var(--ath-btn-active);
}

.icon {
  width: 15px;
  height: 15px;
}
</style>
