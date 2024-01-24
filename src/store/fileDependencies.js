import { defineStore } from "pinia";
import { ref } from "vue";
import { v4 as uuidv4 } from "uuid";
import { emitter } from "@/main.js";
/**
 * 在线文件关系层级数据记录并持久化，文件夹有唯一标识id，创建文件指定父文件夹id
 */
export const useFileDependenciesStore = defineStore(
  "fileDependencies",
  () => {
    // States
    const fileDependencies = ref([]); //[{id:XXX,name:XXX,sons:[]}]
    const currentFolder = ref("");

    // Getters
    let finalIndex = -1;
    let finalFolder = null;
    const recursionFindIndex = (data, id) => {
      try {
        data.forEach((item, index) => {
          if (item.id === id) {
            finalIndex = index;
            finalFolder = data;
            throw "finded";
          }
          if (item?.sons?.length > 0) {
            recursionFindIndex(item.sons, id);
          }
        });
      } catch (error) {
        console.log(error);
      }
    };
    const recursionDeleteFile = (data) => {
      //递归删除文件时，抛出删除文件事件，在tiptap中处理删除
      emitter.emit("delete-file", data.id);
      if (data?.sons) {
        data.sons.forEach((item) => recursionDeleteFile(item));
      }
    };
    // Actions
    const createFolder = (parentId, folderName = "未命名文件夹") => {
      finalIndex = -1;
      finalFolder = null;
      const id = uuidv4();
      const info = { id: id, name: folderName, sons: [] };
      if (parentId) {
        recursionFindIndex(fileDependencies.value, parentId);
        if (finalIndex >= 0) {
          if (!finalFolder[finalIndex]?.sons) {
            finalFolder[finalIndex].sons = [];
          }
          changeCurrentFolder(id);
          finalFolder[finalIndex].sons.push(info);
          return;
        }
      }
      changeCurrentFolder(id);
      fileDependencies.value.push(info);
    };
    const changeCurrentFolder = (id) => {
      currentFolder.value = id;
    };
    const deleteFolder = () => {};
    const createFile = (id, fileName = "未命名文件") => {
      finalIndex = -1;
      finalFolder = null;
      // const id = uuidv4();
      const info = { id: id, name: fileName, parentId: currentFolder.value };
      if (currentFolder.value) {
        console.log(currentFolder.value);
        recursionFindIndex(fileDependencies.value, currentFolder.value);
        if (finalIndex >= 0) {
          console.log(finalIndex, 1111111111);
          if (!finalFolder[finalIndex]?.sons) {
            finalFolder[finalIndex].sons = [];
          }
          // changeCurrentFolder(id)
          finalFolder[finalIndex].sons.push(info);
          return;
        }
      }
      // changeCurrentFolder(id)
      fileDependencies.value.push(info);
    };
    const deleteItem = (id) => {
      finalIndex = -1;
      finalFolder = null;
      recursionFindIndex(fileDependencies.value, id);
      recursionDeleteFile(finalFolder[finalIndex]);
      finalFolder.splice(finalIndex, 1);
    };
    const saveName = (id, name) => {
      finalIndex = -1;
      finalFolder = null;
      recursionFindIndex(fileDependencies.value, id);
      finalFolder[finalIndex].name = name;
    };
    return {
      fileDependencies,
      currentFolder,
      createFolder,
      changeCurrentFolder,
      createFile,
      saveName,
      deleteItem,
    };
  },
  { persist: true }
);
