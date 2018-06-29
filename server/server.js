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
    _storeCommand(JSON.parse(Object.keys(req.body)[0]).Details, function (err, ok) {    
        if (err)
            res.status(200).send(err)
        else {
            res.status(200).send(ok)
            console.log('Command Stored effectively');
        }
    })
});

app.get('/getRefList', function (req, res) {
    _getRefList(function (err, list) {
        if (err)
            res.status(200).send(err);
        else {
            if (list.length != 0)
                res.status(200).send(list);
            else
                res.status(200).send([]);

            console.log('List of Command\'s Ref sent');
        }
    })
})
app.get('/getCommandByRef/:ref', function (req, res) {
    // console.log(req.params.ref);
    
    _getCommandByRef(req.params.ref, function (err, data) {
        if (err)
            res.status(200).send(err);
        else {
            res.status(200).send(data);
        }
    });
});

function _getCommandByRef(ref, callback) {
    fs.readFile('./server/command/commands.json', 'utf8', function (err, data) {
        if (err)
            throw err;
        var tab = JSON.parse(data);
        for (let j = 0; j < tab.length; j++) {
            if(tab[j].Details.Reference == ref){
                console.log('Sending '+ref+' details');
                callback(null, tab[j]);
                return;
            }

        }
    });
}
app.listen(_port, function () {
    console.log('Server listening on  : ' + _port);
});

function _storeCommand(details, callback) {
    fs.readFile('./server/command/commands.json', 'utf8', function (err, data) {
        console.log(details);
        if (err)
            throw err;
        var tab = JSON.parse(data);
        tab.push({
            "Nom": details.Nom,
            "Prenom": details.Prenom,
            "Date": moment().format("DD/MM/YYYY - hh:mm"),
            "Details": details
        })

        _writeFile(tab, callback);
    });
}

function _writeFile(tab, callback) {
    fs.writeFile("./server/command/commands.json", JSON.stringify(tab), function (err) {
        if (err)
            callback(err, null)
        else
            callback(null, 'Command Stored');
    });
}

function _getRefList(callback) {
    fs.readFile('./server/command/commands.json', 'utf8', function (err, data) {
        if (err) {
            callback(err, null)
        } else {
            list = [];
            var tab = JSON.parse(data);
            tab.forEach(element => {
                list.push(element.Details.Reference + " - " + element.Nom + ' ' + element.Prenom + ' - ' + element.Date)
            });
            callback(null, list);
        }
    });
}