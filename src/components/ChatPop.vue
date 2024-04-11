<template>
  <div class="chat-pop-wrapper">
    <div :class="['chat-pop', popClass]">
      <div class="pop-role">{{ role }}</div>
      <div class="pop-content" ref="contentRef">
        {{ cptContent }}
        <div class="ai-answer-area-cursor" v-show="isCursorShow"></div>
      </div>
      <div>{{ isLoading }}</div>
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
  return showText.value;
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
</script>
<style scoped>
.chat-pop {
  position: relative;
}
.chat-pop-user {
  width: fit-content;
  margin-left: auto;
}
.pop-content {
  position: relative;
  min-height: 20px;
}
.ai-answer-area-cursor {
  position: absolute;
  width: 10px;
  height: 22px;
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
</style>
