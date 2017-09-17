var http = require('http')
//var express=require('express')
var MongoClient = require('mongodb').MongoClient
//var himalaya = require('himalaya')
//const port=3000//

var url = "mongodb://localhost:27017/APA";//////////????????

var out=[];

var i=0;

MongoClient.connect(url, function(err, db) {
	
  if (err) throw err;
  var mysort = { ApplyDate: -1 };
  db.collection("CV").find().sort(mysort).toArray(function(err, result) {
    if (err) throw err;
    out=result;
     db.close();
});
});

var tmp;
http.createServer(function (req, res) {
   res.writeHead(200, {'Content-Type': 'text/html'});
tmp+='tr={ id="t01" th={ChatId} th={Status} th={ApplyDate} th={Fullname} th={contact} th={Expertis} th={Experience} th={Interes}}';
   for(i=0;i<out.length;i++){
        tmp+='tr={';
            tmp+='td='+out[i].ChatId,
            tmp+='td='+out[i].Status,
            tmp+='td='+out[i].ApplyDate,
            tmp+='td='+out[i].Fullname,
            tmp+='td='+out[i].Contact,
            tmp+='td='+out[i].Expetise,
            tmp+='td='+out[i].Experience,
            tmp+='td='+out[i].Intrest,
        tmp+='}'

   }
tmp+='}';
  var table = $('#abc').tableToJSON();
  console.log(table);
  alert(JSON.stringify(table));  
//};
}).listen(3000);