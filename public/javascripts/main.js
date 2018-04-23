function delete_image(e){
  console.log("hello");
  var v = e.parentNode.parentNode.parentNode.id;
  console.log(v);
  var c = document.getElementById("cost"+v).innerHTML;
  var d = document.getElementById("number").innerHTML;
  console.log(d);
  //console.log(typeof (e.parentNode.parentNode.parentNode.id.split(" ")[1]));
  $.get("/delete/"+e.parentNode.parentNode.parentNode.id.split(" ")[1], function(data, status){
      document.getElementById(e.parentNode.parentNode.parentNode.id).remove();
      document.getElementById("Price"+v).remove();
      document.getElementById("number").innerHTML = d-c;
  });
};
