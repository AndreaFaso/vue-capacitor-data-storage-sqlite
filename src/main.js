import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Ionic from "@ionic/vue";
import { defineCustomElements as pwaElements } from "@ionic/pwa-elements/loader";

Vue.use(Ionic);
pwaElements(window);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
