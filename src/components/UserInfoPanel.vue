<template>
    <v-menu v-model="isMenuActive" :close-on-content-click="false">
        <div class="user-info-container">
            <div>
            {{ userStore.username  }}
        </div>
        </div>

    </v-menu>
</template>
<script setup>
import { ref } from 'vue';
import { useUserStore } from "@/store/user.js";
const userStore = useUserStore()
const isMenuActive = ref(false)
</script>
<style>
.user-info-container {
    background-color: white;
    padding: 12px;
    border-radius: 8px;
    box-shadow: 4px 4px 4px rgba(13,13,13);
}
</style>