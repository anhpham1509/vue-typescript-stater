import {ComponentOptions} from "vue";
import {Component, Vue} from "vue-property-decorator";
import AppTemplate from "./App.template";
import "./App.scss";

const options: ComponentOptions<Vue> = {
  template: AppTemplate,
  data: () => ({
    title: "Hello World!",
  }),
};

@Component(options)
export class App extends Vue {
  public beforeCreate() {
    console.log("App component is beforeCreate.");
  }

  public created() {
    console.log("App component is created.");
  }

  public beforeMount() {
    console.log("App component is beforeMount.");
  }

  public mounted() {
    console.log("App component is mounted.");
  }

  public beforeUpdate() {
    console.log("App component is beforeUpdate.");
  }

  public updated() {
    console.log("App component is updated.");
  }

  public beforeDestroy() {
    console.log("App component is beforeDestroy.");
  }

  public destroyed() {
    console.log("App component is destroyed.");
  }
}
