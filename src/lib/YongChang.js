import puppeteerCore from "puppeteer-core";
import { Cluster } from "puppeteer-cluster";
import { watchesss } from "./Database/database.js";
import puppeteer from "puppeteer";
import mongoose from "mongoose";
import { FastLoad } from "./Hook/FastLoad.js";
import moment from "moment";
import Chromium from "@sparticuz/chromium";
import sendMessageToChannel from "./Hook/DiscordMessage.js";

export const url_YC = (pg) => {
  return `https://www.watchart.com/watches.html?type=1&category=0&page=${pg}`;
};

export const YC_count = async () => {
  // const CHROMIUM_PATH =
  // "https://vomrghiulbmrfvmhlflk.supabase.co/storage/v1/object/public/chromium-pack/chromium-v123.0.0-pack.tar";
  let browser;
  try {
    // browser = await puppeteerCore.launch({
    //     args: Chromium.args,
    //     defaultViewport: Chromium.defaultViewport,
    //     executablePath: await Chromium.executablePath(CHROMIUM_PATH),
    //     headless: Chromium.headless,
    // });
    browser = await puppeteer.launch();
    const page = await browser.newPage();

    let currentpages = 11;
    let finalpages = false;

    let setfinalpages = () => {
      finalpages = true;
    };

    await page.goto(url_YC(currentpages - 1), {
      waitUntil: "domcontentloaded",
    });

    while (!finalpages) {
      while ((await page.url()) != url_YC((currentpages - 1) * 30)) {
        await page.waitForSelector(
          "body > section.box__pagination > div > div > a:nth-last-child(2)"
        );
        await page.click(
          "body > section.box__pagination > div > div > a:nth-last-child(2)"
        );
      }
      await page.waitForSelector(
        "body > section.box__pagination > div > div > a:nth-last-child(2)"
      );
      const pages_number = await page.evaluate(() => {
        const arrow = document.querySelectorAll(
          "body > section.box__pagination > div > div > a > img"
        );
        const currentlastpages = document.querySelector(
          "body > section.box__pagination > div > div > a:nth-last-child(2)"
        );
        return [arrow.length, currentlastpages.innerText];
      });
      if (pages_number[0] == 1) {
        setfinalpages();
      } else {
        currentpages = pages_number[1];
      }
    }
    return currentpages;
  } catch (error) {
    console.error("Error in TT_count:", error);
  } finally {
    await browser.close();
  }
};

//{page,data}

export const YC = async ({ page, data }) => {
  // await mongoose.connect('mongodb://localhost/Watch_Srapping');
  // const url = "https://www.watchart.com/watches.html?type=1&category=0&page=30"
  // const browser = await puppeteer.launch({headless:false})
  // const page = await browser.newPage()
  // const database = watch
  const { url, database } = data;

  // ********* ******* //
  await page.goto(url, { waitUntil: "domcontentloaded" });
  await page.waitForSelector(".detail__sn");

  // check the home page

  // ********* ******* //
  const watches = await page.evaluate(() => {
    const _wacthCollection = [];
    const name_sn = document.querySelectorAll(".detail__sn");
    const name_en = document.querySelectorAll(".detail__en");
    const name_name = document.querySelectorAll(".detail__name");
    const name_ref = document.querySelectorAll(".detail__ref");
    const price = document.querySelectorAll(".detail__price");
    const photos = document.querySelectorAll(
      "li.item__pic.aspect-ratio > div > img"
    );
    for (let i = 0; i < name_sn.length; i++) {
      const name =
        name_sn[i].innerText +
        name_en[i].innerText +
        name_name[i].innerText +
        name_ref[i].innerText;
      const photo_url =
        "https://www.watchart.com" + photos[i].getAttribute("src");
      const price_number = parseInt(
        price[i].innerText.replace(/[^0-9]/g, ""),
        10
      );
      _wacthCollection.push([name, price_number, photo_url]);
    }
    return [_wacthCollection, name_sn.length];
  });

  //check if it's on the db

  //********************************************************************** */
  for (let i = 0; i < watches[1]; i++) {
    try {
      const [watchsereis, price, photo] = watches[0][i];
      const exists = await database.exists({ watchsereis: watchsereis });
      const watch = await database.where("watchsereis").equals(watchsereis);

      if (exists) {
        const lastUpdatedAt = moment(watch[0].latestUpdate).utc();
        const now = moment().utc();
        const difference = now.diff(lastUpdatedAt, "minutes");
        watch[0].latestUpdate = moment();
        await watch[0].save();
        const v = watch[0].__v;

        if (watch.length == 1 && difference >= 0.5 && v < 10) {
          if (
            watch[0].prices[watch[0].prices.length - 1].price == price &&
            difference >= 0.5
          ) {
            continue;
          } else {
            sendMessageToChannel(
              `!!!!價格變更通知
              ${watch[0].name} 有更新價格，價格為 ${price}，快速前往網址：${watch[0].webp}`
            );
            sendMessageToChannel(
              `快速播打電話: https://watchscrapping.store/phone`
            );
            console.log(
              `${watchsereis} already in the database, update prices`
            );
            await watch[0].prices.push({ price: price });
            await watch[0].save();
            continue;
          }
        }
      }

      while ((await page.url()) == url) {
        await page.click(
          `body > section.box__clist > div > ul:nth-child(2) > li:nth-child(${
            i + 1
          })`,
          { waitUntil: "networkidle0" }
        );
      }

      // 確保導航完成後再進行評估
      // await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
      await page.waitForSelector(
        "body > section.box__product > div > ul > ul.box__ainfo > ul:nth-child(2) > li:nth-child(1) > p.con-text-text.con-text-Lora.font-black"
      );

      const info = await page.evaluate(() => {
        const series_name =
          document.querySelector(
            "body > section.box__product > div > ul > ul.box__ainfo > ul:nth-child(2) > li:nth-child(1) > p.con-text-text.con-text-Lora.font-black"
          )?.innerText || "";
        const material =
          document.querySelector(
            "body > section.box__product > div > ul > ul.box__ainfo > ul:nth-child(2) > li:nth-child(5) > p.con-text-text.con-text-Lora.font-black"
          )?.innerText || "";
        const status =
          document.querySelector(
            "body > section.box__product > div > ul > ul.box__ainfo > ul:nth-child(2) > li:nth-child(7) > p.con-text-text.con-text-Lora.font-black"
          )?.innerText || "";
        const core =
          document.querySelector(
            "body > section.box__product > div > ul > ul.box__ainfo > ul:nth-child(2) > li.ainfo__caliber > p.con-text-text.con-text-Lora.font-black"
          )?.innerText || "";
        const size =
          document.querySelector(
            "body > section.box__product > div > ul > ul.box__ainfo > ul:nth-child(2) > li:nth-child(5) > p.con-text-text.con-text-Lora.font-black"
          )?.innerText || "";
        const box_placeholder =
          document.querySelector(
            "body > section.box__product > div > ul > ul.box__ainfo > ul:nth-child(2) > li:nth-child(5) > p.con-text-text.con-text-Lora.font-black"
          )?.innerText || "";
        const insurance_placeholder =
          document.querySelector(
            "body > section.box__product > div > ul > ul.box__ainfo > ul:nth-child(3) > li:nth-child(2) > p.con-text-text.con-text-Lora.font-black"
          )?.innerText || "";

        const insurance =
          insurance_placeholder === "無"
            ? ""
            : `保險: ${insurance_placeholder}`;
        const box = box_placeholder === "無" ? "" : "有附盒";

        const series_number =
          document.querySelector(
            "body > section.box__product > div > ul > ul.box__ainfo > ul:nth-child(2) > li:nth-child(3) > p.con-text-text.con-text-Lora.font-black"
          )?.innerText || "";

        return `${series_name} ${material} ${core} ${box} ${insurance} ${size} ${status} `;
      });

      watches[0][i].push(info);
      const [watchsereis_, price_, photo_, name_] = watches[0][i];
      const exists_ = await database.exists({
        name: watchsereis_ + " " + name_,
      });
      const watch_ = await database
        .where("name")
        .equals(watchsereis_ + " " + name_);
      if (!exists_) {
        await database.create({
          name: watchsereis_ + " " + name_,
          prices: [
            {
              price: price_,
            },
          ],
          stores: "永昌鐘錶行",
          photos: photo_,
          watchsereis: watchsereis_,
          webp: page.url(),
        });
        await console.log(watchsereis_ + "added sucessfully");
        sendMessageToChannel(
          `!!!!!手錶新增通知
          有一個新的手錶 ${
            watchsereis_ + " " + name_
          } 已新增，價格為 ${price_}，快速前往網址：${page.url()}`
        );
        sendMessageToChannel(
          `快速播打電話: https://watchscrapping.store/phone`
        );
      } else if (
        watch_[0].prices[watch_[0].prices.length - 1].price != price_ &&
        watch_[0].__v.length < 10
      ) {
        await watch_[0].prices.push({ price: price_ });
        await watch_[0].save();
        sendMessageToChannel(
          `!!!!價格變更通知
          ${watch_[0].name} 有更新價格，價格為 ${price_}，快速前往網址：${watch_[0].webp}`
        );
        sendMessageToChannel(
          `快速播打電話: https://watchscrapping.store/phone`
        );
        console.log(`${watchsereis_} already in the database, update prices`);
      }
      await page.goto(url, { waitUntil: "domcontentloaded" });
    } catch (error) {
      console.log(`Error when checking for duplicated: ${error}`);
    }
  }

  await page.close();
};
