<template>
  <div class="select-text-mask"></div>
  <div class="ai-window-container" @click.stop="clisk">
    <div class="ai-window-header">
      <AiPresetsBar :handleSubmit="handleChoiceBtnClick"></AiPresetsBar>
    </div>
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
    <div class="ai-answer-area-container" v-show="isAnswerShow">
      <div class="ai-answer-area-cursor" v-show="isCursorShow"></div>
      <div class="ai-answer-area" ref="contentRef">{{ answer }}</div>
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
const cursorPos = reactive({ x: 0, y: 0 });
const aiTextArea = ref(null);
const aiText = ref("");
const aiTextAreaStore = useAiTextAreaStore();
const contentRef = ref(null);
const clisk = () => {};
const answer = ref("");
const isCursorShow = ref(false);
const isAnswerShow = ref(false);
let timeId;
let testData =
  "经历了将近一周的,我感慨颇多,我们见到了社会的真实一面，实践生活中每一天遇到的情况还在我脑海里回旋，它给我们带来了意想不到的效果，社会实践活动给生活在都市象牙塔中的大学生们提供了广泛接触社会、了解社会的机会这短暂而又充实的实习，我认为对我走向社会起到了一个桥梁的作用，过渡的作用，是人生的一段重要的经历，也是一个重要步骤，对将来走上工作岗位也有着很大帮助。向他人虚心求教，与人文明交往等一些做人处世的基本原则都要在实际生活中认真的贯彻，好的习惯也要在实际生活中不断培养";
let index = 0;

const handleInputChange = (e) => {
  e.target.style.height = "auto";
  e.target.style.height = e.target.scrollHeight + "px";
  aiText.value = e.target.innerText;
};
const streamRequest = async (requestFn, isCustomize, data) => {
  isAnswerShow.value = true;
  isCursorShow.value = true;
  aiTextAreaStore.updateIsAiModel(true);
  testData = "";
  answer.value = "";
  nextTick(() => {
    updateCursorPosition();
  });
  if (timeId !== 0) {
    clearInterval(timeId);
    timeId = 0;
    index = 0;
  }
  if (isCustomize) {
    await requestFn(data, (res) => {
      testData = res?.data?.content?.result;
    });
  } else {
    await requestFn(
      {
        requestType: data?.type,
        requestContent: aiTextAreaStore.selectedText.replace(
          /[\'\"\\\/\b\f\n\r\t]/g,
          ""
        ),
      },
      (res) => {
        testData = res?.data?.content?.result || "";
      }
    );
  }
  timeId = setInterval(() => {
    if (index >= testData.length) {
      clearInterval(timeId);
      timeId = 0;
      index = 0;
      isCursorShow.value = false;
      if (testData.length <= 0) {
        isAnswerShow.value = false;
        const isAiModel = !!aiText.value.trim();
        aiTextAreaStore.updateIsAiModel(isAiModel);
      }
      return;
    }
    answer.value += testData[index];
    nextTick(() => {
      updateCursorPosition();
    });
    index++;
  }, 10);
};
const handleSubmit = async () => {
  streamRequest(aiRequest, true, {
    system: "你是一个文本处理助手，按照我的上下文和问题，给出我答案",
    temperature: 0.7,
    requestContent:
      "上下文为「" +
      aiTextAreaStore.selectedText.replace(/[\'\"\\\/\b\f\n\r\t]/g, "") +
      "」。我的问题是「" +
      aiTextAreaStore.inputText +
      "」",
  });
};
const handleChoiceBtnClick = (type, id) => {
  if (type !== "customize") {
    streamRequest(textDeal, false, { type: type });
    return;
  }
};
const clearInputText = () => {
  aiTextArea.value.innerText = "";
  testData = "";
  answer.value = "";
  textAreaFocus();
  aiTextAreaStore.updateIsAiModel(false);
  handleInputChange({ target: aiTextArea.value });
};
const textAreaFocus = () => {
  isAnswerShow.value = false;
  aiTextArea.value?.focus();
};
watch(aiText, (newVal, oldVal) => {
  aiTextAreaStore.updateInputText(newVal);
  const isAiModel = !!newVal.trim();
  aiTextAreaStore.updateIsAiModel(isAiModel);
});
const updateCursorPosition = () => {
  if (!contentRef.value) {
    return;
  }
  const lastText = document.createTextNode("李");
  contentRef.value.appendChild(lastText);
  const range = document.createRange();
  range.setStart(lastText, 0);
  range.setEnd(lastText, 0);
  const rect = range.getBoundingClientRect();
  const areaRect = contentRef.value.getBoundingClientRect();
  cursorPos.x = rect.left - areaRect.left;
  cursorPos.y = rect.top - areaRect.top;
  lastText.remove();
};
onMounted(() => {
  eventBus.on("open-ai-window", textAreaFocus);
  eventBus.on("close-ai-window", clearInputText);
});
</script>

<style scoped>
.select-text-mask {
  border-radius: 8px;
  position: absolute;
  display: none;
  z-index: 999;
  background-color: var(--ath-aiwindow-mask);
}

.ai-window-container {
  position: absolute;
  z-index: 999;
  display: none;
}

.ai-window-header {
  user-select: none;
  position: absolute;
  bottom: 100%;
  width: 100%;
  height: 40px;
  padding-bottom: 4px;
  background-color: transparent;
}

.ai-answer-area-container {
  position: relative;
  width: 100%;
  min-height: 30px;
  max-height: 100px;
  overflow: auto;
  font-size: 14px;
  line-height: 2;
  background-color: var(--ath-aiwindow-answer-background);
  color: var(--ath-aiwindow-answer-color);
  margin-bottom: 200px;
}

.ai-answer-area-cursor {
  position: absolute;
  width: 10px;
  height: 14px;
  background: var(--ath-aiwindow-answer-color);
  opacity: 0;
  z-index: 9999;
  animation: cursor 0.6s infinite;
  transform: translateY(3px);
  left: calc(v-bind("cursorPos.x") * 1px);
  top: calc(v-bind("cursorPos.y") * 1px);
}

@keyframes cursor {
  30% {
    opacity: 1;
  }
}

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
  min-width: calc(100% - 60px);
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
  text-indent: 36px;
  resize: none;
  line-height: 2;
  font-size: 16px;
  word-break: break-all;
  cursor: text;
  white-space: pre-wrap;
  border: none;
  outline: none;
  overflow: initial;
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
