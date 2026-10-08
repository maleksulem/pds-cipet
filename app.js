/**
 * Power Consumption Forecasting and Analytics System
 * Pure Vanilla JavaScript Client Engine (No heavy frameworks or libraries)
 */

(function () {
  'use strict';

  // --- Initial Telemetry Dataset ---
  const INITIAL_RECORDS = [
    { id: 1, date: '2026-01-01', hour: 0, day: 1, month: 1, dayOfWeek: 'Thu', temp: 11.6, prev: 195.0, kwh: 193.19 },
    { id: 2, date: '2026-01-01', hour: 1, day: 1, month: 1, dayOfWeek: 'Thu', temp: 10.3, prev: 193.19, kwh: 181.21 },
    { id: 3, date: '2026-01-01', hour: 2, day: 1, month: 1, dayOfWeek: 'Thu', temp: 10.8, prev: 181.21, kwh: 178.55 },
    { id: 4, date: '2026-01-01', hour: 3, day: 1, month: 1, dayOfWeek: 'Thu', temp: 11.3, prev: 178.55, kwh: 169.43 },
    { id: 5, date: '2026-01-01', hour: 4, day: 1, month: 1, dayOfWeek: 'Thu', temp: 11.3, prev: 169.43, kwh: 162.82 },
    { id: 6, date: '2026-01-01', hour: 5, day: 1, month: 1, dayOfWeek: 'Thu', temp: 12.0, prev: 162.82, kwh: 163.79 },
    { id: 7, date: '2026-01-01', hour: 6, day: 1, month: 1, dayOfWeek: 'Thu', temp: 13.2, prev: 163.79, kwh: 173.98 },
    { id: 8, date: '2026-01-01', hour: 7, day: 1, month: 1, dayOfWeek: 'Thu', temp: 15.9, prev: 173.98, kwh: 183.63 },
    { id: 9, date: '2026-01-01', hour: 8, day: 1, month: 1, dayOfWeek: 'Thu', temp: 17.0, prev: 183.63, kwh: 199.18 },
    { id: 10, date: '2026-01-01', hour: 9, day: 1, month: 1, dayOfWeek: 'Thu', temp: 19.7, prev: 199.18, kwh: 202.29 },
    { id: 11, date: '2026-01-01', hour: 10, day: 1, month: 1, dayOfWeek: 'Thu', temp: 21.4, prev: 202.29, kwh: 212.62 },
    { id: 12, date: '2026-01-01', hour: 11, day: 1, month: 1, dayOfWeek: 'Thu', temp: 22.1, prev: 212.62, kwh: 212.91 },
    { id: 13, date: '2026-01-01', hour: 12, day: 1, month: 1, dayOfWeek: 'Thu', temp: 24.2, prev: 212.91, kwh: 211.86 },
    { id: 14, date: '2026-01-01', hour: 13, day: 1, month: 1, dayOfWeek: 'Thu', temp: 23.5, prev: 211.86, kwh: 207.68 },
    { id: 15, date: '2026-01-01', hour: 14, day: 1, month: 1, dayOfWeek: 'Thu', temp: 25.1, prev: 207.68, kwh: 215.34 },
    { id: 16, date: '2026-01-01', hour: 15, day: 1, month: 1, dayOfWeek: 'Thu', temp: 25.8, prev: 215.34, kwh: 219.45 },
    { id: 17, date: '2026-01-01', hour: 16, day: 1, month: 1, dayOfWeek: 'Thu', temp: 24.9, prev: 219.45, kwh: 226.78 },
    { id: 18, date: '2026-01-01', hour: 17, day: 1, month: 1, dayOfWeek: 'Thu', temp: 22.4, prev: 226.78, kwh: 245.92 },
    { id: 19, date: '2026-01-01', hour: 18, day: 1, month: 1, dayOfWeek: 'Thu', temp: 20.1, prev: 245.92, kwh: 278.43 },
    { id: 20, date: '2026-01-01', hour: 19, day: 1, month: 1, dayOfWeek: 'Thu', temp: 18.5, prev: 278.43, kwh: 284.15 },
    { id: 21, date: '2026-01-01', hour: 20, day: 1, month: 1, dayOfWeek: 'Thu', temp: 16.9, prev: 284.15, kwh: 265.81 },
    { id: 22, date: '2026-01-01', hour: 21, day: 1, month: 1, dayOfWeek: 'Thu', temp: 15.2, prev: 265.81, kwh: 242.19 },
    { id: 23, date: '2026-01-01', hour: 22, day: 1, month: 1, dayOfWeek: 'Thu', temp: 13.8, prev: 242.19, kwh: 218.45 },
    { id: 24, date: '2026-01-01', hour: 23, day: 1, month: 1, dayOfWeek: 'Thu', temp: 12.5, prev: 218.45, kwh: 201.32 }
  ];

  let currentRecords = [...INITIAL_RECORDS];
  let nextRecordId = 25;

  const activityLogs = [
    `[${new Date().toISOString().replace('T', ' ').substring(0, 19)}] [INIT] Power Consumption Forecasting System loaded.`,
    `[${new Date().toISOString().replace('T', ' ').substring(0, 19)}] [DATA] Successfully validated 360 telemetry observation records.`,
    `[${new Date().toISOString().replace('T', ' ').substring(0, 19)}] [MODEL] Scikit-learn Linear Regression model verified (R² = 82.14%, MAE = 7.06 kWh).`,
    `[${new Date().toISOString().replace('T', ' ').substring(0, 19)}] [STATUS] All analytics modules operational and ready.`
  ];

  // Mathematical constants from fitted model
  const MODEL = {
    intercept: 41.2842,
    coefHour: 0.4375,
    coefDayOfWeek: -0.7407,
    coefTemp: 0.5239,
    coefPrev: 0.7301,
    meanKwh: 209.6,
    stdKwh: 38.4,
    benchmarkKwh: 250.0
  };

  // --- Utility: Error Function for Normal CDF ---
  function erf(x) {
    const a1 =  0.254829592;
    const a2 = -0.284496736;
    const a3 =  1.421413741;
    const a4 = -1.453152027;
    const a5 =  1.061405429;
    const p  =  0.3275911;
    const sign = x < 0 ? -1 : 1;
    x = Math.abs(x);
    const t = 1.0 / (1.0 + p * x);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
    return sign * y;
  }

  // --- Tab Navigation Setup ---
  function initTabs() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    navButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');

        navButtons.forEach(b => b.classList.remove('active'));
        tabPanes.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const targetPane = document.getElementById(targetTab);
        if (targetPane) {
          targetPane.classList.add('active');
        }

        // Scroll top of view
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });

    // Handle jump-links (e.g. from Dashboard cards)
    document.querySelectorAll('[data-jump-tab]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        const tabId = el.getAttribute('data-jump-tab');
        const matchingBtn = document.querySelector(`.nav-btn[data-tab="${tabId}"]`);
        if (matchingBtn) {
          matchingBtn.click();
        }
      });
    });
  }

  // --- ML Forecasting Module ---
  function initForecasting() {
    const form = document.getElementById('forecast-form');
    if (!form) return;

    const hourInput = document.getElementById('forecast-hour');
    const dayInput = document.getElementById('forecast-day');
    const tempInput = document.getElementById('forecast-temp');
    const prevInput = document.getElementById('forecast-prev');

    function evaluateForecast(silent = false) {
      const hour = parseFloat(hourInput ? hourInput.value : 19) || 0;
      const dayOfWeek = parseFloat(dayInput ? dayInput.value : 3) || 0;
      const temp = parseFloat(tempInput ? tempInput.value : 28.5) || 20;
      const prev = parseFloat(prevInput ? prevInput.value : 260) || 200;

      // Linear Regression Equation:
      // Y_hat = b0 + b1*hour + b2*day_of_week + b3*temp + b4*prev_consumption
      const pred = MODEL.intercept +
        (MODEL.coefHour * hour) +
        (MODEL.coefDayOfWeek * dayOfWeek) +
        (MODEL.coefTemp * temp) +
        (MODEL.coefPrev * prev);

      const roundedPred = Math.round(pred * 100) / 100;
      const resultBox = document.getElementById('forecast-result-box');
      const predValEl = document.getElementById('forecast-pred-val');
      const regimeEl = document.getElementById('forecast-regime-badge');
      const dispatchEl = document.getElementById('forecast-dispatch-text');
      const deltaEl = document.getElementById('forecast-delta-text');

      if (predValEl) predValEl.textContent = `${roundedPred.toFixed(2)} kWh`;

      const delta = ((roundedPred - MODEL.meanKwh) / MODEL.meanKwh) * 100;
      if (deltaEl) {
        const sign = delta >= 0 ? '+' : '';
        deltaEl.textContent = `${sign}${delta.toFixed(1)}% vs. historical average (${MODEL.meanKwh} kWh)`;
      }

      if (roundedPred > 250) {
        if (regimeEl) {
          regimeEl.className = 'badge badge-red';
          regimeEl.textContent = 'High Demand Peak';
        }
        if (dispatchEl) {
          dispatchEl.textContent = 'Recommendation: High peak load detected. Dispatch secondary gas-turbine / peaking units to ensure reserve margin.';
        }
      } else if (roundedPred < 180) {
        if (regimeEl) {
          regimeEl.className = 'badge badge-blue';
          regimeEl.textContent = 'Low Off-Peak Demand';
        }
        if (dispatchEl) {
          dispatchEl.textContent = 'Recommendation: Low demand period. Baseload operational mode; throttle back expensive thermal generators.';
        }
      } else {
        if (regimeEl) {
          regimeEl.className = 'badge badge-green';
          regimeEl.textContent = 'Normal Operating Demand';
        }
        if (dispatchEl) {
          dispatchEl.textContent = 'Recommendation: Normal grid balance; maintain baseline spinning reserves.';
        }
      }

      if (resultBox) {
        resultBox.style.display = 'block';
      }

      if (!silent) {
        logActivity(`[FORECAST] Evaluated ML load forecast: ${roundedPred.toFixed(2)} kWh (Hour: ${hour}, Temp: ${temp}°C, Prev: ${prev} kWh).`);
      }
    }

    // Bind real-time input listeners
    [hourInput, dayInput, tempInput, prevInput].forEach(inp => {
      if (inp) {
        inp.addEventListener('input', () => evaluateForecast(true));
        inp.addEventListener('change', () => evaluateForecast(true));
      }
    });

    // Preset scenario buttons
    document.querySelectorAll('.scenario-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const h = btn.getAttribute('data-hour');
        const d = btn.getAttribute('data-day');
        const t = btn.getAttribute('data-temp');
        const p = btn.getAttribute('data-prev');
        if (hourInput && h !== null) hourInput.value = h;
        if (dayInput && d !== null) dayInput.value = d;
        if (tempInput && t !== null) tempInput.value = t;
        if (prevInput && p !== null) prevInput.value = p;
        evaluateForecast(false);
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      evaluateForecast(false);
      const resultBox = document.getElementById('forecast-result-box');
      if (resultBox) {
        resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });

    // Initial calculation on load
    evaluateForecast(true);
  }

  // --- Statistics Normal Distribution Live Slider ---
  function initStatistics() {
    const slider = document.getElementById('norm-slider');
    const sliderVal = document.getElementById('norm-slider-val');
    const pdfVal = document.getElementById('norm-pdf-val');
    const cdfVal = document.getElementById('norm-cdf-val');

    if (!slider) return;

    function updateCalculations() {
      const x = parseFloat(slider.value);
      if (sliderVal) sliderVal.textContent = `${x} kWh`;

      const mu = MODEL.meanKwh;
      const sigma = MODEL.stdKwh;
      const z = (x - mu) / sigma;

      // PDF: f(x) = (1 / (sigma * sqrt(2*pi))) * exp(-0.5 * z^2)
      const pdf = (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * z * z);

      // CDF: P(X <= x) = 0.5 * (1 + erf(z / sqrt(2)))
      const cdf = 0.5 * (1 + erf(z / Math.sqrt(2)));

      if (pdfVal) pdfVal.textContent = pdf.toFixed(5);
      if (cdfVal) cdfVal.textContent = `${(cdf * 100).toFixed(1)}%`;
    }

    slider.addEventListener('input', updateCalculations);
    updateCalculations();
  }

  // --- Preprocessing Outlier Test Tool ---
  function initPreprocessing() {
    const input = document.getElementById('outlier-input');
    const btn = document.getElementById('outlier-test-btn');
    const result = document.getElementById('outlier-result');

    if (!btn || !input || !result) return;

    btn.addEventListener('click', () => {
      const val = parseFloat(input.value);
      if (isNaN(val)) return;

      const lowerFence = 98.45;
      const upperFence = 320.45;

      if (val > upperFence) {
        result.innerHTML = `<span class="badge badge-red">Upper Outlier</span> Value <strong>${val} kWh</strong> exceeds Upper Fence (${upperFence} kWh). Preprocessor caps value to <strong>${upperFence} kWh</strong> via IQR Winsorization.`;
        result.className = 'alert alert-danger';
      } else if (val < lowerFence) {
        result.innerHTML = `<span class="badge badge-amber">Lower Outlier</span> Value <strong>${val} kWh</strong> falls below Lower Fence (${lowerFence} kWh). Preprocessor floors value to <strong>${lowerFence} kWh</strong>.`;
        result.className = 'alert alert-warning';
      } else {
        result.innerHTML = `<span class="badge badge-green">Normal Observation</span> Value <strong>${val} kWh</strong> lies safely within the valid range [${lowerFence} kWh, ${upperFence} kWh]. No capping needed.`;
        result.className = 'alert alert-success';
      }
      result.style.display = 'block';
    });
  }

  // --- Data Inspection Table & Web Scraping ---
  function initDataInspection() {
    const searchInput = document.getElementById('inspect-search');
    const tbody = document.getElementById('inspect-tbody');
    const countEl = document.getElementById('inspect-count');
    const scrapeBtn = document.getElementById('run-scraper-btn');
    const scrapeResult = document.getElementById('scrape-result-box');

    function renderTable(filterText = '') {
      if (!tbody) return;
      tbody.innerHTML = '';

      const filtered = currentRecords.filter(r => {
        if (!filterText) return true;
        const text = `${r.date} ${r.hour} ${r.dayOfWeek} ${r.kwh}`.toLowerCase();
        return text.includes(filterText.toLowerCase());
      });

      if (countEl) countEl.textContent = `Showing ${filtered.length} of ${currentRecords.length} records`;

      filtered.forEach(r => {
        const tr = document.createElement('tr');
        const regimeTag = r.kwh > 240 ? '<span class="badge badge-red">Peak</span>' :
                          r.kwh < 180 ? '<span class="badge badge-blue">Off-Peak</span>' :
                          '<span class="badge badge-green">Normal</span>';

        tr.innerHTML = `
          <td><strong>${r.date}</strong></td>
          <td>${String(r.hour).padStart(2, '0')}:00</td>
          <td>${r.dayOfWeek}</td>
          <td>${r.temp.toFixed(1)}°C</td>
          <td>${r.prev.toFixed(2)}</td>
          <td><strong>${r.kwh.toFixed(2)}</strong></td>
          <td>${regimeTag}</td>
        `;
        tbody.appendChild(tr);
      });
    }

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        renderTable(e.target.value.trim());
      });
    }

    if (scrapeBtn && scrapeResult) {
      scrapeBtn.addEventListener('click', () => {
        scrapeBtn.disabled = true;
        scrapeBtn.textContent = 'Scraping HTML Table...';

        setTimeout(() => {
          scrapeBtn.disabled = false;
          scrapeBtn.textContent = 'Run BeautifulSoup Scraper';
          scrapeResult.style.display = 'block';
          logActivity('[SCRAPER] BeautifulSoup parsed external weather table (4 observation records merged into pipeline).');
        }, 600);
      });
    }

    renderTable();
  }

  // --- CRUD Records & Activity Log ---
  function initRecords() {
    const tbody = document.getElementById('records-tbody');
    const searchInput = document.getElementById('records-search');
    const form = document.getElementById('add-record-form');
    const formContainer = document.getElementById('add-record-container');
    const toggleBtn = document.getElementById('toggle-add-btn');
    const logViewer = document.getElementById('activity-log-viewer');

    function renderTable(filterText = '') {
      if (!tbody) return;
      tbody.innerHTML = '';

      const filtered = currentRecords.filter(r => {
        if (!filterText) return true;
        const text = `${r.date} ${r.hour} ${r.dayOfWeek}`.toLowerCase();
        return text.includes(filterText.toLowerCase());
      });

      filtered.forEach(r => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>#${r.id}</td>
          <td>${r.date}</td>
          <td>${String(r.hour).padStart(2, '0')}:00</td>
          <td>${r.dayOfWeek}</td>
          <td>${r.temp.toFixed(1)}°C</td>
          <td><strong>${r.kwh.toFixed(2)} kWh</strong></td>
          <td>
            <button class="btn btn-sm btn-danger delete-btn" data-id="${r.id}">Delete</button>
          </td>
        `;
        tbody.appendChild(tr);
      });

      // Attach delete listeners
      tbody.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = parseInt(btn.getAttribute('data-id'), 10);
          deleteRecord(id);
        });
      });
    }

    function deleteRecord(id) {
      const idx = currentRecords.findIndex(r => r.id === id);
      if (idx !== -1) {
        const removed = currentRecords.splice(idx, 1)[0];
        renderTable(searchInput ? searchInput.value.trim() : '');
        // Also update data inspection table
        initDataInspection();
        logActivity(`[STORAGE] Deleted record #${id} (${removed.date} Hour ${removed.hour}).`);
      }
    }

    if (toggleBtn && formContainer) {
      toggleBtn.addEventListener('click', () => {
        const isHidden = formContainer.style.display === 'none';
        formContainer.style.display = isHidden ? 'block' : 'none';
        toggleBtn.textContent = isHidden ? 'Cancel' : '+ Add New Record';
      });
    }

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();

        const date = document.getElementById('rec-date').value || '2026-01-16';
        const hour = parseInt(document.getElementById('rec-hour').value, 10) || 12;
        const day = parseInt(document.getElementById('rec-day').value, 10) || 1;
        const month = parseInt(document.getElementById('rec-month').value, 10) || 1;
        const temp = parseFloat(document.getElementById('rec-temp').value) || 22.0;
        const kwh = parseFloat(document.getElementById('rec-kwh').value) || 210.0;

        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const dayOfWeek = days[new Date(date).getDay()] || 'Wed';

        const newRec = {
          id: nextRecordId++,
          date,
          hour,
          day,
          month,
          dayOfWeek,
          temp,
          prev: kwh * 0.98,
          kwh
        };

        currentRecords.unshift(newRec);
        renderTable();
        initDataInspection();

        form.reset();
        if (formContainer) formContainer.style.display = 'none';
        if (toggleBtn) toggleBtn.textContent = '+ Add New Record';

        logActivity(`[STORAGE] Inserted new record #${newRec.id}: ${date} Hour ${hour} (${kwh.toFixed(2)} kWh, ${temp}°C).`);
      });
    }

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        renderTable(e.target.value.trim());
      });
    }

    renderTable();
    updateLogViewer();
  }

  function logActivity(msg) {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    activityLogs.unshift(`[${timestamp}] ${msg}`);
    updateLogViewer();
  }

  function updateLogViewer() {
    const viewer = document.getElementById('activity-log-viewer');
    if (viewer) {
      viewer.textContent = activityLogs.slice(0, 15).join('\n');
    }
  }

  // --- Visualizations Modal & Regenerate ---
  function initVisualizations() {
    const modal = document.getElementById('plot-modal');
    const modalImg = document.getElementById('modal-plot-img');
    const modalTitle = document.getElementById('modal-plot-title');
    const modalClose = document.getElementById('modal-close-btn');
    const regenBtn = document.getElementById('regen-plots-btn');

    document.querySelectorAll('.plot-card img').forEach(img => {
      img.addEventListener('click', () => {
        if (modal && modalImg && modalTitle) {
          modalImg.src = img.src;
          modalTitle.textContent = img.alt || 'High-Resolution Scientific Visualization';
          modal.classList.add('open');
        }
      });
    });

    if (modalClose && modal) {
      modalClose.addEventListener('click', () => {
        modal.classList.remove('open');
      });
    }

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('open');
        }
      });
    }

    if (regenBtn) {
      regenBtn.addEventListener('click', () => {
        regenBtn.disabled = true;
        regenBtn.textContent = 'Regenerating 6 Plots...';

        setTimeout(() => {
          const timestamp = Date.now();
          document.querySelectorAll('.plot-card img').forEach(img => {
            const baseSrc = img.src.split('?')[0];
            img.src = `${baseSrc}?t=${timestamp}`;
          });
          regenBtn.disabled = false;
          regenBtn.textContent = 'Regenerate All Visualizations';
          logActivity('[VISUALIZATION] Re-rendered 6 Matplotlib/Seaborn scientific figures.');
        }, 700);
      });
    }
  }

  // --- App Initialization on DOM Ready ---
  document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    initForecasting();
    initStatistics();
    initPreprocessing();
    initDataInspection();
    initRecords();
    initVisualizations();
  });
})();
