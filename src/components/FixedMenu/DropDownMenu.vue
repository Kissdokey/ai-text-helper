<template>
  <div class="drop-down-menu" v-show="props.type === 0">
    {{ 11 }}
    <div class="heading-item"  v-for="(item,index) in props.data" @click="clickHeading(index)">
        <div v-if="headingType()===index"><img class="selected-heading" src="../../assets/selected.png" ></div>
      {{ item }}
    </div>
  </div>
</template>
<script setup>
import { ref, watch } from 'vue';
import calCurrentAttribute from '../../../util/calCurrentAttribute';
const props = defineProps({ type: Number, data: Array,editor:Object }); //0:heading,1:color,2:bgc
function headingType() {
    const heading = calCurrentAttribute(props.editor,'heading')
    if(heading==='正文') {
       return 0
    }
    else {
        return parseInt(heading[6])
    }
}
function clickHeading(index) {
    let curIdx = headingType()
    if(curIdx===index) {
        return
    }
    if(index === 0) {
        props.editor.chain().focus().toggleHeading({ level: curIdx }).run()
        return
    }
    props.editor.chain().focus().toggleHeading({ level: index }).run()
}
</script>
<style scoped>
.drop-down-menu {
  position: absolute;
  padding: 12px;
  top: 50px;
  left: 0;
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
    left:12px;
    top:50%;
    transform: translate(0,-50%);
    user-select: none;
}
</style>
