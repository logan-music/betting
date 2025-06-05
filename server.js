const puppeteer = require('puppeteer-core');
const chromeLambda = require('chrome-aws-lambda');
const axios = require('axios');
const { parse } = require('cookie');
const puppeteerExtra = require('puppeteer-extra');
const puppeteerExtraPluginStealth = require('puppeteer-extra-plugin-stealth');
const puppeteerExtraPluginAdblocker = require('puppeteer-extra-plugin-adblocker');

// Initialize the plugins for puppeteer
puppeteerExtra.use(puppeteerExtraPluginStealth());
puppeteerExtra.use(puppeteerExtraPluginAdblocker());

const login = async () => {
    // Launch the browser
    let browser = null;
    let page = null;
    
    try {
        browser = await puppeteerExtra.launch({
            headless: true,
            args: [
                ...chromeLambda.args,
                '--no-sandbox',
                '--disable-setuid-sandbox',
            ],
            executablePath: await chromeLambda.executablePath,
            defaultViewport: chromeLambda.defaultViewport,
        });

        page = await browser.newPage();

        console.log('Navigating to BetPawa login page...');
        await page.goto('https://www.betpawa.co.tz/login');

        // Wait for page to load and display the phone number field
        await page.waitForSelector('input[type="tel"]');

        // Enter the phone number and password
        console.log('Filling login details...');
        await page.type('input[type="tel"]', '+255618306398', { delay: 100 });
        await page.type('input[type="password"]', 'na3#', { delay: 100 });

        // Submit the form (click login button)
        await page.click('button[type="submit"]');
        
        // Wait for navigation after login
        await page.waitForNavigation({ waitUntil: 'networkidle0' });

        console.log('Login successful!');

        // Save cookies after successful login
        const cookies = await page.cookies();
        console.log('Cookies saved:', cookies);

        // Send cookies to your Telegram Bot or log them to the console
        await sendCookiesToBot(cookies);

    } catch (err) {
        console.error('Error during login:', err);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
};

const sendCookiesToBot = async (cookies) => {
    const telegramBotToken = '7501645118:AAHuL5xMbPY3WZXJVnidijR9gqoyyCS0BzY';
    const chatId = '6978133426';
    
    // Send the cookies to the bot
    const message = `Cookies:\n${JSON.stringify(cookies, null, 2)}`;
    
    const url = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;
    try {
        await axios.post(url, {
            chat_id: chatId,
            text: message
        });
        console.log('Cookies sent to Telegram bot!');
    } catch (err) {
        console.error('Error sending cookies to Telegram bot:', err);
    }
};

login();