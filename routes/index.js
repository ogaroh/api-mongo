var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.status(200).json({ status: "success", data: { message: "Welcome to API Mongo." } })
});

router.post('/', (req, res) => {
  res.send('You can post to this endpoint');
})

module.exports = router;
