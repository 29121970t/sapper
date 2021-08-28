var MongoClient = require("mongodb").MongoClient;
var http = require("http");
var ws = require("ws");
var public = require("./publicModule");

const wss = new ws.Server({server:true, port:3001});
var mongoclient = new MongoClient("mongodb://127.0.0.1:27017/", { useUnifiedTopology: true });

mongoclient.connect(function(err, result){
    if(err) throw err;
    var db = result.db("game");
    var col = db.collection("scoreboard");
    wss.on("connection", function(socket){
        socket.on("message", function(data){

            var mass = JSON.parse(data);
            console.log(mass);
            if(mass.type == "sync"){
                col.find().sort({score:1});
                col.find().limit(5).sort({score:-1}).toArray(function (err, result){

                    if(err) throw err;
                    socket.send(JSON.stringify({type:"sync", data:result}));
                });
                
            }
            if(mass.type == "add"){
                col.insert(mass.data);
                
                
            }
        });

    });
});

var server = http.createServer(function(req, res){
    public.init(req, res);

});
server.listen(3000);
