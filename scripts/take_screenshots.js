import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const OUT_DIR = path.resolve('docs/screenshots');

if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
}

async function takeScreenshots() {
    console.log('Launching headless Chrome...');
    const browser = await puppeteer.launch({
        executablePath: CHROME_PATH,
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,960']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 960, deviceScaleFactor: 2 });

    // 1. Landing Page
    console.log('1. Capturing Landing Page...');
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
    await page.waitForSelector('#hero');
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(OUT_DIR, '01_landing_page.png'), fullPage: false });

    // 2. Login Page with Demo Fillers
    console.log('2. Capturing Login Page...');
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.join(OUT_DIR, '02_login_portal.png') });

    // 3. Student Alice Login & Dashboard
    console.log('3. Logging in as Student Alice...');
    await page.goto('http://localhost:5173/login?role=Student', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle0' }).catch(() => {});
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: path.join(OUT_DIR, '03_student_dashboard.png'), fullPage: false });

    // 4. Project Details & Kanban Board
    console.log('4. Navigating to Project Workspace...');
    const projectLink = await page.$('a[href*="/project/"]');
    if (projectLink) {
        await projectLink.click();
        await page.waitForNavigation({ waitUntil: 'networkidle0' }).catch(() => {});
        await new Promise(r => setTimeout(r, 1500));
        await page.screenshot({ path: path.join(OUT_DIR, '04_kanban_workspace.png'), fullPage: false });
    }

    // 5. Supervisor Dr. Smith Dashboard
    console.log('5. Logging in as Supervisor Dr. Smith...');
    const supervisorContext = await browser.createBrowserContext();
    const supervisorPage = await supervisorContext.newPage();
    await supervisorPage.setViewport({ width: 1440, height: 960, deviceScaleFactor: 2 });
    await supervisorPage.goto('http://localhost:5173/login?role=Supervisor', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));
    await supervisorPage.click('button[type="submit"]');
    await supervisorPage.waitForNavigation({ waitUntil: 'networkidle0' }).catch(() => {});
    await new Promise(r => setTimeout(r, 1500));
    await supervisorPage.screenshot({ path: path.join(OUT_DIR, '05_supervisor_dashboard.png'), fullPage: false });

    // 6. Admin Dashboard
    console.log('6. Logging in as Admin Dean Vance...');
    const adminContext = await browser.createBrowserContext();
    const adminPage = await adminContext.newPage();
    await adminPage.setViewport({ width: 1440, height: 960, deviceScaleFactor: 2 });
    await adminPage.goto('http://localhost:5173/login?role=Admin', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));
    await adminPage.click('button[type="submit"]');
    await adminPage.waitForNavigation({ waitUntil: 'networkidle0' }).catch(() => {});
    await new Promise(r => setTimeout(r, 1500));
    await adminPage.screenshot({ path: path.join(OUT_DIR, '06_admin_dashboard.png'), fullPage: false });

    await browser.close();
    console.log('All screenshots captured successfully in docs/screenshots/ !');
}

takeScreenshots().catch(err => {
    console.error('Error taking screenshots:', err);
    process.exit(1);
});
