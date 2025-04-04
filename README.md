# 📊 Pulse Review Scraper

A Node.js-based web scraper that collects user reviews from SaaS platforms like G2 and Capterra using Puppeteer and Cheerio. Built as part of the Pulse coding assignment.

---

## 🔧 Features

- ✅ Scrape reviews from **G2**
- ✅ Extracts review **title**, **rating**, **body**, and **date**
- ✅ Filters reviews between a specified **start** and **end date**
- ✅ Saves results in a **structured JSON** file
- ✅ Uses Puppeteer for browser automation
- ✅ Bonus: Modular code structure for easy extension

---

## 🚀 How to Run

### 1. Clone the Repository
```bash
git clone https://github.com/guntojushiv/pulse-review-scraper.git
cd pulse-review-scraper
2. Install Dependencies
npm install
3. Run the Scraper
node main.js --website=g2 --company_name=hubspot --start_date=2023-01-01 --end_date=2023-12-31 --output=g2-hubspot.json
✅ CLI Options
Option	Description	Example
--website	Source website (e.g., g2)	--website=g2
--company_name	SaaS product slug from URL	--company_name=hubspot
--start_date	Start date for filtering reviews	--start_date=2023-01-01
--end_date	End date for filtering reviews	--end_date=2023-12-31
--output	Output JSON file name	--output=g2-hubspot.json
📁 Folder Structure
pulse-review-scraper/
│
├── lib/
│   ├── g2.js            # G2 scraper using Puppeteer
│   └── capterra.js      # (Coming Soon)
│
├── main.js              # Entry point for running scraper
├── package.json         # Project metadata and dependencies
└── README.md            # You're here!
📸 Sample Output (JSON)
[
  {
    "date": "March 2, 2023",
    "rating": "5",
    "title": "Great tool for scaling!",
    "body": "HubSpot helped us streamline our sales pipeline.",
    "parsedDate": "2023-03-02T00:00:00.000Z"
  },
  ...
]
