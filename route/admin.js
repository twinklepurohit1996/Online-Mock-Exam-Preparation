const admin = require("express").Router();
var bodyParser = require('body-parser');
var urlencodeParser = bodyParser.urlencoded({ extended : false });
admin.use(bodyParser.json());
var mysql = require('mysql');
var con =mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "onlinexam"
});


//Root Page i.e. Admin Login
admin.get('/',function(req,res){
    res.render('admin/admin_login.pug');
});

//Admin Login Navigation
admin.post('/log', urlencodeParser , (req,res) => {
    admin_name=req.body.xname;
    password=req.body.xpass;
    if(admin_name=='admin' && password=='admin')
    {
        res.render("admin/dashboard.pug");
    }
    else
    {
        res.render("admin/admin_login.pug",{message:"Please Login Correctly"});
    }
});

//Subject Section
admin.get('/subject',function(req,res){
  res.render('admin/subject');
});

//Subject Insert Section
admin.post('/sub',urlencodeParser,(req,res)=>{
  rid=req.body.rid;
  sub_name=req.body.sub_name;
  if(rid==''|| sub_name=='')
  {
      res.render("admin/subject.pug",{message:"problem to insert data!!"});
  }
  else
  {
    var sql ="insert into subject(rid,subname) values ('"+rid+"','"+sub_name+"')";
      con.query(sql, function (err, result) {
          if (err) throw err;
            res.render("admin/subject.pug",{message:"Data is successfully inserted!!"});
      });
  }
});

//Subject Table Section
admin.get('/sub_table',function(req,res){
  var sql = "select * from subject";
  con.query(sql, function (err, result, field) {
    if (!err)
    {         
      res.render("admin/subject_table.pug" ,{data:result}); 
    }
  }); 
});

//Subject Table Delete Section
admin.get('/sub_delete/:id',function(req,res){
  id=req.params.id;
  var sql = "DELETE FROM subject WHERE id=" + id;
  con.query(sql, function (err, result) {
     if (err) throw err;
        res.redirect("/admin/sub_table");
  });
});

//Subject Table edit section
admin.get('/sub_edit/:id',function(req,res){
  id=req.params.id;
  var sql = "select * FROM subject WHERE id=" + id;
  console.log(sql);
  con.query(sql, function (err, result) {
    if (err) throw err;
      res.render("admin/sub_edit.pug",{data:result})
    });
});

//Subject update section
admin.post("/sub_update",urlencodeParser,function(req,res){
  id=req.body.xid;
  rid=req.body.rid;
  subname=req.body.sub_name;
  var sql="update subject set rid= '"+ rid +"', subname='"+ subname +"' where id= " + id ;
  console.log(sql);
  con.query(sql, function (err, result) {
  if (err) throw err;
  res.redirect("/admin/sub_table");
  });
});

//Level Section
admin.get('/level',function(req,res){
  con.query("select DISTINCT(rid) from subject",function(err,result){
    if(err) throw err;
      res.render("admin/level.pug",{data:result});
  });
});

//Level Insert Section
admin.post('/level_insert',urlencodeParser,(req,res)=>{
  lid=req.body.lid;
  rid=req.body.rid;
  level_name=req.body.level_name;
  if(lid=='' || rid==''|| level_name=='')
  {
    con.query("select DISTINCT(rid) from subject",function(err,result){
      if(err) throw err;
        res.render("admin/level.pug",{message:"problem to insert data!!",data:result});
    });
  }
  else
  {
    var sql ="insert into level(lid,rid,levelname) values ('"+lid+"','"+rid+"','"+level_name+"')";
    con.query(sql, function (err, result) {
      if (err) throw err; 
      con.query("select DISTINCT(rid) from subject",function(err,result1){
        if(err) throw err;
        res.render("admin/level.pug",{message:"Data is successfully inserted!!",data:result1,dataa:result});
      });
    });
  }
});

//Level Table Section
admin.get('/level_table',function(req,res){
  var sql = "select * from level";
  con.query(sql, function (err, result, field) {
     if (!err)
        {         
           res.render("admin/level_table.pug" ,{data:result}); 
        }
  }); 
});

//Level Table Delete Section
admin.get('/level_delete/:id',function(req,res){
  id=req.params.id;
  var sql = "DELETE FROM level WHERE id=" + id;
  con.query(sql, function (err, result) {
     if (err) throw err;
        res.redirect("/admin/level_table");
  });
});

//Level edit section
admin.get("/level_edit/:id",function(req,res){
  id=req.params.id;
  con.query("select * FROM level WHERE id='"+id+"'",function (err, result1){
    if (err) throw err;
    con.query("select DISTINCT(rid) from subject", function (err, result2) {
      if (err) throw err;
      console.log(result1);
      console.log(result2);
      res.render("admin/level_edit.pug",{data:result1,dataa:result2})
    });
  });
});

//Level Update Section
admin.post("/level_update",urlencodeParser,function(req,res){
  id=req.body.xid;
  lid=req.body.lid;
  rid=req.body.rid;
  levelname=req.body.level_name;
  var sql="update level set lid='" + lid +"',rid= '"+ rid +"', levelname='"+ levelname +"' where id= " + id ;
  console.log(sql);
  con.query(sql, function (err, result) {
  if (err) throw err;
  res.redirect("/admin/level_table");
  });
});

//Question Section
admin.get('/question',function(req,res){
  con.query("select DISTINCT(rid) from subject",function(err,result1){
    if(err) throw err;
    con.query("select DISTINCT(lid) from level",function(err,result2){
      if(err) throw err;
        res.render("admin/question.pug",{dataa:result1,dataaa:result2});
    });
  });
});
//Question Insert Section
admin.post('/que',urlencodeParser,(req,res)=>{
  rid=req.body.rid;
  lid=req.body.lid;
  que_num=req.body.que_num;
  que=req.body.que;
  a=req.body.a;
  b=req.body.b;
  c=req.body.c;
  d=req.body.d;
  cans=req.body.cans;
  if(que_num==''|| que==''|| a==''|| b==''|| c==''|| d==''|| cans=='')
  {
    con.query("select DISTINCT(rid) from subject",function(err,result1){
      if(err) throw err;
      con.query("select DISTINCT(lid) from level",function(err,result2){
        if(err) throw err;
          res.render("admin/question.pug",{message:"problem to insert data!!",dataa:result1,dataaa:result2});
      });
    });
  }
  else
  {
    var sql ="insert into question(rid,lid,questionnumber,question,a,b,c,d,correctanswer) values ('"+rid+"','"+lid+"','"+que_num+"','"+que+"','"+a+"','"+b+"','"+c+"','"+d+"','"+cans+"')";
      con.query(sql, function (err, result) {
          if (err) throw err;
          con.query("select DISTINCT(rid) from subject",function(err,result1){
            if(err) throw err;
            con.query("select DISTINCT(lid) from level",function(err,result2){
              if(err) throw err;
                res.render("admin/question.pug",{message:"Data is successfully inserted!!",data:result,dataa:result1,dataaa:result2});
            });
          });
      });
  }
});

// Question Table Section
admin.get('/que_table',function(req,res){
  var sql = "select * from question";
  con.query(sql, function (err, result, field) {
     if (!err)
        {         
           res.render("admin/question_table.pug" ,{data:result}); 
        }
  }); 
});

//Level Table Delete Section
admin.get('/que_delete/:id',function(req,res){
  id=req.params.id;
  var sql = "DELETE FROM question WHERE id=" + id;
  con.query(sql, function (err, result) {
     if (err) throw err;
        res.redirect("/admin/que_table");
  });
});

//Question table edit section
admin.get("/que_edit/:id",function(req,res){
  id=req.params.id;
  // var sql = "select * FROM question WHERE id=" + id;
  // console.log(sql);
  con.query("select * FROM question WHERE id='"+id+"'", function (err, result1) {
    if (err) throw err;
    con.query("select DISTINCT(rid) from subject", function (err, result2) {
      if (err) throw err;
      con.query("select DISTINCT(lid) from level", function (err, result3) {
        if (err) throw err;
      res.render("admin/question_edit.pug",{data:result1,ridd:result2,lidd:result3});
      });
    });
  });
});

//Question table Update section
admin.post("/update",urlencodeParser,function(req,res){
    id=req.body.xid;
    rid=req.body.rid;
    lid=req.body.lid;
    que_num=req.body.que_num;
    que=req.body.que;
    a=req.body.a;
    b=req.body.b;
    c=req.body.c;
    d=req.body.d;
    cans=req.body.cans;
  console.log(rid);
  var sql="update question set rid= '"+ rid +"',lid='"+ lid +"', questionnumber='"+ que_num +"' , question='"+ que +"', a='"+ a +"', b='"+ b +"', c='"+ c +"', d='"+ d +"', correctanswer='"+ cans +"' where id= " + id ;
  console.log(sql);
  con.query(sql, function (err, result) {
  if (err) throw err;
  res.redirect("/admin/que_table");
  });
});

//Member Table List Section
admin.get('/reg_list',function(req,res){
  var sql = "select * from member";
  con.query(sql, function (err, result, field) {
    if (!err)
    {         
      res.render("admin/member_table.pug" ,{data:result}); 
    }
  }); 
});

//Member Table Delete Section
admin.get('/member_delete/:id',function(req,res){
  id=req.params.id;
  var sql = "DELETE FROM member WHERE id=" + id;
  con.query(sql, function (err, result) {
     if (err) throw err;
        res.redirect("/admin/reg_list");
  });
});


//Logout
admin.get('/logout',function(req,res){
  res.render("admin/admin_login");
});

module.exports = admin;
