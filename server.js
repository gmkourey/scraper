//Dependencies
var express = require("express");
var mongoose = require("mongoose");
var request = require("request");
var cheerio = require("cheerio");
var bodyParser = require("body-parser");

//Start express
var app = express();

//Requiring the models created
var db = require("./models");

//Initialize handlebars
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

require("./routes/html-routes.js")(app);

//Use body parser as middleware
app.use(bodyParser.urlencoded({
    extended: false    
})
);

//Connecting with mongoose
mongoose.connect("mongodb://localhost/article_db", { useNewUrlParser: true });

//Initialize use of static files on front end
app.use(express.static("public"));

//Path to scrape articles
app.get("/scrape", function(req, res) {
    request("https://www.nytimes.com/section/technology", function (error, response, html) {

        mongoose.connection.db.dropCollection('articles');

        var $ = cheerio.load(html);

        $("article.story").each(function (i, element) {

            var article = {};

            article.title = $(element).children(".story-body").children(".story-link").children(".story-meta").children(".headline").text().trim();
            
            article.desc = $(element).children(".story-body").children(".story-link").children(".story-meta").children(".summary").text().trim();

            article.link = $(element).children(".story-body").children(".story-link").attr("href");

            article.imageLink = $(element).children(".story-body").children(".story-link").children(".wide-thumb").find("img").attr("src");
            
            if(article.title !== "" && article.desc !== "" && article.link !== "" && article.imageLink !== "") {

            db.Article.create(article)
            .then(function(dbArticle) {
                console.log(dbArticle)
            }).catch(function(error) {
                return res.json(error)
            })
            
            }
        })
    });
    res.json("complete");
});

//Path to view all articles
app.get("/view", function(req, res) {
    db.Article.find({})
    .then(function(dbArticles) {
        res.json(dbArticles);
    })
    .catch(function(error) {
        res.json(error);
    });

});



app.listen(3000, function() {
    console.log("App running on port 3000!");
  });