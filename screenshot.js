const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Set viewport for a desktop size
  await page.setViewport({ width: 1280, height: 800 });
  
  // Navigate to local client
  await page.goto('http://localhost:5173/signup', { waitUntil: 'networkidle0' });
  
  // Take screenshot
  await page.screenshot({ path: 'screenshot.png', fullPage: true });
  
  console.log('Screenshot saved as screenshot.png');
  await browser.close();
})();
