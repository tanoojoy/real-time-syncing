const express = require('express');
const bp = require("body-parser");
let client = require('./sdk/client');
const { MongoClient } = require('mongodb');

const app = express();
app.use(require("morgan")("dev"));
app.use(bp.urlencoded({ extended: false }))
app.use(bp.json());

app.post("/webhook", (req, res) => {
    
    const get_mp_info = new Promise(function(resolve, reject){
      client.Marketplaces.getMarketplaceInfo(null, function(err, result){
        if(!err){
          resolve(result);
        }
      });
    });

    Promise.all([get_mp_info]).then(response => {
      res.send(response[0]);
    });
});

app.get("/webhook", (req, res) => {
  const get_mp_info = new Promise(function(resolve, reject){
    client.Marketplaces.getMarketplaceInfo(null, function(err, result){
      if(!err){
        resolve(result);
      }
    });
  });

  Promise.all([get_mp_info]).then(response => {
    res.send(response[0]);
  });
});

app.get("/", (req, res) => {
  res.send("You got it motherfucker")
});
  
app.listen(process.env.PORT || 3000, () => {
    console.log("Express server listning on port ");
});