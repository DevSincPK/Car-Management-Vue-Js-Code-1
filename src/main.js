import { createApp } from "vue";
import App from "./App.vue";
import ElementPlus from "element-plus";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle";
import "element-plus/dist/index.css";
import router from "./router";
import store from "./store";

const app = createApp(App);

app.use(ElementPlus);
app.use(store);
app.use(router);

app.mount("#app");
// createApp(App).use(store).use(router).mount("#app");
