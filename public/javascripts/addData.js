

var cardId ;

var username=document.getElementById("user").innerHTML;
var itemcost ;

var useritems = new Array();



function storeData(ele)
{
    cardId = ele.parentNode.parentNode.parentNode.id;
    
    itemcost = document.getElementById(cardId +":cost").innerHTML;
    itemcost = itemcost.substring(25,itemcost.length);
    console.log("cost:::",itemcost);

    var item = {
        name:cardId,
        quantity:1,
        cost:itemcost
    };

    document.getElementById(cardId).remove();

    var datatosend = JSON.stringify(item);
    var http = new XMLHttpRequest();
        var url = "/users/addtocart";
        var params = "username="+username+"&userdata="+datatosend;
        http.open("POST", url, true);


        //Send the proper header information along with the request
        http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        
        http.onreadystatechange = function() {//Call a function when the state changes.
            if(http.readyState == 4 && http.status == 200) {
               // alert(http.responseText);
               

            }
        };
        
    http.send(params);

};




   


    

    
  



