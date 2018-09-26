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

// require("./routes/html-routes.js")(app);

//Use body parser as middleware
app.use(bodyParser.urlencoded({
    extended: false    
})
);

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/article_db";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);


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
app.get("/", function(req, res) {

    db.Article.find({})
    .then(function(dbArticles) {
        res.render("index", {articles: dbArticles});
    })
    .catch(function(error) {
        res.json(error);
    });

});

app.get("/saved", function(req,res) {
    db.Article.find({"saved": true})
    .then(function(dbArticles) {
        res.render("saved", {articles: dbArticles});
    })
        .catch(function(error) {
            res.json(error);
    })
})

app.get("/articles/:id", function(req, res) {

    db.Article.findOne({"_id": req.params.id})
    .populate("note")
    .then(function(dbArticle) {
        res.json(dbArticle)
    })
    .catch(function(error) {
        res.json(error);
    })
})

app.post("/articles/:id", function(req, res) {
    console.log(req.body);
    db.Note.create(req.body)
    .then(function(dbNote) {
        console.log(dbNote._id);
        return db.Article.findOneAndUpdate({ _id: req.params.id}, {$set: {note: dbNote._id }}, { new: true });

    })

    .then(function(dbArticle) {
        console.log(dbArticle);
    res.json(dbArticle);
    })
    .catch(function(error) {
        console.log(error);
        res.json(error);
    })
});

app.put("/articles/:id", function (req, res) {

    var id = mongoose.Types.ObjectId(req.params.id);

    db.Article.findById(id, function (err, article) {
        if (err) return handleError(err);
        if(article.saved === false) {
        article.saved = true;
    } else {
        article.saved = false;
    }
        article.save(function (err, updatedArticle) {
          if (err) return handleError(err);
          res.send(updatedArticle);
        });
      });
})

app.listen(3000, function() {
    console.log("App running on port 3000!");
  });