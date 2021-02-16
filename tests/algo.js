function max(tits){
    var max_number_index = 0;

    for(var i=0;i<tits.length;i++){
        if(tits[i+1] > tits[i] && tits[i+1] > tits[max_number_index]){
            max_number_index = i+1;
        }
    }

    return tits[max_number_index];
}

var tits = [1,2,3,4,5,3,4,45,878,34,56,67,877,545,2,43]
var result = max(tits);
console.log(result);