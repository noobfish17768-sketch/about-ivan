/*
 * Ivan Portfolio — GA4 Analytics
 * Centralized tracking for the whole static website.
 *
 * Measurement ID is the same one already configured for this portfolio.
 * GA4 Measurement IDs are identifiers, not passwords.
 */

(() => {
  const GA_ID = "G-FMRJS7RYZQ";
  if (!GA_ID) return;

  // ---- Load Google tag once ----
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () {
    window.dataLayer.push(arguments);
  };

  window.gtag("js", new Date());
  window.gtag("config", GA_ID, {
    send_page_view: true
  });

  if (!document.querySelector(`script[data-ga4="${GA_ID}"]`)) {
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    script.dataset.ga4 = GA_ID;
    document.head.appendChild(script);
  }

  const send = (eventName, params = {}) => {
    if (typeof window.gtag !== "function") return;
    window.gtag("event", eventName, params);
  };

  const cleanText = (value) =>
    String(value || "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 100);

  const pathOnly = (href) => {
    try {
      const url = new URL(href, window.location.href);
      return url.pathname + (url.hash || "");
    } catch {
      return href || "";
    }
  };

  const getProjectName = () => {
    const path = window.location.pathname;
    const match = path.match(/\/projects\/([^/]+)\.html$/i);
    return match ? match[1] : null;
  };

  // ---- Identify case-study pages ----
  const project = getProjectName();
  if (project) {
    send("case_study_view", {
      project: project,
      page_title: document.title
    });
  }

  // ---- Track important link/button interactions ----
  document.addEventListener("click", (event) => {
    const link = event.target.closest("a, button");
    if (!link) return;

    const text = cleanText(link.innerText || link.getAttribute("aria-label"));
    const href = link.getAttribute("href") || "";
    const id = link.id || "";
    const classes = link.className || "";

    // Main navigation / in-page section links
    if (href.startsWith("#")) {
      const section = href.slice(1);
      if (section) {
        send("section_click", {
          section: section,
          link_text: text
        });
      }
      return;
    }

    // Main portfolio project cards
    if (link.matches(".project-card")) {
      const projectPath = pathOnly(href);
      const slug = projectPath.match(/projects\/([^/.]+)\.html/i)?.[1] || projectPath;
      send("project_click", {
        project: slug,
        link_text: text
      });
      return;
    }

    // Contact CTA and contact links
    if (id === "whatsapp-link" || /whatsapp/i.test(href) || /whatsapp/i.test(text)) {
      send("click_whatsapp", { location: window.location.pathname });
      return;
    }

    if (id === "email-link" || /^mailto:/i.test(href) || /email me/i.test(text)) {
      send("click_email", { location: window.location.pathname });
      return;
    }

    if (id === "linkedin-link" || /linkedin\.com/i.test(href)) {
      send("click_linkedin", { location: window.location.pathname });
      return;
    }

    if (id === "github-link" || /github\.com/i.test(href)) {
      send("click_github", { location: window.location.pathname });
      return;
    }

    // Primary conversion CTAs
    if (/hire me|discuss .*project|let.?s work together/i.test(text) ||
        /btn-primary/i.test(classes)) {
      send("cta_click", {
        cta_text: text,
        destination: pathOnly(href) || id || "button",
        page: window.location.pathname
      });
      return;
    }

    // File downloads (works automatically for future CV/file links too)
    if (/\.(pdf|docx?|xlsx?|csv|zip)(\?|#|$)/i.test(href)) {
      send("file_download", {
        file_type: href.match(/\.([a-z0-9]+)/i)?.[1]?.toLowerCase() || "file",
        file_path: pathOnly(href),
        link_text: text
      });
      return;
    }

    // External links not already categorized above
    if (href && /^https?:\/\//i.test(href)) {
      try {
        const url = new URL(href, window.location.href);
        if (url.hostname !== window.location.hostname) {
          send("outbound_click", {
            destination_domain: url.hostname,
            link_text: text,
            page: window.location.pathname
          });
        }
      } catch {}
    }
  });

  // ---- Scroll-depth tracking ----
  const scrollMarks = [25, 50, 75, 90];
  const sentScrollMarks = new Set();

  const checkScroll = () => {
    const doc = document.documentElement;
    const maxScroll = doc.scrollHeight - window.innerHeight;
    if (maxScroll <= 0) return;

    const percent = Math.round((window.scrollY / maxScroll) * 100);

    scrollMarks.forEach((mark) => {
      if (percent >= mark && !sentScrollMarks.has(mark)) {
        sentScrollMarks.add(mark);
        send("scroll_depth", {
          percent: mark,
          page: window.location.pathname
        });
      }
    });
  };

  window.addEventListener("scroll", checkScroll, { passive: true });
  window.addEventListener("resize", checkScroll);
  setTimeout(checkScroll, 1000);

  // ---- Section visibility tracking ----
  // Main homepage sections and case-study sections are tracked once when
  // they become meaningfully visible.
  if ("IntersectionObserver" in window) {
    const sections = document.querySelectorAll("main section[id], .case-section");
    const seen = new Set();

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const el = entry.target;
        const sectionId =
          el.id ||
          cleanText(el.querySelector("h2")?.textContent) ||
          "case_section";

        if (seen.has(sectionId)) return;
        seen.add(sectionId);

        send("section_view", {
          section: sectionId,
          page: window.location.pathname
        });

        observer.unobserve(el);
      });
    }, { threshold: 0.45 });

    sections.forEach((section) => observer.observe(section));
  }

  // ---- Engagement milestones ----
  const engagementMarks = [30, 60, 120];
  const sentEngagement = new Set();

  engagementMarks.forEach((seconds) => {
    setTimeout(() => {
      if (document.visibilityState === "visible" && !sentEngagement.has(seconds)) {
        sentEngagement.add(seconds);
        send("engagement_milestone", {
          seconds: seconds,
          page: window.location.pathname
        });
      }
    }, seconds * 1000);
  });

  // ---- Campaign/UTM capture for custom reporting ----
  // GA4 already processes UTM parameters. This event makes campaign
  // attribution visible in the event stream without sending personal data.
  const params = new URLSearchParams(window.location.search);
  const source = params.get("utm_source");
  const medium = params.get("utm_medium");
  const campaign = params.get("utm_campaign");
  const content = params.get("utm_content");

  if (source || medium || campaign || content) {
    send("campaign_visit", {
      utm_source: source || "(none)",
      utm_medium: medium || "(none)",
      utm_campaign: campaign || "(none)",
      utm_content: content || "(none)"
    });
  }
})();
