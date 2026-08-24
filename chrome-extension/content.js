// content.js
// This script runs in the context of the web page

function extractData() {
  let title = '';
  let company = '';

  const hostname = window.location.hostname;

  try {
    if (hostname.includes('linkedin.com/jobs')) {
      title = document.querySelector('h1.t-24')?.innerText || document.querySelector('.job-details-jobs-unified-top-card__job-title')?.innerText || '';
      company = document.querySelector('.job-details-jobs-unified-top-card__company-name')?.innerText || '';
    } else if (hostname.includes('indeed.com')) {
      title = document.querySelector('h1.jobsearch-JobInfoHeader-title')?.innerText || '';
      company = document.querySelector('[data-testid="inlineHeader-companyName"]')?.innerText || '';
    }
  } catch (e) {
    console.warn('CareerSync Clipper: Could not extract specific DOM elements, falling back.', e);
  }

  // Clean up LinkedIn's weird spacing
  title = title.replace(/\s+/g, ' ').trim();
  company = company.replace(/\s+/g, ' ').trim();

  return { title, company };
}

// Immediately invoke and return the result to the caller (popup.js)
extractData();
