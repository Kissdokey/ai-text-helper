import { defineStore } from "pinia";
import { ref } from "vue";
import { v4 as uuidv4 } from "uuid";
/**
 * 在线文件关系层级数据记录并持久化，文件夹有唯一标识id，创建文件指定父文件夹id
 */
export const useFileDependenciesStore = defineStore(
  "fileDependencies",
  () => {
    // States
    const fileDependencies = ref([]);//[{id:XXX,name:XXX,sons:[]}]
    const currentFolder = ref('')

    // Getters
    // Actions
    const createFolder = (parentId, folderName = "未命名文件夹") => {
      let finalIndex = -1
      let finalFolder = null
      const id = uuidv4();
      const info = { id: id,name:folderName,sons:[] };
      const recursionFindIndex = (data)=> {
        try {
          data.forEach((item,index)=> {
            if(item.id === parentId) {
              finalIndex = index
              finalFolder = data
              throw 'finded' 
            }
            if(item.sons.length > 0) {
              recursionFindIndex(item.sons)
            }
         })
        } catch (error) {
        }
         
      }
      if (parentId) {
        recursionFindIndex(fileDependencies.value)
        if(finalIndex >= 0) {
          if(!finalFolder[finalIndex]?.sons) {
            finalFolder[finalIndex].sons = []
          }
          changeCurrentFolder(id)
          finalFolder[finalIndex].sons.push(info)
          return 
        }
      } 
      changeCurrentFolder(id)
      fileDependencies.value.push(info);
    };
    const changeCurrentFolder = (id)=> {
      console.log(id)
      currentFolder.value = id
    }
    const deleteFolder = () => {};
    const createFile = (id, fileName = "未命名文件") => {
      let finalIndex = -1
      let finalFolder = null
      // const id = uuidv4();
      const info = { id: id,name:fileName};
      const recursionFindIndex = (data)=> {
        try {
          data.forEach((item,index)=> {
            if(item.id === currentFolder.value) {
              finalIndex = index
              finalFolder = data
              throw 'finded' 
            }
            if(item.sons.length > 0) {
              recursionFindIndex(item.sons)
            }
         })
        } catch (error) {
        }
         
      }
      if (currentFolder.value) {
        console.log(currentFolder.value)
        recursionFindIndex(fileDependencies.value)
        if(finalIndex >= 0) {
          if(!finalFolder[finalIndex]?.sons) {
            finalFolder[finalIndex].sons = []
          }
          // changeCurrentFolder(id)
          finalFolder[finalIndex].sons.push(info)
          return 
        }
      } 
      // changeCurrentFolder(id)
      fileDependencies.value.push(info);
    };
    const deleteFile = () => {};

    return {fileDependencies,currentFolder,createFolder,changeCurrentFolder,createFile};
  },
  { persist: true }
);
