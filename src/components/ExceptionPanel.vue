<template>
  <AppTitle :isException="true"></AppTitle>
  <div
    class="loading-container"
    v-if="exceptionState.exceptionState === exceptionStateMap.LOADING"
  >
    <div class="loading-icon">
      <img width="48" src="../assets/gifs/loading.gif" />
    </div>
    <div class="loading-msg">加载中，请稍等...</div>
  </div>
  <div
    class="no-login-container"
    v-if="exceptionState.exceptionState === exceptionStateMap.NOTLOGIN"
  >
    <div>尚未登录</div>
  </div>
  <div v-if="exceptionState.exceptionState === exceptionStateMap.ERROR">
    {{ exceptionState.exceptionDescription }}
  </div>
</template>
<script setup>
import AppTitle from "./AppTitle.vue";
import { exceptionStateMap } from "@/util/constantData.js";
import { useExceptionStore } from "@/store/exceptionState.js";
const exceptionState = useExceptionStore();
</script>
<style scoped>
.loading-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: black;
}
</style>
