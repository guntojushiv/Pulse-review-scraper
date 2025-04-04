import axios from 'axios';
import { JSDOM } from 'jsdom';

/**
 * Scrape reviews from Capterra for the given company and URL.
 * @param {string} companyName - The name of the company.
 * @param {Date} startDate - Start date for filtering reviews.
 * @param {Date} endDate - End date for filtering reviews.
 * @param {string} url - Capterra product URL.
 * @returns {Promise<Array>} Array of review objects.
 */
export async function scrapeCapterra(companyName, startDate, endDate, url) {
  console.log(`🚀 Starting review scraping for "${companyName}" on CAPTERRA...`);

  const reviews = [];

  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept': 'text/html,application/xhtml+xml',
      },
    });

    const dom = new JSDOM(response.data);
    const document = dom.window.document;

    const reviewElements = document.querySelectorAll('.review');

    reviewElements.forEach((el) => {
      const dateText = el.querySelector('time')?.getAttribute('datetime') || '';
      const reviewDate = new Date(dateText);
      const reviewText = el.textContent.trim();

      if (
        reviewDate &&
        reviewText &&
        reviewDate >= startDate &&
        reviewDate <= endDate
      ) {
        reviews.push({
          company: companyName,
          date: reviewDate.toISOString(),
          content: reviewText,
          source: "Capterra",
        });
      }
    });

  } catch (error) {
    console.error("❌ Error during scraping:", error.message);
  }

  return reviews;
}
