const TYPOGRAPHY_GLUE_WORDS = [
  "а",
  "и",
  "но",
  "да",
  "или",
  "либо",
  "в",
  "во",
  "на",
  "по",
  "к",
  "ко",
  "с",
  "со",
  "у",
  "о",
  "об",
  "обо",
  "от",
  "до",
  "из",
  "изо",
  "за",
  "не",
  "ни",
  "для",
  "при",
  "про",
  "под",
  "над",
  "без",
  "через",
];

const TYPOGRAPHY_SKIP_SELECTOR = "script, style, textarea, input, option, pre, code, noscript, [data-no-typography]";
const TYPOGRAPHY_GLUE_RE = new RegExp(
  `(^|[\\s([{"«„])((?:${TYPOGRAPHY_GLUE_WORDS.join("|")}))\\s+`,
  "giu"
);

const applyTypographyGlue = (root = document.body) => {
  if (!root) return;

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.textContent || !node.textContent.trim()) return NodeFilter.FILTER_REJECT;
      const parent = node.parentElement;
      if (!parent || parent.closest(TYPOGRAPHY_SKIP_SELECTOR)) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  const textNodes = [];
  while (walker.nextNode()) {
    textNodes.push(walker.currentNode);
  }

  textNodes.forEach((node) => {
    node.textContent = node.textContent.replace(TYPOGRAPHY_GLUE_RE, (match, prefix, word) => `${prefix}${word}\u00A0`);
  });
};

const scheduleTypographyGlue = () => {
  window.requestAnimationFrame(() => {
    applyTypographyGlue();
  });
};

scheduleTypographyGlue();
window.addEventListener("load", scheduleTypographyGlue, { once: true });

let typographyResizeTimer = null;
window.addEventListener("resize", () => {
  if (typographyResizeTimer) window.clearTimeout(typographyResizeTimer);
  typographyResizeTimer = window.setTimeout(() => {
    applyTypographyGlue();
  }, 180);
});

window.applyTypographyGlue = applyTypographyGlue;
