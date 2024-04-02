import { defineStore } from "pinia";
import { ref } from "vue";
import { v4 as uuidv4 } from "uuid";
import { emitter } from "@/main.js";
import {
  openDB,
  updateDB,
  deleteDB,
  closeDB,
  addData,
  getDataByKey,
  getAllData,
} from "@/store/indexDB.js";
export const useEditorContent = defineStore({
  id: "editorContent",
  state: () => {
    // States
    const fileInfo = ref({});

    const openedFiles = ref([]);
    const currentFile = ref("");
    let db;
    const init = async () => {
      await openDB("editor-content").then(async (res) => {
        db = res;
        const data = await getAllData(db, "file-info");
        data.forEach((item) => {
          fileInfo.value[item.id] = item;
        });
        console.log(fileInfo.value);
      });
    };

    // Getters

    // Actions
    const saveContent = (id, content) => {
      if (id in fileInfo.value) {
        fileInfo.value[id].content = content;
        fileInfo.value[id].lastModifiedTime = Date.now();
        updateDB(db, "file-info", { id: id, ...fileInfo.value[id] });
      }
    };
    const saveName = (id, name) => {
      if (id in fileInfo.value) {
        fileInfo.value[id].name = name;
        updateDB(db, "file-info", { id: id, ...fileInfo.value[id] });
      }
    };
    const deleteFile = (id) => {
      if (id in fileInfo.value) {
        delete fileInfo.value[id];
      }
      let idx = openedFiles.value.findIndex((item) => item === id);
      if (idx >= 0) {
        openedFiles.value.splice(idx, 1);
      }
      if (currentFile.value === id) {
        currentFile.value = "";
      }
      deleteDB(db, "file-info", id);
    };
    const createFile = (name, content) => {
      const uuid = uuidv4();
      const info = {
        name: name,
        content: content,
        createTime: Date.now(),
        lastModifiedTime: Date.now(),
        permissions: 0,
      };
      fileInfo.value[uuid] = info;
      currentFile.value = uuid;
      appendOpenedFile(uuid);
      addData(db, "file-info", { id: uuid, ...info });
    };
    const changeFile = (id) => {
      if (id in fileInfo.value) {
        currentFile.value = id;
      }
    };
    const initFile = () => {
      currentFile.value = "";
    };
    const appendOpenedFile = (id) => {
      openedFiles.value.push(id);
    };
    const spliceOpenedFile = (index) => {
      openedFiles.value.splice(index, 1);
    };
    const clearOpenedFiles = () => {
      openedFiles.value = [];
      currentFile.value = "";
    };
    return {
      fileInfo,
      currentFile,
      openedFiles,
      saveContent,
      init,
      saveName,
      deleteFile,
      createFile,
      changeFile,
      initFile,
      appendOpenedFile,
      spliceOpenedFile,
      clearOpenedFiles,
    };
  },
  persist: {
    key: "editor-content",
    paths: ["currentFile", "openedFiles"],
  },
});
