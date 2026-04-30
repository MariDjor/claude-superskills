/**
 * avanade_base.js — Avanade Branded Presentation Base Script
 * Canvas: LAYOUT_WIDE — 13.333" × 7.5" (33.87 × 19.05 cm) — matches real Avanade template
 *
 * Assets (same directory):
 *   logo_color.png  — color logo (white/light slides)
 *   logo_white.png  — white logo (dark/gradient slides)
 *   wave.png        — Avanade wave stroke (orange→yellow ribbon)
 */

const pptxgen = require("pptxgenjs");
const fs      = require("fs");
const path    = require("path");

// ─── CANVAS ───────────────────────────────────────────────────────────────────
// LAYOUT_WIDE: 13.333" × 7.5"  (33.867 cm × 19.05 cm)
const W = 13.333;   // slide width  (inches)
const H = 7.5;      // slide height (inches)

// ─── BRAND CONSTANTS ─────────────────────────────────────────────────────────
const C = {
  ORANGE:          "FF5800",
  DARK_ORANGE:     "DC4600",
  YELLOW:          "FFD700",
  RED_ORANGE:      "B43C14",
  DEEP_PURPLE:     "870032",
  DARK_GRAY:       "333333",
  MED_GRAY:        "666666",
  LIGHT_GRAY:      "AAAAAA",
  WHITE:           "FFFFFF",
  LIGHT_ORANGE_BG: "FFF0E8",
};

// ─── ASSET LOADING ────────────────────────────────────────────────────────────
const ASSETS_DIR = __dirname;

function loadAsset(filename) {
  const p = path.join(ASSETS_DIR, filename);
  if (!fs.existsSync(p)) return null;
  const ext  = path.extname(filename).slice(1).toLowerCase();
  const mime = ext === "svg" ? "image/svg+xml" : `image/${ext}`;
  return `${mime};base64,${fs.readFileSync(p).toString("base64")}`;
}

const LOGO_COLOR = loadAsset("logo_color.png");
const LOGO_WHITE = loadAsset("logo_white.png");
const WAVE       = loadAsset("wave.png");

// ─── GRADIENT SVG ─────────────────────────────────────────────────────────────
function getGradientBgSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%"   stop-color="#FF5800"/>
      <stop offset="40%"  stop-color="#E84A00"/>
      <stop offset="75%"  stop-color="#B43C14"/>
      <stop offset="100%" stop-color="#870032"/>
    </linearGradient>
  </defs>
  <rect width="1280" height="720" fill="url(#bg)"/>
</svg>`;
}

function svgToDataUrl(svg) {
  return `image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

// ─── CHROME: GRADIENT SLIDES ──────────────────────────────────────────────────
// Cover / Section divider / Closing
// Logo white top-left | #AvanadeDoWhatMatters top-right | copyright bottom
function addGradientSlideChrome(slide, slideNum, confidential = "Highly Confidential") {
  // Logo white — top-left
  if (LOGO_WHITE) {
    slide.addImage({ data: LOGO_WHITE, x: 0.33, y: 0.20, w: 2.13, h: 0.78 });
  } else {
    slide.addText("avanade", {
      x: 0.33, y: 0.20, w: 2.13, h: 0.78,
      fontFace: "Segoe UI", fontSize: 26, bold: true, color: C.WHITE, margin: 0
    });
  }

  // Hashtag — top-right
  slide.addText("#AvanadeDoWhatMatters", {
    x: 7.5, y: 0.27, w: 5.5, h: 0.50,
    fontFace: "Segoe UI", fontSize: 17, color: C.WHITE, align: "right", margin: 0
  });

  // Copyright — bottom center
  const copy = confidential
    ? `©2026 Avanade Inc. All Rights Reserved. <${confidential}>`
    : "©2026 Avanade Inc. All Rights Reserved.";
  slide.addText(copy, {
    x: 2.0, y: 7.1, w: 9.33, h: 0.27,
    fontFace: "Segoe UI", fontSize: 9, color: "EEEEEE", align: "center", margin: 0
  });

  // Page number — bottom right
  if (slideNum) {
    slide.addText(String(slideNum), {
      x: 12.63, y: 7.09, w: 0.53, h: 0.27,
      fontFace: "Segoe UI", fontSize: 11, bold: true, color: C.WHITE,
      align: "right", margin: 0
    });
  }
}

// ─── CHROME: CONTENT SLIDES (white background) ───────────────────────────────
// breadcrumb (top) | orange stripe | ... | footer 2-row
// Footer logo spec: w=2cm=0.787", h=0.56cm=0.220"
function addContentSlideChrome(slide, {
  breadcrumb   = "",
  context      = "Avanade Brazil | FY2026",
  pageNum      = null,
  confidential = true
} = {}) {

  // ─ TOP ─
  if (breadcrumb) {
    slide.addText(breadcrumb, {
      x: 0.40, y: 0.08, w: 12.53, h: 0.27,
      fontFace: "Segoe UI", fontSize: 12, color: C.LIGHT_GRAY, align: "left", margin: 0
    });
  }

  // Orange stripe — full-width
  slide.addShape("rect", {
    x: 0, y: 0.37, w: W, h: 0.09,
    fill: { color: C.ORANGE }, line: { color: C.ORANGE, width: 0 }
  });

  // ─ FOOTER ROW 1: context | CONFIDENTIAL | page num ─
  slide.addText(context, {
    x: 0.40, y: 6.80, w: 7.33, h: 0.24,
    fontFace: "Segoe UI", fontSize: 11, color: C.MED_GRAY, align: "left", margin: 0
  });
  if (confidential) {
    slide.addText("CONFIDENTIAL", {
      x: 9.60, y: 6.80, w: 2.93, h: 0.24,
      fontFace: "Segoe UI", fontSize: 11, bold: true, color: C.MED_GRAY,
      align: "right", margin: 0
    });
  }
  if (pageNum) {
    slide.addText(String(pageNum), {
      x: 12.73, y: 6.80, w: 0.40, h: 0.24,
      fontFace: "Segoe UI", fontSize: 11, color: C.MED_GRAY, align: "right", margin: 0
    });
  }

  // ─ FOOTER ROW 2: logo | copyright | "Do what matters" ─
  // Logo: width=2cm=0.787", height=0.56cm=0.220" (user spec)
  const logoW = 0.787;   // 2 cm
  const logoH = 0.220;   // 0.56 cm
  const logoX = 0.27;
  const logoY = 7.12;    // near bottom, logo bottom ≈ 7.34" (slide = 7.5")

  if (LOGO_COLOR) {
    slide.addImage({ data: LOGO_COLOR, x: logoX, y: logoY, w: logoW, h: logoH });
  } else {
    slide.addText("avanade", {
      x: logoX, y: logoY, w: logoW, h: logoH,
      fontFace: "Segoe UI", fontSize: 14, bold: true, color: C.ORANGE, margin: 0
    });
  }

  const copy = confidential
    ? "©2026 Avanade Inc. All Rights Reserved. <Highly Confidential>"
    : "©2026 Avanade Inc. All Rights Reserved.";
  slide.addText(copy, {
    x: 1.20, y: 7.15, w: 10.0, h: 0.22,
    fontFace: "Segoe UI", fontSize: 9, color: C.LIGHT_GRAY, align: "center", margin: 0
  });

  slide.addText("Do what matters", {
    x: 10.53, y: 7.10, w: 2.67, h: 0.30,
    fontFace: "Segoe UI", fontSize: 15, bold: true, color: C.ORANGE,
    align: "right", margin: 0
  });
}

// ─── PRESENTATION FACTORY ─────────────────────────────────────────────────────
function createPresentation(title = "Avanade Presentation") {
  const pres  = new pptxgen();
  pres.layout = "LAYOUT_WIDE";   // 13.333" × 7.5"
  pres.title  = title;
  pres.author = "Avanade";
  return pres;
}

// ─── COVER ────────────────────────────────────────────────────────────────────
function addCoverSlide(pres, {
  title        = "Presentation Title",
  subtitle     = "",
  confidential = "Highly Confidential"
} = {}) {
  const slide = pres.addSlide();

  // Gradient background
  slide.addImage({ data: svgToDataUrl(getGradientBgSVG()), x: 0, y: 0, w: W, h: H });

  // Wave — arcs across upper portion
  if (WAVE) {
    slide.addImage({ data: WAVE, x: 1.07, y: -1.60, w: 14.67, h: 8.27 });
  }

  // Title — bottom-left, large bold white
  slide.addText(title, {
    x: 0.60, y: 4.60, w: 10.0, h: 1.87,
    fontFace: "Segoe UI", fontSize: 69, bold: true, color: C.WHITE,
    align: "left", valign: "bottom", margin: 0
  });

  // Subtitle
  if (subtitle) {
    slide.addText(subtitle, {
      x: 0.60, y: 6.40, w: 9.33, h: 0.73,
      fontFace: "Segoe UI", fontSize: 29, bold: true, color: C.WHITE,
      align: "left", margin: 0
    });
  }

  addGradientSlideChrome(slide, null, confidential);
  return slide;
}

// ─── SECTION DIVIDER ─────────────────────────────────────────────────────────
function addSectionDivider(pres, {
  heading      = "Section Title",
  subheading   = "",
  pageNum      = null,
  confidential = "Highly Confidential"
} = {}) {
  const slide = pres.addSlide();
  slide.addImage({ data: svgToDataUrl(getGradientBgSVG()), x: 0, y: 0, w: W, h: H });
  if (WAVE) {
    slide.addImage({ data: WAVE, x: 0.67, y: 0.27, w: 14.67, h: 8.0, transparency: 10 });
  }
  slide.addText(heading, {
    x: 0.60, y: 2.8, w: 11.33, h: 2.13,
    fontFace: "Segoe UI", fontSize: 59, bold: true, color: C.WHITE,
    align: "left", valign: "middle", margin: 0
  });
  if (subheading) {
    slide.addText(subheading, {
      x: 0.60, y: 5.0, w: 10.0, h: 0.67,
      fontFace: "Segoe UI", fontSize: 24, color: C.WHITE, align: "left", margin: 0
    });
  }
  addGradientSlideChrome(slide, pageNum, confidential);
  return slide;
}

// ─── CONTENTS / AGENDA ───────────────────────────────────────────────────────
function addContentsSlide(pres, {
  title        = "Contents",
  sections     = [],
  breadcrumb   = "",
  context      = "Avanade Brazil | FY2026",
  pageNum      = null,
  confidential = true
} = {}) {
  const slide = pres.addSlide();
  slide.background = { color: C.WHITE };
  addContentSlideChrome(slide, { breadcrumb, context, pageNum, confidential });

  slide.addText(title, {
    x: 0.47, y: 0.53, w: 8.0, h: 0.87,
    fontFace: "Segoe UI", fontSize: 43, bold: true, color: C.DARK_GRAY, margin: 0
  });

  const colX = [0.47, 2.87, 5.27, 7.67, 10.07];
  const colW = 2.27;

  sections.slice(0, 5).forEach((s, i) => {
    const x = colX[i];
    // Orange underline bar
    slide.addShape("rect", {
      x, y: 1.71, w: 2.07, h: 0.05,
      fill: { color: C.ORANGE }, line: { color: C.ORANGE, width: 0 }
    });
    // Number
    slide.addText(s.num || String(i + 1).padStart(2, "0"), {
      x, y: 1.73, w: colW, h: 0.87,
      fontFace: "Segoe UI", fontSize: 37, bold: true, color: C.ORANGE, margin: 0
    });
    // Heading
    slide.addText(s.heading || "", {
      x, y: 2.60, w: colW, h: 0.53,
      fontFace: "Segoe UI", fontSize: 17, bold: true, color: C.DARK_GRAY, margin: 0
    });
    // Sub
    if (s.sub) {
      slide.addText(s.sub, {
        x, y: 3.13, w: colW, h: 0.47,
        fontFace: "Segoe UI", fontSize: 15, color: C.MED_GRAY, margin: 0
      });
    }
  });

  // Wave in lower portion
  if (WAVE) {
    slide.addImage({ data: WAVE, x: -0.67, y: 4.40, w: 15.33, h: 2.80, transparency: 30 });
  }

  return slide;
}

// ─── CONTENT SLIDE (text / bullets) ──────────────────────────────────────────
function addContentSlide(pres, {
  title        = "Slide Title",
  body         = "",
  breadcrumb   = "",
  context      = "Avanade Brazil | FY2026",
  pageNum      = null,
  confidential = true
} = {}) {
  const slide = pres.addSlide();
  slide.background = { color: C.WHITE };
  addContentSlideChrome(slide, { breadcrumb, context, pageNum, confidential });

  slide.addText(title, {
    x: 0.47, y: 0.53, w: 12.40, h: 0.87,
    fontFace: "Segoe UI", fontSize: 37, bold: true, color: C.DARK_GRAY, margin: 0
  });

  if (Array.isArray(body) && body.length > 0) {
    const items = body.map((b, i) => ({
      text: b,
      options: { bullet: true, breakLine: i < body.length - 1 }
    }));
    slide.addText(items, {
      x: 0.47, y: 1.60, w: 12.40, h: 5.0,
      fontFace: "Segoe UI", fontSize: 20, color: C.DARK_GRAY,
      valign: "top", margin: [0, 0, 0, 14]
    });
  } else if (body) {
    slide.addText(String(body), {
      x: 0.47, y: 1.60, w: 12.40, h: 5.0,
      fontFace: "Segoe UI", fontSize: 20, color: C.DARK_GRAY, valign: "top", margin: 0
    });
  }

  return slide;
}

// ─── TWO-COLUMN SLIDE ─────────────────────────────────────────────────────────
function addTwoColumnSlide(pres, {
  title        = "Slide Title",
  leftTitle    = "Column A",
  leftBody     = [],
  rightTitle   = "Column B",
  rightBody    = [],
  breadcrumb   = "",
  context      = "Avanade Brazil | FY2026",
  pageNum      = null,
  confidential = true
} = {}) {
  const slide = pres.addSlide();
  slide.background = { color: C.WHITE };
  addContentSlideChrome(slide, { breadcrumb, context, pageNum, confidential });

  slide.addText(title, {
    x: 0.47, y: 0.53, w: 12.40, h: 0.87,
    fontFace: "Segoe UI", fontSize: 37, bold: true, color: C.DARK_GRAY, margin: 0
  });

  // Orange vertical divider
  slide.addShape("rect", {
    x: 6.53, y: 1.67, w: 0.09, h: 4.93,
    fill: { color: C.ORANGE }, line: { color: C.ORANGE, width: 0 }
  });

  const renderCol = (colTitle, colBody, x, w) => {
    slide.addText(colTitle, {
      x, y: 1.67, w, h: 0.56,
      fontFace: "Segoe UI", fontSize: 21, bold: true, color: C.ORANGE, margin: 0
    });
    if (Array.isArray(colBody) && colBody.length > 0) {
      const items = colBody.map((b, i) => ({
        text: b, options: { bullet: true, breakLine: i < colBody.length - 1 }
      }));
      slide.addText(items, {
        x, y: 2.33, w, h: 4.13,
        fontFace: "Segoe UI", fontSize: 19, color: C.DARK_GRAY,
        valign: "top", margin: [0, 0, 0, 10]
      });
    } else {
      slide.addText(String(colBody || ""), {
        x, y: 2.33, w, h: 4.13,
        fontFace: "Segoe UI", fontSize: 19, color: C.DARK_GRAY, valign: "top", margin: 0
      });
    }
  };

  renderCol(leftTitle,  leftBody,  0.47, 5.87);
  renderCol(rightTitle, rightBody, 6.80, 6.07);

  return slide;
}

// ─── TABLE SLIDE ──────────────────────────────────────────────────────────────
// headers: string[]
// rows: string[][] or {text, opts}[][]
// colW: number[] in inches (must sum ≤ 12.4)
// headerColor: hex (no #) — default dark red-orange matching real Avanade tables
function addTableSlide(pres, {
  title        = "Table",
  headers      = [],
  rows         = [],
  colW         = null,
  headerColor  = "C0392B",
  breadcrumb   = "",
  context      = "Avanade Brazil | FY2026",
  pageNum      = null,
  confidential = true
} = {}) {
  const slide = pres.addSlide();
  slide.background = { color: C.WHITE };
  addContentSlideChrome(slide, { breadcrumb, context, pageNum, confidential });

  slide.addText(title, {
    x: 0.47, y: 0.53, w: 12.40, h: 0.87,
    fontFace: "Segoe UI", fontSize: 37, bold: true, color: C.DARK_GRAY, margin: 0
  });

  const numCols   = headers.length;
  const finalColW = colW || Array(numCols).fill(12.40 / numCols);

  const headerRow = headers.map(h => ({
    text: h,
    options: {
      fill: { color: headerColor }, color: C.WHITE, bold: true,
      fontFace: "Segoe UI", fontSize: 16, align: "center", valign: "middle"
    }
  }));

  const dataRows = rows.map((row, rowIdx) =>
    row.map(cell => {
      const isStr = typeof cell === "string";
      return {
        text: isStr ? cell : (cell.text || ""),
        options: {
          fill: { color: rowIdx % 2 === 0 ? "FFFFFF" : "FFF5F0" },
          color: C.DARK_GRAY, fontFace: "Segoe UI", fontSize: 15, valign: "middle",
          ...(isStr ? {} : (cell.opts || {}))
        }
      };
    })
  );

  slide.addTable([headerRow, ...dataRows], {
    x: 0.47, y: 1.60, w: 12.40,
    colW: finalColW,
    border: { pt: 0.5, color: "DDDDDD" },
    autoPage: false
  });

  return slide;
}

// ─── CLOSING ──────────────────────────────────────────────────────────────────
function addClosingSlide(pres, {
  message      = "Do what matters.",
  subMessage   = "",
  contact      = "",
  pageNum      = null,
  confidential = "Highly Confidential"
} = {}) {
  const slide = pres.addSlide();
  slide.addImage({ data: svgToDataUrl(getGradientBgSVG()), x: 0, y: 0, w: W, h: H });

  if (WAVE) {
    slide.addImage({ data: WAVE, x: -0.67, y: 2.0, w: 15.33, h: 6.67, transparency: 5 });
  }

  // Large central logo
  if (LOGO_WHITE) {
    slide.addImage({ data: LOGO_WHITE, x: 3.33, y: 1.87, w: 6.67, h: 2.44 });
  }

  if (message) {
    slide.addText(message, {
      x: 0.67, y: 4.13, w: 12.0, h: 1.33,
      fontFace: "Segoe UI", fontSize: 59, bold: true, color: C.WHITE,
      align: "center", margin: 0
    });
  }
  if (subMessage) {
    slide.addText(subMessage, {
      x: 0.67, y: 5.47, w: 12.0, h: 0.53,
      fontFace: "Segoe UI", fontSize: 21, color: C.WHITE, align: "center", margin: 0
    });
  }
  if (contact) {
    slide.addText(contact, {
      x: 0.67, y: 6.0, w: 12.0, h: 0.40,
      fontFace: "Segoe UI", fontSize: 17, color: C.WHITE, align: "center", margin: 0
    });
  }

  addGradientSlideChrome(slide, pageNum, confidential);
  return slide;
}

// ─── EXPORTS ─────────────────────────────────────────────────────────────────
module.exports = {
  C, W, H,
  createPresentation,
  addCoverSlide,
  addSectionDivider,
  addContentsSlide,
  addContentSlide,
  addTwoColumnSlide,
  addTableSlide,
  addClosingSlide,
  addGradientSlideChrome,
  addContentSlideChrome,
  svgToDataUrl,
  getGradientBgSVG,
  LOGO_COLOR, LOGO_WHITE, WAVE
};

// ─── DEMO ─────────────────────────────────────────────────────────────────────
if (require.main === module) {
  (async () => {
    const pres = createPresentation("Avanade Alliance FY26");

    addCoverSlide(pres, {
      title: "Alliance FY26",
      subtitle: "Action Plan H2 / April 2026",
      confidential: "Highly Confidential"
    });

    addContentsSlide(pres, {
      title: "Contents",
      breadcrumb: "Avanade Brazil | FY2026 | Overview",
      context: "Avanade Brazil | FY2026 GTM | Alliance Team",
      pageNum: 2,
      sections: [
        { num: "01", heading: "Road to Target",  sub: "H1 results & H2 gap" },
        { num: "02", heading: "Action Plan",     sub: "GTM execution pillars" },
        { num: "03", heading: "Priority Deals",  sub: "Top opportunities" },
        { num: "04", heading: "Forecast",        sub: "Q3 / Q4 pipeline" },
        { num: "05", heading: "Next Steps",      sub: "Owners & deadlines" },
      ]
    });

    addSectionDivider(pres, {
      heading: "01 — Road to Target",
      subheading: "H1 Achieved & H2 Path to Close the Gap",
      pageNum: 3
    });

    addContentSlide(pres, {
      title: "Road to Target: $8.0M",
      breadcrumb: "Avanade Brazil | FY2026 | H2 Starting",
      context: "Avanade Brazil | FY2026 GTM | Alliance Team",
      pageNum: 4,
      body: [
        "H1 Achieved: $4,777,000 — 52% of annual target",
        "Remaining gap: $3,223,000 to close in H2",
        "Priority deal: XP — Dynatrace Avanade ($1.2M) — must close",
        "Pipeline conversion Accenture Resale: $1.75M target (60% att%)",
        "RES Forecast Direct Q3: $273K — High Win probability"
      ]
    });

    addTableSlide(pres, {
      title: "Action Plan",
      breadcrumb: "Avanade Brazil | FY2026 | H2 GTM Execution",
      context: "Avanade Brazil | FY2026 GTM | Alliance Team",
      pageNum: 5,
      headers: ["Torre de Ação", "Iniciativas", "Owner", "Status"],
      colW: [2.4, 5.33, 2.67, 2.0],
      rows: [
        ["Pipeline Conversion",     "Fechar XP Dynatrace ($1.7M) | Converter RES Pipe 60%", "Alliance Team + XP",  "Under execution"],
        ["Dynatrace & Quest Orig.", "Road Show Top 20 Clientes | Ativar pipeline net-new",  "Territory Managers",  "Under Execution"],
        ["OCA Action",             "RoB SPT Microsoft | OCA Bradesco $26MM USD",            "Alliance + Pirollo",  "Making Meet"],
        ["CSP Activation",         "Roadmap de ativação em definição",                      "Alliance Team",       "Coming Soon"],
      ]
    });

    addTwoColumnSlide(pres, {
      title: "Before vs. After",
      breadcrumb: "Avanade Brazil | FY2026 | Approach",
      context: "Avanade Brazil | FY2026 GTM | Alliance Team",
      pageNum: 6,
      leftTitle: "Current State",
      leftBody: ["Manual processes", "Slow cycle times", "Limited visibility", "High OpEx"],
      rightTitle: "Future State",
      rightBody: ["Automated workflows", "Real-time decisions", "Full transparency", "Reduced costs"]
    });

    addClosingSlide(pres, {
      message: "Do what matters.",
      subMessage: "Avanade — The world's leading Microsoft expert",
      contact: "avanade.com",
      pageNum: 7
    });

    await pres.writeFile({ fileName: "avanade-pptx-v3.pptx" });
    console.log("✅ Saved: avanade-pptx-v3.pptx");
  })();
}
