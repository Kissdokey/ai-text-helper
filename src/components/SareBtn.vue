<template>
  <div
    class="share-btn-box"
    v-tooltip.bottom="{
      content: 'Share',
      theme: 'delicate',
    }"
  >
    <v-icon>$IconShare</v-icon>
  </div>
  <ShareMenu
    activator=".share-btn-box"
    location="bottom"
    offset="6px"
  ></ShareMenu>
</template>
<script setup>
import ShareMenu from "@/components/ShareMenu.vue";
</script>
<style scoped>
.share-btn-box {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  cursor: pointer;
}
.share-btn-box:hover {
  background-color: var(--ath-btn-hover);
}
.share-btn-box:active {
  background-color: var(--ath-btn-active);
}
</style>
