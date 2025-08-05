const mockStockData = {
  'AAPL': { name: 'Apple Inc.', price: 175.25, change: 2.15, volume: 64532000 },
  'GOOGL': { name: 'Alphabet Inc.', price: 2800.50, change: -15.30, volume: 1823000 },
  'MSFT': { name: 'Microsoft Corp.', price: 305.10, change: 5.20, volume: 23145000 }
};

const mockChartData = [
  { date: '2025-07-29', price: 170 },
  { date: '2025-07-30', price: 172 },
  { date: '2025-07-31', price: 174 },
  { date: '2025-08-01', price: 173 },
  { date: '2025-08-02', price: 175 }
];

let isDarkMode = false;

const tickerInput = document.getElementById('ticker-input');
const searchButton = document.getElementById('search-button');
const errorDisplay = document.getElementById('error');
const stockInfo = document.getElementById('stock-info');
const stockName = document.getElementById('stock-name');
const stockPrice = document.getElementById('stock-price');
const stockChange = document.getElementById('stock-change');
const stockVolume = document.getElementById('stock-volume');
const themeToggle = document.getElementById('theme-toggle');

const renderChart = () => {
  const ctx = document.getElementById('stockChart').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: mockChartData.map(data => data.date),
      datasets: [{
        label: 'Price',
        data: mockChartData.map(data => data.price),
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
        x: { 
          grid: { display: false }, 
          ticks: { color: isDarkMode ? '#F9FAFB' : '#111827', font: { size: 12 } }
        },
        y: {
          beginAtZero: false,
          grid: { color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' },
          ticks: { color: isDarkMode ? '#F9FAFB' : '#111827', font: { size: Twelve } }
        }
      }
    }
  });
};

searchButton.addEventListener('click', () => {
  const ticker = tickerInput.value.trim().toUpperCase();
  errorDisplay.classList.add('hidden');
  stockInfo.classList.add('hidden');

  if (!ticker) {
    errorDisplay.textContent = 'Enter a stock ticker.';
    errorDisplay.classList.remove('hidden');
    return;
  }

  if (mockStockData[ticker]) {
    const data = mockStockData[ticker];
    stockName.textContent = data.name;
    stockPrice.textContent = `Price: $${data.price.toFixed(2)}`;
    stockChange.textContent = `Change: ${data.change >= 0 ? '+' : ''}${data.change.toFixed(2)}`;
    stockChange.className = `text-lg text-${data.change >= 0 ? 'green' : 'red'}-400`;
    stockVolume.textContent = `Volume: ${data.volume.toLocaleString()}`;
    stockInfo.classList.remove('hidden');
    document.getElementById('stockChart').getContext('2d').clearRect(0, 0, stockChart.width, stockChart.height);
    renderChart();
  } else {
    errorDisplay.textContent = 'Stock not found.';
    errorDisplay.classList.remove('hidden');
  }
});

themeToggle.addEventListener('click', () => {
  isDarkMode = !isDarkMode;
  document.body.className = `font-poppins ${isDarkMode ? 'dark-mode' : 'light-mode'}`;
  themeToggle.textContent = isDarkMode ? '☀️' : '🌙';
});