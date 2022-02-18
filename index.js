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
    response.sendFile(path.join(__dirname + '/user_login.html'));
});

app.post('/auth', function(request, response) {
    var username = request.body.username;
    var password = request.body.password;
    if (username && password) {
        connection.query('SELECT * FROM userlogin WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
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
    var rr = "<html>";
    rr = rr + "<body>";
    rr = rr + "<form  method='post' action='submission' >";
    rr = rr + "user name" + "<input type='text' name='name' value=' '> <br> <br>";
    rr = rr + "source " + "<input type='text' name='source' value=' '> <br> <br>";
    rr = rr + "destination" + "<input type='text' name='destination' value=' '> <br> <br>";
    rr = rr + " amount" + "<input type='number' name='noofticket' value=' '> <br> <br>";
    rr = rr + "<input type='submit' align='center' name='t1' value='Save '>";
    rr = rr + "</form>";
    rr = rr + "</body>";
    res.send(rr);
})

app.post('/submission', urlencodedParser, function(req, res) {
    var reply = '';
    sname = req.body.name;
    source = req.body.source;
    destination = req.body.destination;
    noofticket = req.body.noofticket ;
    var sql = " insert into details(name,source,destination,noofticket) values('" + sname + "','" + source + "','" + destination + "'," + noofticket + ")";

    connection.query(sql, function(err, result) {
        if (err) throw err;
        //res.end("Record inserted");
        res.redirect('display');
    });

});
app.get('/display', function(req, res) {

    connection.query('select * from details ORDER BY name DESC LIMIT 1;', function(err, result) {
        if (err) throw err;
        res.send(result)
        console.log(result)
    });
});




app.listen(4060);