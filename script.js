const menuButton = document.getElementById("menu-button");
const menuClose = document.getElementById("menu-close");
const mobileMenu = document.getElementById("mobile-menu");
const menuLinks = document.querySelectorAll(".mobile-menu a");
const heroTime = document.getElementById("hero-time");
const caseCards = document.querySelectorAll(".work-card");
const caseArrows = document.querySelectorAll(".work-arrow");
const workSwitchButtons = document.querySelectorAll(".work-switch-btn");
const contactSection = document.getElementById("contact");
const siteFooter = document.getElementById("site-footer");

let lastFocusedElement = null;

const markSiteReady = () => {
  document.body.classList.add("site-ready");
};

if (document.readyState === "complete") {
  markSiteReady();
} else {
  window.addEventListener("load", markSiteReady, { once: true });
}

if (siteFooter) siteFooter.classList.add("is-visible");

if (heroTime) {
  const timeFormatter = new Intl.DateTimeFormat("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Novosibirsk",
  });
  const updateHeroTime = () => {
    const value = timeFormatter.format(new Date());
    if (heroTime) heroTime.textContent = value;
  };

  updateHeroTime();
  window.setInterval(updateHeroTime, 60_000);
}

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
  link.addEventListener("click", () => setMenuState(false));
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
const splitTextNodes = document.querySelectorAll(".split-text");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const shouldRevealImmediately = prefersReducedMotion || Boolean(window.location.hash);

splitTextNodes.forEach((target) => {
  const words = (target.textContent || "").trim().split(/\s+/).filter(Boolean);
  target.textContent = "";

  words.forEach((word, index) => {
    const span = document.createElement("span");
    span.className = "split-char";
    span.textContent = index === words.length - 1 ? word : `${word}\u00A0`;
    span.style.transitionDelay = `${index * 70}ms`;
    target.appendChild(span);
  });
});

const splitNodes = document.querySelectorAll(".split-char");

if (
  shouldRevealImmediately ||
  typeof IntersectionObserver === "undefined"
) {
  revealNodes.forEach((node) => node.classList.add("visible"));
  splitNodes.forEach((node) => node.classList.add("visible"));
  if (contactSection) contactSection.classList.add("is-unveiled");
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
  splitNodes.forEach((node) => splitObserver.observe(node));

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
}
