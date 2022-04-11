const user = require("express").Router();

var bodyParser = require('body-parser');
var urlencodeParser = bodyParser.urlencoded({ extended : false });
user.use(bodyParser.json());
var multer  = require('multer');
var upload=multer({ dest: '/public/upload/'});
var fs = require("fs");
var session = require('express-session');
var nodemailer = require('nodemailer');
var mysql = require('mysql');
var con =mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "onlinexam"
});
user.use(session({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    resave: false 
 }));
 
 //mail authrization
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'kapiltanwar390@gmail.com',
      pass: 'kapil1993@'
    }
});

//Root Page i.e. User Login
user.get('/',function(req,res){
    res.render('user/welcome.pug');
});

//Newuser and login page naviagtion mention on welcome page
user.get('/user_login',function(req,res){
    res.render("user/user_login");
});

//Login page section
user.post('/log', urlencodeParser , (req,res) => {
    data="";
    req.session.email=email=req.body.xemail;
    req.session.pass=pass=req.body.xpass;
    if(req.session.email=='' || req.session.pass=='')
    {
        res.render("user/user_login.pug",{message:"Please Fill all the fields"});
    }
    else
    {
        
        var sql ="select * from member where email='"+ email +"' and pass='"+ pass +"'";
            con.query(sql, function (err,result,field) {
                if (err) throw err;
                {
                    req.session.login=true;
                    sql="select * from subject";
                    con.query(sql,function(err,result,field){
                        res.render("user/user_home.pug",{mydata:result});            
                    });
                }
            });
    }
});

//Choose Level navigation
user.get('/choose_level',(req,res)=>{
    res.render("user/level_selection.pug");
});


//Forget Password
user.get('/fpass',function(req,res){
    res.render("user/fpass.pug");
});

//Email verification for forget password
user.post('/email_verify',urlencodeParser,function(req,res){
    req.session.email=email=req.body.xemail;
    var sql ="select * from member where email='"+ email +"'";
    // console.log(sql);
        con.query(sql, function (err,result,field) {
            if(!err) 
            {
                if(result<=0)
                    res.render("user/fpass.pug",{message:"Email is not registred"})
                else
                {
                   req.session.otp= otp=Math.floor(Math.random() * (9999,1111)) + 1111;
                    email_message="Your forget OTP is :" + otp + " Please do not share OTP with other";
                    var mailOptions = {
                        from: 'kapiltanwar390@gmail.com',
                        to: email,
                        subject: 'Sending Email using Node.js',
                        text: email_message
                    };
                        
                    transporter.sendMail(mailOptions, function(error, info){
                        if (error) 
                            console.log(error);
                        else 
                            console.log('Email sent: ' + info.response);
                    });
                    res.render("user/otp.pug");           
                }
            }
        });
});

//otp verification page
user.post('/otp',urlencodeParser,function(req,res){
   otp=req.body.xotp;
//    console.log(req.session.otp);
   if(req.session.otp==otp)
   {
       res.render("user/newpass.pug");
   }
   else
   {
       res.render("user/otp.pug",{message:"Incorrect otp"});
   }  
});

//New password creator page
user.post('/pass_verify',urlencodeParser,function(req,res){
    pass=req.body.pass;
    npass=req.body.npass;
    if(pass == npass)
    {
        var sql ="update member set pass='"+npass+"' where email='"+req.session.email+"'";
        // console.log(sql);
        con.query(sql, function (err) {
            if (!err)
            {
                // res.render("newpass.pug",{message:"update"});
                res.render("user/user_login.pug");
            }
        });
    }
    else
    {
        res.render("user/newpass.pug",{message:"not update"});
    }
});



// Registration page section
user.post('/reginsert', upload.single("xfile"), (req,res)=>{
    req.session.user_name=user_name=req.body.xname;
    dob=req.body.xdob;
    gen=req.body.xgen;
    email=req.body.xemail;
    num=req.body.xnum;
    pass=req.body.xpass;
    cpass=req.body.xcpass;
    num=req.body.xnum;
    // console.log(req.file.originalname);
    // console.log(req.file.path);
    // console.log(req.file.mimetype);
    if(user_name==''|| dob=='' || gen=='' || email=='' || num=='' || pass=='' || cpass=='')
    {
        res.render("user/user_register.pug",{message:"problem to insert data!!"});
    }
    else
    {
        var file=req.file.originalname;
        if(pass == cpass)
        {
            fs.readFile(req.file.path,function(err,data){
                fs.writeFile("public/upload/" + file,data,function(err){
                    if(!err)
                    {
                        var sql ="insert into member(name,dob,gender,email,mobile,pass,image) values ('"+user_name+"','"+dob+"','"+gen+"','"+email+"','"+num+"','"+pass+"','"+file+"')";
                        con.query(sql, function (err, result) {
                            if (err) throw err;
                            res.render("user/user_login.pug",{message:"Data is successfully inserted!!"});
                        });
                    }
                });
            });
        }
        else
        {
            res.render("user/user_register.pug",{message:"Pleace enter the correct password!!!"});
        }
        
    }
});

// Home naviagtion on home page of user
user.get('/home',function(req,res){
    sql="select * from subject";
    con.query(sql,function(err,result,field)
    {
        res.render("user/user_home.pug",{mydata:result}); 
    });
});

//Exam Start naviagtion on home page of user
user.get('/examstart',function(req,res){
    res.render('user/exam.pug');
});

// //Result naviagtion on home page of user
// user.get('/result',function(req,res){
//     res.render('user/home_result.pug');
// });

// //Contact us naviagtion on home page of user
// user.get('/contactus',function(req,res){
//     res.render('user/home_contactus.pug');
// });

// //Perosnal Details naviagtion on home page of user
// user.get('/personal_details',function(req,res){
//     res.render('user/home_personalDetails.pug');
// });

//INstruction Navigation
user.get('/instruction',(req,res)=>{
    res.render("user/instruction.pug");
});

//Logout naviagtion mention on home page
user.get('/logout',function(req,res){
    res.render('user/user_login.pug')
});

module.exports = user;