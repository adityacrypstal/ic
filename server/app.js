var express = require('express');
var path = require('path');
var app = express();
var cookieParser = require('cookie-parser');
var fs = require('fs');
const bodyParser = require("body-parser");
const cors = require('cors');

app.set('view engine', 'ejs');
app.use(cookieParser());
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
    origin: 'http://13.233.149.105.xip.io:3000',
    credentials: true
}));


//Home
app.get('/', function(req, res) {
    res.render('login');
});

//Dashboard
app.get('/dash', isAuthenticated, function(req, res) {
    let rawdata = fs.readFileSync('driver.json');
    let drivers = JSON.parse(rawdata);
    res.render('dash',{drivers:drivers.drivers});
});

//Login
app.post('/login', isAuthenticated, function(req, res) {
    let body = JSON.parse(JSON.stringify(req.body))
    if(body.uname == 'aditya@adityav.in'&& body.psw =='admin@123'){
        res.cookie('user', 'aditya@adityav.in', { maxAge: 900000, httpOnly: true });
        res.redirect('/dash')
    }
});

//Fetch driver
app.get('/read',isAuthenticated, function(req, res) {
    let rawdata = fs.readFileSync('driver.json');
    let drivers = JSON.parse(rawdata);
   res.send(drivers.drivers)
});

//Add Driver
app.post('/addData', isAuthenticated,  async(req, res) => {
    let body = JSON.parse(JSON.stringify(req.body))
   if(!body.name || !body.age || !body.email || !body.language || !body.rate){
       res.redirect('/dash')
   }else{
       let rawdata = await fs.readFileSync('driver.json');
       let jsonData = JSON.parse(rawdata);
       let data = `{"name":"${body.name}","age":"${body.age}","language":"${body.language}","rate":"${body.rate}","email":"${body.email}"}`;
       jsonData.drivers.push(JSON.parse(data));
       await fs.writeFileSync('driver.json',JSON.stringify(jsonData));
       res.redirect('/dash')
   }

});

//Delete Driver
app.get('/delete/:id', isAuthenticated, async(req, res) => {
    if(req.params.id){
        let rawdata = await fs.readFileSync('driver.json');
        let jsonData = JSON.parse(rawdata);
        let final = jsonData.drivers.filter(data => data.email!= req.params.id);
        let data = {};
        data.drivers = final;
        await fs.writeFileSync('driver.json',JSON.stringify(data));
        res.redirect('/dash')
    }
    res.redirect('/dash')
})

//edit Driver
app.post('/edit', isAuthenticated ,  async(req, res) => {
    let body = JSON.parse(JSON.stringify(req.body));
    let rawdata = await fs.readFileSync('driver.json');
    let jsonData = JSON.parse(rawdata);
    let final = jsonData.drivers.filter(data => data.email!= body.email);
    final.push(body)
    let data = {};
    data.drivers = final;
    await fs.writeFileSync('driver.json',JSON.stringify(data));
    res.send(final)
})

app.get('/logout',function (req, res) {
    res.clearCookie("user");
    res.redirect('/')
})

function isAuthenticated(req, res, next) {
    if (true)
        return next();
    res.redirect('/');
}

app.listen(4000, function () {
    console.log('Example app listening on port 4000!');
});