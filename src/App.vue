<script setup></script>

<template>
  <div id="app-container" v-ctrl-s>
    <div id="app">
      <router-view></router-view>
    </div>
  </div>
</template>

<style scoped>
#app-container {
  height: 100%;
}
#app {
  background: linear-gradient(
    to right,
    #fdd8da,
    #fef4dd,
    #eefef4
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  width: 100%;
  height: 100%;
  background-color: rgb(238, 238, 238);
  box-sizing: border-box;
}
</style>
