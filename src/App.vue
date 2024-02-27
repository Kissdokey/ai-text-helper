<script setup></script>

<template>
  <div id="app-container" v-ctrl-s>
    <div id="app-box">
      <router-view></router-view>
    </div>
  </div>
</template>

<style scoped>
#app-container {
  height: 100%;
}
#app-box {
  width: 100%;
  height: 100%;
  background: var(--ath-total-background);
  box-sizing: border-box;
}
</style>
