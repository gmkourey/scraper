var db = require("../models/index.js");
var request = require("request");

module.exports = function(app) {

    app.get("/", function(req, res) {
        
        res.render("index.handlebars");
        
    })

}