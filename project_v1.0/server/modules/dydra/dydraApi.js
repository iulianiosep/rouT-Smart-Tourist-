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

router.post('/api/persons/addNewPerson', function(req, res, next){

    client = new sparql.Client(config.DYDRA_ENDPOINT);
    personName = req.body.personName;
    personLink =    '<' + config.DYDRA_ENDPOINT + '/personsRoot/' + personName + '>';

    queryCheck = 'ASK { ' +  ' ?x rdf:type foaf:Person .' +
            ' ?x foaf:name "' + personName + '" }';

    queryString = 'INSERT DATA { ' + personLink + ' foaf:name "' + personName +'";' +
        ' rdf:type foaf:Person . }';

    console.log(queryCheck);
    console.log(queryString);

    var sendResponse201 = function () {
        res.status(201);
        res.send(JSON.stringify({
            person: personLink
        }));
    };
    var sendResponse409 = function () {
        res.status(409);
        res.send(JSON.stringify({
            reason: 'A Person with given name already exists'
        }));
    };

    client.query(queryCheck, function(err, queryResult) {
        if (err) {
            console.log(err);
        } else {
            if (queryResult.boolean == true){
                sendResponse409();
            }
            else{
                client.query(queryString, function(err) {
                    if(err) {
                        console.log(err);
                    } else {
                        sendResponse201();
                    }
                });
            }
        }
    });
});

router.post('/api/persons/:personName/addInterest', function(req, res, next){

    client = new sparql.Client(config.DYDRA_ENDPOINT);
    personName = req.params['personName'];
    interestName = req.body.interestName;
    personLink =    '<' + config.DYDRA_ENDPOINT + '/personsRoot/' + personName + '>';

    queryCheckPerson = 'ASK { ' +  ' ?x rdf:type foaf:Person .' +
        ' ?x foaf:name "' + personName + '" }';

    queryCheckInterest = 'ASK {  ?x rdf:type foaf:Person . ' +
        ' ?x foaf:name "' + personName + '" . ' +
        ' ?x foaf:interest "' + interestName + '" }';

    queryString = 'INSERT DATA { ' + personLink + ' foaf:interest "'+ interestName +'" }';

    console.log(queryCheckInterest);

    var sendResponse201 = function () {
        res.status(201);
        res.send(JSON.stringify({
            person: personLink
        }));
    };

    var sendResponse404 = function () {
        res.status(404);
        res.send(JSON.stringify({
            reason: 'Person with the given name does not exists'
        }));
    };

    var sendResponse409 = function () {
        res.status(409);
        res.send(JSON.stringify({
            reason: 'The specified Person have already the specified interest'
        }));
    };


    client.query(queryCheckPerson, function(err, queryResult) {
        if (err) {
            console.log(err);
        } else {
            if (queryResult.boolean == false){
                sendResponse404();
            }
            else{
                client.query(queryCheckInterest, function(err, queryResult) {
                    if(err) {
                        console.log(err);
                    } else {
                        if (queryResult.boolean == true){
                            sendResponse409();
                        } else {
                            client.query(queryString, function(err){
                                if(err){
                                    console.log(err);
                                } else {
                                    sendResponse201();
                                }
                            });
                        }
                    }
                });
            }
        }
    });

});

router.post('/api/groups/addNewGroup', function(req, res, next){

    client = new sparql.Client(config.DYDRA_ENDPOINT);
    groupName = req.body.groupName;
    groupLink = '<' + config.DYDRA_ENDPOINT + '/groupsRoot/' + groupName + '>';

    queryCheckGroup = 'ASK {  ?x rdf:type foaf:Group . ?x foaf:name "' + groupName + '" }';

    queryString = 'INSERT DATA { ' + groupLink +
        ' foaf:name "'+ groupName +'";' +
        ' foaf:focus "Travelling";' +
        ' rdf:type foaf:Group.' +
        ' }';

    console.log(queryCheckGroup);
    console.log(queryString);

    var sendResponse201 = function () {
        res.status(201);
        res.send(JSON.stringify({
            group: groupLink
        }));
    };
    var sendResponse409 = function () {
        res.status(409);
        res.send(JSON.stringify({
            reason: 'A Group with given name already exists'
        }));
    };

    client.query(queryCheckGroup, function(err, queryResult) {
        if (err) {
            console.log(err);
        } else {
            if (queryResult.boolean == true){
                sendResponse409();
            }
            else{
                client.query(queryString, function(err) {
                    if(err) {
                        console.log(err);
                    } else {
                        sendResponse201();
                    }
                });
            }
        }
    });
});

router.post('/api/groups/:groupName/addPerson', function(req, res, next) {

    client = new sparql.Client(config.DYDRA_ENDPOINT);
    groupName = req.params['groupName'];
    personName = req.body.personName;
    groupLink = '<' + config.DYDRA_ENDPOINT + '/groupsRoot/' + groupName + '>';
    personLink = '<' + config.DYDRA_ENDPOINT + '/personsRoot/' + personName + '>';

    queryCheckPerson = 'ASK { ' +  ' ?x rdf:type foaf:Person .' +
        ' ?x foaf:name "' + personName + '" }';
    queryCheckMembership = 'ASK {  ?x rdf:type foaf:Person . ' +
        ' ?x foaf:name "' + personName + '" .' +
        groupLink + ' foaf:member ?x }';
    queryCheckGroup = 'ASK {  ?x rdf:type foaf:Group . ?x foaf:name "' + groupName + '" }';
    queryString = 'INSERT DATA { ' + groupLink + ' foaf:member ' + personLink + '. }';

    console.log(queryString);

    var sendResponse201 = function () {
        res.status(201);
        res.send(JSON.stringify({
            person: personLink
        }));
    };

    var sendResponse404 = function (resourceName) {
        res.status(404);
        res.send(JSON.stringify({
            reason: resourceName +  ' with the given name does not exists'
        }));
    };

    var sendResponse409 = function () {
        res.status(409);
        res.send(JSON.stringify({
            reason: 'A Person with given name is already a member of the specified Group'
        }));
    };

    client.query(queryCheckGroup, function (err, queryResult) {
        if (err) {
            console.log(err);
        } else {
            if (queryResult.boolean == true) {
                client.query(queryCheckPerson, function(err, queryResult){
                    if(err){
                        console.log(err);
                    } else {
                        if(queryResult.boolean == false){
                            sendResponse404('Person');
                        } else {
                            client.query(queryCheckMembership, function (err, queryResult) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    if (queryResult.boolean == true) {
                                        sendResponse409();
                                    }
                                    else {
                                        client.query(queryString, function (err) {
                                            if (err) {
                                                console.log(err);
                                            } else {
                                                sendResponse201();
                                            }
                                        });
                                    }
                                }
                            });
                        }
                    }
                })
            }
            else {
                sendResponse404('Group');
            }
        }
    });
});

router.post('/api/groups/:groupName/addNewPerson', function(req, res, next){
    client = new sparql.Client(config.DYDRA_ENDPOINT);
    groupName = req.params['groupName'];
    personName = req.body.personName;
    groupLink = '<' + config.DYDRA_ENDPOINT + '/groupsRoot/' + groupName + '>';
    personLink = '<' + config.DYDRA_ENDPOINT + '/personsRoot/' + personName + '>';

    queryCheckPerson = 'ASK { ' +  ' ?x rdf:type foaf:Person .' +
        ' ?x foaf:name "' + personName + '" }';
    queryCheckMembership = 'ASK {  ?x rdf:type foaf:Person . ' +
        ' ?x foaf:name "' + personName + '" .' +
        groupLink + ' foaf:member ?x }';
    queryCheckGroup = 'ASK {  ?x rdf:type foaf:Group . ?x foaf:name "' + groupName + '" }';
    queryString = 'INSERT DATA { ' + groupLink + ' foaf:member ' + personLink + ' .  ' +
        personLink + ' foaf:name "' + personName +'" . ' +
        personLink + ' rdf:type foaf:Person  . }';

    console.log(queryString);

    var sendResponse201 = function () {
        res.status(201);
        res.send(JSON.stringify({
            person: personLink
        }));
    };

    var sendResponse404 = function (resourceName) {
        res.status(404);
        res.send(JSON.stringify({
            reason: resourceName +  ' with the given name does not exists'
        }));
    };

    var sendResponse409 = function () {
        res.status(409);
        res.send(JSON.stringify({
            reason: 'A Person with given name already exists'
        }));
    };

    client.query(queryCheckGroup, function (err, queryResult) {
        if (err) {
            console.log(err);
        } else {
            if (queryResult.boolean == true) {
                client.query(queryCheckPerson, function(err, queryResult){
                    if(err){
                        console.log(err);
                    } else {
                        if(queryResult.boolean == true){
                            sendResponse409();
                        } else {
                            client.query(queryString, function (err) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    sendResponse201();
                                }
                            });
                        }
                    }
                });
            } else {
                sendResponse404('Group');
            }
        }
    })
});

router.get('/api/groups/:groupName/members', function(req, res, next){

    client = new sparql.Client(config.DYDRA_ENDPOINT);
    groupName = req.params['groupName'];
    groupLink = '<' + config.DYDRA_ENDPOINT + '/groupsRoot/' + groupName + '>'

    queryCheckGroup = 'ASK {  ?x rdf:type foaf:Group . ?x foaf:name "' + groupName + '" }';

    queryCheckGroup = 'ASK {  ?x rdf:type foaf:Group . ?x foaf:name "' + groupName + '" }';

    queryString = 'SELECT ?member ' +
        'WHERE { ' + groupLink +
        ' rdf:type foaf:Group;' +
        ' foaf:member ?member.' +
        ' }';

    console.log(queryString);

    var sendResponse200 = function (data) {
        members = [];
        data.forEach(function(element){
            members.push(element.member.value);
        });
        res.status(200);
        res.send(JSON.stringify({
            data: members
        }));
    };

    var sendResponse404 = function () {
        res.status(404);
        res.send(JSON.stringify({
            reason: 'Group Not found'
        }));
    };


    client.query(queryCheckGroup, function(err, queryResult) {
        if (err) {
            console.log(err);
        } else {
            if (queryResult.boolean == false){
                sendResponse404();
            }
            else{
                client.query(queryString, function(err, res) {
                    if (err) {
                        console.log(err);
                    } else {
                        sendResponse200(res.results.bindings);
                    }
                });
            }
        }
    });



});


router.get('/api/groups/:groupName/interests', function(req, res, next){

    client = new sparql.Client(config.DYDRA_ENDPOINT);
    groupName = req.params['groupName'];
    groupLink = '<' + config.DYDRA_ENDPOINT + '/groupsRoot/' + groupName + '>'

    queryCheckGroup = 'ASK {  ?x rdf:type foaf:Group . ?x foaf:name "' + groupName + '" }';

    queryString = 'SELECT ?interest' +
        ' WHERE { ' + groupLink +
        ' rdf:type foaf:Group;' +
        ' foaf:member ?member.' +
        ' ?member foaf:interest ?interest;' +
        ' }';

    console.log(queryString);

    var sendResponse200 = function (data) {
       interests = [];
       data.forEach(function(element){
       interests.push(element.interest.value);
        });
       res.status(200);
        res.send(JSON.stringify({
            data: interests
        }));
    };

    var sendResponse404 = function () {
        res.status(404);
        res.send(JSON.stringify({
            reason: 'Group Not found'
        }));
    };

    client.query(queryCheckGroup, function(err, queryResult) {
        if (err) {
            console.log(err);
        } else {
            if (queryResult.boolean == false){
                sendResponse404();
            }
            else{
                client.query(queryString, function(err, res) {
                    if (err) {
                        console.log(err);
                    } else {
                        sendResponse200(res.results.bindings);
                    }
                });
            }
        }
    });

});



module.exports = router;
