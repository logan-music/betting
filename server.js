const chromium = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');
const axios = require('axios');

// Telegram config
const BOT_TOKEN = '7501645118:AAHuL5xMbPY3WZXJVnidijR9gqoyyCS0BzY';
const CHAT_ID = '6978133426';

exports.handler = async () => {
  let browser = null;

  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath,
      headless: chromium.headless
    });

    const page = await browser.newPage();
    await page.goto('https://www.betpawa.co.tz/login', { waitUntil: 'networkidle2' });

    // Ingiza namba bila +255
    await page.type('input[type="tel"]', '618306398');
    await page.type('input[type="password"]', 'na3#');
    await page.waitForTimeout(1000); // delay ndogo

    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle0' });

    const url = page.url();
    if (url.includes('login')) {
      throw new Error('Login failed!');
    }

    await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      chat_id: CHAT_ID,
      text: '✅ Login ya BetPawa imefanikiwa!'
    });

  } catch (error) {
    console.error(error);
    await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      chat_id: CHAT_ID,
      text: `❌ Error: ${error.message}`
    });
  } finally {
    if (browser) await browser.close();
  }
};
