<template>
        <AppTitle :isException="true"></AppTitle>
  <div class="loading-container">
    <div class="loading-icon">
      <img width="48" src="../assets/gifs/loading.gif" />
    </div>
    <div class="loading-msg">加载中，请稍等...</div>
  </div>
</template>
<script setup>
import AppTitle from './AppTitle.vue';
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
