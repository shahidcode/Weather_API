// http://api.openweathermap.org/data/2.5/weather?q=pune&appid=be7bdd56c18d8f6de392dabd1c915c02         this is the api for weather


const http = require("http");
const fs = require("fs");
var requests = require("requests");
const path = require("path");

const ReadFile = fs.readFileSync("weather.html","utf-8");       // reading html file

const replaceVal = (x,y)=>{
    const tempCelsius = (y.main.temp-273.15).toFixed(2);                             // we have got temparature from api in kelvin,so we converted it to celsius. // .toFixed(2) round off the number upto 2 digits
    let valueToReplace = x.replace("{%location%}",y.name);    
    valueToReplace = valueToReplace.replace("{%tempVal%}",tempCelsius);     // we saved our html data into valueToReplace so now,we need to write valueToReplace.replace instead of x.replace
    valueToReplace = valueToReplace.replace("{%tempStatus%}",y.weather[0].main);  
    return valueToReplace;
}

const server = http.createServer((req,res)=>{
    if(req.url == "/"){
        requests(
            "http://api.openweathermap.org/data/2.5/weather?q=pune&appid=be7bdd56c18d8f6de392dabd1c915c02"          // requesting api url
        )
        .on("data",(chunk)=>{                           // reading requested data i.e api url
            const objData = JSON.parse(chunk);
            var arrData = [objData];
            const realTimeData = arrData.map((val) => replaceVal(ReadFile,val)).join("");          // an arrow function witout {}  // map function is similar to object
            res.write(realTimeData);
        })
        .on("end",(err)=>{
            res.end();
        })
    }
});

server.listen(8000,"127.0.0.1");