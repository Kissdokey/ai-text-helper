<template>
  <div class="app-header">
    <v-icon size="32">$IconLogo</v-icon>
    <span>AI TEXT HELPER</span>
    <div class="change-them-btn">
      <el-switch
        v-model="isThemeDark"
        size="large"
        @change="handleThemeChange"
      >
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
  </div>
</template>
<script setup>
import { aiRequest } from "@/fetch/user";
import { onMounted, ref } from "vue";
import { useCustomerSetting } from '@/store/customerSetting.js'
const customerSetting = useCustomerSetting()
const isThemeDark = ref(customerSetting.isThemeDark);
const handleThemeChange = (val)=> {
  if(val) {
    document.querySelector('#app').classList.add('theme-dark')
    document.querySelector('html').classList.add('dark')
    customerSetting.updateTheme(true)
    return
  }
  document.querySelector('#app').classList.remove('theme-dark')
  document.querySelector('html').classList.remove('dark')
  customerSetting.updateTheme(false)
}
onMounted(()=> {
  handleThemeChange(customerSetting.isThemeDark)
})
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
  right: 20px;
}
</style>
<style>
.el-switch__core .el-switch__action {
  background-color: var(--ath-switch-action-color) !important;
}
.el-switch__core  {
  background-color: var(--ath-switch-background-color) !important;
  border-color: var(--ath-switch-border-color) !important;
}
</style>
