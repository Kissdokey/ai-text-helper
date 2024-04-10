<template>
  <div class="ai-main-input-field">
    <div class="ai-textarea-layout">
      <div class="ai-textarea-layout-left">
        <div class="ai-textarea-logo">
          <v-icon>$IconLogo</v-icon>
        </div>
        <pre
          class="question-input-area"
          contenteditable="true"
          rows="1"
          ref="aiTextArea"
          @input="handleInputChange"
        ></pre>
      </div>
      <div class="ai-textarea-layout-right">
        <div class="ai-textarea-actions">
          <div
            class="clear-input-text-btn"
            v-if="aiText.trim()"
            @click="clearInputText"
            v-tooltip.bottom="{
              content: '清空内容',
              theme: 'delicate',
            }"
          >
            <v-icon>$IconClose</v-icon>
          </div>
          <div
            class="input-submit-btn"
            @click="handleSubmit"
            v-tooltip.bottom="{
              content: '发送',
              theme: 'delicate',
            }"
          >
            <v-icon>$IconSubmit</v-icon>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  inject,
  nextTick,
  onMounted,
  onUpdated,
  reactive,
  ref,
  watch,
} from "vue";
import { useAiTextAreaStore } from "@/store/aiTextArea";
import { aiRequest, textDeal } from "@/fetch/ai.js";
import AiPresetsBar from "@/components/AiPresetsBar.vue";
const eventBus = inject("eventBus");
const emit = defineEmits(["submit"]);
const aiTextArea = ref(null);
const aiText = ref("");
const aiTextAreaStore = useAiTextAreaStore();

const handleInputChange = (e) => {
  e.target.style.height = "auto";
  e.target.style.height = e.target.scrollHeight + "px";
  aiText.value = e.target.innerText;
};
const handleSubmit = async () => {
  emit('submit', aiText.value);
};
const clearInputText = () => {
  aiTextArea.value.innerText = "";
  textAreaFocus();
  handleInputChange({ target: aiTextArea.value });
};
const textAreaFocus = () => {
  aiTextArea.value?.focus();
};
watch(aiText, (newVal, oldVal) => {
  aiTextAreaStore.updateInputText(newVal);
});
</script>

<style scoped>
.ai-main-input-field {
  width: 100%;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid rgba(13, 13, 13, 0.3);
  background-color: var(--ath-aiwindow-input-background);
  color: var(--ath-aiwindow-input-color);
}

.ai-textarea-layout {
  width: 100%;
  overflow: auto;
}

.ai-textarea-layout-left {
  position: relative;
  float: left;
  min-width: 100%;
  max-height: 150px;
}

.ai-textarea-layout-right {
  float: right;
  display: flex;
  align-items: center;
}

.ai-textarea-logo {
  position: absolute;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.question-input-area {
    max-height: 150px;
  margin-left: 36px;
  resize: none;
  line-height: 2;
  font-size: 16px;
  word-break: break-all;
  cursor: text;
  white-space: pre-wrap;
  border: none;
  outline: none;
  overflow: auto;
}

.ai-textarea-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.clear-input-text-btn,
.input-submit-btn {
  cursor: pointer;
  border-radius: 8px;
}

.clear-input-text-btn:hover,
.input-submit-btn:hover {
  background-color: var(--ath-aiwindow-btn-hover);
}

.clear-input-text-btn:active,
.input-submit-btn:active {
  background-color: var(--ath-aiwindow-btn-active);
}
</style>
