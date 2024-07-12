import { Cluster } from 'puppeteer-cluster';
import { watchesss } from './Database/database.js';
import Chromium from "@sparticuz/chromium";
import puppeteerCore from 'puppeteer-core';
import { TT_main,TT_url } from '../TTWatches.js';


const createCluster = async () => {
    return await Cluster.launch({
        concurrency: Cluster.CONCURRENCY_CONTEXT,
        maxConcurrency: 5,
        puppeteerCore,
        puppeteerOptions: {
            args: Chromium.args,
            defaultViewport: Chromium.defaultViewport,
            executablePath: await Chromium.executablePath(),
            headless: Chromium.headless,
            ignoreHTTPSErrors: true,
        },
        monitor: true,
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
    const cluster = await getClusterInstance();

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
            cluster.queue({ url: u, database: w }, async ({ page, data }) => {
                // Define your scraping logic here
            });
        }
    }

    await cluster.idle();
    await cluster.close();
    console.log("Crawling done");
}