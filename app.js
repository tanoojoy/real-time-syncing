const express = require('express');
const bp = require("body-parser");
let client = require('./sdk/client');
const { MongoClient } = require('mongodb');

const app = express();
app.use(require("morgan")("dev"));
app.use(bp.urlencoded({ extended: false }))
app.use(bp.json());

app.post("/webhook", (req, res) => {
  console.log(req.body);

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
  res.send("You got it!!!")
});
  
app.listen(process.env.PORT || 3000, () => {
    console.log("Express server listning on port ");
});

async function main(){
    
  const uri = "mongodb+srv://Tanoo_mongo:(facethewallordie)@cluster0.gcu7q.mongodb.net/<dbname>?retryWrites=true&w=majority";
  const db_client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  
  try {
      //connect to external database
      await db_client.connect();

      //select DB and collection
      const database = db_client.db('Items');
      const collection = database.collection('Arcadier ETL');

      //choose row in DB to modify
      const query = { ID: "5ccbcf4d-27b1-43e1-956a-1d9492d2bc3a"};

      //set field and value to modify
      const result = await collection.updateOne( query, { $set: { synced: 0} })
      console.log(result.result.n)
     
  }
  catch(e){
      console.error(e);
  }
  finally {
      db_client.close();
  }
}