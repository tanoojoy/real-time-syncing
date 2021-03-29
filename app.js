const express = require('express');
const bp = require("body-parser");
const path = require("path");
let client = require('./sdk/client');
const { MongoClient } = require('mongodb');


const app = express();
app.use(require("morgan")("dev"));
app.use(bp.urlencoded({ extended: false }))
app.use(bp.json());
app.set('view engine', 'ejs');

//receives payload from arcadier event trigger
app.post("/webhook", (req, res) => {

  const get_item = new Promise(function(resolve, reject){
    var options = {
      "itemId": req.body.Data.ID,
      "activeOnly": true
    };
    client.Items.getItemDetails(options, function(err, result){
      if(!err){
        resolve(result);
      }
    });
  });

  Promise.all([get_item]).then(response => {
    main(response[0]);
  });
});

//receives payload from Mongo DB event trigger
app.post("/db_change", (req, res) =>{

  //look for the item that got changed
  var options = {
    "CustomFieldQueries": [
      {
          "Code": "19521-DB_ID-Ee71FeXXRZ",
          "Operator": "equal",
          "Value": req.body._id
      }
    ]
  };
  console.log(options.CustomFieldQueries[0].Value)

  const search_item = new Promise(function(resolve, reject){
    client.Items.filterItem(options, function(err, result){
      if(!err){
        resolve(result);
      }
    })
  });

  //once item is found, update that item
  Promise.all([search_item]).then(response => {
    console.log("Found Item: " + response[0].Records[0].Name);
    var options = {
      "itemId": response[0].Records[0].ID,
      "merchantId": response[0].Records[0].MerchantDetail.ID,
      "data": {
        "Name": req.body.Name
      }
    };
    console.log("Update from DB: " + options.data.Name);

    const update_item = new Promise(function(resolve, reject){
      client.Items.EditNewItem(options, function(err, result){
        if(!err){
          resolve(result)
        }
      });
    });

    Promise.all([update_item]).then(response => {
      console.log("Updated item Name to: " + response[0].Name);
      res.send({"Message": "Updated item Name to: " + response[0].Name});
    });
  });
})

//homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname+'/src/index.html'));
});

app.post("/register", async function(req, res){
  console.log(req.body);
  var state = await register_credentials(req.body)
  if(state == 1){
    var response = {
      "domain_registered": req.body.arcadier_domain_field 
    }
    res.send("Autehntication Sucessful");
  }
  else{
    res.send("Authentication Failed");
  }
});

app.get("/etl", (req, res) => {
  if(req.status != "200"){
    console.log("busted")
  }
  else{
    console.log(req);
  }
  
})

app.post("/get_arc_categories", (req, res) =>{

  const get_cats = new Promise(function(resolve, reject){
    client.Categories.getCategories(null, function(err, result){
      if(!err){
        resolve(result)
      }
    }) 
  })

  Promise.all([get_cats]).then(response => {
    res.send(response[0]);
  })
})

app.post("/get_mongo_fields", async function(req, res) {
  var db_client = mongo_db_init();

  try{
    var array_list = [];
    await db_client.connect();

    //select DB and collection
    const database = db_client.db('Items');
    const collection = database.collection('Arcadier ETL');

    const cursor = await collection.find();
    await cursor.forEach(doc => {
      if(!array_list.includes(doc.Categories[0].Name)){
        array_list.push(doc.Categories[0].Name);
      }
    })

    res.send(array_list);
  }
  catch(e){
    console.error(e)
  }
  finally{
    db_client.close();
  }
})

app.post("/save_map", async function(req, res){
  console.log(req.body);

  var db_client = mongo_db_init();

  try{
    await db_client.connect();

    //select DB and collection
    const database = db_client.db('Users');
    const collection = database.collection('Arcadier Domains');

    const query = { user_email: req.body.User};

    const update = {
      $set: {
        map:
          req.body.List,
      }
    };

    var result = await collection.updateOne(query, update, { upsert: true });
    res.send({"status": "true", "message": `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`})

  }
  catch(e){
    console.error(e)
    res.send(e);
  }
  finally{
    db_client.close();
  }
});

app.post("/start_import", async function(req, res){
  console.log(req.body);
  res.send("Received");
});
  
app.listen(process.env.PORT || 3000, () => {
    console.log("Express server listning on port ");
});

async function register_credentials(details){
  var db_client = mongo_db_init();
  var state;
  try {
    //connect to external database
    await db_client.connect();

    //select DB and collection
    const database = db_client.db('Users');
    const collection = database.collection('Arcadier Domains');

    const arcDocument = {
      user_email: details.user_email,
      domain: details.arcadier_domain,
      clientID: details.client_id,
      clientSecret: details.client_secret,
      mongo_username: details.mongo_username,
      mongo_password: details.mongo_password
    };

    const result = await collection.insertOne(arcDocument);
    state = result.insertedCount// should print 1 on successful insert
  }
  catch(e){
      console.error(e);
  }
  finally {
      db_client.close();
      return state;
  }
}

async function main(item){
  
  const uri = "mongodb+srv://username:password@cluster0.gcu7q.mongodb.net/<dbname>?retryWrites=true&w=majority";
  const db_client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  
  try {
      //connect to external database
      await db_client.connect();

      //select DB and collection
      const database = db_client.db('Items');
      const collection = database.collection('Arcadier ETL');

      //choose row in DB to modify
      const query = { ID: "5ccbcf4d-27b1-43e1-956a-1d9492d2bc3a" };

      //set field and value to modify
      const result = await collection.updateOne( query, { $set: item })
      console.log(result.result.n)
     
  }
  catch(e){
      console.error(e);
  }
  finally {
      db_client.close();
  }
}

function mongo_db_init(){
  const uri = "mongodb+srv://username:password@cluster0.gcu7q.mongodb.net/<dbname>?retryWrites=true&w=majority"; //stays this way
  const db_client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  return db_client;
}