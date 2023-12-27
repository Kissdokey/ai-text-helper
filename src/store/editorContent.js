import { defineStore } from "pinia";
import { ref } from "vue";
import { v4 as uuidv4 } from "uuid";
import {emitter} from "@/main.js";
export const useEditorContent = defineStore(
  "editorContent",
  () => {
    // States
    const fileInfo = ref({});
    const currentFile = ref("");
    const currentName = ref("");
    // Getters

    // Actions
    const saveContent = (id, content) => {
      if (id in fileInfo.value) {
        fileInfo.value[id].content = content;
      } 
    };
    const saveName = (id, name) => {
      if (id in fileInfo.value) {
        fileInfo.value[id].name = name;
      }
    };
    const deleteFile = (id) => {
      if (id in fileInfo.value) {
        delete fileInfo.value[id];
      }
    };
    const createFile = (name, content) => {
      const uuid = uuidv4();
      const info = { name: name, content: content };
      fileInfo.value[uuid] = info;
      currentFile.value = uuid;
    };
    const changeFile = (id) => {
      if (id in fileInfo.value) {
        currentFile.value = id;
        currentName.value = fileInfo.value[id].name;
      }
    };
    const changeCurrentName = (name) => {
      currentName.value = name;
    };
    const initFile = () => {
      currentName.value = "";
      currentFile.value = "";
    };
    return {
      fileInfo,
      currentFile,
      currentName,
      saveContent,
      saveName,
      deleteFile,
      createFile,
      changeFile,
      changeCurrentName,
      initFile
    };
  },
  { persist: true }
);
