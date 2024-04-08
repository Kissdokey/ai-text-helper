<template>
  <div
    class="ai-window-header-box"
    @dragstart="handleDragstart"
    @dragover="handleDragover"
    @dragenter="handleDragenter"
    @drag="handleDrag"
    @drop="handleDrop"
  >
    <el-dialog
      v-model="isComfirmMenuShow"
      title="预设未保存，确定关闭吗？"
      width="300"
    >
      <template #footer>
        <el-button @click="confirmClose">确定</el-button>
        <el-button type="primary" @click="cancelClose"> 取消 </el-button>
      </template>
    </el-dialog>
    <el-dialog
      v-model="isEditorMenuShow"
      title="编辑你的ai预设"
      width="500"
      :close-on-click-modal="false"
      :before-close="handleEditorMenuClose"
    >
      <div
        class="choices-container"
        data-type="selected"
        data-title="已选中预览"
      >
        <div
          v-for="item in selectedArray"
          :key="item.uid"
          :class="['choice-box', dragable ? '' : 'choice-box-not-drag']"
          :draggable="dragable"
          :data-uid="item.uid"
          @click="() => handlePresetEdit(item)"
          data-type="selected"
        >
          {{ item?.name }}
        </div>
      </div>
      <div class="divider"></div>
      <div
        class="choices-container"
        data-type="unselected"
        data-title="未选中预览"
      >
        <div
          v-for="item in unselectedArray"
          :key="item.uid"
          :class="['choice-box', dragable ? '' : 'choice-box-not-drag']"
          :draggable="dragable"
          :data-uid="item.uid"
          @click="() => handlePresetEdit(item)"
          data-type="unselected"
        >
          {{ item?.name }}
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="changeDragable">{{
            dragable ? "退出拖拽编辑" : "拖拽编辑"
          }}</el-button>
          <el-button @click="resetHistoryPresets">重置</el-button>
          <el-button @click="handlePresetCreate">添加新的ai预设</el-button>
          <el-button type="primary" @click="savePresets"> 保存 </el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog
      v-model="isAddPresetsMenuShow"
      title="添加ai预设，自定义你的ai助手！"
      width="500"
      :close-on-click-modal="false"
    >
      <AiPresetForm @save="savePreset"></AiPresetForm>
    </el-dialog>
    <el-dialog
      v-model="isEditPresetsMenuShow"
      title="编辑ai预设，自定义你的ai助手！"
      width="500"
      :close-on-click-modal="false"
    >
      <AiPresetForm
        v-if="isEditPresetsMenuShow"
        @save="savePreset"
        :form="currentEditInfo"
      ></AiPresetForm>
    </el-dialog>
    <div class="choice-item-container">
      <div v-for="choice in selectedArray" :key="choice">
        <div
          class="choice-item"
          @click="handleSubmit(choice?.type, choice?.id)"
        >
          {{ choice?.name }}
        </div>
      </div>
    </div>

    <div
      :class="['edit-choice-item-btn', isEditorMenuShow ? 'btn-active' : '']"
      v-tooltip.bottom="{
        content: '编辑预设列表',
        theme: 'delicate',
      }"
      @click="isEditorMenuShow = true"
    >
      <v-icon>$IconEditor</v-icon>
    </div>
  </div>
</template>
<script setup>
import { inject, onMounted, onUnmounted, ref, computed, nextTick } from "vue";
import AiPresetForm from "@/components/AiPresetForm.vue";
import { deepCopy } from "@/util/deepCopy.js";
import { v1 as uuid } from "uuid";
onMounted(() => {
  document.addEventListener("keydown", handleCtrlZ);
  document.addEventListener("keydown", handleCtrlY);
});
onUnmounted(() => {
  document.removeEventListener("keydown", handleCtrlZ);
  document.removeEventListener("keydown", handleCtrlY);
});
const eventBus = inject("eventBus");

const aiPresetsArray = ref([
  {
    name: "翻译",
    type: "translate",
    temperature: "",
    top_p: "",
    penalty_score: "",
    system: "",
    max_output_tokens: "",
    uid: "1",
    selected: true,
  },
  {
    name: "续写",
    type: "completion",
    temperature: "",
    top_p: "",
    penalty_score: "",
    system: "",
    max_output_tokens: "",
    uid: "2",
    selected: true,
  },
  {
    name: "续1写",
    type: "completion",
    temperature: "",
    top_p: "",
    penalty_score: "",
    system: "",
    max_output_tokens: "",
    uid: "3",
    selected: false,
  },
  {
    name: "续2写",
    type: "completion",
    temperature: "",
    top_p: "",
    penalty_score: "",
    system: "",
    max_output_tokens: "",
    uid: "4",
    selected: false,
  },
]);
const ctrlZStack = [deepCopy(aiPresetsArray.value)];
const ctrlYStack = [];
const isEditorMenuShow = ref(false);
const isEditPresetsMenuShow = ref(false);
const isComfirmMenuShow = ref(false);
const isAddPresetsMenuShow = ref(false);
const dragable = ref(false);
const props = defineProps({ handleSubmit: Function });
const currentDragInfo = ref(null);
const currentEditInfo = ref(null);
const currentDragCopyNode = ref(null);
const draggingClass = "dragging-item";
const selectedArray = computed(() => {
  return aiPresetsArray.value.filter((item) => {
    return item.selected;
  });
});
const unselectedArray = computed(() => {
  return aiPresetsArray.value.filter((item) => {
    return !item.selected;
  });
});
const isPresetsChanged = computed(() => {
  return (
    JSON.stringify(ctrlZStack.at(0)) !== JSON.stringify(aiPresetsArray.value)
  );
});

const updateHistoryStack = () => {
  //将ctrlZStack最后一个元素和aiPresetsArray深层比较，如果不一样，就将aiPresetsArray深拷贝赋值给ctrlZStack最后一个元素
  const isSame =
    JSON.stringify(ctrlZStack.at(-1)) === JSON.stringify(aiPresetsArray.value);
  if (!isSame) {
    ctrlZStack.push(deepCopy(aiPresetsArray.value));
  }
};
//保存拖拽的item信息
const saveDragInfo = (target) => {
  const uid = target.dataset.uid;
  const idx = aiPresetsArray.value.findIndex((item) => {
    return item.uid === uid;
  });
  currentDragInfo.value = aiPresetsArray.value[idx];
};
//设置拖拽预览
const setCopyPreview = (e) => {
  e.dataTransfer.dropEffect = "move";
  e.dataTransfer.effectAllowed = "move";
  var img = new Image();
  img.src =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' %3E%3Cpath /%3E%3C/svg%3E";
  e.dataTransfer.setDragImage(img, 0, 0);
  currentDragCopyNode.value = e.target.cloneNode(true);
  currentDragCopyNode.value.style =
    "position:fixed;left:0;top:0;z-index:999;pointer-events:none;display:none";
  document.body.appendChild(currentDragCopyNode.value);
  e.target.classList.add(draggingClass);
};
const updateCopyPreview = (e) => {
  Object.assign(currentDragCopyNode.value.style, {
    display: "block",
    left: e.clientX - 10 + "px",
    top: e.clientY - 10 + "px",
  });
};
const removeCopyPreview = () => {
  removeClass(draggingClass);
  document.body.removeChild(currentDragCopyNode.value);
};
//删除所有calss
const removeClass = (className) => {
  document.querySelectorAll(`.${className}`).forEach((item) => {
    item.classList.remove(className);
  });
};
const updateSortData = (e) => {
  if (!e.target?.dataset?.type) {
    return;
  }
  if (!e.target?.dataset?.uid && e.target?.dataset?.type) {
    const tagetType = currentDragCopyNode.value.dataset.type;
    if (tagetType === e.target.dataset.type) {
      return;
    }
    sortChoices(undefined, true);
    return;
  }
  if (
    e.target?.dataset?.uid &&
    e.target?.dataset?.uid !== currentDragInfo.value?.uid
  ) {
    const is = currentDragCopyNode.value.dataset.type !== e.target.dataset.type;
    sortChoices(e.target.dataset.uid, is);
  }
};
//将 requesChoice 进行排序，如果传入的idx为0，则将currendDragChoiceInfo移动到最前面,否则将currenDragChoiceInfo移动到idx位置
const sortChoices = (uid, isTrans) => {
  let idx = aiPresetsArray.value.findIndex((item) => {
    return item.uid === uid;
  });
  aiPresetsArray.value = aiPresetsArray.value.filter((item) => {
    return item.uid !== currentDragInfo.value.uid;
  });
  let currentType = currentDragCopyNode.value.dataset.type;
  if (isTrans) {
    currentDragInfo.value.selected = !currentDragInfo.value.selected;
    currentDragCopyNode.value.dataset.type =
      currentType === "selected" ? "unselected" : "selected";
    idx = aiPresetsArray.value.findIndex((item) => {
      return item.uid === uid;
    });
  }
  if (!uid) {
    let lastItemUid;
    if (currentType === "selected") {
      lastItemUid = unselectedArray.value.at(-1)?.uid;
    } else {
      lastItemUid = selectedArray.value.at(-1)?.uid;
    }
    const insertIndex = aiPresetsArray.value.findIndex((item) => {
      return item.uid === lastItemUid;
    });
    aiPresetsArray.value.splice(insertIndex + 1, 0, currentDragInfo.value);
  } else {
    aiPresetsArray.value.splice(idx, 0, currentDragInfo.value);
  }
  nextTick(() => {
    document
      .querySelector(".ai-window-header-box")
      .querySelectorAll(".choice-box")
      .forEach((item) => {
        if (item.dataset.uid === currentDragInfo.value.uid) {
          item.classList.add(draggingClass);
        }
      });
  });
};
const insertPreset = (form) => {
  const insertIndex = aiPresetsArray.value.findIndex((item) => {
    return item.uid === selectedArray.value.at(-1).uid;
  });
  const newPreset = {
    ...form,
    selected: true,
    uid: uuid(),
  };
  aiPresetsArray.value.splice(insertIndex + 1, 0, newPreset);
};

//拖拽相关事件
const handleDragstart = (e) => {
  setCopyPreview(e);
  saveDragInfo(e.target);
};
const handleDrag = (e) => {
  updateCopyPreview(e);
};
const handleDragover = (e) => {
  e.preventDefault();
  updateCopyPreview(e);
};
const handleDragenter = (e) => {
  e.preventDefault();
  //处理跨selected的拖拽
  updateSortData(e);
};
const handleDrop = (e) => {
  removeCopyPreview();
  updateHistoryStack();
};

//dialog按钮事件
const changeDragable = (e) => {
  dragable.value = !dragable.value;
};
const resetHistoryPresets = () => {
  aiPresetsArray.value = ctrlZStack.at(0);
  updateHistoryStack();
};
const handlePresetCreate = () => {
  isAddPresetsMenuShow.value = true;
};
const handlePresetEdit = (item) => {
  currentEditInfo.value = item;
  console.log(ctrlZStack);
  isEditPresetsMenuShow.value = true;
};
let doneFn;
const handleEditorMenuClose = (done) => {
  if(!isPresetsChanged.value) {
    done();
    return
  }
  isComfirmMenuShow.value = true;
  doneFn = done;
};
const confirmClose = () => {
  isComfirmMenuShow.value = false;
  ctrlZStack.splice(1);
  ctrlYStack.splice(0);
  aiPresetsArray.value = ctrlZStack.at(0);
  doneFn();
};
const cancelClose = () => {
  isComfirmMenuShow.value = false;
};
const savePresets = () => {
  ctrlZStack.splice(1);
  ctrlYStack.splice(0);
  dragable.value = false;
  isEditorMenuShow.value = false;
  eventBus.emit("save-preset-success", `预设保存成功`);
};
const savePreset = (form, isEdit, isSame) => {
  isAddPresetsMenuShow.value = false;
  isEditPresetsMenuShow.value = false;
  !isEdit && insertPreset(form);
  eventBus.emit(
    "save-preset-success",
    `${isEdit ? "编辑" : "添加"}${form.name}预设成功`
  );
  updateHistoryStack();
};

//监听ctrl-z事件，如果ctrl-z被触发，则将historChoices中最后一个item值给selectedArray，并将historChoices中最后一个item删除
const handleCtrlZ = (e) => {
  if (e.ctrlKey && e.key === "z") {
    console.log("undo");
    if (ctrlZStack.length === 1) return;
    aiPresetsArray.value = ctrlZStack.at(-2);
    ctrlYStack.push(deepCopy(ctrlZStack.pop()));
  }
};
const handleCtrlY = (e) => {
  if (e.ctrlKey && e.key === "y") {
    console.log("redo");
    if (ctrlYStack.length === 0) return;
    aiPresetsArray.value = ctrlYStack.pop();
    ctrlZStack.push(deepCopy(aiPresetsArray.value));
  }
};
</script>
<style scoped>
.dragging-item {
  opacity: 0.5;
}
.drag-over {
  background-color: rgba(13, 13, 13, 0.3);
}
.ai-window-header-box {
  position: relative;
  background-color: var(--ath-aiwindow-header-background);
  border: 1px solid var(--ath-divider-color);
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  border-radius: 4px;
}
.choice-item-container {
  width: calc(100% - 40px);
  height: 36px;
  display: flex;
  overflow: auto;
}
.choice-item {
  height: 24px;
  width: 48px;
  border-radius: 8px;
  border: 1px solid var(--ath-divider-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  margin: 4px;
}
.edit-choice-item-btn::after {
  content: "";
  width: 1.5px;
  height: calc(100% - 8px);
  position: absolute;
  left: -8px;
  top: 4px;
  background-color: var(--ath-divider-color);
}
.edit-choice-item-btn {
  position: absolute;
  right: 8px;
  width: 24px;
  cursor: pointer;
  height: 24px;
  border: 1px solid var(--ath-divider-color);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
}
.edit-choice-item-btn:hover {
  background-color: var(--ath-btn-hover);
}
.edit-choice-item-btn:active {
  background-color: var(--ath-btn-active);
}
.btn-active {
  background-color: var(--ath-btn-active);
}
.choice-item:hover {
  background-color: var(--ath-btn-hover);
}
.choice-item:active {
  background-color: var(--ath-btn-active);
}
.edit-menu {
  background-color: red;
  z-index: 9999;
  width: 100vw;
  height: 100vh;
}
.choices-container {
  position: relative;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  padding: 50px 24px 24px 24px;
}
.choices-container::after {
  content: attr(data-title);
  position: absolute;
  top: 10px;
  left: 0;
}
.choice-box {
  cursor: grab;
  background-color: var(--ath-aiwindow-header-background);
  font-size: 14px;
  color: var(--ath-icon-color);
  height: 32px;
  border-radius: 4px;
  padding: 4px 8px;
  border: 1px solid var(--ath-divider-color);
  margin: 8px 8px 0 0;
}
.choice-box-not-drag {
  cursor: pointer;
}
.choice-box-not-drag:hover {
  background-color: var(--ath-btn-hover);
}
.choice-box-not-drag:active {
  background-color: var(--ath-btn-active);
}
.divider {
  width: calc(100%);
  height: 1px;
  background-color: var(--ath-divider-color);
  margin: 0 auto;
}
</style>
<style>
.ai-window-header-box .el-dialog {
  border-radius: 12px !important;
}
</style>
