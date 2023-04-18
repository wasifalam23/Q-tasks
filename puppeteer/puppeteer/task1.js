const puppeteer = require('puppeteer');

/*
****Have to bring this output**** 
[ 'Snapdeal', 'Kunal Bahl', 'India' ] 
[ 'Alfreds Futterkiste', 'Maria Anders', 'Germany' ] 
[ 'Centro comercial Moctezuma', 'Francisco Chang', 'Mexico' ] 
[ 'Flipkart', 'Sachin Bansal', 'India' ]
*/

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto('http://localhost:44599');

  const tdsArr = await page.evaluate(() => {
    const tbody = document.querySelector('tbody');
    const trs = [...tbody.querySelectorAll('tr')];

    const arrOfTdArr = trs.map((tr) => {
      const tds = [...tr.querySelectorAll('td')];
      const tdArr = tds.map((td) => td.textContent);
      return tdArr;
    });

    return arrOfTdArr;
  });

  console.log(...tdsArr);

  // await browser.close();
})();
