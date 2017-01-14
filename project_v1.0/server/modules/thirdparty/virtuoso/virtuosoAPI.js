'use strict';

var
    path = require('path'),
    taxonomy = {
        rdfs : 'http://www.w3.org/2000/01/rdf-schema#',
        ogc : 'http://www.opengis.net/ont/geosparql#',
        geom : 'http://geovocab.org/geometry#',
        lgdo : 'http://linkedgeodata.org/ontology/',
        lgda : 'http://linkedgeodata.org'
    },
    configPath = path.resolve('../config/server/virtuoso/apiConf'),
    config = require(configPath),
    sparql = require ('sparql');

var query = function (cb) {
    var
        queryString,
        client = new sparql.Client (config.CLIENT_ENDPOINT);

    queryString = "SELECT DISTINCT ?studentSub22 ?titulatura"+
        " WHERE { " +
        " ?persoana foaf:age ?ani ;" +
        " foaf:firstName ?studentSub22" +
        " OPTIONAL { ?persoana foaf:title ?titulatura . }" +
        " FILTER (?ani <= 22)"+
        " }";

    client.query(queryString, function(err,res){
        cb(res.results.bindings);
    });
};

/**
 * Return  a string with vocabularies
 * @param vocabularies - array
 * Ex : vocabularies [rdfs, org]
 */
var getPrefix = function (vocabularies) {
    var
        putPrefix = function (voc) {
            return ' Prefix ' + voc + ': <' + taxonomy[voc] + '>';
        },
        result = '';

    vocabularies.forEach(function (item) {
        result += putPrefix(item);
    });

    return result;
};

/**
 * Query for linkedgeodate
 * @param spec - object
 * position object contain latitude and longitude
 * accuracy number number of meters (default 0.1 <=> 100m)
 * limit number of locations (default 10)
 * cb - callback function
 */
var queryLGD = function(spec){
    var
        vocabularies = ['rdfs', 'ogc', 'geom', 'lgdo'],
        queryString,
        position,
        client,
        prefxs,
        from,
        limit = spec.options.limit || 2,
        accuracy = spec.options.position.accuracy || 0.1;

    client = new sparql.Client(config.SPARQL_ENDPOINT);

    position = spec.options.position;

    //position = {lat:26.1027436 , lng: 44.436139 };  // buresti

    prefxs = getPrefix(vocabularies);
    from = '<' + taxonomy['lgda'] + '>';

    queryString = '' +
            prefxs +
            ' Select * ' +
            ' From' + from + ' {' +
            ' ?s ' +
            ' a lgdo:Amenity ; ' +
            ' rdfs:label ?l ; ' +
            ' geom:geometry [  ogc:asWKT ?g  ] . ' +
            ' Filter(bif:st_intersects (?g, bif:st_point (' + position.lng + ',' +  position.lat + '),' + accuracy + ')) . }' +
            ' limit ' + limit;

    client.query(queryString, function(err,res){
        if(err){
            console.log(err);
        }else{
            spec.cb(res.results.bindings);
        }
    });
};

/**
 * Get locations in a specific language
 * @param cb
 * @param position object contain latitude and longitude
 * @param accuracy number number of meters (default 0.1 <=> 100m)
 * @param limit number of locations (default 10)
 * @param lang language (en,ro,de) default ro
 */
var getLocationsSpecLanguage = function (position, accuracy,limit, lang, cb){
    var locations = {},length, i, ob ={};

    if(!lang){
        lang = "en";
    }
    queryLGD(position,accuracy,limit,function(data){
        length = data.length;

        for(i=0; i<length;i++){
            if(data[i].l['xml:lang']== lang || !data[i].l['xml:lang']){
                var ob = {};
                ob.name = data[i].l.value;
                ob.geo  = data[i].g.value;

                locations[i] =  ob;
                ob = null;
            }
        }
        cb(locations);
    });
};
/**
 * Get locations in a specific language
 * @param cb
 * @param position object contain latitude and longitude
 * @param accuracy number number of meters (default 0.1 <=> 100m)
 * @param limit number of locations (default 10)
 * @param lang language (en,ro,de) default ro
 */

var getLocations = function(position, accuracy,limit, lang, cb){
    getLocationsSpecLanguage(position, accuracy, limit, lang,function(data){
        var i, locations = [], counter= 0, aux="";
        locations[counter] =  ['Lat', 'Lng', 'Name'];

        for(i in data) {
            var ob = [];

            ob[2] = data[i].name;
            // date[i].geo LINESTRING(26.0210877 44.488023,26.021195 44.4877551,26.0206478 44.487648,26.020444 44.48787)
            // date[i].geo POINT(26.1032455 44.4365277)

            aux = data[i].geo;
            aux = aux.split("(");
            aux = aux[1];
            aux = aux.split(",");
            aux = aux[0];
            aux = aux.split(")");
            aux = aux[0];
            aux = aux.split(" ");

            ob[0] = aux[1];
            ob[1] = aux[0];

            locations[++counter] = ob;

            ob = null;
        }

        cb(locations);
    });

};

module.exports = {
    query: query,
    queryTest: queryLGD,
    getLocations : getLocations
};