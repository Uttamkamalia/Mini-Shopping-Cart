var cardId ;
var username=document.getElementById("user").innerHTML;

var itemcost ;

function addItem(ele){
    cardId = ele.parentNode.parentNode.parentNode.id;

    var query = "username="+username+"&itemname="+cardId;
    console.log("query:",query);
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var data = JSON.parse(this.responseText);

          document.getElementById(cardId+":showquantity").innerHTML = data.itemquantity;
          document.getElementById(cardId+":tablequantity").innerHTML = data.itemquantity;
          document.getElementById("totalcost").innerHTML = data.total;
        }
      };

    xhttp.open("GET", "/users/addItem?"+query, true);
    xhttp.send();
    
    
};

function subItem(ele){
    
    cardId = ele.parentNode.parentNode.parentNode.id;

    var query = "username="+username+"&itemname="+cardId;
    console.log("query:",query);
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var data = JSON.parse(this.responseText);

            document.getElementById(cardId+":showquantity").innerHTML = data.itemquantity;
            document.getElementById(cardId+":tablequantity").innerHTML = data.itemquantity;
            document.getElementById("totalcost").innerHTML = data.total;
        }
      };

    xhttp.open("GET", "/users/subItem?"+query, true);
    xhttp.send();
    

};

function remItem(ele){
    
    cardId = ele.parentNode.parentNode.parentNode.id;
    
    var query = "username="+username+"&itemname="+cardId;
    console.log("query:",query);
    var xhttp = new XMLHttpRequest();

    
    

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var data = JSON.parse(this.responseText);
            
            document.getElementById("Tab:"+data.itemname).remove();
            document.getElementById(data.itemname).remove();
            document.getElementById("totalcost").innerHTML = data.totalcost;
        }
      };

    xhttp.open("GET", "/users/remItem?"+query, true);
    xhttp.send();
    

};
function remItem1(ele){
    
    cardId = ele.parentNode.id;
    cardId = cardId.substring(4,cardId.length);
    
    var query = "username="+username+"&itemname="+cardId;
    console.log("query:",query);
    var xhttp = new XMLHttpRequest();

    
    

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var data = JSON.parse(this.responseText);
            
            document.getElementById("Tab:"+data.itemname).remove();
            document.getElementById(data.itemname).remove();
            document.getElementById("totalcost").innerHTML = data.totalcost;
        }
      };

    xhttp.open("GET", "/users/remItem?"+query, true);
    xhttp.send();
    

};

function cfmorder()
{
    alert("Order Confirmed.");
};




