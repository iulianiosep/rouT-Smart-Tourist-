/**
 * Created by acatr on 1/28/2017.
 */

var
    path = require('path'),
    sparql = require ('sparql'),
    configPath = path.resolve('../config/server/virtuoso/apiConf'),
    config = require(configPath),
    express = require('express'),
    virtuosoPath = path.resolve('modules/thirdparty/virtuoso/virtuosoAPI'),
    virtuoso = require(virtuosoPath),
    MODULE = 'LOCATION',
    router = express.Router();


router.get('/api/select', function(req, res, next){

    client = new sparql.Client(config.DYDRA_ENDPOINT);
    queryString = 'SELECT ?name ?nick WHERE  { ?x foaf:name ?name . ?x foaf:nick ?nick .}';

    var myCallback = function (data) {
        res.send(JSON.stringify({
            data:data
        }));
    };
    client.query(queryString, function(err, res) {
        if (err) {
            console.log(err);
        } else {
            myCallback(res.results.bindings);
        }
    });
});

router.get('/api/insert', function(req, res, next){

    client = new sparql.Client(config.DYDRA_ENDPOINT);
    queryString = 'INSERT DATA { ' + '<' + 'example/users/NodeJsUser4' + '>' + ' foaf:name'
        + ' "NodeJsUser4"' + '; foaf:nick' + ' "NickJs4"' + '.}';

    console.log(queryString);

    var myCallback = function (data) {
        res.send(JSON.stringify({
            data:data
        }));
    };
    client.query(queryString, function(err, res) {
        if (err) {
            console.log(err);
        } else {
            myCallback(res.status, res);
        }
    });
});

router.get('/test', function (req, res, next) {
    res.send(JSON.stringify({
        data: {
            bunica: 'ok'
        }
    }))

});


router.get('/api/groups/:groupName/members', function(req, res, next){

    client = new sparql.Client(config.DYDRA_ENDPOINT);
    groupName = req.params['groupName'];
    groupLink = '<' + config.DYDRA_ENDPOINT + '/groupsRoot/' + groupName + '>'

    queryString = 'SELECT ?member ' +
        'WHERE { ' + groupLink +
        ' rdf:type foaf:Group;' +
        ' foaf:member ?member.' +
        ' }';

    console.log(queryString);

    var myCallback = function (data) {
        members = [];
        data.forEach(function(element){
            members.push(element.member.value);
        });
        res.send(JSON.stringify({
            data:members
        }));
    };
    client.query(queryString, function(err, res) {
        if (err) {
            console.log(err);
        } else {
            myCallback(res.results.bindings);
        }
    });
});

router.get('/api/groups/:groupName/interests', function(req, res, next){

    client = new sparql.Client(config.DYDRA_ENDPOINT);
    groupName = req.params['groupName'];
    groupLink = '<' + config.DYDRA_ENDPOINT + '/groupsRoot/' + groupName + '>'

    queryString = 'SELECT ?interest' +
        ' WHERE { ' + groupLink +
        ' rdf:type foaf:Group;' +
        ' foaf:member ?member.' +
        ' ?member foaf:interest ?interest;' +
        ' }';

    console.log(queryString);

    var myCallback = function (data) {
       interests = [];
       data.forEach(function(element){
       interests.push(element.interest.value);
        });
        res.send(JSON.stringify({
            data: interests
        }));
    };
    client.query(queryString, function(err, res) {
        if (err) {
            console.log(err);
        } else {
            myCallback(res.results.bindings);
        }
    });
});


router.post('/api/groups/addNewGroup', function(req, res, next){

    client = new sparql.Client(config.DYDRA_ENDPOINT);
    groupName = req.body.groupName;
    groupLink = '<' + config.DYDRA_ENDPOINT + '/groupsRoot/' + groupName + '>';

    queryString = 'INSERT DATA { ' + groupLink +
        ' foaf:name "'+ groupName +'";' +
        ' foaf:focus "Travelling";' +
        ' rdf:type foaf:Group.' +
        ' }';

    console.log(req);
    console.log(queryString);

    var myCallback = function () {
        res.status(201);
        res.send(JSON.stringify({
            group: groupLink
        }));
    };
    client.query(queryString, function(err, queryResult) {
        if (err) {
            console.log(err);
        } else {
            myCallback();
        }
    });
});

router.post('/api/groups/:groupName/addPerson', function(req, res, next){

    client = new sparql.Client(config.DYDRA_ENDPOINT);
    groupName = req.params['groupName'];
    personName = req.body.personName;
    groupLink =     '<' + config.DYDRA_ENDPOINT + '/groupsRoot/' + groupName + '>';
    personLink =    '<' + config.DYDRA_ENDPOINT + '/personsRoot/' + personName + '>';

    queryString = 'INSERT DATA { ' + groupLink + ' foaf:member ' + personLink + '. }';

    console.log(queryString);

    var myCallback = function () {
        res.status(201);
        res.send(JSON.stringify({
            group: groupLink
        }));
    };
    client.query(queryString, function(err, queryResult) {
        if (err) {
            console.log(err);
        } else {
            myCallback();
        }
    });
});

router.post('/api/persons/addNewPerson', function(req, res, next){

    client = new sparql.Client(config.DYDRA_ENDPOINT);
    personName = req.body.personName;
    personLink =    '<' + config.DYDRA_ENDPOINT + '/personsRoot/' + personName + '>';

    queryString = 'INSERT DATA { ' + personLink + ' foaf:name "' + personName +'";' +
        ' rdf:type foaf:Person . }';

    console.log(queryString);

    var myCallback = function () {
        res.status(201);
        res.send(JSON.stringify({
            person: personLink
        }));
    };
    client.query(queryString, function(err, queryResult) {
        if (err) {
            console.log(err);
        } else {
            myCallback();
        }
    });
});


router.post('/api/groups/:groupName/addNewPerson', function(req, res, next){

    client = new sparql.Client(config.DYDRA_ENDPOINT);
    personName = req.body.personName;
    groupName = req.params['groupName'];
    personLink =    '<' + config.DYDRA_ENDPOINT + '/personsRoot/' + personName + '>';
    groupLink =     '<' + config.DYDRA_ENDPOINT + '/groupsRoot/' + groupName + '>';

    queryString = 'INSERT DATA { ' + personLink + ' foaf:name "' + personName +'";' +
        ' rdf:type foaf:Person . ' +
        groupLink + ' foaf:member ' + personLink  + ' }';

    console.log(queryString);

    var myCallback = function () {
        res.status(201);
        res.send(JSON.stringify({
            person: personLink
        }));
    };
    client.query(queryString, function(err, queryResult) {
        if (err) {
            console.log(err);
        } else {
            myCallback();
        }
    });
});


router.post('/api/persons/:personName/addInterest', function(req, res, next){

    client = new sparql.Client(config.DYDRA_ENDPOINT);
    personName = req.params['personName'];
    interestName = req.body.interestName;
    personLink =    '<' + config.DYDRA_ENDPOINT + '/personsRoot/' + personName + '>';

    queryString = 'INSERT DATA { ' + personLink + ' foaf:interest "'+ interestName +'" }';

    console.log(queryString);

    var myCallback = function () {
        res.status(201);
        res.send(JSON.stringify({
            person: personLink
        }));
    };
    client.query(queryString, function(err, queryResult) {
        if (err) {
            console.log(err);
        } else {
            myCallback();
        }
    });
});



module.exports = router;
