var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var cors = require('cors');
var app = express();

app.use(cors());
app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send("Something Error!");
});

process.on('uncaughtException', function(err) {
    console.log(err);
});



var basicAuth = function(req, res) {

    var auth = [];
   
    if (req.headers.authorization) {
        auth = new Buffer(req.headers.authorization.substring(6), 'base64').toString().split(':');
    }

    if (!auth || auth[0] !== 'admin' || auth[1] !== '1234') {
        res.statusCode = 401;
        res.end('Unauthorized');

    } else {
        res.setHeader('WWW-Authenticate', '');
    }

};



app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.get("/", function(req, res) {
    res.sendFile(__dirname + "/public/index.html");
});

app.get("/design", function(req, res) {
    res.sendFile(__dirname + "/design/index.html");
});
app.get('/admin', function(req, res) {
    res.sendFile(__dirname + "/design/admin.html");
});


// Schema

var mongoose = mongoose.connect("mongodb://localhost/webservice");
var Schema = mongoose.Schema;

var kontakSchema = new Schema({
    name: String,
    title: String,
    email: String,
    phone: String,
    address: String,
    company: String,
    groupby: String
});


var Kontak = mongoose.model("Kontak", kontakSchema);

app.get("/api", function(req, res) {

    basicAuth(req, res);
    Kontak.find({}, function(error, kontak) {
        if (error) {
            res.send("Gagal");
        } else {
            res.json(kontak);
        }
    });
});

app.get("/api/:id", function(req, res) {
    basicAuth(req, res);
    Kontak.find({ "_id": req.params.id }, function(error, kontak) {
        if (error) {
            return res.send(error);
        } else {
            res.json(kontak);
        }
    });
});

app.post("/api", function(req, res) {
    basicAuth(req, res);
    var newKontak = new Kontak({
        name: req.body.name,
        title: req.body.title,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        company: req.body.company,
        groupby: req.body.groupby
    });
    newKontak.save(function(error) {
        if (error) {
            return res.send(error);
        } else {
            res.json(newKontak);
        }
    });
});

app.delete("/api/:id", function(req, res) {
    basicAuth(req, res);
    Kontak.findById(req.params.id, function(error, kontakItem) {
        if (!error) {
            kontakItem.remove(function() {
                res.json({ "id": req.params.id, "status": "deleted" });
            });
        } else {
            res.json({ "id": req.params.id, "status": "not found" });
        }
    });
});

app.put("/api/:id", function(req, res) {
    basicAuth(req, res);
    Kontak.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        title: req.body.title,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        company: req.body.company,
        groupby: req.body.groupby
    }, function(error) {
        if (!error) {
            res.json({ "id": req.params.id, "status": "Updated" });
        } else {
            res.send(error);
        }
    });
});

app.listen(2090);
console.log("API berjalan menggunakan PORT 2090");
console.log("Buka web di port 2090");
