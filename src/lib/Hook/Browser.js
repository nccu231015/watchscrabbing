"use server"
import puppeteer from 'puppeteer-core';
import chromium from "@sparticuz/chromium"

export default async function createBrowser() {

    const browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(), // fallback for local development
        headless: chromium.headless,
        ignoreHTTPSErrors: true,
    });

    return browser;
}

