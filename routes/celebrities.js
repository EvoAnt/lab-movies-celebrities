var express = require("express");
var router = express.Router();

const Celebrity = require("../models/Celebrity");

router.get("/add-celebrity", (req, res, next) => {
  res.render("celebrities/new-celebrity.hbs");
});

router.post("/add-celebrity", (req, res, next) => {
  let { name, occupation, catchPhrase } = req.body;

  Celebrity.findOne({
    name: name,
  })
    .then((foundCelebrity) => {
      if (foundCelebrity) {
        res.render("celebrities/new-celebrity.hbs", {
          errorMessage: "Celebrity already exists.  Try again",
        });
      } else {
        Celebrity.create({
          name,
          occupation,
          catchPhrase,
        })
          .then((createdCelebrity) => {
            console.log("created celebrity ===>", createdCelebrity);
            res.redirect("/celebrities/all-celebrities");
          })
          .catch((err) => {
            console.log(err);
            next(err);
          });
      }
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
});

router.get("/all-celebrities", (req, res, next) => {
  Celebrity.find()
    .then((celebrities) => {
      console.log("Found celebrities ===>", celebrities);
      res.render("celebrities/celebrities.hbs", { celebrities });
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
});

module.exports = router;
