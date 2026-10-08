/* Replace these values with the client's real details before publishing. */
const SITE_CONFIG = {
  name: "Birds Link Homestay",
  location: "Nagari Village, Joida, near Dandeli in Uttara Kannada, Karnataka (PIN 581186)",
  phone: "918660334428",
  alternatePhone: "919449916209",
  email: "Kumbhargautam7@gmail.com",
  googleMaps: "https://www.google.com/maps/search/?api=1&query=Nagari+Village%2C+Joida%2C+near+Dandeli%2C+Uttara+Kannada%2C+Karnataka+581186",
  instagram: "https://www.instagram.com/birds_link_homestay/?hl=en"
};

const whatsappNumber = SITE_CONFIG.phone.replace(/\D/g, "");
const whatsappReady = /^\d{10,15}$/.test(whatsappNumber);
const bookingForm = document.querySelector("#booking-form");
const phoneInput = bookingForm.elements.namedItem("phone");
const nameInput = bookingForm.elements.namedItem("name");
const formStatus = document.querySelector("#form-status");
const packageSelect = bookingForm.elements.namedItem("package");
const guestSelect = bookingForm.elements.namedItem("guests");
const customGuestsInput = bookingForm.elements.namedItem("customGuests");
const checkinInput = bookingForm.elements.namedItem("checkin");
const checkoutInput = bookingForm.elements.namedItem("checkout");
const customGuestsField = document.querySelector(".custom-guests-field");
const estimateTotal = document.querySelector("#estimate-total");
const packageRates = {
  "normal-cottage": { name: "Normal Package — Cottage stay", rate: 1200 },
  "normal-dorm": { name: "Normal Package — Dormitory stay", rate: 1100 },
  "normal-tent": { name: "Normal Package — Tent stay", rate: 1000 },
  "loaded-cottage": { name: "Fully Loaded Package — Cottage stay", rate: 2200 },
  "loaded-dorm": { name: "Fully Loaded Package — Dormitory stay", rate: 2000 },
  "loaded-tent": { name: "Fully Loaded Package — Tent stay", rate: 1900 }
};

phoneInput.addEventListener("input", () => {
  phoneInput.value = phoneInput.value.replace(/\D/g, "").slice(0, 10);
});

document.querySelectorAll("[data-location]").forEach((element) => {
  element.textContent = SITE_CONFIG.location;
});

document.querySelectorAll("[data-phone]").forEach((element) => {
  element.textContent = SITE_CONFIG.phone || "Phone number to be added";
});

document.querySelectorAll("[data-email]").forEach((element) => {
  element.textContent = SITE_CONFIG.email || "Email address to be added";
});

document.querySelectorAll("[data-phone-link]").forEach((link) => {
  const phone = link.dataset.phoneLink === "secondary" ? SITE_CONFIG.alternatePhone : SITE_CONFIG.phone;
  if (phone) {
    link.href = `tel:+${phone.replace(/\D/g, "")}`;
  }
});

document.querySelectorAll("[data-email-link]").forEach((link) => {
  if (SITE_CONFIG.email) {
    link.href = `mailto:${SITE_CONFIG.email}`;
  }
});

const mapUrl = SITE_CONFIG.googleMaps;
document.querySelectorAll("[data-map-link]").forEach((link) => {
  link.href = mapUrl;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
});
const mapFrame = document.querySelector(".map-frame iframe");
const mapFrameUrl = `https://www.google.com/maps?q=${encodeURIComponent(SITE_CONFIG.location)}&output=embed`;
if ("IntersectionObserver" in window) {
  const mapObserver = new IntersectionObserver((entries, observer) => {
    if (entries.some((entry) => entry.isIntersecting)) {
      mapFrame.src = mapFrameUrl;
      observer.disconnect();
    }
  }, { rootMargin: "200px" });
  mapObserver.observe(mapFrame);
} else {
  mapFrame.src = mapFrameUrl;
}

document.querySelectorAll("[data-instagram]").forEach((link) => {
  if (SITE_CONFIG.instagram) {
    link.href = SITE_CONFIG.instagram;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  }
});

const heroImages = [...document.querySelectorAll(".hero-image")];
const heroSlideCount = document.querySelector(".hero-count span");
const heroSlides = [
  "hero.jpg",
  "kayaking.jpg",
  "nature-walk.jpg",
  "hill-trail.jpg"
];
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let activeHeroImage = heroImages[0];
let inactiveHeroImage = heroImages[1];
let activeHeroSlide = 0;
let heroSlideTimer;
let heroSlideStartTimer;
let changingHeroSlide = false;

async function showNextHeroSlide() {
  if (changingHeroSlide) return;
  changingHeroSlide = true;
  const nextSlide = (activeHeroSlide + 1) % heroSlides.length;
  const nextImage = new Image();
  nextImage.src = heroSlides[nextSlide];

  try {
    await nextImage.decode();
    inactiveHeroImage.src = heroSlides[nextSlide];
    await inactiveHeroImage.decode();
    inactiveHeroImage.classList.add("is-active");
    activeHeroImage.classList.remove("is-active");
    [activeHeroImage, inactiveHeroImage] = [inactiveHeroImage, activeHeroImage];
    activeHeroSlide = nextSlide;
    heroSlideCount.textContent = String(activeHeroSlide + 1).padStart(2, "0");
  } catch (error) {
    console.error(`Unable to load hero slide: ${heroSlides[nextSlide]}`, error);
  } finally {
    changingHeroSlide = false;
  }
}

function updateHeroSlideshow() {
  window.clearInterval(heroSlideTimer);
  window.clearTimeout(heroSlideStartTimer);
  if (!document.hidden && !reducedMotion.matches) {
    heroSlideStartTimer = window.setTimeout(() => {
      showNextHeroSlide();
      heroSlideTimer = window.setInterval(showNextHeroSlide, 5000);
    }, 12000);
  }
}

document.addEventListener("visibilitychange", updateHeroSlideshow);
reducedMotion.addEventListener("change", updateHeroSlideshow);
updateHeroSlideshow();

function showMissingWhatsApp() {
  if (formStatus) {
    formStatus.textContent = "Please add the resort's WhatsApp number in script.js before sending enquiries.";
  }
}

function openWhatsApp(message) {
  if (!whatsappReady) {
    showMissingWhatsApp();
    return;
  }
  window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
}

document.querySelectorAll("[data-whatsapp]").forEach((link) => {
  link.href = whatsappReady ? `https://wa.me/${whatsappNumber}` : "#contact";
  if (whatsappReady) {
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  } else {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      showMissingWhatsApp();
      document.querySelector("#contact").scrollIntoView({ behavior: "smooth" });
    });
  }
});

document.querySelectorAll(".enquire-link").forEach((link) => {
  link.addEventListener("click", (event) => {
    if (!whatsappReady) {
      event.preventDefault();
      showMissingWhatsApp();
      document.querySelector("#contact").scrollIntoView({ behavior: "smooth" });
      return;
    }
    event.preventDefault();
    openWhatsApp(`Hello, I'm interested in the ${link.dataset.room} at ${SITE_CONFIG.name}. Could you please share availability and rates?`);
  });
});

document.querySelectorAll(".package-select-link").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    packageSelect.value = link.dataset.packageOption;
    updatePackageEstimate();
    focusNameInput();
  });
});

function focusNameInput() {
  nameInput.scrollIntoView({ behavior: "smooth", block: "center" });
  nameInput.focus({ preventScroll: true });
}

document.querySelector(".nav-book").addEventListener("click", (event) => {
  event.preventDefault();
  closeMenu();
  focusNameInput();
});

function updatePackageEstimate() {
  const packageDetails = packageRates[packageSelect.value];
  const isCustomGroup = guestSelect.value === "custom";
  const guestCount = isCustomGroup ? Number(customGuestsInput.value) : Number(guestSelect.value);

  customGuestsField.hidden = !isCustomGroup;
  customGuestsInput.disabled = !isCustomGroup;
  customGuestsInput.required = isCustomGroup;

  if (!packageDetails || !Number.isInteger(guestCount) || guestCount < 1 || (isCustomGroup && guestCount < 5)) {
    estimateTotal.hidden = true;
    estimateTotal.textContent = "";
    return null;
  }

  if (!checkinInput.value || !checkoutInput.value) {
    estimateTotal.textContent = "Select check-in and check-out dates to calculate your package total.";
    estimateTotal.hidden = false;
    return null;
  }

  const checkinDate = new Date(`${checkinInput.value}T00:00:00Z`);
  const checkoutDate = new Date(`${checkoutInput.value}T00:00:00Z`);
  const stayDays = Math.round((checkoutDate.getTime() - checkinDate.getTime()) / 86400000);

  if (!Number.isInteger(stayDays) || stayDays < 1) {
    estimateTotal.textContent = "Check-out must be at least one day after check-in.";
    estimateTotal.hidden = false;
    return null;
  }

  const perPersonTotal = packageDetails.rate * stayDays;
  const total = perPersonTotal * guestCount;
  const formattedPerPersonTotal = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(perPersonTotal);
  const formattedTotal = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(total);

  estimateTotal.textContent = `${stayDays} ${stayDays === 1 ? "day" : "days"} · 23-hour package per day · ${formattedPerPersonTotal} per person · Estimated group total: ${formattedTotal} (${guestCount} guests). Extra charges, if applicable, are not included.`;
  estimateTotal.hidden = false;
  return { formattedTotal, formattedPerPersonTotal, stayDays };
}

packageSelect.addEventListener("change", () => {
  updatePackageEstimate();
  focusNameInput();
});
guestSelect.addEventListener("change", updatePackageEstimate);
customGuestsInput.addEventListener("input", updatePackageEstimate);
checkinInput.addEventListener("change", updatePackageEstimate);

if (bookingForm) {
  bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!whatsappReady) {
      showMissingWhatsApp();
      return;
    }
    if (!bookingForm.reportValidity()) return;

    const data = new FormData(bookingForm);
    const packageDetails = packageRates[data.get("package")];
    const guestCount = data.get("guests") === "custom" ? data.get("customGuests") : data.get("guests");
    const estimate = updatePackageEstimate();
    const details = [
      `Hello, I'd like to enquire about a stay at ${SITE_CONFIG.name}.`,
      `Name: ${data.get("name")}`,
      `Phone: +91 ${data.get("phone")}`,
      data.get("checkin") ? `Check-in: ${data.get("checkin")}` : "",
      data.get("checkout") ? `Check-out: ${data.get("checkout")}` : "",
      packageDetails ? `Package: ${packageDetails.name} (₹${packageDetails.rate.toLocaleString("en-IN")} per person)` : "",
      guestCount ? `Guests: ${guestCount}` : "",
      estimate ? `Stay duration: ${estimate.stayDays} ${estimate.stayDays === 1 ? "day" : "days"} (23-hour package per day)` : "",
      estimate ? `Dates: ${data.get("checkin")} to ${data.get("checkout")}` : "",
      estimate ? `Package total per person: ${estimate.formattedPerPersonTotal}` : "",
      estimate ? `Estimated total for ${guestCount} guests: ${estimate.formattedTotal} (excluding applicable extra charges)` : "",
      data.get("message") ? `Message: ${data.get("message")}` : ""
    ].filter(Boolean);
    openWhatsApp(details.join("\n"));
  });
}

const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-menu");
const themeToggle = document.querySelector(".theme-toggle");
const themeToggleIcon = themeToggle.querySelector(".theme-toggle-icon");
const themeColorMeta = document.querySelector('meta[name="theme-color"]');
const themeStorageKey = "birds-link-theme";

function applyTheme(theme) {
  const isDark = theme === "dark";
  document.documentElement.dataset.theme = isDark ? "dark" : "light";
  themeToggle.setAttribute("aria-pressed", String(isDark));
  themeToggle.setAttribute("aria-label", isDark ? "Switch to day mode" : "Switch to night mode");
  themeToggleIcon.textContent = isDark ? "☀" : "☾";
  themeColorMeta.content = isDark ? "#111a16" : "#173b2d";
}

let savedTheme = null;
try {
  savedTheme = window.localStorage.getItem(themeStorageKey);
} catch (error) {
  console.error("Unable to read the saved color theme.", error);
}
applyTheme(savedTheme === "dark" ? "dark" : "light");

themeToggle.addEventListener("click", () => {
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(nextTheme);
  try {
    window.localStorage.setItem(themeStorageKey, nextTheme);
  } catch (error) {
    console.error("Unable to save the color theme preference.", error);
  }
});

function closeMenu() {
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation menu");
  navMenu.classList.remove("is-open");
  document.body.classList.remove("menu-open");
}

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Open navigation menu" : "Close navigation menu");
  navMenu.classList.toggle("is-open", !isOpen);
  document.body.classList.toggle("menu-open", !isOpen);
});

navMenu.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});
window.matchMedia("(min-width: 821px)").addEventListener("change", (event) => {
  if (event.matches) closeMenu();
});

const localToday = new Date();
const today = new Date(localToday.getTime() - localToday.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
checkinInput.min = today;
checkoutInput.min = today;
checkinInput.addEventListener("change", () => {
  const earliestCheckout = checkinInput.value
    ? new Date(new Date(`${checkinInput.value}T00:00:00Z`).getTime() + 86400000).toISOString().slice(0, 10)
    : today;
  checkoutInput.min = earliestCheckout;
  if (checkoutInput.value && checkoutInput.value < earliestCheckout) {
    checkoutInput.value = "";
  }
  updatePackageEstimate();
});
checkoutInput.addEventListener("change", updatePackageEstimate);

const galleryItems = [...document.querySelectorAll(".gallery-item")];
const lightbox = document.querySelector(".lightbox");
const lightboxImage = lightbox.querySelector("img");
const lightboxCaption = lightbox.querySelector("figcaption");
const lightboxCount = lightbox.querySelector(".lightbox-count");
let activeGalleryIndex = 0;

function showGalleryImage(index) {
  activeGalleryIndex = (index + galleryItems.length) % galleryItems.length;
  const item = galleryItems[activeGalleryIndex];
  lightboxImage.src = item.dataset.full;
  lightboxImage.alt = item.querySelector("img").alt;
  lightboxCaption.textContent = item.dataset.caption;
  lightboxCount.textContent = `${activeGalleryIndex + 1} / ${galleryItems.length}`;
}

galleryItems.forEach((item, index) => {
  item.addEventListener("click", () => {
    showGalleryImage(index);
    lightbox.showModal();
  });
});

lightbox.querySelector(".lightbox-close").addEventListener("click", () => lightbox.close());
lightbox.querySelector(".lightbox-prev").addEventListener("click", () => showGalleryImage(activeGalleryIndex - 1));
lightbox.querySelector(".lightbox-next").addEventListener("click", () => showGalleryImage(activeGalleryIndex + 1));
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) lightbox.close();
});
lightbox.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") showGalleryImage(activeGalleryIndex - 1);
  if (event.key === "ArrowRight") showGalleryImage(activeGalleryIndex + 1);
});

if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));
} else {
  document.querySelectorAll(".reveal").forEach((element) => element.classList.add("is-visible"));
}

document.querySelector("#year").textContent = new Date().getFullYear();
