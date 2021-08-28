const fs = require("fs");

exports.init = function(req,res){
    if (req.url != "/"){
        var url = req.url;
    }else{
        var url = "/index.html"
    }
    var type = req.url.split(".");
    switch(type[1]){
        case "css":
            res.setHeader('Content-Type', 'text/css');
        break;
        case "js":
            res.setHeader("Content-Type","text/javascript");
        break;
        case "html":
            res.setHeader("Content-Type","text/html");
        break;
    }
        
    
    fs.readFile("." + url, function(e, data){
        res.end(data);
    });
}