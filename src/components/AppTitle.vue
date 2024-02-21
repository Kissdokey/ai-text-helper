<template>
    <div class="app-header">
        <v-icon class="name">$IconLogo</v-icon>
        <span @click="click1" id="lijian">AI TEXT HELPER</span>
    </div>
</template>
<script setup>
import { aiRequest } from '@/fetch/user';
 const click1 = ()=> {
    aiRequest({requestType:'translate',requestContent:"我叫李建"},()=>{})
 }
</script>
<style scoped>
.name {
    width: 16px;
    height: 16px;
}
.app-header {
    height: 50px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: large;
    font-weight: bold;
}
</style>