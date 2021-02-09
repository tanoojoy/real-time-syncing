let client = require('../sdk/client');




//only use this if marketplace has 1000 items or less



const get_all_items = new Promise(function(resolve, reject){
    var options = {
        "pageSize": 1000
    };
    client.Items.filterItem(options, function(err, result){
        if(!err){
            resolve(result);
        }
    })
})

Promise.all([get_all_items]).then(response => {
    response[0].Records.forEach(element => {
        var options = {
            "merchantId": element.MerchantDetail.ID,
            "itemId": element.ID
        }
        const delete_item = new Promise(function(resolve, reject){
            client.Items.deleteItem(options, function(err, result){
                if(!err){
                    resolve(result);
                }
            });
        });

        Promise.all([delete_item]).then(response => {
            console.log("Item deleted: " + response[0].Name);
        });
    });
})