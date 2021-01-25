let client = require('../sdk/client');
const { MongoClient } = require('mongodb');
const ADMIN_ID = "af6bf51d-426e-4a31-bcfc-1ecaf706b202";
//test-comment

const uri = "mongodb+srv://Tanoo_mongo:(facethewallordie)@cluster0.gcu7q.mongodb.net/<dbname>?retryWrites=true&w=majority";
const db_client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
var return_array = [];
var arcadier_categories;
var collection;
var i=0;
var total=0;

//get categories from Arcadier for mapping
const get_cats = new Promise(function(resolve, reject){
    client.Categories.getAllCategories({ "adminID": ADMIN_ID }, function (err, result){
        if(!err){
            resolve(result);
        }
    });
});

//connect to external database
const connect_db = new Promise(async function(resolve, reject){
    await db_client.connect();
    const database = db_client.db('Items');
    collection = database.collection('Arcadier ETL');
    resolve(collection);
}); 

Promise.all([get_cats, connect_db]).then(async function(response){
    arcadier_categories = response[0].Records;

    // const query = { Name: "nandrolone" };
    const query = { synced: 0 };
    const cursor = await collection.find(query);
    total = await cursor.count();
    
    for await (const doc of cursor) {
        import_items(doc);
        await cheep(300);
    }
    
}); 

function import_items(item){

    arcadier_categories.forEach(arcadier_category => {
        item.Categories.forEach(imported_category => {
            if(arcadier_category.Name == imported_category.Name){
                return_array.push({ "ID": arcadier_category.ID });
            }
        })
    });

    var data = {
        "ID": item.ID,
        "Name": item.Name,
        "SKU": item.SKU,
        "Price": item.Price,
        "PriceUnit": "SGD",
        "CurrencyCode": "SGD",
        "StockLimited": 10,
        "StockQuantity": 0,
        "BuyerDescription": item.BuyerDescription,
        "SellerDescription": "test",
        "IsVisibleToCustomer": item.IsVisibleToCustomer,
        "IsAvailable": item.IsAvailable,
        "Active": item.Active,
        "InstantBuy": item.InstantBuy,
        "Negotiation": item.Negotiation,
        "Categories": return_array,
        "HasChildItems": false,
        "CustomFields":[
            {
                "Code": "19521-DB_ID-Ee71FeXXRZ",
                "Values": [item._id]
            }
        ]
    };

    var options = {
        "data": data,
        "merchantId": "02ec5b74-ecc2-4c9c-9048-dbfc9de419ba" //hardcoded because the merchants havent been imported yet for this test.
    }

    const create_item = new Promise(function(resolve, reject){
        client.Items.createItem(options, function(err, response){
            if(!err){
                resolve(response);
                
            }
            else{
                console.log(err)
            }
        });
    });

    Promise.all([create_item]).then(async function(response){
        console.log("Created item: "+ response[0].Name)
    });
    
    update_db(item);

    return_array = [];
}

function update_db(item){

    const update_db = new Promise(async function(resolve, reject){
        const response = await collection.updateOne( {ID: item.ID}, { $set: { synced: 1} }, { upsert: false });
        resolve(response);
    });

    Promise.all([update_db]).then(async function(response){
        console.log("Updated DB for item: "+ item.Name)
        i++;
        console.log(i)
        if(i == total){
            await db_client.close();
        }
    });
}

function cheep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
