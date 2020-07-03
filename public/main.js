var qs = new URLSearchParams(window.location.search);
var USERNAME = qs.get('para1');
console.log(USERNAME);

var userData = {};
const stocks = new Stocks('X4DF3J2NHVQRYN0N');

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
    userData.stocks[userData.index].shares = parseInt(shares, 10);

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
    for (var i = 0; i < userData.stocks.length; i += 1) {
      if (userData.stocks[i].symbol === stock) {
        userData.index = i;
        await setRetreiving();
        await drawgraph();
        await setNumbers();
        return false;
      }
    }
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
    userData.stocks[userData.index].purchasePrice = data[0].open;
    add2DropDown(stock);
    await setRetreiving();
    await drawgraph();
    await setNumbers();
    return true;
  } catch (e) {
    alert(`There is no stock with symbol ${stock}`)
    return false;
  }

}
async function setup() {
  userData = await fetchUserData(USERNAME);
  for (var i = 0; i < userData.stocks.length; i += 1) {
    userData.stocks[i].dataPoints = null;
  }
  if (userData.stocks.length > 0) {
    s = userData.stocks[0].symbol;
    userData.stocks[0].dataPoints = await getStonks(s, "daily", 150);
  }

    alert("Thanks for visiting my Stock Market Simulator. If this is your first time on the site, here are a few instructions.:\n\n - In this simulator you can view, purchase, and add stocks to your portfolio. Start by typing the symbol of a stock you would like to view in the 'Stock Search' section, then click Search if you would like to view this stock's history, or purchase it. \n - The website will draw a graph of the stock in question. \n - Scroll over the graph to view attributes of the stock on a given day. You can also cycle through stocks you've viewed or purchased in the drop down menu to the left. This menu will expand as you view/purchase more stocks. \n - Finally, since this website is backed by a database, you can login later or on a different device and your stocks will still be there. \n  - Aditya R.");
    await drawgraph();
    setNumbers();
    createDropDown();

}
async function getData() {
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
