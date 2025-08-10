const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Toggle dark mode
themeToggle.addEventListener('click', () => {
  body.classList.toggle('dark');
  themeToggle.textContent = body.classList.contains('dark') ? '☀️' : '🌙';
});

// Sample stock data (replace with real API later)
const fakeStockData = {
  AAPL: {
    name: "Apple Inc.",
    price: "$193.35",
    change: "+1.25%",
    volume: "72M",
    trend: [192, 193, 194, 193.5, 193.35]
  },
  TSLA: {
    name: "Tesla Inc.",
    price: "$825.32",
    change: "-0.75%",
    volume: "52M",
    trend: [830, 828, 826, 823, 825.32]
  }
};

document.getElementById('search-button').addEventListener('click', () => {
  const ticker = document.getElementById('ticker-input').value.toUpperCase();
  const infoBox = document.getElementById('stock-info');
  const loader = document.getElementById('loader');

  if (!ticker) return alert("Please enter a ticker symbol");

  loader.classList.remove('hidden');
  infoBox.classList.add('hidden');

  setTimeout(() => {
    loader.classList.add('hidden');
    const data = fakeStockData[ticker];

    if (data) {
      document.getElementById('stock-name').textContent = data.name;
      document.getElementById('stock-price').textContent = `Price: ${data.price}`;
      document.getElementById('stock-change').textContent = `Change: ${data.change}`;
      document.getElementById('stock-volume').textContent = `Volume: ${data.volume}`;
      infoBox.classList.remove('hidden');

      drawChart(data.trend, ticker);
    } else {
      alert("Stock not found. Try AAPL or TSLA.");
    }
  }, 1000);
});

function drawChart(prices, label) {
  const ctx = document.getElementById('stockChart').getContext('2d');
  if (window.myChart) window.myChart.destroy();

  window.myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      datasets: [{
        label: `${label} Price`,
        data: prices,
        borderColor: 'rgb(59, 130, 246)',
        fill: false,
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: false
        }
      }
    }
  });
}
