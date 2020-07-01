var qs = new URLSearchParams(window.location.search);
var USERNAME = qs.get('para1');
console.log(USERNAME);

var userData = {};
const stocks = new Stocks('X4DF3J2NHVQRYN0N');
// const index = 0;

async function fetchUserData(username) {
  const data = {
    username: username,
  }
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
  };

  const response = await fetch('/api', options)
  const responseJSON = await response.json()
  return responseJSON

}
async function getStonks(symbol, interval, amount) {
   const stock = await stocks.timeSeries({
    symbol: symbol,
    interval: interval,
    amount: amount,
  })
  return stock;
}
function add2DropDown(stockSymbol) {
  const select = document.getElementById("allStocksSelect");
  var o = document.createElement("OPTION");
  o.text = stockSymbol;
  select.appendChild(o);
}
function createDropDown() {
  const form = document.getElementById("allStocks");
  const select = document.getElementById("allStocksSelect");
  form.appendChild(select);
  for (var j = 0; j < userData.stocks.length; j += 1) {
    var o = document.createElement("OPTION");
    o.text = userData.stocks[j].symbol;
    o.value = j;
    select.appendChild(o);
  }
}

async function authenticatePurchase(stock, shares) {
  if (isNaN(shares)) {
    alert('must select number of shares');
    return;
  }
  else if (await searchStock(stock)) {
    const newStock = {
      name: "",
      symbol: stock,
      shares: shares,
      purchasePrice: userData.stocks[userData.stocks.length - 1].dataPoints[0].open,
    };
    const body = {
      username: userData.username,
      newStock: newStock,
    }
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }
    const response = await fetch('/purchaseStock', options);
    const responseJSON = await response.json()
    alert('purchase completed');
  }
}

async function searchStock(stock) {
  try {
      const data = await stocks.timeSeries({
      symbol: stock,
      interval: 'daily',
      amount: 150,
    })
    const newStock = {
      name: "",
      symbol: stock,
      dataPoints: data,
    }
    select.value = "";
    userData.stocks.push(newStock);
    userData.index = userData.stocks.length - 1;
    add2DropDown(stock);
    await setRetreiving();
    await drawgraph();
    await setNumbers();
    console.log(data);
    return true;
  } catch (e) {
    alert(`There is no stock with symbol ${stock}`)
    console.log('stock name invalid');
    return false;
  }

}
async function setup() {
  userData = await fetchUserData(USERNAME);
  // console.log("user data fetched");
  for (var i = 0; i < userData.stocks.length; i += 1) {
    userData.stocks[i].dataPoints = null;
  }
  if (userData.stocks.length > 0) {
    s = userData.stocks[0].symbol;
    userData.stocks[0].dataPoints = await getStonks(s, "daily", 150);
  }
    await drawgraph();
    setNumbers();
    createDropDown();

}
async function getData() {
  // console.log(userData);
  if (userData.stocks.length == 0 || userData.index < 0) {
    return [];
  } else if (userData.stocks[userData.index].dataPoints === null) {
    const arr = await getStonks(userData.stocks[userData.index].symbol, 'daily', 150);
    userData.stocks[userData.index].dataPoints = await arr;
    return await getData();
  } else {
      return userData.stocks[userData.index].dataPoints;
    }
}
setup();
async function test() {
  const data = {
    stock: "GOOG",
  }
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }
  const response = await fetch('/purchaseStock', options);
  const responseJSON = await response.json()
  console.log(responseJSON);
}
// test()