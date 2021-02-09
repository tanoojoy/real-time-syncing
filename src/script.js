var categories_populated = false;
var modal = document.getElementById('ticketModal');
var modal2 = document.getElementById('cat_table');
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
    if (event.target == modal2) {
        modal2.style.display = "none";
    }
}

function get_categories(){
    var settings = {
        "url": "/get_arc_categories",
        "method": "POST",
        "async": false,
        success: function(arcadier){
            var mongo_db = {
                "url": "/get_mongo_fields",
                "method": "POST",
                "async": false,
                success: function(mongo){
                    if(!categories_populated){
                        populate_category_modal(arcadier, mongo);
                        categories_populated = true;
                    }
                }
            }
            $.ajax(mongo_db)
        }
    };
    $.ajax(settings);
};

function populate_category_modal(arcadier, mongo){
    var table = document.getElementById("the_table");
    for(var i=0;i<mongo.length;i++){
        var tr = document.createElement("tr");
        var td = document.createElement("td");
        var td2 = document.createElement("td");

        td.innerHTML = mongo[i];
        td.id = mongo[i];
        td2.innerHTML = "<select name=\"arcadier_cats\" id=\"arcadier_cats_"+i+"\" multiple></select>";

        tr.appendChild(td);
        tr.appendChild(td2);
        table.appendChild(tr);

        var select = document.getElementById("arcadier_cats_"+i);
        for(var j=0;j<arcadier.length;j++){
            createOptions(arcadier[j], i);
        }
    }
    var modal = document.querySelector("#the_table");
    var button = document.createElement("a");
    button.id = "map_cats";
    button.innerHTML = "Map Categories";
    modal.appendChild(button);

    $("#map_cats").click(map_categories);
}

function createOptions(cat, i){
    // console.log(cat.ChildCategories);
    var select = document.getElementById("arcadier_cats_"+i);
    if(cat.ChildCategories.length != 0){
        var option = document.createElement("option");
        option.value = cat.ID;
        if(cat.Level == 4 ){
            option.innerHTML = "---->" + cat.Name; 
        }
        else if(cat.Level == 3  ){
            option.innerHTML = "--->" + cat.Name; 
        }
        else if(cat.Level == 2  ){
            option.innerHTML = "-->" + cat.Name; 
        }
        else if(cat.Level == 1  ){
            option.innerHTML = "->" + cat.Name; 
        }
        else{
            option.innerHTML = cat.Name;
        }
        
        select.appendChild(option);

        for(var s=0;s<cat.ChildCategories.length;s++){
            createOptions(cat.ChildCategories[s], i);
        }
    }
    else{
        
        var data = {
            "name": cat.Name,
            "id": cat.ID
        };
        if(cat.Level == 4  ){
            data.name = "---->" + data.name; 
        }
        else if(cat.Level == 3  ){
            data.name = "--->" + data.name; 
        }
        else if(cat.Level == 2  ){
            data.name = "-->" + data.name; 
        }
        else if(cat.Level == 1  ){
            data.name = "->" + data.name; 
        }
        
        var option = document.createElement("option");
        option.value = data.id;
        option.innerHTML = data.name;
        select.appendChild(option);
    }
}

function map_categories(){
    var table = document.getElementById("the_table");
    var row = table.querySelectorAll("tr");
    var map = {
        "list":[]
    };
    for(var x=0;x<row.length;x++){
        var mongo_category_name = row[x].children[0].id;
        var arcadier_category_guid = row[x].children[1].children[0];
        var arcadier_category_guid_list = arcadier_category_guid.querySelectorAll("option:checked");

        var map_instance = {
            "mongo_cat": mongo_category_name,
            "arcadier_guid": []
        };

        arcadier_category_guid_list.forEach(function(guid, i){
            map_instance.arcadier_guid[i] = guid.value;
        });

        map.list.push(map_instance);
    }
    console.log(map.list)
}