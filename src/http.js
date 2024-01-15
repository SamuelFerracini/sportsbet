import axios from "axios";

import { Cache } from "./cache.js";

export class Http {
  constructor() {
    this.instance = axios.create({
      baseURL: "https://www.sportsbetform.com.au",
    });

    this.cacheManager = new Cache();
  }

  async get(url) {
    const cachedData = this.cacheManager.getCached(url);

    if (cachedData) return cachedData;

    const response = await this.instance.get(url);

    if (response.data) this.cacheManager.cache(url, response.data);

    return response.data;
  }
}
