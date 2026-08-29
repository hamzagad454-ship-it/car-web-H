/* =========================================================
   MASHARY CARS — WhatsApp & Social Media floating widget
   Edit ONLY the values inside SOCIAL_CONFIG below.
   ========================================================= */
(function () {
  var SOCIAL_CONFIG = {
    whatsappNumber: "201029208418",
    whatsappMessage: "Hello Mashary Cars, I would like to know more.",
    social: {
      facebook: "https://www.facebook.com/",
      instagram: "https://www.instagram.com/",
      tiktok: "https://www.tiktok.com/",
    },
  };

  // WhatsApp float button
  var waFloat = document.getElementById("waFloat");
  if (waFloat) {
    waFloat.href =
      "https://wa.me/" +
      SOCIAL_CONFIG.whatsappNumber +
      "?text=" +
      encodeURIComponent(SOCIAL_CONFIG.whatsappMessage);
  }

  // Social links
  var pairs = {
    facebook: ["socialFacebookFloat"],
    instagram: ["socialInstagramFloat"],
    tiktok: ["socialTiktokFloat"],
  };
  Object.keys(pairs).forEach(function (key) {
    pairs[key].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.href = SOCIAL_CONFIG.social[key];
    });
  });

  // Toggle open/close behaviour
  var wrap = document.getElementById("socialFloat");
  var toggle = document.getElementById("socialToggle");
  var card = document.getElementById("socialFloatLinks");
  if (!wrap || !toggle) return;

  function setOpen(open) {
    wrap.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute(
      "aria-label",
      open ? "Close social media links" : "Open social media links"
    );
    if (card) card.setAttribute("aria-hidden", String(!open));
  }

  toggle.addEventListener("click", function (e) {
    e.stopPropagation();
    setOpen(!wrap.classList.contains("open"));
  });

  document.addEventListener("click", function (e) {
    if (!wrap.contains(e.target)) setOpen(false);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") setOpen(false);
  });
})();
