const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");

navToggle?.addEventListener("click", () => {
  nav?.classList.toggle("open");
});

document.querySelectorAll("[data-nav] a").forEach((link) => {
  link.addEventListener("click", () => nav?.classList.remove("open"));
});

const featureTabs = document.querySelector("[data-feature-tabs]");
if (featureTabs) {
  featureTabs.addEventListener("click", (e) => {
    const tab = e.target.closest("[data-tab]");
    if (!tab) return;
    
    const tabName = tab.dataset.tab;
    
    // Update active tab
    featureTabs.querySelectorAll(".feature-tab").forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    
    // Update active panel
    document.querySelectorAll("[data-panel]").forEach((panel) => {
      panel.classList.remove("active");
      if (panel.dataset.panel === tabName) {
        panel.classList.add("active");
      }
    });
  });
}

const businessCopy = {
  Retail: "Produk, stok, barcode, pembayaran cepat, laporan, dan struk thermal.",
  Cafe: "Makan di tempat, dibungkus, nomor meja, QRIS statis, dan kitchen print.",
  Restoran: "Order meja, order dapur, struk kasir, stok bahan/produk, dan laporan harian.",
  Gym: "Data member, tanggal expired, check-in, produk membership, dan laporan pembayaran.",
  Jasa: "Produk layanan, pembayaran manual, customer history, dan laporan pemasukan.",
};

const businessCard = document.querySelector("[data-business-card]");
document.querySelectorAll("[data-business]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-business]").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    const name = button.dataset.business || "Retail";
    if (businessCard) {
      businessCard.innerHTML = `<h3>${name}</h3><p>${businessCopy[name] || businessCopy.Retail}</p>`;
    }
  });
});

const sections = Array.from(document.querySelectorAll("main section[id], .docs-content article[id]"));
const navLinks = Array.from(document.querySelectorAll(".site-nav a[href^='#']"));

const observer = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${visible.target.id}`);
    });
  },
  { rootMargin: "-20% 0px -65% 0px", threshold: [0.1, 0.4, 0.7] },
);

sections.forEach((section) => observer.observe(section));

// Scroll Animations
const animateOnScroll = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-fade-in-up");
        animateOnScroll.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

document.querySelectorAll(".feature-detail-card, .testimonial-card, .faq-item, .stat-item").forEach((el) => {
  el.style.opacity = "0";
  animateOnScroll.observe(el);
});

// FAQ Toggle
document.querySelectorAll(".faq-question").forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.parentElement;
    const isActive = item.classList.contains("active");
    
    // Close all other FAQs
    document.querySelectorAll(".faq-item").forEach((faqItem) => {
      faqItem.classList.remove("active");
    });
    
    // Toggle current FAQ
    if (!isActive) {
      item.classList.add("active");
    }
  });
});

// Counter Animation
const animateCounters = () => {
  document.querySelectorAll(".stat-number").forEach((counter) => {
    const text = counter.textContent;
    const hasPlus = text.includes("+");
    const hasPercent = text.includes("%");
    const hasSlash = text.includes("/");
    
    // Extract number
    let target;
    let suffix = "";
    
    if (hasPercent) {
      target = parseFloat(text.replace("%", ""));
      suffix = "%";
    } else if (hasSlash) {
      // For "24/7" format, just animate the first number
      target = parseInt(text.split("/")[0]);
      suffix = "/" + text.split("/")[1];
    } else if (text.includes("K")) {
      target = parseInt(text.replace("K+", "").replace("+", ""));
      suffix = "K+";
    } else {
      target = parseInt(text.replace("+", ""));
      suffix = hasPlus ? "+" : "";
    }
    
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        counter.textContent = text; // Restore original text
        clearInterval(timer);
      } else {
        counter.textContent = Math.floor(current) + suffix;
      }
    }, 30);
  });
};

// Trigger counter animation when stats section is visible
const statsSection = document.querySelector(".stats-section");
if (statsSection) {
  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounters();
          statsObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  statsObserver.observe(statsSection);
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});
