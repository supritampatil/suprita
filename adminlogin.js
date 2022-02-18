var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: true });
var path = require('path');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nodeeva'
});

var app = express();
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', function(request, response) {
    response.sendFile(path.join(__dirname + '/admin_login.html'));
});

app.post('/auth', function(request, response) {
    var username = request.body.username;
    var password = request.body.password;
    if (username && password) {
        connection.query('SELECT * FROM adminlogin WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
            if (results.length > 0) {
                request.session.loggedin = true;
                request.session.username = username;
                response.redirect('/success');
            } else {
                response.send('Incorrect Username and/or Password!');
            }
            response.end();
        });
    } else {
        response.send('Please enter Username and Password!');
        response.end();
    }
});
app.get('/success', function(req, res) {
    var rr="<html>";
    rr = rr+"<body>";
    rr=rr+"<form  method='post' action='/next' >";
    rr = rr+"<center><input type='submit' name='t4' value='Remove flight booking person whose amount. is less than 500 '></center>";
    rr = rr+"</form>";
    rr = rr+"</body>";
    

    res.send(rr);
})


app.post('/next', urlencodedParser, function (req, res){

    var sql1="DELETE from details where noofticket<500";
    
  connection.query(sql1, function (err, result) {
   if (err) throw err; 
    console.log("rec deleted");
          });
       res.write("Deleted"); 
       
       connection.query('select * from details ORDER BY name ASC', function(err, result) {
        if (err) throw err;
        res.send(result)
        console.log(result)
    })
       res.send();
  
   })

app.get('/su', function(req, res) {

    connection.query('select * from details ORDER BY name ASC', function(err, result) {
        if (err) throw err;
        res.send(result)
        console.log(result)
    })


});
app.listen(4070);