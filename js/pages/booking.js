/* ============================================
   Booking Page
   Reads ?slug= (and optional &request=1) from the URL, renders the
   selected car summary, and submits the request over WhatsApp.
   ============================================ */

function getQueryParam(name) {
  return new URL(window.location.href).searchParams.get(name);
}

const bookingCar = getCar(getQueryParam('slug'));
const isAvailabilityRequest =
  getQueryParam('request') === '1' ||
  (bookingCar && bookingCar.status === 'request-availability');

function todayISO() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function setBookingDateConstraints() {
  const today = todayISO();
  const pickup = document.getElementById('bk-pickup-date');
  const dropoff = document.getElementById('bk-dropoff-date');
  if (pickup) pickup.min = today;
  if (dropoff) dropoff.min = pickup && pickup.value ? pickup.value : today;
}

function renderCarNotFound() {
  document.getElementById('selected-car').innerHTML =
    '<strong>Car not found.</strong><br><a href="cars.html" class="btn-primary" style="margin-top:1rem;">Back to Cars</a>';
  document.getElementById('booking-form').style.display = 'none';
}

function renderInvalidCountry(countryParamObj) {
  const message = currentLang === 'ar'
    ? 'الدولة المختارة غير صالحة لهذا الحجز.'
    : 'The selected country is not valid for this booking.';
  const backLabel = currentLang === 'ar' ? 'العودة للسيارات' : 'Back to Cars';
  document.getElementById('selected-car').innerHTML =
    `<strong>${message}</strong><br><a href="cars.html" class="btn-primary" style="margin-top:1rem;">${backLabel}</a>`;
  document.getElementById('booking-form').style.display = 'none';
}

function renderSelectedCarSummary(countryParam, countryParamObj) {
  document.getElementById('bk-country').value = countryParam;
  const countryName = currentLang === 'ar' ? countryParamObj.nameAr : countryParamObj.name;

  const countryDisplay = document.getElementById('bk-country-display');
  if (countryDisplay) {
    const countryCode = countryParam === 'egypt' ? 'EG' : countryParam === 'morocco' ? 'MA' : '';
    countryDisplay.value = (countryCode ? countryCode + ' ' : '') + countryName;
  }

  document.getElementById('bk-car').value = bookingCar.name;
  const priceData = getCarPriceData(bookingCar, countryParam);
  const priceLabel = priceData
    ? `${formatPrice(priceData.price, priceData.currency)} ${t('perDay')}`
    : t('contactForPrice');
  const noteHtml = isAvailabilityRequest
    ? `<div class="booking-summary-note">${t('requestAvailability')} — ${t('tryChangingFilters')}</div>`
    : '';

  document.getElementById('selected-car').innerHTML = `
    <div class="booking-car-visual">
      <div class="booking-car-image-wrap"><img src="${bookingCar.images[0]}" alt="${bookingCar.name}" class="booking-car-image"></div>
      <div class="booking-car-info">
        <div class="booking-summary-label">${isAvailabilityRequest ? t('availabilityRequest') : t('bookingRequest')}</div>
        <div class="booking-summary-name">${bookingCar.name}</div>
        <div class="booking-summary-meta"><span>${priceLabel}</span><span>•</span><span>${countryName}</span></div>
        ${noteHtml}
      </div>
    </div>`;

  setBookingDateConstraints();
}

function initBookingSummary() {
  if (!bookingCar) {
    renderCarNotFound();
    return;
  }

  // The pickup country is fixed by the selected car; the customer cannot change it.
  const countryParam = getCarCountryId(bookingCar);
  const countryParamObj = getCountry(countryParam);
  const countryValid = !!(
    countryParamObj &&
    countryParamObj.available &&
    bookingCar.countryIds.includes(countryParam)
  );

  if (!countryValid) {
    renderInvalidCountry(countryParamObj);
    return;
  }

  renderSelectedCarSummary(countryParam, countryParamObj);
}

function handleCarBooking(event) {
  event.preventDefault();
  if (!bookingCar) return;

  const countryId = document.getElementById('bk-country').value;
  const country = getCountry(countryId);
  const pickupDate = document.getElementById('bk-pickup-date').value;
  const dropoffDate = document.getElementById('bk-dropoff-date').value;
  const pickupTime = document.getElementById('bk-pickup-time').value;
  const dropoffTime = document.getElementById('bk-dropoff-time').value;

  if (!country || !country.available || !bookingCar.countryIds.includes(countryId)) {
    showToast(t('requiredFields'));
    return;
  }
  if (!pickupDate || pickupDate < todayISO()) {
    showToast(t('datePickupPast'));
    return;
  }
  if (!dropoffDate || dropoffDate < pickupDate) {
    showToast(t('returnDateBeforePickup'));
    return;
  }
  if (pickupDate === dropoffDate && (!pickupTime || !dropoffTime || dropoffTime <= pickupTime)) {
    showToast(t('returnTimeBeforePickup'));
    return;
  }

  const form = document.getElementById('booking-form');
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  let msg = buildWhatsAppMessage({
    car: bookingCar.name,
    country: currentLang === 'ar' ? country.nameAr : country.name,
    pickupDate: pickupDate,
    pickupTime: pickupTime,
    pickupLocation: document.getElementById('bk-pickup-location').value,
    dropoffDate: dropoffDate,
    dropoffTime: dropoffTime,
    passengers: document.getElementById('bk-passengers').value,
    bags: document.getElementById('bk-bags').value,
    name: document.getElementById('bk-name').value,
    phone: document.getElementById('bk-phone').value,
    notes: document.getElementById('bk-notes').value
  });

  if (isAvailabilityRequest) {
    msg = (currentLang === 'ar'
      ? 'مرحبًا Mashary Cars، هذا طلب للتحقق من توفر السيارة وليس حجزًا مؤكدًا.\n\n'
      : 'Hello Mashary Cars, this is an availability request and not a confirmed booking.\n\n') + msg;
  }

  openWhatsApp(getWhatsAppNumber(countryId), msg);
}

function bindPickupDateConstraint() {
  const pickupDateInput = document.getElementById('bk-pickup-date');
  if (!pickupDateInput) return;
  pickupDateInput.addEventListener('change', function () {
    const dropoff = document.getElementById('bk-dropoff-date');
    if (dropoff) {
      dropoff.min = this.value || todayISO();
      if (dropoff.value && dropoff.value < dropoff.min) dropoff.value = '';
    }
  });
}

initBookingSummary();
bindPickupDateConstraint();
setBookingDateConstraints();
