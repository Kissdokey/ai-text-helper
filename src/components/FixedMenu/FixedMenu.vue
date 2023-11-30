<template>
  <button
    @click="
      () => {
        isFold = !isFold;
      }
    "
  >
    {{ isFold ? "展开" : "收起" }}
  </button>
  <div
    v-if="props.editor"
    :class="['fixed-menu', isFold ? '' : 'fix-menu-unfold']"
  >
    <DropDownButton
      :info="calHeadingLevel"
      :type="0"
      :currentType="currentType"
      :editor="props.editor"
      @click.native="
        () => {
          console.log(111);
          emits('onDropDownMenu', 0);
        }
      "
    ></DropDownButton>
    <DropDownButton
      :info="calCurrentColor"
      :type="1"
      :currentType="currentType"
      :editor="props.editor"
      @click.native="
        () => {
          emits('onDropDownMenu', 1);
        }
      "
    ></DropDownButton>
    <DropDownButton
      :info="'表格'"
      :type="2"
      :currentType="currentType"
      :editor="props.editor"
      @click.native="
        () => {
          emits('onDropDownMenu', 2);
        }
      "
    ></DropDownButton>
    <DropDownButton
      :info="calCurrentColor"
      :type="3"
      :currentType="currentType"
      :editor="props.editor"
      @click.native="
        () => {
          emits('onDropDownMenu', 3);
        }
      "
    ></DropDownButton>
    <Button :type="'bold'" :editor="props.editor"></Button>
    <Button :type="'strike'" :editor="props.editor"></Button>
    <Button :type="'code'" :editor="props.editor"></Button>
    <Button :type="'italic'" :editor="props.editor"> </Button>
    <Button :type="'underline'" :editor="props.editor"> </Button>
    <Button :type="'link'" :editor="props.editor"> </Button>
    <Button :type="{ textAlign: 'left' }" :editor="props.editor"> </Button>
    <Button :type="{ textAlign: 'center' }" :editor="props.editor"> </Button>
    <Button :type="{ textAlign: 'right' }" :editor="props.editor"> </Button>
    <Button :type="'blockquote'" :editor="props.editor"> </Button>
  </div>
</template>
<script setup>
import { computed, defineProps, ref } from "vue";
import DropDownButton from "./DropDownButton.vue";
import calCurrentAttribute from "../../../util/calCurrentAttribute.js";
import Button from "./Button.vue";
const props = defineProps({ editor: Object, currentType: Number });
const emits = defineEmits(["onDropDownMenu"]);
let isFold = ref(false);
const calHeadingLevel = computed(() => {
  return calCurrentAttribute(props.editor, "heading");
});
const calCurrentColor = computed(() => {
  return props.editor.getAttributes("textStyle").color;
});
</script>
<style scoped>
.fixed-menu {
  position: relative;
  background-color: rgb(255, 255, 255);
  height: 42px;
  width: 100%;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
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
