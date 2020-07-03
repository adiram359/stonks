const searchBar = document.getElementById('stockSearchBar');
const unitBar = document.getElementById('unitsBar');
searchBar.onclick = () => {
  searchBar.value = "";
  searchBar.style.color = "black";
}
unitBar.onclick = () => {
  unitBar.value = "";
  unitBar.style.color = "black";
}
const searchButton = document.getElementById('searchButton');
const purchaseButton = document.getElementById('purchaseButton');
searchButton.onclick = async () => {
  await searchStock(searchBar.value.trim());
}
purchaseButton.onclick = async () => {
  await authenticatePurchase(searchBar.value.trim(), unitBar.value.trim());
};

const canvas = document.querySelector("canvas");
const select = document.getElementById("allStocksSelect");
const c = canvas.getContext("2d");
const LINE_COLOR = "white";
const BACKGROUND_COLOR = "black";
const CROSSHAIR_COLOR = "#3498DB";
const HEIGHT = canvas.height;
const WIDTH = canvas.width;
const R = "Retreiving Data ...";
var dateIndex = 0;
var rendering = true;
canvas.onmousemove = (event) => {
  if (!rendering) {
    drawCrossHairs(event);
    setNumbers();
  }
}
select.onchange = async () => {
  dateIndex = 0;
  userData.index = select.value;
  await setRetreiving();
  await drawgraph();
  await setNumbers();
}
async function setNumbers() {
  const dataPoints = await getData();
  if (dataPoints.length === 0) {
    return;
  }
  const data = dataPoints[dateIndex];
  const stock = userData.stocks[userData.index];
  const profit = dataPoints[0].open === stock.purchasePrice ? 0 :stock.shares * (dataPoints[0].open - stock.purchasePrice)
  setProfit(`profit on ${stock.symbol}:  $ ${Math.floor(profit * 100 / 100)}`);
  setStockName();
  setStockOpen(`open: $${dataPoints[dateIndex].open}`);
  setStockHigh(`high: $${dataPoints[dateIndex].high}`);
  setStockDate(`${dataPoints[dateIndex].date}`);
  setStockLow(`low: $${dataPoints[dateIndex].low}`);
  setStockClose(`close: $${dataPoints[dateIndex].close}`);
}
function setProfit(value) {
  const profitDiv = document.getElementById('totalProfit')
  profitDiv.innerHTML = value;
  profitDiv.style.color = value >= 0 ? "#E74C3C": "#2ECC71";
  profitDiv.style.color = value === R ? "white" : profitDiv.style.color;
}
function setRetreiving() {
  setStockName(R);
  setStockHigh(R);
  setStockLow(R);
  setStockClose(R);
  setStockOpen(R);
  setStockDate(R);
  setProfit(R);
}
function setBackground() {
  c.clearRect(0, 0, WIDTH, HEIGHT);
  c.fillStyle = BACKGROUND_COLOR;
  c.fillRect(0, 0, WIDTH, HEIGHT);
}
async function drawgraph(delay=10) {
  rendering = true;
  setBackground();
  const dataPoints = await getData();
  if (dataPoints === undefined || dataPoints.length < 1) {
    return;
  }
  var max = 0;
  for (var i = 0; i < dataPoints.length; i += 1) {
    max = Math.max(max, dataPoints[i].open);
  }

  const delta = WIDTH/dataPoints.length;
  const pixPerDollar = HEIGHT/(max/0.8);
  var x = 0;
  for (var k = dataPoints.length - 1; k > 0; k -= 1) {
    c.beginPath();
    y = HEIGHT - dataPoints[k].open * pixPerDollar;
    c.moveTo(x, y);
    x += delta ;
    y = HEIGHT - dataPoints[k - 1].open * pixPerDollar;
    c.lineTo(x, y)
    c.strokeStyle = LINE_COLOR;
    c.lineWidth = 2;
    c.stroke();

    if (delay) {
      await sleep(delay);
    }
  }
  rendering = false;
}
async function drawCrossHairs(event) {
  const dataPoints = await getData();
  if (dataPoints === [] || dataPoints === -1) {
    return;
  }
  await drawgraph(0);
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const l = dataPoints.length;
  var max = 0;
  for (var i = 0; i < l; i += 1) {
    max = Math.max(max, dataPoints[i].open);
  }
  const delta = WIDTH / l;
  const pixPerDollar = HEIGHT / (max / 0.8);
  dateIndex = dataPoints.length - 1 - Math.floor(x / WIDTH * l);
  y = canvas.height - dataPoints[dateIndex].open * pixPerDollar;
  c.beginPath();
  c.arc(x, y, 5, 0, 2 * Math.PI, false);
  c.fillStyle = CROSSHAIR_COLOR;
  c.fill();
  c.strokeStyle = CROSSHAIR_COLOR;
  c.stroke();
  drawLine(x, 0, x, HEIGHT, CROSSHAIR_COLOR)
  drawLine(0, y, WIDTH, y, CROSSHAIR_COLOR)
}
function drawLine(x0, y0, x1, y1, lineColor) {
  c.beginPath()
  c.moveTo(x0, y0)
  c.lineTo(x1, y1)
  c.strokeStyle = lineColor
  c.stroke()
}
function setStockName () {
  const name = userData.stocks[userData.index].name ? userData.stocks[userData.index].name: "";
  const symbol = userData.stocks[userData.index].symbol;
  document.getElementById("stockName").innerHTML = `${name} (${symbol})`;
}
function setStockHigh (value) {
  document.getElementById("high").innerHTML = value;
}
function setStockOpen (value) {
  document.getElementById("open").innerHTML = value;
}
function setStockDate(value) {
  document.getElementById("date").innerHTML = value;
}
function setStockLow (value) {
  document.getElementById("low").innerHTML = value;
}
function setStockClose (value) {
  document.getElementById("close").innerHTML = value;
}
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
