// Runs synchronously, before first paint, to prevent a flash of the wrong
// theme/language. Must stay a plain (non-deferred, non-module) script tag
// placed at the same spot in <head> on every page.
(function () {
  var theme = localStorage.getItem("mashary-theme") || "dark";
  document.documentElement.setAttribute("data-theme", theme);

  var lang = localStorage.getItem("mashary-lang") || "en";
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll('[data-language-logo="true"]').forEach(function (img) {
      img.src = lang === "ar" ? "logo-l.png" : "logo-r.png";
    });
  });
})();
