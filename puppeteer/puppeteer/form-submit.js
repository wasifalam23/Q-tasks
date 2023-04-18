const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto('http:/localhost:35245');

  const delay = { delay: 100 };

  await page.keyboard.press('Tab', delay);
  await page.keyboard.type('test@test.com', delay);
  await page.keyboard.press('Tab', delay);
  await page.keyboard.type('test1234', delay);
  await page.keyboard.press('Tab', delay);
  await page.keyboard.press('Enter', delay);
})();
