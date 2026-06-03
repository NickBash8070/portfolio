const menuButton = document.getElementById("menu-button");
const menuClose = document.getElementById("menu-close");
const mobileMenu = document.getElementById("mobile-menu");
const menuLinks = document.querySelectorAll(".mobile-menu a");
const caseCards = document.querySelectorAll(".work-card");
const caseArrows = document.querySelectorAll(".work-arrow");
const workSwitchButtons = document.querySelectorAll(".work-switch-btn");
const contactSection = document.getElementById("contact");
const siteFooter = document.getElementById("site-footer");

let lastFocusedElement = null;

const syncMobileMenuActiveState = () => {
  const currentHash = window.location.hash || "#home";
  menuLinks.forEach((link) => {
    const href = link.getAttribute("href");
    link.classList.toggle("is-active", href === currentHash);
  });
};

const markSiteReady = () => {
  document.body.classList.add("site-ready");
};

if (document.readyState === "complete") {
  markSiteReady();
} else {
  window.addEventListener("load", markSiteReady, { once: true });
}

if (siteFooter) siteFooter.classList.add("is-visible");

const getMenuFocusable = () => {
  if (!mobileMenu) return [];
  return Array.from(
    mobileMenu.querySelectorAll("a[href], button:not([disabled]), [tabindex]:not([tabindex='-1'])")
  );
};

const setMenuState = (isOpen) => {
  document.body.classList.toggle("menu-open", isOpen);

  if (menuButton) menuButton.setAttribute("aria-expanded", String(isOpen));
  if (mobileMenu) mobileMenu.setAttribute("aria-hidden", String(!isOpen));

  if (isOpen) {
    syncMobileMenuActiveState();
    lastFocusedElement = document.activeElement;
    const [firstFocusable] = getMenuFocusable();
    if (firstFocusable) firstFocusable.focus();
    return;
  }

  if (lastFocusedElement instanceof HTMLElement) lastFocusedElement.focus();
};

if (menuButton) {
  menuButton.addEventListener("click", () => {
    const isOpen = document.body.classList.contains("menu-open");
    setMenuState(!isOpen);
  });
}

if (menuClose) menuClose.addEventListener("click", () => setMenuState(false));

menuLinks.forEach((link) => {
  link.addEventListener("click", () => {
    const href = link.getAttribute("href");
    menuLinks.forEach((node) => {
      node.classList.toggle("is-active", node === link);
    });
    setMenuState(false);
    if (href) {
      window.setTimeout(syncMobileMenuActiveState, 120);
    }
  });
});

caseCards.forEach((card) => {
  card.addEventListener("mouseleave", () => {
    card.classList.remove("work-card-arrow-active");
  });
});

caseArrows.forEach((arrow) => {
  const card = arrow.closest(".work-card");
  if (!card) return;

  arrow.addEventListener("mouseenter", () => {
    card.classList.add("work-card-arrow-active");
  });

  arrow.addEventListener("mouseleave", () => {
    card.classList.remove("work-card-arrow-active");
  });
});

if (workSwitchButtons.length && caseCards.length) {
  const applyWorkFilter = (filter) => {
    caseCards.forEach((card) => {
      const tier = card.getAttribute("data-case-tier");
      const shouldShow = filter === "all" || tier === filter;
      card.classList.toggle("is-hidden", !shouldShow);
    });
  };

  workSwitchButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.getAttribute("data-case-filter") || "all";

      workSwitchButtons.forEach((node) => {
        const isActive = node === button;
        node.classList.toggle("is-active", isActive);
        node.setAttribute("aria-pressed", String(isActive));
      });

      applyWorkFilter(filter);
    });
  });
}

if (mobileMenu) {
  mobileMenu.addEventListener("click", (event) => {
    if (event.target === mobileMenu) setMenuState(false);
  });
}

window.addEventListener("scroll", () => {
  const currentY = window.scrollY;
  document.body.classList.toggle("header-scrolled", currentY > 12);
});

document.body.classList.toggle("header-scrolled", window.scrollY > 12);
syncMobileMenuActiveState();
window.addEventListener("hashchange", syncMobileMenuActiveState);

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setMenuState(false);
    return;
  }

  if (event.key !== "Tab" || !document.body.classList.contains("menu-open")) return;

  const focusable = getMenuFocusable();
  if (!focusable.length) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  const active = document.activeElement;

  if (event.shiftKey && active === first) {
    event.preventDefault();
    last.focus();
    return;
  }

  if (!event.shiftKey && active === last) {
    event.preventDefault();
    first.focus();
  }
});

const revealNodes = document.querySelectorAll(".reveal");
const splitTextNodes = Array.from(document.querySelectorAll(".split-text"));
const aboutStatsSection = document.querySelector(".about-stats");
const aboutStatNumbers = Array.from(document.querySelectorAll(".about-stat-number"));
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const shouldRevealImmediately = prefersReducedMotion || Boolean(window.location.hash);
const splitGlueWords = new Set([
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
  "под",
  "над",
  "при",
  "без",
  "для",
  "про",
]);

const formatAboutStatValue = (node, value) => {
  const roundedValue = Math.round(value);
  const suffix = node.dataset.suffix || "";
  return `${new Intl.NumberFormat("ru-RU").format(roundedValue)}${suffix}`;
};

const setAboutStatValue = (node, value) => {
  node.textContent = formatAboutStatValue(node, value);
};

const animateAboutStat = (node) => {
  if (!node || node.dataset.counted === "true") return;

  const target = Number(node.dataset.countTo || "0");
  const duration = Number(node.dataset.duration || "1400");
  node.dataset.counted = "true";

  if (prefersReducedMotion || target <= 0) {
    setAboutStatValue(node, target);
    return;
  }

  const startTime = performance.now();
  const easeOutCubic = (progress) => 1 - (1 - progress) ** 3;

  const tick = (now) => {
    const progress = Math.min((now - startTime) / duration, 1);
    const nextValue = target * easeOutCubic(progress);
    setAboutStatValue(node, nextValue);

    if (progress < 1) {
      window.requestAnimationFrame(tick);
      return;
    }

    setAboutStatValue(node, target);
  };

  window.requestAnimationFrame(tick);
};

const startAboutStatsAnimation = () => {
  aboutStatNumbers.forEach((node) => animateAboutStat(node));
};

const createSplitWord = (token) => {
  const word = document.createElement("span");
  word.className = "split-word";
  word.setAttribute("aria-hidden", "true");
  word.textContent = token;
  return word;
};

const buildSplitText = (target) => {
  const originalMarkup = target.dataset.splitSource || target.innerHTML;
  if (!target.dataset.splitSource) {
    target.dataset.splitSource = originalMarkup;
  }

  const wasVisible = target.classList.contains("visible");
  const template = document.createElement("template");
  template.innerHTML = originalMarkup;

  const accessibleText = (template.content.textContent || "").replace(/\s+/g, " ").trim();
  if (accessibleText) {
    target.setAttribute("aria-label", accessibleText);
  }

  target.innerHTML = "";
  target.classList.add("split-text-lines");

  template.content.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const tokens = (node.textContent || "").match(/\S+\s*/g) || [];
      tokens.forEach((token) => {
        target.appendChild(createSplitWord(token));
      });
      return;
    }

    if (node.nodeType === Node.ELEMENT_NODE && node.nodeName === "BR") {
      const lineBreak = document.createElement("br");
      lineBreak.className = "split-break";
      lineBreak.setAttribute("aria-hidden", "true");
      target.appendChild(lineBreak);
      return;
    }

    const tokens = (node.textContent || "").match(/\S+\s*/g) || [];
    tokens.forEach((token) => {
      target.appendChild(createSplitWord(token));
    });
  });

  const rawNodes = Array.from(target.childNodes);
  const lines = [];
  let currentLine = [];
  let currentTop = null;

  rawNodes.forEach((node) => {
    if (node.nodeType === Node.ELEMENT_NODE && node.nodeName === "BR") {
      if (currentLine.length) lines.push(currentLine);
      currentLine = [];
      currentTop = null;
      node.remove();
      return;
    }

    if (!(node instanceof HTMLElement)) return;

    if (currentTop === null) {
      currentTop = node.offsetTop;
      currentLine = [node];
      return;
    }

    if (Math.abs(node.offsetTop - currentTop) > 4) {
      lines.push(currentLine);
      currentLine = [node];
      currentTop = node.offsetTop;
      return;
    }

    currentLine.push(node);
  });

  if (currentLine.length) {
    lines.push(currentLine);
  }

  target.innerHTML = "";

  lines.forEach((lineNodes, index) => {
    const line = document.createElement("span");
    line.className = "split-line";
    line.setAttribute("aria-hidden", "true");

    const inner = document.createElement("span");
    inner.className = "split-line-inner";
    inner.style.transitionDelay = `${index * 120}ms`;

    if (wasVisible) {
      inner.classList.add("is-visible");
    }

    lineNodes.forEach((lineNode) => {
      inner.appendChild(lineNode);
    });

    line.appendChild(inner);
    target.appendChild(line);
  });
};

const rebuildSplitText = () => {
  splitTextNodes.forEach((target) => buildSplitText(target));
};

rebuildSplitText();

if (document.fonts?.ready) {
  document.fonts.ready.then(() => {
    rebuildSplitText();
  });
}

let splitResizeTimer = null;
window.addEventListener("resize", () => {
  if (splitResizeTimer) window.clearTimeout(splitResizeTimer);
  splitResizeTimer = window.setTimeout(() => {
    rebuildSplitText();
  }, 140);
});

if (
  shouldRevealImmediately ||
  typeof IntersectionObserver === "undefined"
) {
  revealNodes.forEach((node) => node.classList.add("visible"));
  splitTextNodes.forEach((node) => node.classList.add("visible"));
  if (contactSection) contactSection.classList.add("is-unveiled");
  startAboutStatsAnimation();
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.2 }
  );

  const splitObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.15 }
  );

  revealNodes.forEach((node) => revealObserver.observe(node));
  splitTextNodes.forEach((node) => splitObserver.observe(node));

  if (contactSection) {
    const contactObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          contactSection.classList.add("is-unveiled");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.35 }
    );

    contactObserver.observe(contactSection);
  }

  if (aboutStatsSection && aboutStatNumbers.length) {
    const aboutStatsObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          startAboutStatsAnimation();
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.35 }
    );

    aboutStatsObserver.observe(aboutStatsSection);
  }
}
