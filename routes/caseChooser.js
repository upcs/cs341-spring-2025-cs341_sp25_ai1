var express = require('express');
var router = express.Router();

function selectCollectionName() {
    //fix later reiss
    return "Case_1";
}

router.post('/', function(req, res) {
    collectionName = selectCollectionName();
    
    //hardcoded-for case #1 at the moment
    res.json({"case": collectionName});
});

module.exports = router;
