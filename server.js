const chromium = require('chrome-aws-lambda');

const phoneNumber = '618306398'; // badilisha hapa
const password = 'na3#'; // badilisha hapa

const login = async () => {
  try {
    const browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    });

    const page = await browser.newPage();

    console.log('Opening BetPawa login page...');
    await page.goto('https://www.betpawa.co.tz/login', { waitUntil: 'networkidle2' });

    await page.type('input[type="tel"]', phoneNumber);
    await page.type('input[type="password"]', password);

    console.log('Submitting login form...');
    await page.click('button[type="submit"]');

    await page.waitForTimeout(5000);

    const currentUrl = page.url();
    console.log('Current URL after login:', currentUrl);

    const content = await page.content();
    console.log('Page content snippet:', content.slice(0, 500));

    await browser.close();
  } catch (err) {
    console.error('Login failed:', err.message);
  }
};

login();
