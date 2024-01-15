import { Main } from "./src/main.js";

const main = new Main();

try {
  main.execute();
} catch (err) {
  console.error(err);
}
