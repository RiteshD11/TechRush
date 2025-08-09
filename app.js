
const API_KEY = 'Q2Z8XEHMLLMI3WA1'; 

// List of stocks to show in menu (you can expand this!)
const STOCKS = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN', 'NFLX', 'META'];

let isDarkMode = false;
let currentChart = null;
let currentTicker = null;

// DOM references
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

// ========== LIVE DATA FETCHING FUNCTIONS ===========

async function fetchStockQuote(ticker) {
  const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  const quote = data["Global Quote"];
  if (!quote || !quote["05. price"]) throw new Error("No data for " + ticker);
  return {
    name: ticker,
    price: parseFloat(quote["05. price"]),
    change: parseFloat(quote["09. change"]),
    volume: parseInt(quote["06. volume"]),
  };
}

async function fetchStockChartData(ticker) {
  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${ticker}&apikey=${API_KEY}&outputsize=compact`;
  const response = await fetch(url);
  const data = await response.json();
  const series = data["Time Series (Daily)"];
  if (!series) throw new Error("No chart data for " + ticker);
  // Get the most recent 5 days
  const chartData = Object.entries(series)
    .slice(0, 5)
    .map(([date, day]) => ({
      date,
      price: parseFloat(day["4. close"])
    }))
    .reverse(); // Make most-recent last for chart
  return chartData;
}

// ====== RENDER & INTERACTION LOGIC =========

async function displayStock(ticker) {
  try {
    errorDisplay.classList.add('hidden');
    stockInfo.classList.add('hidden');
    stockName.textContent = "Loading...";
    // Fetch current price/details
    const info = await fetchStockQuote(ticker);
    stockName.textContent = info.name;
    stockPrice.textContent = `Price: $${info.price.toFixed(2)}`;
    stockChange.textContent = `Change: ${(info.change >= 0 ? '+' : '')}${info.change.toFixed(2)}`;
    stockChange.className = `text-lg ${info.change >= 0 ? 'text-green-400' : 'text-red-400'}`;
    stockVolume.textContent = `Volume: ${isNaN(info.volume) ? 'N/A' : info.volume.toLocaleString()}`;
    stockInfo.classList.remove('hidden');
    // Fetch and render chart
    const chartData = await fetchStockChartData(ticker);
    renderChartWithData(chartData);
    // Update menu highlight
    [...stockList.children].forEach(li =>
      li.classList.toggle('active', li.dataset.ticker === ticker)
    );
    currentTicker = ticker;
  } catch (err) {
    showError("Could not fetch live data. API limit reached or symbol unsupported.");
  }
}

function renderChartWithData(chartData) {
  const ctx = stockChartCanvas.getContext('2d');
  if (currentChart) currentChart.destroy();
  currentChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: chartData.map(d => d.date),
      datasets: [{
        label: 'Price',
        data: chartData.map(d => d.price),
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
        legend: { labels: { color: isDarkMode ? '#F9FAFB' : '#111827', font: { size: 14 } } }
      },
      scales: {
        x: { grid: { display: false }, ticks: { color: isDarkMode ? '#F9FAFB' : '#111827', font: { size: 12 } } },
        y: { beginAtZero: false, grid: { color: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }, ticks: { color: isDarkMode ? '#F9FAFB' : '#111827', font: { size: 12 } } }
      }
    }
  });
}

// ===== MENU & SEARCH ============

function showError(message) {
  errorDisplay.textContent = message;
  errorDisplay.classList.remove('hidden');
  stockInfo.classList.add('hidden');
}

function handleSearch() {
  const ticker = tickerInput.value.trim().toUpperCase();
  if (!ticker) { showError('Enter a stock ticker.'); return; }
  displayStock(ticker);
}

// Populate sidebar menu
function renderStockMenu() {
  stockList.innerHTML = "";
  STOCKS.forEach(ticker => {
    const li = document.createElement('li');
    li.textContent = ticker;
    li.dataset.ticker = ticker;
    li.onclick = () => displayStock(ticker);
    stockList.appendChild(li);
  });
}

searchButton.addEventListener('click', handleSearch);
tickerInput.addEventListener('keydown', e => { if (e.key === 'Enter') handleSearch(); });

themeToggle.addEventListener('click', () => {
  isDarkMode = !isDarkMode;
  document.body.className = `font-poppins ${isDarkMode ? 'dark-mode' : 'light-mode'}`;
  themeToggle.textContent = isDarkMode ? '☀️' : '🌙';
  if (currentTicker) displayStock(currentTicker);
});

window.addEventListener('DOMContentLoaded', async () => {
  renderStockMenu();
  if (STOCKS.length) await displayStock(STOCKS[0]);
});
