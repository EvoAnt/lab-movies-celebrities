var express = require("express");
var router = express.Router();

const Movies = require("../models/Movies");
const Celebrity = require("../models/Celebrity");

router.get("/add-movie", (req, res, next) => {
  Celebrity.find()
    .then((celebrities) => {
      res.render("movies/new-movie.hbs", { celebrities });
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
});

router.post("/add-movie", (req, res, next) => {
  let newMovie = req.body;

  Movies.create(newMovie)
    .then((newMovie) => {
      console.log("Created movie ===>", newMovie);
      res.redirect("/movies");
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
});

router.get("/", (req, res, next) => {
  Movies.find()
    .then((movies) => {
      res.render("movies/movies.hbs", { movies });
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
});

router.get("/details/:movieId", (req, res, next) => {
  Movies.findById(req.params.movieId)
    .populate("cast")
    .then((movie) => {
      console.log("Found movie ===>", movie);
      res.render("movies/movie-details.hbs", movie);
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
});

router.post("/delete/:moviesId", (req, res, next) => {
  Movies.findByIdAndRemove(req.params.moviesId)
    .then((movie) => {
      console.log("Deleted movie ===>", movie);
      res.redirect("/movies");
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
});

router.get("/edit/:movieId", (req, res, next) => {
    Movies.findById(req.params.movieId)
    // Celebrity.find()
        .populate("cast")
      .then((movie) => {
        console.log("editing movie ===>", movie);
        res.render("movies/edit-movie.hbs", movie);
      })
      .catch((err) => {
        console.log(err);
        next(err);
      });
  });

router.post('/edit/:movieId', (req, res, next) => {
    let movieId = req.params.movieId;
    let {title, genre, plot, cast} = req.body;
    Movies.findByIdAndUpdate(
        movieId, 
        {
            title,
            genre,
            plot,
            cast
    },
    {new: true}
    )
    .then((updatedMovie) => {
        console.log('updated movie ===>', updatedMovie)
        res.redirect(`/movies/details/${updatedMovie._id}`)
    })
    .catch((err) => {
        console.log(err);
        next(err);
      });
});
module.exports = router;
