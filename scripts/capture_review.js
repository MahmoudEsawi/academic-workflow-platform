import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const OUT_DIR = path.resolve('docs/screenshots');

async function captureReview() {
    const browser = await puppeteer.launch({
        executablePath: CHROME_PATH,
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,960']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 960, deviceScaleFactor: 2 });

    // Login as Dr. Smith
    await page.goto('http://localhost:5173/login?role=Supervisor', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle0' }).catch(() => {});
    await new Promise(r => setTimeout(r, 1200));

    // Open project
    const projectLink = await page.$('a[href*="/project/"]');
    if (projectLink) {
        await projectLink.click();
        await page.waitForNavigation({ waitUntil: 'networkidle0' }).catch(() => {});
        await new Promise(r => setTimeout(r, 1200));

        // Click Review on Task 4
        const reviewLink = await page.$('a[href*="/review/"]');
        if (reviewLink) {
            await reviewLink.click();
            await page.waitForNavigation({ waitUntil: 'networkidle0' }).catch(() => {});
            await new Promise(r => setTimeout(r, 1500));
            await page.screenshot({ path: path.join(OUT_DIR, '05_code_review_console.png'), fullPage: false });
            console.log('05_code_review_console.png captured!');
        }
    }

    await browser.close();
}

captureReview().catch(console.error);
