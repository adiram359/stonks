const express = require('express');
const app = express();
const Datastore = require('nedb')
app.listen(process.env.PORT || 3000)

app.use(express.static('public'))
app.use(express.json());

const database = new Datastore('database.db');
database.loadDatabase()

const userData = {
  username: "Alyssa P. Hacker",
  index: 0,
  stocks: [
    {
      name: "Tesla",
      symbol: "TSLA",
      shares: 53,
      purchasePrice: 0,
    },
    {
      name: "J.P Morgan",
      symbol: "JPM",
      shares: 53,
      purchasePrice: 0,
    },
    {
      name: "Apple",
      symbol: "AAPL",
      shares: 100,
      purchasePrice: 0,
    }
  ]
};
// database.insert(userData);
app.post('/validateUser', (request, response) => {
  database.find({username:request.body.username}, function (err, docs) {
    if (docs.length === 0) {
      response.json({isValid:false});
      response.end();
    } else {
      response.json({isValid:true});
      response.end();
    }
  }
)});
app.post('/createUser', (request, response) => {
  database.find({username:request.body.username}, function (err, docs) {
    if (docs.length > 0) {
      response.send({availible:false,});
      response.end()
    } else {
        database.insert({
          username:request.body.username,
          index:0,
          stocks: [],
        });
        response.json({availible: true,});
        response.end();
    }
  })
})
app.post('/purchaseStock', (request, response) => {
  database.find({username:request.body.username}, function (err, docs) {
    const user = docs[0];
    user.stocks.push(request.body.newStock);
    database.update({username: request.body.username}, user, {}, function (err, numReplaced) {

    })
    response.json({
      message: "Success, your stock was added",
    })
    response.end()
  })
})


app.post('/api', (request, response) => {
  console.log(request.body);
  database.find({username: request.body.username}, (err, docs) => {
    response.json(docs[0])
    response.end()
  })
  // response.json(userData)
})
