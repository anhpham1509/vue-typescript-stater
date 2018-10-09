declare module "favicons-webpack-plugin" {
  import {Plugin} from "webpack";

  export default class FaviconsWebpackPlugin extends Plugin {
    constructor(config: string | object);
  }
}
