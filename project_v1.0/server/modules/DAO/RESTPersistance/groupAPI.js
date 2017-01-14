var
    exports = module.exports = {},
    path = require('path'),
    groupModelPath = path.resolve('../models/group'),
    groupModel = require(groupModelPath);


exports.findGroup = function(spec){
    var data = groupModel.findOne({ }, function(err, group) {
        if (!err) {
            return group;
        } else {
            return false;
        }
    });

    return data;
};

exports.addGroup = function (tripData) {
    var
        data,
        groupBuilder = new groupModel();

    groupBuilder.grupname = tripData.traveller;
    groupBuilder.password = tripData.title;

    data = groupBuilder.save(function (err, groupObj) {
        if (err) {
            res.status(500,"Internal Server Error");;
            res.json({"message": "500 Internal Server Error"});
        } else {
            res.status(201,"CREATED");
            res.json(groupObj);
        }
    });

    return data;
};

