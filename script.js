/* ============================================
   iDigitalStudies — Interactive Scripts
   ============================================ */

// Animated Counters
const counters = document.querySelectorAll("[data-count]");
const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number(el.dataset.count);
      const duration = 1500;
      const start = performance.now();

      function tick(now) {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3); // Ease-out cubic
        el.textContent = Math.floor(target * eased) + "+";
        if (p < 1) requestAnimationFrame(tick);
      }

      requestAnimationFrame(tick);
      counterObserver.unobserve(el);
    });
  },
  { threshold: 0.5 },
);

counters.forEach((c) => counterObserver.observe(c));

// Lead Form Submission with Google Sheet Integration
const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzXMhXBjqb7642-9RsgGRiyPjdc5Ho1Yyqe_uoRGejWIl4-IBPujmVjfaNkD8vWcoKoLQ/exec";

function bindLeadForm(formEl, msgBoxEl) {
  if (!formEl) return;

  formEl.addEventListener("submit", async (e) => {
    e.preventDefault();
    const submitBtn = formEl.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;

    const data = new FormData(formEl);
    const payload = {
      name: (data.get("name") || "").trim(),
      phone: (data.get("phone") || "").trim(),
      email: (data.get("email") || "").trim(),
      course: data.get("course") || "",
      mode: data.get("mode") || "",
      timeline: data.get("timeline") || "",
    };

    console.log("Submitting lead payload:", payload);

    // UI Loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML =
      '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    if (msgBoxEl) {
      msgBoxEl.textContent = "";
      msgBoxEl.className = "form-message";
    }

    try {
      // Send to Google Apps Script
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
      });

      // Success feedback
      if (msgBoxEl) {
        msgBoxEl.textContent =
          "✅ Thank you! Redirecting to confirmation page…";
        msgBoxEl.className = "form-message form-success";
      }
      formEl.reset();

      // Redirect directly to Thank You page
      setTimeout(() => {
        window.location.href = "thank-you/";
      }, 300);
    } catch (err) {
      console.error("Submission error:", err);
      if (msgBoxEl) {
        msgBoxEl.textContent =
          "✅ Thank you! Redirecting to confirmation page…";
        msgBoxEl.className = "form-message form-success";
      }
      formEl.reset();
      setTimeout(() => {
        window.location.href = "thank-you/";
      }, 300);
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }
  });
}

// Bind both Hero form (top) and Bottom form (desktop/bottom)
bindLeadForm(
  document.getElementById("leadForm"),
  document.getElementById("formMessage"),
);
bindLeadForm(
  document.getElementById("bottomLeadForm"),
  document.getElementById("bottomFormMessage"),
);

// Active color for select dropdowns when chosen
document.querySelectorAll(".input-wrap select").forEach((sel) => {
  sel.addEventListener("change", () => {
    sel.style.color = sel.value ? "#1a1f36" : "#9ca3be";
  });
});

// Smooth Scroll for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const id = a.getAttribute("href");
    if (id.length > 1) {
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        const headerHeight =
          document.querySelector(".site-header").offsetHeight;
        const targetPosition =
          target.getBoundingClientRect().top +
          window.pageYOffset -
          headerHeight -
          10;
        window.scrollTo({ top: targetPosition, behavior: "smooth" });
      }
    }
  });
});

// Scroll Reveal Animation
const revealElements = document.querySelectorAll(
  ".feature, .topic, .number-card, .journey-step, .tool-item, .review-grid blockquote, .support-card, .bottom-card",
);

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: "0px 0px -30px 0px" },
);

revealElements.forEach((el, i) => {
  el.style.opacity = "0";
  el.style.transform = "translateY(20px)";
  el.style.transition = `opacity 0.5s ease ${(i % 6) * 0.08}s, transform 0.5s ease ${(i % 6) * 0.08}s`;
  revealObserver.observe(el);
});

// Active nav link highlight on scroll
const sections = document.querySelectorAll("section[id]");
window.addEventListener("scroll", () => {
  const scrollY = window.pageYOffset;
  const headerHeight = document.querySelector(".site-header").offsetHeight;

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - headerHeight - 100;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute("id");

    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      document.querySelectorAll(".main-nav a:not(.nav-cta)").forEach((link) => {
        link.style.color = "";
        if (link.getAttribute("href") === "#" + sectionId) {
          link.style.color = "#ff5b1a";
        }
      });
    }
  });
});

// Header shadow on scroll
window.addEventListener("scroll", () => {
  const header = document.querySelector(".site-header");
  if (window.scrollY > 10) {
    header.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)";
  } else {
    header.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)";
  }
});
