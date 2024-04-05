import { defineStore } from "pinia";
import { ref } from "vue";
import { filePermissionMap } from "@/util/constantData.js";

export const useUserStore = defineStore(
  "user",
  () => {
    // States
    const isLogin = ref(false); //是否登录
    const username = ref("Guest");
    const userAvatar = ref("");
    const apiRequestNumber = ref(0);
    const filePermission = ref(filePermissionMap.PRIVATE);
    // Getters
    const initUserInfo = (res) => {
      isLogin.value = res.code === 200 ? true : false;
      username.value = res?.data?.username || "Guest";
      userAvatar.value = res?.data?.avatar || "";
      apiRequestNumber.value = res?.data?.apiRequestNumber || 0;
    };
    // Actions
    const updateLoginState = (state) => (isLogin.value = state);
    const updateUsername = (name) => (username.value = name);
    const updateUserAvatar = (avatar) => (userAvatar.value = avatar);
    const updateFilePermission = (state) => {
      filePermission.value = state;
    };
    return {
      isLogin,
      username,
      userAvatar,
      updateLoginState,
      updateUsername,
      initUserInfo,
      updateUserAvatar,
      updateFilePermission,
    };
  },
  { persist: false }
);
