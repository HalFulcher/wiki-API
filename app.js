// requiring modules

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { render } = require("ejs");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// connect mongoDB database with mongoose

mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// set up model

const articleSchema = {
  title: String,
  content: String,
};

// 'Article' is model

const Article = mongoose.model("Article", articleSchema);

//chained route handlers to /articles

app
  .route("/articles")
  .get(function (req, res) {
    Article.find(function (err, foundItems) {
      // error check

      if (!err) {
        res.send(foundItems);
      }

      // if there are  errors send errors, so we can see what's going on...
      else {
        res.send(err);
      }
    });
  })

  .post(function (req, res) {
    const title = req.body.title;
    const content = req.body.content;

    const newArticle = new Article({
      title: title,
      content: content,
    });
    newArticle.save(function (err) {
      if (!err) {
        res.send("Added a new article");
      } else {
        res.send(err);
      }
    });
  })

  .delete(function (req, res) {
    Article.deleteMany(function (err) {
      if (!err) {
        res.send("Deleted all articles");
      } else {
        res.send(err);
      }
    });
  });

// Get / Find request

app
  .route("/articles/:article")
  .get(function (req, res) {
    Article.findOne(
      { title: req.params.article },
      function (err, foundArticle) {
        if (foundArticle) {
          res.send(foundArticle);
        } else {
          res.send("No matching article found.");
        }
      }
    );
  })

  // Update / Put request

  .put(function (req, res) {
    // CRUD Update method

    Article.replaceOne(
      { title: req.params.article },
      { title: req.body.title, content: req.body.content },
      function (err) {
        if (!err) {
          res.send("Updated article.");
        } else {
          res.send(err);
        }
      }
    );
  })

  // Update / Patch request

  .patch(function (req, res) {
    Article.updateOne(
      { title: req.params.article },
      { $set: req.body },
      function (err) {
        if (!err) {
          res.send("Article value updated");
        } else {
          res.send(err);
        }
      }
    );
  })

  //Delete specific article

  .delete(function (req, res) {
    Article.deleteOne({ title: req.params.article }, function (err) {
      if (!err) {
        res.send("Article value deleted");
      } else {
        res.send(err);
      }
    });
  });

app.listen(3000, function () {
  console.log("Server has started on port 3000");
});
