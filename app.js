const mockStockData = {
  'AAPL': { name: 'Apple Inc.', price: 175.25, change: 2.15, volume: 64532000 },
  'GOOGL': { name: 'Alphabet Inc.', price: 2800.50, change: -15.30, volume: 1823000 },
  'MSFT': { name: 'Microsoft Corp.', price: 305.10, change: 5.20, volume: 23145000 }
};

// Each ticker gets unique mock chart data
const mockChartDataStore = {
  'AAPL': [
    { date: '2025-07-29', price: 170 },
    { date: '2025-07-30', price: 172 },
    { date: '2025-07-31', price: 174 },
    { date: '2025-08-01', price: 173 },
    { date: '2025-08-02', price: 175 }
  ],
  'GOOGL': [
    { date: '2025-07-29', price: 2820 },
    { date: '2025-07-30', price: 2810 },
    { date: '2025-07-31', price: 2805 },
    { date: '2025-08-01', price: 2799 },
    { date: '2025-08-02', price: 2800.5 }
  ],
  'MSFT': [
    { date: '2025-07-29', price: 299 },
    { date: '2025-07-30', price: 300.5 },
    { date: '2025-07-31', price: 304 },
    { date: '2025-08-01', price: 302 },
    { date: '2025-08-02', price: 305.1 }
  ]
};

let isDarkMode = false;
let currentChart = null;
let currentTicker = null;

const tickerInput = document.getElementById('ticker-input');
const searchButton = document.getElementById('search-button');
const errorDisplay = document.getElementById('error');
const stockInfo = document.getElementById('stock-info');
const stockName = document.getElementById('stock-name');
const stockPrice = document.getElementById('stock-price');
const stockChange = document.getElementById('stock-change');
const stockVolume = document.getElementById('stock-volume');
const themeToggle = document.getElementById('theme-toggle');
const stockChartCanvas = document.getElementById('stockChart');
const stockList = document.getElementById('stock-list');

function renderChart(ticker) {
  const ctx = stockChartCanvas.getContext('2d');
  if (currentChart) currentChart.destroy();

  const chartData = mockChartDataStore[ticker] || [];
  currentChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: chartData.map(data => data.date),
      datasets: [{
        label: 'Price',
        data: chartData.map(data => data.price),
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: {
            color: isDarkMode ? '#F9FAFB' : '#111827',
            font: { size: 14 }
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: isDarkMode ? '#F9FAFB' : '#111827', font: { size: 12 } }
        },
        y: {
          beginAtZero: false,
          grid: {
            color: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
          },
          ticks: { color: isDarkMode ? '#F9FAFB' : '#111827', font: { size: 12 } }
        }
      }
    }
  });
}

function displayStock(ticker) {
  const data = mockStockData[ticker];
  if (!data) return;

  stockName.textContent = data.name;
  stockPrice.textContent = `Price: $${data.price.toFixed(2)}`;
  stockChange.textContent = `Change: ${data.change >= 0 ? "+" : ""}${data.change.toFixed(2)}`;
  stockChange.className = `text-lg ${data.change >= 0 ? 'text-green-400' : 'text-red-400'}`;
  stockVolume.textContent = `Volume: ${data.volume.toLocaleString()}`;
  stockInfo.classList.remove('hidden');

  renderChart(ticker);

  // Update menu highlight
  [...stockList.children].forEach(li =>
    li.classList.toggle('active', li.dataset.ticker === ticker)
  );
  currentTicker = ticker;
}

function showError(message) {
  errorDisplay.textContent = message;
  errorDisplay.classList.remove('hidden');
  stockInfo.classList.add('hidden');
}

function handleSearch() {
  const ticker = tickerInput.value.trim().toUpperCase();
  errorDisplay.classList.add('hidden');
  stockInfo.classList.add('hidden');
  if (!ticker) {
    showError('Enter a stock ticker.');
    return;
  }
  if (mockStockData[ticker]) {
    displayStock(ticker);
  } else {
    showError('Stock not found.');
  }
}

// Populate menu with all stocks
function renderStockMenu() {
  stockList.innerHTML = "";
  Object.entries(mockStockData).forEach(([ticker, info]) => {
    const li = document.createElement('li');
    li.textContent = `${ticker} - ${info.name}`;
    li.dataset.ticker = ticker;
    li.onclick = () => displayStock(ticker);
    stockList.appendChild(li);
  });
}

// Menu supports keyboard and mouse
stockList.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    const li = document.activeElement;
    if (li && li.dataset.ticker) displayStock(li.dataset.ticker);
  }
});

searchButton.addEventListener('click', handleSearch);
tickerInput.addEventListener('keydown', e => { if (e.key === 'Enter') handleSearch(); });

themeToggle.addEventListener('click', () => {
  isDarkMode = !isDarkMode;
  document.body.className = `font-poppins ${isDarkMode ? 'dark-mode' : 'light-mode'}`;
  themeToggle.textContent = isDarkMode ? '☀️' : '🌙';
  if (currentTicker) renderChart(currentTicker);
});

window.addEventListener('DOMContentLoaded', () => {
  renderStockMenu();
  // Auto-show first stock on load
  const firstTicker = Object.keys(mockStockData)[0];
  if (firstTicker) displayStock(firstTicker);
});
