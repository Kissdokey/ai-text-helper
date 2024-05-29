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
export const useChatSession = defineStore({
  id: "chat-session",
  state: () => {
    // States
    const chatSession = ref({}); //一个文件一个session对象，每个对象key对应sessionID，内容即是chat记录和chat名字，chat最后一条时间，
    const currentSessionId = ref(""); //当前sessionID
    const currentSession = ref([]);
    let db;
    const init = async () => {
      await openDB("chat-session").then(async (res) => {
        db = res;
        const data = await getAllData(db, "chat-record");
        console.log(data);
        data.forEach((item) => {
          chatSession.value[item.id] = item;
        });
      });
    };
    // Getters
    // Actions
    //保存chat记录
    const updateSession = (fileId, sessionId, sessionName, content) => {
      console.log(fileId, sessionId, sessionName, content);
      console.log("11111111111111111111");
      chatSession.value[sessionId].id = sessionId;
      chatSession.value[sessionId].content = content;
      chatSession.value[sessionId].name = sessionName;
      chatSession.value[sessionId].lastModifiedTime = Date.now();
      const info = {
        name: sessionName,
        content: content,
        createTime: chatSession.value[sessionId].createTime,
        lastModifiedTime: chatSession.value[sessionId].lastModifiedTime,
        belongs: fileId,
      };
      updateDB(db, "chat-record", { id: sessionId, ...info });
    };
    const deleteSession = (id) => {
      if (id in chatSession.value) {
        delete chatSession.value[id];
      }
      currentSession.value = currentSession.value.filter(
        (item) => item.id !== id
      );
      if (currentSessionId.value === id) {
        let keys = Object.keys(chatSession.value);
        if (keys.length > 0) {
          currentSessionId.value = keys[0];
        } else {
          currentSessionId.value = "";
        }
      }
      deleteDB(db, "chat-record", id);
    };
    const createSession = (fileId, name, content) => {
      const uuid = uuidv4();
      const info = {
        name: name,
        content: content,
        createTime: Date.now(),
        lastModifiedTime: Date.now(),
        belongs: fileId,
      };
      if (!chatSession.value[uuid]) {
        chatSession.value[uuid] = {};
      }
      chatSession.value[uuid] = info;
      currentSessionId.value = uuid;
      currentSession.value.unshift({ id: uuid, ...info });
      addData(db, "chat-record", { id: uuid, ...info });
    };
    const changeSession = (id) => {
      if (id in chatSession.value) {
        currentSessionId.value = id;
      }
    };
    const updateCurrentSession = (id) => {
      currentSession.value = getSessionByFileId(id).sort((a, b) => {
        return b.lastModifiedTime - a.lastModifiedTime;
      });
    };
    const updateCurrentSessionId = (id) => {
      currentSessionId.value = id;
    };
    const getSessionByFileId = (id) => {
      let res = [];
      for (let key in chatSession.value) {
        if (chatSession.value[key].belongs === id) {
          res.push(chatSession.value[key]);
        }
      }
      return res;
    };
    return {
      chatSession,
      currentSessionId,
      currentSession,
      init,
      createSession,
      deleteSession,
      updateSession,
      changeSession,
      getSessionByFileId,
      updateCurrentSession,
      updateCurrentSessionId,
    };
  },
  persist: {
    key: "chat-session",
    paths: ["currentSessionId", "chatSession"],
  },
});
