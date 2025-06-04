const chromium = require('chrome-aws-lambda');

(async () => {
  let browser = null;

  try {
    browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath || '/usr/bin/chromium-browser',
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    console.log('[+] Opening BetPawa login page...');
    await page.goto('https://www.betpawa.co.tz/login', { waitUntil: 'networkidle2' });

    console.log('[+] Typing phone number...');
    await page.waitForSelector('input[type="tel"]', { timeout: 10000 });
    await page.type('input[type="tel"]', '618306398', { delay: 100 });

    console.log('[+] Typing password...');
    await page.waitForSelector('input[type="password"]', { timeout: 10000 });
    await page.type('input[type="password"]', 'na3#', { delay: 100 });

    console.log('[+] Clicking login...');
    await page.waitForSelector('button[type="submit"]', { timeout: 10000 });
    await page.click('button[type="submit"]');

    console.log('[+] Waiting for login to complete...');
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15000 });

    console.log('[✅] Logged in successfully! Current URL:', page.url());

  } catch (error) {
    console.error('[❌] Login failed:', error.message);
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }
})();
