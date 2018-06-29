var express = require('express'),
    qrcode = require('qr-image'),
    bodyParser = require('body-parser'),
    moment = require('moment');
fs = require('fs');
const _port = 3000;
var app = express();
//On configure le comportement des réponses des requêtes
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
//Permet d'outre passer les sécurité rajouter dans l'entête de chaque requête 
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next(); // Passe la main à la prochaine Erreur
});

app.post('/newcommand', function (req, res) {
    console.log('New command incoming', req.body);
    _storeCommand(JSON.parse(Object.keys(req.body)[0]).details, function (err, ok) {
        if (err)
            res.status(200).send(err)
        else{
            res.status(200).send(ok)
            console.log('Command Stored effectively');
        }
    })
});

app.listen(_port, function () {
    console.log('Server listening on  : ' + _port);
});

function _storeCommand(details, callback) {
    fs.readFile('./server/command/commands.json', 'utf8', function (err, data) {
        if (err) {
            throw err;
        }
        var tab = JSON.parse(data);
        tab.push({
            "nom": details.Nom,
            "prenom": details.Prenom,
            "date": moment().format("DD-MM-YYYY_hh-mm"),
            "details": details
        })

        _writeFile(tab, callback);
    });
}

function _writeFile(tab, callback) {
    fs.writeFile("./server/command/commands.json", JSON.stringify(tab), function (err) {
        if (err)
            callback(err, null)
        else
            callback(null ,'Command Stored');
    });
}