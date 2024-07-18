var express = require('express');
var mysql = require('mysql2');
var bodyParser = require("body-parser")
var app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(__dirname + "/public"))

var connection = mysql.createConnection({
  host: 'localhost', //host set for local MySQL workbench, replace if needed
  user: 'root', //user set for local MySQL workbench, replace if needed
  password: 'YOUR PASSWORD HERE',
  database: 'mailing_list'
});
 
app.get("/", function(req, res){
    var q = 'SELECT COUNT(*) as count FROM users';
    connection.query(q, function (error, results) {
        if (error) {
            if (error.code === 'PROTOCOL_CONNECTION_LOST') {
                return res.render("connection_error");
            } else {
                return res.render("unkown_error");
            }
        }
        var count = results[0].count;
        res.render("home", {count: count});
    });
});

app.post("/register", function(req, res){
    var person = {
        fname: req.body.fname,
        lname: req.body.lname,
        email: req.body.email
    }
    connection.query('INSERT INTO users SET ?', person, function(err, result) {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.redirect("/duplicate_signup_error");
            } else {
                return res.redirect("/unkown_error");
            }
        }
        res.render("signup_complete", {fname: person.fname, lname:person.lname, email:person.email});
    });
});

app.get("/duplicate_signup_error", function(req, res){
    res.render("duplicate_signup_error");
});

app.get("/unkown_error", function(req, res){
    res.render("unkown_error");
});
 
app.listen(8080, function () {
    console.log('Server running on 8080!');
    console.log('Go to http://localhost:8080 in your browser to get connected!')
});
