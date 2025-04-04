import puppeteer from 'puppeteer';
import { parse } from 'date-fns';

export async function scrapeG2Reviews(companyName, startDate, endDate) {
  const reviews = [];
  const browser = await puppeteer.launch({ headless: false, slowMo: 100 });
  const page = await browser.newPage();

  let pageNum = 1;
  let hasNextPage = true;

  while (hasNextPage) {
    const url = `https://www.g2.com/products/${companyName}/reviews?page=${pageNum}`;
    console.log(`🔎 Navigating to: ${url}`);

    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
    );
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 0 });

    // Scroll to bottom slowly to trigger lazy load
    await autoScroll(page);

    // Take screenshot for debug
    await page.screenshot({ path: `g2-page-${pageNum}.png`, fullPage: true });

    // Wait for reviews to appear
    const reviewExist = await page.$('.paper.paper--no-padding.p-lg');
    if (!reviewExist) {
      console.log('❌ No review elements found. Possibly blocked or no reviews.');
      break;
    }

    const reviewsOnPage = await page.$$eval('.paper.paper--no-padding.p-lg', (nodes) => {
      return nodes.map((node) => {
        const date = node.querySelector('[itemprop="datePublished"]')?.textContent?.trim();
        const rating = node.querySelector('[itemprop="ratingValue"]')?.textContent?.trim();
        const title = node.querySelector('.review-item-heading')?.textContent?.trim();
        const body = node.querySelector('.show-more__content')?.textContent?.trim();
        return { date, rating, title, body };
      });
    });

    for (const r of reviewsOnPage) {
      const parsedDate = parse(r.date, 'MMMM d, yyyy', new Date());
      if (parsedDate >= startDate && parsedDate <= endDate) {
        reviews.push({ ...r, parsedDate: parsedDate.toISOString() });
      } else if (parsedDate < startDate) {
        hasNextPage = false;
        break;
      }
    }

    pageNum++;
    await page.waitForTimeout(2000);
  }

  await browser.close();
  return reviews;
}

// Helper: Scroll down the page to load all reviews
async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 200;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;
        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
}
