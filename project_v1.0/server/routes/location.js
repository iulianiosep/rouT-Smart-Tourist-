var
  path = require('path'),
  express = require('express'),
  virtuosoPath = path.resolve('modules/thirdparty/virtuoso/virtuosoAPI'),
  virtuoso = require(virtuosoPath),
  MODULE = 'LOCATION',
  router = express.Router();

router.get('/details', function (req, res, next) {
  var
    callback = function (data) {

      res.send(JSON.stringify({
          data:data
      }
      ));
    },
    options = {
      position: {
        lat: req.param('lat'),
        lng: req.param('lng')
      }
    },
    spec = {
      cb: callback,
      options: options
    };

  virtuoso.queryTest(spec);
});

module.exports = router;
