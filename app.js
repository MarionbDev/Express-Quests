require("dotenv").config();

const express = require("express");

const app = express();

app.use(express.json());

const port = process.env.APP_PORT ?? 5000;

const welcome = (req, res) => {
  res.send("Welcome to my favourite movie list");
};

app.get("/", welcome);

const movieHandlers = require("./movieHandlers");
const userHandlers = require("./userHandlers");
const { validateMovie } = require("./validators");
const { validateUser } = require("./validators");
const {
  hashPassword,
  verifyPassword,
  verifyToken,
  checkTokenId,
} = require("./auth.js");

// the public routes

app.get("/api/movies", movieHandlers.getMovies);
app.get("/api/movies/:id", movieHandlers.getMovieById);
app.get("/api/users", userHandlers.getUser);
app.get("/api/users/:id", userHandlers.getUsersById);

app.post("/api/users", validateUser, hashPassword, userHandlers.postUser);
app.post(
  "/api/login",
  userHandlers.getUserByEmailWithPasswordAndPassToNext,
  verifyPassword
);

// the routes to protect

app.use(verifyToken);

app.post("/api/movies", verifyToken, validateMovie, movieHandlers.postMovie);

app.put(
  "/api/users/:id",
  checkTokenId,
  validateUser,
  hashPassword,
  userHandlers.updateUser
);
app.put("/api/movies/:id", validateMovie, movieHandlers.updateMovie);

app.delete("/api/movies/:id", movieHandlers.deleteMovie);
app.delete("/api/users/:id", checkTokenId, userHandlers.deleteUser);

app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on ${port}`);
  }
});
