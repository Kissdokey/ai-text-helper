<template>
  <div :class="['app-header', isException ? 'exception' : '']">
    <v-icon size="32" class="app-icon">$IconLogo</v-icon>
    <span>AI TEXT HELPER</span>
    <div v-if="!isException" class="change-them-btn"       v-tooltip.bottom="{
        content: 'Change theme',
        theme: 'delicate',
      }">
      <el-switch v-model="isThemeDark" size="large" @change="handleThemeChange">
        <template #active-action>
          <span class="switch-icon">
            <v-icon size="20">$IconNight</v-icon></span
          >
        </template>
        <template #inactive-action>
          <span class="switch-icon"> <v-icon size="20">$IconDay</v-icon></span>
        </template>
      </el-switch>
    </div>
    <div
      class="cloud-box"
      v-if="!isException"
      v-tooltip.bottom="{
        content: 'Save in the cloud',
        theme: 'delicate',
      }"
      @click="saveIncloud"
    >
      <v-icon>$IconCloud</v-icon>
    </div>
    <div v-if="!isException" class="share-btn-box"><SareBtn></SareBtn></div>
  </div>
</template>
<script setup>
import { inject, onMounted, ref } from "vue";
import { useCustomerSetting } from "@/store/customerSetting.js";
import SareBtn from "@/components/SareBtn.vue";
import _ from 'lodash'
const eventBus = inject('eventBus')
const props = defineProps({
  isException: {
    type: Boolean,
    default: false,
  },
});
const customerSetting = useCustomerSetting();
const isThemeDark = ref(customerSetting.isThemeDark);
const handleThemeChange = (val) => {
  if (val) {
    document.querySelector("html").classList.add("theme-dark");
    document.querySelector("html").classList.add("dark");
    customerSetting.updateTheme(true);
    return;
  }
  document.querySelector("html").classList.remove("theme-dark");
  document.querySelector("html").classList.remove("dark");
  customerSetting.updateTheme(false);
};
const saveIncloud = _.throttle(()=> {
  eventBus.emit('save-in-cloud')
},10000) 
onMounted(() => {
  handleThemeChange(customerSetting.isThemeDark);
});
</script>
<style scoped>
.app-header {
  position: relative;
  height: 40px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: large;
  font-weight: bold;
  user-select: none;
  background-color: var(--ath-header-background);
}
.exception {
  height: 80px;
}
.app-icon {
  pointer-events: none;
}
.app-header span {
  font-size: 24px;
  margin-left: 8px;
  background-image: var(--ath-header-text-image);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.switch-icon {
  background-color: green;
  position: absolute;
  top: 0;
  left: -7px;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.change-them-btn {
  position: absolute;
  right: 80px;
}
.cloud-box {
  position: absolute;
  right: 45px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  cursor: pointer;
}
.cloud-box:hover {
  background-color: var(--ath-btn-hover);
}
.cloud-box:active {
  background-color: var(--ath-btn-active);
}
.share-btn-box {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
}
</style>
<style>
.el-switch__core .el-switch__action {
  background-color: var(--ath-switch-action-color) !important;
}
.el-switch__core {
  background-color: var(--ath-switch-background-color) !important;
  border-color: var(--ath-switch-border-color) !important;
}
</style>
