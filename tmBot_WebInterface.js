var http = require('http')
var MongoClient = require('mongodb').MongoClient

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
    tmp=' <html> <head><meta charset="utf-8" /><style>#t01 th {background-color: #02bed2;color: white;}.flex-container {display: -webkit-flex;display: flex;  -webkit-flex-flow: row wrap;flex-flow: row wrap;text-align: center;}';
    tmp+='.flex-container > * {padding: 15px;-webkit-flex: 1 100%;flex: 1 100%;}.article {text-align: left;}header {background: #02bed2;color:white;}footer {background: #17d3e7;color:white;}.nav {background:#abe9f0;}';
    tmp+='.nav ul {list-style-type: none;padding: 0;}.nav ul a {text-decoration: none;}@media all and (min-width: 768px) {.nav {text-align:left;-webkit-flex: 1 auto;flex:1 auto;-webkit-order:1;order:1;}.article {-webkit-flex:5 0px;flex:5 0px;-webkit-order:2;order:2;}footer {-webkit-order:3;order:3;}}</style></head><body><div class="flex-container">';
    tmp+='<header><h1>مرکز آپا دانشگاه بوعلی سینا</h1></header>';
    tmp+='<nav class="nav"></nav></div><br/><br/><br/><table  border="1" style="width:100%"><tr id="t01" ><th>ChatId</th> <th>Status</th><th>ApplyDate</th><th>Fullname</th><th>contact</th><th>Expertis</th><th>Experience</th><th>Interes</th></tr>';
   for(i=0;i<out.length;i++){
        tmp+='<tr>';
            tmp+='<td>'+out[i].ChatId+'</td>';
            tmp+='<td>'+out[i].Status+'</td>';
            tmp+='<td>'+out[i].ApplyDate+'</td>';
            tmp+='<td>'+out[i].Fullname+'</td>';
            tmp+='<td>'+out[i].Contact+'</td>';
            tmp+='<td>'+out[i].Expetise+'</td>'
            tmp+='<td>'+out[i].Experience+'</td>';
            tmp+='<td>'+out[i].Intrest+'</td>';
        tmp+='</tr>';

   }
   tmp+='</table><footer>جدول رزومه</footer></body> </html> '
   res.end(tmp);
}).listen(3000);
// how creat username and password