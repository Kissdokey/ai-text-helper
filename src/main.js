//component
import App from "./App.vue";

//composable
import { createApp } from "vue";

//plugins
import { registerPlugins } from "@/plugins";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import ElementPlus from 'element-plus'

// Libraries
import mitt from 'mitt'
import FloatingVue from "floating-vue";
import Vue3Tour from "vue3-tour";
import router from './router' 

//styles
import "floating-vue/dist/style.css";
import "./styles/floating-vue.css";
import "vue3-tour/dist/vue3-tour.css";
import 'element-plus/dist/index.css'

//directives
import CtrlSDirective from "./directives/CtrlSDirective";
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
const app = createApp(App);
registerPlugins(app);
FloatingVue.options.distance = 12;
const configFloatingVue = {
    distance: 12,
    themes: {
        delicate: { $extend: "tooltip" },
        toast: { $extend: "delicate" },
    },
};
app
    .use(pinia)
    .use(router)
    .use(Vue3Tour)
    .use(FloatingVue, configFloatingVue)
    .use(ElementPlus)

app.directive('ctrl-s', CtrlSDirective) 

export const emitter = mitt()
app.provide('eventBus', emitter)
app.mount("#app");
