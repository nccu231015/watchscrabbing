export default async function createbrowser(scrabfunction){
    const CHROMIUM_PATH =
    "https://vomrghiulbmrfvmhlflk.supabase.co/storage/v1/object/public/chromium-pack/chromium-v123.0.0-pack.tar";
      let browser;
      try {
          browser = await puppeteerCore.launch({
              args: Chromium.args,
              defaultViewport: Chromium.defaultViewport,
              executablePath: await Chromium.executablePath(CHROMIUM_PATH),
              headless: Chromium.headless,
          });
          const page = await browser.newPage();
          FastLoad(page);
          await page.goto("https://ttwatches.com/products.php");
          const pages = await page.evaluate(() => {
              const pg = document.querySelector('#boxWidth > div.pagenums > select > option:nth-last-child(1)');
              return pg.innerText;
          });
          return pages;
      } catch (error) {
          console.error('Error in TT_count:', error);
      } finally {
          if (browser) {
              await browser.close();
          }
      }
}