$(document).ready(function () {

  // APİLER
  const newsApi = "https://run.mocky.io/v3/1234ccca-cfc2-4d15-8aeb-c310f83f0c04";
  const weatherApi = "https://run.mocky.io/v3/77fbf412-0b1e-4b64-a996-b38ae09aea43";
  const financeApi = "https://run.mocky.io/v3/63a7c74f-61ce-42d8-8f7c-dfb926f6fe67";

  // HABER PAGING
  const pageSize = 5;
  let currentPage = 1;
  let allNews = [];

  // HABERLER
  $.get(newsApi, function (data) {
    const indicators = $("#carousel-indicators");

    data.slice(0, 5).forEach((item, index) => {
      $("#slider-content").append(`
        <div class="carousel-item ${index === 0 ? 'active' : ''}">
          <img src="${item.image}" class="d-block w-100 slider-image" alt="${item.title}">
          <div class="carousel-caption d-none d-md-block">
            <h5>${item.title}</h5>
            <p>${item.description}</p>
          </div>
        </div>
      `);

      indicators.append(`
        <button type="button" data-bs-target="#newsCarousel" data-bs-slide-to="${index}"
          class="${index === 0 ? 'active' : ''}" aria-current="${index === 0 ? 'true' : 'false'}"
          aria-label="Slide ${index + 1}"></button>
      `);
    });

    allNews = data.slice(5);
    renderNewsPage();
    renderPagination(allNews.length);

    let index = 0;
    function showSideNews() {
      const item = data[index];
      $("#side-news").html(`
        <img src="${item.image}" class="img-fluid mb-2" alt="${item.title}">
        <h6 class="fw-bold">${item.title}</h6>
        <p style="font-size: 0.9rem">${item.description}</p>
      `);
      index = (index + 1) % data.length;
    }
    showSideNews();
    setInterval(showSideNews, 5000);
  });

  // PAGING
  function renderNewsPage() {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const pagedNews = allNews.slice(start, end);

    let content = '<div class="row g-3">';
    pagedNews.forEach(item => {
      content += `
        <div class="col-12">
          <div class="card shadow-sm p-2">
            <div class="row g-2 align-items-center">
              <div class="col-md-3 col-4">
                <img src="${item.image}" alt="${item.title}" class="img-fluid rounded">
              </div>
              <div class="col-md-9 col-8">
                <h6 class="fw-bold mb-1">${item.title}</h6>
                <p class="mb-0" style="font-size: 0.9rem;">${item.description}</p>
              </div>
            </div>
          </div>
        </div>
      `;
    });
    content += '</div>';
    $("#news-list").html(content);
  }

  function renderPagination(totalItems) {
    const pageCount = Math.ceil(totalItems / pageSize);
    let buttons = "";

    for (let i = 1; i <= pageCount; i++) {
      buttons += `
        <li class="page-item ${i === currentPage ? 'active' : ''}">
          <button class="page-link" onclick="goToPage(${i})">${i}</button>
        </li>`;
    }
    $("#pagination").html(buttons);
  }

  window.goToPage = function (page) {
    currentPage = page;
    renderNewsPage();
    renderPagination(allNews.length);
  };

  // HAVA DURUMU
  $.get(weatherApi, function (data) {
    const forecastItems = data.forecast.map(item => `
      <div class="day-box text-center mx-1">
        <div>${item.day}</div>
        <div style="font-size: 1.2rem">${item.icon}</div>
        <div>${item.max}°/${item.min}°</div>
      </div>
    `).join("");

    $("#weather-widget").html(`
      <div class="p-3 text-white rounded" style="background: linear-gradient(to right, #714c7d, #c270b9);">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <h6 class="mb-0">${data.city}</h6>
          <span style="font-size: 1.5rem;">${data.current}°C</span>
        </div>
        <p class="mb-3" style="font-size: 0.85rem;">${data.warning}</p>
        <div class="d-flex justify-content-between flex-wrap gap-1">
          ${forecastItems}
        </div>
      </div>
    `);
  });

  // FİNANS
  $.get(financeApi, function (data) {
    let content = '';
    data.forEach(item => {
      const isNegative = item.change.startsWith('-');
      const color = isNegative ? 'text-danger' : 'text-success';
      const arrow = isNegative ? '▼' : '▲';

      content += `
        <div class="me-4">
          <span class="fw-bold text-dark">${item.name}</span> 
          <span class="text-dark">${item.value}</span> 
          <span class="${color}">${item.change} ${arrow}</span>
        </div>
      `;
    });
    $("#finance-bar").html(content);
  });
});
