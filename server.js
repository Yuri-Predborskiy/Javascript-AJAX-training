const express = require('express');
const app = express();
const path = require('path')
const bodyParser = require('body-parser');
const fs = require('fs');
const User = require('./app_modules/User');
const fsbase = require('./app_modules/fs_service'); 

app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use("/css",  express.static(__dirname + '/css'));
app.use("/js", express.static(__dirname + '/js'));
app.use("/img",  express.static(__dirname + '/img'));

app.get('/', function (req, res) {
      res.sendFile(__dirname + '/index.html');
});

app.get('/api', (request, response) => {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "X-Requested-With");
    fsbase.get().then((res)=>{
      response.send(res);
    })
});

app.post('/api', (request, response) => {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "X-Requested-With");
    let data = request.body, toBase = User.create(data);
    'error' in toBase ? response.send(toBase['error']) : fsbase.write(toBase).then((res)=>{
      res.done ? response.send('done') : response.send('error');
    }).catch((res)=>{
      response.send(res);
    });
});


app.put('/api', (request, response) => {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "X-Requested-With");
    let data = request.body;
    fsbase.repl(data, 'replace').then((res)=> response.send(res.done) );
});

app.delete('/api', (request, response) => {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "X-Requested-With");
    let data = request.body;
    fsbase.repl(data, 'remove').then((res)=> response.send(res.done) );
});

app.listen(3000, function () {
    console.log('app started at http://localhost:3000');
});