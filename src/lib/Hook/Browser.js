import puppeteer from 'puppeteer-core';
import chromium from "@sparticuz/chromium"

export default async function createBrowser() {
    const executablePath = await chromium.executablePath;

    const browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: executablePath || '/path/to/local/chrome', // fallback for local development
        headless: chromium.headless,
    });

    return browser;
}

