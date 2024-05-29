<template>
  <div class="chat-pop-wrapper">
    <div :class="['chat-pop', popClass]">
      <div class="pop-role">
        {{ role }}
        <!-- {{ timestampToDate(content[0]?.created) }} -->
        <img
          v-if="isCursorShow"
          width="16"
          height="16"
          src="../assets/gifs/loading.gif"
        />
      </div>
      <div
        :class="['pop-content', cptContent.trim() ? 'beautiful' : '']"
        ref="contentRef"
      >
        {{ cptContent }}
        <div class="ai-answer-area-cursor" v-show="isCursorShow"></div>
        <div class="copy-btn-wrapper" v-show="!isCursorShow">
          <div class="copy-btn" @click="handleCopy"><v-icon>$IconCopy</v-icon> Copy</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import {
  computed,
  onMounted,
  watch,
  reactive,
  ref,
  nextTick,
  inject,
} from "vue";
import _ from "lodash";
const eventBus = inject("eventBus");
const props = defineProps({
  role: {
    type: String,
    default: "",
  },
  content: {
    type: Array,
    default: () => [],
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  index: {
    type: Number,
    default: 0,
  },
});
const popClass = computed(() => {
  return props.role === "user" ? "chat-pop-user" : "chat-pop-assistant";
});
const cptContent = computed(() => {
  if (props.role === "user") return props.content[0].result;
  return isCursorShow.value
    ? showText.value
    : props.content.map((d) => d.result).join("");
});

onMounted(() => {
  updateChatBottom();
  eventBus.on(`update-print-task-${props.index}`, updatePrintTask);
});
const cursorPos = reactive({ x: 0, y: 0 });
const isCursorShow = computed(() => {
  if (props.role === "user") return false;
  if (props.isLoading) return true;
  if (isPrinting.value) return true;
  if (printTaskQueue.value.length > 0) return true;
  return false;
});
const contentRef = ref(null);
const showText = ref(" ");
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

//执行打印任务，打印速度抽成常量，打印任务是一个队列，一个执行完就等待下一个任务到来
const speed = 50;
let isPrinting = ref(false);
const printTaskQueue = ref([]);
const dealPrintTask = (str) => {
  if (!str) {
    return;
  }
  if (isPrinting.value) {
    printTaskQueue.value.push(str);
    return;
  }
  isPrinting.value = true;
  let i = 0;
  let timmer = setInterval(() => {
    showText.value += str[i];
    nextTick(() => {
      updateCursorPosition();
      updateChatBottom();
    });
    ++i;
    if (i >= str.length) {
      clearInterval(timmer);
      isPrinting.value = false;
      if (printTaskQueue.value.length > 0) {
        const nextStr = printTaskQueue.value.shift();
        dealPrintTask(nextStr);
      }
    }
  }, speed);
};
//待优化：根据返回的sentence_id判断次序，增加缓存位
const updatePrintTask = (task) => {
  if (task.result) {
    dealPrintTask(task.result);
  }
};
const updateChatBottom = _.throttle(() => {
  eventBus.emit("chat-scroll-to-bottom");
}, speed * 10);
const handleCopy = ()=> {
  const textarea = document.createElement('textarea')
  textarea.value = cptContent.value
  document.body.appendChild(textarea)
  textarea.select()
  document.execCommand('copy')
  document.body.removeChild(textarea)
  eventBus.emit('copy-success',"已经成功粘贴到剪切板！")
}
function timestampToDate(Timestamp) {
　　let now = new Date(Timestamp),
　　y = now.getFullYear(),
　　m = now.getMonth() + 1,
　　d = now.getDate();
　　return y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d) + " " + now.toTimeString().substr(0, 8);
}
</script>
<style scoped>
.chat-pop {
  margin: 12px 0;
  position: relative;
}
.chat-pop-user {
  width: fit-content;
  margin-left: auto;
}
.pop-content {
  position: relative;
  font-size: 12px;
  line-height: 16px;
  width: 100%;
  min-width: 20px;
  position: relative;
  min-height: 34px;
  padding: 8px;
  border-radius: 8px;
}
.beautiful {
  border: 1px solid var(--ath-divider-color);
  background-color: var(--ath-pop-color);
}
.ai-answer-area-cursor {
  position: absolute;
  width: 8px;
  height: 1em;
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
.pop-role {
  text-align: right;
  font-size: 16px;
}
.chat-pop-assistant .pop-role {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: fit-content;
}
.pop-role img {
  margin-left: 8px;
  margin-top: 2px;
}
.pop-content .copy-btn-wrapper {
  display: none;
  height: 32px;
  position: absolute;
  top: 100%;
  /* background-color: red; */
  padding-top: 4px;
  z-index: 1;
}
.chat-pop-user .copy-btn-wrapper {
  width: fit-content;
  right: 0;
}
.chat-pop-assistant .copy-btn-wrapper {
  width: 100%;
  left: 0;
}
.pop-content:hover .copy-btn-wrapper {
  display: block;
}
.copy-btn {
  display: flex;
  width: fit-content;
  padding: 2px 8px;
  border-radius: 4px;
  border: 1px solid var(--ath-divider-color);
  cursor: pointer;
  box-shadow: var(--ath-aiwindow-box-shadow);
}
.copy-btn:hover {
  background-color: var(--ath-btn-hover);
}
.copy-btn:active {
  background-color: var(--ath-btn-active);
}
</style>
