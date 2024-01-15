import { Http } from "./http.js";

import { load } from "cheerio";

import fs from "fs";

import { slugify, removeHTMLComments } from "./helpers/index.js";

export class Main {
  constructor() {
    this.httpManager = new Http();
  }

  save(filename, data) {
    if (!fs.existsSync("./results")) {
      fs.mkdirSync("./results");
    }

    fs.writeFileSync(
      `./results/${slugify(filename)}.json`,
      JSON.stringify(data)
    );
  }

  getRaceData($) {
    const raceName = $("title").text();
    const raceDate = $(
      "#header-wrapper > div > div.racecard-header.container > div > div.split-left > span.race > abbr"
    ).attr("data-utime");
    const raceDistance = $(
      "#header-wrapper > div > div.racecard-header.container > div > div.split-left > div > span"
    ).text();

    return {
      raceName,
      raceDate,
      raceDistance,
    };
  }

  getRunnersData($) {
    const runners = [];

    $("#runner-list-table tbody tr").each((index, element) => {
      const $row = $(element);

      const tableQueries = {
        number: ".anumbers",
        name: ".anames",
        trainer: ".atrainer",
        jockey: ".ajockey",
        ageSex: ".aas",
        days: ".adays",
        averageEarnings: ".aave",
        careerStats: ".acareer",
        winPercentage: ".awin",
        placePercentage: ".aplace",
        last6: ".alast6",
        rating: ".arating",
        fixedWinPrice: ".awinprice",
      };

      const runnerData = Object.entries(tableQueries).reduce(
        (prev, [key, search]) => {
          const res = removeHTMLComments($row.find(search).text().trim());

          return Object.assign(prev, { [key]: res });
        },
        {}
      );

      const $runner = $(`.runner-row[data-sort-name="${runnerData.name}"]`);

      const furtherDetailQueries = {
        prizemoney: 'td:contains("Prizemoney")',
        ave: 'td:contains("Ave")',
        winRange: 'td:contains("Win Range")',
        place: 'td:contains("Place")',
        career: 'td:contains("Career")',
        twelveMonths: 'td:contains("12 months")',
        turf: 'td:contains("Turf")',
        jumps: 'td:contains("Jumps")',
        synthetic: 'td:contains("Synthetic")',
        firstUp: 'td:contains("1st Up")',
        secondUp: 'td:contains("2nd Up")',
        thridUp: 'td:contains("3rd Up")',
        track: 'td:contains("Track")',
        trkDist: 'td:contains("Trk/Dist")',
        firm: 'td:contains("Firm")',
        good: 'td:contains("Good")',
        soft: 'td:contains("Soft")',
        heavy: 'td:contains("Heavy")',
      };

      const additionalData = Object.entries(furtherDetailQueries).reduce(
        (prev, [key, search]) => {
          const res = removeHTMLComments(
            $runner.find(search).html().split("<br>").at(1).trim()
          );

          return Object.assign(prev, { [key]: res });
        },
        {}
      );

      const runner = {
        ...runnerData,
        ...additionalData,
      };

      runners.push(runner);
    });

    return runners;
  }

  timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async execute() {
    // Url path to the full form page
    let race = 1582942;

    do {
      const path = `260090/${race}/#01`;

      const html = await this.httpManager.get(path);

      const $ = load(html);

      const raceData = this.getRaceData($);

      const runners = this.getRunnersData($).reduce((prev, runner) => {
        prev.push({
          ...raceData,
          ...runner,
        });
        return prev;
      }, []);

      this.save(path, runners);

      await this.timeout(1000);
      race++;
    } while (race < race + 100);
  }
}
