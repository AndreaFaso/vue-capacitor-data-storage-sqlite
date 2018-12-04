import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false;
Vue.config.ignoredElements = [
  "ion-app",
  "ion-header",
  "ion-toolbar",
  "ion-title",
  "ion-content",
  "ion-button"
];
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
