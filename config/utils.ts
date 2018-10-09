import * as path from "path";

const ROOT = path.resolve(__dirname, "..");

const root = (dir: string) => path.join(ROOT, dir);

export {root};
