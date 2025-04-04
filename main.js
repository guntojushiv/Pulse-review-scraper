// main.js
import { scrapeCapterra } from './lib/capterra.js';
import { scrapeG2Reviews } from './lib/g2.js';
import fs from 'fs';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import dotenv from 'dotenv';
import chalk from 'chalk';

// Load environment variables
dotenv.config();

// Parse CLI arguments
const argv = yargs(hideBin(process.argv))
  .usage('Usage: node $0 --website=<g2|capterra> --company_name="..." --start_date=YYYY-MM-DD --end_date=YYYY-MM-DD [--url=...] [--output=filename.json]')
  .option('website', {
    alias: 'w',
    describe: 'Source website: g2 or capterra',
    type: 'string',
    demandOption: true,
  })
  .option('company_name', {
    alias: 'c',
    describe: 'Name of the company to scrape reviews for',
    type: 'string',
    demandOption: true,
  })
  .option('start_date', {
    alias: 's',
    describe: 'Start date (YYYY-MM-DD)',
    type: 'string',
    demandOption: true,
  })
  .option('end_date', {
    alias: 'e',
    describe: 'End date (YYYY-MM-DD)',
    type: 'string',
    demandOption: true,
  })
  .option('url', {
    describe: 'Review URL (for capterra only)',
    type: 'string',
  })
  .option('output', {
    alias: 'o',
    describe: 'Output filename to save reviews (default: output.json)',
    type: 'string',
    default: 'output.json',
  })
  .help()
  .argv;

// Extract & validate values
const website = argv.website;
const company_name = argv.company_name;
const startDate = new Date(argv.start_date);
const endDate = new Date(argv.end_date);
const url = argv.url;
const outputFile = argv.output;

if (isNaN(startDate) || isNaN(endDate)) {
  console.error(chalk.red('❌ Invalid date format. Use YYYY-MM-DD.'));
  process.exit(1);
}

console.log(chalk.blue(`🚀 Starting review scraping for "${company_name}" on ${website.toUpperCase()}...`));

(async () => {
  try {
    let reviews = [];

    if (website === 'g2') {
      reviews = await scrapeG2Reviews(company_name, startDate, endDate);
    } else if (website === 'capterra') {
      if (!url) {
        console.error(chalk.red('❌ URL is required for capterra scraping.'));
        process.exit(1);
      }
      reviews = await scrapeCapterra(company_name, startDate, endDate, url);
    } else {
      console.error(chalk.red('❌ Invalid website. Choose either "g2" or "capterra".'));
      process.exit(1);
    }

    if (!reviews || reviews.length === 0) {
      console.warn(chalk.yellow('⚠️ No reviews found. The website may be blocking scraping or no reviews match the criteria.'));
    }

    // Save to file
    fs.writeFileSync(outputFile, JSON.stringify(reviews, null, 2));
    console.log(chalk.green(`✅ Scraping complete. Reviews saved to ${outputFile}`));
  } catch (error) {
    if (error.response && error.response.status === 403) {
      console.error(chalk.red('❌ 403 Forbidden: You are being blocked. Try using proxies or Puppeteer.'));
    } else {
      console.error(chalk.red(`❌ Error during scraping: ${error.message}`));
    }
  }
})();