var express = require('express');
var app = express();
const adminRoutes = require('./route/admin');
const userRoutes = require('./route/user');
var nodemailer = require('nodemailer');
const path = require("path");
// const session = require('express-session');
// const flash = require('connect-flash');
app.set('view engine', 'pug');
app.set('views',path.join(__dirname,'views'));
app.use(express.static('public'));

app.use('/',userRoutes);
app.use('/admin',adminRoutes);

app.use("/css",express.static(path.join(__dirname, "node_modules/bootstrap/dist/css")));
app.use("/js",express.static(path.join(__dirname, "node_modules/bootstrap/dist/js")));
app.use("/jquery",express.static(path.join(__dirname, "node_modules/jquery/dist")));
app.use(express.static(path.join(__dirname, '/public')));

// var cookieParser = require('cookie-parser');
// var con =mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "",
//     database: "onlinexam"
// });
// app.use(sessions({
//    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
//    saveUninitialized:true,
//    resave: false 
// }));
// var transporter = nodemailer.createTransport({
//    service: 'gmail',
//    auth: {
//      user: 'kapiltanwar390@gmail.com',
//      pass: 'kapil1993@'
//    }
//  });
//  app.use(cookieParser());


 app.listen(3000);