var express = require('express');
var nconf = require('nconf');
var moment = require('moment');
var router = express.Router();
var nconf = nconf.file("./settings/settings.json").load();
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
});
module.exports = router;
//# sourceMappingURL=index.js.map