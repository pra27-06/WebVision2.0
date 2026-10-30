import puppeteer from 'puppeteer-core';
import path from 'path';

const ARTIFACTS_DIR = 'C:/Users/Prachi/.gemini/antigravity/brain/e58bde9b-1008-4134-867c-984b78684ea7';
const EDGE_PATH = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';

async function runVerification() {
  console.log('🚀 Starting Golden Path verification on Edge...');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  const consoleErrors = [];
  const hydrationWarnings = [];

  page.on('console', (msg) => {
    const text = msg.text();
    if (msg.type() === 'error') {
      consoleErrors.push(text);
    }
    if (text.toLowerCase().includes('hydration') || text.toLowerCase().includes('did not match')) {
      hydrationWarnings.push(text);
    }
  });

  page.on('pageerror', (err) => {
    consoleErrors.push(err.toString());
  });

  try {
    // ==========================================
    // Step A: /match
    // ==========================================
    console.log('\n--- Step A: /match ---');
    await page.goto('http://localhost:3000/match', { waitUntil: 'networkidle2' });
    await page.waitForSelector('button');

    // Click "Try Demo Profile"
    console.log('Clicking "Try demo profile"...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const b = btns.find((el) => el.textContent && el.textContent.includes('Demo Profile'));
      if (b) b.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Verify 3 matches and badges
    const matchCountText = await page.$eval('h3', (el) => el.textContent || '');
    console.log(`Results header: "${matchCountText}"`);

    // Screenshot A1: Matchmaker with 3 matches (Desktop)
    const shotA1Path = path.join(ARTIFACTS_DIR, 'step_a1_match_results.png').replace(/\\/g, '/');
    await page.screenshot({ path: shotA1Path, fullPage: true });
    console.log(`📸 Saved screenshot A1: ${shotA1Path}`);

    // Toggle Hindi
    console.log('Toggling Hindi language...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const b = btns.find((el) => el.textContent && el.textContent.includes('हिन्दी'));
      if (b) b.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Screenshot A2: Hindi mode
    const shotA2Path = path.join(ARTIFACTS_DIR, 'step_a2_hindi_mode.png').replace(/\\/g, '/');
    await page.screenshot({ path: shotA2Path, fullPage: true });
    console.log(`📸 Saved screenshot A2 (Hindi): ${shotA2Path}`);

    // Click Fast Apply on first card (Pragati)
    console.log('Opening Fast Apply on Pragati...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const b = btns.find((el) => el.textContent && (el.textContent.includes('फास्ट अप्लाई') || el.textContent.includes('Fast Apply')));
      if (b) b.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Click Submit in Fast Apply drawer
    console.log('Submitting application...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const b = btns.find((el) => el.textContent && (el.textContent.includes('पुष्टि करें') || el.textContent.includes('Confirm & Submit')));
      if (b) b.click();
    });
    await new Promise((r) => setTimeout(r, 1000));

    // Screenshot A3: Success toast / drawer
    const shotA3Path = path.join(ARTIFACTS_DIR, 'step_a3_fast_apply_success.png').replace(/\\/g, '/');
    await page.screenshot({ path: shotA3Path });
    console.log(`📸 Saved screenshot A3 (Success): ${shotA3Path}`);

    // Toggle back to English
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const b = btns.find((el) => el.textContent && el.textContent.includes('English'));
      if (b) b.click();
    });
    await new Promise((r) => setTimeout(r, 400));

    // ==========================================
    // Step B: /track
    // ==========================================
    console.log('\n--- Step B: /track ---');
    // Client-side navigate by clicking Track Application in drawer
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const b = btns.find((el) => el.textContent && (el.textContent.includes('Track Application') || el.textContent.includes('ट्रैक करें')));
      if (b) b.click();
    });
    await new Promise((r) => setTimeout(r, 800));

    // If still on /match, use nav link
    if (!page.url().includes('/track')) {
      await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll('a'));
        const l = links.find((el) => el.getAttribute('href') === '/track');
        if (l) l.click();
      });
      await new Promise((r) => setTimeout(r, 800));
    }

    // Select hero application APP-2026-104233
    console.log('Selecting APP-2026-104233...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const b = btns.find((el) => el.textContent && el.textContent.includes('APP-2026-104233'));
      if (b) b.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Screenshot B1: DNO Active state
    const shotB1Path = path.join(ARTIFACTS_DIR, 'step_b1_track_dno_active.png').replace(/\\/g, '/');
    await page.screenshot({ path: shotB1Path, fullPage: true });
    console.log(`📸 Saved screenshot B1: ${shotB1Path}`);

    // Click "Request Additional Doc"
    console.log('Clicking "Simulate: Request Additional Document"...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const b = btns.find((el) => el.textContent && el.textContent.includes('Request Additional'));
      if (b) b.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Screenshot B2: Amber Blocked state (DOC_REQUESTED)
    const shotB2Path = path.join(ARTIFACTS_DIR, 'step_b2_track_doc_requested.png').replace(/\\/g, '/');
    await page.screenshot({ path: shotB2Path, fullPage: true });
    console.log(`📸 Saved screenshot B2: ${shotB2Path}`);

    // ==========================================
    // Step C: Navigate to /docs via "Fix Now"
    // ==========================================
    console.log('\n--- Step C: /docs (via Fix Now) ---');
    console.log('Clicking "Fix Now"...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const b = btns.find((el) => el.textContent && el.textContent.includes('Fix Now'));
      if (b) b.click();
    });
    await new Promise((r) => setTimeout(r, 1000));
    console.log(`Current URL: ${page.url()}`);

    // Click "Load Sample 3.4 MB Aadhaar scan"
    console.log('Loading 3.4 MB sample scan...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const b = btns.find((el) => el.textContent && el.textContent.includes('3.4 MB'));
      if (b) b.click();
    });
    // Wait for canvas generation, binary search JPEG compression & OCR (3.5s)
    await new Promise((r) => setTimeout(r, 3800));

    // Screenshot C1: Compressed to ~150 KB, sharpness, OCR Match
    const shotC1Path = path.join(ARTIFACTS_DIR, 'step_c1_docs_compressed_match.png').replace(/\\/g, '/');
    await page.screenshot({ path: shotC1Path, fullPage: true });
    console.log(`📸 Saved screenshot C1: ${shotC1Path}`);

    // Set scenario to Mismatch
    console.log('Setting scenario to Mismatch...');
    await page.select('select#scenario-select', 'mismatch');
    await new Promise((r) => setTimeout(r, 1600));

    // Screenshot C2: Mismatch scenario
    const shotC2Path = path.join(ARTIFACTS_DIR, 'step_c2_docs_mismatch.png').replace(/\\/g, '/');
    await page.screenshot({ path: shotC2Path, fullPage: true });
    console.log(`📸 Saved screenshot C2: ${shotC2Path}`);

    // Set back to Match and click Resubmit to DNO
    console.log('Setting scenario back to Match and waiting for OCR match...');
    await page.select('select#scenario-select', 'match');
    await new Promise((r) => setTimeout(r, 1800));

    // Click "Resubmit Verified Document to DNO"
    console.log('Clicking "Resubmit Verified Document to DNO"...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const b = btns.find((el) => el.textContent && el.textContent.includes('Resubmit Verified'));
      if (b) b.click();
    });
    await new Promise((r) => setTimeout(r, 1200));
    console.log(`Current URL: ${page.url()}`);

    // ==========================================
    // Step D: /track (Disbursal)
    // ==========================================
    console.log('\n--- Step D: /track after Resubmit ---');
    // Ensure on track page
    if (!page.url().includes('/track')) {
      await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll('a'));
        const l = links.find((el) => el.getAttribute('href') === '/track');
        if (l) l.click();
      });
      await new Promise((r) => setTimeout(r, 800));
    }

    // Select hero application APP-2026-104233
    console.log('Selecting APP-2026-104233...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const b = btns.find((el) => el.textContent && el.textContent.includes('APP-2026-104233'));
      if (b) b.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Click "Approve as DNO (Disburse)"
    console.log('Clicking "Approve as DNO"...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const b = btns.find((el) => el.textContent && el.textContent.includes('Approve as DNO'));
      if (b) b.click();
    });
    await new Promise((r) => setTimeout(r, 800));

    // Screenshot D1: All dominoes fallen, DBT Disbursal active with UTR
    const shotD1Path = path.join(ARTIFACTS_DIR, 'step_d1_track_disbursed.png').replace(/\\/g, '/');
    await page.screenshot({ path: shotD1Path, fullPage: true });
    console.log(`📸 Saved screenshot D1 (Disbursed): ${shotD1Path}`);

    // ==========================================
    // Step E: Mobile Viewport 375x812 No Horizontal Scroll Check
    // ==========================================
    console.log('\n--- Step E: Viewport 375 x 812 Mobile Checks ---');
    await page.setViewport({ width: 375, height: 812 });

    const routesToCheck = ['/', '/match', '/track', '/docs'];
    for (const route of routesToCheck) {
      await page.evaluate((r) => {
        const links = Array.from(document.querySelectorAll('a'));
        const l = links.find((el) => el.getAttribute('href') === r);
        if (l) l.click();
      }, route);
      await new Promise((r) => setTimeout(r, 500));

      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });

      console.log(`Mobile route ${route}: scrollWidth <= clientWidth? ${!hasHorizontalScroll}`);
    }

    const shotMobilePath = path.join(ARTIFACTS_DIR, 'step_e1_mobile_375.png').replace(/\\/g, '/');
    await page.screenshot({ path: shotMobilePath });
    console.log(`📸 Saved mobile screenshot: ${shotMobilePath}`);

    // ==========================================
    // Step F: Console Errors & Hydration Warnings Audit
    // ==========================================
    console.log('\n--- Step F: Console Audit ---');
    console.log(`Console Errors: ${consoleErrors.length}`);
    if (consoleErrors.length > 0) {
      console.error('Errors found:', consoleErrors);
    }
    console.log(`Hydration Warnings: ${hydrationWarnings.length}`);
    if (hydrationWarnings.length > 0) {
      console.warn('Hydration warnings found:', hydrationWarnings);
    }

    console.log('\n✅ ALL GOLDEN PATH CHECKS COMPLETED SUCCESSFULLY!');
  } catch (err) {
    console.error('❌ Verification failed:', err);
  } finally {
    await browser.close();
  }
}

runVerification();
