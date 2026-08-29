/* ============================================
   Cars Listing Page
   Filter chips (country/category), search box, and grid rendering.
   Active-state is derived from each chip's onclick attribute so the
   markup stays the single source of truth for which filter it represents.
   ============================================ */

var currentCategory = "";
var currentCountry = "egypt";

function setCountry(country) {
  currentCountry = country || "";
  document
    .querySelectorAll("#country-filters .filter-chip")
    .forEach(function (btn) {
      var onclick = btn.getAttribute("onclick") || "";
      btn.classList.toggle(
        "active",
        (!currentCountry && onclick.indexOf("setCountry('')") !== -1) ||
          onclick.indexOf("setCountry('" + currentCountry + "')") !== -1,
      );
    });
  applyFilters();
}

function setCategory(cat) {
  currentCategory = cat;
  document
    .querySelectorAll("#category-filters .filter-chip")
    .forEach(function (btn) {
      btn.classList.remove("active");
      var onclick = btn.getAttribute("onclick") || "";
      if (
        (!cat && onclick.indexOf("setCategory('')") !== -1) ||
        onclick.indexOf("setCategory('" + cat + "')") !== -1
      )
        btn.classList.add("active");
    });
  applyFilters();
}

function resetFilters() {
  currentCategory = "";
  currentCountry = "egypt";
  var search = document.getElementById("car-search");
  if (search) search.value = "";
  document
    .querySelectorAll("#country-filters .filter-chip")
    .forEach(function (btn) {
      var onclick = btn.getAttribute("onclick") || "";
      btn.classList.toggle(
        "active",
        onclick.indexOf("setCountry('egypt')") !== -1,
      );
    });
  document
    .querySelectorAll("#category-filters .filter-chip")
    .forEach(function (btn) {
      btn.classList.toggle(
        "active",
        (btn.getAttribute("onclick") || "").indexOf("setCategory('')") !==
          -1,
      );
    });
  applyFilters();
}

function applyFilters() {
  var input = document.getElementById("car-search");
  var query = input ? input.value : "";
  var filtered = filterCars(query, currentCategory, currentCountry, "");
  renderCars("car-grid", filtered);
}

function applyCarLocalization() {
  var input = document.getElementById("car-search");
  if (input) {
    input.placeholder =
      currentLang === "ar"
        ? input.getAttribute("data-ar-placeholder")
        : input.getAttribute("data-en-placeholder");
  }
}

applyCarLocalization();
applyFilters();
