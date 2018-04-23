

var cardId ;

var username=document.getElementById("user").innerHTML;
var itemcost ;

var useritems = new Array();



function storeData(ele)
{
    cardId = ele.parentNode.parentNode.parentNode.id;
    //username=document.getElementById("username").innerHTML;
    itemcost = document.getElementById(cardId +":cost").innerHTML;

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
                alert(http.responseText);
                //document.write(http.responseText);

            }
        };
        
    http.send(params);

};

function addData(ele){
    
   // var ele = document.getElementById("addDataButt");
   //var ele = document.getElementById("addDataButt");
    cardId = ele.parentNode.parentNode.parentNode.id;
    username=document.getElementById("username").innerHTML;
    itemcost = document.getElementById(cardId +":cost").innerHTML;
    alert(cardId);

    var item = {
        name:cardId,
        quantity:1,
        cost:itemcost
    };

    useritems.push(item);
       
    console.log("Post username::::",username);
    console.log("Post itemcost:::",itemcost);
    console.log("Post itemname:::",cardId);

    document.getElementById(cardId).remove();
    
    
    };


    function savetodb(){
       
        var datatosend = JSON.stringify({useritems:useritems})
        console.log("items in Cart string :",datatosend);

        var http = new XMLHttpRequest();
        var url = "/users/addtocart";
        var params = "username="+username+"&userdata="+datatosend;
        http.open("POST", url, true);

        //Send the proper header information along with the request
        http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        
        http.onreadystatechange = function() {//Call a function when the state changes.
            if(http.readyState == 4 && http.status == 200) {
                alert(http.responseText);
                //document.write(http.responseText);

            }
        };
        
    http.send(params);
    console.log("Params send::",params);

    };


   


    

    
  



