var
    path = require('path'),
    express = require('express'),
    virtuosoPath = path.resolve('modules/thirdparty/virtuoso/virtuosoAPI'),
    virtuoso = require(virtuosoPath),
    MODULE = 'GROUP',
    router = express.Router();

router.get('/data', function(req, res, next) {
    var
        callback = function (data) {
            res.end(JSON.stringify({
                status: data
            }));
        },
        spec = {
            cb : callback
        };

    virtuoso.queryTest(spec);
});

module.exports = router;
