<template>
  <v-menu v-model="isMenuActive" :close-on-content-click="false">
    <div class="user-info-container">
      <input
        class="image-input"
        type="file"
        ref="imageRef"
        @change="selectedImage"
      />
      <div>
        <div
          class="user-avatar"
          v-tooltip.right="{
            content: '修改背景图片',
            theme: 'delicate',
          }"
          @click="chooseImage"
        >
          <img
            :src="
              userStore.userAvatar ||
              'https://tse3-mm.cn.bing.net/th/id/OIP-C.8TRr0HDEGnRxvWQjo9_rVgAAAA?w=188&h=188&c=7&r=0&o=5&pid=1.7'
            "
            width="32"
            height="32"
          />
        </div>
        {{ userStore.username }}
      </div>
      <button @click="logout">退出登录</button>
    </div>
  </v-menu>
</template>
<script setup>
import { ref } from "vue";
import { useUserStore } from "@/store/user.js";
import { imageToBase64 } from "@/util/image2Base64.js";
import {updateUserAvatar} from '@/fetch/user.js'
import {TOKEN} from '@/fetch/fetch.js'
const userStore = useUserStore();
const isMenuActive = ref(false);
const imageRef = ref(null);
const url = ref("");
const chooseImage = () => {
  imageRef.value.click();
};
const selectedImage = async (e) => {
  let file = (e?.target?.files || [])[0];
  if (!file) {
    return;
  }
  let base64 = await imageToBase64(file);
  if (base64.startsWith("data:image")) {
    updateUserAvatar({'avatar':base64},userStore.updateUserAvatar)
  }
};
const logout = ()=> {
  window?.localStorage.removeItem(TOKEN)
  userStore.initUserInfo({})
}
</script>
<style>
.user-info-container {
  background-color: white;
  padding: 12px;
  border-radius: 8px;
  box-shadow: 4px 4px 4px rgba(13, 13, 13);
}
.user-avatar {
  cursor: pointer;
  user-select: none;
  width: 32px;
  height: 32px;
  border-radius: 16px;
  overflow: hidden;
}
.image-input {
  width: 0;
  height: 0;
  display: none;
}
</style>
