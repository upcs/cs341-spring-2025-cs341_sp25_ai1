//express architecture config
var express = require('express');
var router = express.Router();

function selectCollectionName() {
    //TODO tis router is currently hard-coded to return Case_1 for testing purposes
    return "Case_1";
}

//POST response:
router.post('/', function(req, res) {
    collectionName = selectCollectionName();
    
    //hardcoded-for case #1 at the moment
    res.json({"case": collectionName});
});

//I don't know why this here but don't take it out
module.exports = router;
