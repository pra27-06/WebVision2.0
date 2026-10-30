# Setu (NSP Direct) - National Scholarship Portal Friction Fix

Setu is an independent GovTech front-end prototype designed to solve the three structural friction traps of India's National Scholarship Portal (NSP):
1. **Scheme Discovery Maze** → **Scheme Matchmaker (`/match`)**: 4-question wizard, instant eligibility evaluation, confidence badges, live deadline countdowns, and 1-click Fast Apply.
2. **Verification Black Hole** → **Domino Tracker (`/track`)**: 4-stage pipeline, assigned nodal officer desk visibility, statutory SLA countdown timer, live queue position, and interactive nodal scrutiny simulation.
3. **Document Failure at the Edge** → **Auto-Compress & Doc Health Check (`/docs`)**: Client-side image compression directly down to the official 200 KB / 50 KB limits, JPG-to-PDF conversion, Laplacian variance sharpness check, and simulated Aadhaar OCR name verification. Files never leave the student's device.

---

## Quick Start: How to Run

```bash
# 1. Clone repository
git clone https://github.com/pra27-06/WebVision2.0.git
cd WebVision2.0

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open in browser
# http://localhost:3000
```

### Production Build & Lint Verification
```bash
# TypeScript verification
npx tsc --noEmit

# ESLint validation
npm run lint

# Production build
npm run build
```

---

## 3-Minute Hackathon Pitch & Stage Script

| Time | Screen | Action & What to Say |
| --- | --- | --- |
| **0:00–0:30** | **Home (`/`)** | Three facts: "Post-matric student window closes 31 Oct, institute verification closes 15 Nov, and document uploads strictly cap at 200 KB. Three deadlines, one confused student, zero visibility. This is Setu." |
| **0:30–1:20** | **Matchmaker (`/match`)** | Click **"Try demo profile"** (Uttar Pradesh, UG, OBC, Female, ₹2.4 Lakh). Show three instant reactive matches: Pragati (100% Eligible - ₹50,000/yr), PM YASASVI (100%), CSSS (85% Likely). Toggle **हिन्दी** to demonstrate bilingual accessibility. Click **Fast Apply** and submit. |
| **1:20–2:05** | **Domino Tracker (`/track`)** | Open the hero application **`APP-2026-104233`** stuck at District Nodal Officer (DNO). Show officer desk (Smt. Kavita Rao, Desk 4), queue position **14 of 212**, and live statutory SLA clock. Click **"Request Additional Doc"**: the node turns amber and the SLA pauses. |
| **2:05–2:45** | **Doc Health Check (`/docs`)** | Click **"Fix now"** in the alert banner (opens `/docs?app=APP-2026-104233`). Click **"Load sample 3.4 MB Aadhaar scan"**: watch it compress down to ~150 KB in-browser. Show the Laplacian sharpness score (>100) and Aadhaar name match. Toggle scenario to **Mismatch** to demonstrate defect detection, then switch back and click **"Resubmit to DNO"**. |
| **2:45–3:00** | **Tracker Disbursal (`/track`)** | Pipeline resumes back at DNO with a fresh 72-hour SLA. Click **"Approve as DNO"**: dominoes fall in sequence into **DBT Disbursal** with official UTR reference and amount. Close: *"Zero backend, nothing leaves the student's phone, ready to plug into NSP as an API front-end."* |

---

## Simulated vs. Real Breakdown

| Feature | Classification | Technical Implementation Details |
| --- | --- | --- |
| **Eligibility Rule Engine** | **REAL** | Pure mathematical evaluator in `src/lib/eligibility.ts`. Computes 7 hard eligibility checks (state domicile, degree level, social quota, gender, minority, PwD, and income ceiling) and soft penalty percentiles. |
| **Image Compression** | **REAL** | In-browser canvas processing in `src/lib/compress.ts`. Decodes bitmap, caps long side at 1600 px, executes binary search over JPEG quantization (0.40–0.90) and iterative 0.85 geometric scaling until byte size is $\le 90\%$ of the official 200 KB / 50 KB limits. |
| **JPG-to-PDF Conversion** | **REAL** | Client-side packaging using `pdf-lib`. Embeds compressed JPEG in standard A4 PDF document directly inside browser memory. |
| **Document Sharpness Score** | **REAL** | Grayscale convolution with discrete 3x3 Laplacian kernel in `src/lib/sharpness.ts`. Computes real Laplacian variance score; scores $\ge 100$ pass as sharp, preventing blur-based rejections. |
| **Aadhaar Name Matcher** | **REAL** | Normalized Levenshtein distance algorithm comparing applicant name string against extracted string ($\ge 0.90$ match, $0.70$–$0.90$ possible typo, $<0.70$ mismatch). |
| **OCR Extraction** | **SIMULATED** | Mock latency generator (900 ms–1400 ms) in `src/lib/ocrMock.ts` with presenter scenario override switch (Exact match, Slight typo, Complete mismatch). |
| **PDF Re-compression** | **SIMULATED** | Simulated multi-stage progress computing optimized PDF byte size at 85% of limit, explicitly labeled in UI per brief specification. |
| **Nodal Officers & SLAs** | **SIMULATED** | Seeded in-memory React reducer state simulating INO, DNO, SNO, PFMS gateway desks, queues, and timers. |

---

## Technical & Architectural Decisions

1. **Next.js App Router with In-Memory State**: Built using `useReducer` and React Context (`AppContext.tsx`) mounted in the root layout. This preserves active applications, simulated transitions, and uploaded documents across navigation without requiring an external database or network credentials.
2. **GovTech Design Standards**: Implemented with Slate-50 background, white elevated cards, Indigo-600 primary, saffron/white/green tricolor indicator strip, high-contrast text ($\ge 4.5:1$), and tabular numerals for timers and currency.
3. **Hydration Mismatch Prevention**: All countdown clocks, relative timestamps, and client-generated sizes render using a `useIsMounted` external store hook, guaranteeing zero server-client hydration warnings.
4. **Bilingual Accessibility**: Full English and Hindi dictionaries in `src/lib/i18n.ts`, covering all text, tooltips, dialogs, and ARIA attributes.
5. **Client-Side Edge Privacy**: Image files never leave the browser. Real sample generator buttons generate real uncompressed multi-megabyte canvas bitmaps on the fly with "SAMPLE - DEMO ONLY" watermarks.
