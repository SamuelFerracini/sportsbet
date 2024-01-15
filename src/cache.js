import fs from "fs";

import { slugify } from "./helpers/slugfy.js";

export class Cache {
  constructor() {
    this.base = "./cache";
  }

  _createCacheFolderIfNotExists() {
    if (!fs.existsSync(this.base)) {
      fs.mkdirSync(this.base);
    }
  }

  _prepareFilename(name) {
    return `${this.base}/${slugify(name)}`;
  }

  cache(name, data) {
    this._createCacheFolderIfNotExists();

    fs.writeFileSync(this._prepareFilename(name), data, "utf-8");
  }

  getCached(name) {
    this._createCacheFolderIfNotExists();

    const exists = fs.existsSync(this._prepareFilename(name));

    if (exists) {
      return fs.readFileSync(this._prepareFilename(name), {
        encoding: "utf-8",
      });
    }

    return null;
  }
}
