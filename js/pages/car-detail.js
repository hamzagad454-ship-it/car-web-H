/* ============================================
   Car Detail Page
   Renders the gallery, specs, and pricing for the car matched by ?slug=
   ============================================ */

function getParam(name) {
  var url = new URL(window.location.href);
  return url.searchParams.get(name);
}

var slug = getParam("slug");
var car = getCar(slug);

if (!car) {
  document.getElementById("car-detail").innerHTML =
    '<div style="text-align:center;padding:4rem;"><h2>Car Not Found</h2><a href="cars.html" class="btn-primary mt-4">Back to Cars</a></div>';
} else {
  var galleryHtml =
    "<div>" +
    '<div class="gallery-main"><img id="main-image" src="' +
    car.images[0] +
    '" alt="' +
    car.name +
    '"></div>' +
    '<div class="gallery-thumbs">';
  car.images.forEach(function (img, i) {
    galleryHtml +=
      '<div class="gallery-thumb ' +
      (i === 0 ? "active" : "") +
      '" onclick="setMainImage(' +
      i +
      ')"><img src="' +
      img +
      '" alt="' +
      car.name +
      '"></div>';
  });
  galleryHtml +=
    "</div>" +
    '<div style="display:flex;justify-content:space-between;align-items:center;margin-top:0.75rem;">' +
    '<span class="badge ' +
    (car.realVehicle ? "badge-success" : "badge-warning") +
    '">' +
    (car.realVehicle ? t("realVehicle") : t("representativeImage")) +
    "</span>" +
    "<button onclick=\"sharePage('" +
    car.name +
    '\')" class="btn-icon" style="width:auto;padding:0.5rem 1rem;gap:0.5rem;font-size:0.875rem;">' +
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>' +
    t("share") +
    "</button>" +
    "</div>" +
    "</div>";

  var pageParams = new URL(window.location.href).searchParams;
  var selectedCountry = getCarCountryId(car);
  var priceData = getCarPriceData(car, selectedCountry);
  var priceHtml = priceData
    ? '<div style="font-size:0.875rem;color:var(--text-muted);">' +
      t("startingFrom") +
      '</div><div style="font-size:2.5rem;font-weight:700;color:var(--accent);">' +
      formatPrice(priceData.price, priceData.currency) +
      '<span style="font-size:1rem;color:var(--text-muted);font-weight:400;"> ' +
      t("perDay") +
      "</span></div>"
    : '<div style="font-size:1.25rem;color:var(--text-secondary);">' +
      t("contactForPrice") +
      "</div>";

  var specsHtml = '<div class="spec-grid">';
  var specs = [
    {
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
      label: t("seats"),
      value: car.seats,
    },
    {
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>',
      label: t("bags"),
      value: car.bags,
    },
    {
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
      label: t("doors"),
      value: car.doors,
    },
    {
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
      label: t("transmission"),
      value:
        car.transmission === "automatic" ? t("automatic") : t("manual"),
    },
    {
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>',
      label: t("fuel"),
      value: car.fuel,
    },
    {
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
      label: t("modelYear"),
      value: car.year,
    },
    {
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>',
      label: t("airConditioning"),
      value: car.ac ? "Yes" : "No",
    },
    {
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/></svg>',
      label: t("vehicleType"),
      value: getCategoryLabel(car.category),
    },
  ];
  specs.forEach(function (s) {
    specsHtml +=
      '<div class="spec-item"><div style="color:var(--accent);flex-shrink:0;">' +
      s.icon +
      '</div><div><div class="spec-label">' +
      s.label +
      '</div><div class="spec-value">' +
      s.value +
      "</div></div></div>";
  });
  specsHtml += "</div>";

  var bestForHtml =
    '<div style="display:flex;flex-wrap:wrap;gap:0.5rem;margin-top:1rem;">';
  car.bestFor.forEach(function (tag) {
    bestForHtml +=
      '<span class="badge badge-muted">' +
      getBestForLabel(tag) +
      "</span>";
  });
  bestForHtml += "</div>";

  var servicesHtml =
    '<div style="display:flex;flex-wrap:wrap;gap:0.5rem;margin-top:1rem;">';
  car.services.forEach(function (s) {
    servicesHtml +=
      '<span class="badge" style="background:rgba(232,185,35,0.1);color:var(--accent);">' +
      s.replace(/-/g, " ").replace(/\b\w/g, function (l) {
        return l.toUpperCase();
      }) +
      "</span>";
  });
  servicesHtml += "</div>";

  document.getElementById("car-detail").innerHTML =
    galleryHtml +
    "<div>" +
    '<div style="display:flex;gap:0.75rem;margin-bottom:0.75rem;flex-wrap:wrap;">' +
    '<span class="badge badge-accent">' +
    getCategoryLabel(car.category) +
    "</span>" +
    (car.status === "request-availability"
      ? '<span class="badge badge-warning">' +
        t("requestAvailability") +
        "</span>"
      : '<span class="badge badge-success">' +
        t("available") +
        "</span>") +
    "</div>" +
    '<h1 style="font-size:2rem;font-weight:700;margin-bottom:0.5rem;">' +
    car.name +
    "</h1>" +
    '<p style="color:var(--text-secondary);margin-bottom:1.5rem;">' +
    (currentLang === "ar" && car.descAr ? car.descAr : car.desc) +
    "</p>" +
    '<div class="price-box">' +
    priceHtml +
    "</div>" +
    '<h2 style="font-size:1.25rem;font-weight:700;margin-bottom:1rem;">' +
    t("vehicleSpecifications") +
    "</h2>" +
    specsHtml +
    '<h2 style="font-size:1.25rem;font-weight:700;margin:1.5rem 0 1rem;">' +
    t("bestFor") +
    "</h2>" +
    bestForHtml +
    '<h2 style="font-size:1.25rem;font-weight:700;margin:1.5rem 0 1rem;">' +
    t("makeYourTripEasier") +
    "</h2>" +
    servicesHtml +
    '<div style="display:flex;gap:0.75rem;margin-top:2rem;">' +
    '<a href="booking.html?slug=' +
    encodeURIComponent(car.slug) +
    "&request=" +
    (car.status === "request-availability" ? "1" : "0") +
    '" class="btn-primary" style="flex:1;justify-content:center;padding:1rem;font-size:1rem;">' +
    (car.status === "request-availability"
      ? t("requestAvailability")
      : t("bookThisCar")) +
    "</a>" +
    "</div>" +
    "</div>";
}

function setMainImage(index) {
  var car = getCar(getParam("slug"));
  if (!car) return;
  document.getElementById("main-image").src = car.images[index];
  document.querySelectorAll(".gallery-thumb").forEach(function (t, i) {
    t.classList.toggle("active", i === index);
  });
}
