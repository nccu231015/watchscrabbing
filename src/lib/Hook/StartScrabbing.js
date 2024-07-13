import { Cluster } from 'puppeteer-cluster';
import Chromium from "@sparticuz/chromium";
import puppeteer from 'puppeteer-core';
import { TT_main,TT_url } from '../TTWatches.js';
import { AGan_main, url_AG } from '../AGan.js';

let clusterInstance = null;

const createCluster = async () => {
    return await Cluster.launch({
        concurrency: Cluster.CONCURRENCY_BROWSER,
        maxConcurrency: 5,
        puppeteer,
        puppeteerOptions: {
            args: Chromium.args,
            defaultViewport: Chromium.defaultViewport,
            executablePath: await Chromium.executablePath(),
            headless: Chromium.headless,
        },
        timeout: 360000,
    });
}

const getClusterInstance = async () => {
    if (!clusterInstance) {
        clusterInstance = await createCluster();
    }
    return clusterInstance;
}

export const clusterTask = async (w, shop, pages) => {
    console.log("start to get cluster instance")
    const cluster = await getClusterInstance();

    console.log("cluster Instance getting")

    cluster.on('taskerror', (err, data) => {
        console.error(`Error crawling ${data}: ${err.message}`);
    });

    console.log("Starting crawl");

    if (shop === "TT") {
        const TT_urls = [];
        for (let i = 0; i < pages; i++) {
            TT_urls.push(TT_url(i + 1));
        }

        for (const u of TT_urls) {
            cluster.queue({ url: u, database: w }, TT_main);
        }
    }

    if(shop === "AG") {
        const AG_urls = [];
        for (let i = 0; i < pages; i++) {
            AG_urls.push(url_AG(i + 1));
        }

        for (const u of AG_urls) {
            cluster.queue({ url: u, database: w }, AGan_main);
        }
    }

    await cluster.idle();
    await cluster.close();
    console.log("Crawling done");
}