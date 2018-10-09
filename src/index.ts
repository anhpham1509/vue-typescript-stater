import Vue from "vue";
import "./index.scss";
import App from "./components/App";

const app = new Vue({
  render: h => h(App),
});

app.$mount("#app");
