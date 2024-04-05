import { defineStore } from "pinia";
import { ref } from "vue";
import { exceptionStateMap } from "@/util/constantData.js";
export const useExceptionStore = defineStore(
  "exception",
  () => {
    // States
    const exceptionState = ref(exceptionStateMap.LOADING);
    const exceptionDescription = ref("something wrong!");
    // Getters

    // Actions
    const updateExceptionState = (state) => {
      exceptionState.value = state;
    };
    const updateexceptionDescription = (state) => {
      exceptionDescription.value = state;
    };

    return {
      exceptionState,
      exceptionDescription,
      updateExceptionState,
      updateexceptionDescription,
    };
  },
  { persist: false }
);
