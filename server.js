var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

var PORT = process.env.PORT || 3002;

var app = express();

app.use(logger("dev"));

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static("public"));

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/bbcNews";

mongoose.connect(MONGODB_URI);

app.get("/scrape", function(req, res){
    axios.get("https://www.bbc.com/").then(function(response){
        var $ = cheerio.load(response.data);

        $("h3.media__title").each(function(i, element){
            var result = {};

            result.title = $(this)
                .children("a")
                .text().trim();
            result.link = "https://www.bbc.com" + $(this)
                .children("a")
                .attr("href");
            result.summary = $(this)
                .parent().children("p")
                .text().trim();

            db.Article.create(result)
                .then(function(dbArticle){
                    console.log(dbArticle);
                })
                .catch(function(){
                    console.log(err);
                });
        });

        res.send("Scrape Finished");
    });
});

app.get("/articles", function(req, res){
    db.Article.find({})
    .then(function(dbArticle){
        res.json(dbArticle);
    })
    .catch(function(err){
        res.json(err);
    });
});

app.get("/articles/:id", function(req,res){
    db.Article.findOne({_id:req.params.id})
    .populate("note")
    .then(function(dbArticle){
        res.json(dbArticle);
    })
    .catch(function(err){
        res.json(err);
    });
});

app.post("/articles/:id", function(req, res){
    db.Note.create(req.body)
    .then(function(dbNote){
        return db.Article.findOneAndUpdate({_id:req.params.id}, {note: dbNote._id}, {new:true})
    })
    .then(function(dbArticle){
        res.json(dbArticle);
    })
    .catch(function(){
        res.json(err);
    });
});

app.listen(PORT, function(){
    console.log(`App running on port ${PORT} !`);
});